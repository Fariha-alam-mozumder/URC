import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/home/Homepage";
import LandingPage from "./pages/landingpage/LandingPage";
import ReviewerDashboard from './Pages/Reviewer/reviewerDashboard';
import ReviewerHome from './Pages/Reviewer/ReviewerHome';
import AssignedPapersPage from './Pages/Reviewer/AssignedPapersPage';
import AssignedProposalsPage from './Pages/Reviewer/AssignedProposalsPage';
import PaperReviewPage from './Pages/Reviewer/PaperReviewPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ReviewHistoryPage from './Pages/Reviewer/ReviewHistoryPage';
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import TeamManagement from "./Pages/Teacher/TeamManagement";
import CreateTeam from "./Pages/Teacher/CreateTeam";
import TeamDetails from "./Pages/Teacher/TeamDetails";
import MyPapers from "./Pages/Teacher/MyPapers";
import SubmissionHistory from "./Pages/Teacher/SubmissionHistory";
import TeacherLayout from "./Pages/Teacher/TeacherLayout";
import StudentLayout from "./Pages/Student/StudentLayout";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import MyTeams from "./Pages/Student/MyTeams";
import StudentTeamDetails from "./Pages/Student/StudentTeamDetails";
import StudentMyPapers from "./Pages/Student/StudentMyPapers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
       
        <Route path="/ReviewerDashboard" element={<ReviewerDashboard />}>
          <Route index element={<Homepage />} />
           <Route path="reviewer/dashboard" element={<ReviewerHome />} />
          <Route path="reviewer/home" element={<Homepage />} />
          <Route path="assignedpapers" element={<AssignedPapersPage />} />
          <Route path="assigned-proposals" element={<AssignedProposalsPage />} />
          <Route path="review/:paperId" element={<PaperReviewPage />} />
          <Route path="reviewpage/:PaperId" element={<PaperReviewPage />} />
          <Route path="ReviewHistoryPage" element={<ReviewHistoryPage />} />
        </Route>

         <Route path="/teacher" element={<TeacherLayout />}>
          {/* Default page for /teacher is dashboard */}
          <Route index element={<Homepage />} />
          <Route path="teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="teacher/home" element={<Homepage />} />
          <Route path="teacher/team" element={<TeamManagement />} />
          <Route path="team/create" element={<CreateTeam />} />
          <Route path="team/:id" element={<TeamDetails />} />
          <Route path="mypapers" element={<MyPapers />} />
          <Route path="teacher/history" element={<SubmissionHistory />} />
        </Route>
        <Route path="/student" element={<StudentLayout />}>
          {/* Default page for /teacher is dashboard */}
          <Route index element={<Homepage />} />
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/home" element={<Homepage />} />
          <Route path="student/team" element={<MyTeams />} />
          <Route path="team/:id" element={<StudentTeamDetails />} />
          <Route path="student/mypapers" element={<StudentMyPapers />} />
          {/* <Route path="team/create" element={<CreateTeam />} />
          
          <Route path="mypapers" element={<MyPapers />} />
          <Route path="teacher/history" element={<SubmissionHistory />} /> */} 
        </Route>


        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
