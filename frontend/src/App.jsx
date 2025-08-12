import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";

import LandingPage from "./pages/landingpage/LandingPage";

//! Reviewer pages
import ReviewerLayout from "./Pages/Reviewer/ReviewerLayout.jsx";
import ReviewerDashboard from "./Pages/Reviewer/ReviewerDashboard.jsx";
import AssignedPapersPage from "./Pages/Reviewer/AssignedPapersPage";
import AssignedProposalsPage from "./Pages/Reviewer/AssignedProposalsPage";
import PaperReviewPage from "./Pages/Reviewer/PaperReviewPage";
import ReviewHistoryPage from "./Pages/Reviewer/ReviewHistoryPage";

//! Teacher pages
import TeacherLayout from "./Pages/Teacher/TeacherLayout";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import TeamManagement from "./Pages/Teacher/TeamManagement";
import CreateTeam from "./Pages/Teacher/CreateTeam";
import TeamDetails from "./Pages/Teacher/TeamDetails";
import MyPapers from "./Pages/Teacher/MyPapers";
import SubmissionHistory from "./Pages/Teacher/SubmissionHistory";

//! Student pages
import StudentLayout from "./Pages/Student/StudentLayout";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import MyTeams from "./Pages/Student/MyTeams";
import StudentTeamDetails from "./Pages/Student/StudentTeamDetails";
import StudentMyPapers from "./Pages/Student/StudentMyPapers";

//! Admin page
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminHome from "./Pages/Admin/AdminHome";

//! Auth pages
import SignUpForm from "./AuthenticatePages/SignUpForm.jsx";
import LoginForm from "./AuthenticatePages/LoginForm.jsx";
import VerifyPending from "./AuthenticatePages/VerifyPendingPage.jsx";

//! PrivateRoute component for route protection
import PrivateRoute from "./context/PrivateRoute.jsx";
import Homepage from "./Pages/home/Homepage";

//! Role-based redirection component
function RoleBasedRedirect() {
  const { loading, user, currentViewRole } = useContext(AuthContext);

  if (loading) {
    // You can render a spinner or blank screen until auth is loaded
    return <div>Loading...</div>;
  }

  console.log("RoleBasedRedirect currentViewRole:", currentViewRole);
  if (!user) return <Navigate to="/" />;

  if (!user.emailVerified) {
    return <Navigate to="/verify" />;
  }
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
    return <Navigate to="/home" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify" element={<VerifyPending />} />

          {/* Optional: root /home redirects to role-based home */}
          <Route path="/home" element={<RoleBasedRedirect />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="dashboard" element={<AdminDashboard  />} />
          </Route>

          {/* Reviewer Protected Routes */}
          <Route
            path="/reviewer"
            element={
              <PrivateRoute allowedRoles={["REVIEWER"]}>
                <ReviewerLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Homepage />} />
            <Route path="dashboard" element={<ReviewerDashboard />} />
            <Route path="assignedpapers" element={<AssignedPapersPage />} />
            <Route
              path="assignedproposals"
              element={<AssignedProposalsPage />}
            />
            <Route path="review/:paperId" element={<PaperReviewPage />} />
            <Route path="reviewpage/:PaperId" element={<PaperReviewPage />} />
            <Route path="reviewhistory" element={<ReviewHistoryPage />} />
          </Route>

          {/* Teacher Protected Routes */}
          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedRoles={["TEACHER"]}>
                <TeacherLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Homepage />} />
            <Route path="dashboard" element={<TeacherDashboard />} />

            <Route path="team">
              <Route index element={<TeamManagement />} />
              <Route path="create" element={<CreateTeam />} />
              <Route path=":id" element={<TeamDetails />} />
            </Route>

            <Route path="mypapers" element={<MyPapers />} />
            <Route path="history" element={<SubmissionHistory />} />
          </Route>

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <PrivateRoute allowedRoles={["STUDENT"]}>
                <StudentLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Homepage />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="team" element={<MyTeams />} />
            <Route path="team/:id" element={<StudentTeamDetails />} />
            <Route path="mypapers" element={<StudentMyPapers />} />
          </Route>

          

          {/* Catch all unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
