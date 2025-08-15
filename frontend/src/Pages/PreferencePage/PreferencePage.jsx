import { useNavigate, useParams } from "react-router-dom";
import AdditionalPreferences from "../../components/PreferencePage/AdditionalPreferences";
import Department from "../../components/PreferencePage/Department";
import ResearchFields from "../../components/PreferencePage/ResearchFields";

function PreferencePage() {
  const navigate = useNavigate();
  const { role } = useParams();

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <img
        src="/image1.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay for opacity */}
      <div className="absolute inset-0 bg-black bg-opacity-25"></div>

      {/* Content */}
      <div className="relative max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-4 mb-4 z-10">
        <h1 className="text-xl font-bold text-center mb-6">
          Set Your Research Preferences
        </h1>

        <Department />
        <ResearchFields />
        <AdditionalPreferences role={role} />

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Back
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800">
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreferencePage;
