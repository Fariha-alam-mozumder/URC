import db from "../../DB/db.config.js";
import redis from "../../DB/redis.client.js";
import { userTeamsKey, teamDetailsKey } from "../../utils/cacheKeys.js";
import { Vine, errors } from "@vinejs/vine";

class TeamDetails {
  // GET /api/teams/my-teams
  static async index(req, res) {
    try {
      const userId = req.user?.user_id; // from auth middleware
      if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
      }

      //* try cache
      const cacheKey = userTeamsKey(userId);
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res
          .status(200)
          .json({ data: JSON.parse(cached), fromCache: true });
      }

      const teams = await db.team.findMany({
        where: {
          teammember: {
            some: { user_id: Number(userId) },
          },
        },
        include: {
          domain: true,
          created_by_user: {
            select: { user_id: true, name: true, email: true },
          },
          teammember: {
            select: {
              user_id: true,
              role_in_team: true,
              user: { select: { name: true, email: true } },
            },
          },
          _count: { select: { teammember: true } },
        },
        orderBy: { created_at: "desc" },
      });

      if (!teams.length) {
        //* Cache empty result to prevent cache miss storms
        await redis.setex(cacheKey, 30, JSON.stringify([]));
        return res.status(200).json({ message: "No teams found", data: [] });
      }
      //* cache result for 30 seconds
      await redis.setex(cacheKey, 30, JSON.stringify(teams)); // 30s TTL
      return res.status(200).json({ data: teams, fromCache: false });
    } catch (error) {
      console.error("Error fetching teams:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  // get team by id
  static async getTeamById(req, res) {
    try {
      const teamId = Number(req.params.id);
      if (!teamId) {
        return res.status(400).json({ message: "Invalid team ID" });
      }
      //* Check cache first
      const cacheKey = teamDetailsKey(teamId);
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res
          .status(200)
          .json({ data: JSON.parse(cached), fromCache: true });
      }

      const team = await db.team.findUnique({
        where: { team_id: teamId },
        include: {
          domain: true,
          created_by_user: {
            select: { user_id: true, name: true, email: true },
          },
          teammember: {
            select: {
              role_in_team: true,
              user: {
                select: { user_id: true, name: true, email: true },
              },
            },
          },
          proposal: {
            select: {
              proposal_id: true,
              title: true,
              pdf_path: true,
              created_at: true,
              file_size: true,
              status: true,
            },
            orderBy: { created_at: "desc" },
          },
          paper: {
            select: {
              paper_id: true,
              title: true,
              pdf_path: true,
              created_at: true,
              file_size: true,
              status: true,
            },
            orderBy: { created_at: "desc" },
          },
          _count: { select: { teammember: true } },
        },
      });

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      // Map DB data to frontend-friendly format
      const teamCardData = {
        id: team.team_id,
        title: team.team_name || "Untitled Team",
        created: team.created_at
          ? new Date(team.created_at).toLocaleDateString()
          : null,
        description: team.team_description || "",
        status: team.status || "UNKNOWN",
        members: team._count.teammember || 0,
        createdBy: team.created_by_user?.name || "Unknown",
        creatorEmail: team.created_by_user?.email || "",
        teammembers: team.teammember.map((m) => ({
          user_id: m.user.user_id,
          name: m.user.name,
          email: m.user.email,
          role_in_team: m.role_in_team,
        })),
        proposals: team.proposal.map((p) => ({
          id: p.proposal_id,
          title: p.title,
          pdf_path: p.pdf_path,
          created_at: p.created_at,
          file_size: p.file_size,
          status: p.status,
        })),
        papers: team.paper.map((p) => ({
          id: p.paper_id,
          title: p.title,
          pdf_path: p.pdf_path,
          created_at: p.created_at,
          file_size: p.file_size,
          status: p.status,
        })),
      };

      //* Cache the result for 30 seconds
      await redis.setex(cacheKey, 30, JSON.stringify(teamCardData)); // 30s TTL
      return res.status(200).json({ data: teamCardData, fromCache: false });
    } catch (error) {
      console.error("Error fetching team details:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  // Add this inside TeamController class
  static async addMembersToTeam(req, res) {
    try {
      const teamId = Number(req.params.id);
      if (!teamId) return res.status(400).json({ error: "Invalid team ID" });

      const { members } = req.body;
      if (!Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: "Members array is required" });
      }

      // Validate roles
      const ROLE_ENUM = ["LEAD", "RESEARCHER", "ASSISTANT"];
      for (const m of members) {
        if (!m.user_id) {
          return res
            .status(400)
            .json({ error: "Each member must have a user_id" });
        }
        const role = (m.role_in_team || "RESEARCHER").toUpperCase();
        if (!ROLE_ENUM.includes(role)) {
          return res
            .status(422)
            .json({ error: `Invalid role "${role}" for user ${m.user_id}` });
        }
        m.role_in_team = role;
      }

      // Check if team exists
      const team = await db.team.findUnique({ where: { team_id: teamId } });
      if (!team) return res.status(404).json({ error: "Team not found" });

      // Add members to team
      const addedMembers = [];
      for (const m of members) {
        // Skip if user is already a member
        const existing = await db.teammember.findFirst({
          where: { team_id: teamId, user_id: Number(m.user_id) },
        });
        if (existing) continue;

        const tm = await db.teammember.create({
          data: {
            team_id: teamId,
            user_id: Number(m.user_id),
            role_in_team: m.role_in_team,
          },
        });
        addedMembers.push(tm);
      }

      // Clear Redis cache
    //   try {
    //     await redis.del("/api/teams");
    //   } catch (err) {
    //     console.error("Redis clear:", err);
    //   }

     //* Invalidate affected caches
 try {
   await redis.del(teamDetailsKey(teamId));
   // Invalidate "my teams" for each newly added member
   for (const m of addedMembers) {
     await redis.del(userTeamsKey(Number(m.user_id)));
   }
 } catch (err) {
   console.error("Redis invalidate error:", err);
 }

      return res.status(201).json({
        message: "Members added successfully",
        data: addedMembers,
      });
    } catch (err) {
      console.error("addMembersToTeam error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // // Get proposals by team id
  // static async getProposalsByTeamId(req, res) {
  //     try {
  //         const teamId = Number(req.params.id);
  //         if (!teamId) {
  //             return res.status(400).json({ message: "Invalid team ID" });
  //         }

  //         const proposals = await db.proposal.findMany({
  //             where: { team_id: teamId },
  //             select: {
  //                 proposal_id: true,
  //                 title: true,
  //                 pdf_path: true,
  //                 created_at: true,
  //                 file_size: true,
  //                 status: true, // optional, in case you want to show proposal status
  //             },
  //             orderBy: { created_at: "desc" },
  //         });

  //         if (!proposals || proposals.length === 0) {
  //             return res.status(404).json({ message: "No proposals found for this team" });
  //         }

  //         return res.status(200).json({ data: proposals });
  //     } catch (error) {
  //         console.error("Error fetching proposals by team id:", error);
  //         return res.status(500).json({ message: "Server error", error: error.message });
  //     }
  // }
}
export default TeamDetails;
