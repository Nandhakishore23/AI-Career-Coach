import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { ArrowLeft, BookOpen, Video, FileText, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TopicPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { topic, phaseIdx, moduleIdx, topicIdx } = location.state || {}; // topic is {title, difficulty, outcome, status}

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!topic) return;

        const fetchContent = async () => {
            setLoading(true);
            try {
                // Call our new Node.js proxy endpoint which calls Python AI
                const res = await api.post('/roadmap/topic-content', {
                    topic: topic.title,
                    role: "Developer" // optional override
                });
                setContent(res.data);
            } catch (err) {
                console.error("Failed to load content", err);
                setError("Failed to generate content. The AI might be busy.");
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [topic]);

    if (!topic) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg text-gray-500">
                <div className="text-center">
                    <p>No topic selected.</p>
                    <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary-600 hover:underline">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
            <Navbar />

            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-24 animate-fadeIn">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Roadmap
                </button>

                {/* Header */}
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${topic.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-primary-100 text-primary-800'
                            }`}>
                            {topic.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {topic.difficulty}
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
                        {topic.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                        Outcome: {topic.outcome || "Master this concept."}
                    </p>
                </div>

                {/* Content Loader */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">AI is generating your custom tutorial...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 text-center">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : content ? (
                    <div className="space-y-10 animate-slideUp">

                        {/* 1. AI Explanation */}
                        <section className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 prose dark:prose-invert max-w-none">
                            <h2 className="flex items-center text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                                <Layers className="w-6 h-6 mr-3 text-primary-500" />
                                Mentor's Explanation
                            </h2>
                            <ReactMarkdown>{content.explanation}</ReactMarkdown>
                        </section>

                        {/* 2. Key Concepts */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                                <BookOpen className="w-6 h-6 mr-3 text-primary-500" />
                                Key Concepts
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {content.key_concepts && content.key_concepts.map((concept, idx) => (
                                    <div key={idx} className="bg-white dark:bg-dark-card p-5 rounded-xl border-l-4 border-primary-500 shadow-sm">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{concept}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. Practice Task */}
                        <section className="bg-gradient-to-br from-primary-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
                                <FileText className="w-64 h-64" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 relative z-10 flex items-center">
                                <FileText className="w-6 h-6 mr-3" />
                                Interactive Challenge
                            </h2>
                            <p className="text-lg opacity-90 relative z-10 font-light">
                                {content.practice_task}
                            </p>
                            <button className="mt-6 px-6 py-3 bg-white text-primary-900 font-bold rounded-lg hover:bg-gray-100 transition-colors relative z-10 shadow-lg" onClick={() => window.open('https://codesandbox.io/', '_blank')}>
                                Open Code Sandbox
                            </button>
                        </section>

                        {/* 4. Video Resources */}
                        <section>
                            <h2 className="flex items-center text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                                <Video className="w-6 h-6 mr-3 text-red-500" />
                                Recommended Video
                            </h2>
                            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Based on your query: <span className="font-semibold text-primary-600">"{content.video_query}"</span>
                                </p>
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(content.video_query)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                >
                                    <Video className="mr-2 -ml-1 w-5 h-5" />
                                    Search on YouTube
                                </a>
                            </div>
                        </section>

                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default TopicPage;
