'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Chatbot from './Chatbot';
import QuizModal from './QuizModal';

interface HeaderProps {
  onOpenQuiz: () => void;
  onOpenChat: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange, onOpenQuiz, onOpenChat }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  
  const handleQuizComplete = (result: { score: number; totalQuestions: number; identifiedSkills: string[] }) => {
    // You can handle the quiz completion here if needed
    console.log('Quiz completed with score:', result.score, '/', result.totalQuestions);
    console.log('Identified skills:', result.identifiedSkills);
    setIsQuizOpen(false);
    // You might want to update the UI or state with the quiz results
  };

  return (
    <>
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image 
                src="/globe.svg" 
                alt="Logo" 
                width={24} 
                height={24} 
                className="h-6 w-6"
              />
              <span className="text-lg font-semibold">AI Career Guide</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link 
              href="/Home" 
              onClick={() => onTabChange('home')}
              className={`nav-link ${activeTab === 'home' ? 'text-white' : 'text-slate-300 hover:text-white'} transition`}
            >
              Home
            </Link>
            <Link 
              href="/news" 
              onClick={() => onTabChange('news')}
              className={`nav-link ${activeTab === 'news' ? 'text-white' : 'text-slate-300 hover:text-white'} transition`}
            >
              News
            </Link>
            <Link 
              href="/skills" 
              onClick={() => onTabChange('skills')}
              className={`nav-link ${activeTab === 'skills' ? 'text-white' : 'text-slate-300 hover:text-white'} transition`}
            >
              Skills Gap
            </Link>
            <Link 
              href="/jobs" 
              onClick={() => onTabChange('courses')}
              className={`nav-link ${activeTab === 'courses' ? 'text-white' : 'text-slate-300 hover:text-white'} transition`}
            >
              Jobs & Courses
            </Link>
            
            <Link 
              href="/progress" 
              onClick={() => onTabChange('progress')}
              className={`nav-link ${activeTab === 'progress' ? 'text-white' : 'text-slate-300 hover:text-white'} transition`}
            >
              Progress
            </Link>
            <Link 
              href="/about" 
              onClick={() => onTabChange('about')}
              className={`nav-link ${activeTab === 'about' ? 'text-white' : 'text-slate-300 hover:text-white'} transition`}
            >
              About
            </Link>
            <Link 
              href="/ats" 
              onClick={() => onTabChange('ats')}
              className={`nav-link ${activeTab === 'ats' ? 'text-white' : 'text-slate-300 hover:text-white'} transition`}
            >
              ATS
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Profile
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setIsChatOpen(true);
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6l-2 2V6h16v10z"/>
              </svg>
              AI Assistant
            </button>
            <button 
              onClick={() => setIsQuizOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/90 hover:bg-blue-500 text-white text-sm font-medium shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92c-.5.5-.86.86-.86 1.83h-2v-.5c0-.83.36-1.58.93-2.15l1.24-1.26A1.5 1.5 0 0012 6a1.5 1.5 0 00-1.5 1.5H8A4 4 0 0112 4a4 4 0 012.83 6.83z"/>
              </svg>
              Take Assessment
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5">
          <div className="px-4 py-3 flex flex-wrap gap-3 text-sm">
            <Link 
              href="/"
              onClick={() => {
                onTabChange('home');
                setIsMobileMenuOpen(false);
              }} 
              className={`px-3 py-1.5 rounded-md ${activeTab === 'home' ? 'bg-blue-500 text-white' : 'bg-white/5'}`}
            >
              Home
            </Link>
            <Link 
              href="/news"
              onClick={() => {
                onTabChange('news');
                setIsMobileMenuOpen(false);
              }} 
              className={`px-3 py-1.5 rounded-md ${activeTab === 'news' ? 'bg-blue-500 text-white' : 'bg-white/5'}`}
            >
              News
            </Link>
            <Link 
              href="/skills"
              onClick={() => {
                onTabChange('skills');
                setIsMobileMenuOpen(false);
              }} 
              className={`px-3 py-1.5 rounded-md ${activeTab === 'skills' ? 'bg-blue-500 text-white' : 'bg-white/5'}`}
            >
              Skills Gap
            </Link>
            <Link 
              href="/courses"
              onClick={() => {
                onTabChange('courses');
                setIsMobileMenuOpen(false);
              }} 
              className={`px-3 py-1.5 rounded-md ${activeTab === 'courses' ? 'bg-blue-500 text-white' : 'bg-white/5'}`}
            >
              Jobs & Courses
            </Link>
            <Link 
              href="/recommendations"
              onClick={() => {
                onTabChange('recommendations');
                setIsMobileMenuOpen(false);
              }} 
              className={`px-3 py-1.5 rounded-md ${activeTab === 'recommendations' ? 'bg-blue-500 text-white' : 'bg-white/5'}`}
            >
              Recommendations
            </Link>
            <Link 
              href="/progress"
              onClick={() => {
                onTabChange('progress');
                setIsMobileMenuOpen(false);
              }} 
              className={`px-3 py-1.5 rounded-md ${activeTab === 'progress' ? 'bg-blue-500 text-white' : 'bg-white/5'}`}
            >
              Progress
            </Link>
            <Link 
              href="/profile"
              className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
    <Chatbot 
      isOpen={isChatOpen}
      onClose={() => setIsChatOpen(false)}
    />
    <QuizModal
      isOpen={isQuizOpen}
      onClose={() => setIsQuizOpen(false)}
      onQuizComplete={handleQuizComplete}
    />
    </>
  );
}
