import type  { GeminiResponse } from "../../services/geminiApi";

interface CareerResultsProps {
  results: GeminiResponse;
  onBack: () => void;
}

export default function CareerResults({ results, onBack }: CareerResultsProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 transition-colors mb-4"
        >
          ← Back to Profile Form
        </button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Your Personalized Career Path
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">{results.summary}</p>
      </div>

      {/* Career Recommendations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          🚀 Career Recommendations
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {results.careers.map((career, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-white mb-3">
                {career.title}
              </h3>
              <p className="text-gray-300 mb-4">{career.description}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {career.requiredSkills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-900 text-blue-200 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-green-400 mb-2">
                    Learning Path
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {career.learningPath.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                  <div>
                    <h4 className="text-xs font-semibold text-purple-400">
                      Average Salary
                    </h4>
                    <p className="text-sm text-white">{career.averageSalary}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-purple-400">
                      Job Outlook
                    </h4>
                    <p className="text-sm text-white">{career.jobOutlook}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skill Roadmaps */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          📚 Skill Development Roadmaps
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {results.skillRoadmaps.map((roadmap, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {roadmap.skill}
                </h3>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm">
                  {roadmap.timeline}
                </span>
              </div>

              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-400">Current:</span>
                <span className="ml-2 px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                  {roadmap.currentLevel}
                </span>
                <span className="mx-3 text-gray-500">→</span>
                <span className="text-sm text-gray-400">Target:</span>
                <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-sm">
                  {roadmap.targetLevel}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                    🎯 Milestones
                  </h4>
                  <ul className="space-y-1">
                    {roadmap.milestones.map((milestone, milestoneIndex) => (
                      <li
                        key={milestoneIndex}
                        className="text-sm text-gray-300 flex items-start"
                      >
                        <span className="text-yellow-400 mr-2">✓</span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                    📖 Resources
                  </h4>
                  <ul className="space-y-1">
                    {roadmap.resources.map((resource, resourceIndex) => (
                      <li
                        key={resourceIndex}
                        className="text-sm text-gray-300 flex items-start"
                      >
                        <span className="text-cyan-400 mr-2">•</span>
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}