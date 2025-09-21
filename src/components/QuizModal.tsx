'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizState, ROLE_META } from '@/types/quiz';

// Define QuizQuestion locally to avoid import conflict
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  skill?: string;
  explanation?: string;
}

interface QuizQuestionResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
  skill?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  skill?: string;
  explanation?: string;
}

type QuizResult = {
  score: number;
  totalQuestions: number;
  identifiedSkills: string[];
  questionResults: QuizQuestionResult[];
};

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizComplete: (result: QuizResult) => void;
}

export default function QuizModal({ isOpen, onClose, onQuizComplete }: QuizModalProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: [],
    questions: [],
    isQuizStarted: false,
    isQuizCompleted: false,
    isLoading: false,
    error: null
  });

  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [isAnswering, setIsAnswering] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState<number>(-1); // Initialize with -1 to detect first render
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const fetchQuizQuestions = useCallback(async (role: string) => {
    const meta = ROLE_META[role] || { experience: '', topics: [] };

    setQuizState((prev: QuizState) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          experience: meta.experience,
          technologies: meta.topics,
          count: 20
        })
      });

      if (!response.ok) throw new Error('API error from server');
      const data = await response.json();

      if (!Array.isArray(data) || !data.length) throw new Error('Received an empty or invalid quiz.');

      setQuizState((prev: QuizState) => ({
        ...prev,
        questions: data,
        selectedAnswers: Array(data.length).fill(null),
        isQuizStarted: true,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setQuizState((prev: QuizState) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load the quiz. Please try again.'
      }));
    }
  }, []);

  const startQuiz = useCallback(() => {
    console.log('Starting quiz...');
    
    setQuizState((prev: QuizState) => ({ ...prev, isLoading: true, error: null }));
    fetchQuizQuestions(selectedRole);
  }, [selectedRole, fetchQuizQuestions]);

  const submitQuiz = useCallback((answers: (number | null)[]) => {
    console.log('Starting quiz submission...');
    
    let calculatedScore = 0;
    const identifiedSkills: string[] = [];
    const questionResults: QuizQuestionResult[] = [];

    console.log('Submitting quiz with answers:', answers);
    console.log('Questions:', quizState.questions);

    quizState.questions.forEach((question: QuizQuestion, index: number) => {
      const answer = answers[index];
      const isCorrect = answer === question.correctAnswerIndex;
      
      if (isCorrect) {
        calculatedScore++;
        if (question.skill) {
          identifiedSkills.push(question.skill);
        }
      }
      
      const userAnswer = answer !== null && answer !== undefined 
        ? question.options[answer] 
        : 'No answer provided';
      
      questionResults.push({
        question: question.question,
        userAnswer,
        correctAnswer: question.options[question.correctAnswerIndex],
        isCorrect,
        ...(question.explanation && { explanation: question.explanation }),
        ...(question.skill && { skill: question.skill })
      });
    });

    console.log('Calculated score:', calculatedScore);
    console.log('Question results:', questionResults);

    const quizResult: QuizResult = {
      score: calculatedScore,
      totalQuestions: quizState.questions.length,
      identifiedSkills,
      questionResults
    };
    
    // Update the score state
    console.log('Setting score to:', calculatedScore);
    setScore(calculatedScore);
    
    // Show the score display
    console.log('Showing score display');
    setShowScore(true);
    
    // Update the quiz state first
    setQuizState(prev => {
      console.log('Updating quiz state to completed');
      return {
        ...prev,
        isQuizCompleted: true,
        isQuizStarted: false,
        currentQuestionIndex: 0
      };
    });
    
    // Then call the onQuizComplete callback
    console.log('Calling onQuizComplete with:', quizResult);
    onQuizComplete(quizResult);
    
  }, [onQuizComplete, quizState.questions]);

  const goToNextQuestion = useCallback(() => {
    console.log('Going to next question. Current index:', quizState.currentQuestionIndex);
    
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      console.log('Moving to next question');
      setQuizState((prev: QuizState) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      console.log('Last question reached, submitting quiz...');
      submitQuiz(quizState.selectedAnswers);
    }
  }, [quizState.currentQuestionIndex, quizState.questions.length, quizState.selectedAnswers, submitQuiz]);

  const goToPreviousQuestion = useCallback(() => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev: QuizState) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  }, [quizState.currentQuestionIndex]);

  const selectAnswer = useCallback((answerIndex: number) => {
    if (isAnswering) return;
    
    setQuizState((prev: QuizState) => {
      const updatedAnswers = [...prev.selectedAnswers];
      updatedAnswers[prev.currentQuestionIndex] = answerIndex;
      
      return {
        ...prev,
        selectedAnswers: updatedAnswers
      };
    });
  }, [isAnswering]);

  const resetQuiz = useCallback(() => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswers: [],
      questions: [],
      isQuizStarted: false,
      isQuizCompleted: false,
      isLoading: false,
      error: null
    });
    setShowScore(false);
    setScore(-1);
    setTimeLeft(30);
    setIsTimerActive(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetQuiz();
    }
  }, [isOpen, resetQuiz]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isTimerActive && timeLeft === 0) {
      // Auto move to next question when time's up
      if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        goToNextQuestion();
      } else {
        submitQuiz(quizState.selectedAnswers);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isTimerActive, quizState.currentQuestionIndex, quizState.questions.length, quizState.selectedAnswers, goToNextQuestion, submitQuiz]);

  // Reset and start timer when question changes
  useEffect(() => {
    if (quizState.isQuizStarted && !showScore) {
      setTimeLeft(30);
      setIsTimerActive(true);
    }
    return () => {
      setIsTimerActive(false);
    };
  }, [quizState.currentQuestionIndex, quizState.isQuizStarted, showScore]);

  if (!isOpen) return null;

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progressPercentage = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-slate-950/70">
      <div className="relative bg-slate-900 w-full max-w-2xl rounded-2xl p-8 shadow-xl border border-white/10 animate-fadeUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-blue-300">Skills Assessment Quiz</h2>

        {!quizState.isQuizStarted && !quizState.isLoading && (
          <div className="text-center">
            <p className="text-slate-400 mb-4">
              Choose a career field to get a personalized quiz tailored to your goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="w-full sm:w-auto text-left">
                <label htmlFor="career-field" className="block text-sm font-medium text-slate-400 mb-1">
                  Select a Field
                </label>
                <select
                  id="career-field"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200"
                >
                  {Object.keys(ROLE_META).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={startQuiz}
                className="w-full sm:w-auto mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition-transform transform hover:scale-105"
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}

        {quizState.isLoading && (
          <div className="text-center py-10">
            <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <p className="text-slate-400">Generating quiz questions for you...</p>
          </div>
        )}

        {quizState.error && (
          <div className="text-center py-10">
            <p className="text-red-400 mb-4">{quizState.error}</p>
            <button
              onClick={resetQuiz}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {quizState.isQuizStarted && !quizState.isLoading && !quizState.error && !showScore && (
          <div className="space-y-6">
            <div className="w-full bg-slate-800 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-400">
                Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-amber-400 font-medium">
                  Time Left: {timeLeft}s
                </div>
                <div className="text-sm text-blue-400">
                  Score: {score} / {quizState.questions.length}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                {currentQuestion.question}
              </h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    disabled={isAnswering}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      quizState.selectedAnswers[quizState.currentQuestionIndex] === index
                        ? 'bg-blue-500/20 border-2 border-blue-500'
                        : 'bg-white/5 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={goToPreviousQuestion}
                disabled={quizState.currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-lg font-medium ${
                  quizState.currentQuestionIndex === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={goToNextQuestion}
                disabled={quizState.selectedAnswers[quizState.currentQuestionIndex] === undefined}
                className={`px-6 py-2 rounded-lg font-medium ${
                  quizState.selectedAnswers[quizState.currentQuestionIndex] === undefined
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {quizState.currentQuestionIndex === quizState.questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        )}

        <div className="transition-all duration-500 ease-in-out">
          {showScore || quizState.isQuizCompleted ? (
            <div className="py-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed! 🎉</h3>
                <div className="text-5xl font-bold text-blue-400 mb-2">
                  {score >= 0 ? score : 0} / {quizState.questions.length || '?'}
                </div>
                <p className="text-slate-300 mb-6">
                  You scored {score >= 0 ? score : 0} out of {quizState.questions.length} questions correctly.
                </p>
                {quizState.questions.length > 0 && (
                  <>
                    <div className="w-full bg-slate-800 rounded-full h-3 mb-6">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-1000" 
                        style={{ width: `${((score >= 0 ? score : 0) / quizState.questions.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <div className="bg-green-900/30 border border-green-500/30 px-4 py-2 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{score >= 0 ? score : 0}</div>
                        <div className="text-xs text-green-300">Correct</div>
                      </div>
                      <div className="bg-red-900/30 border border-red-500/30 px-4 py-2 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">
                          {quizState.questions.length - (score >= 0 ? score : 0)}
                        </div>
                        <div className="text-xs text-red-300">Incorrect</div>
                      </div>
                      <div className="bg-blue-900/30 border border-blue-500/30 px-4 py-2 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round((((score >= 0 ? score : 0) / quizState.questions.length) * 100) || 0)}%
                        </div>
                        <div className="text-xs text-blue-300">Success Rate</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 space-y-6">
                <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                  Detailed Results
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {quizState.questions.map((question: QuizQuestion, index: number) => {
                    const selectedAnswer = quizState.selectedAnswers[index];
                    const isCorrect = selectedAnswer === question.correctAnswerIndex;
                    const userAnswer = selectedAnswer !== null && selectedAnswer !== undefined
                      ? question.options[selectedAnswer]
                      : 'No answer provided';
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg ${isCorrect ? 'bg-green-900/20' : 'bg-red-900/20'} border ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="font-medium text-white">
                            Q{index + 1}. {question.question}
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="text-slate-300">Your answer: {userAnswer}</div>
                          {!isCorrect && (
                            <div className="text-green-300">
                              Correct answer: {question.options[question.correctAnswerIndex]}
                            </div>
                          )}
                          {question.explanation && (
                            <div className="mt-2 text-slate-400 text-sm">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex-1 sm:flex-none"
                  >
                    ↻ Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-medium flex-1 sm:flex-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
