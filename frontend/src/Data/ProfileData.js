// profileData.js
export const profiles = {
  teacher: {
    name: "Dr. Sarah Parker",
    role: "Professor",
    department: "Computer Science & Engineering",
    university: "University of Chittagong",
    email: "sarah.parker@university.edu",
    password: "sarahparker10",
    stats: [
      { label: "Submitted Papers", value: 40, color: "bg-blue-100 text-blue-600", icon: "📄" },
      { label: "Review Papers", value: 25, color: "bg-green-100 text-green-600", icon: "🔍" },
      { label: "Total Teams", value: 10, color: "bg-purple-100 text-purple-600", icon: "👥" }
    ]
  },
  reviewer: {
    name: "Dr. John Smith",
    role: "Reviewer",
    department: "Information Technology",
    university: "University of Chittagong",
    email: "john.smith@university.edu",
    password: "John Smith10",
    stats: [
      { label: "Submitted Papers", value: 24, color: "bg-blue-100 text-blue-600", icon: "📄" },
      { label: "Review Papers", value: 18, color: "bg-green-100 text-green-600", icon: "🔍" },
      { label: "Total Teams", value: 6, color: "bg-purple-100 text-purple-600", icon: "👥" }
    ]
  }
};
