import { Link } from "react-router-dom";

function HeroSection({ onBrowseClick }) {
  return (
    <div className="font-sans">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src="/image1.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-start md:ml-10 px-6 text-black">
          <header className="absolute top-0 left-0 right-0 flex justify-between items-center -ml-12 px-10 h-20 bg-gray-100 shadow">
            <img src="/search.png" alt="Logo" className="w-16 h-10 ml-6" />
            <h1 className="text-xl md:text-4xl text-black font-bold ml-5 text-justify md:pl-32">
              University Research Cell
            </h1>
            <div className="flex md:space-x-4 space-x-4 ml-12 mr-5">
              <Link
                to="/login"
                className="px-4 md:py-2 bg-black hover:bg-gray-600 text-white rounded text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </header>

          {/* Hero Text */}
          <main className="max-w-3xl mt-20 md:mt-0">
            <h2 className="text-3xl md:text-4xl italic font-bold mb-6 max-w-xl text-black drop-shadow">
              Where Ideas Meet Impact: Research, Collaborate, Innovate
            </h2>
            <p className="text-xl max-w-xl italic mb-10 text-black drop-shadow">
              Discover groundbreaking research, connect with fellow researchers,
              and stay updated with the latest academic conferences from our
              university community.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={onBrowseClick}
                className="px-8 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded text-lg font-medium"
              >
                Browse Accepted Papers
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;