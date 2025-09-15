import prisma from "../DB/db.config.js";

class LandingController {
  // GET /papers/accepted
  static async getAcceptedPapers(req, res) {
    try {
      const papers = await prisma.paper.findMany({
        where: {
          aggregated_decision: "ACCEPT", // Only accepted papers
        },
        include: {
          teacher: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          team: {
            select: {
              team_name: true,
              domain: {
                select: {
                  domain_name: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      // Format response for frontend
      const formattedPapers = papers.map((paper) => ({
        paper_id: paper.paper_id,
        title: paper.title,
        authors: paper.teacher?.user?.name || "Unknown Author",
        department: paper.team?.domain?.domain_name || "Unknown Department",
        abstract: paper.abstract,
        pdf_path: paper.pdf_path,
      }));

      return res.status(200).json({ papers: formattedPapers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default LandingController;
