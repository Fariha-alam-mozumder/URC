import { 
  FaUpload, 
  FaUsers, 
  FaBell, 
  FaDownload,
  FaRocket,
  FaHandshake,
  FaLightbulb,
  FaAward
} from "react-icons/fa";

function JoinSection() {
  const features = [
    { 
      icon: FaUpload, 
      title: "Submit Research", 
      desc: "Share your research findings and get peer feedback from the academic community.",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: FaUsers, 
      title: "Collaborate", 
      desc: "Connect with researchers across departments and explore interdisciplinary opportunities.",
      color: "from-green-500 to-green-600"
    },
    { 
      icon: FaDownload, 
      title: "Full Access", 
      desc: "Download complete papers and access comprehensive academic content.",
      color: "from-orange-500 to-orange-600"
    },
  ];

  return (
    <section className="bg-gray-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400"></div>
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              Why Join Our Research Community?
            </h2>
            <p className="text-base sm:text-lg lg:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Discover the benefits of being part of our thriving academic ecosystem
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-5 lg:gap-6">
            {features.map((item, index) => (
              <div 
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-200 h-full flex flex-col">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <item.icon className="text-xl sm:text-2xl text-white filter drop-shadow-sm" />
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Learn More Link */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1 group-hover:space-x-2">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default JoinSection;
