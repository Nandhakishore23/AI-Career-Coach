import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Target, Code, Mic, BookOpen, Award,
    Zap, Calendar, Clock, ChevronRight, Star,
    BarChart3, Activity, Flame, Trophy, AlertTriangle, Lightbulb, TrendingDown
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [codingStats, setCodingStats] = useState(null);
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, codingRes, interviewRes] = await Promise.all([
                    api.get('/auth/profile'),
                    api.get('/coding/stats').catch(() => ({ data: { total: 0, easy: 0, medium: 0, hard: 0, recentSolves: [] } })),
                    api.get('/interview/history').catch(() => ({ data: [] }))
                ]);
                setProfile(profileRes.data);
                setCodingStats(codingRes.data);
                setInterviewHistory(interviewRes.data || []);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500/20 border-t-primary-500"></div>
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-primary-400 animate-pulse" />
            </div>
        </div>
    );

    if (!profile) return null;

    // Compute stats
    const safeRoadmap = profile.roadmap || [];
    const totalTopics = safeRoadmap.reduce((acc, phase) =>
        acc + (phase.modules?.reduce((mAcc, mod) => mAcc + (mod.topics?.length || 0), 0) || 0), 0);
    const completedTopics = safeRoadmap.reduce((acc, phase) =>
        acc + (phase.modules?.reduce((mAcc, mod) =>
            mAcc + (mod.topics?.filter(t => t.status === 'completed')?.length || 0), 0) || 0), 0);
    const inProgressTopics = safeRoadmap.reduce((acc, phase) =>
        acc + (phase.modules?.reduce((mAcc, mod) =>
            mAcc + (mod.topics?.filter(t => t.status === 'in-progress')?.length || 0), 0) || 0), 0);
    const completionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const streak = profile.streak || 0;
    const solvedTotal = codingStats?.total || 0;
    const skillCount = profile.skills?.length || 0;

    // Generate heatmap data (last 12 weeks)
    const generateHeatmap = () => {
        const weeks = [];
        const solvedDates = {};
        (profile.solvedProblems || []).forEach(p => {
            const d = new Date(p.solvedAt).toDateString();
            solvedDates[d] = (solvedDates[d] || 0) + 1;
        });

        for (let w = 11; w >= 0; w--) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date();
                date.setDate(date.getDate() - (w * 7 + (6 - d)));
                const dateStr = date.toDateString();
                const count = solvedDates[dateStr] || 0;
                week.push({ date: dateStr, count });
            }
            weeks.push(week);
        }
        return weeks;
    };

    const heatmapData = generateHeatmap();
    const getHeatColor = (count) => {
        if (count === 0) return 'bg-gray-800/50';
        if (count === 1) return 'bg-emerald-900/80';
        if (count === 2) return 'bg-emerald-700';
        return 'bg-emerald-500';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn p-4">

            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-2xl p-8 border border-purple-500/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                            {(profile.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Welcome back, {profile.name?.split(' ')[0] || 'User'}! 👋
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {profile.careerGoal ? `${profile.careerGoal} Track` : 'Your Career Journey'} • {profile.experienceLevel || 'Getting Started'}
                            </p>
                        </div>
                    </div>
                    {streak > 0 && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2">
                            <Flame className="w-5 h-5 text-orange-400" />
                            <span className="text-orange-300 font-bold text-sm">{streak} Day Streak!</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Roadmap Progress */}
                <div className="group bg-[#111] rounded-xl border border-gray-800 p-5 hover:border-primary-500/30 transition-all cursor-pointer"
                    onClick={() => navigate('/dashboard/roadmap')}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-blue-400" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                    <p className="text-2xl font-bold text-white">{completionRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">Roadmap Complete</p>
                    <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${completionRate}%` }}></div>
                    </div>
                </div>

                {/* 2. Problems Solved */}
                <div className="group bg-[#111] rounded-xl border border-gray-800 p-5 hover:border-emerald-500/30 transition-all cursor-pointer"
                    onClick={() => navigate('/dashboard/coding')}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Code className="w-5 h-5 text-emerald-400" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                    <p className="text-2xl font-bold text-white">{solvedTotal}</p>
                    <p className="text-xs text-gray-500 mt-1">Problems Solved</p>
                    <div className="flex gap-2 mt-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">E: {codingStats?.easy || 0}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">M: {codingStats?.medium || 0}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">H: {codingStats?.hard || 0}</span>
                    </div>
                </div>

                {/* 3. Skill Assessments */}
                <div className="group bg-[#111] rounded-xl border border-gray-800 p-5 hover:border-purple-500/30 transition-all cursor-pointer"
                    onClick={() => navigate('/dashboard/assessment')}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Award className="w-5 h-5 text-purple-400" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                    <p className="text-2xl font-bold text-white">{skillCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Skills Assessed</p>
                    {profile.skills?.slice(0, 2).map((skill, i) => (
                        <div key={i} className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] text-gray-400">{skill.name}</span>
                            <span className={`text-[10px] font-bold ${skill.badge === 'Gold' ? 'text-yellow-400' : skill.badge === 'Silver' ? 'text-gray-300' : 'text-orange-400'}`}>
                                {skill.badge === 'Gold' ? '🥇' : skill.badge === 'Silver' ? '🥈' : '🥉'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* 4. Login Streak */}
                <div className="group bg-[#111] rounded-xl border border-gray-800 p-5 hover:border-orange-500/30 transition-all cursor-pointer"
                    onClick={() => navigate('/dashboard/profile')}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-orange-400" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                    <p className="text-2xl font-bold text-white">{streak} 🔥</p>
                    <p className="text-xs text-gray-500 mt-1">Day Streak</p>
                    <p className="text-[10px] text-gray-600 mt-2">
                        {completedTopics}/{totalTopics} topics done
                    </p>
                </div>
            </div>

            {/* Main Content: Heatmap + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Heatmap */}
                <div className="lg:col-span-2 bg-[#111] rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            Coding Activity
                        </h3>
                        <span className="text-[10px] text-gray-500">Last 12 weeks</span>
                    </div>
                    <div className="flex gap-1 overflow-x-auto pb-2">
                        {heatmapData.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-1">
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        className={`w-3 h-3 rounded-sm ${getHeatColor(day.count)} transition-all hover:ring-1 hover:ring-gray-600`}
                                        title={`${day.date}: ${day.count} solve${day.count !== 1 ? 's' : ''}`}
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3 justify-end">
                        <span className="text-[10px] text-gray-600">Less</span>
                        <div className="w-3 h-3 rounded-sm bg-gray-800/50"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-900/80"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-700"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                        <span className="text-[10px] text-gray-600">More</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#111] rounded-xl border border-gray-800 p-6">
                    <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button onClick={() => navigate('/dashboard/coding')}
                            className="w-full flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:bg-emerald-500/10 transition-all group">
                            <Code className="w-5 h-5 text-emerald-400" />
                            <div className="text-left">
                                <p className="text-sm text-gray-300 font-medium group-hover:text-white">Solve a Problem</p>
                                <p className="text-[10px] text-gray-600">Practice DSA</p>
                            </div>
                        </button>
                        <button onClick={() => navigate('/dashboard/interviews')}
                            className="w-full flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl hover:bg-blue-500/10 transition-all group">
                            <Mic className="w-5 h-5 text-blue-400" />
                            <div className="text-left">
                                <p className="text-sm text-gray-300 font-medium group-hover:text-white">Mock Interview</p>
                                <p className="text-[10px] text-gray-600">AI-powered practice</p>
                            </div>
                        </button>
                        <button onClick={() => navigate('/dashboard/assessment')}
                            className="w-full flex items-center gap-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl hover:bg-purple-500/10 transition-all group">
                            <Award className="w-5 h-5 text-purple-400" />
                            <div className="text-left">
                                <p className="text-sm text-gray-300 font-medium group-hover:text-white">Skill Assessment</p>
                                <p className="text-[10px] text-gray-600">Test your knowledge</p>
                            </div>
                        </button>
                        <button onClick={() => navigate('/dashboard/roadmap')}
                            className="w-full flex items-center gap-3 p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl hover:bg-orange-500/10 transition-all group">
                            <BookOpen className="w-5 h-5 text-orange-400" />
                            <div className="text-left">
                                <p className="text-sm text-gray-300 font-medium group-hover:text-white">Continue Learning</p>
                                <p className="text-[10px] text-gray-600">{inProgressTopics} topics in progress</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Solves + Roadmap Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Solves */}
                <div className="bg-[#111] rounded-xl border border-gray-800 p-6">
                    <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        Recently Solved
                    </h3>
                    {codingStats?.recentSolves?.length > 0 ? (
                        <div className="space-y-2">
                            {codingStats.recentSolves.map((solve, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                            <Code className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-300 font-medium">{solve.title}</p>
                                            <p className="text-[10px] text-gray-600">{new Date(solve.solvedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${solve.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' :
                                        solve.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                                        }`}>{solve.difficulty}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Code className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">No problems solved yet</p>
                            <button onClick={() => navigate('/dashboard/coding')}
                                className="mt-3 text-xs text-primary-400 hover:text-primary-300 font-medium">
                                Start solving →
                            </button>
                        </div>
                    )}
                </div>

                {/* Roadmap Overview */}
                <div className="bg-[#111] rounded-xl border border-gray-800 p-6">
                    <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        Learning Progress
                    </h3>
                    {safeRoadmap.length > 0 ? (
                        <div className="space-y-3">
                            {safeRoadmap.slice(0, 4).map((phase, i) => {
                                const pTopics = phase.modules?.reduce((a, m) => a + (m.topics?.length || 0), 0) || 0;
                                const pCompleted = phase.modules?.reduce((a, m) =>
                                    a + (m.topics?.filter(t => t.status === 'completed')?.length || 0), 0) || 0;
                                const pRate = pTopics > 0 ? Math.round((pCompleted / pTopics) * 100) : 0;

                                return (
                                    <div key={i} className="p-3 bg-black/30 rounded-lg border border-gray-800/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs text-gray-300 font-medium truncate">{phase.title}</p>
                                            <span className="text-[10px] text-gray-500">{pRate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                                            <div className="bg-gradient-to-r from-primary-500 to-purple-500 h-1.5 rounded-full transition-all duration-700"
                                                style={{ width: `${pRate}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {safeRoadmap.length > 4 && (
                                <button onClick={() => navigate('/dashboard/roadmap')}
                                    className="text-xs text-primary-400 hover:text-primary-300 font-medium w-full text-center py-2">
                                    View all {safeRoadmap.length} phases →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <BookOpen className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">No roadmap generated yet</p>
                            <button onClick={() => navigate('/dashboard/roadmap')}
                                className="mt-3 text-xs text-primary-400 hover:text-primary-300 font-medium">
                                Generate roadmap →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Interview Analytics & Smart Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Interview Stats */}
                <div className="bg-[#111] rounded-xl border border-gray-800 p-5">
                    <h2 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <Mic className="w-4 h-4 text-blue-400" /> Interview Analytics
                    </h2>
                    {interviewHistory.length > 0 ? (
                        <>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-black/30 rounded-lg p-3 text-center border border-gray-800/50">
                                    <p className="text-2xl font-bold text-blue-400">{interviewHistory.length}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Sessions</p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-3 text-center border border-gray-800/50">
                                    <p className="text-2xl font-bold text-emerald-400">
                                        {Math.round(interviewHistory.reduce((a, i) => a + (i.overall_score || 0), 0) / interviewHistory.length)}%
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-1">Avg Score</p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-3 text-center border border-gray-800/50">
                                    {(() => {
                                        const recent = interviewHistory.slice(0, 3);
                                        const older = interviewHistory.slice(3, 6);
                                        const recentAvg = recent.length > 0 ? recent.reduce((a, i) => a + (i.overall_score || 0), 0) / recent.length : 0;
                                        const olderAvg = older.length > 0 ? older.reduce((a, i) => a + (i.overall_score || 0), 0) / older.length : recentAvg;
                                        const improving = recentAvg >= olderAvg;
                                        return (
                                            <>
                                                {improving ? <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto" /> : <TrendingDown className="w-5 h-5 text-rose-400 mx-auto" />}
                                                <p className={`text-xs font-bold mt-1 ${improving ? 'text-emerald-400' : 'text-rose-400'}`}>{improving ? 'Improving' : 'Declining'}</p>
                                            </>
                                        );
                                    })()}
                                    <p className="text-[10px] text-gray-500 mt-1">Trend</p>
                                </div>
                            </div>
                            {/* Recent Interviews */}
                            <div className="space-y-2">
                                {interviewHistory.slice(0, 3).map((interview, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-black/20 rounded-lg border border-gray-800/50">
                                        <div className="flex items-center gap-2">
                                            <Mic className="w-3.5 h-3.5 text-blue-400" />
                                            <div>
                                                <p className="text-xs text-gray-300 font-medium">{interview.role || 'Interview'}</p>
                                                <p className="text-[10px] text-gray-600">{new Date(interview.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-bold ${(interview.overall_score || 0) >= 70 ? 'text-emerald-400' : (interview.overall_score || 0) >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                            {interview.overall_score || 0}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <Mic className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">No interviews yet</p>
                            <button onClick={() => navigate('/dashboard/interviews')}
                                className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium">Start your first →</button>
                        </div>
                    )}
                </div>

                {/* Smart Recommendations */}
                <div className="bg-[#111] rounded-xl border border-gray-800 p-5">
                    <h2 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" /> Smart Recommendations
                    </h2>
                    {(() => {
                        const recommendations = [];

                        // Analyze weak skills (below 60%)
                        const skills = profile?.skills || [];
                        const weakSkills = skills.filter(s => s.score < 60);
                        if (weakSkills.length > 0) {
                            weakSkills.slice(0, 2).forEach(s => {
                                recommendations.push({
                                    type: 'skill',
                                    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
                                    title: `Improve ${s.name}`,
                                    desc: `Your score is ${Math.round(s.score)}%. Retake the assessment to improve.`,
                                    action: () => navigate('/dashboard/assessment'),
                                    color: 'amber'
                                });
                            });
                        }

                        // Analyze interview weaknesses
                        const allWeaknesses = interviewHistory.flatMap(i => i.weaknesses || []);
                        const weaknessCounts = {};
                        allWeaknesses.forEach(w => {
                            const key = w.toLowerCase().trim();
                            weaknessCounts[key] = (weaknessCounts[key] || 0) + 1;
                        });
                        const topWeaknesses = Object.entries(weaknessCounts).sort((a, b) => b[1] - a[1]).slice(0, 2);
                        topWeaknesses.forEach(([weakness, count]) => {
                            recommendations.push({
                                type: 'interview',
                                icon: <Mic className="w-3.5 h-3.5 text-blue-400" />,
                                title: `Work on: ${weakness.slice(0, 40)}`,
                                desc: `Mentioned ${count}x across interviews. Practice more.`,
                                action: () => navigate('/dashboard/interviews'),
                                color: 'blue'
                            });
                        });

                        // Coding recommendations
                        if (codingStats && codingStats.total === 0) {
                            recommendations.push({
                                type: 'coding',
                                icon: <Code className="w-3.5 h-3.5 text-emerald-400" />,
                                title: 'Start Coding Practice',
                                desc: 'Solve your first DSA problem to track progress.',
                                action: () => navigate('/dashboard/coding'),
                                color: 'emerald'
                            });
                        } else if (codingStats && codingStats.medium === 0) {
                            recommendations.push({
                                type: 'coding',
                                icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400" />,
                                title: 'Try Medium Problems',
                                desc: 'Level up from Easy to Medium difficulty.',
                                action: () => navigate('/dashboard/coding'),
                                color: 'amber'
                            });
                        }

                        // General recommendation
                        if (recommendations.length === 0) {
                            recommendations.push({
                                type: 'general',
                                icon: <Star className="w-3.5 h-3.5 text-yellow-400" />,
                                title: 'Keep Going!',
                                desc: 'Complete more activities to get personalized insights.',
                                action: null,
                                color: 'yellow'
                            });
                        }

                        return (
                            <div className="space-y-3">
                                {recommendations.slice(0, 4).map((rec, idx) => (
                                    <div key={idx} className={`p-3 bg-${rec.color}-500/5 border border-${rec.color}-500/10 rounded-lg cursor-pointer hover:bg-${rec.color}-500/10 transition-all`}
                                        onClick={rec.action || undefined}>
                                        <div className="flex items-start gap-2">
                                            {rec.icon}
                                            <div>
                                                <p className="text-xs font-bold text-gray-300">{rec.title}</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{rec.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
