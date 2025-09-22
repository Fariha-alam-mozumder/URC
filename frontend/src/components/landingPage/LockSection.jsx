import { FaLock, FaDownload, FaFileAlt, FaUsers, FaBookOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

function LockSection() {
  return (
    <section className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Icon with Animation */}
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-4 transform hover:scale-110 transition-all duration-300">
              <FaLock className="text-3xl sm:text-4xl lg:text-5xl text-white drop-shadow-lg" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-4xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Access Full Research Content
              </span>
            </h3>
            
            <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-lg text-gray-300 leading-relaxed px-4">
              You can browse abstracts and conference info freely. To download full
              papers and access detailed research content, please create an account
              or sign in.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mt-12 mb-12">
              <div className="flex items-center space-x-3 text-left bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <FaDownload className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm sm:text-base">Full Paper Downloads</span>
              </div>
              <div className="flex items-center space-x-3 text-left bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <FaFileAlt className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm sm:text-base">Detailed Research Content</span>
              </div>
              <div className="flex items-center space-x-3 text-left bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <FaUsers className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-sm sm:text-base">Research Collaboration</span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-12">
              <Link
                to="/signup"
                className="group px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-base sm:text-lg transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Sign Up Free</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold text-base sm:text-lg transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Login</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LockSection;
