# Career Advisor
## Personalized Career & Skills Advisor 🚀

<div align="center">

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**An AI-powered career guidance platform that helps users explore careers, generate learning roadmaps, practice interviews, and track their professional development journey.**


</div>

---

##  Features

###  **AI Career Mentor**
- **Interactive Chat Interface** - Get personalized career advice through AI-powered conversations
- **Indian Job Market Focus** - Specialized guidance for careers in India
- **Trending Career Suggestions** - Quick access to popular career paths (Frontend Developer, Data Scientist, UI/UX Designer, etc.)
- **Chat History Export** - Save conversations in JSON format
- **Real-time Responses** - Instant AI-powered career guidance with fallback support
- **Smart Caching** - AI response caching for faster interactions

###  **Career Roadmap Generator**
- **Detailed Learning Paths** - Step-by-step roadmaps for any career
- **Phase-based Structure** - Foundation → Intermediate → Advanced progression
- **Curated Resources** - Books, courses, tutorials, and documentation
- **Hands-on Projects** - Real-world projects to build your portfolio
- **Industry Insights** - Salary ranges, top companies, and career paths
- **Export Options** - Save roadmaps as JSON or high-quality PDF
- **Interactive Navigation** - Browse through different learning phases
- **Prerequisites Tracking** - Clear requirements before starting

###  **AI Mock Interview**
- **Dual Setup Modes** - Tech stack selection or resume upload
- **Smart Name Extraction** - Automatic candidate name extraction from PDF resumes
- **Personalized Questions** - AI addresses candidates by their actual names
- **Voice Questions** - AI speaks questions aloud for realistic experience
- **Text-based Responses** - Type detailed answers with character counting
- **5-Question Structure** - Comprehensive interview with progress tracking
- **Detailed Feedback** - Performance analysis with strengths and improvement areas
- **Interview Transcript** - Complete Q&A history with timestamps
- **Export Results** - Download interview results as JSON or PDF

###  **Advanced Analytics Dashboard**
- **Performance Metrics** - Track interview scores and trends over time
- **Interactive Charts** - Beautiful visualizations using Recharts library
- **Study Time Tracking** - Monitor time spent on different activities
- **Career Progress Visualization** - Visual representation of learning journey
- **AI Recommendations** - Personalized suggestions based on usage patterns
- **Cache Hit Rate** - Monitor AI response caching efficiency
- **Export Analytics** - Download analytics data for external analysis

###  **Data Management & Persistence**
- **IndexedDB Storage** - Persistent client-side data storage
- **Chat History Persistence** - Save and resume conversations
- **Roadmap Library** - Store generated roadmaps for future reference
- **Interview Archives** - Keep track of all completed interviews
- **Bookmarking System** - Mark favorite roadmaps and content
- **Data Export** - Comprehensive export functionality (JSON/PDF/CSV)
- **Social Sharing** - Share achievements and progress on social media

###  **Progressive Web App (PWA)**
- **Installable** - Add to home screen on mobile and desktop
- **Offline Functionality** - Core features work without internet
- **Service Worker** - Advanced caching and background sync
- **Push Notifications** - Career tips and interview reminders
- **App-like Experience** - Native app feel with web technologies
- **Cross-platform** - Works on iOS, Android, Windows, macOS, Linux

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern UI library with concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling

### AI & APIs
- **Google Gemini API** - Advanced AI for conversations and content generation
- **Speech Synthesis Web API** - Text-to-speech for interview questions
- **PDF.js** - Client-side PDF parsing and text extraction

### Data & Storage
- **IndexedDB** - Browser-native persistent storage
- **LocalStorage** - Quick data caching and preferences
- **Service Worker** - Offline data management and sync

### Charts & Visualization
- **Recharts** - Responsive charts built on D3.js
- **HTML2Canvas** - Convert DOM elements to images
- **jsPDF** - Client-side PDF generation

### PWA & Performance
- **Service Worker** - Offline functionality and smart caching
- **Web App Manifest** - Installation and native app experience
- **Code Splitting** - Lazy loading for optimal performance
- **Image Optimization** - Responsive images and lazy loading

### Development Tools
- **ESLint** - Code linting with React and TypeScript rules
- **Prettier** - Automatic code formatting
- **Husky** - Git hooks for quality assurance
- **Vite PWA Plugin** - Simplified PWA configuration

---

##  Quick Start

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **yarn** package manager
- **Google Gemini API key** (free tier available)

### Installation

1. **Clone the repository**
   ```
   git clone https://github.com/rajanarahul93/career-advisor.git
   cd career-advisor
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   ```
   cp .env.example .env
   ```
   
   Add your API keys to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```
# Build the application
npm run build

# Preview the production build
npm run preview

# Lint the code
npm run lint

# Format the code
npm run format
```

---

##  Usage Guide

### Career Mentor
1. **Start Conversation**
   - Click on "Career Mentor" in navigation
   - Use trending career buttons for quick topics
   - Type questions about careers, skills, or industries

2. **Interactive Features**
   - Real-time AI responses with typing indicators
   - Chat history persistence across sessions
   - Export conversations as JSON files
   - Smart caching for faster repeated questions

3. **Pro Tips**
   - Be specific about your interests and background
   - Ask about salary expectations and job market trends
   - Mention your education level for targeted advice
   - Save important conversations for future reference

###  Roadmap Generator
1. **Create Roadmap**
   - Enter target career (e.g., "Full Stack Developer")
   - Select from popular career suggestions
   - Click "Generate" for AI-powered roadmap

2. **Explore Content**
   - Navigate through learning phases (Foundation → Advanced)
   - Review skills, resources, and projects for each phase
   - Check prerequisites and career progression paths
   - View salary ranges and top hiring companies

3. **Export & Save**
   - Export as JSON for programmatic access
   - Download as PDF for offline reading
   - Bookmark favorite roadmaps for quick access

###  Mock Interview
1. **Setup Interview**
   - **Tech Stack Mode**: Enter name, job role, select technologies
   - **Resume Mode**: Upload PDF resume for automatic name extraction
   - Verify extracted information before starting

2. **Interview Process**
   - Listen to AI-spoken questions (optional)
   - Type detailed responses (aim for 200+ characters)
   - Submit answers to proceed to next question
   - Complete 5 questions for full interview

3. **Review Results**
   - Get detailed AI feedback with performance score
   - Review complete interview transcript
   - Export results as JSON or PDF
   - Track progress in Analytics dashboard

###  Analytics Dashboard
1. **Performance Tracking**
   - View interview scores and trends over time
   - Monitor study time across different activities
   - Track career exploration progress

2. **Visual Insights**
   - Interactive charts showing performance trends
   - Time distribution across app features
   - Career completion percentages

3. **AI Recommendations**
   - Personalized suggestions based on usage patterns
   - Performance improvement tips
   - Career path recommendations

---

##  Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup
1. **Fork the repository**
2. **Create feature branch**
   ```
   git checkout -b feature/amazing-feature
   ```
3. **Make changes with tests**
4. **Follow code style**
   ```
   npm run lint
   npm run format
   ```
5. **Commit changes**
   ```
   git commit -m 'feat: add amazing feature'
   ```
6. **Push and create PR**
---