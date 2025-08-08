import AcceptedPaper from '../../components/home/AcceptedPaper';
import Conferences from '../../components/home/Conferences';
import Footer from '../../components/landingPage/FooterSection';
import HeroSection from '../../components/landingPage/HeroSection';
import JoinSection from '../../components/landingPage/JoinSection';
import LockSection from '../../components/landingPage/LockSection';

function LandingPage() {
  return (
    <div>
      <HeroSection/>
      <AcceptedPaper/>
      <Conferences/>
      <LockSection/>
      <JoinSection/>
      <Footer/>
    </div>
  );
}
export default LandingPage;