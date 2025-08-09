import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/home/Homepage";
import LandingPage from "./pages/landingpage/LandingPage";
import ReviewerDashboard from './Pages/Reviewer/reviewerDashboard';
import ReviewerHome from './Pages/Reviewer/ReviewerHome';
import AssignedPapersPage from './Pages/Reviewer/AssignedPapersPage';
import AssignedProposalsPage from './Pages/Reviewer/AssignedProposalsPage';

import AdminDashboard from './Pages/Admin/AdminDashboard';
import ReviewHistoryPage from './Pages/Reviewer/ReviewHistoryPage';
import ResearchPreferences from "./pages/Profile/Profile"; // ⬅ Added
import PaperReviewPage from "./pages/Reviewer/PaperReviewPage";
import Modal from "./pages/Profile/Modal";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

         <Route path="/modal" element={<Modal />} />
        <Route
          path="/Profile"
          element={ <ResearchPreferences />}
        />
       

        {/* Reviewer Dashboard Routes */}
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

        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
