import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const [matchError, setMatchError] = useState("");
  const [serverError, setServerError] = useState(""); // NEW state

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const password = passwordRef.current.value;
    const confirm = confirmRef.current.value;
    const Role = selectedRole.replace(" ", "").toUpperCase();

    if (password !== confirm) {
      setMatchError("Passwords do not match.");
      return;
    }

    if (Role === "STUDENT") {
      const rollNumber = form.rollNumber.value;
      if (!/^\d{8}$/.test(rollNumber)) {
        setMatchError("Roll number must be exactly 8 numeric digits");
        return;
      }
    }

    setMatchError("");
    setServerError("");

    const formData = {
      role: Role,
      name: form.fullName.value,
      email: form.email.value,
      department_name: form.department?.value,
      password: password,
      password_confirmation: confirm,
    };

    if (Role === "TEACHER" || Role === "STUDENT") {
      formData.department_name = form.department.value;
    }
    if (Role === "STUDENT") {
      formData.roll_number = form.rollNumber.value;
    }
    if (Role === "TEACHER") {
      formData.designation = form.designation.value;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/auth/register",
        formData
      );

      navigate("/verify-pending");

    } catch (err) {
      if (err.response) {
        if (err.response.data?.errors?.email) {
          setMatchError(err.response.data.errors.email);
        } else {
          setServerError(
            err.response.data?.message || "Something went wrong. Please try again."
          );
        }
      } else if (err.request) {
        setServerError("Cannot connect to the server. Please try again later.");
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/image1.png')] bg-cover bg-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-center mb-2">Create account</h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Join our research community
        </p>

        {matchError && (
          <p className="text-red-500 text-sm text-center mb-2">{matchError}</p>
        )}
        {serverError && (
          <p className="text-red-500 text-sm text-center mb-2">{serverError}</p>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            {["General User", "Teacher", "Student"].map((role) => (
              <label key={role} className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  className="mr-2"
                  required
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                {role}
              </label>
            ))}
          </div>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            className="w-full border rounded p-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border rounded p-2"
          />

          {(selectedRole === "Teacher" || selectedRole === "Student") && (
            <select
              name="department"
              required
              className="w-full border rounded p-2"
            >
              <option value="">Select Department</option>
              {[
                "CSE",
                "EEE",
                "Pharmacy",
                "Law",
                "Economics",
                "English",
                "Mathematics",
                "Physics",
                "Chemistry",
                "Statistics",
                "Sociology",
                "Political Science",
                "Psychology",
                "Journalism & Media Studies",
                "Anthropology",
                "Finance",
                "Marketing",
                "Accounting",
                "Environmental Science",
                "Geography",
                "Public Administration",
                "Islamic Studies",
                "History",
                "International Relations",
              ].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}

          {selectedRole === "Student" && (
            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Number"
              required
              pattern="\d{8}"
              title="Roll number must be exactly 8 numeric digits"
              className="w-full border rounded p-2"
            />
          )}

          {selectedRole === "Teacher" && (
            <select
              name="designation"
              required
              className="w-full border rounded p-2"
            >
              <option value="">Select Designation</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
            </select>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            ref={passwordRef}
            className="w-full border rounded p-2"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            ref={confirmRef}
            className="w-full border rounded p-2"
          />

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded"
          >
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
