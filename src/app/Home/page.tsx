'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiAward, FiBarChart2, FiCode, FiPlay, FiSearch, FiTarget, FiZap, FiCheck, FiArrowRight } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import QuizModal with no SSR
const QuizModal = dynamic(() => import('@/components/QuizModal'), {
  ssr: false,
});

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; totalQuestions: number; identifiedSkills: string[] } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // In a real app, you would send this email to your backend
      console.log('Subscribed with:', email);
    }
  };

  const features = [
    {
      icon: <FiBarChart2 className="w-6 h-6 text-blue-400" />,
      title: 'Skill Gap Analysis',
      description: 'Identify the exact skills you need to reach your career goals with our AI-powered assessment.'
    },
    {
      icon: <FiTarget className="w-6 h-6 text-purple-400" />,
      title: 'Personalized Roadmap',
      description: 'Get a customized learning path tailored to your current level and target role.'
    },
    {
      icon: <FiCode className="w-6 h-6 text-green-400" />,
      title: 'Real-world Projects',
      description: 'Build practical experience with projects that match your skill level and interests.'
    },
    {
      icon: <FiAward className="w-6 h-6 text-yellow-400" />,
      title: 'Certification Prep',
      description: 'Prepare for industry-recognized certifications with our targeted study plans.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Learners' },
    { value: '50+', label: 'Career Paths' },
    { value: '500+', label: 'Skills Mapped' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 pt-24 pb-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-medium mb-6">
              <FiZap className="mr-2" />
              AI-Powered Career Guidance
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
              Bridge Your <span className="text-blue-400">Skill Gap</span> with AI
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              Discover the exact skills you need to land your dream tech job. Our AI-powered platform analyzes your current abilities and creates a personalized learning path to success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsQuizModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition-transform transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92c-.5.5-.86.86-.86 1.83h-2v-.5c0-.83.36-1.58.93-2.15l1.24-1.26A1.5 1.5 0 0012 6a1.5 1.5 0 00-1.5 1.5H8A4 4 0 0112 4a4 4 0 012.83 6.83z"/>
                </svg>
                Start Skills Quiz
              </button>
              <Link 
                href="/demo" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
              >
                <FiPlay className="mr-2" />
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Help You Succeed</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our platform uses advanced AI to provide personalized career guidance and skill development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-slate-900/50 p-8 md:p-12 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-slate-300 mb-8">Join thousands of professionals who&apos;ve accelerated their careers with our AI-powered skill gap analysis.</p>
            
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 bg-white/5 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                  >
                    Get Started Free
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-green-500/10 p-6 rounded-xl border border-green-500/30">
                <h3 className="text-xl font-semibold text-green-400 mb-2">Check your email!</h3>
                <p className="text-slate-300">We&apos;ve sent your personalized assessment link to <span className="text-white font-medium">{email}</span></p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          if (quizResult) {
            // Handle quiz completion if needed
            console.log('Quiz completed:', quizResult);
          }
        }}
        onQuizComplete={(result) => {
          setQuizResult(result);
          // You can add additional handling here, like showing a success message
          // or redirecting to a results page
        }}
      />
    </div>
  );
}
