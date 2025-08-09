import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext.jsx";

import LandingPage from "./pages/landingpage/LandingPage";

// Reviewer pages
import ReviewerDashboard from "./Pages/Reviewer/reviewerDashboard";
import ReviewerHome from "./Pages/Reviewer/ReviewerHome";
import AssignedPapersPage from "./Pages/Reviewer/AssignedPapersPage";
import AssignedProposalsPage from "./Pages/Reviewer/AssignedProposalsPage";
import PaperReviewPage from "./Pages/Reviewer/PaperReviewPage";
import ReviewHistoryPage from "./Pages/Reviewer/ReviewHistoryPage";

// Teacher pages
import TeacherLayout from "./Pages/Teacher/TeacherLayout";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import TeamManagement from "./Pages/Teacher/TeamManagement";
import CreateTeam from "./Pages/Teacher/CreateTeam";
import TeamDetails from "./Pages/Teacher/TeamDetails";
import MyPapers from "./Pages/Teacher/MyPapers";
import SubmissionHistory from "./Pages/Teacher/SubmissionHistory";

// Admin page
import AdminDashboard from "./Pages/Admin/AdminDashboard";

// Auth pages
import SignUpForm from "./AuthenticatePages/SignUpForm";
import LoginForm from "./AuthenticatePages/LoginForm";

// PrivateRoute component for route protection
import PrivateRoute from "./context/PrivateRoute";

//! Role-based redirection component
function RoleBasedRedirect() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (user.isMainAdmin || user.role === "ADMIN") {
    return <Navigate to="/admin" />;
  } else if (
    ["REVIEWER", "TEACHER", "STUDENT", "GENERALUSER"].includes(user.role)
  ) {
    // You can improve this if STUDENT and GENERALUSER go elsewhere
    return <Navigate to="/reviewer" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Redirect to role-based dashboard */}
          <Route path="/home" element={<RoleBasedRedirect />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Reviewer Protected Routes */}
          <Route
            path="/reviewer"
            element={
              <PrivateRoute allowedRoles={["REVIEWER", "STUDENT", "GENERALUSER", "TEACHER"]}>
                <ReviewerDashboard />
              </PrivateRoute>
            }
          >
            {/* Nested routes under /reviewer */}
            <Route index element={<ReviewerHome />} />
            <Route path="reviewer/dashboard" element={<ReviewerHome />} />
            <Route path="reviewer/home" element={<ReviewerHome />} />
            <Route path="assignedpapers" element={<AssignedPapersPage />} />
            <Route path="assigned-proposals" element={<AssignedProposalsPage />} />
            <Route path="review/:paperId" element={<PaperReviewPage />} />
            <Route path="reviewpage/:PaperId" element={<PaperReviewPage />} />
            <Route path="ReviewHistoryPage" element={<ReviewHistoryPage />} />
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
            {/* Nested routes under /teacher */}
            <Route index element={<TeacherDashboard />} />
            <Route path="teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="teacher/home" element={<TeacherDashboard />} />
            <Route path="teacher/team" element={<TeamManagement />} />
            <Route path="team/create" element={<CreateTeam />} />
            <Route path="team/:id" element={<TeamDetails />} />
            <Route path="mypapers" element={<MyPapers />} />
            <Route path="teacher/history" element={<SubmissionHistory />} />
          </Route>

          {/* Catch all: redirect unknown paths to landing or login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}