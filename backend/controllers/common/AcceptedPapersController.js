// controllers/public/AcceptedPapersController.js
import prisma from "../../DB/db.config.js";

function fileUrl(pdf_path) {
  if (!pdf_path) return null;
  const base = process.env.APP_URL || "http://localhost:8000";
  const clean = String(pdf_path).replace(/^\/+/, "");
  return `${base}/${clean}`;
}

/**
 * GET /api/public/accepted-papers
 * Query params:
 *  - search: string (title search)
 *  - department_id: number (filter)
 *  - domain_id: number (filter)
 *  - page: number (default 1)
 *  - limit: number (default 12)
 */
export async function getAcceptedPapers(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || "12", 10)));
    const search = (req.query.search || "").trim();
    const departmentId = req.query.department_id ? parseInt(req.query.department_id, 10) : null;
    const domainId = req.query.domain_id ? parseInt(req.query.domain_id, 10) : null;

    const where = {
      aggregated_decision: "ACCEPT", // ← only accepted
    };

    const AND = [];

    if (search) {
      AND.push({
        title: { contains: search, mode: "insensitive" },
      });
    }

    // Filter by domain (topic)
    if (domainId) {
      AND.push({ team: { domain_id: domainId } });
    }

    // Filter by department via Domain -> DepartmentDomain (many-to-many)
    if (departmentId) {
      AND.push({
        team: {
          domain: {
            departmentdomain: {
              some: { department_id: departmentId },
            },
          },
        },
      });
    }

    if (AND.length) where.AND = AND;

    const [total, list] = await Promise.all([
      prisma.paper.count({ where }),
      prisma.paper.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          team: {
            include: {
              teammember: {
                include: {
                  user: { select: { user_id: true, name: true } },
                },
              },
              domain: {
                include: {
                  departmentdomain: {
                    include: { department: true },
                  },
                },
              },
            },
          },
          teacher: {
            include: {
              user: true, // (optional) if you want the submitting teacher
            },
          },
        },
      }),
    ]);

    // Map to the shape your component expects
    const papers = list.map((p) => {
      const members = p.team?.teammember || [];
      const authorNames = members.map((m) => m.user?.name).filter(Boolean);
      const domainName = p.team?.domain?.domain_name || null;

      // A domain may belong to multiple departments; take the first or show all
      const deptLinks = p.team?.domain?.departmentdomain || [];
      const department =
        deptLinks.length > 0
          ? deptLinks[0]?.department?.department_name || "Unknown Department"
          : "Unknown Department";

      return {
        id: p.paper_id,
        title: p.title || "Untitled",
        abstract: p.abstract || "",
        authors: authorNames.length ? authorNames.join(", ") : "Unknown authors",
        department,
        tags: domainName ? [domainName] : [],
        created_at: p.created_at,
        pdf_path: p.pdf_path,           // raw path if you need it
        pdf_url: fileUrl(p.pdf_path),   // ready-to-open URL
      };
    });

    return res.status(200).json({
      success: true,
      papers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    console.error("getAcceptedPapers error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * GET /api/public/filters
 * Returns available departments and domains (topics)
 * Optional: include counts of accepted papers per dept/domain
 */
export async function getPublicFilters(req, res) {
  try {
    const [departments, domains] = await Promise.all([
      prisma.department.findMany({
        orderBy: { department_name: "asc" },
        select: { department_id: true, department_name: true },
      }),
      prisma.domain.findMany({
        orderBy: { domain_name: "asc" },
        select: { domain_id: true, domain_name: true },
      }),
    ]);

    return res.status(200).json({
      success: true,
      departments,
      domains,
    });
  } catch (err) {
    console.error("getPublicFilters error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
