// FooterSection.jsx
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaLinkedinIn,
  FaYoutube,
  FaGithub,
  FaGraduationCap,
  FaBookOpen,
  FaUsers,
  FaNewspaper,
  FaCalendarAlt,
  FaChartLine
} from "react-icons/fa";

function Footer() { 
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Terms of Use", href: "#", icon: FaBookOpen },
    { name: "Privacy Policy", href: "#", icon: FaUsers },
    { name: "Help & Support", href: "#", icon: FaGraduationCap },
    { name: "Contact Admin", href: "#", icon: FaEnvelope },
  ];

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com", color: "hover:text-blue-400", bgColor: "hover:bg-blue-400/10" },
    { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com", color: "hover:text-pink-400", bgColor: "hover:bg-pink-400/10" },
    { name: "Twitter", icon: FaTwitter, href: "https://www.twitter.com", color: "hover:text-blue-300", bgColor: "hover:bg-blue-300/10" },
    { name: "LinkedIn", icon: FaLinkedinIn, href: "https://www.linkedin.com", color: "hover:text-blue-500", bgColor: "hover:bg-blue-500/10" },
    { name: "YouTube", icon: FaYoutube, href: "https://www.youtube.com", color: "hover:text-red-400", bgColor: "hover:bg-red-400/10" },
    { name: "GitHub", icon: FaGithub, href: "https://www.github.com", color: "hover:text-gray-300", bgColor: "hover:bg-gray-300/10" },
  ];

  const researchStats = [
    { icon: FaNewspaper, value: "500+", label: "Research Papers" },
    { icon: FaUsers, value: "1200+", label: "Active Researchers" },
    { icon: FaCalendarAlt, value: "50+", label: "Conferences" },
    { icon: FaChartLine, value: "98%", label: "Success Rate" },
  ];

  return ( 
    <> 
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-grid)" />
          </svg>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-12 xl:px-20 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
              
              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <FaMapMarkerAlt className="text-blue-400 mt-1 group-hover:text-blue-300 transition-colors duration-200" />
                    <div className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      <p className="font-medium text-white">Computer Science and Engineering</p>
                      <p>University of Chittagong</p>
                      <p>Hathazari, Chittagong</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group">
                    <FaPhone className="text-green-400 group-hover:text-green-300 transition-colors duration-200" />
                    <a href="tel:01842308102" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200">
                      01842308102
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 group">
                    <FaEnvelope className="text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
                    <a href="mailto:toasean.csecu@gmail.com" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200 break-all">
                      toasean.csecu@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={index}>
                        <a href={link.href} className="text-sm sm:text-base text-gray-300 hover:text-white transition-all duration-200 flex items-center space-x-3 group py-2 px-3 rounded-lg hover:bg-white/5">
                          <IconComponent className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                          <span>{link.name}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Social Media */}
              <div className="space-y-6">
                <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Follow Us
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}
                        className={`group w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-3 ${social.bgColor}`}>
                        <IconComponent className={`text-lg sm:text-xl text-gray-300 ${social.color} transition-all duration-200`} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800"></div>

            {/* Bottom Section */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                © {currentYear} University Research Cell. All rights reserved.
              </div>
              <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-400">
                <span>Made with</span>
                <span className="text-red-400 animate-pulse">♥</span>
                <span>for researchers</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </> 
  ); 
} 

export default Footer;
