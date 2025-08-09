import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const name = "John Doe";
  const job = "Reviewer";

  return (
    <div className="p-8">
      {/* Profile Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-3xl rounded-full bg-gray-300 w-12 h-12 flex items-center justify-center hover:bg-gray-400"
        aria-label="Open profile modal"
      >
        👤
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Profile Info */}
            <h2 className="text-xl font-semibold text-center mb-4">{name}</h2>
            <p className="mb-6 text-center">{job}</p>

            {/* Buttons side by side */}
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/Profile"); // Navigate to profile edit page
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
                aria-label="Edit profile"
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                aria-label="Back"
              >
                 Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
