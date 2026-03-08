import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterview } from '../utils/api';
import Navbar from '../components/Navbar';
import { Bot, Youtube, Code, Briefcase, Zap, FileText, Upload } from 'lucide-react';

const InterviewSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: 'Frontend Developer',
        topic: 'React',
        difficulty: 'Intermediate',
        resume: null
    });

    const [resumeName, setResumeName] = useState("");

    const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist'];
    const topics = ['React', 'Node.js', 'System Design', 'JavaScript', 'Python', 'Databases', 'Behavioral'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert("Please upload a specific PDF file.");
                return;
            }
            setResumeName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                // Remove prefix "data:application/pdf;base64,"
                const base64String = reader.result.split(',')[1];
                setFormData({ ...formData, resume: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await startInterview(formData);
            navigate('/dashboard/interviews/session', {
                state: {
                    initialQuestion: data.question,
                    context: data.context,
                    role: formData.role,
                    topic: formData.topic
                }
            });
        } catch (error) {
            console.error("Failed to start interview", error);
            alert("Failed to start AI Interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-cyan-500/30">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12 animate-fade-in-down">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                            <Bot className="w-12 h-12 text-cyan-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                        AI Mock Interviewer
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Practice voice-based technical interviews with a ruthless (or friendly) AI agent.
                    </p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Role Selection */}
                        <div className="space-y-4">
                            <label className="text-lg font-medium text-gray-300 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-cyan-400" /> Target Role
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role })}
                                        className={`p-3 rounded-xl border transition-all duration-300 text-sm font-medium
                                            ${formData.role === role
                                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                                : 'bg-gray-700/30 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topic Selection */}
                        <div className="space-y-4">
                            <label className="text-lg font-medium text-gray-300 flex items-center gap-2">
                                <Code className="w-5 h-5 text-purple-400" /> Interview Topic
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {topics.map((topic) => (
                                    <button
                                        key={topic}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, topic })}
                                        className={`p-3 rounded-xl border transition-all duration-300 text-sm font-medium
                                            ${formData.topic === topic
                                                ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                : 'bg-gray-700/30 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Selection */}
                        <div className="space-y-4">
                            <label className="text-lg font-medium text-gray-300 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" /> Difficulty Level
                            </label>
                            <div className="flex gap-4">
                                {difficulties.map((diff) => (
                                    <button
                                        key={diff}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty: diff })}
                                        className={`flex-1 p-3 rounded-xl border transition-all duration-300 text-sm font-medium
                                            ${formData.difficulty === diff
                                                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                                : 'bg-gray-700/30 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div className="space-y-4">
                            <label className="text-lg font-medium text-gray-300 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" /> Upload Resume (Optional)
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className={`p-4 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-3
                                    ${resumeName
                                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                        : 'bg-gray-700/30 border-gray-600 text-gray-400 group-hover:bg-gray-700/50 group-hover:border-gray-500'}`}
                                >
                                    {resumeName ? (
                                        <>
                                            <FileText className="w-5 h-5" />
                                            <span className="font-semibold">{resumeName}</span>
                                            <span className="text-xs bg-green-500/20 px-2 py-1 rounded">Uploaded</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            <span>Click to upload PDF resume</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                The AI will read your resume and ask questions based on your projects and skills.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 
                                     text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed
                                     flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Connecting to AI Interviewer...
                                </>
                            ) : (
                                <>
                                    Start Interview Session
                                    <Bot className="w-6 h-6" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InterviewSetup;
