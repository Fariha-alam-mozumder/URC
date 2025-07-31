
import { Link } from "react-router-dom";

export default function SignUpForm() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/image1.png')] bg-cover bg-center p-4">
      {/* Dark overlay over background image */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-center mb-2">Create account</h2>
        <p className="text-center text-sm text-gray-500 mb-4">Join our research community</p>

        <form className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center">
              <input type="radio" name="role" className="mr-2" /> Admin
            </label>
            <label className="flex items-center">
              <input type="radio" name="role" className="mr-2" /> Reviewer
            </label>
            <label className="flex items-center">
              <input type="radio" name="role" className="mr-2" /> Teacher
            </label>
            <label className="flex items-center">
              <input type="radio" name="role" className="mr-2" /> Student
            </label>
          </div>

          <input type="text" placeholder="Full Name" className="w-full border rounded p-2" />
          <input type="text" placeholder="Phone Number" className="w-full border rounded p-2" />
          <input type="email" placeholder="Email" className="w-full border rounded p-2" />

          <select className="w-full border rounded p-2">
            <option>Select Department</option>
            <option>CSE</option>
            <option>EEE</option>
            <option>Architecture</option>
            <option>Mechanical Engineering</option>
            <option>Civil Engineering</option>
            <option>Textile Engineering</option>
            <option>Biomedical Engineering</option>
            <option>Pharmacy</option>
            <option>Law</option>
            <option>Economics</option>
            <option>English</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Statistics</option>
            <option>Sociology</option>
            <option>Political Science</option>
            <option>Psychology</option>
            <option>Journalism & Media Studies</option>
            <option>Anthropology</option>
            <option>Finance</option>
            <option>Marketing</option>
            <option>Accounting</option>
            <option>Environmental Science</option>
            <option>Geography</option>
            <option>Public Administration</option>
            <option>Islamic Studies</option>
            <option>History</option>
            <option>International Relations</option>
          </select>

          <input type="password" placeholder="Password" className="w-full border rounded p-2" />
          <input type="password" placeholder="Confirm Password" className="w-full border rounded p-2" />

          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            I agree to the Terms and Policy
          </label>

          <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">
            Submit
          </button>
          <p className="text-center text-lg mt-3 p-6">
  Already have an account?{" "}
  <Link to="/login" className="text-blue-500 hover:underline">
   Login
  </Link>
</p>
 </form>

      
      </div>
    </div>
  );
}
