import React, { useState } from "react";
import { generateCareerRoadmap } from "../../services/geminiApi";
import ExportButton from "../ExportButton";

interface RoadmapData {
  title: string;
  overview: string;
  prerequisites: string[];
  phases: Array<{
    phase: string;
    skills: string[];
    resources: string[];
    projects: string[];
  }>;
  careerPaths: string[];
  salaryRange: string;
  companies: string[];
  tips: string[];
}

const POPULAR_CAREERS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "UI/UX Designer",
  "Digital Marketing Specialist",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
  "Mobile App Developer",
  "Product Manager",
  "Business Analyst",
  "Content Creator",
  "Graphic Designer",
];

export default function RoadmapGenerator() {
  const [careerInput, setCareerInput] = useState("");
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  const handleGenerateRoadmap = async () => {
    if (!careerInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setRoadmapData(null);

    try {
      const data = await generateCareerRoadmap(careerInput);
      setRoadmapData(data);
      setActivePhase(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate roadmap"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerateRoadmap();
    }
  };

  const handlePopularCareerClick = (career: string) => {
    setCareerInput(career);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-500 rounded-full animate-spin animation-delay-150"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">
                🛣️ Generating your roadmap...
              </h2>
              <p className="text-gray-400">
                Creating a personalized learning path for {careerInput}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (roadmapData) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <button
            onClick={() => setRoadmapData(null)}
            className="text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            ← Generate New Roadmap
          </button>
          <h1 className="text-3xl font-bold  bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {roadmapData.title} Roadmap
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            {roadmapData.overview}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              💰 Salary Range
            </h3>
            <p className="text-white">{roadmapData.salaryRange}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              🏢 Top Companies
            </h3>
            <p className="text-white">
              {roadmapData.companies.slice(0, 3).join(", ")}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              📈 Career Path
            </h3>
            <p className="text-white text-sm">{roadmapData.careerPaths[0]}</p>
          </div>
        </div>

        {/* Prerequisites */}
        {roadmapData.prerequisites.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              📋 Prerequisites
            </h2>
            <div className="flex flex-wrap gap-2">
              {roadmapData.prerequisites.map((prereq, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-900 text-orange-200 rounded-full text-sm"
                >
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Phase Navigation */}
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
            {roadmapData.phases.map((_, index) => (
              <button
                key={index}
                onClick={() => setActivePhase(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activePhase === index
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                Phase {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Active Phase Details */}
        <div
          id="roadmap-content"
          className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {roadmapData.phases[activePhase].phase}
          </h2>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Skills */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                <span className="mr-2">🎯</span> Skills to Learn
              </h3>
              <div className="space-y-2">
                {roadmapData.phases[activePhase].skills.map((skill, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-900/30 rounded-lg border border-blue-800/30"
                  >
                    <span className="text-blue-200">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-400 flex items-center">
                <span className="mr-2">📚</span> Learning Resources
              </h3>
              <div className="space-y-2">
                {roadmapData.phases[activePhase].resources.map(
                  (resource, index) => (
                    <div
                      key={index}
                      className="p-3 bg-green-900/30 rounded-lg border border-green-800/30"
                    >
                      <span className="text-green-200">{resource}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                <span className="mr-2">🚀</span> Practice Projects
              </h3>
              <div className="space-y-2">
                {roadmapData.phases[activePhase].projects.map(
                  (project, index) => (
                    <div
                      key={index}
                      className="p-3 bg-purple-900/30 rounded-lg border border-purple-800/30"
                    >
                      <span className="text-purple-200">{project}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border border-yellow-800/30">
          <h2 className="text-xl font-bold text-white mb-4">💡 Pro Tips</h2>
          <ul className="space-y-2">
            {roadmapData.tips.map((tip, index) => (
              <li key={index} className="text-yellow-200 flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced Export Button */}
        <div className="text-center">
          <ExportButton
            data={{
              ...roadmapData,
              exportedAt: new Date().toISOString(),
              metadata: {
                generatedFor: careerInput,
                totalPhases: roadmapData.phases.length,
                totalSkills: roadmapData.phases.reduce(
                  (sum, phase) => sum + phase.skills.length,
                  0
                ),
                estimatedDuration: roadmapData.phases.length * 6 + " months",
              },
            }}
            filename={`roadmap-${roadmapData.title.replace(/\s+/g, "-")}`}
            elementId="roadmap-content"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold  bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Career Roadmap Generator 🛣️
        </h2>
        <p className="text-xl text-gray-300">
          Get a detailed step-by-step learning path for any career
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-white">
            What career roadmap do you want to generate?
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={careerInput}
              onChange={(e) => setCareerInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Frontend Developer, Data Scientist, UI/UX Designer..."
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
            />
            <button
              onClick={handleGenerateRoadmap}
              disabled={!careerInput.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Popular Careers */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          🔥 Popular Career Paths:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {POPULAR_CAREERS.map((career) => (
            <button
              key={career}
              onClick={() => handlePopularCareerClick(career)}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 border border-gray-600 hover:border-blue-500 text-left"
            >
              <span className="text-white text-sm font-medium">{career}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-xl">
          <h3 className="text-red-400 font-semibold mb-2">⚠️ Error</h3>
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* How it works */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-800/30">
        <h3 className="text-lg font-semibold text-white mb-4">
          🎯 What you'll get:
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-300">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400">📊</span>
            <div>
              <strong>Structured Learning Phases</strong>
              <p className="text-sm">
                Foundation → Intermediate → Advanced progression
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-400">📚</span>
            <div>
              <strong>Curated Resources</strong>
              <p className="text-sm">
                Books, courses, tutorials, and documentation
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-purple-400">🚀</span>
            <div>
              <strong>Hands-on Projects</strong>
              <p className="text-sm">
                Real-world projects to build your portfolio
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-yellow-400">💡</span>
            <div>
              <strong>Industry Insights</strong>
              <p className="text-sm">
                Salary ranges, companies, and career paths
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}