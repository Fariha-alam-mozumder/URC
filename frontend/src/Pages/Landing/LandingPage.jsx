import { useRef } from "react";
import AcceptedPaper from '../../components/home/AcceptedPaper';
import Conferences from '../../components/home/Conferences';
import Footer from '../../components/landingPage/FooterSection';
import HeroSection from '../../components/landingPage/HeroSection';
import JoinSection from '../../components/landingPage/JoinSection';
import LockSection from '../../components/landingPage/LockSection';

function LandingPage() {
  const acceptedPapersRef = useRef(null);

  // Function to scroll smoothly to Accepted Papers
  const scrollToAcceptedPapers = () => {
    acceptedPapersRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
     <div>
      {/* Pass scroll function as prop */}
      <HeroSection onBrowseClick={scrollToAcceptedPapers} />

      {/* Section reference */}
      <div ref={acceptedPapersRef}>
        <AcceptedPaper />
      </div>
      {/* <Conferences/> */}
      <LockSection/>
      <JoinSection/>
      <Footer/>
    </div>
  );
}
export default LandingPage;