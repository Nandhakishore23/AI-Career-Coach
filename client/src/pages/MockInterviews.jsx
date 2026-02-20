import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Mic, History, Plus, TrendingUp, TrendingDown, Star, Clock, ChevronRight, Target, AlertCircle, Award } from 'lucide-react';

const MockInterviews = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInterview, setSelectedInterview] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/interview/history');
                setInterviews(res.data || []);
            } catch (err) {
                console.log('Could not fetch interview history:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-rose-400';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
        if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
        return 'bg-rose-500/10 border-rose-500/20';
    };

    const avgScore = interviews.length > 0
        ? Math.round(interviews.reduce((acc, i) => acc + (i.overall_score || 0), 0) / interviews.length)
        : 0;

    const trend = interviews.length >= 2
        ? (interviews[0]?.overall_score || 0) - (interviews[1]?.overall_score || 0)
        : 0;

    // Detailed view modal
    const renderDetailView = () => {
        if (!selectedInterview) return null;
        const iv = selectedInterview;
        return (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedInterview(null)}>
                <div className="bg-[#111] rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
                    onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">{iv.role}</h2>
                            <p className="text-sm text-gray-500">{iv.topic} • {new Date(iv.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className={`text-3xl font-bold ${getScoreColor(iv.overall_score)}`}>
                            {iv.overall_score}/100
                        </div>
                    </div>

                    {/* Summary */}
                    {iv.feedback_summary && (
                        <div className="bg-black/30 rounded-xl p-4 mb-4 border border-gray-800/50">
                            <h3 className="text-sm font-bold text-gray-300 mb-2">Summary</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{iv.feedback_summary}</p>
                        </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
                            <h3 className="text-sm font-bold text-emerald-400 mb-2">✅ Strengths</h3>
                            <ul className="space-y-1">
                                {(iv.strengths || []).map((s, i) => (
                                    <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                        <span className="text-emerald-400 mt-0.5">•</span> {s}
                                    </li>
                                ))}
                                {(!iv.strengths || iv.strengths.length === 0) && (
                                    <li className="text-xs text-gray-600">No strengths recorded</li>
                                )}
                            </ul>
                        </div>
                        <div className="bg-rose-500/5 rounded-xl p-4 border border-rose-500/10">
                            <h3 className="text-sm font-bold text-rose-400 mb-2">🔴 Areas to Improve</h3>
                            <ul className="space-y-1">
                                {(iv.weaknesses || []).map((w, i) => (
                                    <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                        <span className="text-rose-400 mt-0.5">•</span> {w}
                                    </li>
                                ))}
                                {(!iv.weaknesses || iv.weaknesses.length === 0) && (
                                    <li className="text-xs text-gray-600">No weaknesses recorded</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Suggestion */}
                    {iv.suggestion && (
                        <div className="bg-blue-500/5 rounded-xl p-4 mb-4 border border-blue-500/10">
                            <h3 className="text-sm font-bold text-blue-400 mb-2">💡 Suggestion</h3>
                            <p className="text-xs text-gray-400">{iv.suggestion}</p>
                        </div>
                    )}

                    {/* Q&A History */}
                    {iv.history && iv.history.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-300 mb-3">Question History</h3>
                            <div className="space-y-3">
                                {iv.history.map((qa, i) => (
                                    <div key={i} className="bg-black/30 rounded-lg p-3 border border-gray-800/50">
                                        <p className="text-xs text-gray-300 font-medium mb-1">Q{i + 1}: {qa.question}</p>
                                        <p className="text-xs text-gray-500 mb-2">{qa.answer || 'No answer recorded'}</p>
                                        <div className="flex items-center gap-3">
                                            {qa.score !== undefined && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${qa.score >= 7 ? 'bg-emerald-500/10 text-emerald-400' :
                                                        qa.score >= 5 ? 'bg-amber-500/10 text-amber-400' :
                                                            'bg-rose-500/10 text-rose-400'
                                                    }`}>{qa.score}/10</span>
                                            )}
                                            {qa.feedback && (
                                                <span className="text-[10px] text-gray-600">{qa.feedback}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={() => setSelectedInterview(null)}
                        className="mt-6 w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {renderDetailView()}

            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock Interviews</h1>
                    <p className="text-gray-500 dark:text-gray-400">Practice with AI-powered interview sessions.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/interviews/setup')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-cyan-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Interview
                </button>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <Mic className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Total Sessions</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{interviews.length}</p>
                </div>
                <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Target className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Avg Score</span>
                    </div>
                    <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore || '—'}</p>
                </div>
                <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            {trend >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Trend</span>
                    </div>
                    <p className={`text-2xl font-bold ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {interviews.length >= 2 ? `${trend >= 0 ? '+' : ''}${trend}` : '—'}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Start New Interview Card */}
                <div
                    onClick={() => navigate('/dashboard/interviews/setup')}
                    className="group p-6 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Mic className="w-28 h-28 text-cyan-500" />
                    </div>
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Mic className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Start New Interview</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Choose your role, topic, and difficulty. Our AI interviewer will ask contextual questions and provide detailed feedback.
                    </p>
                    <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
                        Begin Session <ChevronRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Tips Card */}
                <div className="p-6 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Award className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Interview Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2"><span className="text-amber-400">✦</span> Use the STAR method for behavioral questions</li>
                        <li className="flex items-start gap-2"><span className="text-amber-400">✦</span> Think aloud during technical problems</li>
                        <li className="flex items-start gap-2"><span className="text-amber-400">✦</span> Ask clarifying questions before solving</li>
                        <li className="flex items-start gap-2"><span className="text-amber-400">✦</span> Practice explaining your approach first</li>
                    </ul>
                </div>
            </div>

            {/* Interview History */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-purple-400" />
                        Interview History
                    </h3>
                    <span className="text-xs text-gray-500">{interviews.length} session{interviews.length !== 1 ? 's' : ''}</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500/20 border-t-primary-500"></div>
                    </div>
                ) : interviews.length > 0 ? (
                    <div className="space-y-3">
                        {interviews.map((iv, i) => (
                            <div
                                key={iv._id || i}
                                onClick={() => setSelectedInterview(iv)}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:bg-black/20 ${getScoreBg(iv.overall_score)}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${getScoreColor(iv.overall_score)}`}>
                                        {iv.overall_score}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">{iv.role}</p>
                                        <p className="text-xs text-gray-500">{iv.topic} • {new Date(iv.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {iv.strengths && iv.strengths.length > 0 && (
                                        <span className="text-[10px] text-gray-600 hidden md:block">{iv.strengths.length} strength{iv.strengths.length > 1 ? 's' : ''}</span>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <Mic className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm mb-1">No interviews yet</p>
                        <p className="text-gray-600 text-xs mb-4">Complete your first session to see analytics and history here.</p>
                        <button
                            onClick={() => navigate('/dashboard/interviews/setup')}
                            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                            Start your first interview →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MockInterviews;
