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

  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (verified === "true") {
      setVerifiedMessage("Email verified successfully! You can now log in.");
    }
  }, [verified]);

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

     if (role === "TEACHER") {
  navigate("/teacher");
} else if (
  role === "REVIEWER" ||
  role === "STUDENT" ||
  role === "GENERALUSER"
) {
  navigate("/reviewer");
} else if (role === "ADMIN") {
  navigate("/admin");
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
          <p className="text-green-600 text-sm text-center mb-4">
            {verifiedMessage}
          </p>
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
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
