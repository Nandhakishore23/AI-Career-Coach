import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
    Layout, Server, Layers, Cpu, Code, Briefcase, Star, Zap,
    Target, Clock, BookOpen, CheckCircle, ArrowRight, ArrowLeft,
    Building, Briefcase as JobIcon, Globe
} from 'lucide-react';
import LoadingRoadmap from '../components/LoadingRoadmap';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        careerGoal: '',
        experienceLevel: '',
        targetCompany: '',
        weeklyHours: 10,
        learningStyle: '',
        currentSkills: [],
        githubLink: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // --- Configuration Data ---
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

    const companies = [
        { id: 'Product/Startup', icon: Target, desc: 'Fast-paced, broad scope', color: 'text-blue-500 bg-blue-50' },
        { id: 'FAANG/Big Tech', icon: Globe, desc: 'Deep scale, high DSA', color: 'text-purple-500 bg-purple-50' },
        { id: 'Service-Based', icon: Building, desc: 'Client projects, variety', color: 'text-orange-500 bg-orange-50' }
    ];

    const styles = [
        { id: 'Video & Visual', icon: Layout, desc: 'Youtube, Courses, Visuals' },
        { id: 'Documentation & Books', icon: BookOpen, desc: 'Deep dives, Reading' },
        { id: 'Hands-on Projects', icon: Code, desc: 'Build first, theory later' }
    ];

    const commonSkills = [
        "HTML", "CSS", "JavaScript", "React", "Node.js",
        "Python", "Java", "C++", "SQL", "Git",
        "TypeScript", "Docker", "AWS", "Figma"
    ];

    // --- Handlers ---
    const handleSelection = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Auto-advance for single-select steps
        if (['careerGoal', 'experienceLevel', 'targetCompany', 'learningStyle'].includes(field)) {
            setTimeout(() => setStep(s => s + 1), 250);
        }
    };

    const toggleSkill = (skill) => {
        setFormData(prev => {
            const skills = prev.currentSkills.includes(skill)
                ? prev.currentSkills.filter(s => s !== skill)
                : [...prev.currentSkills, skill];
            return { ...prev, currentSkills: skills };
        });
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
            const msg = error.response?.data?.message || 'Something went wrong. Please try again.';
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Steps Rendering ---
    const renderStep1_Role = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Choose Your Path</h2>
                <p className="mt-2 text-gray-500">What do you want to become?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                        <button
                            key={role.id}
                            onClick={() => handleSelection('careerGoal', role.id)}
                            className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg flex items-center space-x-4 ${formData.careerGoal === role.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <div className={`p-3 rounded-lg ${formData.careerGoal === role.id ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{role.id}</h3>
                                <p className="text-sm text-gray-500">{role.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderStep2_Experience = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Your Starting Point</h2>
                <p className="mt-2 text-gray-500">We'll adapt the difficulty for you.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {levels.map((level) => {
                    const Icon = level.icon;
                    return (
                        <button
                            key={level.id}
                            onClick={() => handleSelection('experienceLevel', level.id)}
                            className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg flex items-center space-x-4 ${formData.experienceLevel === level.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <div className={`p-3 rounded-lg ${formData.experienceLevel === level.id ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{level.id}</h3>
                                <p className="text-sm text-gray-500">{level.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderStep3_Target = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Career Objective</h2>
                <p className="mt-2 text-gray-500">Where do you envision yourself working?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {companies.map((comp) => {
                    const Icon = comp.icon;
                    return (
                        <button
                            key={comp.id}
                            onClick={() => handleSelection('targetCompany', comp.id)}
                            className={`p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg flex flex-col items-center justify-center space-y-3 h-48 ${formData.targetCompany === comp.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <div className={`p-4 rounded-full ${comp.color.replace('text-', 'bg-').replace('500', '100')} ${formData.targetCompany === comp.id ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}>
                                <Icon className={`w-8 h-8 ${comp.color}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{comp.id}</h3>
                                <p className="text-xs text-center text-gray-500 mt-1">{comp.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderStep4_Skills = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Skill Audit</h2>
                <p className="mt-2 text-gray-500">Select what you ALREADY know (we'll skip these).</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {commonSkills.map(skill => (
                    <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${formData.currentSkills.includes(skill)
                            ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary-400'
                            }`}
                    >
                        {skill} {formData.currentSkills.includes(skill) && '✓'}
                    </button>
                ))}
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={() => setStep(s => s + 1)}
                    className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:opacity-90 transition-all inline-flex items-center"
                >
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        </div>
    );

    const renderStep5_Logistics = () => (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Final Details</h2>
                <p className="mt-2 text-gray-500">Tailoring the schedule to you.</p>
            </div>

            {/* Hours Slider */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex justify-between">
                    <span>Weekly Commitment</span>
                    <span className="text-primary-600">{formData.weeklyHours} Hours / Week</span>
                </label>
                <input
                    type="range"
                    min="2" max="40" step="1"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Casual (2h)</span>
                    <span>Part-time (20h)</span>
                    <span>Full-time (40h)</span>
                </div>
            </div>

            {/* Learning Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {styles.map((s) => {
                    const Icon = s.icon;
                    return (
                        <button
                            key={s.id}
                            onClick={() => {
                                setFormData({ ...formData, learningStyle: s.id });
                            }}
                            className={`p-4 border-2 rounded-xl text-center transition-all hover:shadow-md ${formData.learningStyle === s.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${formData.learningStyle === s.id ? 'text-primary-500' : 'text-gray-400'}`} />
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">{s.id}</h3>
                        </button>
                    );
                })}
            </div>

            <div className="text-center mt-4">
                <button
                    onClick={handleSubmit} disabled={isLoading || !formData.learningStyle}
                    className={`w-full py-4 px-6 bg-primary-600 text-white rounded-xl text-lg font-bold hover:bg-primary-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center ${isLoading || !formData.learningStyle ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Generating Master Plan...' : 'Generate Personalized Roadmap 🚀'}
                </button>
            </div>
        </div>
    );

    if (isLoading) {
        return <LoadingRoadmap />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col transition-colors duration-300">
            <Navbar />

            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl w-full">

                    {/* Progress Bar */}
                    <div className="mb-8 max-w-xl mx-auto">
                        <div className="flex justify-between mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            <span className={step >= 1 ? 'text-primary-600' : ''}>Role</span>
                            <span className={step >= 2 ? 'text-primary-600' : ''}>Level</span>
                            <span className={step >= 3 ? 'text-primary-600' : ''}>Goal</span>
                            <span className={step >= 4 ? 'text-primary-600' : ''}>Skills</span>
                            <span className={step >= 5 ? 'text-primary-600' : ''}>Plan</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600 transition-all duration-500 ease-out"
                                style={{ width: `${(step / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="glass p-8 md:p-12 rounded-2xl shadow-xl dark:bg-dark-card/50 transition-all relative min-h-[500px] flex flex-col justify-center">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}

                        {step === 1 && renderStep1_Role()}
                        {step === 2 && renderStep2_Experience()}
                        {step === 3 && renderStep3_Target()}
                        {step === 4 && renderStep4_Skills()}
                        {step === 5 && renderStep5_Logistics()}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
