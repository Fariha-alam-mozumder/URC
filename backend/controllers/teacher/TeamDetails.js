import db from "../../DB/db.config.js";
import redis from "../../DB/redis.config.js";
import { Vine, errors } from "@vinejs/vine";


class TeamDetails {
  // GET /api/teams/my-teams
  static async index(req, res) {
    try {
      const userId = req.user?.user_id; // from auth middleware
      if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
      }

      const teams = await db.team.findMany({
        where: {
          teammember: {
            some: { user_id: Number(userId) }
          }
        },
        include: {
          domain: true,
          created_by_user: {
            select: { user_id: true, name: true, email: true }
          },
          teammember: {
            select: {
              user_id: true,
              role_in_team: true,
              user: { select: { name: true, email: true } }
            }
          },
          _count: { select: { teammember: true } }
        },
        orderBy: { created_at: "desc" }
      });

      if (!teams.length) {
        return res.status(200).json({ message: "No teams found", data: [] });
      }

      return res.status(200).json({ data: teams });
    } catch (error) {
      console.error("Error fetching teams:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  //get team by id
  static async getTeamById(req, res) {
    try {
      const teamId = Number(req.params.id);
      if (!teamId) {
        return res.status(400).json({ message: "Invalid team ID" });
      }

      const team = await db.team.findUnique({
        where: { team_id: teamId },
        include: {
          domain: true, // if you want domain details
          created_by_user: {
            select: { user_id: true, name: true, email: true },
          },
          teammember: {
            select: {              // <-- changed include to select here
              role_in_team: true,
              user: {
                select: {
                  user_id: true,
                  name: true,
                },
              },
            },
          },
          _count: { select: { teammember: true } },
          // optionally include documents, comments etc if your schema supports it
        },
      });

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      return res.status(200).json({ data: team });
    } catch (error) {
      console.error("Error fetching team details:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }


  // Get proposals by team id
static async getProposalsByTeamId(req, res) {
  try {
    const teamId = Number(req.params.id);
    if (!teamId) {
      return res.status(400).json({ message: "Invalid team ID" });
    }

    const proposals = await db.proposal.findMany({
      where: { team_id: teamId },
      select: {
        proposal_id: true,
        title: true,
        pdf_path: true,
        created_at: true,
        file_size: true,
        status: true, // optional, in case you want to show proposal status
      },
      orderBy: { created_at: "desc" },
    });

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ message: "No proposals found for this team" });
    }

    return res.status(200).json({ data: proposals });
  } catch (error) {
    console.error("Error fetching proposals by team id:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
}
export default TeamDetails;
