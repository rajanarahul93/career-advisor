import { useEffect, useState } from "react";

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function ErrorNotification({
  message,
  onClose,
  duration = 5000,
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className="bg-red-900/90 border border-red-600 p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="text-red-400 text-xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-red-200 font-semibold text-sm">
              Service Issue
            </h3>
            <p className="text-red-300 text-sm mt-1">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-red-400 hover:text-red-200 ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}