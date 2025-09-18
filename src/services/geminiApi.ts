/* eslint-disable @typescript-eslint/no-explicit-any */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

export interface GeminiResponse {
  summary: string;
  careers: Array<{
    title: string;
    description: string;
    requiredSkills: string[];
    learningPath: string[];
    averageSalary: string;
    jobOutlook: string;
  }>;
  skillRoadmaps: Array<{
    skill: string;
    timeline: string;
    currentLevel: string;
    targetLevel: string;
    milestones: string[];
    resources: string[];
  }>;
}


// Utility function for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Enhanced API call with retry logic
async function callGeminiWithRetry(
  prompt: string,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<string> {
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      }

      // Handle specific error codes
      if (response.status === 503) {
        throw new Error(`Service temporarily unavailable (${response.status})`);
      } else if (response.status === 429) {
        throw new Error(`Rate limit exceeded (${response.status})`);
      } else if (response.status === 400) {
        throw new Error(`Invalid request (${response.status})`);
      } else {
        throw new Error(
          `API error (${response.status}): ${response.statusText}`
        );
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on final attempt
      if (attempt === config.maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delayTime =
        config.delayMs * Math.pow(config.backoffMultiplier, attempt);

      console.log(
        `Attempt ${attempt + 1} failed: ${
          lastError.message
        }. Retrying in ${delayTime}ms...`
      );

      // Wait before retrying
      await delay(delayTime);
    }
  }

  // All retries failed
  throw new Error(
    `Gemini API failed after ${config.maxRetries + 1} attempts: ${
      lastError.message
    }`
  );
}

// Career Mentor API
export async function getCareerMentorResponse(
  userInput: string
): Promise<string> {
  const prompt = `You are an AI Career Mentor specializing in Indian job market and career guidance. 
  Provide helpful, actionable advice for: ${userInput}
  
  Keep responses conversational, encouraging, and specific to India's job market.`;

  try {
    return await callGeminiWithRetry(prompt);
  } catch (error) {
    console.error("Career Mentor API error:", error);
    return getFallbackCareerResponse();
  }
}

function parseJsonFromMarkdown(markdownString: string): any {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = markdownString.match(jsonRegex);

  // If match is found, parse the captured group, otherwise parse the whole string
  const stringToParse = match ? match[1] : markdownString;

  return JSON.parse(stringToParse.trim());
}
// Roadmap Generator API
export async function generateCareerRoadmap(career: string): Promise<any> {
  const prompt = `Create a detailed career roadmap for "${career}" in India. Return a JSON object with:
  {
    "title": "Career title",
    "overview": "Brief overview",
    "prerequisites": ["prerequisite1", "prerequisite2"],
    "phases": [
      {
        "phase": "Phase name",
        "skills": ["skill1", "skill2"],
        "resources": ["resource1", "resource2"],
        "projects": ["project1", "project2"]
      }
    ],
    "careerPaths": ["path1", "path2"],
    "salaryRange": "salary range in INR",
    "companies": ["company1", "company2"],
    "tips": ["tip1", "tip2"]
  }`;

  try {
    const response = await callGeminiWithRetry(prompt);
    return parseJsonFromMarkdown(response);
  } catch (error) {
    console.error("Roadmap API error:", error);
    return getFallbackRoadmap(career);
  }
}

// Interview Conductor API
export async function conductInterview(
  prompt: string,
  previousAnswer?: string
): Promise<string> {
  let fullPrompt = prompt;

  if (previousAnswer) {
    fullPrompt += `\n\nCandidate's previous answer: ${previousAnswer}\n\nNow ask the next relevant question.`;
  }

  try {
    return await callGeminiWithRetry(fullPrompt);
  } catch (error) {
    console.error("Interview API error:", error);
    return getFallbackInterviewResponse(previousAnswer ? "next" : "first");
  }
}

// Fallback responses when API is unavailable
function getFallbackCareerResponse(): string {
  const fallbacks = [
    "I'm currently experiencing connectivity issues, but I'd love to help you explore career opportunities! In the meantime, consider researching roles in growing sectors like technology, healthcare, and renewable energy in India.",
    "The service is temporarily unavailable, but here's some quick advice: Focus on developing both technical and soft skills, build a strong online presence, and network within your industry of interest.",
    "I'm having trouble connecting right now, but remember that career growth comes from continuous learning, seeking mentorship, and staying updated with industry trends. What specific career area interests you most?",
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function getFallbackRoadmap(career: string): any {
  return {
    title: `${career} Career Path`,
    overview: `Due to temporary service issues, here's a basic roadmap outline for ${career}. This is a simplified version - please try again later for detailed guidance.`,
    prerequisites: [
      "Basic computer skills",
      "English proficiency",
      "Problem-solving mindset",
    ],
    phases: [
      {
        phase: "Foundation (Months 1-6)",
        skills: ["Core fundamentals", "Industry basics", "Tool familiarity"],
        resources: ["Online courses", "Documentation", "Practice platforms"],
        projects: ["Beginner project", "Practice exercises", "Portfolio setup"],
      },
      {
        phase: "Development (Months 6-12)",
        skills: [
          "Intermediate concepts",
          "Framework knowledge",
          "Best practices",
        ],
        resources: ["Advanced courses", "Community forums", "Mentorship"],
        projects: [
          "Personal projects",
          "Open source contributions",
          "Collaboration work",
        ],
      },
      {
        phase: "Professional (Months 12+)",
        skills: ["Advanced expertise", "Leadership", "Specialization"],
        resources: ["Professional networks", "Conferences", "Certifications"],
        projects: [
          "Complex applications",
          "Team projects",
          "Industry solutions",
        ],
      },
    ],
    careerPaths: [
      "Junior → Mid-level → Senior → Lead",
      "Individual contributor → Manager",
    ],
    salaryRange: "₹3-25 LPA (varies by experience and location)",
    companies: [
      "Startups",
      "Mid-size companies",
      "Large corporations",
      "Freelance",
    ],
    tips: [
      "Build a strong portfolio",
      "Network with professionals",
      "Stay updated with industry trends",
      "Practice continuous learning",
      "Seek mentorship opportunities",
    ],
  };
}

function getFallbackInterviewResponse(type: string): string {
  const firstQuestions = [
    "I'm experiencing some connectivity issues, but let's continue with your interview. Tell me about yourself and what interests you about this role.",
    "Due to temporary service issues, let me ask you this: What motivated you to apply for this position and what makes you a good fit?",
    "While I'm having some technical difficulties, I'd still like to learn about your background. Can you walk me through your relevant experience?",
  ];

  const nextQuestions = [
    "That's interesting! Due to some connectivity issues, let me ask you a follow-up question: How do you handle challenges in your work?",
    "Thank you for that response. I'm experiencing some technical issues, but let's continue: What are your key strengths and how do they apply to this role?",
    "Great answer! While I'm having some service issues, I'd like to know: How do you stay updated with industry trends and technologies?",
  ];

  const questions = type === "first" ? firstQuestions : nextQuestions;
  return questions[Math.floor(Math.random() * questions.length)];
}
