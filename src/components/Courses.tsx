'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  author: string;
  image: string;
}

const Courses: React.FC = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const carouselRef = useRef<HTMLDivElement>(null);

    // Sample data - you can expand this
    const learningWebsites = [
        { name: 'Coursera', url: 'https://www.coursera.org', logo: '/coursera.png' },
        { name: 'edX', url: 'https://www.edx.org', logo: '/edx.png' },
        { name: 'Udemy', url: 'https://www.udemy.com', logo: '/udemy.png' },
        { name: 'Pluralsight', url: 'https://www.pluralsight.com', logo: '/pluralsight.png' },
    ];

    const courses: Course[] = [
        {
            id: 1,
            title: 'Artificial Intelligence Full Course',
            description: 'Comprehensive AI course covering fundamentals to advanced concepts.',
            level: 'Beginner',
            duration: '10 hours',
            author: 'Intellipaat',
            image: '/ai-course.jpg'
        },
        // Add more courses as needed
    ];

    const filteredCourses = courses.filter(course => 
        (filter === 'All' || course.level === filter) &&
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Auto-scrolling effect for the carousel
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        let scrollInterval: NodeJS.Timeout;
        
        const startScrolling = () => {
            scrollInterval = setInterval(() => {
                if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1) {
                    carousel.scrollLeft = 0;
                } else {
                    carousel.scrollLeft += 0.5;
                }
            }, 20);
        };

        startScrolling();
        return () => {
            if (scrollInterval) clearInterval(scrollInterval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Learning Resources</h1>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setActiveTab('courses')}
                            className={`px-4 py-2 rounded-lg ${activeTab === 'courses' ? 'bg-brand-500' : 'bg-slate-800'}`}
                        >
                            Courses
                        </button>
                        <button 
                            onClick={() => setActiveTab('jobs')}
                            className={`px-4 py-2 rounded-lg ${activeTab === 'jobs' ? 'bg-brand-500' : 'bg-slate-800'}`}
                        >
                            Jobs
                        </button>
                    </div>
                </div>

                {activeTab === 'courses' && (
                    <>
                        {/* Search and Filter */}
                        <div className="mb-8 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFilter(level)}
                                        className={`px-4 py-2 rounded-lg ${filter === level ? 'bg-brand-500' : 'bg-slate-800'}`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Learning Websites Carousel */}
                        <div className="mb-12">
                            <h2 className="text-xl font-semibold mb-4">Top Learning Platforms</h2>
                            <div 
                                ref={carouselRef}
                                className="flex gap-6 overflow-x-auto py-4 scrollbar-hide"
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                {[...learningWebsites, ...learningWebsites].map((site, index) => (
                                    <a
                                        key={`${site.name}-${index}`}
                                        href={site.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-none w-48 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center">
                                                <span className="text-xl">{site.name[0]}</span>
                                            </div>
                                            <span className="font-medium">{site.name}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <div key={course.id} className="bg-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition">
                                    <div className="h-40 bg-slate-700 relative">
                                        <span className="absolute top-2 right-2 bg-slate-900/80 text-xs px-2 py-1 rounded">
                                            {course.level}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-between items-center text-sm text-slate-400">
                                            <span>{course.author}</span>
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'jobs' && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
                        <p className="text-slate-400">Job listings will be available here soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
