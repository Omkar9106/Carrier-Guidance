'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiBarChart2, FiCheckCircle, FiCode, FiPlay, FiSearch, FiStar, FiTarget, FiZap, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';

// Mock data - replace with your actual data
const mockQuizData = [
  { id: 1, name: 'Frontend Development', score: 18, total: 20, date: '2023-09-10' },
  { id: 2, name: 'Backend Development', score: 15, total: 20, date: '2023-09-05' },
  { id: 3, name: 'Database Management', score: 20, total: 20, date: '2023-09-15' },
  { id: 4, name: 'DevOps & Cloud', score: 17, total: 20, date: '2023-09-12' },
  { id: 5, name: 'System Design', score: 20, total: 20, date: '2023-09-14' },
  { id: 6, name: 'Data Structures', score: 19, total: 20, date: '2023-09-16' },
  { id: 7, name: 'Algorithms', score: 18, total: 20, date: '2023-09-18' },
];

const badges = [
  { id: 1, name: 'Quick Learner', description: 'Complete your first quiz', icon: <FiZap className="w-6 h-6 text-yellow-400" />, earned: true },
  { id: 2, name: 'Perfect Score', description: 'Score 20/20 on any quiz', icon: <FiStar className="w-6 h-6 text-blue-400" />, earned: mockQuizData.some(q => q.score === 20) },
  { id: 3, name: 'Master of All', description: 'Complete quizzes in 5 different fields', icon: <FiAward className="w-6 h-6 text-purple-400" />, earned: mockQuizData.length >= 5 },
  { id: 4, name: 'Consistent Performer', description: 'Score above 15 in 3 quizzes', icon: <FiCheckCircle className="w-6 h-6 text-green-400" />, earned: mockQuizData.filter(q => q.score > 15).length >= 3 },
];

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Types
interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description?: string;
  timeLimit?: number;
}

interface QuizResult {
  id: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
  answers: any;
  quiz: Quiz;
  userId: string;
  quizId: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  color: string;
  iconColor: string;
  category: 'achievement' | 'milestone' | 'skill';
  dateEarned?: string;
}

