import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <div className="relative w-full min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/image1.png"
          alt="Background"
          className="w-full h-full object-cover opacity-65"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 md:py-20 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-black">
            University Research Cell
          </h1>
          <p className="text-xl max-w-xl  text-black mt-6 italic mb-6">
            Discover groundbreaking research, connect with fellow researchers,
            and stay updated with the latest academic conferences from our
            university community.
          </p>
        </div>

        {/* Search Box */}
        {/* <div className="w-full max-w-md flex items-center bg-white rounded-full px-4 py-2 shadow-md">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow bg-transparent outline-none text-black placeholder-gray-500"
          />
          <FaSearch className="text-gray-600" />
        </div> */}

        {/* Info Card with Arrows */}
        <div className="bg-black/60 text-center p-10 rounded-md max-w-xl max-h-xl space-y-5 relative text-white ">
          <p className="text-2xl font-semibold">
            Welcome to the University Research Cell
          </p>
          <p className="italic text-sm md:ml-10 ml-6  w-4/5">
            A community engaged with a repository of resources to support
            computing research and practice Please explore and discover
            groundbreaking research, connect with fellow researchers, and stay
            updated with the latest academic conferences from our university
            community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
