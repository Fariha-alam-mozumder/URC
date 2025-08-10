import db from "../DB/db.config.js";
import { teamSchema } from "../validations/teamValidation.js";
import redis from "../DB/redis.config.js";
import vine, { errors } from "@vinejs/vine";
import { fileValidator, uploadFile } from "../utils/helper.js";
import { proposalValidator } from "../validations/proposalValidation.js";

class TeamController {
  static async store(req, res) {
    if (req.body.members && typeof req.body.members === "string") {
      try {
        req.body.members = JSON.parse(req.body.members);
      } catch (err) {
        return res.status(400).json({ error: "Invalid members JSON format" });
      }
    }
    console.log("members type:", typeof req.body.members);
    console.log("members value:", req.body.members);

    try {
      // Validate team info and members JSON string
      const payload = await vine.validate({
        schema: teamSchema,
        data: req.body,
      });

      // Parse members JSON string
      const members = payload.members || [];

      // Create team
      const team = await db.team.create({
        data: {
          team_name: payload.team_name,
          team_description: payload.team_description || "",
          domain_id: payload.domain_id ? Number(payload.domain_id) : null,
          status: payload.status || "RECRUITING",
          visibility: payload.visibility || "PUBLIC",
          max_members: payload.max_members ? Number(payload.max_members) : null,
          isHiring: payload.isHiring || false,
          created_by_user_id: req.user.user_id,
        },
      });

      // Add members to team
      for (const member of members) {
        await db.teammember.create({
          data: {
            team_id: team.team_id,
            user_id: Number(member.user_id),
            role_in_team: member.role_in_team,
          },
        });
      }

      const file = req.files?.file || req.files?.proposal;

      if (file) {
        try {
          fileValidator(10, file.mimetype)(file);
        } catch (e) {
          return res.status(400).json({ errors: { proposal: e.message } });
        }

        // Upload PDF file
        const pdf_path = await uploadFile(file, true, "pdf");

        // Save proposal record linked to team
        await db.proposal.create({
          data: {
            title: payload.proposal_title || `${team.team_name} - Proposal`,
            abstract: payload.proposal_abstract || "",
            team_id: team.team_id,
            pdf_path,
            submitted_by: req.user.user_id,
          },
        });
      }

      // Clear Redis cache - use await and catch error
      try {
        await redis.del("/api/teams");
        console.log("Redis cache cleared for /api/teams");
      } catch (err) {
        console.error("Redis cache clear error:", err);
      }

      return res.status(201).json({
        status: 201,
        message: "Team created successfully",
        data: team,
      });
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return res.status(422).json({ errors: err.messages });
      }
      console.error("Team creation error:", err);
      console.log("Error: ", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default TeamController;

// import db from '../DB/db.config.js'
// import vine, { errors } from '@vinejs/vine'
// import { validateTeam } from '../validations/teamValidation.js'
// import { imageValidator, uploadImage } from '../utils/helper.js'
// import redis from '../config/redis.js'
// import fs from 'fs'

// class TeamController {
//   async store(req, res) {
//     try {
//       // ✅ Validate input
//       const body = await vine.validate({
//         schema: validateTeam,
//         data: req.body,
//       })

//       const proposalFile = req.files?.proposal

//       // ✅ Validate file (only pdfs)
//       if (proposalFile) {
//         const mime = proposalFile.mimetype
//         const size = proposalFile.size
//         imageValidator(size, mime, true) // pass true for generic file
//       }

//       // ✅ Upload file
//       let uploadedFilePath = null
//       if (proposalFile) {
//         uploadedFilePath = await uploadImage(proposalFile, true)
//       }

//       // ✅ Create team
//       const team = await db.team.create({
//         data: {
//           name: body.name,
//           description: body.description,
//           domain_id: parseInt(body.domain_id),
//           max_members: parseInt(body.max_members),
//           isHiring: body.isHiring,
//           visibility: body.visibility,
//           status: body.status,
//           created_by: req.user.id,

//           proposal: {
//             create: {
//               title: body.proposal_title,
//               abstract: body.proposal_abstract,
//               file_url: uploadedFilePath,
//             },
//           },
//         },
//       })

//       // ✅ Add members
//       const members = JSON.parse(body.members) // must be sent as a JSON string
//       for (const member of members) {
//         await db.teamMember.create({
//           data: {
//             team_id: team.id,
//             user_id: parseInt(member.user_id),
//             role_in_team: member.role_in_team,
//           },
//         })
//       }

//       // ✅ Clear related Redis cache if needed
//       await redis.del('teams:all')

//       return res.status(201).json({
//         success: true,
//         message: 'Team created successfully',
//         data: team,
//       })
//     } catch (err) {
//       if (err instanceof errors.E_VALIDATION_ERROR) {
//         return res.status(422).json({
//           success: false,
//           errors: err.messages,
//         })
//       }

//       console.error('Team creation error:', err)
//       return res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//       })
//     }
//   }
// }

// export default new TeamController()
