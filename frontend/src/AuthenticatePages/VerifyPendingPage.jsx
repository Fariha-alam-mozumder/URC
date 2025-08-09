import { Link } from "react-router-dom";

export default function VerifyPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600"> Email Sent</h1>
        <p className="mt-4 text-gray-700">
          A verification link has been sent to your email. Please check your inbox and follow the instructions to activate your account.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Didn’t get it? Check your spam folder, or wait a few minutes.
        </p>
        <Link to="/login" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
