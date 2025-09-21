'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import Header from "@/components/Header";
import QuizModal from '@/components/QuizModal';
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    // Hide header on home page, login and signup pages
    setIsHomePage(pathname === '/' || pathname === '/login' || pathname === '/signup');
  }, [pathname]);
  
  const handleQuizComplete = (result: { score: number; totalQuestions: number; identifiedSkills: string[] }) => {
    // You can handle the quiz completion here if needed
    console.log('Quiz completed with score:', result.score, '/', result.totalQuestions);
    console.log('Identified skills:', result.identifiedSkills);
    setIsQuizOpen(false);
  };
  
  const handleOpenQuiz = () => {
    setIsQuizOpen(true);
  };

  return (
    <SessionProvider>
      {!isHomePage && (
        <Header 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onOpenQuiz={handleOpenQuiz}
          onOpenChat={() => setIsChatOpen(true)}
        />
      )}
      {children}
      
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)}
        onQuizComplete={handleQuizComplete}
      />
      
      {/* Add modals here */}
      {isQuizOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Quiz Modal</h3>
            <p>Quiz content will appear here.</p>
            <button 
              onClick={() => setIsQuizOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">AI Assistant</h3>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <p className="text-gray-600">How can I help you today?</p>
          </div>
          <div className="p-3 border-t">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      )}
    </SessionProvider>
  );
}
