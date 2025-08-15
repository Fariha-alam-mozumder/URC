
import AcceptedPaper from '../../components/home/AcceptedPaper';
import Conferences from '../../components/home/Conferences';
import Header from '../../components/home/header'; 


function Homepage() {
  return (
    <div className='mt-0'>
       <Header />
       <AcceptedPaper/>
       <Conferences/>
    </div>
  );
}
export default Homepage;