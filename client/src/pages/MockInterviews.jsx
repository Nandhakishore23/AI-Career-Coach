import { useNavigate } from 'react-router-dom';
import { Mic, History, Plus } from 'lucide-react';

const MockInterviews = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock Interviews</h1>
                    <p className="text-gray-500 dark:text-gray-400">Practice your speaking skills with AI.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/interviews/setup')}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-primary-500/30"
                >
                    <Plus className="w-5 h-5" />
                    Start New Session
                </button>
            </header>

            {/* Placeholder Content */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Card 1: Start New */}
                <div
                    onClick={() => navigate('/dashboard/interviews/setup')}
                    className="group p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-sm hover:shadow-xl hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Mic className="w-24 h-24 text-cyan-500" />
                    </div>
                    <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400">
                        <Mic className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">New Interview</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Start a fresh session. Choose your role, topic, and difficulty to begin.
                    </p>
                </div>

                {/* Card 2: History (Empty State for now) */}
                <div className="p-6 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                        <History className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Recent History</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No past interviews found. Complete your first session to see analytics here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MockInterviews;
