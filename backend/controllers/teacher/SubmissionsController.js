// controllers/SubmissionController.js
import db from "../../DB/db.config.js";

const fileBase = process.env.FILE_BASE_URL || "http://localhost:3000/files";

function pad3(num) {
    return String(num).padStart(3, '0');
}

class SubmissionsController {
    // GET /api/submissions?domain_id=&status=&q=&sort=title|field|submitted|status&order=asc|desc
    static async list(req, res) {
        try {
            const userId = Number(req.user?.user_id ?? req.user?.id);
            if (!userId) return res.status(400).json({ message: "Missing user id" });

            // Is the user also a teacher?
            const teacher = await db.teacher.findFirst({
                where: { user_id: userId },
                select: { teacher_id: true },
            });

            // Visibility: any team a user created, user is also a member of, or (if teacher) items you submitted
            const teamScope = [
                { team: { created_by_user_id: userId } },
                { team: { teammember: { some: { user_id: userId } } } },
            ];

            // Add teacher-submitted scope
            const paperOr = [...teamScope];
            const proposalOr = [...teamScope];
            if (teacher) {
                paperOr.push({ submitted_by: teacher.teacher_id });
                proposalOr.push({ submitted_by: teacher.teacher_id });
            }

            // Filters
            const { domain_id, status, q } = req.query;
            const domainFilter = domain_id ? { team: { domain_id: Number(domain_id) } } : {};
            const decisionFilter = status ? { aggregated_decision: status } : {};
            const statusFilter = status ? { status } : {};
            const searchFilter = q
                ? {
                    OR: [
                        { title: { contains: q, mode: "insensitive" } },
                        { abstract: { contains: q, mode: "insensitive" } },
                        { team: { team_name: { contains: q, mode: "insensitive" } } },
                    ],
                }
                : {};

            // Fetch papers
            const papers = await db.paper.findMany({
                where: {
                    AND: [searchFilter, decisionFilter, domainFilter, { OR: paperOr }],
                },
                select: {
                    paper_id: true,
                    title: true,
                    pdf_path: true,
                    created_at: true,
                    file_size: true,
                    aggregated_decision: true,
                    team: {
                        select: {
                            team_id: true,
                            team_name: true,
                            domain: { select: { domain_id: true, domain_name: true } },
                            _count: { select: { teammember: true } },
                        },
                    },
                    teacher: { select: { user: { select: { name: true, email: true } } } },
                },
                orderBy: { created_at: "desc" },
            });

            // Fetch proposals
            const proposals = await db.proposal.findMany({
                where: {
                    AND: [searchFilter, decisionFilter, domainFilter, { OR: proposalOr }],
                },
                select: {
                    proposal_id: true,
                    title: true,
                    pdf_path: true,
                    created_at: true,
                    file_size: true,
                    aggregated_decision: true,
                    team: {
                        select: {
                            team_id: true,
                            team_name: true,
                            domain: { select: { domain_id: true, domain_name: true } },
                            _count: { select: { teammember: true } },
                        },
                    },
                    teacher: { select: { user: { select: { name: true, email: true } } } },
                },
                orderBy: { created_at: "desc" },
            });

            // Normalize into one list for the UI table - keep raw data for frontend formatting
            const items = [
                ...papers.map((p) => ({
                    id: `paper-${p.paper_id}`,
                    type: "paper",
                    code: `P${pad3(p.paper_id)}`,
                    title: p.title || "Untitled Paper",
                    authors: p.team?._count?.teammember || 0,
                    field: p.team?.domain?.domain_name || "—",
                    field_id: p.team?.domain?.domain_id || null,
                    submitted: p.created_at,
                    status: p.aggregated_decision || null,
                    download_url: p.pdf_path ? `${fileBase}/${p.pdf_path}` : null,
                })),
                ...proposals.map((p) => ({
                    id: `proposal-${p.proposal_id}`,
                    type: "proposal",
                    code: `PR${pad3(p.proposal_id)}`,
                    title: p.title || "Untitled Proposal",
                    authors: p.team?._count?.teammember || 0,
                    field: p.team?.domain?.domain_name || "—",
                    field_id: p.team?.domain?.domain_id || null,
                    submitted: p.created_at,
                    status: p.aggregated_decision || null,
                    download_url: p.pdf_path ? `${fileBase}/${p.pdf_path}` : null,
                })),
            ];

            // Simple sorting
            const sort = String(req.query.sort || "").toLowerCase();
            const order = (String(req.query.order || "desc").toLowerCase() === "asc") ? 1 : -1;

            if (sort === "title") {
                items.sort((a, b) => a.title.localeCompare(b.title) * order);
            } else if (sort === "field") {
                items.sort((a, b) => a.field.localeCompare(b.field) * order);
            } else if (sort === "submitted") {
                items.sort((a, b) => {
                    const dateA = new Date(a.submitted);
                    const dateB = new Date(b.submitted);
                    return (dateA - dateB) * order;
                });
            } else if (sort === "status") {
                items.sort((a, b) => {
                    const A = a.status || "~";
                    const B = b.status || "~";
                    return A.localeCompare(B) * order;
                });
            } else {
                items.sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
            }

            return res.status(200).json({ data: items, fromCache: false });
        } catch (err) {
            console.error("SubmissionController.list error:", err);
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    // GET /api/submissions/filters  -> domains of user's department + status enum list
    static async filters(req, res) {
        try {
            const userId = Number(req.user?.user_id ?? req.user?.id);
            if (!userId) return res.status(400).json({ message: "Missing user id" });

            // Try resolve dept via student or teacher record
            const student = await db.student.findFirst({
                where: { user_id: userId },
                select: { department_id: true },
            });
            const teacher = await db.teacher.findFirst({
                where: { user_id: userId },
                select: { department_id: true },
            });

            const department_id = student?.department_id ?? teacher?.department_id ?? null;

            let domains = [];
            if (department_id) {
                const rows = await db.departmentdomain.findMany({
                    where: { department_id },
                    include: { domain: { select: { domain_id: true, domain_name: true } } },
                    orderBy: { domain_id: "asc" },
                });
                domains = rows
                    .map(r => r.domain)
                    .filter(Boolean)
                    .map(d => ({ domain_id: d.domain_id, domain_name: d.domain_name }));
            }

            // Return raw status options for frontend formatting
            const statusOptions = [
                "ACCEPT",
                "REJECT",
                "MINOR_REVISIONS",
                "MAJOR_REVISIONS",
            ];
            return res.status(200).json({ data: { domains, statusOptions } });
        } catch (err) {
            console.error("SubmissionController.filters error:", err);
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
}

export default SubmissionsController;