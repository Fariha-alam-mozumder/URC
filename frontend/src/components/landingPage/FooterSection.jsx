
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-white  px-6 sm:px-16 lg:px-40 py-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="text-base md:mt-20">
          <h2 className="font-bold text-2xl sm:text-3xl mb-6">Contact Information</h2>
          <p>Computer Science and Engineering</p>
          <p>University of Chittagong, Hathazari, Chittagong</p>
          <p>Phone: 01842308102</p>
          <p>Email: universityresearchcell@.edu</p>
        </div>
        <div className="text-base md:mt-20 md:ml-20">
          <h4 className="font-bold text-2xl sm:text-3xl mb-6">Quick Links</h4>
          <ul>
            <li>Terms of Use</li>
            <li>Privacy Policy</li>
            <li>Help & Support</li>
            <li>Contact Admin</li>
          </ul>
        </div>
        <div className="text-base md:mt-20 md:ml-10">
          <h4 className="font-bold text-2xl sm:text-3xl mb-6">Follow Us</h4>
          <div className="flex space-x-6 text-2xl">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-blue-500" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-pink-500" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-blue-400" />
            </a>
          </div>
        </div>
      </footer>

      <div className="bg-gray-900 text-white text-center py-4 text-xs">
        © 2025 University Research Cell. All rights reserved.
      </div>
    </>
  );
}

export default Footer;

