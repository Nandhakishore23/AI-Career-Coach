import React from 'react';
import { FileText, Upload } from 'lucide-react';

const ResumeBuilder = () => {
    return (
        <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold dark:text-white mb-4">Smart Resume Builder</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8">
                Upload your current resume and let our AI optimize it for your target role.
                Beat the ATS and get more interviews.
            </p>
            <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed">
                Coming Soon
            </button>
        </div>
    );
};

export default ResumeBuilder;
