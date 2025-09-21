'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import QuizModal from '@/components/QuizModal';
import Chatbot from '@/components/Chatbot';

export default function SkillsPage() {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    totalQuestions: number;
    identifiedSkills: string[];
  } | null>(null);

  const handleQuizComplete = (result: { score: number; totalQuestions: number; identifiedSkills: string[] }) => {
    setQuizResult(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10 animate-fadeUp">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            Skills Gap Analysis
          </h1>
          <p className="text-slate-400 text-lg">
            Identify what you know, what you need to learn, and how to get there.
          </p>
        </div>

        {quizResult && (
          <section className="mb-12 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
            <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-300 mb-4">
                Quiz Completed!
              </h2>
              <p className="text-slate-400 text-lg mb-6">
                Here is a summary of your performance and updated skills profile.
              </p>
              <div className="bg-blue-500/20 inline-block p-6 rounded-xl border border-blue-500/50 mb-6">
                <p className="text-slate-300 text-xl font-medium mb-1">Your Score</p>
                <p className="text-white text-5xl font-bold">
                  {quizResult.score} / {quizResult.totalQuestions}
                </p>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Skills Identified</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {quizResult.identifiedSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mb-12 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5">
            <h2 className="text-2xl font-bold mb-6 text-blue-300">Your Current Skills</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                Python
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                Data Structures
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                SQL
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                Machine Learning Basics
              </span>
            </div>

            <div className="bg-blue-700/20 p-6 rounded-lg text-center border border-blue-500/50 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">Ready for a Skills Assessment?</h3>
              <p className="text-slate-300 mb-4">
                Take our AI-powered quiz to get a detailed report on your strengths and identify key areas for growth. It only takes a few minutes!
              </p>
              <button 
                onClick={() => setIsQuizModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition-transform transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92c-.5.5-.86.86-.86 1.83h-2v-.5c0-.83.36-1.58.93-2.15l1.24-1.26A1.5 1.5 0 0012 6a1.5 1.5 0 00-1.5 1.5H8A4 4 0 0112 4a4 4 0 012.83 6.83z"/>
                </svg>
                Start Skills Quiz
              </button>
            </div>
          </div>
        </section>

        <section className="mb-12 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
          <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5">
            <h2 className="text-2xl font-bold mb-6 text-blue-300">Recommended Skills to Acquire</h2>
            <p className="text-slate-400 mb-4">
              Based on your career goals, here are the skills you should focus on. Taking the quiz will refine these recommendations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-2 text-white">Deep Learning Frameworks</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Skills like TensorFlow or PyTorch are crucial for building complex neural networks.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Find Courses
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </a>
              </div>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-2 text-white">Cloud Computing</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Experience with platforms like AWS, Azure, or GCP is essential for deploying AI models at scale.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Find Courses
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </a>
              </div>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-2 text-white">Natural Language Processing (NLP)</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Specialize in how machines understand, interpret, and generate human language.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Find Courses
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
          <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5">
            <h2 className="text-2xl font-bold mb-6 text-blue-300">Personalized Learning Paths</h2>
            <p className="text-slate-400 mb-8">
              Choose a path and let&apos;s get started on your journey. Remember, every expert was once a beginner. The path to mastery is built one step at a time!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="relative group bg-white/5 p-8 rounded-2xl border border-white/10 overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2 text-white">Path: Full Stack Developer</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Master both front-end and back-end development to build complete web applications.
                  </p>
                  <p className="text-blue-300 font-medium italic">
                    &quot;The only way to do great work is to love what you do.&quot; - Steve Jobs
                  </p>
                </div>
              </div>
              <div className="relative group bg-white/5 p-8 rounded-2xl border border-white/10 overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2 text-white">Path: Data Scientist</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Learn to collect, analyze, and interpret large datasets to extract valuable insights.
                  </p>
                  <p className="text-blue-300 font-medium italic">
                    &quot;Data is the new oil.&quot; - Clive Humby
                  </p>
                </div>
              </div>
              <div className="relative group bg-white/5 p-8 rounded-2xl border border-white/10 overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2 text-white">Path: Machine Learning Engineer</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Build and deploy models that learn from data and improve over time.
                  </p>
                  <p className="text-blue-300 font-medium italic">
                    &quot;The future belongs to those who learn more skills and combine them in creative ways.&quot; - Robert Greene
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} AI Career Guide. All rights reserved.
        </div>
      </footer>

      <QuizModal 
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onQuizComplete={handleQuizComplete}
      />

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
