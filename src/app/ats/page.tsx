'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Import Confetti with SSR disabled to avoid window is not defined error
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function AtsPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'docx') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          try {
            // Dynamically import mammoth only when needed
            const mammoth = (await import('mammoth')).default;
            const result = await mammoth.extractRawText({ arrayBuffer });
            setResumeText(result.value);
          } catch (error) {
            console.error('Error extracting text from DOCX:', error);
            alert('Error processing the document. Please try another file.');
          }
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'txt') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      alert('Unsupported file type. Please upload a .docx or .txt file.');
    }
  };

  const calculateScore = () => {
    if (!jobDescription || !resumeText) {
      alert('Please provide both Job Description and Resume.');
      return;
    }

    const jobWords = jobDescription
      .toLowerCase()
      .match(/\b\w+\b/g)
      ?.filter(word => word.length > 3) || [];

    const resumeWords = resumeText.toLowerCase();
    const uniqueKeywords = [...new Set(jobWords)];
    let matchCount = 0;

    uniqueKeywords.forEach(word => {
      if (resumeWords.includes(word)) matchCount++;
    });

    const scorePercentage = Math.round((matchCount / Math.max(1, uniqueKeywords.length)) * 100);
    setScore(scorePercentage);

    if (scorePercentage >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  return (
    <div className="min-h-screen min-w-screen w-full flex flex-col justify-center items-center px-4 py-10 bg-slate-900 text-slate-100 animate-fadeUp">
      <div className="w-full max-w-4xl px-6 py-10 bg-slate-800 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
        {showConfetti && <Confetti numberOfPieces={180} recycle={false} />}
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          🧠 ATS Score Checker
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-slate-300">Job Description</label>
          <textarea
            className="w-full h-40 p-3 bg-slate-700 border border-white/10 rounded-lg resize-y text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-slate-300">Upload Resume (.docx or .txt)</label>
          <input
            type="file"
            accept=".docx,.txt"
            onChange={handleFileUpload}
            className="w-full p-2 text-sm bg-slate-700 text-slate-100 border border-white/10 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>

        <div className="text-center mt-8">
          <button
            onClick={calculateScore}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 transition duration-300 text-white rounded-lg text-sm font-medium shadow-md"
          >
            Check ATS Score
          </button>
        </div>

        {score !== null && (
          <div className="mt-10 p-6 bg-slate-700 rounded-xl border border-blue-500/20 shadow-inner text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Your ATS Score: <span className="text-blue-400">{score}%</span>
            </h2>
            {score >= 70 ? (
              <p className="text-green-400 font-medium">✅ Great match! You&apos;re ready to apply. 🎉</p>
            ) : (
              <p className="text-yellow-400 font-medium">⚠ Improve your resume to better match the job description.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
