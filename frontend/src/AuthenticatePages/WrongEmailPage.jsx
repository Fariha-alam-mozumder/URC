import { Link, useLocation } from "react-router-dom";

export default function WrongEmailPage() {
  const location = useLocation();
  const email = location.state?.email || "";
  const domainFromState = location.state?.domain || "";
  const messageFromState = location.state?.message || "";

  const derivedDomain = domainFromState || (email.includes("@") ? email.split("@")[1] : "");
  const normalizedDomain = derivedDomain ? derivedDomain.toLowerCase() : "";

  const headlineMessage =
    messageFromState ||
    "Please register using your official university email address.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/image1.png')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black opacity-40 z-0" />
      <div className="w-full max-w-md bg-white/95 rounded-lg shadow-md p-6 z-10">
        <h1 className="text-xl font-bold text-center text-red-600 mb-3">
          Email Domain Not Supported
        </h1>

        <p className="text-sm text-center text-gray-700 mb-4">
          {email ? (
            <>
              We detected that <span className="font-semibold">{email}</span> is not
              an approved email for account registration.
            </>
          ) : (
            "The email address you entered is not from an approved domain."
          )}
        </p>

        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-sm text-red-700 leading-relaxed">{headlineMessage}</p>
          {normalizedDomain && (
            <p className="text-xs text-red-600 mt-2">
              Emails from <span className="font-semibold">{normalizedDomain}</span> cannot
              be used to create a CURCMS account.
            </p>
          )}
        </div>

        <ul className="text-xs text-gray-600 space-y-2 mb-5 list-disc list-inside">
          <li>Use your official university-provided email address.</li>
          <li>Double-check for typos or misspellings in the email address.</li>
          <li>
            If you believe this is a mistake, please contact the research cell for
            assistance.
          </li>
        </ul>

        <div className="space-y-3">
          <Link
            to="/signup"
            className="block w-full bg-gray-800 text-white text-center py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Back to Registration
          </Link>
          <Link
            to="/"
            className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
