
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/home/Homepage";
import LandingPage from "./pages/landingpage/LandingPage";



function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;


