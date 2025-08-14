import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [verifiedMessage, setVerifiedMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const verified = query.get("verified");
  const registered = query.get("registered");

  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (verified === "true" && registered === "true") {
      setVerifiedMessage("Registration completed successfully! Your account has been created and verified. You can now log in.");
    } else if (verified === "true") {
      setVerifiedMessage("Email verified successfully! You can now log in.");
    }
  }, [verified, registered]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      login(res.data.token);

      const role = res.data.user.role;
      const isMainAdmin = res.data.user.isMainAdmin;

      // Navigate based on role, matching the App.jsx routing structure
      if (isMainAdmin || role === "ADMIN") {
        navigate("/admin/home");
      } else if (role === "TEACHER") {
        navigate("/teacher/home");
      } else if (role === "REVIEWER") {
        navigate("/reviewer/home");
      } else if (role === "STUDENT") {
        navigate("/student/home");
      } else if (role === "GENERALUSER") {
        navigate("/reviewer/home"); // Based on your original logic
      } else {
        navigate("/login");
      }

    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors?.email) {
        setErrorMsg(err.response.data.errors.email);
      } else if (err.response?.data?.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/image1.png')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-md p-6 z-10">
        <h2 className="text-xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Sign in to your account
        </p>

        {verifiedMessage && (
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
            <p className="text-green-700 text-sm text-center">
              {verifiedMessage}
            </p>
          </div>
        )}

        {errorMsg && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMsg}</p>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Remember Me
          </label>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded"
          >
            Login
          </button>
          <p className="text-center text-lg mt-3 p-7">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}