
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

function LockSection() {
  return (
    <section className="bg-gray-900 text-white md:h-screen text-center px-4 py-20 sm:py-28">
      <div className="text-4xl md:mt-32 md:mb-4">
        <FaLock className="mx-auto md:mt-4" />
      </div>
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
        Access Full Research Content
      </h3>
      <p className="max-w-xl italic mx-auto px-4 mb-8">
        You can browse abstracts and conference info freely. To download full
        papers and access detailed research content, please create an account
        or sign in.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/signup"
          className="bg-white text-gray-800 px-6 py-2 rounded hover:bg-gray-200"
        >
          Sign Up Free
        </Link>
        <Link
          to="/login"
          className="bg-transparent border border-white px-6 py-2 rounded hover:bg-white hover:text-gray-800"
        >
          Login
        </Link>
      </div>
    </section>
  );
}

export default LockSection;
