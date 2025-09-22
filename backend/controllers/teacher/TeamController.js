// controllers/TeamController.js
import db from "../../DB/db.config.js";
import { Vine, errors } from "@vinejs/vine";
import { fileValidator, uploadFile } from "../../utils/helper.js";
import { teamSchema } from "../../validations/teacher/teamValidation.js";

const vine = new Vine();
// FIXED: Use the correct enum values from Prisma schema
const ROLE_ENUM = ["LEAD", "RESEARCHER", "ASSISTANT"];

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (v === "1" || v === 1) return true;
  if (v === "0" || v === 0) return false;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
}

function toNum(v) {
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

class TeamController {
  static async creatorContext(req, res) {
    try {
      const userId = Number(req.user.id);

      // Find teacher dept
      const teacher = await db.teacher.findFirst({
        where: { user_id: userId },
        select: { department_id: true },
      });
      const department_id = teacher?.department_id ?? null;

      // Domains tied to this user (preferred)
      let userDomains = await db.userdomain.findMany({
        where: { user_id: userId },
        include: { domain: { select: { domain_id: true, domain_name: true } } },
      });

      // Fallback: if user has no userdomain rows, use dept's domains
      if ((!userDomains || userDomains.length === 0) && department_id) {
        const deptDomains = await db.departmentdomain.findMany({
          where: { department_id },
          include: {
            domain: { select: { domain_id: true, domain_name: true } },
          },
        });
        userDomains = deptDomains.map((dd) => ({ domain: dd.domain }));
      }

      const domains = (userDomains || []).map((ud) => ud.domain);
      return res.json({ department_id, domains });
    } catch (e) {
      console.error("creatorContext error:", e);
      return res.status(500).json({ error: "Failed to load creator context" });
    }
  }

  static async store(req, res) {
    try {
      const body = { ...req.body };

      if (typeof body.members === "string") {
        try {
          body.members = JSON.parse(body.members);
        } catch {
          return res.status(400).json({ error: "Invalid members JSON format" });
        }
      }

      if (body.domain_id !== undefined) body.domain_id = toNum(body.domain_id);
      if (body.max_members !== undefined)
        body.max_members = toNum(body.max_members);
      if (body.isHiring !== undefined) body.isHiring = toBool(body.isHiring);
      if (typeof body.status === "string")
        body.status = body.status.toUpperCase();
      if (typeof body.visibility === "string")
        body.visibility = body.visibility.toUpperCase();
      if (!Array.isArray(body.members)) body.members = [];

      // Normalize & validate role_in_team
      body.members = body.members.map((m) => {
        let role =
          typeof m.role_in_team === "string"
            ? m.role_in_team.toUpperCase()
            : "RESEARCHER";
        if (!ROLE_ENUM.includes(role)) {
          throw new errors.E_VALIDATION_ERROR([
            {
              field: "members.role_in_team",
              rule: "enum",
              message: `The selected role_in_team "${role}" is invalid. Allowed: ${ROLE_ENUM.join(
                ", "
              )}`,
            },
          ]);
        }
        return {
          ...m,
          role_in_team: role,
        };
      });

      const validator = vine.compile(teamSchema);
      const payload = await validator.validate(body);
      console.log("Validated payload:", payload);

      let team;
      try {
        // Create team with proper field mapping
        team = await db.team.create({
          data: {
            team_name: payload.team_name,
            team_description: payload.team_description || "",
            domain_id: payload.domain_id ?? null,
            // Ensure these match Prisma enum values exactly
            status: payload.status || "RECRUITING", // TeamStatus enum
            visibility: payload.visibility || "PUBLIC", // TeamVisibility enum
            max_members: payload.max_members ?? null,
            isHiring: payload.isHiring || false,
            created_by_user_id: Number(req.user.id),
            // created_at is auto-generated
          },
        });
        console.log("Team created:", team);

        // Add creator as a member first
        await db.teammember.create({
          data: {
            team_id: team.team_id,
            user_id: Number(req.user.id),
            role_in_team: "LEAD", // TeamRole enum value
          },
        });
        console.log(`Added creator ${req.user.id} as LEAD`);

        // Add additional members
        if (Array.isArray(payload.members)) {
          for (const member of payload.members) {
            await db.teammember.create({
              data: {
                team_id: team.team_id,
                user_id: Number(member.user_id),
                role_in_team: member.role_in_team, // Already validated above
              },
            });
            console.log(
              `Added member ${member.user_id} with role ${member.role_in_team}`
            );
          }
        }
      } catch (dbErr) {
        console.error("DB operation failed:", dbErr);
        // Log the specific error details
        if (dbErr.code) {
          console.error("Prisma error code:", dbErr.code);
        }
        if (dbErr.meta) {
          console.error("Prisma error meta:", dbErr.meta);
        }
        throw dbErr;
      }

      // Handle file upload (proposal)
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);
      console.log("req.files:", req.files);

      const file =
        req.files?.proposal || req.files?.file || req.files?.proposalFile;

      if (file) {
        // Verify user is a teacher before creating proposal
        const teacher = await db.teacher.findFirst({
          where: { user_id: Number(req.user.id) },
          select: { teacher_id: true },
        });

        if (!teacher) {
          return res
            .status(400)
            .json({ error: "Submitting user is not a teacher" });
        }

        try {
          // ✅ FIX: validate using the new helper signature
          // Validates type (PDF/DOC/DOCX) and size (default 50MB)
          fileValidator(file);
        } catch (e) {
          return res.status(400).json({ errors: { proposal: e.message } });
        }

        const pdf_path = await uploadFile(file, true, "pdf");
        console.log("Proposal data payload:", {
          title: payload.proposal_title,
          abstract: payload.proposal_abstract,
          domain_id: payload.domain_id,
        });

        await db.proposal.create({
          data: {
            title: payload.proposal_title || `${team.team_name} - Proposal`,
            abstract: payload.proposal_abstract,
            pdf_path,
            file_size: file.size,
            status: "PENDING", // PaperStatus enum
            // Relations
            team: {
              connect: { team_id: team.team_id }, // connect to existing team
            },
            teacher: {
              connect: { teacher_id: teacher.teacher_id }, // connect to existing teacher
            },
            // created_at is auto-generated
          },
        });
      }

      return res.status(201).json({
        status: 201,
        message: "Team created successfully",
        data: team,
      });
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR)
        return res.status(422).json({ errors: err.messages });

      console.error("Team creation error:", err);

      // More specific error handling
      if (err.code === "P2002") {
        return res
          .status(400)
          .json({ error: "Duplicate entry - team name or constraint violation" });
      }
      if (err.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Foreign key constraint violation" });
      }
      if (err.code === "P2025") {
        return res.status(400).json({ error: "Record not found" });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ... rest of your methods remain the same
  static async getPotentialTeamMembers({
    departmentId,
    creatorUserId,
    domainIds,
    includeAllDepts = false,
    teamDomainId = null,
  }) {
    // 1) Dept
    let deptId = departmentId ?? null;
    if (!deptId && !includeAllDepts) {
      if (!creatorUserId)
        throw new Error("departmentId or creatorUserId required");
      const creatorTeacher = await db.teacher.findFirst({
        where: { user_id: creatorUserId },
        select: { department_id: true },
      });
      if (!creatorTeacher?.department_id)
        throw new Error("Teacher or department not found for this user.");
      deptId = creatorTeacher.department_id;
    }

    // 2) Domain set
    let domIds = Array.isArray(domainIds) ? domainIds : [];
    if (teamDomainId) {
      domIds = [Number(teamDomainId)];
    }


    if (domIds.length === 0 && creatorUserId) {
      const ownDomains = await db.userdomain.findMany({
        where: { user_id: creatorUserId },
        select: { domain_id: true },
      });
      domIds = ownDomains.map((d) => d.domain_id);
    }

    // 3) Build domain filter if any
    const domainFilter =
      domIds && domIds.length
        ? { user: { userdomain: { some: { domain_id: { in: domIds } } } } }
        : {};

    // 4) Students + Teachers in dept (+ domain filter) with domain information
    const students = await db.student.findMany({
      where: {
        ...(includeAllDepts ? {} : (deptId ? { department_id: deptId } : {})),
        ...domainFilter,
      },
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
            email: true,
            role: true,
            userdomain: {
              include: {
                domain: {
                  select: {
                    domain_id: true,
                    domain_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const teachers = await db.teacher.findMany({
      where: {
        ...(includeAllDepts ? {} : (deptId ? { department_id: deptId } : {})),
        ...(creatorUserId ? { NOT: { user_id: creatorUserId } } : {}),
        ...domainFilter,
      },
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
            email: true,
            role: true,
            userdomain: {
              include: {
                domain: {
                  select: {
                    domain_id: true,
                    domain_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Helper function to get matching domains
    const getMatchingDomains = (userDomains) => {
      if (!domIds || domIds.length === 0) return [];

      const userDomainIds = userDomains.map((ud) => ud.domain.domain_id);
      return userDomains
        .filter((ud) => domIds.includes(ud.domain.domain_id))
        .map((ud) => ud.domain.domain_name);
    };

    // Format the response with domain information
    const formatUser = (userRecord) => ({
      user_id: userRecord.user.user_id,
      name: userRecord.user.name,
      email: userRecord.user.email,
      role: userRecord.user.role,
      domains: userRecord.user.userdomain.map((ud) => ud.domain.domain_name),
      matchingDomains: getMatchingDomains(userRecord.user.userdomain),
    });

    return [...students.map(formatUser), ...teachers.map(formatUser)];
  }

  static async listMembers(req, res) {
    try {
      const departmentId = req.query.departmentId ? Number(req.query.departmentId) : null;
      const includeAllDepts = String(req.query.includeAllDepts || "").toLowerCase() === "true";
      const teamDomainId = req.query.teamDomainId ? Number(req.query.teamDomainId) : null;
      const creatorUserId = req.query.creatorUserId
        ? Number(req.query.creatorUserId)
        : null;
      const domainIdsParam = req.query.domainIds;
      const domainIds = domainIdsParam
        ? String(domainIdsParam)
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => !Number.isNaN(n))
        : [];

      if (req.query.departmentId && Number.isNaN(departmentId))
        return res.status(400).json({ error: "departmentId must be a number" });
      if (Number.isNaN(creatorUserId))
        return res
          .status(400)
          .json({ error: "creatorUserId must be a number" });

      const members = await TeamController.getPotentialTeamMembers({
        departmentId,
        creatorUserId,
        domainIds,
        includeAllDepts,
        teamDomainId,
      });

      return res.json({ data: members, fromCache: false });
    } catch (e) {
      const message =
        typeof e?.message === "string" ? e.message : "Failed to load members";
      const status = /required|not found|must be/i.test(message) ? 400 : 500;
      return res.status(status).json({ error: message });
    }
  }

}

export default TeamController;
