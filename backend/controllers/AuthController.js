import prisma from "../DB/db.config.js";
import { Vine, errors } from "@vinejs/vine";
import { registerSchema, loginSchema, validateRollNumber } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";
import logger from "../config/logger.js";

const vine = new Vine();

// In-memory storage for pending registrations (use Redis in production)
const pendingRegistrations = new Map();

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      //! Check if email already exists in database
      const findUser = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (findUser) {
        return res.status(400).json({
          errors: {
            email: "Email already taken. Please use another one.",
          },
        });
      }

      //! Check if email is already pending verification
      const existingPending = Array.from(pendingRegistrations.values()).find(
        reg => reg.email === payload.email
      );
      if (existingPending) {
        return res.status(400).json({
          errors: {
            email: "Registration already pending for this email. Please check your email or wait before trying again.",
          },
        });
      }

      //! Additional roll number validation for students
      if (payload.role === "STUDENT" && payload.roll_number) {
        // Check roll number format
        const rollNumberError = validateRollNumber(payload.roll_number, payload.department_name);
        if (rollNumberError) {
          return res.status(400).json({
            errors: {
              roll_number: rollNumberError,
            },
          });
        }

        // Check if roll number already exists in database
        const existingStudent = await prisma.student.findFirst({
          where: {
            roll_number: payload.roll_number
          }
        });

        if (existingStudent) {
          return res.status(400).json({
            errors: {
              roll_number: "This roll number is already taken.",
            },
          });
        }

        // Check if roll number is pending verification
        const existingPendingRoll = Array.from(pendingRegistrations.values()).find(
          reg => reg.roll_number === payload.roll_number
        );
        if (existingPendingRoll) {
          return res.status(400).json({
            errors: {
              roll_number: "This roll number is already pending verification.",
            },
          });
        }
      }

      //! Encrypt the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(payload.password, salt);

      //! Generate verification token
      const verifyToken = crypto.randomBytes(32).toString("hex");

      //! Store registration data temporarily (not in database yet)
      const registrationData = {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role,
        department_name: payload.department_name,
        roll_number: payload.roll_number,
        designation: payload.designation,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
      };

      pendingRegistrations.set(verifyToken, registrationData);

      //! Send verification email
      const verifyLink = `${process.env.APP_URL}/api/auth/verify/${verifyToken}`;
      const emailJobPayload = [
        {
          toEmail: payload.email,
          subject: "Please verify your email to complete registration",
          body: `
          <p>Hello ${payload.name || "User"},</p>
          <p>Thank you for registering. Please verify your email by clicking the link below to complete your account creation:</p>
          <a href="${verifyLink}">Verify your email and activate account</a>
          <p><strong>Important:</strong> Your account will not be created until you click this verification link.</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create this account, please ignore this email.</p>
        `,
        },
      ];

      try {
        console.log("Adding email job to queue...");
        await emailQueue.add(emailQueueName, emailJobPayload);
        console.log("Email job added successfully");

        return res.json({
          status: 200,
          message: "Please check your email to verify and complete your registration.",
          emailSent: true,
          note: "Your account will be created only after email verification."
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        logger.error("Email sending failed:", emailError);

        // Remove from pending since email failed
        pendingRegistrations.delete(verifyToken);

        return res.status(500).json({
          status: 500,
          message: "Failed to send verification email. Please try again.",
          emailSent: false,
          emailError: true,
        });
      }
    } catch (error) {
      console.log("The error is", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        logger.error("Register validation error:", error);
        return res.status(400).json({
          errors: error.messages,
        });
      }
      console.error("Register error:", error);
      return res.status(500).json({
        error: "Something went wrong. Please try again.",
        registrationFailed: true,
      });
    }
  }

  //! Email verification handler - Creates user in database upon verification
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      // Check if token exists in pending registrations
      const registrationData = pendingRegistrations.get(token);

      if (!registrationData) {
        return res.status(400).send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h2 style="color: #dc3545;">Invalid or Expired Verification Link</h2>
              <p>This verification link is invalid or has expired.</p>
              <p>Please try registering again.</p>
              <a href="http://localhost:5173/signup" style="color: #007bff;">Go to Registration</a>
            </body>
          </html>
        `);
      }

      // Check if registration has expired (24 hours)
      if (new Date() > registrationData.expiresAt) {
        pendingRegistrations.delete(token);
        return res.status(400).send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h2 style="color: #dc3545;">Verification Link Expired</h2>
              <p>This verification link has expired. Please register again.</p>
              <a href="http://localhost:5173/signup" style="color: #007bff;">Go to Registration</a>
            </body>
          </html>
        `);
      }

      // Double-check if email or roll number was taken by someone else while pending
      const findUser = await prisma.user.findUnique({
        where: { email: registrationData.email },
      });
      if (findUser) {
        pendingRegistrations.delete(token);
        return res.status(400).send(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h2 style="color: #dc3545;">Email Already Registered</h2>
              <p>This email address has been registered by someone else while you were verifying.</p>
              <p>Please try with a different email address.</p>
              <a href="http://localhost:5173/signup" style="color: #007bff;">Go to Registration</a>
            </body>
          </html>
        `);
      }

      if (registrationData.role === "STUDENT" && registrationData.roll_number) {
        const existingStudent = await prisma.student.findFirst({
          where: { roll_number: registrationData.roll_number }
        });
        if (existingStudent) {
          pendingRegistrations.delete(token);
          return res.status(400).send(`
            <html>
              <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h2 style="color: #dc3545;">Roll Number Already Taken</h2>
                <p>This roll number has been registered by someone else while you were verifying.</p>
                <p>Please contact support if you believe this is an error.</p>
                <a href="http://localhost:5173/signup" style="color: #007bff;">Go to Registration</a>
              </body>
            </html>
          `);
        }
      }

      //! Now create the user in database
      let departmentId = null;
      if (registrationData.department_name) {
        let department = await prisma.department.findUnique({
          where: { department_name: registrationData.department_name },
        });

        if (!department) {
          department = await prisma.department.create({
            data: { department_name: registrationData.department_name },
          });
        }

        departmentId = department.department_id;
      }

      // Create user record
      const newUser = await prisma.user.create({
        data: {
          name: registrationData.name,
          email: registrationData.email,
          password: registrationData.password,
          role: registrationData.role,
          isVerified: true, // Mark as verified since they clicked the link
        },
      });

      // Create role-specific entry
      if (registrationData.role === "STUDENT") {
        await prisma.student.create({
          data: {
            roll_number: registrationData.roll_number,
            department_id: departmentId,
            user_id: newUser.user_id,
          },
        });
      } else if (registrationData.role === "TEACHER") {
        await prisma.teacher.create({
          data: {
            designation: registrationData.designation,
            department_id: departmentId,
            user_id: newUser.user_id,
          },
        });
      } else if (registrationData.role === "GENERALUSER") {
        await prisma.generaluser.create({
          data: {
            user_id: newUser.user_id,
          },
        });
      }

      // Remove from pending registrations
      pendingRegistrations.delete(token);

      // Redirect to login with success message
      res.redirect("http://localhost:5173/login?verified=true&registered=true");
    } catch (err) {
      console.error("Email verification error:", err);
      res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #dc3545;">Verification Failed</h2>
            <p>An error occurred during verification. Please try registering again.</p>
            <a href="http://localhost:5173/signup" style="color: #007bff;">Go to Registration</a>
          </body>
        </html>
      `);
    }
  }

  //! LOGIN - No changes needed
  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);

      // Check if email exists
      const findUser = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (!findUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = bcrypt.compareSync(payload.password, findUser.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: {
            email: "Invalid Credentials.",
          },
        });
      }

      //! This check is no longer needed since users are only created after verification
      // But keeping it for safety
      if (!findUser.isVerified) {
        return res
          .status(401)
          .json({ error: "Please verify your email before logging in." });
      }

      // Issue token to user
      const payloadData = {
        id: findUser.user_id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
        isEmailVerified: findUser.isVerified,
      };

      const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.status(200).json({
        success: true,
        message: `${findUser.role} Login successful`,
        token,
        user: {
          id: findUser.user_id,
          name: findUser.name,
          email: findUser.email,
          role: findUser.role,
          isMainAdmin: findUser.isMainAdmin,
          isEmailVerified: findUser.isVerified,
        },
      });
    } catch (error) {
      console.log("The error is", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        return res.status(500).json({
          status: 500,
          error: "Something went wrong. Please try again.",
        });
      }
    }
  }

  // Helper method to clean up expired pending registrations
  static cleanupExpiredRegistrations() {
    const now = new Date();
    for (const [token, data] of pendingRegistrations.entries()) {
      if (now > data.expiresAt) {
        pendingRegistrations.delete(token);
      }
    }
  }
  static async switchRole(req, res) {
    try {
      const userId = req.user.id; // from auth middleware
      const { newRole } = req.body;

      if (!["TEACHER", "REVIEWER"].includes(newRole)) {
        return res.status(400).json({ error: "Invalid role to switch." });
      }

      // Fetch user with related teacher info (if exists)
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      if (user.role === newRole) {
        return res.status(400).json({ error: `Already in role ${newRole}.` });
      }

      // Fetch teacher record for this user
      const teacherRecord = await prisma.teacher.findFirst({
        where: { user_id: userId },
      });

      // Check if switching to REVIEWER is allowed
      if (newRole === "REVIEWER") {
        if (!teacherRecord || teacherRecord.isReviewer === false) {
          return res.status(403).json({
            error:
              "User is not authorized to switch to REVIEWER role. Must be a teacher marked as reviewer.",
          });
        }
      }

      // If switching back to TEACHER, no extra check needed

      // Update user role in DB
      await prisma.user.update({
        where: { user_id: userId },
        data: {
          role: newRole,
        },
      });

      // Issue new JWT token with updated role
      const payloadData = {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: newRole,
        emailVerified: !!user.isVerified,
        isMainAdmin: !!user.isMainAdmin,
      };

      const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.status(200).json({
        success: true,
        message: `Role switched to ${newRole} successfully.`,
        token,
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: newRole,
          isMainAdmin: user.isMainAdmin,
          emailVerified: !!user.isVerified,
        },
      });
    } catch (error) {
      console.error("SwitchRole error:", error);
      return res.status(500).json({
        error: "Something went wrong while switching roles.",
      });
    }
  }


  static async switchRole(req, res) {
    try {
      const userId = req.user.id; // from auth middleware
      const { newRole } = req.body;

      if (!["TEACHER", "REVIEWER"].includes(newRole)) {
        return res.status(400).json({ error: "Invalid role to switch." });
      }

      // Fetch user with related teacher info (if exists)
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      if (user.role === newRole) {
        return res.status(400).json({ error: `Already in role ${newRole}.` });
      }

      // Fetch teacher record for this user
      const teacherRecord = await prisma.teacher.findFirst({
        where: { user_id: userId },
      });

      // Check if switching to REVIEWER is allowed
      if (newRole === "REVIEWER") {
        if (!teacherRecord || teacherRecord.isReviewer === false) {
          return res.status(403).json({
            error:
              "User is not authorized to switch to REVIEWER role. Must be a teacher marked as reviewer.",
          });
        }
      }

      // If switching back to TEACHER, no extra check needed

      // Update user role in DB
      await prisma.user.update({
        where: { user_id: userId },
        data: {
          role: newRole,
        },
      });

      // Issue new JWT token with updated role
      const payloadData = {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: newRole,
        emailVerified: !!user.isVerified,
        isMainAdmin: !!user.isMainAdmin,
      };

      const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.status(200).json({
        success: true,
        message: `Role switched to ${newRole} successfully.`,
        token,
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: newRole,
          isMainAdmin: user.isMainAdmin,
          emailVerified: !!user.isVerified,
        },
      });
    } catch (error) {
      console.error("SwitchRole error:", error);
      return res.status(500).json({
        error: "Something went wrong while switching roles.",
      });
    }
  }

  /*/* Send test Email
  static async sendTestEmail(req, res) {
    try {
      const { email } = req.query;
      const payload = [
        {
          toEmail: email,
          subject: "Hi I am just testing",
          body: "<h1>Hello World!</h1>",
        },
        {
          toEmail: email,
          subject: "You got an amazing offer",
          body: "<h1>Hello Tushar! You got this amazing offer</h1>",
        },
        {
          toEmail: email,
          subject: "You got an amazing offer",
          body: "<h1>Hello Tushu! You got this amazing offer</h1>",
        },
      ];
      await emailQueue.add(emailQueueName, payload);

      return res.json({
        status: 200,
        message: "Job added successfully",
      });
    } catch (error) {
      logger.error({
        type: "Email error",
        body: error,
      });

      return res
        .status(500)
        .json({ error: "Something went wrong. Please try again." });
    }
  }*/

}

// Clean up expired registrations every hour
setInterval(() => {
  AuthController.cleanupExpiredRegistrations();
}, 60 * 60 * 1000);

export default AuthController;