import db from "../../DB/db.config.js";

class TeamCommentController {
    // Get comments for a team
    static async getTeamComments(req, res) {
        try {
            const { teamId } = req.params;

            const comments = await db.teamcomment.findMany({
                where: { team_id: Number(teamId) },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { created_at: 'desc' }
            });

            return res.json({ data: comments });
        } catch (err) {
            console.error("Get team comments error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Create a new comment
    static async createComment(req, res) {
        try {
            const { teamId } = req.params;
            const { comment } = req.body;
            const userId = Number(req.user.id);

            if (!comment?.trim()) {
                return res.status(400).json({ error: "Comment text is required" });
            }

            // Verify user is a team member
            const membership = await db.teammember.findFirst({
                where: {
                    team_id: Number(teamId),
                    user_id: userId
                }
            });

            if (!membership) {
                return res.status(403).json({ error: "You must be a team member to comment" });
            }

            const newComment = await db.teamcomment.create({
                data: {
                    team_id: Number(teamId),
                    user_id: userId,
                    comment: comment.trim()
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            return res.status(201).json({
                message: "Comment added successfully",
                data: newComment
            });
        } catch (err) {
            console.error("Create comment error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
export default TeamCommentController;