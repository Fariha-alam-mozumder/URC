# File Tree: backend

Generated on: 9/15/2025, 7:25:35 PM
Root path: `d:\URCMS\URC\backend`

backend`
├── DB/
│   ├── db.config.js
│   ├── redis.client.js
│   └── redis.config.js
├── config/
│   ├── filesystem.js
│   ├── logger.js
│   ├── mailer.js
│   ├── queue.js
│   └── ratelimiter.js
├── controllers/
│   ├── admin/
│   │   ├── AdminPaperController.js
│   │   ├── AssignmentController.js
│   │   ├── DepartmentController.js
│   │   ├── RecentSubmission.js
│   │   ├── ReviewerController.js
│   │   ├── ReviewerWorkloadController.js
│   │   ├── StatsController.js
│   │   ├── StatusDistributionController.js
│   │   ├── SubmissionTrendsController.js
│   │   └── TeamController.js
│   ├── landing/
│   │   └── landingControlleer.js
│   ├── reviewer/
│   │   ├── AssignedController.js
│   │   ├── ReviewController.js
│   │   ├── ReviewHistoryController.js
│   │   ├── ReviewerMeController.js
│   │   ├── SettingsController.js
│   │   └── reviewAssignController.js
│   ├── student/
│   │   └── StudentTeamController.js
│   ├── teacher/
│   │   ├── PaperController.js
│   │   ├── ProposalController.js
│   │   ├── SubmissionsController.js
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
│   ├── adminOnly.js
│   └── reviewerOnly.js
├── node_modules/ 🚫 (auto-hidden)
├── prisma/
│   ├── migrations/
│   │   ├── 20250912211835_init/
│   │   │   └── migration.sql
│   │   ├── 20250913211136_reviewdata/
│   │   │   └── migration.sql
│   │   ├── 20250914183041_add_reviewer_max_assignments/
│   │   │   └── migration.sql
│   │   ├── 20250914191243_add_capacity_and_self_pause/
│   │   │   └── migration.sql
│   │   ├── 20250914225409_removed_status_and_max/
│   │   │   └── migration.sql
│   │   ├── 20250915004304_removed_paper_status/
│   │   │   └── migration.sql
│   │   ├── 20250915104357_paper_status/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   ├── seed.js
│   ├── seed.sql
│   └── urcms.sql
├── public/
│   ├── documents/
│   │   ├── 0e803c82-15cc-478f-8467-aba696ceb572.pdf
│   │   ├── 1adbb05c-ca99-4514-9de6-2e897afaafd1.pdf
│   │   ├── 1d268f79-5ebe-4184-98a9-099ed6abb310.docx
│   │   ├── 24cde354-2e97-417f-a77a-7e92ac16e917.pdf
│   │   ├── 
│   └── images/
│       ├── 10856182-61de-4e23-8ddc-313c6a084dec.png
│       ├── 269bfda1-6785-4a47-a9a5-a0c4aa9d9324.jpg
│       ├── 3e738892-e3c9-4864-b5d9-f3bc7634d739.png
│       ├── 3f6be434-7138-4f10-88f9-6e09e7391ef7.png

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
│   ├── review.http
│   ├── sample-team.http
│   ├── team.http
│   └── upload-news.http
├── transform/
│   └── newApiTransform.js
├── utils/
│   ├── assignmentAggregate.js
│   ├── autoStatus.js
│   ├── cacheKeys.js
│   ├── decisionAggregate.js
│   ├── finalizeIfCompleted.js
│   ├── helper.js
│   └── workload.js
├── validations/
│   ├── admin/
│   │   ├── RecentSubmissionValidation.js
│   │   ├── assignmentValidation.js
│   │   └── reviewerValidation.js
│   ├── reviewer/
│   │   └── reviewValidation.js
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
├── login.http
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
│   │   ├── ProfileData.js
│   │   ├── assignedPapers.js
│   │   └── reviewerStatus.js
│   ├── Pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminHome.jsx
│   │   │   ├── AdminPapers.jsx
│   │   │   ├── AdminProposal.jsx
│   │   │   ├── AdminTeamDetails.jsx
│   │   │   ├── ReviewCommittee.jsx
│   │   │   ├── Teams.jsx
│   │   │   └── WaitingAssignment.jsx
│   │   ├── Landing/
│   │   │   └── LandingPage.jsx
│   │   ├── Preference/
│   │   │   └── PreferencePage.jsx
│   │   ├── Profile/
│   │   │   └── ProfilePage.jsx
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
│   │   │   ├── StudentMyProposals.jsx
│   │   │   └── StudentTeamDetails.jsx
│   │   ├── Teacher/
│   │   │   ├── CreateTeam.jsx
│   │   │   ├── MyPapers.jsx
│   │   │   ├── MyProposals.jsx
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
│   │   │   ├── AdminRecentSubmissions.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── PaperCard.jsx
│   │   │   ├── PapersCard.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── ReviewerRow.jsx
│   │   │   ├── StatusDistributionChart.jsx
│   │   │   ├── SubmissionTrends.jsx
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
│   │   │   ├── PdfViewerModal.jsx
│   │   │   ├── RecentSubmission.jsx
│   │   │   ├── ReviewTable.jsx
│   │   │   ├── ReviewerWorkload.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TeamActivity.jsx
│   │   │   ├── TeamCard.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── statcard.jsx
│   │   ├── Preference/
│   │   │   ├── AdditionalPreferences.jsx
│   │   │   ├── Department.jsx
│   │   │   └── ResearchFields.jsx
│   │   ├── Profile/
│   │   │   ├── AvatarPicker.jsx
│   │   │   ├── EditButton.jsx
│   │   │   ├── PersonalInfo.jsx
│   │   │   ├── ProfileHeader.jsx
│   │   │   └── ResearchStats.jsx
│   │   ├── Reviewer/
│   │   │   ├── AssignedItemsPage.jsx
│   │   │   └── AssignedPapersTable.jsx
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
│   │   │   └── SubmissionTable.jsx
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
├── .env 🚫 (auto-hidden)
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```