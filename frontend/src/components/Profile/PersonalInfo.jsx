const PersonalInfo = ({ name, university, email, department, role, }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <span className="text-blue-600">📋</span> Personal Information
      </h3>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="font-semibold">Name</span>
          <input
            type="text"
            defaultValue={name}
            className="border rounded-lg p-2 w-full"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">Email</span>
          <input
            type="email"
            defaultValue={email}
            className="border rounded-lg p-2 w-full"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">Department</span>
          <input
            type="text"
            defaultValue={department}
            className="border rounded-lg p-2 w-full"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">University</span>
          <input
            type="text"
            defaultValue={university}
            className="border rounded-lg p-2 w-full"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">Role</span>
          <input
            type="text"
            defaultValue={role}
            className="border rounded-lg p-2 w-full"
          />
        </label>

       
      </div>
    </div>
  );
};

export default PersonalInfo;
