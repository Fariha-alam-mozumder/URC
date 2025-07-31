import SignUpForm from "./AuthenticationPages/SignUpForm";
import LandingPage from "./AuthenticationPages/LandingPage";
import LoginForm from "./AuthenticationPages/LoginForm"
import Dashboard from './Pages/Dashboard';
import ReviewerDashboard from './Pages/reviewerDashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/reviewer" element={<ReviewerDashboard />} />

      </Routes>
    </Router>
  );
}


