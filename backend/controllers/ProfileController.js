import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { imageValidator, uploadImage, removeImage, getImageUrl } from '../utils/helper.js';

const prisma = new PrismaClient();

class ProfileController {
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;
      const authUserId = req.user.user_id || req.user.id;
      const id = parseInt(userId, 10);

      console.log('getUserProfile - userId:', userId, 'authUserId:', authUserId);

      if (authUserId !== id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      const user = await prisma.user.findUnique({
        where: { user_id: id },
        include: {
          userdomain: { include: { domain: true } },
        },
      });

      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      const avatarUrl = user.profile_image ? getImageUrl(user.profile_image) : null;

      let roleSpecificData = {};

      switch (user.role) {
        case 'STUDENT': {
          const studentData = await prisma.student.findFirst({
            where: { user_id: id },
            include: {
              department: true,
              teamapplication: { include: { team: true } },
            },
          });

          if (studentData) {
            roleSpecificData = {
              roll_number: studentData.roll_number,
              department: studentData.department,
              applications: studentData.teamapplication,
            };
          }

          const studentTeams = await prisma.teammember.findMany({
            where: { user_id: id },
            include: { team: { include: { domain: true } } },
          });
          roleSpecificData.teams = studentTeams;
          break;
        }

        case 'TEACHER': {
          const teacherData = await prisma.teacher.findFirst({
            where: { user_id: id },
            include: {
              department: true,
              reviewer: true, // optional relation; kept for completeness
            },
          });

          if (teacherData) {
            roleSpecificData = {
              designation: teacherData.designation,
              department: teacherData.department,
              isReviewer: teacherData.isReviewer,
            };
          }

          const teacherTeams = await prisma.team.findMany({
            where: { created_by_user_id: id },
            include: { domain: true, teammember: true },
          });
          roleSpecificData.teams = teacherTeams;
          break;
        }

        case 'REVIEWER': {
          const reviewerTeacher = await prisma.teacher.findFirst({
            where: { user_id: id, isReviewer: true },
            include: {
              department: true,
              reviewer: true, 
            },
          });

          if (reviewerTeacher) {
            roleSpecificData = {
              designation: reviewerTeacher.designation,
              department: reviewerTeacher.department,
              isReviewer: reviewerTeacher.isReviewer,
            };
          }
          break;
        }

        case 'ADMIN': {
          const adminData = await prisma.admin.findFirst({ where: { user_id: id } });
          roleSpecificData = {
            isMainAdmin: user.isMainAdmin,
            adminData,
          };
          break;
        }
      }

      return res.status(200).json({
        success: true,
        profile: {
          ...user,
          profile_image: avatarUrl,
          ...roleSpecificData,
          domains: user.userdomain.map((ud) => ud.domain),
        },
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user profile',
        details: error.message,
      });
    }
  }

  static async getUserPreferences(req, res) {
    try {
      const { userId } = req.params;
      const authUserId = req.user.user_id || req.user.id;
      const id = parseInt(userId, 10);

      console.log('Getting preferences for user:', userId, 'Auth user:', authUserId);

      if (authUserId !== id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      const user = await prisma.user.findUnique({
        where: { user_id: id },
        include: {
          userdomain: {
            include: { domain: true },
          },
        },
      });

      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      let roleSpecificPreferences = {};

      switch (user.role) {
        case 'STUDENT': {
          const student = await prisma.student.findFirst({
            where: { user_id: id },
            include: { department: true },
          });
          if (student) {
            roleSpecificPreferences = {
              department_id: student.department_id,
              roll_number: student.roll_number,
            };
          }
          break;
        }

        case 'TEACHER':
        case 'REVIEWER': {
          const teacher = await prisma.teacher.findFirst({
            where: { user_id: id },
            include: {
              department: true,
              reviewer: true, 
            },
          });
          if (teacher) {
            roleSpecificPreferences = {
              department_id: teacher.department_id,
              designation: teacher.designation,
              willing_to_review: teacher.isReviewer,
            };
          }
          break;
        }

        case 'ADMIN': {
          const admin = await prisma.admin.findFirst({ where: { user_id: id } });
          if (admin) {
            roleSpecificPreferences = { admin_role: 'System Administrator' };
          }
          break;
        }
      }

      const preferences = {
        name: user.name,
        email: user.email,
        ...roleSpecificPreferences,
        selected_domains: user.userdomain.map((ud) => ud.domain_id),
      };

      console.log('Returning preferences:', preferences);

      return res.status(200).json({ success: true, preferences });
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user preferences',
        details: error.message,
      });
    }
  }

  static async uploadAvatar(req, res) {
    try {
      const { userId } = req.params;
      const parsedUserId = parseInt(userId, 10);

      console.log('Avatar upload for user:', parsedUserId);
      console.log('Files received:', req.files ? Object.keys(req.files) : 'No files');

      if (isNaN(parsedUserId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID provided' });
      }

      const authUserId = req.user.user_id || req.user.id;
      if (authUserId !== parsedUserId && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      if (!req.files || !req.files.avatar) {
        return res.status(400).json({ success: false, error: 'No avatar file provided' });
      }

      const avatar = req.files.avatar;
      const validation = imageValidator(avatar.size, avatar.mimetype);
      if (validation) {
        return res.status(400).json({ success: false, error: validation });
      }

      let imagePath;
      await prisma.$transaction(async (tx) => {
        const currentUser = await tx.user.findUnique({ where: { user_id: parsedUserId } });
        if (!currentUser) throw new Error('User not found');

        if (currentUser.profile_image) {
          try {
            removeImage(currentUser.profile_image);
          } catch (e) {
            console.warn('Failed to remove old image:', e?.message);
          }
        }

        const imageName = uploadImage(avatar);
        imagePath = `images/${imageName}`;

        await tx.user.update({
          where: { user_id: parsedUserId },
          data: { profile_image: imagePath },
        });

        console.log('Avatar uploaded successfully:', imageName);
      });

      const imageUrl = getImageUrl(imagePath);
      res.set('Cache-Control', 'no-store');

      return res.json({
        success: true,
        message: 'Avatar updated successfully',
        image_url: imageUrl,
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload avatar',
      });
    }
  }

  static async updateUserPreferences(req, res) {
    try {
      const { userId } = req.params;
      const parsedUserId = parseInt(userId, 10);
      if (isNaN(parsedUserId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID provided' });
      }

      const authUserId = req.user.user_id || req.user.id;
      if (authUserId !== parsedUserId && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      const data = req.body || {};
      const {
        name,
        password,
        confirmPassword,
        department_id,
        roll_number,
        designation,
        selected_domains,
      } = data;

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
        }
        if (password !== confirmPassword) {
          return res.status(400).json({ success: false, error: 'Passwords do not match' });
        }
      }

      if (selected_domains !== undefined) {
        if (!Array.isArray(selected_domains) || selected_domains.length < 3) {
          return res.status(400).json({
            success: false,
            error: 'At least 3 research domains are required',
          });
        }
      }

      const hasAnyChange =
        (typeof name === 'string' && name.trim().length > 0) ||
        password ||
        department_id !== undefined ||
        roll_number !== undefined ||
        designation !== undefined ||
        selected_domains !== undefined;

      if (!hasAnyChange) {
        return res.status(400).json({ success: false, error: 'No changes provided' });
      }

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { user_id: parsedUserId } });
        if (!user) throw new Error('User not found');

        const userUpdate = {};
        if (typeof name === 'string' && name.trim()) {
          userUpdate.name = name.trim();
        }
        if (password) {
          userUpdate.password = await bcrypt.hash(password, 12);
        }
        if (Object.keys(userUpdate).length > 0) {
          await tx.user.update({ where: { user_id: parsedUserId }, data: userUpdate });
        }

        if (user.role === 'STUDENT' && (department_id !== undefined || roll_number !== undefined)) {
          const deptId = department_id !== undefined ? parseInt(department_id, 10) : undefined;

          const baseData = {};
          if (deptId !== undefined && !Number.isNaN(deptId)) baseData.department_id = deptId;
          if (roll_number !== undefined) baseData.roll_number = roll_number || null;

          if (Object.keys(baseData).length > 0) {
            const updated = await tx.student.updateMany({
              where: { user_id: parsedUserId },
              data: baseData,
            });
            if (updated.count === 0) {
              await tx.student.create({ data: { user_id: parsedUserId, ...baseData } });
            }
          }
        } else if ((user.role === 'TEACHER' || user.role === 'REVIEWER') &&
                   (department_id !== undefined || designation !== undefined)) {
          const deptId = department_id !== undefined ? parseInt(department_id, 10) : undefined;

          const baseData = {};
          if (deptId !== undefined && !Number.isNaN(deptId)) baseData.department_id = deptId;
          if (designation !== undefined) baseData.designation = designation?.trim() || null;

          if (Object.keys(baseData).length > 0) {
            const updated = await tx.teacher.updateMany({
              where: { user_id: parsedUserId },
              data: baseData,
            });
            if (updated.count === 0) {
              await tx.teacher.create({ data: { user_id: parsedUserId, ...baseData } });
            }
          }
        }

        if (selected_domains !== undefined) {
          await tx.userdomain.deleteMany({ where: { user_id: parsedUserId } });
          if (Array.isArray(selected_domains) && selected_domains.length > 0) {
            await tx.userdomain.createMany({
              data: selected_domains.map((domainId) => ({
                user_id: parsedUserId,
                domain_id: parseInt(domainId, 10),
              })),
            });
          }
        }
      });

      return res.json({ success: true, message: 'Preferences updated successfully' });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update preferences',
      });
    }
  }

  static async getDepartments(req, res) {
    try {
      const departments = await prisma.department.findMany({
        orderBy: { department_name: 'asc' },
      });
      return res.status(200).json({ success: true, departments });
    } catch (error) {
      console.error('Error fetching departments:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch departments',
        details: error.message,
      });
    }
  }

  static async getDomains(req, res) {
    try {
      const domains = await prisma.domain.findMany({
        orderBy: { domain_name: 'asc' },
      });
      return res.status(200).json({ success: true, domains });
    } catch (error) {
      console.error('Error fetching domains:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch domains',
        details: error.message,
      });
    }
  }

  static async getDomainsByDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      console.log('Fetching domains for department:', departmentId);

      const rows = await prisma.departmentdomain.findMany({
        where: { department_id: parseInt(departmentId, 10) },
        include: { domain: true },
      });

      const domains = rows.map((r) => r.domain).filter(Boolean);
      console.log('Found domains for department', departmentId, ':', domains.length);

      return res.status(200).json({
        success: true,
        domains,
        departmentId: parseInt(departmentId, 10),
      });
    } catch (error) {
      console.error('Error fetching department domains:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch department domains',
        details: error.message,
      });
    }
  }
}

export default ProfileController;
