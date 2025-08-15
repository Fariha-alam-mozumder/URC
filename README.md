# University Research Cell (URC) Management System

A full-stack web application for managing university research activities — including proposals, papers, teams, schedules, and reviewer assignments — with role-based access for **Admin**, **Teacher**, **Student**, **Reviewer**, and **General User**.

---

## Features

### Authentication & Authorization
- JWT-based authentication.
- Role-based route protection for Admin, Teacher, Student, and Reviewer.
- Secure login & registration with password hashing.

### Teacher Features
- Create and manage research teams.
- Upload proposals & final papers.
- View reviewer feedback.
- Track submission status.

### Student Features
- Join teams via invitation or request.
- Upload documents to assigned projects.
- View reviewer feedback.
- Track submission status.

### Reviewer Features
- View assigned proposals and papers.
- Submit reviews and scoring.
- Add comments and feedback for teams.

### Admin Features
- Manage all teams, proposals, and papers.
- Assign roles to users.
- Generate reports and analytics.

---

## Tech Stack

### **Frontend**
- [React.js](https://react.dev/) + Vite
- [Tailwind CSS](https://tailwindcss.com/) for styling
- React Router DOM for navigation
- Axios for API requests
- Context API for global state (AuthContext)
  
### **Backend**
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- [Rate Limiter](https://www.npmjs.com/package/express-rate-limit) for API protection
- [Nodemailer](https://nodemailer.com/) for email notifications
- [Winston](https://github.com/winstonjs/winston) for structured logging
- JWT for authentication
- Redis for caching

### **Database**
- PostgreSQL

---

## 📂 File Upload System

### **Document Uploads**
- Supported formats:
  - PDF (`application/pdf`)
  - Word `.doc` (`application/msword`)
  - Word `.docx` (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- Maximum size: **5 MB**
- Stored inside `/public/documents`

### **Image Uploads**
- Supported formats:
  - PNG, JPG, JPEG, GIF, SVG, WebP
- Stored in `/public/images` (configurable)

---
## 📂 Project Structure

```
├── .git/ 🚫 (auto-hidden)
├── backend/
│   ├── DB/
│   │   ├── db.config.js
│   │   └── redis.config.js
│   ├── config/
│   │   ├── filesystem.js
│   │   ├── logger.js
│   │   ├── mailer.js
│   │   ├── queue.js
│   │   └── ratelimiter.js
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── AdminProposalController.js
│   │   │   ├── AssignmentController.js
│   │   │   └── ReviewerController.js
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
│   │   └── adminOnly.js
│   ├── node_modules/ 🚫 (auto-hidden)
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── seed.sql
│   ├── public/
│   │   ├── documents/
│   │   └── images/
│   ├── routes/
│   │   └── api.js
│   ├── transform/
│   │   └── newApiTransform.js
│   ├── utils/
│   │   └── helper.js
│   ├── validations/
│   │   ├── admin/
│   │   │   ├── assignmentValidation.js
│   │   │   └── reviewerValidation.js
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
│   │   │   │   └── StudentTeamDetails.jsx
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
│   │   │   │   ├── TeamCard.jsx
│   │   │   │   ├── Topbar.jsx
│   │   │   │   └── statcard.jsx
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
│   │   │   ├── home/
│   │   │   │   ├── AcceptedPaper.jsx
│   │   │   │   ├── Conferences.jsx
│   │   │   │   └── Header.jsx
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
├── package-lock.json
└── package.json
```

---

## Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/Fariha-alam-mozumder/URC.git
cd URC
```
### Backend Setup
```bash
cd backend
npm install
```
### Create a .env file in the backend folder:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/urc"
JWT_SECRET="your_jwt_secret"
REDIS_URL="redis://localhost:6379"
MAIL_HOST="smtp.yourmail.com"
MAIL_PORT=587
MAIL_USER="your_email@example.com"
MAIL_PASS="your_password"
```
### Run Prisma migrations:
```bash
npx prisma migrate dev
```
### Start backend:
```bash
npm run server
```
### Frontend Setup:
```bash
cd frontend
npm install
```
### Start frontend:
```bash
npm run dev
```
