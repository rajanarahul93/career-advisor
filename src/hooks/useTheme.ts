import { useState, useEffect, useCallback } from "react";

interface ThemeConfig {
  mode: "dark" | "light" | "auto";
  accentColor: "blue" | "purple" | "green" | "orange";
  fontSize: "small" | "normal" | "large";
  animations: boolean;
}

export function useTheme() {
  const [config, setConfig] = useState<ThemeConfig>({
    mode: "dark",
    accentColor: "blue",
    fontSize: "normal",
    animations: true,
  });

  const applyTheme = useCallback(
    (mode: "dark" | "light", accent: string) => {
      document.documentElement.className = `${mode} accent-${accent}`;

      if (!config.animations) {
        document.documentElement.classList.add("no-animations");
      }
    },
    [config.animations]
  );

  useEffect(() => {
    // Load saved theme config
    const saved = localStorage.getItem("theme-config");
    if (saved) {
      setConfig(JSON.parse(saved));
    }

    // Apply system preferences if auto mode
    if (config.mode === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(prefersDark ? "dark" : "light", config.accentColor);
    } else {
      applyTheme(config.mode, config.accentColor);
    }
  }, [config, applyTheme]);

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem("theme-config", JSON.stringify(newConfig));

    if (newConfig.mode !== "auto") {
      applyTheme(newConfig.mode, newConfig.accentColor);
    }
  };

  return { config, updateConfig };
}