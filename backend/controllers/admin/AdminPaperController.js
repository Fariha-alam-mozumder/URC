import prisma from "../../DB/db.config.js";

import { Vine, errors } from "@vinejs/vine";
import logger from "../../config/logger.js";

const vine = new Vine();

class AdminPaperController {
    // GET /api/admin/papers - Get all papers for admin
    static async getAllPapers(req, res) {
       if (res.headersSent) {
        console.log('Response already sent, skipping');
        return;
    }
        try {
            const papers = await prisma.paper.findMany({
                include: {
                    team: {
                        select: {
                            team_id: true,
                            team_name: true,
                            status: true,
                            visibility: true
                        }
                    },
                    domain: {
                        select: {
                            domain_id: true,
                            domain_name: true
                        }
                    },
                    teacher: {
                        select: { 
                            teacher_id: true,
                            designation: true,
                            user: { 
                                select: { 
                                    name: true, 
                                    email: true 
                                } 
                            },
                            department: {
                                select: {
                                    department_name: true
                                }
                            }
                        }
                    },
                    reviewerassignment: {
                        select: {
                            assignment_id: true,
                            reviewer: {
                                select: {
                                    reviewer_id: true,
                                    status: true,
                                    teacher: {
                                        select: {
                                            user: {
                                                select: {
                                                    name: true,
                                                    email: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { created_at: "desc" }
            });

            // Transform data to match your frontend format
            const transformedPapers = papers.map(paper => {
                // Get assigned reviewers
                const assignedReviewers = paper.reviewerassignment
                    .map(assignment => assignment.reviewer?.teacher?.user?.name)
                    .filter(name => name)
                    .join(', ');

                return {
                    id: `P${String(paper.paper_id).padStart(3, '0')}`,
                    title: paper.title || 'Untitled',
                    authors: paper.teacher?.user?.name || 'Unknown Author',
                    submittedBy: paper.teacher?.user?.email || 'Unknown',
                    date: new Date(paper.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }),
                    status: paper.status || 'Pending',
                    reviewer: assignedReviewers || 'Unassigned',
                    track: paper.domain?.domain_name || 'Unknown',
                };
            });

            // Fixed: Match frontend expectation - use 'papers' instead of 'data'
            return res.status(200).json({ 
                success: true,
                papers: transformedPapers,
                total: transformedPapers.length 
            });
        } catch (error) {
            if (!res.headersSent){logger.error("Error fetching all papers for admin:", error);
            return res.status(500).json({ 
                success: false,
                message: "Server error", 
                error: error.message 
            });}
        }
    }

    // GET /api/admin/proposals - Get all proposals for admin  
    static async getAllProposals(req, res) {
        try {
            const proposals = await prisma.proposal.findMany({
                include: {
                    team: {
                        select: {
                            team_id: true,
                            team_name: true,
                            status: true,
                            visibility: true
                        }
                    },
                    domain: {
                        select: {
                            domain_id: true,
                            domain_name: true
                        }
                    },
                    teacher: {
                        select: { 
                            teacher_id: true,
                            designation: true,
                            user: { 
                                select: { 
                                    name: true, 
                                    email: true 
                                } 
                            },
                            department: {
                                select: {
                                    department_name: true
                                }
                            }
                        }
                    },
                    reviewerassignment: {
                        select: {
                            assignment_id: true,
                            reviewer: {
                                select: {
                                    reviewer_id: true,
                                    status: true,
                                    teacher: {
                                        select: {
                                            user: {
                                                select: {
                                                    name: true,
                                                    email: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { created_at: "desc" }
            });

            // Transform data to match your frontend format
            const transformedProposals = proposals.map(proposal => {
                // Get assigned reviewers
                const assignedReviewers = proposal.reviewerassignment
                    .map(assignment => assignment.reviewer?.teacher?.user?.name)
                    .filter(name => name)
                    .join(', ');

                return {
                    id: `PR${String(proposal.proposal_id).padStart(3, '0')}`,
                    title: proposal.title || 'Untitled',
                    authors: proposal.teacher?.user?.name || 'Unknown Author',
                    submittedBy: proposal.teacher?.user?.email || 'Unknown',
                    date: new Date(proposal.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }),
                    status: proposal.status || 'Pending',
                    reviewer: assignedReviewers || 'Unassigned',
                    track: proposal.domain?.domain_name || 'Unknown',
                };
            });

            // Fixed: Use consistent property name 'data' to match frontend
            return res.status(200).json({ 
                success: true,
                data: transformedProposals,
                total: transformedProposals.length 
            });
        } catch (error) {
            logger.error("Error fetching all proposals for admin:", error);
            return res.status(500).json({ 
                success: false,
                message: "Server error", 
                error: error.message 
            });
        }
    }
}

export default AdminPaperController;