import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Layout, Server, Layers, Cpu, Code, Briefcase, Star, Zap } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        careerGoal: '',
        experienceLevel: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const roles = [
        { id: 'Frontend Developer', icon: Layout, desc: 'Build beautiful interfaces' },
        { id: 'Backend Developer', icon: Server, desc: 'Power the web' },
        { id: 'Full Stack Developer', icon: Layers, desc: 'Master both worlds' },
        { id: 'DevOps Engineer', icon: Cpu, desc: 'Automate infrastructure' }
    ];

    const levels = [
        { id: 'Intern/Student', icon: Code, desc: 'Just starting out' },
        { id: 'Junior (0-2 years)', icon: Briefcase, desc: 'Building foundations' },
        { id: 'Mid-Level (3-5 years)', icon: Star, desc: 'Expanding expertise' },
        { id: 'Senior (5+ years)', icon: Zap, desc: 'Leading & Architects' }
    ];

    const handleSelection = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (field === 'careerGoal') {
            setTimeout(() => setStep(2), 300); // Small delay for effect
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await api.post('/roadmap/generate', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to generate roadmap', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col transition-colors duration-300">
            <Navbar />

            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl w-full">

                    {/* Progress Bar */}
                    <div className="mb-8 max-w-xl mx-auto">
                        <div className="flex justify-between mb-2">
                            <span className={`text-xs font-semibold tracking-wider uppercase ${step >= 1 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>Role</span>
                            <span className={`text-xs font-semibold tracking-wider uppercase ${step >= 2 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>Experience</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600 transition-all duration-500 ease-out"
                                style={{ width: step === 1 ? '50%' : '100%' }}
                            ></div>
                        </div>
                    </div>

                    <div className="glass p-8 md:p-12 rounded-2xl shadow-xl dark:bg-dark-card/50 transition-all">
                        {step === 1 && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="text-center">
                                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Choose Your Path</h2>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">Select the career track you want to excel in.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {roles.map((role) => {
                                        const Icon = role.icon;
                                        return (
                                            <button
                                                key={role.id}
                                                onClick={() => handleSelection('careerGoal', role.id)}
                                                className={`group relative p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg ${formData.careerGoal === role.id
                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-800'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-lg ${formData.careerGoal === role.id ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 group-hover:text-primary-600 dark:group-hover:text-primary-400'} transition-colors`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-lg font-bold ${formData.careerGoal === role.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>{role.id}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{role.desc}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="text-center">
                                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Your Experience</h2>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">Help us tailor the roadmap complexity.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {levels.map((level) => {
                                        const Icon = level.icon;
                                        return (
                                            <button
                                                key={level.id}
                                                onClick={() => handleSelection('experienceLevel', level.id)}
                                                className={`group relative p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg ${formData.experienceLevel === level.id
                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-800'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-lg ${formData.experienceLevel === level.id ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 group-hover:text-primary-600 dark:group-hover:text-primary-400'} transition-colors`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-lg font-bold ${formData.experienceLevel === level.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>{level.id}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{level.desc}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {formData.experienceLevel && (
                                    <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            className={`w-full py-4 px-6 bg-primary-600 text-white rounded-xl text-lg font-bold hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                        >
                                            {isLoading ? 'Generating Plan...' : 'Generate Roadmap 🚀'}
                                        </button>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="mt-4 w-full py-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            Back to Role Selection
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
