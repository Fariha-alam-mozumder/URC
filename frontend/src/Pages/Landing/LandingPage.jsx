import { useRef } from "react";
import AcceptedPaper from "../../components/home/AcceptedPaper";
import Footer from "../../components/landingPage/FooterSection";
import HeroSection from "../../components/landingPage/HeroSection";
import JoinSection from "../../components/landingPage/JoinSection";
import LockSection from "../../components/landingPage/LockSection";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const acceptedPapersRef = useRef(null);

  // Function to scroll smoothly to Accepted Papers
  const scrollToAcceptedPapers = () => {
    acceptedPapersRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pass scroll function as prop */}
      <HeroSection onBrowseClick={scrollToAcceptedPapers} />

      {/* Section reference with enhanced spacing */}
      <div ref={acceptedPapersRef} className="scroll-mt-20">
        <AcceptedPaper
          user={user}
          token={token}
          onNavigateToLogin={() => navigate("/login")}
        />
      </div>

      <LockSection />
      <JoinSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
