import { useEffect, useState } from "react";

export function useAccessibility() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState("normal");

  useEffect(() => {
    // Check user preferences
    const highContrast = window.matchMedia("(prefers-contrast: high)").matches;
    const motionReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setIsHighContrast(highContrast);
    setReducedMotion(motionReduced);

    // Load saved preferences
    const savedFontSize =
      localStorage.getItem("accessibility-font-size") || "normal";
    setFontSize(savedFontSize);

    // Apply font size
    document.documentElement.style.fontSize =
      savedFontSize === "large"
        ? "1.25rem"
        : savedFontSize === "small"
        ? "0.875rem"
        : "1rem";
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    document.documentElement.classList.toggle("high-contrast", newValue);
  };

  const changeFontSize = (size: "small" | "normal" | "large") => {
    setFontSize(size);
    localStorage.setItem("accessibility-font-size", size);
    document.documentElement.style.fontSize =
      size === "large" ? "1.25rem" : size === "small" ? "0.875rem" : "1rem";
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.style.position = "absolute";
    announcement.style.left = "-10000px";
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return {
    isHighContrast,
    reducedMotion,
    fontSize,
    toggleHighContrast,
    changeFontSize,
    announceToScreenReader,
  };
}