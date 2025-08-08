
import AcceptedPaper from '../../components/home/AcceptedPaper';
import Conferences from '../../components/home/Conferences';
import Header from '../../components/home/header';

function Homepage() {
  return (
    <div>
       <Header />
       <AcceptedPaper/>
       <Conferences/>
    </div>
  );
}
export default Homepage;