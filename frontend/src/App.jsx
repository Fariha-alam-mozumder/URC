import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext.jsx";

import LandingPage from "./Pages/Landing/LandingPage.jsx";
import SignUpForm from "./AuthenticatePages/SignUpForm.jsx";
import LoginForm from "./AuthenticatePages/LoginForm.jsx";
import VerifyPending from "./AuthenticatePages/VerifyPendingPage.jsx";

// !Reviewer
import ReviewerLayout from "./Pages/Reviewer/ReviewerLayout.jsx";
import ReviewerDashboard from "./Pages/Reviewer/ReviewerDashboard.jsx";
import AssignedPapersPage from "./Pages/Reviewer/AssignedPapersPage";
import AssignedProposalsPage from "./Pages/Reviewer/AssignedProposalsPage";
import PaperReviewPage from "./Pages/Reviewer/PaperReviewPage";
import ReviewHistoryPage from "./Pages/Reviewer/ReviewHistoryPage";

//! Teacher pages
import TeacherLayout from "./Pages/Teacher/TeacherLayout.jsx";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import TeamManagement from "./Pages/Teacher/TeamManagement";
import CreateTeam from "./Pages/Teacher/CreateTeam";
import TeamDetails from "./Pages/Teacher/TeamDetails";
import MyPapers from "./Pages/Teacher/MyPapers";
import SubmissionHistory from "./Pages/Teacher/SubmissionHistory";
import MyProposals from "./Pages/Teacher/MyProposals.jsx";

//! Student pages
import StudentLayout from "./Pages/Student/StudentLayout";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import MyTeams from "./Pages/Student/MyTeams";
import StudentTeamDetails from "./Pages/Student/StudentTeamDetails";
import StudentMyPapers from "./Pages/Student/StudentMyPapers.jsx";
import StudentMyProposals from "./Pages/Student/StudentMyProposals.jsx";

//! Admin
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminHome from "./Pages/Admin/AdminHome";
import AdminPapers from "./Pages/Admin/AdminPapers";
import AdminProposals from "./Pages/Admin/AdminProposal";
import WaitingAssignment from "./Pages/Admin/WaitingAssignment";
import ReviewerCommittee from "./Pages/Admin/ReviewCommittee";
import TeamsPage from "./Pages/Admin/Teams";
import AdminTeamDetails from "./Pages/Admin/AdminTeamDetails";

//! Auth and utils
import PrivateRoute from "./context/PrivateRoute.jsx";
import Homepage from "./Pages/Home/Homepage.jsx";
import ProfilePage from "./Pages/Profile/ProfilePage.jsx";
import PreferencePage from "./Pages/Preference/PreferencePage.jsx";


function RoleBasedRedirect() {
  const { loading, user, currentViewRole } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (!user.emailVerified) return <Navigate to="/verify" />;

  console.log("User object:", user);
  console.log("user.emailVerified:", user?.emailVerified);

  if (currentViewRole === "ADMIN" || user.isMainAdmin) {
    return <Navigate to="/admin/home" />;
  } else if (currentViewRole === "REVIEWER") {
    return <Navigate to="/reviewer/home" />;
  } else if (currentViewRole === "TEACHER") {
    return <Navigate to="/teacher/home" />;
  } else if (currentViewRole === "STUDENT") {
    return <Navigate to="/student/home" />;
  } else if (currentViewRole === "GENERALUSER") {
    return <Navigate to="/generaluser/home" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify" element={<VerifyPending />} />
          <Route path="/home" element={<RoleBasedRedirect />} />
          
          {/* Profile and Preferences - No role parameter needed */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute allowedRoles={["ADMIN", "TEACHER", "REVIEWER", "STUDENT", "GENERALUSER"]}>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/preferences" 
            element={
              <PrivateRoute allowedRoles={["ADMIN", "TEACHER", "REVIEWER", "STUDENT", "GENERALUSER"]}>
                <PreferencePage />
              </PrivateRoute>
            } 
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="home" element={<Homepage />} />
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="all-papers" element={<AdminPapers />} />
            <Route path="proposals" element={<AdminProposals />} />
            <Route path="waitingassignment" element={<WaitingAssignment />} />
            <Route path="reviewercommittee" element={<ReviewerCommittee />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="teams/:id" element={<AdminTeamDetails />} />
          </Route>

          {/* Reviewer */}
          <Route
            path="/reviewer"
            element={
              <PrivateRoute allowedRoles={["REVIEWER"]}>
                <ReviewerLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="home" element={<Homepage />} />
            <Route path="dashboard" element={<ReviewerDashboard />} />
            <Route path="assignedpapers" element={<AssignedPapersPage />} />
            <Route
              path="assignedproposals"
              element={<AssignedProposalsPage />}
            />
            <Route path="review/:paperId" element={<PaperReviewPage />} />
            <Route path="reviewhistory" element={<ReviewHistoryPage />} />
          </Route>

          {/* Teacher */}
          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedRoles={["TEACHER"]}>
                <TeacherLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="home" element={<Homepage />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="team/create" element={<CreateTeam />} />
            <Route path="team/:id" element={<TeamDetails />} />
            <Route path="myproposals" element={<MyProposals />} />
            <Route path="mypapers" element={<MyPapers />} />
            <Route path="history" element={<SubmissionHistory />} />
          </Route>

          {/* Student */}
          <Route
            path="/student"
            element={
              <PrivateRoute allowedRoles={["STUDENT"]}>
                <StudentLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="home" element={<Homepage />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="team" element={<MyTeams />} />
            <Route path="team/:id" element={<StudentTeamDetails />} />
            <Route path="mypapers" element={<StudentMyPapers />} />
            <Route path="mypapers" element={<StudentMyProposals />} />
            <Route path="myproposals" element={<StudentMyProposals />} />
          </Route>

          {/* General User */}
          <Route
            path="/generaluser"
            element={
              <PrivateRoute allowedRoles={["GENERALUSER"]}>
                <Homepage />
              </PrivateRoute>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="home" element={<Homepage />} />
          </Route>

          {/* General User */}
          <Route
            path="/generaluser"
            element={
              <PrivateRoute allowedRoles={["GENERALUSER"]}>
                <Homepage />
              </PrivateRoute>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="home" element={<Homepage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
