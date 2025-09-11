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
    <div className="flex flex-row justify-end mt-20 w-full md:-ml-20 gap-4">
      <button
        onClick={handleEditClick}
        className="bg-gray-700 hover:bg-gray-500 text-white w-48 font-medium px-2 py-2 rounded-lg"
      >
         Edit Profile
      </button>

      <button
        onClick={handleBackClick}
        className="bg-gray-400 hover:bg-gray-500 text-black w-32 font-medium px-2 py-2 rounded-lg"
      >
        Back
      </button>
    </div>
  );
};

export default EditButton;
