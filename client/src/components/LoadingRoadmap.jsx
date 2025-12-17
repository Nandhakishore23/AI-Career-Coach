import React, { useState, useEffect } from 'react';
import {
    Cpu, Brain, Network, Zap, Code,
    Database, Layers, CheckCircle2, Loader2
} from 'lucide-react';

const LoadingRoadmap = () => {
    const [tipIndex, setTipIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const tips = [
        "Analyzing your current skills...",
        "Identifying knowledge gaps...",
        "Structuring your weekly schedule...",
        "Curating top-tier learning resources...",
        "Finding the best YouTube tutorials...",
        "Personalizing project ideas for you...",
        "Building a day-by-day execution plan...",
        "Finalizing your path to success..."
    ];

    const facts = [
        "Did you know? Full Stack Developers are among the top 3 most in-demand roles.",
        "Consistency beats intensity. 30 mins a day is better than 5 hours once a week.",
        "Building projects is the fastest way to learn a new technology.",
        "Soft skills like communication are just as important as coding skills.",
        "The best way to debug is to explain your code to a rubber duck!"
    ];

    // Cycle through status messages
    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % tips.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Progress bar simulation (slow then fast)
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) return 100;
                // Slow down as it gets higher to simulate "thinking"
                const diff = Math.random() * (oldProgress > 70 ? 2 : 10);
                return Math.min(oldProgress + diff, 99);
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">

            {/* Animated Centerpiece */}
            <div className="relative w-32 h-32 mb-12">
                <div className="absolute inset-0 bg-primary-500 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute inset-2 bg-primary-500 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-16 h-16 text-primary-600 animate-bounce" />
                </div>

                {/* Orbiting Icons */}
                <div className="absolute top-0 -left-12 animate-spin-slow">
                    <Code className="w-8 h-8 text-blue-500" />
                </div>
                <div className="absolute bottom-0 -right-12 animate-spin-slow" style={{ animationDelay: '1s' }}>
                    <Database className="w-8 h-8 text-green-500" />
                </div>
                <div className="absolute -top-8 right-0 animate-pulse">
                    <Zap className="w-6 h-6 text-yellow-500" />
                </div>
            </div>

            {/* Main Status Text */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center font-display transition-all duration-500">
                {tips[tipIndex]}
            </h2>

            {/* Progress Bar */}
            <div className="w-full max-w-md h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8 relative">
                <div
                    className="h-full bg-primary-600 transition-all duration-300 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/30 w-full h-full animate-shimmer"></div>
                </div>
            </div>

            {/* Career/Fun Fact Card */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl max-w-lg w-full border border-gray-100 dark:border-gray-700 shadow-lg mt-4 animate-fadeIn">
                <div className="flex items-start space-x-3">
                    <Loader2 className="w-5 h-5 text-primary-500 animate-spin mt-1 shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                            While you wait
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 italic">
                            "{facts[Math.floor((progress / 20) % facts.length)]}"
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-8 text-center max-w-xs">
                Generating a personalized 4-6 week plan with AI. This may take up to a minute.
            </p>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LoadingRoadmap;
