import { useState, useEffect } from "react";
import { AnalyticsService } from "../../services/analyticsService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

export default function Analytics() {
  const [analytics] = useState(AnalyticsService.getAnalytics());
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    setRecommendations(AnalyticsService.getPersonalizedRecommendations());
  }, []);

  // Prepare chart data
  const scoreData = analytics.interviewScores.map((score) => ({
    date: format(new Date(score.date), "MMM dd"),
    score: score.score,
    role: score.jobRole,
  }));

  const progressData = analytics.careerProgress.map((career) => ({
    name: career.career,
    progress: career.completionPercentage,
    score: career.score || 0,
  }));

  const activityData = analytics.studyTime.reduce((acc, session) => {
    const activity = session.activity;
    acc[activity] = (acc[activity] || 0) + session.timeSpent;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(activityData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: Math.round(value / 60), // Convert to hours
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomizedLabel = (entry: any) => {
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    const percent = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
    return `${entry.name} ${percent}%`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          📊 Career Analytics Dashboard
        </h2>
        <p className="text-xl text-gray-300">
          Track your progress and get personalized insights
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">
            Interviews Completed
          </h3>
          <p className="text-3xl font-bold text-white">
            {analytics.interviewScores.length}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            Average Score
          </h3>
          <p className="text-3xl font-bold text-white">
            {analytics.interviewScores.length > 0
              ? Math.round(
                  (analytics.interviewScores.reduce(
                    (sum, s) => sum + s.score,
                    0
                  ) /
                    analytics.interviewScores.length) *
                    10
                ) / 10
              : "0"}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">
            Careers Explored
          </h3>
          <p className="text-3xl font-bold text-white">
            {analytics.careerProgress.length}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">
            Study Hours
          </h3>
          <p className="text-3xl font-bold text-white">
            {Math.round(
              (analytics.studyTime.reduce((sum, s) => sum + s.timeSpent, 0) /
                60) *
                10
            ) / 10}
          </p>
        </div>
      </div>

      {/* Interview Score Trend */}
      {scoreData.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">
            📈 Interview Score Progression
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Career Progress */}
      {progressData.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">
            🎯 Career Exploration Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
              <Bar dataKey="progress" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Activity Distribution */}
      {pieData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              ⏱️ Time Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              🤖 AI Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="bg-blue-900/30 p-3 rounded-lg border border-blue-800/30"
                >
                  <p className="text-blue-200">{rec}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setRecommendations(
                  AnalyticsService.getPersonalizedRecommendations()
                )
              }
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              🔄 Refresh Recommendations
            </button>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">
          📝 Recent Interview Results
        </h3>
        {analytics.interviewScores.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No interview data yet. Complete your first interview to see
            analytics!
          </p>
        ) : (
          <div className="space-y-3">
            {analytics.interviewScores
              .slice(-5)
              .reverse()
              .map((score) => (
                <div key={score.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white">
                        {score.jobRole}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(score.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          score.score >= 7
                            ? "text-green-400"
                            : score.score >= 5
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {score.score}/10
                      </div>
                      <p className="text-gray-400 text-sm">
                        {Math.round(score.duration / 60)} min
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-400 text-sm font-medium mb-1">
                        Strengths:
                      </p>
                      <ul className="text-gray-300 text-sm">
                        {score.strengths.slice(0, 2).map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-orange-400 text-sm font-medium mb-1">
                        Improvements:
                      </p>
                      <ul className="text-gray-300 text-sm">
                        {score.improvements
                          .slice(0, 2)
                          .map((improvement, i) => (
                            <li key={i}>• {improvement}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}