import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Award, Clock, ArrowUpRight, BookOpen, CheckCircle, Circle, Play, ChevronDown, ChevronRight, Layers, Box } from 'lucide-react';

const RoadmapTracker = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'User', careerGoal: '', roadmap: [], streak: 0 });
    const [expandedMap, setExpandedMap] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/roadmap');
                const { careerGoal, roadmap, name, streak } = res.data;

                if (!careerGoal || !roadmap || roadmap.length === 0) {
                    navigate('/onboarding');
                    return;
                }

                setUser({ name: name || 'User', careerGoal, roadmap, streak: streak || 0 });
                setExpandedMap({ "phase-0": true });
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const toggleExpand = (id) => {
        setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleToggleStatus = async (phaseIdx, moduleIdx, topicIdx, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        const updatedRoadmap = JSON.parse(JSON.stringify(user.roadmap));
        if (updatedRoadmap[phaseIdx]?.modules[moduleIdx]?.topics[topicIdx]) {
            updatedRoadmap[phaseIdx].modules[moduleIdx].topics[topicIdx].status = newStatus;
        }
        setUser({ ...user, roadmap: updatedRoadmap });

        try {
            await api.put('/roadmap/update-status', {
                phaseIndex: phaseIdx,
                moduleIndex: moduleIdx,
                topicIndex: topicIdx,
                status: newStatus
            });
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleTopicClick = (topic, phaseIdx, moduleIdx, topicIdx) => {
        navigate('/learning', {
            state: { topic, phaseIdx, moduleIdx, topicIdx }
        });
    };

    const getCompletedCount = () => {
        if (!user.roadmap) return 0;
        let count = 0;
        user.roadmap.forEach(phase =>
            phase.modules.forEach(module =>
                module.topics.forEach(topic => {
                    if (topic.status === 'completed') count++;
                })
            )
        );
        return count;
    };

    const getTotalCount = () => {
        if (!user.roadmap) return 0;
        let count = 0;
        user.roadmap.forEach(phase =>
            phase.modules.forEach(module =>
                count += module.topics.length
            )
        );
        return count || 1;
    };

    const completedCount = getCompletedCount();
    const totalCount = getTotalCount();
    const progressPercentage = Math.round((completedCount / totalCount) * 100);

    return (
        <div className="w-full space-y-8">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-8 shadow-2xl text-white">
                <div className="relative z-10 md:flex md:items-center md:justify-between">
                    <div>
                        <h2 className="text-4xl font-extrabold font-display tracking-tight mb-2">
                            Welcome back, {user.name} 👋
                        </h2>
                        <p className="text-primary-100 text-lg">
                            Tracking your path to becoming a <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">{user.careerGoal}</span>
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 flex space-x-3">
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                        >
                            Regenerate
                        </button>
                    </div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center space-x-4">
                        <div className="p-3.5 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            <Layers className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{progressPercentage}%</p>
                        </div>
                    </div>
                    {/* Tiny Progress Bar */}
                    <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center space-x-4">
                        <div className="p-3.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mastered</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{completedCount}<span className="text-lg text-gray-400 font-normal">/{totalCount}</span></p>
                        </div>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center space-x-4">
                        <div className="p-3.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Day Streak</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{user.streak}🔥</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-purple-600 font-medium">
                        Consistency is key! Keep it up.
                    </div>
                </div>
            </div>

            {/* Roadmap Accordion */}
            <div className="space-y-4">
                {user.roadmap && user.roadmap.map((phase, phaseIdx) => (
                    <div key={phaseIdx} className="group bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                        <button
                            onClick={() => toggleExpand(`phase-${phaseIdx}`)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none bg-transparent"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${expandedMap[`phase-${phaseIdx}`]
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {phaseIdx + 1}
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold transition-colors ${expandedMap[`phase-${phaseIdx}`] ? 'text-primary-600' : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {phase.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium">{phase.modules.length} Modules</p>
                                </div>
                            </div>
                            <div className={`p-2 rounded-full transition-all duration-300 ${expandedMap[`phase-${phaseIdx}`] ? 'bg-primary-50 dark:bg-primary-900/10 rotate-180' : ''
                                }`}>
                                <ChevronDown className={`w-5 h-5 ${expandedMap[`phase-${phaseIdx}`] ? 'text-primary-600' : 'text-gray-400'}`} />
                            </div>
                        </button>

                        {expandedMap[`phase-${phaseIdx}`] && (
                            <div className="bg-gray-50/50 dark:bg-dark-bg/30 border-t border-gray-100 dark:border-gray-800 p-6 animate-fadeIn">
                                <div className="space-y-6">
                                    {phase.modules.map((module, moduleIdx) => (
                                        <div key={moduleIdx} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                                                <Box className="w-4 h-4 mr-2" />
                                                {module.title}
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {module.topics.map((topic, topicIdx) => (
                                                    <div
                                                        key={topicIdx}
                                                        onClick={() => handleTopicClick(topic, phaseIdx, moduleIdx, topicIdx)}
                                                        className={`relative p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 duration-200 ${topic.status === 'completed'
                                                            ? 'border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10'
                                                            : 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-lg shadow-sm'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1 pr-4">
                                                                <h5 className={`font-bold text-base leading-snug mb-2 ${topic.status === 'completed' ? 'text-gray-400 line-through decoration-green-500/50' : 'text-gray-900 dark:text-white'
                                                                    }`}>
                                                                    {topic.title}
                                                                </h5>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${topic.difficulty === 'Beginner' ? 'bg-blue-100 text-blue-700' :
                                                                            topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                                                'bg-red-100 text-red-700'
                                                                        }`}>
                                                                        {topic.difficulty}
                                                                    </span>
                                                                    {topic.status === 'completed' && (
                                                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center">
                                                                            <CheckCircle className="w-3 h-3 mr-1" /> Completed
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(phaseIdx, moduleIdx, topicIdx, topic.status); }}
                                                                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all ${topic.status === 'completed'
                                                                    ? 'text-white bg-green-500 shadow-md shadow-green-500/30'
                                                                    : 'text-gray-300 hover:text-green-500 bg-gray-100 dark:bg-gray-800 hover:bg-green-100'
                                                                    }`}
                                                            >
                                                                <CheckCircle className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapTracker;
