'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import QuizModal from '@/components/QuizModal';
import Chatbot from '@/components/Chatbot';

// Define the structure of a news article
interface Article {
    title: string;
    description: string;
    url: string;
    image: string;
    publishedAt: string;
    source: {
        name: string;
    };
}

export default function NewsPage() {
    // State variables
    const [news, setNews] = useState<Article[]>([]);
    const [currentCategory, setCurrentCategory] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State for modals
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    // List of categories and their display names
    const categories = [
        { name: 'general', label: 'Latest' },
        { name: 'world', label: 'World' },
        { name: 'technology', label: 'Technology' },
        { name: 'business', label: 'Business' },
        { name: 'health', label: 'Health' },
        { name: 'science', label: 'Science' },
        { name: 'sports', label: 'Sports' }
    ];

    // Function to fetch news articles
    useEffect(() => {
        const fetchNews = async (category: string) => {
            setIsLoading(true);
            setError(null);
            setNews([]);

            // Use the environment variable for the API key
            const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
            const API_BASE_URL = 'https://gnews.io/api/v4/';

            if (!API_KEY) {
                setError("API key is not configured. Please set NEXT_PUBLIC_GNEWS_API_KEY in your environment variables.");
                setIsErrorModalOpen(true);
                setIsLoading(false);
                return;
            }
            
            let url = `${API_BASE_URL}top-headlines?lang=en&category=${category}&token=${API_KEY}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.errors) {
                    setError(data.errors.join(', '));
                    setIsErrorModalOpen(true);
                    return;
                }

                if (!data.articles || data.articles.length === 0) {
                    setNews([]);
                } else {
                    setNews(data.articles);
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to fetch news. Please check your network connection.");
                setIsErrorModalOpen(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews(currentCategory);
    }, [currentCategory]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-10 animate-fadeUp">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">Latest News</h1>
                    <p className="text-slate-400 text-lg">Stay updated with the latest headlines in the world of tech and beyond.</p>
                </div>
                
                {/* Navigation for news categories */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            onClick={() => setCurrentCategory(cat.name)}
                            className={`font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 ${currentCategory === cat.name ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-200'}`}>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-lg">Fetching headlines...</span>
                    </div>
                )}
                
                {/* News articles container */}
                {!isLoading && news.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                        {news.map((article, index) => {
                            const imageUrl = article.image || 'https://placehold.co/600x400/1e293b/a5b4fc?text=No+Image';
                            const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            return (
                                <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="block group transform transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={article.title} className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/a5b4fc?text=No+Image'; }} />
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{article.title}</h2>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-3">{article.description || 'No description available.'}</p>
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span className="font-semibold text-blue-400">{article.source.name}</span>
                                            <span>{publishedDate}</span>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}

                {!isLoading && news.length === 0 && !error && (
                    <div className="text-center py-20 text-slate-400 animate-fadeUp">
                        <p>No articles found for &quot;{currentCategory}&quot;.</p>
                    </div>
                )}

                {/* Error message modal */}
                {isErrorModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg w-full text-center border border-red-500/50">
                            <h3 className="text-2xl font-bold text-red-500 mb-4">Error</h3>
                            <p className="text-slate-300 mb-6">{error}</p>
                            <button onClick={() => setIsErrorModalOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium shadow-md transition-colors duration-200 ease-in-out">
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-white/5 mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-500">
                    © {new Date().getFullYear()} AI Career Guide. All rights reserved.
                </div>
            </footer>

            <QuizModal 
                isOpen={isQuizModalOpen}
                onClose={() => setIsQuizModalOpen(false)}
                onQuizComplete={() => { /* Handle quiz completion if needed */ }}
            />

            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
}
