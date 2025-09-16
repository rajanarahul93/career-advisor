import React, { useState, useRef } from "react";
import { conductInterview } from "../../services/geminiApi";
import ExportButton from "../ExportButton";
import { PDFExtractor } from "../../services/pdfExtractor";
import ErrorNotification from "../ErrorNotification";

interface InterviewQuestion {
  id: number;
  question: string;
  userAnswer: string;
  timestamp: Date;
}

interface InterviewSetup {
  mode: "resume" | "techstack" | null;
  techStacks: string[];
  resumeFile: File | null;
  jobRole: string;
  candidateName: string;
}

const TECH_STACKS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "React.js",
  "Node.js",
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Computing",
  "Mobile Development",
  "UI/UX Design",
  "Cybersecurity",
];

export default function MockInterview() {
  // Setup states
  const [setup, setSetup] = useState<InterviewSetup>({
    mode: null,
    techStacks: [],
    resumeFile: null,
    jobRole: "",
    candidateName: "",
  });

  // Interview states
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Text input state
  const [currentAnswer, setCurrentAnswer] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text-to-Speech function
  const speakQuestion = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleTechStackToggle = (stack: string) => {
    setSetup((prev) => ({
      ...prev,
      techStacks: prev.techStacks.includes(stack)
        ? prev.techStacks.filter((s) => s !== stack)
        : [...prev.techStacks, stack],
    }));
  };


const startInterview = async () => {
  setIsProcessing(true);
  setApiError(null); // Clear previous errors

  try {
    let prompt = "";
    const name = setup.candidateName || "Candidate";

    if (setup.mode === "techstack") {
      prompt = `You are conducting a technical interview for ${name} applying for a ${
        setup.jobRole
      } position. The candidate has expertise in: ${setup.techStacks.join(
        ", "
      )}. 
      
      Start the interview with a warm, professional greeting using their name, then ask a relevant technical question based on their selected skills. Keep questions focused, clear, and appropriate for the role level.
      
      Do NOT use placeholders like {candidate name} - use their actual name: ${name}.`;
    } else {
      prompt = `You are conducting a technical interview for ${name} applying for a ${setup.jobRole} position based on their uploaded resume. 
      
      Start with a warm, professional greeting using their name, then ask a relevant question about their background or experience as mentioned in their resume.
      
      Do NOT use placeholders like {candidate name} - use their actual name: ${name}.`;
    }

    const firstQuestion = await conductInterview(prompt);
    setCurrentQuestion(firstQuestion);
    setIsInterviewStarted(true);

    // Speak the first question
    setTimeout(() => speakQuestion(firstQuestion), 500);
  } catch (error) {
    console.error("Error starting interview:", error);
    setApiError(
      "The AI service is temporarily unavailable. Please try again in a few minutes, or check your internet connection."
    );
  } finally {
    setIsProcessing(false);
  }
};

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return;

    setIsProcessing(true);

    const newQuestion: InterviewQuestion = {
      id: questions.length + 1,
      question: currentQuestion,
      userAnswer: currentAnswer,
      timestamp: new Date(),
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    setCurrentAnswer("");

    try {
      if (updatedQuestions.length >= 5) {
        // End interview and generate feedback
        const feedbackPrompt = `Interview completed. Here are the questions and answers:
        ${updatedQuestions
          .map((q, i) => `Q${i + 1}: ${q.question}\nA${i + 1}: ${q.userAnswer}`)
          .join("\n\n")}
        
        Provide detailed feedback covering:
        1. Overall performance score (1-10)
        2. Strengths demonstrated
        3. Areas for improvement
        4. Specific suggestions for each answer
        5. Communication skills assessment
        6. Technical knowledge evaluation`;

        const finalFeedback = await conductInterview(feedbackPrompt);
        setFeedback(finalFeedback);
        setInterviewComplete(true);
      } else {
        // Get next question
        const nextQuestion = await conductInterview(
          currentQuestion,
          currentAnswer
        );
        setCurrentQuestion(nextQuestion);

        // Speak the next question
        setTimeout(() => speakQuestion(nextQuestion), 1000);
      }
    } catch (error) {
      console.error("Error processing answer:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSetup((prev) => ({ ...prev, resumeFile: file }));

      // Extract name from PDF
      try {
        const extractedName = await PDFExtractor.extractNameFromPDF(file);
        setSetup((prev) => ({
          ...prev,
          resumeFile: file,
          candidateName: extractedName,
        }));

        // Show success notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50";
        notification.textContent = `✅ Name extracted: ${extractedName}`;
        document.body.appendChild(notification);

        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 3000);
      } catch (error) {
        console.error("Error extracting name:", error);
        // Still allow interview without name extraction
      }
    }
  };
  const resetInterview = () => {
    setSetup({ mode: null, techStacks: [], resumeFile: null, jobRole: "", candidateName: "" });
    setIsInterviewStarted(false);
    setCurrentQuestion("");
    setQuestions([]);
    setInterviewComplete(false);
    setFeedback("");
    setCurrentAnswer("");
  };

  // Interview Complete View
  if (interviewComplete) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold  bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            🎉 Interview Complete!
          </h2>
          <p className="text-gray-300">
            Great job! Here's your detailed feedback and performance analysis.
          </p>
        </div>

        {/* Feedback */}
        <div
          id="interview-results"
          className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            📊 AI Feedback & Analysis
          </h3>
          <div className="bg-gray-900 p-4 rounded-lg">
            <pre className="text-gray-300 whitespace-pre-wrap font-sans">
              {feedback}
            </pre>
          </div>
        </div>

        {/* Interview Transcript */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">
            📝 Interview Transcript
          </h3>
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="border-l-4 border-blue-500 pl-4">
                <div className="mb-2">
                  <span className="text-blue-400 font-semibold">
                    Q{index + 1}:{" "}
                  </span>
                  <span className="text-gray-300">{q.question}</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">
                    Your Answer:{" "}
                  </span>
                  <span className="text-gray-300">{q.userAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Export Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <ExportButton
            data={{
              jobRole: setup.jobRole,
              interviewDate: new Date().toISOString(),
              questions: questions,
              feedback: feedback,
              performance: {
                totalQuestions: questions.length,
                averageAnswerLength: Math.round(
                  questions.reduce((sum, q) => sum + q.userAnswer.length, 0) /
                    questions.length
                ),
                completionTime: `${Math.round(
                  (new Date().getTime() - questions[0]?.timestamp.getTime()) /
                    60000
                )} minutes`,
              },
            }}
            filename={`interview-${setup.jobRole.replace(
              /\s+/g,
              "-"
            )}-${new Date().toDateString().replace(/\s/g, "-")}`}
            elementId="interview-results"
            className="flex-1"
          />
        </div>

        <div className="text-center">
          <button
            onClick={resetInterview}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  // Active Interview View
  if (isInterviewStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            ✍️ Mock Interview in Progress
          </h2>
          <p className="text-gray-300">Question {questions.length + 1} of 5</p>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questions.length / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                AI Interviewer
              </h3>
              <p className="text-gray-300 text-lg">{currentQuestion}</p>
            </div>
          </div>
        </div>

        {/* Text Answer Interface */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-blue-400 mb-2">
                ✍️ Your Response
              </h4>
              <p className="text-gray-300">
                Take your time to craft a thoughtful answer
              </p>
              <div className="mt-2 inline-flex items-center space-x-2 text-sm text-gray-400">
                <span className="text-yellow-400">🔊</span>
                <span>Audio responses coming soon - type for now</span>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your detailed answer here. Consider including specific examples, technologies you've used, challenges you've faced, and solutions you've implemented..."
                rows={8}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{currentAnswer.length} characters</span>
                <span>💡 Aim for detailed, specific responses</span>
              </div>

              <button
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim() || isProcessing}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Answer...</span>
                  </div>
                ) : (
                  "Submit Answer & Continue"
                )}
              </button>
            </div>

            {/* Interview Tips */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-blue-800/30">
              <div className="text-center">
                <h5 className="text-sm font-semibold text-blue-400 mb-2">
                  📋 Interview Tips
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
                  <div>• Use specific examples</div>
                  <div>• Explain your thought process</div>
                  <div>• Mention technologies used</div>
                  <div>• Discuss challenges faced</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Questions */}
        {questions.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              📋 Previous Questions
            </h3>
            <div className="space-y-3">
              {questions.slice(-2).map((q) => (
                <div key={q.id} className="text-sm">
                  <p className="text-gray-400">Q: {q.question}</p>
                  <p className="text-gray-300">
                    A: {q.userAnswer.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Setup View
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
          AI-Powered Mock Interview ✍️
        </h2>
        <p className="text-xl text-gray-300">
          Practice with text-based AI interviews and get detailed feedback
        </p>
        <div className="inline-flex items-center space-x-2 bg-blue-900/30 px-4 py-2 rounded-full border border-blue-800/50">
          <span className="text-blue-400">🎤</span>
          <span className="text-blue-300 text-sm">
            Voice answers coming soon!
          </span>
        </div>
      </div>

      {/* Mode Selection */}
      {!setup.mode && (
        <div className="grid md:grid-cols-2 gap-6">
          <div
            onClick={() => setSetup((prev) => ({ ...prev, mode: "techstack" }))}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <div className="text-center space-y-4">
              <div className="text-4xl">⚡</div>
              <h3 className="text-xl font-bold text-white">
                Select Tech Stacks
              </h3>
              <p className="text-gray-400">
                Choose your skills and get targeted questions
              </p>
            </div>
          </div>

          <div
            onClick={() => setSetup((prev) => ({ ...prev, mode: "resume" }))}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <div className="text-center space-y-4">
              <div className="text-4xl">📄</div>
              <h3 className="text-xl font-bold text-white">Upload Resume</h3>
              <p className="text-gray-400">
                AI will analyze your resume and ask relevant questions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tech Stack Selection */}
      {setup.mode === "techstack" && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              Tell Us About Yourself
            </h3>
            <button
              onClick={() => setSetup((prev) => ({ ...prev, mode: null }))}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-4">
            {/* ✅ ADD: Name Input Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Your Full Name *
              </label>
              <input
                type="text"
                value={setup.candidateName}
                onChange={(e) =>
                  setSetup((prev) => ({
                    ...prev,
                    candidateName: e.target.value,
                  }))
                }
                placeholder="Enter your full name (e.g., John Doe)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Job Role Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Target Job Role *
              </label>
              <input
                type="text"
                value={setup.jobRole}
                onChange={(e) =>
                  setSetup((prev) => ({ ...prev, jobRole: e.target.value }))
                }
                placeholder="Enter job role (e.g., Frontend Developer, Data Scientist)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Tech Stacks Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Select Your Tech Stacks *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {TECH_STACKS.map((stack) => (
                  <button
                    key={stack}
                    onClick={() => handleTechStackToggle(stack)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      setup.techStacks.includes(stack)
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {stack}
                  </button>
                ))}
              </div>
              {setup.techStacks.length > 0 && (
                <p className="text-sm text-green-400 mt-2">
                  ✅ {setup.techStacks.length} technologies selected
                </p>
              )}
            </div>

            <button
              onClick={startInterview}
              disabled={
                !setup.candidateName.trim() ||
                !setup.jobRole ||
                setup.techStacks.length === 0 ||
                isProcessing
              }
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing
                ? "Starting Interview..."
                : `Start Interview for ${setup.candidateName || "Candidate"}`}
            </button>
          </div>
        </div>
      )}

      {/* Resume Upload */}
      {setup.mode === "resume" && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Upload Your Resume</h3>
            <button
              onClick={() => setSetup((prev) => ({ ...prev, mode: null }))}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-4">
            {/* Job Role Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Target Job Role *
              </label>
              <input
                type="text"
                value={setup.jobRole}
                onChange={(e) =>
                  setSetup((prev) => ({ ...prev, jobRole: e.target.value }))
                }
                placeholder="Enter target job role"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Upload Resume (PDF) *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="text-4xl">📄</div>
                  <p className="text-white">
                    {setup.resumeFile
                      ? setup.resumeFile.name
                      : "Click to upload your resume (PDF)"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    We'll automatically extract your name and analyze your
                    background
                  </p>
                </div>
              </div>
            </div>

            {/* Show extracted name */}
            {setup.candidateName && setup.candidateName !== "Candidate" && (
              <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
                <p className="text-green-200">
                  ✅ <strong>Extracted Name:</strong> {setup.candidateName}
                </p>
                <button
                  onClick={() => {
                    const newName = prompt(
                      "Edit your name:",
                      setup.candidateName
                    );
                    if (newName && newName.trim()) {
                      setSetup((prev) => ({
                        ...prev,
                        candidateName: newName.trim(),
                      }));
                    }
                  }}
                  className="text-green-400 text-sm hover:text-green-300 mt-2"
                >
                  ✏️ Edit Name
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />

            <button
              onClick={startInterview}
              disabled={
                !setup.jobRole ||
                !setup.resumeFile ||
                !setup.candidateName ||
                isProcessing
              }
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing
                ? "Analyzing Resume..."
                : `Start Interview for ${setup.candidateName || "Candidate"}`}
            </button>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-800/30">
        <h3 className="text-lg font-semibold text-white mb-4">
          🚀 Interview Features:
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400">✍️</span>
            <div>
              <strong>Text-Based Responses:</strong> Type detailed, thoughtful
              answers
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-400">🔊</span>
            <div>
              <strong>AI Voice Questions:</strong> Hear questions spoken by AI
              interviewer
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-purple-400">📊</span>
            <div>
              <strong>Detailed Feedback:</strong> Performance analysis with
              improvement tips
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-yellow-400">📝</span>
            <div>
              <strong>Interview Transcript:</strong> Review all questions and
              your answers
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-orange-400">🎤</span>
            <div>
              <strong>Voice Responses:</strong>{" "}
              <span className="text-orange-300">Coming Soon!</span> Answer
              questions with speech
            </div>
          </div>
        </div>
      </div>
      {apiError && (
        <ErrorNotification
          message={apiError}
          onClose={() => setApiError(null)}
        />
      )}
    </div>
  );
}