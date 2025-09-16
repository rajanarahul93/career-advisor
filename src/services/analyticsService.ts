interface AnalyticsData {
  interviewScores: Array<{
    id: string;
    jobRole: string;
    score: number;
    date: Date;
    duration: number;
    strengths: string[];
    improvements: string[];
  }>;
  careerProgress: Array<{
    career: string;
    roadmapViewed: boolean;
    interviewCompleted: boolean;
    score?: number;
    lastActivity: Date;
    completionPercentage: number;
  }>;
  studyTime: Array<{
    date: Date;
    timeSpent: number;
    activity: "mentor" | "roadmap" | "interview";
  }>;
}

export class AnalyticsService {
  private static STORAGE_KEY = "career_advisor_analytics";

  static saveInterviewResult(
    jobRole: string,
    score: number,
    duration: number,
    strengths: string[],
    improvements: string[]
  ) {
    const analytics = this.getAnalytics();
    analytics.interviewScores.push({
      id: Date.now().toString(),
      jobRole,
      score,
      date: new Date(),
      duration,
      strengths,
      improvements,
    });
    this.saveAnalytics(analytics);
  }

  static updateCareerProgress(
    career: string,
    activity: "roadmap" | "interview",
    score?: number
  ) {
    const analytics = this.getAnalytics();
    let existing = analytics.careerProgress.find((p) => p.career === career);

    if (!existing) {
      existing = {
        career,
        roadmapViewed: false,
        interviewCompleted: false,
        lastActivity: new Date(),
        completionPercentage: 0,
      };
      analytics.careerProgress.push(existing);
    }

    if (activity === "roadmap") {
      existing.roadmapViewed = true;
      existing.completionPercentage = Math.max(
        existing.completionPercentage,
        50
      );
    } else if (activity === "interview") {
      existing.interviewCompleted = true;
      existing.score = score;
      existing.completionPercentage = 100;
    }

    existing.lastActivity = new Date();
    this.saveAnalytics(analytics);
  }

  static logStudyTime(
    activity: "mentor" | "roadmap" | "interview",
    timeSpent: number
  ) {
    const analytics = this.getAnalytics();
    analytics.studyTime.push({
      date: new Date(),
      timeSpent,
      activity,
    });
    this.saveAnalytics(analytics);
  }

  static getAnalytics(): AnalyticsData {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          interviewScores: [],
          careerProgress: [],
          studyTime: [],
        };
  }

  static saveAnalytics(data: AnalyticsData) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static getPersonalizedRecommendations(): string[] {
    const analytics = this.getAnalytics();
    const recommendations: string[] = [];

    // Analyze interview performance
    const avgScore =
      analytics.interviewScores.reduce(
        (sum, interview) => sum + interview.score,
        0
      ) / analytics.interviewScores.length;

    if (avgScore < 6) {
      recommendations.push(
        "Practice more technical interviews to improve your confidence"
      );
      recommendations.push("Focus on explaining your thought process clearly");
    } else if (avgScore > 8) {
      recommendations.push(
        "You're doing great! Consider applying for senior positions"
      );
    }

    // Analyze career interests
    const careerInterests = analytics.careerProgress.map((p) => p.career);
    if (
      careerInterests.includes("Frontend Developer") &&
      careerInterests.includes("Backend Developer")
    ) {
      recommendations.push(
        "Consider exploring Full Stack Development opportunities"
      );
    }

    // Study time analysis
    const totalTime = analytics.studyTime.reduce(
      (sum, session) => sum + session.timeSpent,
      0
    );
    if (totalTime < 300) {
      // Less than 5 hours
      recommendations.push(
        "Try to spend more time learning - consistency is key!"
      );
    }

    return recommendations.length > 0
      ? recommendations
      : ["Keep exploring different career paths to find your passion!"];
  }
}