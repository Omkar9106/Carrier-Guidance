'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [animatedFeatures, setAnimatedFeatures] = useState<string[]>([]);

  useEffect(() => {
    const features = ['mission', 'team', 'vision'];
    features.forEach((feature, index) => {
      setTimeout(() => {
        setAnimatedFeatures(prev => [...prev, feature]);
      }, index * 200);
    });
  }, []);

  const FeatureCard = ({ 
    title, 
    description, 
    icon,
    featureName 
  }: { 
    title: string; 
    description: string; 
    icon: React.ReactNode;
    featureName: string;
  }) => (
    <div className={`bg-slate-800 rounded-xl p-6 border border-white/10 transition-all duration-300 ${
      animatedFeatures.includes(featureName) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="text-brand-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            About AI Career Guide
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Empowering your career journey with AI-driven insights and tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            title="Our Mission"
            description="To provide accessible, AI-powered career guidance to help individuals navigate their professional journeys."
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            }
            featureName="mission"
          />
          <FeatureCard
            title="Our Team"
            description="A passionate group of developers, designers, and career experts dedicated to your success."
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            featureName="team"
          />
          <FeatureCard
            title="Our Vision"
            description="To create a world where everyone has access to personalized career guidance and opportunities."
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            featureName="vision"
          />
        </div>

        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
