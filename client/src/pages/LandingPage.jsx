import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, Code, Cpu, LineChart } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg selection:bg-primary-500 selection:text-white overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <main className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Background Blobs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 relative z-10">
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left flex flex-col justify-center">
                            <h1>
                                <span className="block text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400 mb-2">
                                    AI-Powered Career Growth
                                </span>
                                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                                    <span className="block text-gray-900 dark:text-white">Master Your Next</span>
                                    <span className="block gradient-text">Tech Interview</span>
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                Generate personalized roadmaps, practice with AI mock interviews, and get real-time feedback to land your dream job at top tech companies.
                            </p>
                            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 md:id text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
                                    No credit card required. Start clearly.
                                </p>
                            </div>
                        </div>
                        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                                <div className="relative block w-full bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden glass p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 p-8 space-y-4">
                                        {/* Mock UI Element */}
                                        <div className="flex items-center space-x-4 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                                                <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                            </div>
                                            <div>
                                                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                                            <div className="flex items-center text-green-700 dark:text-green-400 font-semibold mb-1">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Excellent Answer!
                                            </div>
                                            <p className="text-xs text-green-600 dark:text-green-500">Your approach to the algorithm was optimal (O(n)).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Grid */}
            <section className="py-16 bg-white dark:bg-dark-bg relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Everything you need to succeed
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="group relative p-6 bg-white dark:bg-dark-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1">
                                <div className="absolute -top-6 left-6">
                                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-xl shadow-lg group-hover:bg-primary-600 transition-colors">
                                        <Code className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">AI Generated Roadmaps</h3>
                                <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                                    Get a step-by-step learning path tailored to your target role and current experience level.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group relative p-6 bg-white dark:bg-dark-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1">
                                <div className="absolute -top-6 left-6">
                                    <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-xl shadow-lg group-hover:bg-purple-600 transition-colors">
                                        <Cpu className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">Mock Interviews</h3>
                                <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                                    Practice with our AI interviewer that adapts to your responses and simulates real pressure.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group relative p-6 bg-white dark:bg-dark-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1">
                                <div className="absolute -top-6 left-6">
                                    <span className="inline-flex items-center justify-center p-3 bg-pink-500 rounded-xl shadow-lg group-hover:bg-pink-600 transition-colors">
                                        <LineChart className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">Real-time Analytics</h3>
                                <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                                    Track your progress, identify weak spots, and see how you improve over time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
