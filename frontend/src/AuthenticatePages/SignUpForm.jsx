import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { resolveApiUrl } from "../config/api";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const [matchError, setMatchError] = useState("");
  const [serverError, setServerError] = useState("");

  // Roll number validation based on department
  const validateRollNumber = (rollNumber, department) => {
    if (!/^\d{8}$/.test(rollNumber)) {
      return "Roll number must be exactly 8 numeric digits";
    }

    const session = parseInt(rollNumber.substring(0, 2));
    const fixedDigits = rollNumber.substring(2, 4);
    const deptCode = rollNumber.substring(4, 5);
    const fixedSixth = rollNumber.substring(5, 6);
    const serialNumber = parseInt(rollNumber.substring(6, 8));

    // Session validation (01-99)
    if (session < 1 || session > 99) {
      return "Invalid session (first 2 digits should be 01-99)";
    }

    // 3rd and 4th digits must be "70"
    if (fixedDigits !== "70") {
      return "3rd and 4th digits must be '70'";
    }

    // Department code validation (5th digit)
    if (department === "CSE" && deptCode !== "1") {
      return "CSE students must have '1' as 5th digit";
    }
    if (department === "EEE" && deptCode !== "2") {
      return "EEE students must have '2' as 5th digit";
    }

    // 6th digit must be "0"
    if (fixedSixth !== "0") {
      return "6th digit must be '0'";
    }

    // Serial number validation (01-99)
    if (serialNumber < 1 || serialNumber > 99) {
      return "Serial number must be between 01-99 (last 2 digits)";
    }

    return null; // Valid
  };

  const getRollNumberPlaceholder = (department) => {
    if (department === "CSE") {
      return "Example: 21701001 (YY701SXX)";
    }
    if (department === "EEE") {
      return "Example: 21702001 (YY702SXX)";
    }
    return "Roll Number (8 digits)";
  };

  const getRollNumberPattern = (department) => {
    if (department === "CSE") {
      return "\\d{2}701\\d{3}";
    }
    if (department === "EEE") {
      return "\\d{2}702\\d{3}";
    }
    return "\\d{8}";
  };

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

    // Enhanced roll number validation for students
    if (Role === "STUDENT") {
      const rollNumber = form.rollNumber.value;
      const department = selectedDepartment;
      
      const rollError = validateRollNumber(rollNumber, department);
      if (rollError) {
        setMatchError(rollError);
        return;
      }
    }

    setMatchError("");
    setServerError("");

    const formData = {
      role: Role,
      name: form.fullName.value,
      email: form.email.value,
      password: password,
      password_confirmation: confirm,
    };

    if (Role === "TEACHER" || Role === "STUDENT") {
      formData.department_name = selectedDepartment;
    }
    if (Role === "STUDENT") {
      formData.roll_number = form.rollNumber.value;
    }
    if (Role === "TEACHER") {
      formData.designation = form.designation.value;
    }

    try {
      const response = await axios.post(resolveApiUrl("/auth/register"), formData);
      
      // With the new system, successful registration always redirects to verify page
      // since user must verify email before account creation
      navigate("/verify", { 
        state: { 
          status: "success", 
          email: formData.email,
          message: response.data.message
        } 
      });
    } catch (err) {
      if (err.response) {
        if (err.response.data?.wrongEmailDomain) {
          navigate("/wrong-email", {
            state: {
              email: formData.email,
              domain:
                err.response.data?.disallowedDomain ||
                formData.email.split("@")[1] ||
                "",
              message:
                err.response.data?.message ||
                "Please use your official university email address to register.",
            },
          });
        } else if (err.response.data?.errors?.email) {
          setMatchError(err.response.data.errors.email);
        } else if (err.response.data?.errors?.roll_number) {
          setMatchError(Array.isArray(err.response.data.errors.roll_number)
            ? err.response.data.errors.roll_number[0]
            : err.response.data.errors.roll_number);
        } else if (err.response.data?.emailSent === false) {
          // Email failed to send
          navigate("/verify", {
            state: {
              status: "email_failed",
              email: formData.email 
            } 
          });
        } else if (err.response.data?.registrationFailed) {
          navigate("/verify", { 
            state: { 
              status: "registration_failed", 
              error: err.response.data.error 
            } 
          });
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
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {["CSE", "EEE"].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}

          {selectedRole === "Student" && (
            <div>
              <input
                type="text"
                name="rollNumber"
                placeholder={getRollNumberPlaceholder(selectedDepartment)}
                required
                pattern={getRollNumberPattern(selectedDepartment)}
                title={`Roll number format for ${selectedDepartment}: ${getRollNumberPlaceholder(selectedDepartment)}`}
                className="w-full border rounded p-2"
              />
              {selectedDepartment && (
                <div className="text-xs text-gray-600 mt-1">
                  <p className="font-medium">Roll Number Format:</p>
                  <p>Example: Session 21, Serial 01: 
                    {selectedDepartment === "CSE" && " 21701001"}
                    {selectedDepartment === "EEE" && " 21702001"}
                  </p>
                  <p className="text-red-600">Each roll number must be unique!</p>
                </div>
              )}
            </div>
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