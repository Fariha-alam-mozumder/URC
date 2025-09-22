import { useNavigate, useParams } from "react-router-dom";

const EditButton = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  const handleEditClick = () => {
    navigate(`/preferences`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-1 w-full">
      <button
        onClick={handleEditClick}
        className="flex-1 bg-gray-700 hover:bg-gray-500 text-white font-medium px-4 py-3 rounded-lg"
      >
        Edit Profile
      </button>

      <button
        onClick={handleBackClick}
        className="flex-1 bg-gray-400 hover:bg-gray-500 text-black font-medium px-4 py-3 rounded-lg"
      >
        Back
      </button>
    </div>
  );
};

export default EditButton;
