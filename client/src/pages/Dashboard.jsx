import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Award, Clock, ArrowUpRight, BookOpen, CheckCircle, Circle, Play } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'User', careerGoal: '', roadmap: [], streak: 0 });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await api.get('/roadmap');
                const { careerGoal, roadmap, name, streak } = res.data;

                if (!careerGoal || !roadmap || roadmap.length === 0) {
                    navigate('/onboarding');
                    return;
                }

                setUser({ name: name || 'User', careerGoal, roadmap, streak: streak || 0 });
            } catch (error) {
                console.error("Error fetching user data", error);
                navigate('/onboarding');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleToggleStatus = async (index, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

        // Optimistic Update
        const updatedRoadmap = [...user.roadmap];
        updatedRoadmap[index].status = newStatus;
        setUser({ ...user, roadmap: updatedRoadmap });

        try {
            await api.put('/roadmap/update-status', { index, status: newStatus });
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on failure
            updatedRoadmap[index].status = currentStatus;
            setUser({ ...user, roadmap: updatedRoadmap });
        }
    };

    const [selectedStep, setSelectedStep] = useState(null);

    const handleStepClick = (step) => {
        setSelectedStep(step);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 flex flex-col">
            <Navbar />

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex-grow w-full pt-24">
                {/* Header Section */}
                <div className="md:flex md:items-center md:justify-between mb-8 animate-fadeIn">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-3xl font-extrabold leading-7 text-gray-900 dark:text-white font-display">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Goal: <span className="font-semibold text-primary-600 dark:text-primary-400">{user.careerGoal || 'Loading...'}</span>
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                        <button
                            onClick={() => navigate('/onboarding')}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                        >
                            Update Roadmap
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hover:-translate-y-1 transition-all"
                        >
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            Start Mock Interview
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                    <div className="bg-white dark:bg-dark-card overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 rounded-xl p-3">
                                    <Award className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Steps Completed
                                        </dt>
                                        <dd>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {user.roadmap ? user.roadmap.filter(r => r.status === 'completed').length : 0}
                                                <span className="text-sm text-gray-400 font-normal ml-1">/ {user.roadmap?.length || 0}</span>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/50 rounded-xl p-3">
                                    <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Completion Rate
                                        </dt>
                                        <dd>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {user.roadmap && user.roadmap.length > 0
                                                    ? Math.round((user.roadmap.filter(r => r.status === 'completed').length / user.roadmap.length) * 100)
                                                    : 0}%
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/50 rounded-xl p-3">
                                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Learning Streak
                                        </dt>
                                        <dd>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.streak || 0} Days</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Roadmap Section (2/3 width) */}
                    <div className="lg:col-span-2">
                        <div className="glass shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 dark:bg-dark-card/50">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white">
                                    Your Learning Roadmap
                                </h3>
                                <div className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 p-1 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center space-x-1">
                                    <BookOpen className="w-3 h-3" />
                                    <span>{user.roadmap ? user.roadmap.filter(r => r.status === 'completed').length : 0} Done</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {user.roadmap && user.roadmap.map((step, stepIdx) => (
                                            <li key={step.title}>
                                                <div className="relative pb-8">
                                                    {stepIdx !== user.roadmap.length - 1 ? (
                                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                                                    ) : null}
                                                    <div className="relative flex space-x-3 items-start group">
                                                        <div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(stepIdx, step.status); }}
                                                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-dark-card cursor-pointer transition-colors duration-200 hover:scale-110 ${step.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                                                                    step.status === 'in-progress' ? 'bg-primary-500 hover:bg-primary-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                                                    }`}>
                                                                {step.status === 'completed' ? <CheckCircle className="w-5 h-5 text-white" /> :
                                                                    <Circle className="w-4 h-4 text-white" />}
                                                            </button>
                                                        </div>
                                                        <div
                                                            className="min-w-0 flex-1 pt-1.5 cursor-pointer"
                                                            onClick={() => handleStepClick(step)}
                                                        >
                                                            <h4 className={`text-lg font-bold transition-all duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 ${step.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                                                {step.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
                                                            {step.details && (
                                                                <span className="inline-block mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">
                                                                    View Content
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-right text-sm">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(stepIdx, step.status); }}
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-colors ${step.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 cursor-pointer' :
                                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 cursor-pointer'
                                                                    }`}>
                                                                {step.status === 'completed' ? 'Completed' : 'Mark Complete'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Recent Activity */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-dark-card shadow-lg rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white">
                                    Recent Activity
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                                    No interviews yet. <br />
                                    <span className="text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">Start your first session!</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step Detail Modal */}
                {selectedStep && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedStep.title}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedStep(null)}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                                    {selectedStep.description}
                                </p>

                                {selectedStep.details ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-wide text-primary-600 dark:text-primary-400 mb-2">
                                                Mentor's Note 💡
                                            </h4>
                                            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl text-gray-800 dark:text-gray-200">
                                                {selectedStep.details.summary}
                                            </div>
                                        </div>

                                        {selectedStep.details.keyTerms && (
                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                                                    Key Concepts
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedStep.details.keyTerms.map(term => (
                                                        <span key={term} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                                                            {term}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedStep.details.resources && (
                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                                                    Learning Resources 📚
                                                </h4>
                                                <ul className="space-y-3">
                                                    {selectedStep.details.resources.map((res, idx) => (
                                                        <li key={idx}>
                                                            <a
                                                                href={res.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-dark-bg transition-all group"
                                                            >
                                                                <span className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                                                    {res.type === 'video' ? '▶️' : '📄'}
                                                                </span>
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                                                    {res.title}
                                                                </span>
                                                                <ArrowUpRight className="ml-auto w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                                        Content coming soon for this step...
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                    <button
                                        onClick={() => setSelectedStep(null)}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
