
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const conferences = [
  {
    title: "International AI Research Symposium 2025",
    date: "March 15–17, 2025",
    location: "Stanford University, California",
    description: "Join leading researchers to discuss breakthroughs in AI and machine learning.",
    link: "#"
  },
  {
    title: "Quantum Computing Workshop",
    date: "April 8–10, 2025",
    location: "Virtual Conference",
    description: "Explore the future of quantum computing with workshops and expert talks.",
    link: "#"
  },
  {
    title: "Global Cybersecurity Summit",
    date: "May 20–22, 2025",
    location: "Berlin, Germany",
    description: "A deep dive into modern cybersecurity challenges and solutions.",
    link: "#"
  }
];

 function Conferences() {
  return (
    <section className="bg-gray-50 px-6 py-12 sm:px-10 lg:px-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
        Upcoming Conferences
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {conferences.map((conf, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 sm:p-8 lg:p-10"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {conf.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-1 text-sm sm:text-base">
              <FaCalendarAlt className="mr-2" />
              <span>{conf.date}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4 text-sm sm:text-base">
              <FaMapMarkerAlt className="mr-2" />
              <span>{conf.location}</span>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              {conf.description}
            </p>
            <button
              onClick={() => window.open(conf.link, "_blank")}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 text-sm sm:text-base"
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Conferences;