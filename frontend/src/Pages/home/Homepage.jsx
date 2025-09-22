import AcceptedPaper from "../../components/home/AcceptedPaper";
import Header from "../../components/home/Header";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="mt-0">
      <Header />
      <AcceptedPaper
        user={user}
        token={token}
        onNavigateToLogin={() => navigate("/login")}
      />
    </div>
  );
}
export default Homepage;
