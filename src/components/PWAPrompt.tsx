import { usePWA } from "../hooks/usePWA";

export default function PWAPrompt() {
  const { isInstallable, installApp, requestNotificationPermission } = usePWA();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-lg z-50 md:max-w-md md:left-auto">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">📱</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">Install Career Advisor</h3>
          <p className="text-sm opacity-90">
            Get the full app experience with offline access and notifications!
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={installApp}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Install App
            </button>
            <button
              onClick={async () => {
                await requestNotificationPermission();
                installApp();
              }}
              className="px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold text-sm hover:bg-blue-900 transition-colors"
            >
              Install + Notifications
            </button>
          </div>
        </div>
        <button
          onClick={() => document.querySelector(".pwa-prompt")?.remove()}
          className="text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}