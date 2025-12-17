import React, { useState } from 'react';
import { Terminal, Code, Trophy, Target, Play, CheckCircle } from 'lucide-react';

const CodingArena = () => {
    // Mock Data for "Coding Profile" tracking
    const [stats, setStats] = useState({
        solved: 12,
        total: 50,
        rank: 'Novice',
        xp: 1250,
        streak: 3
    });

    const [challenges, setChallenges] = useState([
        { id: 1, title: 'Reverse a String', difficulty: 'Easy', status: 'Solved', xp: 50 },
        { id: 2, title: 'FizzBuzz Impl', difficulty: 'Easy', status: 'Solved', xp: 50 },
        { id: 3, title: 'Array Deduplication', difficulty: 'Medium', status: 'Pending', xp: 100 },
        { id: 4, title: 'React Counter Hook', difficulty: 'Medium', status: 'Pending', xp: 100 },
        { id: 5, title: 'API Data Fetcher', difficulty: 'Hard', status: 'Pending', xp: 200 },
    ]);

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Coding Arena</h2>
                <p className="mt-1 text-gray-500">Track your coding practice and solve daily challenges.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-lg">
                    <div className="flex items-center space-x-3 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-bold uppercase tracking-wider opacity-75">Rank</span>
                    </div>
                    <div className="text-3xl font-bold">{stats.rank}</div>
                    <div className="text-xs text-gray-400 mt-1">Next: Intermediate (250 XP to go)</div>
                </div>

                <div className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Solved</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.solved}</div>
                    <div className="text-xs text-green-500 mt-1">Top 15% of users</div>
                </div>

                <div className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-3 mb-2">
                        <Target className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total XP</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.xp}</div>
                    <div className="text-xs text-gray-400 mt-1">Lifetime earnings</div>
                </div>

                <div className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-3 mb-2">
                        <Terminal className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Streak</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.streak} 🔥</div>
                    <div className="text-xs text-gray-400 mt-1">Keep it up!</div>
                </div>
            </div>

            {/* Main Content Area: Daily Challenge & Problem List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Daily Challenge Card (Featured) */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-primary-100 dark:border-primary-900/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Code className="w-48 h-48" />
                    </div>
                    <div className="p-8 relative z-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wide mb-4">
                            Daily Challenge
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Build a Responsive Navbar
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Practice your Flexbox and Media Query skills. Create a navbar that collapses into a hamburger menu on mobile.
                        </p>
                        <div className="flex items-center space-x-4">
                            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center">
                                <Play className="w-4 h-4 mr-2" /> Start Coding
                            </button>
                            <span className="text-sm text-gray-500">Est. 15 mins</span>
                        </div>
                    </div>
                </div>

                {/* Problem List */}
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Practice Problems</h3>
                    <div className="space-y-3">
                        {challenges.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                                <div>
                                    <h4 className={`text-sm font-semibold ${c.status === 'Solved' ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                        {c.title}
                                    </h4>
                                    <span className={`text-xs px-2 py-0.5 rounded ${c.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                            c.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {c.difficulty}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-400">+{c.xp} XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
                        View All Problems
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodingArena;
