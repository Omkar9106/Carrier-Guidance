'use client';

interface AiRoadmapProps {
  roadmap: {
    title: string;
    steps: string[];
  };
}

export default function AiRoadmap({ roadmap }: AiRoadmapProps) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-blue-300">{roadmap.title}</h3>
      <ul className="space-y-2">
        {roadmap.steps.map((step, index) => (
          <li key={index} className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-slate-300">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
