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

    // Team (authors) view: anonymized reviews for a PAPER
    static async getPublicReviewsForPaper(req, res) {
        try {
            const paperId = Number(req.params.paperId);
            const userId = Number(req.user?.user_id ?? req.user?.id);
            if (!paperId) return res.status(400).json({ success: false, message: "Invalid paper id" });
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            // Fetch paper with its team to verify membership
            const paper = await db.paper.findUnique({
                where: { paper_id: paperId },
                include: {
                    team: {
                        select: {
                            team_id: true,
                            created_by_user_id: true,
                            teammember: { select: { user_id: true } },
                        },
                    },
                },
            });
            if (!paper) return res.status(404).json({ success: false, message: "Paper not found" });

            // Authorization: must be a team member or team creator
            const isMember = paper.team?.teammember?.some((m) => Number(m.user_id) === userId);
            const isCreator = Number(paper.team?.created_by_user_id) === userId;
            if (!isMember && !isCreator) {
                return res.status(403).json({ success: false, message: "Not allowed to view reviews for this paper" });
            }

            // Pull only anonymized review data
            const withReviews = await db.paper.findUnique({
                where: { paper_id: paperId },
                select: {
                    paper_id: true,
                    aggregated_decision: true,
                    review: {
                        select: {
                            score: true,
                            comments: true, // JSON string with rubric/feedback/attachment
                            // DO NOT select reviewer identity fields here
                        },
                        orderBy: { reviewed_at: "asc" },
                    },
                },
            });

            const scores = (withReviews?.review ?? [])
                .map((r) => r.score)
                .filter((s) => typeof s === "number");

            const aggregatedScore = scores.length
                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                : null;

            // Strip attachments, keep rubric + feedback
            const comments = (withReviews?.review ?? []).map((r) => {
                let c = {};
                try { c = JSON.parse(r.comments || "{}"); } catch { }
                if (c && typeof c === "object" && "attachment" in c) delete c.attachment;
                return c;
            });

            return res.json({
                success: true,
                data: {
                    aggregated_decision: withReviews?.aggregated_decision ?? null,
                    aggregated_score: aggregatedScore,
                    comments,
                },
            });
        } catch (err) {
            console.error("getPublicReviewsForPaper error:", err);
            return res.status(500).json({ success: false, message: "Server error", error: err.message });
        }
    }

    // Team (authors) view: anonymized reviews for a PROPOSAL
    static async getPublicReviewsForProposal(req, res) {
        try {
            const proposalId = Number(req.params.proposalId);
            const userId = Number(req.user?.user_id ?? req.user?.id);
            if (!proposalId) return res.status(400).json({ success: false, message: "Invalid proposal id" });
            if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

            // Fetch proposal with its team to verify membership
            const proposal = await db.proposal.findUnique({
                where: { proposal_id: proposalId },
                include: {
                    team: {
                        select: {
                            team_id: true,
                            created_by_user_id: true,
                            teammember: { select: { user_id: true } },
                        },
                    },
                },
            });
            if (!proposal) return res.status(404).json({ success: false, message: "Proposal not found" });

            // Authorization: must be a team member or team creator
            const isMember = proposal.team?.teammember?.some((m) => Number(m.user_id) === userId);
            const isCreator = Number(proposal.team?.created_by_user_id) === userId;
            if (!isMember && !isCreator) {
                return res.status(403).json({ success: false, message: "Not allowed to view reviews for this proposal" });
            }

            // Pull only anonymized review data
            const withReviews = await db.proposal.findUnique({
                where: { proposal_id: proposalId },
                select: {
                    proposal_id: true,
                    aggregated_decision: true,
                    review: {
                        select: {
                            score: true,
                            comments: true, // JSON string with rubric/feedback/attachment
                        },
                        orderBy: { reviewed_at: "asc" },
                    },
                },
            });

            const scores = (withReviews?.review ?? [])
                .map((r) => r.score)
                .filter((s) => typeof s === "number");

            const aggregatedScore = scores.length
                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                : null;

            const comments = (withReviews?.review ?? []).map((r) => {
                let c = {};
                try { c = JSON.parse(r.comments || "{}"); } catch { }
                if (c && typeof c === "object" && "attachment" in c) delete c.attachment;
                return c;
            });

            return res.json({
                success: true,
                data: {
                    aggregated_decision: withReviews?.aggregated_decision ?? null,
                    aggregated_score: aggregatedScore,
                    comments,
                },
            });
        } catch (err) {
            console.error("getPublicReviewsForProposal error:", err);
            return res.status(500).json({ success: false, message: "Server error", error: err.message });
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

    // Inside class TeamDetails
    static async updateStatus(req, res) {
        try {
            const teamId = Number(req.params.id);
            const userId = Number(req.user?.user_id ?? req.user?.id);
            const { status } = req.body;

            if (!teamId) return res.status(400).json({ error: "Invalid team ID" });
            if (!userId) return res.status(401).json({ error: "Unauthorized" });
            if (!status || typeof status !== "string") {
                return res.status(422).json({ error: "Status is required" });
            }

            const newStatus = status.toUpperCase();
            const ALLOWED = ["ACTIVE", "RECRUITING", "INACTIVE"];
            if (!ALLOWED.includes(newStatus)) {
                return res.status(422).json({ error: `Invalid status. Allowed: ${ALLOWED.join(", ")}` });
            }

            // Fetch team + members once
            const team = await db.team.findUnique({
                where: { team_id: teamId },
                include: { teammember: { select: { user_id: true, role_in_team: true } } },
            });
            if (!team) return res.status(404).json({ error: "Team not found" });

            // Authorization: creator OR a LEAD of this team
            const isCreator = Number(team.created_by_user_id) === userId;
            const isLead = team.teammember.some(
                (m) => Number(m.user_id) === userId && m.role_in_team === "LEAD"
            );
            if (!isCreator && !isLead) {
                return res.status(403).json({ error: "Only the creator or a LEAD can change status" });
            }

            // Update
            const updated = await db.team.update({
                where: { team_id: teamId },
                data: { status: newStatus },
                select: {
                    team_id: true,
                    team_name: true,
                    status: true,
                    created_by_user_id: true,
                },
            });

            // Invalidate caches
            try {
                await redis.del(teamDetailsKey(teamId));
                // Invalidate "my teams" for creator + all members
                const affectedUserIds = new Set([
                    Number(updated.created_by_user_id),
                    ...team.teammember.map((m) => Number(m.user_id)),
                ]);
                for (const uid of affectedUserIds) {
                    if (uid) await redis.del(userTeamsKey(uid));
                }
            } catch (e) {
                console.error("Redis invalidate error (updateStatus):", e);
            }

            return res.status(200).json({
                message: "Team status updated",
                data: updated,
            });
        } catch (err) {
            console.error("updateStatus error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
export default TeamDetails;