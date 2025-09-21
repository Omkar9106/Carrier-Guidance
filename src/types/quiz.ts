export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  skill: string;
}

export interface QuizRequest {
  role: string;
  experience?: string;
  technologies?: string[];
  count?: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  identifiedSkills: string[];
  questions: QuizQuestion[];
  answers: number[];
}

export interface RoleMeta {
  experience: string;
  topics: string[];
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: number[];
  questions: QuizQuestion[];
  isQuizStarted: boolean;
  isQuizCompleted: boolean;
  isLoading: boolean;
  error: string | null;
}

export const ROLE_META: Record<string, RoleMeta> = {
  "Frontend Developer": {
    experience: "3–5 years (Mid-Level)",
    topics: ["HTML", "CSS", "JavaScript", "React.js", "Webpack", "Accessibility", "Performance Optimization"]
  },
  "Backend Developer": {
    experience: "5–7 years (Senior)",
    topics: ["Node.js", "Express", "REST APIs", "SQL/NoSQL", "Authentication", "System Design", "Caching"]
  },
  "Data Scientist": {
    experience: "0–2 years (Entry-Level)",
    topics: ["Python", "Pandas", "NumPy", "Statistics", "Machine Learning", "scikit-learn", "Data Cleaning"]
  },
  "DevOps Engineer": {
    experience: "3–5 years (Mid-Level)",
    topics: ["Docker", "Kubernetes", "CI/CD", "AWS", "Infrastructure as Code (Terraform)", "Monitoring"]
  },
  "Mobile App Developer": {
    experience: "2–4 years (Mid-Level)",
    topics: ["React Native", "Flutter", "Android SDK", "iOS Development", "State Management"]
  },
  "Full Stack Developer": {
    experience: "4–6 years (Senior)",
    topics: ["MERN Stack (MongoDB, Express, React, Node)", "REST & GraphQL", "Deployment", "Testing"]
  },
  "Machine Learning Engineer": {
    experience: "3–5 years (Mid-Level)",
    topics: ["Python", "TensorFlow", "PyTorch", "Model Evaluation", "Feature Engineering", "Data Pipelines"]
  },
  "Cloud Engineer": {
    experience: "5–8 years (Senior)",
    topics: ["AWS", "Azure", "Networking", "IAM", "Serverless Architecture", "Load Balancing", "CDN"]
  },
  "Cybersecurity Analyst": {
    experience: "1–3 years (Junior)",
    topics: ["Network Security", "OWASP Top 10", "Threat Detection", "Penetration Testing", "SIEM"]
  },
  "UI/UX Designer": {
    experience: "2–4 years (Mid-Level)",
    topics: ["Figma", "Design Systems", "HTML/CSS Basics", "User Research", "Prototyping", "Accessibility"]
  }
};