// Update the ChartData interface to handle both number and string IDs
type ChartData = {
  id: number | string;
  name: string;
  score: number;
  total: number;
  date: string;
  percentage: number;
  category: string;
  [key: string]: any; // Allow additional properties
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const TABS = {
  overview: 'overview',
  achievements: 'achievements',
  stats: 'stats',
  timeline: 'timeline'
} as const;

type TabType = 'overview' | 'achievements' | 'stats' | 'timeline';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<TabType>(TABS.overview);
  const [quizData, setQuizData] = useState(mockQuizData);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate derived state
  const totalQuizzes = quizData.length;
  const perfectScores = quizData.filter(q => q.score === q.total).length;
  const averageScore = totalQuizzes > 0 
    ? (quizData.reduce((sum, quiz) => sum + (quiz.score / quiz.total) * 100, 0) / totalQuizzes).toFixed(1)
    : '0.0';
  const uniqueCategories = new Set(quizData.map(q => q.name)).size;

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Transform data for charts
  const chartData: ChartData[] = quizData.map(quiz => ({
    id: quiz.id,
    name: quiz.name,
    score: quiz.score,
    total: quiz.total,
    date: formatDate(quiz.date),
    percentage: (quiz.score / quiz.total) * 100,
    category: quiz.name,
  }));

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  const totalPossibleScore = quizData.reduce((sum, quiz) => sum + quiz.total, 0);
  const totalEarnedScore = quizData.reduce((sum, quiz) => sum + quiz.score, 0);
  
  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Correct', value: totalEarnedScore },
    { name: 'Incorrect', value: totalPossibleScore - totalEarnedScore },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div 
          className="text-center"
        >
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FiTrendingUp className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
            <div className="h-4 bg-blue-100 rounded w-48 mb-2"></div>
            <div className="h-3 bg-blue-50 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeUp">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-4">
              Your Learning Journey
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Track your progress, celebrate achievements, and unlock your potential
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500 hover:scale-105 animate-fadeUp" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors duration-300">
                  <FiBarChart2 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">{totalQuizzes}</div>
                  <div className="text-sm text-slate-400">Total Quizzes</div>
                </div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full animate-pulseGlow" style={{width: '100%'}}></div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 animate-fadeUp" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors duration-300">
                  <FiTrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">{averageScore}%</div>
                  <div className="text-sm text-slate-400">Average Score</div>
                </div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full animate-pulseGlow" style={{width: `${averageScore}%`}}></div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-green-500/30 transition-all duration-500 hover:scale-105 animate-fadeUp" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors duration-300">
                  <FiStar className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">{perfectScores}</div>
                  <div className="text-sm text-slate-400">Perfect Scores</div>
                </div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full animate-pulseGlow" style={{width: `${(perfectScores/totalQuizzes)*100}%`}}></div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 animate-fadeUp" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors duration-300">
                  <FiTarget className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{new Set(quizData.map(q => q.name)).size}</div>
                  <div className="text-sm text-slate-400">Fields Mastered</div>
                </div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full animate-pulseGlow" style={{width: `${(new Set(quizData.map(q => q.name)).size/7)*100}%`}}></div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm p-2 rounded-2xl border border-slate-700/50">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-8 py-4 font-medium rounded-xl transition-all duration-300 ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FiBarChart2 className="inline-block w-5 h-5 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-8 py-4 font-medium rounded-xl transition-all duration-300 ${
                  activeTab === 'achievements' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FiAward className="inline-block w-5 h-5 mr-2" />
                Achievements
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeUp">
              {/* Quiz Performance Grid */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <FiBarChart2 className="w-6 h-6 mr-3 text-blue-400" />
                  Quiz Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizData.map((quiz, index) => (
                    <div key={quiz.id} className="group bg-slate-800/30 p-6 rounded-xl border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 animate-fadeUp" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">{quiz.name}</h3>
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-400">{formatDate(quiz.date)}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Score</span>
                          <span className="text-lg font-bold text-white">{quiz.score}/{quiz.total}</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              quiz.score === quiz.total 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-400 animate-pulseGlow' 
                                : quiz.score >= quiz.total * 0.8 
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
                                  : 'bg-gradient-to-r from-yellow-500 to-orange-400'
                            }`}
                            style={{width: `${(quiz.score / quiz.total) * 100}%`}}
                          ></div>
                        </div>
                        <div className="mt-2 text-right">
                          <span className={`text-sm font-medium ${
                            quiz.score === quiz.total 
                              ? 'text-green-400' 
                              : quiz.score >= quiz.total * 0.8 
                                ? 'text-blue-400' 
                                : 'text-yellow-400'
                          }`}>
                            {((quiz.score / quiz.total) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      {quiz.score === quiz.total && (
                        <div className="flex items-center justify-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                          <FiStar className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-sm text-green-400 font-medium">Perfect Score!</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <FiClock className="w-6 h-6 mr-3 text-purple-400" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {quizData.slice(0, 5).map((quiz, index) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-purple-500/30 transition-all duration-300 animate-fadeUp" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          quiz.score === quiz.total 
                            ? 'bg-green-500/10 text-green-400' 
                            : quiz.score >= quiz.total * 0.8 
                              ? 'bg-blue-500/10 text-blue-400' 
                              : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          <FiCode className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{quiz.name}</h3>
                          <p className="text-sm text-slate-400">Completed on {formatDate(quiz.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{quiz.score}/{quiz.total}</div>
                        <div className={`text-sm ${
                          quiz.score === quiz.total 
                            ? 'text-green-400' 
                            : quiz.score >= quiz.total * 0.8 
                              ? 'text-blue-400' 
                              : 'text-yellow-400'
                        }`}>
                          {((quiz.score / quiz.total) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-8 animate-fadeUp">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {badges.map((badge, index) => (
                  <div
                    key={badge.id}
                    className={`group p-6 rounded-2xl border transition-all duration-500 hover:scale-105 animate-fadeUp ${
                      badge.earned
                        ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-green-500/30 shadow-lg shadow-green-500/10'
                        : 'bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border-slate-700/50'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${
                        badge.earned 
                          ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20 animate-pulseGlow' 
                          : 'bg-slate-700/50 text-slate-500'
                      }`}>
                        {badge.icon}
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg mb-2 ${
                          badge.earned ? 'text-white' : 'text-slate-500'
                        }`}>
                          {badge.name}
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">{badge.description}</p>
                        <div className="flex justify-center">
                          <span className={`text-xs px-4 py-2 rounded-full font-medium ${
                            badge.earned
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-slate-700/50 text-slate-500 border border-slate-600/50'
                          }`}>
                            {badge.earned ? '✓ Earned' : '🔒 Locked'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Perfect Score Celebration */}
              {perfectScores > 0 && (
                <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/20 animate-fadeUp">
                  <div className="flex items-center justify-center space-x-6">
                    <div className="p-6 bg-yellow-500/20 rounded-full text-yellow-400 animate-floaty">
                      <FiAward className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-yellow-400 mb-2">Perfect Score Champion!</h3>
                      <p className="text-yellow-300 text-lg">
                        🎉 You've achieved perfect scores in {perfectScores} {perfectScores === 1 ? 'quiz' : 'quizzes'}! 
                      </p>
                      <p className="text-yellow-400 mt-2 font-medium">Keep up the exceptional work!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Insights */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <FiTrendingUp className="w-6 h-6 mr-3 text-cyan-400" />
                  Progress Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{Math.round(parseFloat(averageScore))}%</div>
                    <div className="text-slate-400">Overall Performance</div>
                    <div className="mt-2 text-sm text-slate-500">
                      {parseFloat(averageScore) >= 90 ? 'Excellent!' : parseFloat(averageScore) >= 80 ? 'Great job!' : 'Keep improving!'}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="text-3xl font-bold text-green-400 mb-2">{Math.round((perfectScores/totalQuizzes)*100)}%</div>
                    <div className="text-slate-400">Perfect Score Rate</div>
                    <div className="mt-2 text-sm text-slate-500">
                      {perfectScores/totalQuizzes >= 0.5 ? 'Outstanding!' : perfectScores > 0 ? 'Good progress!' : 'Aim higher!'}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{badges.filter(b => b.earned).length}/{badges.length}</div>
                    <div className="text-slate-400">Badges Earned</div>
                    <div className="mt-2 text-sm text-slate-500">
                      {badges.filter(b => b.earned).length === badges.length ? 'All unlocked!' : 'Keep going!'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
