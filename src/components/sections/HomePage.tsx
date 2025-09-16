import { type AppSection } from "../../types";

interface HomePageProps {
  onSectionChange: (section: AppSection) => void;
}

export default function HomePage({ onSectionChange }: HomePageProps) {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">
          Welcome to Your Career Journey! 🚀
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover your perfect career path with AI-powered guidance,
          personalized roadmaps, and interview preparation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div
          onClick={() => onSectionChange("mentor")}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          <div className="text-4xl mb-4">🧭</div>
          <h3 className="text-xl font-bold text-white mb-2">Career Mentor</h3>
          <p className="text-gray-400">
            Not sure what career to choose? Chat with our AI mentor to explore
            trending opportunities and discover your interests.
          </p>
        </div>

        <div
          onClick={() => onSectionChange("roadmap")}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          <div className="text-4xl mb-4">🛣️</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Learning Roadmap
          </h3>
          <p className="text-gray-400">
            Know your target career? Get a complete step-by-step roadmap with
            resources, projects, and timelines.
          </p>
        </div>

        <div
          onClick={() => onSectionChange("interview")}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          <div className="text-4xl mb-4">🎤</div>
          <h3 className="text-xl font-bold text-white mb-2">Mock Interview</h3>
          <p className="text-gray-400 mb-3">
            Ready to interview? Practice with our AI interviewer and get
            feedback to improve your performance.
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-900/30 px-3 py-1 rounded-full border border-green-800/50">
            <span className="text-green-400">🔊</span>
            <span className="text-green-300 text-xs">
              Voice answers coming soon!
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-800/30">
        <h3 className="text-lg font-semibold text-white mb-2">
          🎯 How it works
        </h3>
        <div className="text-gray-300 text-left max-w-2xl mx-auto space-y-2">
          <p>
            1. <strong>Explore:</strong> Chat with our Career Mentor if you're
            unsure about career options
          </p>
          <p>
            2. <strong>Plan:</strong> Generate a detailed roadmap for your
            chosen career path
          </p>
          <p>
            3. <strong>Practice:</strong> Simulate interviews and get AI
            feedback to improve
          </p>
        </div>
      </div>
    </div>
  );
}