

const ProfileHeader = ({ name, role, department }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
      <img
        src="https://via.placeholder.com/80"
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover"
      />
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-blue-500 font-medium">{role}</p>
        <p className="text-gray-500 text-sm">{department}</p>
      </div>
      <span className="ml-auto w-3 h-3 bg-green-500 rounded-full"></span>
    </div>
  );
};

export default ProfileHeader;
