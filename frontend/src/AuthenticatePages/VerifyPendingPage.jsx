import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function VerifyPending() {
  const location = useLocation();
  const [registrationStatus, setRegistrationStatus] = useState("success");
  const [userEmail, setUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if there's state passed from registration
    if (location.state) {
      setRegistrationStatus(location.state.status || "success");
      setUserEmail(location.state.email || "");
      setErrorMessage(location.state.error || "");
    }
  }, [location.state]);

  const getContent = () => {
    switch (registrationStatus) {
      case "email_failed":
        return {
          title: "Email Service Unavailable",
          titleClass: "text-red-600",
          message:
            "We couldn't send the verification email. Please try registering again.",
          subMessage: "Check your internet connection or contact support if the problem persists.",
          showRetry: true,
        };

      case "registration_failed":
        return {
          title: "Registration Failed",
          titleClass: "text-red-600",
          message: errorMessage || "Something went wrong during registration.",
          subMessage:
            "Please try again or contact support if the problem persists.",
          showRetry: true,
        };

      default:
        return {
          title: "Check Your Email",
          titleClass: "text-blue-600",
          message: userEmail
            ? `A verification link has been sent to ${userEmail}. You must click the verification link to complete your registration and create your account.`
            : "A verification link has been sent to your email. You must click the verification link to complete your registration and create your account.",
          subMessage:
            "Important: Your account will not be created until you verify your email. Check your spam folder if you don't see the email.",
          showRetry: false,
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/image1.png')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-md p-6 z-10">
        <h1 className={`text-xl font-bold text-center mb-2 ${content.titleClass}`}>
          {content.title}
        </h1>

        <p className="text-center text-sm text-gray-700 mb-4">{content.message}</p>

        <p className="text-center text-xs text-gray-500 mb-4">{content.subMessage}</p>

        <div className="space-y-3">
          <Link
            to="/login"
            className="block w-full bg-gray-800 text-white text-center py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Back to Login
          </Link>

          {content.showRetry && (
            <Link
              to="/signup"
              className="block w-full bg-gray-600 text-white text-center py-2 rounded hover:bg-gray-500 transition-colors"
            >
              Try Registration Again
            </Link>
          )}
        </div>

        {registrationStatus === "email_failed" && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> No account has been created yet. You need to complete the email verification process to create your account.
            </p>
          </div>
        )}

        {registrationStatus === "success" && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Your account will only be created after you click the verification link in your email. Check your spam folder if you don't see the email within a few minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}