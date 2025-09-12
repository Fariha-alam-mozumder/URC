import db from "../../DB/db.config.js";
import redis from "../../DB/redis.client.js";
import { userTeamsKey, teamDetailsKey } from "../../utils/cacheKeys.js";
import { Vine, errors } from "@vinejs/vine";


class TeamDetails {
    // GET /api/teams/my-teams
    static async index(req, res) {
        try {
            const userId = req.user?.user_id;
            if (!userId) return res.status(400).json({ message: "User ID not found" });

            const cacheKey = userTeamsKey(userId);
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.status(200).json({ data: JSON.parse(cached), fromCache: true });
            }

            const team = await db.team.findMany({
                where: { teammember: { some: { user_id: Number(userId) } } },
                include: {
                    domain: true,
                    created_by_user: { select: { user_id: true, name: true, email: true } },
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

            // FIX: check the right variable
            if (!team.length) {
                await redis.setex(cacheKey, 30, JSON.stringify([]));
                return res.status(200).json({ message: "No teams found", data: [] });
            }

            // Return raw field names the UI already uses
            const teams = team.map((t) => ({
                team_id: t.team_id,
                team_name: t.team_name ?? "Untitled Team",
                team_description: t.team_description ?? "",
                status: t.status ?? "UNKNOWN",
                _count: t._count, // UI reads _count?.teammember
                created_at: t.created_at, // raw timestamp
                created_by_user: t.created_by_user, // keep if needed
                domain: t.domain ? { domain_name: t.domain.domain_name } : null,
            }));

            // FIX: cache after defining teams
            await redis.setex(cacheKey, 30, JSON.stringify(teams));

            return res.status(200).json({ data: teams, fromCache: false });
        } catch (error) {
            console.error("Error fetching teams:", error);
            return res.status(500).json({ message: "Server error", error: error.message });
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
                                select: { user_id: true, name: true, email: true, role: true },
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
                            abstract: true,
                            // domain: { select: { domain_name: true } },
                            teacher: { select: { user: { select: { name: true } } } },
                        },
                        orderBy: { created_at: 'desc' }
                    },
                    paper: {
                        select: {
                            paper_id: true,
                            title: true,
                            pdf_path: true,
                            created_at: true,
                            file_size: true,
                            status: true,
                            abstract: true,
                            // domain: { select: { domain_name: true } },
                            teacher: { select: { user: { select: { name: true } } } },
                        },
                        orderBy: { created_at: 'desc' }
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

                domainName: team.domain?.domain_name || null,
                domainId: team.domain?.domain_id || null,

                teammembers: team.teammember.map((m) => ({
                    user_id: m.user.user_id,
                    name: m.user.name,
                    email: m.user.email,
                    role_in_team: m.role_in_team,
                    user_role: m.user.role || null,
                })),
                proposals: team.proposal.map((p) => ({
                    id: p.proposal_id,
                    title: p.title,
                    pdf_path: p.pdf_path,
                    created_at: p.created_at,
                    file_size: p.file_size,
                    status: p.status,
                    abstract: p.abstract,
                    // domain: p.domain?.domain_name,
                    teacher: p.teacher?.user?.name || null,
                })),
                papers: team.paper.map((p) => ({
                    id: p.paper_id,
                    title: p.title,
                    pdf_path: p.pdf_path,
                    created_at: p.created_at,
                    file_size: p.file_size,
                    status: p.status,
                    abstract: p.abstract,
                    // domain: p.domain?.domain_name,
                    teacher: p.teacher?.user?.name || null,
                })),
            };

            return res.status(200).json({ data: teamCardData });
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
                    return res.status(400).json({ error: "Each member must have a user_id" });
                }
                const role = (m.role_in_team || "RESEARCHER").toUpperCase();
                if (!ROLE_ENUM.includes(role)) {
                    return res.status(422).json({ error: `Invalid role "${role}" for user ${m.user_id}` });
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
            try { await redis.del("/api/teams"); } catch (err) { console.error("Redis clear:", err); }

            return res.status(201).json({
                message: "Members added successfully",
                data: addedMembers,
            });

        } catch (err) {
            console.error("addMembersToTeam error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getAllTeamPapers(req, res) {
        try {
            // consistent user id extraction
            const userId = Number(req.user?.user_id ?? req.user?.id);
            if (!userId) return res.status(400).json({ message: "Missing user id" });

            // define teacher (you referenced it before without defining)
            const teacher = await db.teacher.findFirst({
                where: { user_id: userId },
                select: { teacher_id: true },
            });

            // build OR clause safely
            const orClause = [
                {
                    team: {
                        teammember: { some: { user_id: userId } },
                    },
                },
                {
                    team: { created_by_user_id: userId },
                },
            ];
            if (teacher) {
                orClause.push({ submitted_by: teacher.teacher_id });
            }

            const papers = await db.paper.findMany({
                where: { OR: orClause },
                include: {
                    team: {
                        select: {
                            team_id: true,
                            team_name: true,
                            domain: {
                                select: {
                                    domain_name: true

                                }
                            }
                        }
                    },
                    // FIX: use select for scalars; include only relations
                    teacher: {
                        select: {
                            teacher_id: true,
                            user: { select: { name: true, email: true } },
                        },
                    },
                },
                orderBy: { created_at: "desc" },
            });

            // robust file URL
            const base = process.env.APP_URL || "http://localhost:8000";
            const papersWithUrls = papers.map((p) => ({
                ...p,
                download_url: p.pdf_path ? `${base}/${p.pdf_path}` : null,
            }));

            return res.status(200).json({ data: papersWithUrls });
        } catch (error) {
            console.error("Error fetching team papers:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async getAllTeamProposals(req, res) {
        try {
            const userId = Number(req.user?.user_id ?? req.user?.id);
            if (!userId) return res.status(400).json({ message: "Missing user id" });

            const teacher = await db.teacher.findFirst({
                where: { user_id: userId },
                select: { teacher_id: true },
            });

            const orClause = [
                { team: { teammember: { some: { user_id: userId } } } },
                { team: { created_by_user_id: userId } },
            ];
            if (teacher) {
                orClause.push({ submitted_by: teacher.teacher_id });
            }

            const proposals = await db.proposal.findMany({
                where: { OR: orClause },
                include: {
                    team: {
                        select: {
                            team_id: true,
                            team_name: true,
                            domain: {
                                select: {
                                    domain_name: true

                                }
                            }
                        }
                    },
                    teacher: {
                        select: {
                            teacher_id: true,
                            user: { select: { name: true, email: true } },
                        },
                    },
                },
                orderBy: { created_at: "desc" },
            });

            const base = process.env.APP_URL || "http://localhost:8000";
            const proposalsWithUrls = proposals.map((p) => ({
                ...p,
                download_url: p.pdf_path ? `${base}/${p.pdf_path}` : null,
            }));

            return res.status(200).json({ data: proposalsWithUrls });
        } catch (error) {
            console.error("Error fetching team proposals:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    }

    static async getAllTeamComments(req, res) {
        try {
            const userId = Number(req.user?.user_id ?? req.user?.id);
            if (!userId) return res.status(400).json({ message: "Missing user id" });

            const comments = await db.teamcomment.findMany({
                where: {
                    team: {
                        OR: [
                            { teammember: { some: { user_id: userId } } },
                            { created_by_user_id: userId },
                        ],
                    },
                },
                include: {
                    user: { select: { user_id: true, name: true, email: true } },
                    team: { select: { team_id: true, team_name: true } },
                },
                orderBy: { created_at: "desc" },
                take: 20,
            });

            return res.status(200).json({ data: comments });
        } catch (error) {
            console.error("Error fetching team comments:", error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }


}
export default TeamDetails;