export class SocialShareService {
  static shareRoadmap(roadmapTitle: string, achievements: string[]) {
    const text = `🚀 Just completed the ${roadmapTitle} roadmap on Career Advisor! 
    
Key achievements:
${achievements.map((a) => `✅ ${a}`).join("\n")}

#CareerGrowth #TechSkills #LearningJourney`;

    this.shareToClipboard(text);
  }

  static shareInterviewScore(
    jobRole: string,
    score: number,
    improvements: number
  ) {
    const scoreEmoji = score >= 8 ? "🎉" : score >= 6 ? "💪" : "📈";
    const text = `${scoreEmoji} Just scored ${score}/10 in my ${jobRole} mock interview!
    
Improved by ${improvements} points from my last attempt. Grateful for the AI-powered feedback helping me level up! 

#MockInterview #CareerPrep #TechInterview #SkillBuilding`;

    this.shareToClipboard(text);
  }

  static shareAchievement(achievement: string, metric: string) {
    const text = `🎯 Career milestone unlocked: ${achievement}!
    
📊 ${metric}

Building my future one skill at a time with AI-powered career guidance.

#CareerDevelopment #SkillBuilding #TechCareers #Achievement`;

    this.shareToClipboard(text);
  }

  private static shareToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Show success notification
        this.showNotification(
          "✅ Copied to clipboard! Ready to share on social media."
        );
      })
      .catch(() => {
        // Fallback - show text in modal
        this.showShareModal(text);
      });
  }

  private static showNotification(message: string) {
    // Create and show a temporary notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateY(-100px)";
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  private static showShareModal(text: string) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    modal.innerHTML = `
      <div class="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
        <h3 class="text-lg font-bold text-white mb-4">Share Your Achievement</h3>
        <textarea readonly class="w-full h-32 p-3 bg-gray-700 text-white rounded border resize-none" onclick="this.select()">${text}</textarea>
        <div class="flex justify-end mt-4">
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  static generateShareableCard(
    title: string,
    stats: Record<string, string>
  ): string {
    return `
🎓 ${title}

${Object.entries(stats)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

Powered by AI Career Advisor
#CareerGrowth #TechSkills
    `.trim();
  }
}