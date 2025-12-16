import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, BookOpen, Video, FileText, ExternalLink } from 'lucide-react';

const TopicPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { step } = location.state || {};

    if (!step) {
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
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${step.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-primary-100 text-primary-800'
                            }`}>
                            {step.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
                            {step.title}
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                    </p>
                </div>

                {/* Key Concepts */}
                {step.details?.keyTerms && step.details.keyTerms.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
                            Key Concepts to Master
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {step.details.keyTerms.map(term => (
                                <span key={term} className="px-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium shadow-sm">
                                    {term}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learning Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {step.details?.resources?.map((res, idx) => (
                        <a
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-lg ${res.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {res.type === 'video' ? <Video className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {res.title}
                                    </h3>
                                </div>
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                {res.type === 'video' ? 'Watch Video Tutorial' : 'Read Documentation / Article'}
                            </p>
                        </a>
                    ))}

                    {(!step.details?.resources || step.details.resources.length === 0) && (
                        <div className="col-span-2 text-center py-10 bg-gray-50 dark:bg-dark-card/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500">Additional resources coming soon.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TopicPage;
