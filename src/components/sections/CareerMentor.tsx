import React, { useState, useRef, useEffect } from "react";
import { getCareerMentorResponse } from "../../services/geminiApi";
import { type ChatMessage } from "../../types";
import ExportButton from "../ExportButton";

const TRENDING_CAREERS = [
  {
    title: "Frontend Developer",
    icon: "💻",
    description: "Build user interfaces for web applications",
  },
  {
    title: "Data Scientist",
    icon: "📊",
    description: "Analyze data to extract business insights",
  },
  {
    title: "Digital Marketing",
    icon: "📱",
    description: "Promote brands through digital channels",
  },
  {
    title: "UI/UX Designer",
    icon: "🎨",
    description: "Design user experiences for digital products",
  },
  {
    title: "Cybersecurity Analyst",
    icon: "🔒",
    description: "Protect systems from security threats",
  },
  {
    title: "Cloud Engineer",
    icon: "☁️",
    description: "Manage cloud infrastructure and services",
  },
];

export default function CareerMentor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hi there! 👋 I'm your AI Career Mentor. I'm here to help you explore career opportunities in India. Are you confused about what career to choose, or do you have specific interests you'd like to discuss?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTrendingCareers, setShowTrendingCareers] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);
    setShowTrendingCareers(false);

    try {
      const response = await getCareerMentorResponse(userInput);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later. 😔",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrendingCareerClick = async (career: string) => {
    const message = `Tell me about ${career} career in India`;
    setUserInput(message);
    // Auto-send the message
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        id="chat-container"
        className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🧭</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Career Mentor</h2>
              <p className="text-blue-100 text-sm">
                Your AI guide to career exploration
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              } animate-fadeIn`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Trending Careers */}
        {showTrendingCareers && (
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              🔥 Trending Careers in India:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TRENDING_CAREERS.map((career) => (
                <button
                  key={career.title}
                  onClick={() => handleTrendingCareerClick(career.title)}
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 border border-gray-600 hover:border-blue-500"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{career.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {career.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {career.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex space-x-3">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about careers, share your interests, or say you're confused..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              Send
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>

      {/* Enhanced Export Button */}
      <div className="text-center mt-6">
        <ExportButton
          data={{
            chatHistory: messages,
            exportedAt: new Date().toISOString(),
            totalMessages: messages.length,
            sessionDuration: `${Math.round(
              (new Date().getTime() - messages[0]?.timestamp.getTime()) / 60000
            )} minutes`,
          }}
          filename={`career-mentor-chat-${new Date()
            .toDateString()
            .replace(/\s/g, "-")}`}
          elementId="chat-container"
        />
      </div>

      {/* Tips Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-800/30">
        <h3 className="text-lg font-semibold text-white mb-2">
          💡 Tips for better guidance:
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Share your interests, hobbies, or subjects you enjoy</li>
          <li>• Mention your current education level or background</li>
          <li>
            • Ask about salary expectations, job market, or skill requirements
          </li>
          <li>
            • Feel free to say "I'm confused" if you're unsure where to start
          </li>
        </ul>
      </div>
    </div>
  );
}