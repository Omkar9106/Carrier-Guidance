'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FiUser, FiMail, FiBook, FiBriefcase, FiUpload, FiSave, FiPlus, FiX } from 'react-icons/fi';
import Image from 'next/image';

const QUIZ_DOMAINS = [
  'Frontend Development', 'Backend Development', 'Full Stack Development',
  'Mobile Development', 'Data Science', 'DevOps', 'UI/UX Design',
  'Quality Assurance', 'Project Management', 'Cybersecurity'
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: 'I am passionate about learning new technologies and improving my skills.',
    domain: '',
    experience: '',
    skills: [] as { name: string; level: string }[],
    goals: '',
    profileImage: '/default-avatar.png',
  });

  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Get current logged in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        // ✅ Fetch profile if exists
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data() as any);
        } else {
          setProfile((prev) => ({ ...prev, email: user.email || '' }));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.some((s) => s.name.toLowerCase() === newSkill.toLowerCase())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim(), level: skillLevel }],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillName: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  // ✅ Save profile to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert('You must be logged in to save profile');

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'users', userId), {
        ...profile,
        profileImage: imagePreview || profile.profileImage,
      });

      setIsEditing(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* ✅ Profile Header */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-400 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative group mb-6 md:mb-0 md:mr-8">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-gray-200">
                  <Image
                    src={imagePreview || profile.profileImage}
                    alt={profile.name || 'Profile'}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-500 text-white p-2 rounded-full cursor-pointer transition-all">
                    <FiUpload className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4 w-full">
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-blue-100 border border-blue-200 focus:ring-2 focus:ring-white focus:border-white transition"
                        placeholder="Enter your name"
                      />
                    </div>
                
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white opacity-75 cursor-not-allowed"
                        placeholder="your.email@example.com"
                      />
                      <p className="mt-1 text-xs text-blue-100">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-800">Bio</h2>
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold">{profile.name || 'Your Name'}</h1>
                    <p className="text-blue-100">{profile.email}</p>
                  </div>
                )}
              </div>

              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="mt-4 px-6 py-2 bg-white/20 rounded-full">
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* ✅ Form */}
          <form onSubmit={handleSubmit} className="p-8 bg-black">
            {isEditing ? (
              <div className="space-y-8">
                {/* Domain & Experience */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Domain & Experience</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Domain</label>
                      <select 
                        name="domain" 
                        value={profile.domain} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-blue-800 focus:ring-2 focus:ring-black focus:border-blue-500 transition"
                      >
                        <option value="" className="text-black">Select your domain</option>
                        {QUIZ_DOMAINS.map((d) => (
                          <option key={d} value={d} className="text-black">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Experience</label>
                      <select 
                        name="experience" 
                        value={profile.experience} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-blue-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="" className="text-black">Select experience</option>
                        <option value="0-1" className="text-black">0-1 years</option>
                        <option value="1-3" className="text-black">1-3 years</option>
                        <option value="3-5" className="text-black">3-5 years</option>
                        <option value="5+" className="text-black">5+ years</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Skills</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)} 
                        placeholder="Add skill"
                        className="w-full px-4 py-2 rounded-lg border border-blue-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <select 
                        value={skillLevel} 
                        onChange={(e) => setSkillLevel(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-blue-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        {SKILL_LEVELS.map((l) => (
                          <option key={l} value={l} className="text-black">{l}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 whitespace-nowrap"
                      disabled={!newSkill.trim()}
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                  <div className="mt-2">
                    {profile.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-blue-50 border border-blue-800 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        <span>{skill.name}</span>
                        <span className="text-blue-500 text-xs font-normal">({skill.level})</span>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.name)}
                            className="text-blue-300 hover:text-red-500 transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Career Goals</h2>
                  <textarea
                    name="goals"
                    value={profile.goals}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-blue-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    placeholder="What are your career goals and aspirations?"
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Display Profile Info */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">About Me</h2>
                  <p className="text-gray-600 whitespace-pre-line">{profile.bio || 'No bio provided'}</p>
                </div>

                {profile.goals && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Career Goals</h2>
                    <p className="text-gray-600 whitespace-pre-line">{profile.goals}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill.name} <span className="text-blue-500 text-xs">({skill.level})</span>
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added yet</p>
                    )}
                  </div>
                </div>

                {profile.domain && (
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800">Domain</h2>
                    <p className="text-gray-600">{profile.domain}</p>
                  </div>
                )}

                {profile.experience && (
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
                    <p className="text-gray-600">{profile.experience} years</p>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </form>
          
          {/* Sign Out Button */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5.414l6.293 6.293a1 1 0 001.414-1.414L5.414 4H17a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
