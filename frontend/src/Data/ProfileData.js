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
    password: "JohnSmith10",
    stats: [
      { label: "Submitted Papers", value: 24, color: "bg-blue-100 text-blue-600", icon: "📄" },
      { label: "Review Papers", value: 18, color: "bg-green-100 text-green-600", icon: "🔍" },
      { label: "Total Teams", value: 6, color: "bg-purple-100 text-purple-600", icon: "👥" }
    ]
  },
  admin: {
    name: "Mr. David Lee",
    role: "Administrator",
    department: "Administration",
    university: "University of Chittagong",
    email: "admin@university.edu",
    password: "Admin12345",
    stats: [
      { label: "Total Users", value: 150, color: "bg-yellow-100 text-yellow-600", icon: "👤" },
      { label: "Managed Papers", value: 85, color: "bg-red-100 text-red-600", icon: "📑" },
      { label: "System Logs", value: 200, color: "bg-gray-100 text-gray-600", icon: "🗂️" }
    ]
  },
  student: {
    name: "Ayesha Rahman",
    role: "Student",
    department: "Software Engineering",
    university: "University of Chittagong",
    email: "ayesha.rahman@student.university.edu",
    password: "Ayesha123",
    stats: [
      { label: "Submitted Papers", value: 5, color: "bg-blue-100 text-blue-600", icon: "📄" },
      { label: "Team Projects", value: 3, color: "bg-purple-100 text-purple-600", icon: "👥" },
      { label: "Pending Reviews", value: 2, color: "bg-orange-100 text-orange-600", icon: "⏳" }
    ]
  }
};
