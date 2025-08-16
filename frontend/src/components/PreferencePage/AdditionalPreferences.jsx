import { profiles } from "../../Data/ProfileData";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdditionalPreferences({ role }) {
  const profile = profiles[role] || profiles.reviewer || profiles.teacher;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    department: "",
    university: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      designation: profile.role || "",
      department: profile.department || "",
      university: profile.university || "",
      password: profile.password || "",
      confirmPassword: profile.password || "",
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
  };

  return (
    <div className="max-w-2xl bg-white rounded-lg mt-10 ">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name & Email in one row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 bg-slate-100 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 bg-slate-100 rounded-lg"
            />
          </div>
        </div>

       

        {/* University & Department in one row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700  font-medium">University</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="w-full border px-3 py-2 bg-slate-100 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700  font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border px-3 bg-slate-100 py-2 rounded-lg"
            />
          </div>
        </div>

        {/* Password & Confirm Password in one row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 bg-slate-100 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border px-3 bg-slate-100 py-2 rounded-lg"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-2.5 bg-slate-100 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
         {/* Designation */}
        <div>
          <label className="block text-gray-700 font-medium">Role</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border px-3 py-2 bg-slate-100 rounded-lg"
          />
        </div>
      </form>
    </div>
  );
}

export default AdditionalPreferences;
