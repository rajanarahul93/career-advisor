import { useState, useEffect, Suspense, lazy } from "react";
import Navigation from "./components/Navigation";
import PWAPrompt from "./components/PWAPrompt";
import LoadingSpinner from "./components/LoadingSpinner";
import { type AppSection } from "./types";
import { AnalyticsService } from "./services/analyticsService";
import "./App.css";

// Lazy load components
const HomePage = lazy(() => import("./components/sections/HomePage"));
const CareerMentor = lazy(() => import("./components/sections/CareerMentor"));
const RoadmapGenerator = lazy(
  () => import("./components/sections/RoadmapGenerator")
);
const MockInterview = lazy(() => import("./components/sections/MockInterview"));
const Analytics = lazy(() => import("./components/sections/Analytics"));

function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>("home");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const sectionStartTime = new Date();

    const handleBeforeUnload = () => {
      const timeSpent =
        (new Date().getTime() - sectionStartTime.getTime()) / 1000 / 60;
      if (timeSpent > 1) {
        AnalyticsService.logStudyTime(
          currentSection === "interview"
            ? "interview"
            : currentSection === "roadmap"
            ? "roadmap"
            : "mentor",
          timeSpent
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Log time when section changes
      const timeSpent =
        (new Date().getTime() - sectionStartTime.getTime()) / 1000 / 60;
      if (timeSpent > 1) {
        AnalyticsService.logStudyTime(
          currentSection === "interview"
            ? "interview"
            : currentSection === "roadmap"
            ? "roadmap"
            : "mentor",
          timeSpent
        );
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentSection]);

  const renderCurrentSection = () => (
    <Suspense fallback={<LoadingSpinner />}>
      {(() => {
        switch (currentSection) {
          case "home":
            return <HomePage onSectionChange={setCurrentSection} />;
          case "mentor":
            return <CareerMentor />;
          case "roadmap":
            return <RoadmapGenerator />;
          case "interview":
            return <MockInterview />;
          case "analytics":
            return <Analytics />;
          default:
            return <HomePage onSectionChange={setCurrentSection} />;
        }
      })()}
    </Suspense>
  );

  return (
    <div>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Personalized Career & Skills Advisor
          </h1>

          <Navigation
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
          />

          <main>{renderCurrentSection()}</main>
        </div>
      </div>

      <PWAPrompt />
    </div>
  );
}

export default App;