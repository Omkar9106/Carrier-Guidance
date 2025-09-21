'use client';

import { useState } from 'react';

interface SkillsManagerProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
}

export default function SkillsManager({ skills, onAddSkill }: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      onAddSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-blue-300">Your Skills</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill, index) => (
          <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill"
          className="flex-grow px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddSkill}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
