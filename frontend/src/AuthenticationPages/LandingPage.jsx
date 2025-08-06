import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaCalendarAlt, FaMapMarkerAlt, FaLock } from "react-icons/fa";

function LandingPage() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative w-full md:h-screen overflow-hidden">
        <img src="/image1.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-25" />
        <div className="relative z-10 h-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-10 text-black">
          <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-8 h-28 bg-gray-100 w-full">
            <img src="/search.png" className="w-12 h-8 sm:w-16 sm:h-10" />
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-black">University Research Cell</h1>
            <div className="flex space-x-2 sm:space-x-4">
              <Link to="/login" className="px-3 sm:px-4 py-2 bg-black hover:bg-gray-600 text-white rounded text-sm font-medium">Login</Link>
              <Link to="/signup" className="px-3 sm:px-4 py-2 bg-gray-300 hover:bg-gray-300 text-black rounded text-sm font-medium">Sign Up</Link>
            </div>
          </header>

          <main className="max-w-3xl mt-24 py-16 sm:mt-0 md:mt-40">
            <h2 className="text-xl sm:text-3xl md:text-4xl italic md:max-w-xl font-bold mb-6 max-w-xl">Where Ideas Meet Impact: Research, Collaborate, Innovate</h2>
            <p className="text-xl sm:text-xl md:text-xl max-w-xl italic mb-10">
              Discover groundbreaking research, connect with fellow researchers, and stay updated
              with the latest academic conferences from our university community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <button className="px-6 sm:px-8 py-3 md:px-44 md:py-4 bg-gray-800 hover:bg-gray-700 text-white rounded text-base md:text-xl md:font-bold font-large">
                Browse Accepted Papers
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Accepted Papers */}
      <section className="px-4 sm:px-6 lg:px-24 py-16 md:h-screen  bg-gray-200">
        <div className="flex flex-col md:flex-row justify-between  md:mt-28 items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Accepted Papers</h2>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <select className="border border-gray-300 rounded px-3 sm:px-4 py-2 text-sm">
              <option>All Departments</option>
              <option>Computer Science and Engineering</option>
              <option> Electrical Engineering</option>
              
            </select>
            <select className="border border-gray-300 rounded px-3 sm:px-4 py-2 text-sm">
              <option>All Topics</option>
              <option>AI</option>
              <option>Healthcare</option>
              <option>Quantum</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Deep Learning for Medical Diagnosis",
              authors: "Dr. Sarah Johnson, Dr. Michael Chen",
              department: "Computer Science Department",
              abstract: "Novel approaches to medical image analysis using deep neural networks...",
              tags: ["AI", "Medical"],
            },
            {
              title: "Quantum Computing Applications",
              authors: "Dr. Alex Thompson, Dr. Lisa Park",
              department: "Physics Department",
              abstract: "Exploring quantum algorithms for optimization problems...",
              tags: ["Quantum", "Computing"],
            },
            {
              title: "Robotics in Healthcare",
              authors: "Dr. Emily Rodriguez, Dr. James Wilson",
              department: "Engineering Department",
              abstract: "Development of autonomous robotic systems for surgical assistance...",
              tags: ["Robotics", "Healthcare"],
            },
          ].map((paper, idx) => (
            <div key={idx} className="bg-white border rounded-lg shadow-sm p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{paper.title}</h3>
                <p className="text-sm text-gray-700">{paper.authors}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{paper.department}</p>
              </div>
              <p className="text-sm text-gray-800">{paper.abstract}</p>
              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-sm text-gray-800 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
              <div className="flex space-x-4 pt-2">
                <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 text-sm">Read Abstract</button>
                <button className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100">Download PDF</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="border border-gray-300 px-6 py-2 text-white bg-gray-800 rounded text-sm hover:bg-gray-700">
            View All Papers
          </button>
        </div>
      </section>

      {/* Conferences */}
      <section className="bg-gray-50 px-4 md:h-screen  sm:px-6 lg:px-32 py-16">
        <h2 className="text-2xl sm:text-3xl md:py-14 font-bold text-center mb-10">Upcoming Conferences</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl  mx-auto">
          {[
            {
              title: "International AI Research Symposium 2025",
              date: "March 15–17, 2025",
              location: "Stanford University, California",
              desc: "Join leading researchers to discuss breakthroughs in AI and machine learning.",
            },
            {
              title: "Quantum Computing Workshop",
              date: "April 8–10, 2025",
              location: "Virtual Conference",
              desc: "Explore the future of quantum computing with workshops and expert talks.",
            },
          ].map((conf, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{conf.title}</h3>
              <div className="flex items-center text-gray-600 mb-1">
                <FaCalendarAlt className="mr-2" />
                <span>{conf.date}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <span>{conf.location}</span>
              </div>
              <p className="text-gray-700 mb-4">{conf.desc}</p>
              <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Lock Section */}
      <section className="bg-gray-900 text-white md:h-screen text-center px-4 py-20 sm:py-28">
        <div className="text-4xl md:mt-32  md:mb-4"><FaLock className="mx-auto md:mt-4" /></div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Access Full Research Content</h3>
        <p className="max-w-xl italic mx-auto px-4 mb-8">
          You can browse abstracts and conference info freely. To download full papers and access
          detailed research content, please create an account or sign in.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="bg-white text-gray-800 px-6 py-2 rounded hover:bg-gray-200">Sign Up Free</Link>
          <Link to="/login" className="bg-transparent border border-white px-6 py-2 rounded hover:bg-white hover:text-gray-800">Login</Link>
        </div>
      </section>

      {/* Join Section */}
      <section className="text-center px-4 md:h-screen sm:px-10 py-20 bg-gray-300">
        <h2 className="text-2xl sm:text-3xl md:mt-36 md:px-10 font-bold mb-16">Why Join Our Research Community?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-lg sm:text-xl">
          {[
            { icon: "⬆️", title: "Submit Research", desc: "Share your research findings and get peer feedback." },
            { icon: "👥", title: "Collaborate", desc: "Connect with researchers across departments." },
            { icon: "🔔", title: "Stay Updated", desc: "Receive notifications about new papers and conferences." },
            { icon: "⬇️", title: "Full Access", desc: "Download complete papers and access academic content." },
          ].map((item, index) => (
            <div key={index}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white md:h-screen px-6 sm:px-16 lg:px-40 py-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="text-base md:mt-56">
          <h2 className="font-bold text-2xl sm:text-3xl mb-6">Contact Information</h2>
          <p>Computer Science and Engineering</p>
          <p>University of Chittagong, Hathazari, Chittagong</p>
          <p>Phone: 01842308102</p>
          <p>Email: universityresearchcell@.edu</p>
        </div>
        <div className="text-base md:mt-56 md:ml-20 ">
          <h4 className="font-bold text-2xl sm:text-3xl mb-6">Quick Links</h4>
          <ul>
            <li>Terms of Use</li>
            <li>Privacy Policy</li>
            <li>Help & Support</li>
            <li>Contact Admin</li>
          </ul>
        </div>
        <div className="text-base md:mt-56 md:ml-10 ">
          <h4 className="font-bold text-2xl sm:text-3xl mb-6">Follow Us</h4>
          <div className="flex space-x-6 text-2xl">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF className="text-blue-500" /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="text-pink-500" /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="text-blue-400" /></a>
          </div>
        </div>
      </footer>

      <div className="bg-gray-900 text-white text-center py-4 text-xs">
        © 2025 University Research Cell. All rights reserved.
      </div>
    </div>
  );
}

export default LandingPage;

