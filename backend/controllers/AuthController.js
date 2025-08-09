import prisma from "../DB/db.config.js";
import { Vine, errors } from "@vinejs/vine";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";
import logger from "../config/logger.js";

const vine = new Vine();

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      //! Check if email exists
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

      //! Encrypt the password
      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      //! Generate verification token
      const verifyToken = crypto.randomBytes(32).toString("hex");

      //! Department lookup
      let departmentId = null;
      if (payload.department_name) {
        let department = await prisma.department.findUnique({
          where: { department_name: payload.department_name },
        });

        if (!department) {
          department = await prisma.department.create({
            data: { department_name: payload.department_name },
          });
        }

        departmentId = department.department_id;
      }

      //! Create user record (common data) with verifyToken and isVerified false
      const newUser = await prisma.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role,
          isVerified: false,
          verifyToken,
        },
      });

      //! Create role-specific entry
      if (payload.role === "STUDENT") {
        await prisma.student.create({
          data: {
            roll_number: payload.roll_number,
            department_id: departmentId,
            user_id: newUser.user_id,
          },
        });
      } else if (payload.role === "TEACHER") {
        await prisma.teacher.create({
          data: {
            designation: payload.designation,
            department_id: departmentId,
            user_id: newUser.user_id,
          },
        });
      } else if (payload.role === "GENERALUSER") {
        await prisma.generaluser.create({
          data: {
            user_id: newUser.user_id,
          },
        });
      }

      //! Send verification email via email queue
      const verifyLink = `${process.env.APP_URL}/api/auth/verify/${verifyToken}`;
      const emailJobPayload = [
        {
          toEmail: payload.email,
          subject: "Please verify your email",
          body: `
            <p>Hello ${payload.name || "User"},</p>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${verifyLink}">Verify your email</a>
            <p>If you did not create this account, please ignore this email.</p>
          `,
        },
      ];

      await emailQueue.add(emailQueueName, emailJobPayload);

      return res.json({
        status: 200,
        message:
          "Registration successful! Please check your email to verify your account.",
        user: newUser,
      });
    } catch (error) {
      console.log("The error is", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        logger.error("Register error:", error);
        return res.status(400).json({
          errors: error.messages,
        });
      }
      console.error("Register error:", error);
      return res
        .status(500)
        .json({ error: "Something went wrong. Please try again." });
    }
  }

  //! Email verification handler
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const user = await prisma.user.findFirst({
        where: { verifyToken: token },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired verification token." });
      }

      await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          isVerified: true,
        },
      });

      res.redirect("http://localhost:5173/login?verified=true");
      //res.redirect("http://localhost:5173/login"); 
 
    } catch (err) {
    console.error(err);
    res.status(400).send("Invalid or expired verification token.");
  }
  }

  //! LOGIN
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

      //! Block login if user is not verified
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

export default AuthController;
