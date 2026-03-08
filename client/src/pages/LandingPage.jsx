import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, Code, Cpu, LineChart, Sparkles, Zap, Shield } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden transition-colors duration-500">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-float"></div>
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary-600/20 rounded-full blur-[80px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">AI Interview Coach 2.0 is Live</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <span className="block text-gray-900 dark:text-white mb-2">Master Your Next</span>
                        <span className="text-gradient">Tech Interview</span>
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Stop memorizing answers. Start practicing with an <span className="text-cyan-500 font-semibold">AI Architect</span> that adapts to your skills, reviews your code, and helps you land the job.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to="/signup"
                            className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start Training Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <a href="#features" className="px-8 py-4 text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
                            View Features
                        </a>
                    </div>

                    {/* Dashboard Preview / Code Snippet */}
                    <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <div className="relative rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/10 p-2 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-500/10 rounded-2xl pointer-events-none"></div>
                            <div className="rounded-xl overflow-hidden bg-dark-bg border border-white/5">
                                {/* Mock Interface Header */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <div className="ml-4 px-3 py-1 bg-black/50 rounded-full text-xs text-gray-400 font-mono">ai-coach-dashboard.tsx</div>
                                </div>
                                {/* Mock Interface Body */}
                                <div className="p-8 grid md:grid-cols-2 gap-8 text-left">
                                    <div className="space-y-4">
                                        <div className="h-4 w-32 bg-cyan-500/20 rounded animate-pulse"></div>
                                        <div className="h-8 w-3/4 bg-gray-700/50 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-full bg-gray-800 rounded"></div>
                                            <div className="h-2 w-5/6 bg-gray-800 rounded"></div>
                                            <div className="h-2 w-4/6 bg-gray-800 rounded"></div>
                                        </div>
                                        <div className="pt-4 flex gap-3">
                                            <div className="h-10 w-24 bg-cyan-600/20 border border-cyan-500/30 rounded-lg"></div>
                                            <div className="h-10 w-24 bg-gray-800 rounded-lg"></div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block bg-black/30 rounded-lg p-4 border border-white/5 font-mono text-xs text-gray-400">
                                        <div className="text-purple-400">const <span className="text-yellow-200">InterviewSession</span> = () ={'>'} {'{'}</div>
                                        <div className="pl-4 text-cyan-300">const [score, setScore] = useState(0);</div>
                                        <div className="pl-4">
                                            <span className="text-pink-400">return</span> (
                                        </div>
                                        <div className="pl-8 text-green-300">
                                            {'<AIInterviewer mode="behavioral" />'}
                                        </div>
                                        <div className="pl-4">);</div>
                                        <div>{'}'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything you need to <span className="text-cyan-500">succeed</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            From personalized roadmaps to real-time speech analysis, we've built the ultimate career acceleration platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Code className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI Roadmaps</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Forget generic tutorials. Get a bespoke curriculum generated instantly based on your target role and skills gap.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Cpu className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mock Interviews</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Practice with a voice-enabled AI that adapts to your answers. It's like having a senior engineer on call 24/7.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <LineChart className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-time Analytics</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Track your WPM (Words Per Minute), filler words, and technical accuracy. See your growth over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TRUST BADGE --- */}
            <section className="py-20 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-8">
                        Powered by Advanced AI Models
                    </h3>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple text placeholders for logos for now */}
                        <span className="text-2xl font-bold text-gray-400">Google Gemini</span>
                        <span className="text-2xl font-bold text-gray-400">OpenAI</span>
                        <span className="text-2xl font-bold text-gray-400">React</span>
                        <span className="text-2xl font-bold text-gray-400">Node.js</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
