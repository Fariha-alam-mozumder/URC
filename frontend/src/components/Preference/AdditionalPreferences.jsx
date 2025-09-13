import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdditionalPreferences({ role, user, initialData, onDataChange }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    department_id: null,
    password: "",
    confirmPassword: "",
    roll_number: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // guards
  const initializedRef = useRef(false);
  const lastNotifiedDataRef = useRef(null);

  // helper to build initial state (prefer initialData over user)
  const buildInitial = () => ({
    name: (initialData?.name ?? user?.name ?? ""),
    email: (initialData?.email ?? user?.email ?? ""),
    designation: (initialData?.designation ?? ""),
    department_id: (initialData?.department_id ?? null),
    password: "",
    confirmPassword: "",
    roll_number: (initialData?.roll_number ?? ""),
  });

  // ✅ initialize ONCE when initialData becomes available the first time
  useEffect(() => {
    if (initializedRef.current) return;
    if (!initialData) return; // wait until parent fetched it

    const next = buildInitial();
    setFormData(next);
    initializedRef.current = true;

    // notify parent once on init (without password fields)
    const { password, confirmPassword, ...dataForParent } = next;
    lastNotifiedDataRef.current = JSON.stringify(dataForParent);
    onDataChange?.(dataForParent);
  }, [initialData]); // <-- only watches initialData arriving; guard prevents re-runs

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue =
      name === "department_id" ? (value ? parseInt(value) : null) : value;

    const next = { ...formData, [name]: processedValue };
    setFormData(next);

    // Only notify parent if the non-password payload actually changed
    if (initializedRef.current) {
      const { password, confirmPassword, ...dataForParent } = next;
      const currentDataString = JSON.stringify(dataForParent);
      if (lastNotifiedDataRef.current !== currentDataString) {
        lastNotifiedDataRef.current = currentDataString;
        onDataChange?.(dataForParent);
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);

    if (initializedRef.current) {
      // include password fields when notifying for password edits
      onDataChange?.(next);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (role) {
      case "STUDENT":
        return (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Roll Number</label>
            <input
              type="text"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleChange}
              className="w-full border px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your roll number"
            />
          </div>
        );
      case "TEACHER":
      case "REVIEWER":
        return (
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Designation</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
            </select>
          </div>
        );
      case "ADMIN":
        return (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Admin Role</label>
            <input
              type="text"
              name="designation"
              value="System Administrator"
              readOnly
              className="w-full border px-3 py-2 bg-gray-200 rounded-lg cursor-not-allowed"
            />
          </div>
        );
      default:
        return (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <input
              type="text"
              name="designation"
              value={role || ""}
              readOnly
              className="w-full border px-3 py-2 bg-gray-200 rounded-lg cursor-not-allowed"
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border px-3 py-2 bg-gray-200 rounded-lg cursor-not-allowed"
              title="Email cannot be changed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 bg-white rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave blank to keep current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum 6 characters. Leave blank to keep current password.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 bg-white rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
        </div>

        {renderRoleSpecificFields()}
      </div>
    </div>
  );
}

export default AdditionalPreferences;
