import { Link } from "react-router-dom";

function HeroSection({ onBrowseClick }) {
  return (
    <div className="font-sans">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 transform scale-110 transition-transform duration-1000 ease-out">
          <img
            src="/image1.png"
            alt="Research Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Header Navigation */}
        <header className="absolute top-0 left-0 right-0 z-20 transition-all duration-300 backdrop-blur-sm bg-gray-100/95 shadow-lg border-b border-gray-200/50">
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 h-16 sm:h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src="/academic-research.png" 
                alt="University Logo" 
                className="w-12 h-13 sm:w-16 sm:h-10 object-contain transition-transform duration-300 hover:scale-105" 
              />
              <h1 className="text-sm sm:text-xl lg:text-2xl xl:text-3xl text-gray-900 font-bold leading-tight">
                <span className="block sm:inline">University</span>
                <span className="block sm:inline sm:ml-2">Research Cell</span>
              </h1>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-2 sm:space-x-4">
              <Link
                to="/login"
                className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="relative z-10 h-full flex items-center justify-start">
          <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
            <div className="max-w-4xl">
              {/* Main Headline */}
              <h2 className="text-xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 text-white leading-tight">
                <span className="block italic drop-shadow-lg">Where Ideas Meet Impact:</span>
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl mt-2 font-semibold drop-shadow-lg">
                  Research, Collaborate, Innovate
                </span>
              </h2>

              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-lg lg:text-xl mb-8 sm:mb-10 text-white/95 max-w-3xl leading-relaxed drop-shadow-md font-medium">
                Discover groundbreaking research, connect with fellow researchers,
                and stay updated with the latest academic conferences from our
                university community.
              </p>

              {/* Call to Action Button */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                  onClick={onBrowseClick}
                  className="group px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-base sm:text-lg lg:text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Browse Accepted Papers</span>
                  <svg 
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-white text-sm mb-2 opacity-75">Scroll to explore</span>
            <svg className="w-6 h-6 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
