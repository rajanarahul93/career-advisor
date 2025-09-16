export default function LoadingSpinner() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 text-center">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-150"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">
            🤖 AI is analyzing your profile...
          </h2>
          <p className="text-gray-400">
            Generating personalized career recommendations and skill roadmaps
          </p>
        </div>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}