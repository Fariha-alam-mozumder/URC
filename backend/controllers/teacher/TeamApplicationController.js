import db from "../../DB/db.config.js";

class TeamApplicationController {
    // Get applications for a team
    static async getTeamApplications(req, res) {
        try {
            const { teamId } = req.params;

            const applications = await db.teamapplication.findMany({
                where: {
                    team_id: Number(teamId),
                    status: 'PENDING'
                },
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    name: true,
                                    email: true,
                                    userdomain: {
                                        include: {
                                            domain: {
                                                select: { domain_name: true }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { applied_at: 'desc' }
            });

            return res.json({ data: applications });
        } catch (err) {
            console.error("Get team applications error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Update application status (approve/reject)
    static async updateApplicationStatus(req, res) {
        try {
            const { applicationId } = req.params;
            const { status } = req.body;

            if (!['APPROVED', 'REJECTED'].includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }

            const application = await db.teamapplication.update({
                where: { application_id: Number(applicationId) },
                data: { status },
                include: {
                    student: true,
                    team: true
                }
            });

            // If approved, add student as team member
            if (status === 'APPROVED') {
                await db.teammember.create({
                    data: {
                        team_id: application.team_id,
                        user_id: application.student.user_id,
                        role_in_team: 'RESEARCHER' // Default role
                    }
                });
            }

            return res.json({
                message: `Application ${status.toLowerCase()} successfully`,
                data: application
            });
        } catch (err) {
            console.error("Update application status error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default TeamApplicationController;