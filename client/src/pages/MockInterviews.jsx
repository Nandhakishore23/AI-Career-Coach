import React from 'react';
import { Mic, Video } from 'lucide-react';

const MockInterviews = () => {
    return (
        <div className="p-8 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold dark:text-white mb-4">AI Mock Interviewer</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8">
                Practice your soft skills and technical answers with our AI voice agent.
                Get real-time feedback on your tone, pace, and content.
            </p>
            <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed">
                Coming Soon
            </button>
        </div>
    );
};

export default MockInterviews;
