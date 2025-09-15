# File Tree: URC

Generated on: 9/14/2025, 12:53:18 AM
Root path: `d:\WebDev\Project\New folder\URC\URC`

```
├── .git/ 🚫 (auto-hidden)
├── backend/
│   ├── DB/
│   │   ├── db.config.js
│   │   ├── redis.client.js
│   │   └── redis.config.js
│   ├── config/
│   │   ├── filesystem.js
│   │   ├── logger.js
│   │   ├── mailer.js
│   │   ├── queue.js
│   │   └── ratelimiter.js
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── AdminPaperController.js
│   │   │   ├── AssignmentController.js
│   │   │   └── ReviewerController.js
│   │   ├── review/
│   │   ├── reviewer/
│   │   │   ├── AssignedController.js
│   │   │   └── ReviewController.js
│   │   ├── student/
│   │   │   └── StudentTeamController.js
│   │   ├── teacher/
│   │   │   ├── PaperController.js
│   │   │   ├── ProposalController.js
│   │   │   ├── TeamApplicationController.js
│   │   │   ├── TeamCommentController.js
│   │   │   ├── TeamController.js
│   │   │   └── TeamDetails.js
│   │   ├── AuthController.js
│   │   ├── NewsController.js
│   │   └── ProfileController.js
│   ├── jobs/
│   │   ├── SendEmailJob.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── Authenticate.js
│   │   ├── adminOnly.js
│   │   └── reviewerOnly.js
│   ├── node_modules/ 🚫 (auto-hidden)
│   ├── prisma/
│   │   ├── migrations/
│   │   │   ├── 20250912150202_created_db/
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   ├── db_urcms.sql
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── seed.sql
│   ├── public/
│   │   ├── documents/
│   │   │   ├── 24cde354-2e97-417f-a77a-7e92ac16e917.pdf
│   │   │   ├── 35905e90-b7b7-4f68-9390-75a300ad79bc.pdf
│   │   │   ├── 3aef6a6c-11df-4d7e-aa7b-a8d794e0ab89.pdf
│   │   │   ├── 51eb830c-d5f2-4b00-af57-e1cce46ca5ee.pdf
│   │   │   ├── 5cc6eb23-9299-4005-992b-b13083b973d6.pdf
│   │   │   ├── a24561e9-2329-4ffb-b54a-68c7b437b749.pdf
│   │   │   ├── d6ac8186-e321-4464-8783-6f02d25ccdfc.pdf
│   │   │   ├── d6e24627-53c2-4491-bed6-2b9ec495fa19.pdf
│   │   │   ├── d91e6a27-2075-4d85-966c-bfc78ca693f5.pdf
│   │   │   ├── eb99e5fb-8d39-44b5-bc7b-56a70eb52cb2.pdf
│   │   │   ├── f8469b15-9890-4f38-bcf8-6e81c7298aef.pdf
│   │   │   ├── fa95f85a-a22c-474b-873d-1a08bfcf589f.pdf
│   │   │   └── ffc9b266-1536-4a14-947e-8941c9fbc04c.pdf
│   │   ├── files/
│   │   │   ├── reviews/
│   │   │   ├── 091fc50f-09a3-4a48-806e-34731bc87fc0.pdf
│   │   │   ├── 5545c0a7-c6fe-4938-98a8-a82e52028626.pdf
│   │   │   └── eb99e5fb-8d39-44b5-bc7b-56a70eb52cb2.pdf
│   │   └── images/
│   │       ├── 269bfda1-6785-4a47-a9a5-a0c4aa9d9324.jpg
│   │       ├── 45b0201d-cadb-4c81-afd2-97ee3d4851db.jpg
│   │       ├── 7fb20705-59ea-4a50-b771-d02da7c2a553.jpg
│   │       ├── 8ec481b1-c76f-4015-83bc-cbf671f84f11.jpg
│   │       ├── 97ecb145-8fe1-44b8-9aae-b41978cf31eb.jpg
│   │       ├── a9d66a2f-0689-4f82-afed-2950465f91d4.jpg
│   │       ├── d38aa44b-932d-452e-84b3-1712b32c6053.jpg
│   │       ├── d8e814b2-3903-45c6-b420-c1c173b6f787.jpg
│   │       ├── deafc12a-bb6b-4f25-af7a-dec369b914e8.jpg
│   │       ├── e9c22b6f-a0d9-4b62-bb28-25abb8c71062.jpg
│   │       ├── f62fb50c-2ab4-4151-85fe-3db0809372c3.jpg
│   │       └── image.png
│   ├── routes/
│   │   └── api.js
│   ├── test/
│   │   ├── files/
│   │   │   └── proposal.pdf
│   │   ├── images/
│   │   │   ├── cat3.jpg
│   │   │   ├── images2.jpg
│   │   │   └── sample.jpg
│   │   ├── paper.http
│   │   ├── pdfUpload.http
│   │   ├── sample-team.http
│   │   ├── team.http
│   │   └── upload-news.http
│   ├── transform/
│   │   └── newApiTransform.js
│   ├── utils/
│   │   ├── cacheKeys.js
│   │   └── helper.js
│   ├── validations/
│   │   ├── admin/
│   │   │   ├── assignmentValidation.js
│   │   │   └── reviewerValidation.js
│   │   ├── reviewer/
│   │   │   └── reviewValidation.js
│   │   ├── teacher/
│   │   │   ├── paperValidation.js
│   │   │   ├── proposalValidation.js
│   │   │   └── teamValidation.js
│   │   ├── CustomErrorReporter.js
│   │   ├── authValidation.js
│   │   └── newsValidation.js
│   ├── .env 🚫 (auto-hidden)
│   ├── README.md
│   ├── combined.log 🚫 (auto-hidden)
│   ├── error.log 🚫 (auto-hidden)
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── node_modules/ 🚫 (auto-hidden)
│   ├── public/
│   │   ├── icons.png
│   │   ├── image1.png
│   │   ├── search.png
│   │   └── vite.svg
│   ├── src/
│   │   ├── AuthenticatePages/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignUpForm.jsx
│   │   │   └── VerifyPendingPage.jsx
│   │   ├── Data/
│   │   │   ├── assignedPapers.js
│   │   │   └── reviewerStatus.js
│   │   ├── Pages/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminHome.jsx
│   │   │   │   ├── AdminPapers.jsx
│   │   │   │   ├── AdminProposal.jsx
│   │   │   │   ├── ReviewCommittee.jsx
│   │   │   │   ├── TeamDetail.jsx
│   │   │   │   ├── Teams.jsx
│   │   │   │   └── WaitingAssignment.jsx
│   │   │   ├── Reviewer/
│   │   │   │   ├── AssignedPapersPage.jsx
│   │   │   │   ├── AssignedProposalsPage.jsx
│   │   │   │   ├── PaperReviewPage.jsx
│   │   │   │   ├── ReviewHistoryPage.jsx
│   │   │   │   ├── ReviewerDashboard.jsx
│   │   │   │   ├── ReviewerLayout.jsx
│   │   │   │   └── SubmissionTable.jsx
│   │   │   ├── Student/
│   │   │   │   ├── MyTeams.jsx
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── StudentLayout.jsx
│   │   │   │   ├── StudentMyPapers.jsx
│   │   │   │   ├── StudentTeamDetails.jsx
│   │   │   │   └── Untitled-2.md
│   │   │   ├── Teacher/
│   │   │   │   ├── CreateTeam.jsx
│   │   │   │   ├── MyPapers.jsx
│   │   │   │   ├── SubmissionHistory.jsx
│   │   │   │   ├── TeacherDashboard.jsx
│   │   │   │   ├── TeacherLayout.jsx
│   │   │   │   ├── TeamDetails.jsx
│   │   │   │   └── TeamManagement.jsx
│   │   │   ├── home/
│   │   │   │   └── Homepage.jsx
│   │   │   └── landingpage/
│   │   │       └── LandingPage.jsx
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AddReviewerModal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── PaperCard.jsx
│   │   │   │   ├── PapersCard.jsx
│   │   │   │   ├── RecentActivity.jsx
│   │   │   │   ├── ReviewerRow.jsx
│   │   │   │   ├── TeamDescriptionCard.jsx
│   │   │   │   ├── TeamMembersCard.jsx
│   │   │   │   └── TeamsPapersCard.jsx
│   │   │   ├── Common/
│   │   │   │   ├── ChartCard.jsx
│   │   │   │   ├── CommonButton.jsx
│   │   │   │   ├── CommonSubmissionTable.jsx
│   │   │   │   ├── FilterBar.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── LogoutModal.jsx
│   │   │   │   ├── MemberList.jsx
│   │   │   │   ├── PaperCard.jsx
│   │   │   │   ├── RecentSubmission.jsx
│   │   │   │   ├── ReviewTable.jsx
│   │   │   │   ├── ReviewerWorkload.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── TeamCard.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   ├── Home/
│   │   │   │   ├── AcceptedPaper.jsx
│   │   │   │   ├── Conferences.jsx
│   │   │   │   └── Header.jsx
│   │   │   ├── Reviewer/
│   │   │   │   ├── AssignedItemsPage.jsx
│   │   │   │   └── AssignedPapersTable.jsx
│   │   │   ├── Student/
│   │   │   │   └── MemberList.jsx
│   │   │   ├── Teacher/
│   │   │   │   ├── CreateTeam/
│   │   │   │   │   ├── BasicInfoForm.jsx
│   │   │   │   │   ├── DocumentUpload.jsx
│   │   │   │   │   ├── FormActions.jsx
│   │   │   │   │   ├── MemberManager.jsx
│   │   │   │   │   ├── TeamSettings.jsx
│   │   │   │   │   └── UploadModal.jsx
│   │   │   │   ├── MyPapers/
│   │   │   │   │   └── SubmitPaperModal.jsx
│   │   │   │   ├── TeamManagement/
│   │   │   │   │   ├── Comment.jsx
│   │   │   │   │   ├── DocumentList.jsx
│   │   │   │   │   ├── MemberList.jsx
│   │   │   │   │   ├── PaperUpload.jsx
│   │   │   │   │   └── PendingApplication.jsx
│   │   │   │   ├── SubmissionTable.jsx
│   │   │   │   └── TeamActivity.jsx
│   │   │   └── landingPage/
│   │   │       ├── FooterSection.jsx
│   │   │       ├── HeroSection.jsx
│   │   │       ├── JoinSection.jsx
│   │   │       └── LockSection.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── node_modules/ 🚫 (auto-hidden)
├── .gitignore
├── Untitled-1.md
├── bfg-1.15.0.jar
├── package-lock.json
└── package.json
```

---
*Generated by FileTree Pro Extension*
