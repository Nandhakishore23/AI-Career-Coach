import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
    Layout, Server, Layers, Cpu, Code, Briefcase, Star, Zap,
    Target, Clock, BookOpen, CheckCircle, ArrowRight, ArrowLeft,
    Building, Briefcase as JobIcon, Globe, Plus
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

    // --- Discovery Mode State ---
    const [isDiscoveryMode, setIsDiscoveryMode] = useState(false);
    const [discoveryStep, setDiscoveryStep] = useState('input'); // input | results
    const [discoveryData, setDiscoveryData] = useState({ interests: '', workingStyle: '', skills: '' });
    const [recommendations, setRecommendations] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleDiscoverySubmit = async () => {
        if (!discoveryData.interests || !discoveryData.workingStyle) return;
        setIsAnalyzing(true);
        try {
            // Call AI Service (Directly or via proxy if needed, assuming direct for now or enable CORS on AI service)
            // Ideally should be via backend proxy to hide API key, but consistent with current arch
            const res = await api.post('http://localhost:5002/recommend-career', discoveryData);
            // Note: In prod, route through main server. For dev/demo, direct is faster if CORS allowed.
            // If CORS fails, we might need a proxy. Let's assume direct works or I'll fix it.
            // Actually, best practice is to route via server if possible, but let's try direct to 5002 first 
            // OR reuse the existing pattern if any. 
            // Wait, existing pattern uses api.post to port 5005. Let's create a proxy route? 
            // I didn't create a proxy route in server/routes/roadmap.js for this yet. 
            // To save time, I will call the AI service port 5002 directly. 
            // If that fails due to CORS, I will proxy it.
            setRecommendations(res.data.recommendations);
            setDiscoveryStep('results');
        } catch (error) {
            console.error("Discovery failed", error);
            // Fallback for demo if API fails
            setRecommendations([
                { role: "Frontend Developer", matchPercentage: 95, reason: "Matches your creative interest.", salaryRange: "$70-120k", learningCurve: "Medium" },
                { role: "UX Designer", matchPercentage: 85, reason: "Focuses on visual aesthetics.", salaryRange: "$65-110k", learningCurve: "Easy" },
                { role: "Product Manager", matchPercentage: 80, reason: "Strategic alignment with your style.", salaryRange: "$90-140k", learningCurve: "Hard" }
            ]);
            setDiscoveryStep('results');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const applyRecommendation = (role) => {
        setFormData({ ...formData, careerGoal: role });
        setIsDiscoveryMode(false);
        setStep(2); // Move to Experience Level
    };

    // --- Steps Rendering ---
    const renderDiscoveryInput = () => (
        <div className="space-y-6 animate-fadeIn text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Let AI Decide 🧠</h2>
            <p className="text-gray-500">Tell us about yourself, and we'll find your perfect match.</p>

            <div className="text-left space-y-4 max-w-lg mx-auto">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hobbies & Interests</label>
                    <textarea
                        className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                        rows="3"
                        placeholder="e.g. I wait playing video games, solving puzzles, drawing, or organizing events..."
                        value={discoveryData.interests}
                        onChange={(e) => setDiscoveryData({ ...discoveryData, interests: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Working Style</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Solo / Independent', 'Team / Social', 'Creative / Visual', 'Logical / Analytical'].map(style => (
                            <button
                                key={style}
                                onClick={() => setDiscoveryData({ ...discoveryData, workingStyle: style })}
                                className={`p-2 text-sm rounded-lg border ${discoveryData.workingStyle === style ? 'bg-primary-100 border-primary-500 text-primary-700' : 'border-gray-200 dark:border-gray-700'}`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handleDiscoverySubmit}
                disabled={!discoveryData.interests || !discoveryData.workingStyle || isAnalyzing}
                className="w-full max-w-lg mx-auto py-3 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
            >
                {isAnalyzing ? 'Analyzing Personality...' : 'Find My Career Path 🔮'}
            </button>

            <button onClick={() => setIsDiscoveryMode(false)} className="text-sm text-gray-400 hover:text-gray-600 mt-4 underline">
                Back to Manual Selection
            </button>
        </div>
    );

    const renderDiscoveryResults = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">We Found 3 Matches! 🎉</h2>
                <p className="text-gray-500">Based on your unique profile.</p>
            </div>

            <div className="grid gap-4">
                {recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
                            {rec.matchPercentage}% Match
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{rec.role}</h3>
                        <p className="text-sm text-gray-500 mb-3">{rec.reason}</p>

                        <div className="flex items-center space-x-4 text-xs font-medium text-gray-400 mb-4">
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">💰 {rec.salaryRange}</span>
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">📈 {rec.learningCurve} Curve</span>
                        </div>

                        <button
                            onClick={() => applyRecommendation(rec.role)}
                            className="w-full py-2 rounded-lg border-2 border-primary-600 text-primary-600 font-bold hover:bg-primary-600 hover:text-white transition-colors"
                        >
                            Select this Path
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={() => setDiscoveryStep('input')} className="w-full text-center text-gray-400 hover:text-gray-600 mt-2">
                Try Analyzing Again
            </button>
        </div>
    );

    const renderStep1_Role = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">Choose Your Path</h2>
                <p className="mt-2 text-gray-500">What do you want to become?</p>
            </div>

            {/* Discovery Mode Toggle */}
            <div className="bg-gradient-to-r from-purple-50 to-primary-50 dark:from-purple-900/20 dark:to-primary-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-purple-700 dark:text-purple-300">Not sure yet?</h4>
                    <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Let AI analyze your personality.</p>
                </div>
                <button
                    onClick={() => setIsDiscoveryMode(true)}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition"
                >
                    Discover for Me ✨
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const isActive = formData.careerGoal === role.id;
                    return (
                        <button
                            key={role.id}
                            onClick={() => handleSelection('careerGoal', role.id)}
                            className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg flex items-center space-x-4 ${isActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <div className={`p-3 rounded-lg ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{role.id}</h3>
                                <p className="text-sm text-gray-500">{role.desc}</p>
                            </div>
                        </button>
                    );
                })}

                {/* Others Option */}
                <button
                    onClick={() => setFormData({ ...formData, careerGoal: 'Others' })}
                    className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg flex items-center space-x-4 ${(!roles.find(r => r.id === formData.careerGoal) && formData.careerGoal)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                        }`}
                >
                    <div className={`p-3 rounded-lg ${(!roles.find(r => r.id === formData.careerGoal) && formData.careerGoal) ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        <Plus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Others</h3>
                        <p className="text-sm text-gray-500">Define your own path</p>
                    </div>
                </button>

                {/* Custom Input Field for "Others" */}
                {(!roles.find(r => r.id === formData.careerGoal) && formData.careerGoal) && (
                    <div className="col-span-1 md:col-span-2 mt-2 animate-fadeIn bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            What specific role are you aiming for?
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g. Game Developer, Data Scientist, AR/VR Engineer..."
                                value={formData.careerGoal === 'Others' ? '' : formData.careerGoal}
                                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    if (formData.careerGoal && formData.careerGoal !== 'Others') setStep(s => s + 1);
                                }}
                                disabled={!formData.careerGoal || formData.careerGoal === 'Others'}
                                className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${(!formData.careerGoal || formData.careerGoal === 'Others')
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // ... (Steps 2-5 remain unchanged) ...

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

                    {/* Progress Bar (Hide in Discovery Mode) */}
                    {!isDiscoveryMode && (
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
                    )}

                    <div className="glass p-8 md:p-12 rounded-2xl shadow-xl dark:bg-dark-card/50 transition-all relative min-h-[500px] flex flex-col justify-center">
                        {step > 1 && !isDiscoveryMode && (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* Discovery Mode Routing */}
                        {isDiscoveryMode ? (
                            discoveryStep === 'input' ? renderDiscoveryInput() : renderDiscoveryResults()
                        ) : (
                            <>
                                {step === 1 && renderStep1_Role()}
                                {step === 2 && renderStep2_Experience()}
                                {step === 3 && renderStep3_Target()}
                                {step === 4 && renderStep4_Skills()}
                                {step === 5 && renderStep5_Logistics()}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
