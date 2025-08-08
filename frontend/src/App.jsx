
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReviewerDashboard from './Pages/Reviewer/reviewerDashboard';
import ReviewerHome from './Pages/Reviewer/ReviewerHome';
import AssignedPapersPage from './Pages/Reviewer/AssignedPapersPage';
import AssignedProposalsPage from './Pages/Reviewer/AssignedProposalsPage';
import PaperReviewPage from './Pages/Reviewer/PaperReviewPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ReviewHistoryPage from './Pages/Reviewer/ReviewHistoryPage';


export default function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/ReviewerDashboard" element={<ReviewerDashboard />}>
          <Route index element={<ReviewerHome />} />
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


