

backend
├── DB/
│   ├── db.config.js
│   └── redis.config.js
├── config/
│   ├── filesystem.js
│   ├── logger.js
│   ├── mailer.js
│   ├── queue.js
│   └── ratelimiter.js
├── controllers/
│   ├── admin/
│   │   ├── AdminProposalController.js
│   │   ├── AssignmentController.js
│   │   └── ReviewerController.js
│   ├── student/
│   │   └── StudentTeamController.js
│   ├── teacher/
│   │   ├── PaperController.js
│   │   ├── ProposalController.js
│   │   ├── TeamApplicationController.js
│   │   ├── TeamCommentController.js
│   │   ├── TeamController.js
│   │   └── TeamDetails.js
│   ├── AuthController.js
│   ├── NewsController.js
│   └── ProfileController.js
├── jobs/
│   ├── SendEmailJob.js
│   └── index.js
├── middleware/
│   ├── Authenticate.js
│   └── adminOnly.js
├── node_modules/ 🚫 (auto-hidden)
├── prisma/
│   ├── migrations/
│   │   ├── 20250812140754_db_updated/
│   │   │   └── migration.sql
│   │   ├── 20250813203619_add_team_member_role_enum/
│   │   │   └── migration.sql
│   │   ├── 20250813205146_add_team_role_enum/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   ├── seed.js
│   └── seed.sql
├── public/
│   ├── documents/
│   │   ├── ...
│   │   └── ffc9b266-1536-4a14-947e-8941c9fbc04c.pdf
│   ├── files/
│   │   ├── ...
│   └── images/
│       ├── ...
│       └── image.png
├── routes/
│   └── api.js
├── test/
│   ├── files/
│   │   └── proposal.pdf
│   ├── images/
│   │   ├── cat3.jpg
│   │   ├── images2.jpg
│   │   └── sample.jpg
│   ├── paper.http
│   ├── pdfUpload.http
│   ├── sample-team.http
│   ├── team.http
│   └── upload-news.http
├── transform/
│   └── newApiTransform.js
├── utils/
│   └── helper.js
├── validations/
│   ├── admin/
│   │   ├── assignmentValidation.js
│   │   └── reviewerValidation.js
│   ├── teacher/
│   │   ├── paperValidation.js
│   │   ├── proposalValidation.js
│   │   └── teamValidation.js
│   ├── CustomErrorReporter.js
│   ├── authValidation.js
│   └── newsValidation.js
├── .env 🚫 (auto-hidden)
├── README.md
├── combined.log 🚫 (auto-hidden)
├── error.log 🚫 (auto-hidden)
├── package-lock.json
├── package.json
└── server.js
```

frontend
├── node_modules/ 🚫 (auto-hidden)
├── public/
│   ├── icons.png
│   ├── image1.png
│   ├── search.png
│   └── vite.svg
├── src/
│   ├── AuthenticatePages/
│   │   ├── LoginForm.jsx
│   │   ├── SignUpForm.jsx
│   │   └── VerifyPendingPage.jsx
│   ├── Data/
│   │   ├── assignedPapers.js
│   │   └── reviewerStatus.js
│   ├── Pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminHome.jsx
│   │   │   ├── AdminPapers.jsx
│   │   │   ├── AdminProposal.jsx
│   │   │   ├── ReviewCommittee.jsx
│   │   │   ├── TeamDetail.jsx
│   │   │   ├── Teams.jsx
│   │   │   └── WaitingAssignment.jsx
│   │   ├── Reviewer/
│   │   │   ├── AssignedPapersPage.jsx
│   │   │   ├── AssignedProposalsPage.jsx
│   │   │   ├── PaperReviewPage.jsx
│   │   │   ├── ReviewHistoryPage.jsx
│   │   │   ├── ReviewerDashboard.jsx
│   │   │   ├── ReviewerLayout.jsx
│   │   │   └── SubmissionTable.jsx
│   │   ├── Student/
│   │   │   ├── MyTeams.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentLayout.jsx
│   │   │   ├── StudentMyPapers.jsx
│   │   │   └── StudentTeamDetails.jsx
│   │   ├── Teacher/
│   │   │   ├── CreateTeam.jsx
│   │   │   ├── MyPapers.jsx
│   │   │   ├── SubmissionHistory.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── TeacherLayout.jsx
│   │   │   ├── TeamDetails.jsx
│   │   │   └── TeamManagement.jsx
│   │   ├── home/
│   │   │   └── Homepage.jsx
│   │   └── landingpage/
│   │       └── LandingPage.jsx
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AddReviewerModal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── PaperCard.jsx
│   │   │   ├── PapersCard.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── ReviewerRow.jsx
│   │   │   ├── TeamDescriptionCard.jsx
│   │   │   ├── TeamMembersCard.jsx
│   │   │   └── TeamsPapersCard.jsx
│   │   ├── Common/
│   │   │   ├── ChartCard.jsx
│   │   │   ├── CommonButton.jsx
│   │   │   ├── CommonSubmissionTable.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LogoutModal.jsx
│   │   │   ├── MemberList.jsx
│   │   │   ├── PaperCard.jsx
│   │   │   ├── RecentSubmission.jsx
│   │   │   ├── ReviewTable.jsx
│   │   │   ├── ReviewerWorkload.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TeamCard.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── statcard.jsx
│   │   ├── Reviewer/
│   │   │   ├── AssignedItemsPage.jsx
│   │   │   └── AssignedPapersTable.jsx
│   │   ├── Student/
│   │   │   └── MemberList.jsx
│   │   ├── Teacher/
│   │   │   ├── CreateTeam/
│   │   │   │   ├── BasicInfoForm.jsx
│   │   │   │   ├── DocumentUpload.jsx
│   │   │   │   ├── FormActions.jsx
│   │   │   │   ├── MemberManager.jsx
│   │   │   │   ├── TeamSettings.jsx
│   │   │   │   └── UploadModal.jsx
│   │   │   ├── MyPapers/
│   │   │   │   └── SubmitPaperModal.jsx
│   │   │   ├── TeamManagement/
│   │   │   │   ├── Comment.jsx
│   │   │   │   ├── DocumentList.jsx
│   │   │   │   ├── MemberList.jsx
│   │   │   │   ├── PaperUpload.jsx
│   │   │   │   └── PendingApplication.jsx
│   │   │   ├── SubmissionTable.jsx
│   │   │   └── TeamActivity.jsx
│   │   ├── home/
│   │   │   ├── AcceptedPaper.jsx
│   │   │   ├── Conferences.jsx
│   │   │   └── Header.jsx
│   │   └── landingPage/
│   │       ├── FooterSection.jsx
│   │       ├── HeroSection.jsx
│   │       ├── JoinSection.jsx
│   │       └── LockSection.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── PrivateRoute.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx

```
