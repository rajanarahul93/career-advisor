import {type  AppSection } from "../types";

interface NavigationProps {
  currentSection: AppSection;
  onSectionChange: (section: AppSection) => void;
}

export default function Navigation({
  currentSection,
  onSectionChange,
}: NavigationProps) {
  const sections = [
    {
      id: "home" as AppSection,
      name: "Home",
      icon: "🏠",
      description: "Welcome",
    },
    {
      id: "mentor" as AppSection,
      name: "Career Mentor",
      icon: "🧭",
      description: "Get guidance",
    },
    {
      id: "roadmap" as AppSection,
      name: "Roadmap",
      icon: "🛣️",
      description: "Learning paths",
    },
    {
      id: "interview" as AppSection,
      name: "Mock Interview",
      icon: "🎤",
      description: "Practice interviews",
    },
    {
      id: "analytics" as AppSection,
      name: "Analytics",
      icon: "📊",
      description: "Track progress",
    },
  ];

  return (
    <nav className="max-w-4xl mx-auto mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
              currentSection === section.id
                ? "bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500 text-white shadow-lg"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl">{section.icon}</div>
              <div className="font-semibold">{section.name}</div>
              <div className="text-xs opacity-75">{section.description}</div>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}