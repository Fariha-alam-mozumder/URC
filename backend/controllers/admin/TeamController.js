// controllers/admin/TeamController.js
import prisma from "../../DB/db.config.js";
import { Vine } from "@vinejs/vine";

class AdminTeamController {
  //! List all teams (for admin dashboard - cards view)
  static async index(req, res) {
    try {
      const teams = await prisma.team.findMany({
        include: {
          domain: true,
          teammember: { include: { user: true } },
          paper: true,
          proposal: true,
          teamcomment: true,
        },
        orderBy: { created_at: "desc" },
      });

      const formattedTeams = teams.map((team) => ({
        id: team.team_id,
        name: team.team_name,
        desc: team.team_description,
        category: team.domain?.domain_name || "Uncategorized",
        status: team.status,
        membersCount: team.teammember.length,
        firstThreeMembers: team.teammember.slice(0, 3).map((m) => ({
          id: m.user_id,
          name: m.user?.name,
        })),
        createdAt: team.created_at,
      }));

      return res.json({ success: true, teams: formattedTeams });
    } catch (error) {
      console.error("Error fetching teams:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch teams" });
    }
  }

  //! Get single team details (for AdminTeamDetails.jsx)
  static async show(req, res) {
    try {
      const { id } = req.params;
      const team = await prisma.team.findUnique({
        where: { team_id: parseInt(id) },
        include: {
          domain: true,
          teammember: { include: { user: true } },
          paper: true,
          proposal: true,
          teamcomment: {
            include: { user: true },
            orderBy: { created_at: "desc" },
          },
        },
      });

      if (!team) {
        return res
          .status(404)
          .json({ success: false, message: "Team not found" });
      }

      const formattedTeam = {
        id: team.team_id,
        name: team.team_name,
        desc: team.team_description,
        category: team.domain?.domain_name || "Uncategorized",
        status: team.status,
        members: team.teammember.map((m) => ({
          id: m.user_id,
          name: m.user?.name,
          email: m.user?.email,
          role: m.role_in_team,
        })),
        files: {
          papers: team.paper.map((p) => ({ id: p.paper_id, title: p.title })),
          proposals: team.proposal.map((p) => ({
            id: p.proposal_id,
            title: p.title,
          })),
        },
        comments: team.teamcomment.map((c) => ({
          id: c.teamcomment_id,
          text: c.comment,
          author: c.user?.name,
          createdAt: c.created_at,
        })),
        settings: {
          visibility: team.visibility?.toLowerCase(),
          maxMembers: team.max_members,
          allowApps: team.isHiring,
        },
        createdAt: team.created_at,
      };

      return res.json({ success: true, team: formattedTeam });
    } catch (error) {
      console.error("Error fetching team details:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch team details" });
    }
  }
}

export default AdminTeamController;
