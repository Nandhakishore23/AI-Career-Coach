import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { User, Mail, Briefcase, Clock, Zap, BookOpen, Award, TrendingUp, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                if (res.data) {
                    setProfile(res.data);
                } else {
                    throw new Error('No data received');
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                const msg = error.response?.data?.message || error.message || "Unknown error";
                const status = error.response?.status ? ` (Status: ${error.response.status})` : '';
                setError(`Failed to load: ${msg}${status}`);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error || !profile) return (
        <div className="p-10 text-center">
            <p className="text-red-500 mb-4">{error || "Failed to load profile."}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
                Retry
            </button>
        </div>
    );

    // Safe Defaults
    const userName = profile.name || "User";
    const userEmail = profile.email || "No Email";
    const userRole = profile.experienceLevel || "Beginner";
    const userStyle = profile.learningStyle || "General";
    const joinDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Recently";

    // Calculate Stats Safely
    const safeRoadmap = profile.roadmap || [];
    const totalTopics = safeRoadmap.reduce((acc, phase) =>
        acc + (phase.modules?.reduce((mAcc, mod) => mAcc + (mod.topics?.length || 0), 0) || 0), 0) || 0;

    const completedTopics = safeRoadmap.reduce((acc, phase) =>
        acc + (phase.modules?.reduce((mAcc, mod) =>
            mAcc + (mod.topics?.filter(t => t.status === 'completed')?.length || 0), 0) || 0), 0) || 0;

    const completionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Find Ongoing Topics Safely
    const ongoingTopics = [];
    safeRoadmap.forEach((phase) => {
        phase.modules?.forEach((module) => {
            module.topics?.forEach((topic) => {
                if (ongoingTopics.length < 3) {
                    if (topic.status === 'in-progress' || topic.status === 'pending') {
                        ongoingTopics.push({
                            ...topic,
                            phaseTitle: phase.title || "Phase",
                            moduleTitle: module.title || "Module"
                        });
                    }
                }
            });
        });
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">

            {/* Header / Identity Card */}
            <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{userName}</h1>
                    <div className="flex flex-col md:flex-row items-center md:space-x-6 text-gray-500 dark:text-gray-400 text-sm mb-4">
                        <span className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {userEmail}</span>
                        <span className="flex items-center mt-2 md:mt-0"><Calendar className="w-4 h-4 mr-2" /> Joined {joinDate}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {userRole}
                        </span>
                        <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {userStyle} Learner
                        </span>
                    </div>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.streak || 0} 🔥</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Day Streak</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Completed</div>
                    </div>
                </div>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details */}
                <div className="space-y-8">
                    {/* Career Target */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-red-500" /> Career Target
                        </h3>
                        {profile.careerGoal ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
                                    <div className="text-gray-900 dark:text-white font-medium">{profile.careerGoal}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Dream Company</label>
                                    <div className="text-gray-900 dark:text-white font-medium">{profile.targetCompany || "Not Set"}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Commitment</label>
                                    <div className="text-gray-900 dark:text-white font-medium">{profile.weeklyHours || 0} Hours / Week</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500 mb-2">No career goal set.</p>
                                <button onClick={() => navigate('/onboarding')} className="text-primary-600 text-sm font-bold hover:underline">Set Goal</button>
                            </div>
                        )}
                    </div>

                    {/* Skill Stack */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-yellow-500" /> Verified Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.currentSkills && profile.currentSkills.length > 0 ? (
                                profile.currentSkills.map((skill, idx) => (
                                    <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-400 italic">No skills listed yet.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Progress & Activity */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Ongoing Integration */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> Ongoing & Next Up
                        </h3>

                        {ongoingTopics.length > 0 ? (
                            <div className="space-y-4">
                                {ongoingTopics.slice(0, 3).map((topic, idx) => (
                                    <div key={idx} className="flex items-center p-4 bg-gray-50 dark:bg-dark-bg/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${idx === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{topic.title}</h4>
                                            <p className="text-xs text-gray-500">{topic.phaseTitle} • {topic.moduleTitle}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${topic.status === 'in-progress'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {topic.status === 'in-progress' ? 'In Progress' : 'Up Next'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No active roadmap found.</p>
                                <button
                                    onClick={() => navigate('/onboarding')}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                                >
                                    Create Roadmap
                                </button>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Completion Status</h4>
                            <div className="relative pt-1">
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                                    <div style={{ width: `${completionRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{completedTopics} Modules Completed</span>
                                    <span>{totalTopics - completedTopics} Remaining</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
