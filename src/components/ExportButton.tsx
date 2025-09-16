import { useState } from "react";
import { ExportService, type ExportFormat } from "../services/exportService";

interface ExportButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  filename: string;
  elementId?: string;
  className?: string;
}

export default function ExportButton({
  data,
  filename,
  elementId,
  className,
}: ExportButtonProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("json");
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await ExportService.export({
        filename,
        format: selectedFormat,
        data,
        elementId,
      });

      // Show success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50";
      notification.textContent = `✅ ${selectedFormat.toUpperCase()} exported successfully!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } catch (error) {
      // Log the error for debugging
      console.error("Export failed:", error);

      // Show error notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50";
      notification.textContent = `❌ Export failed. Please try again.`;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } finally {
      setIsExporting(false);
      setShowDropdown(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Format Selection Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <span className="uppercase">{selectedFormat}</span>
            <span className="text-xs">▼</span>
          </button>

          {showDropdown && (
            <div className="absolute top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setSelectedFormat("json");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 rounded-t-lg ${
                  selectedFormat === "json"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300"
                }`}
              >
                📄 JSON Format
              </button>
              <button
                onClick={() => {
                  setSelectedFormat("pdf");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 rounded-b-lg ${
                  selectedFormat === "pdf"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300"
                }`}
              >
                📋 PDF Format
              </button>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <span>📥</span>
              <span>Export {selectedFormat.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}