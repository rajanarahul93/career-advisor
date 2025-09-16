import { useState } from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState({
    rating: 0,
    category: "",
    message: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const submitFeedback = async () => {
    setIsSubmitting(true);

    try {
      // Store feedback locally (in production, send to backend)
      const existingFeedback = JSON.parse(
        localStorage.getItem("user_feedback") || "[]"
      );
      existingFeedback.push({
        ...feedback,
        timestamp: new Date().toISOString(),
        id: Date.now(),
      });
      localStorage.setItem("user_feedback", JSON.stringify(existingFeedback));

      // Show success message
      alert("Thank you for your feedback! We'll use it to improve the app.");
      onClose();
    } catch {
      alert(
        "Sorry, there was an error submitting your feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Share Your Feedback</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFeedback((prev) => ({ ...prev, rating }))}
                  className={`text-2xl ${
                    feedback.rating >= rating
                      ? "text-yellow-400"
                      : "text-gray-600"
                  } hover:text-yellow-400 transition-colors`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Category
            </label>
            <select
              value={feedback.category}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="">Select category</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="ui">UI/UX Feedback</option>
              <option value="performance">Performance Issue</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Your Message
            </label>
            <textarea
              value={feedback.message}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Tell us what you think..."
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={feedback.email}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="your@email.com"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={submitFeedback}
            disabled={!feedback.rating || !feedback.message || isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}