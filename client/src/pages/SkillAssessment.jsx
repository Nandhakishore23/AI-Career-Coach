import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Cpu, Code, Database, Globe, Play, Timer,
    CheckCircle, XCircle, Award, ArrowRight, Zap
} from 'lucide-react';
import Confetti from 'react-confetti';

const TOPICS = [
    { id: 'react', name: 'React', icon: Code, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
    { id: 'node', name: 'Node.js', icon: Database, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
    { id: 'javascript', name: 'JavaScript', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    { id: 'python', name: 'Python', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { id: 'system_design', name: 'System Design', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
];

const SkillAssessment = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('setup'); // setup, quiz, result
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [loading, setLoading] = useState(false);

    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: 1, 1: 3 } (questionIndex: optionIndex)
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);

    const AI_SERVICE_URL = "http://127.0.0.1:5002"; // Direct to AI Service for now

    // Timer Logic
    useEffect(() => {
        let timer;
        if (mode === 'quiz' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && mode === 'quiz') {
            handleNext(); // Auto-skip
        }
        return () => clearInterval(timer);
    }, [timeLeft, mode]);

    const startQuiz = async () => {
        if (!selectedTopic) return;
        setLoading(true);
        try {
            const res = await axios.post(`${AI_SERVICE_URL}/assessment/generate`, {
                topic: selectedTopic.name,
                difficulty,
                count: 5
            });
            setQuestions(res.data);
            setMode('quiz');
            setCurrentQIndex(0);
            setAnswers({});
            setScore(0);
            setTimeLeft(30);
        } catch (err) {
            console.error(err);
            alert("Failed to generate quiz. Is AI Service running?");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (optionIndex) => {
        setAnswers({ ...answers, [currentQIndex]: optionIndex });
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setTimeLeft(30);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        // Calculate Score
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_index) correctCount++;
        });
        setScore(correctCount);
        setMode('result');

        // Save to Backend
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post('http://localhost:5005/api/assessment/submit', {
                    topic: selectedTopic.name,
                    score: correctCount,
                    total: questions.length,
                    difficulty
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (err) {
            console.error("Failed to save result:", err);
        }
    };

    const getBadge = () => {
        if (!questions.length) return null;
        const percentage = (score / questions.length) * 100;
        if (percentage === 100) return { name: 'Diamond', color: 'text-cyan-300', icon: Award };
        if (percentage >= 80) return { name: 'Gold', color: 'text-yellow-400', icon: Award };
        if (percentage >= 60) return { name: 'Silver', color: 'text-gray-300', icon: Award };
        return { name: 'Bronze', color: 'text-orange-400', icon: Award };
    };

    const badge = mode === 'result' ? getBadge() : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 animate-pulse">AI is crafting your {difficulty} questions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 font-sans text-white">

            {/* --- SETUP MODE --- */}
            {mode === 'setup' && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                            Skill Verification Arena
                        </h1>
                        <p className="text-gray-400">Prove your skills. Earn badges. Level up.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TOPICS.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => setSelectedTopic(topic)}
                                className={`p-6 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden
                                    ${selectedTopic?.id === topic.id
                                        ? `${topic.bg} ${topic.border} ring-2 ring-cyan-500`
                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${topic.bg} ${topic.color}`}>
                                    <topic.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">
                                    {topic.name}
                                </h3>
                                {selectedTopic?.id === topic.id && (
                                    <div className="absolute top-4 right-4 text-cyan-500 animate-in fade-in zoom-in">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {selectedTopic && (
                        <div className="flex justify-center pt-8">
                            <button
                                onClick={startQuiz}
                                className="px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-full font-bold text-lg shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                Start Assessment <Play className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* --- QUIZ MODE --- */}
            {mode === 'quiz' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
                    {/* Header: Progress & Timer */}
                    <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                                Question {currentQIndex + 1} / {questions.length}
                            </span>
                        </div>
                        <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                            <Timer className="w-5 h-5" /> 00:{timeLeft.toString().padStart(2, '0')}
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 p-8 rounded-3xl shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                            {questions[currentQIndex].question}
                        </h2>

                        <div className="space-y-4">
                            {questions[currentQIndex].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full p-4 rounded-xl border2 text-left transition-all duration-200 flex items-center justify-between group
                                        ${answers[currentQIndex] === idx
                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                                            : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
                                            ${answers[currentQIndex] === idx ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        {option}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleNext}
                            disabled={!answers.hasOwnProperty(currentQIndex)}
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* --- RESULT MODE --- */}
            {mode === 'result' && (
                <div className="text-center max-w-2xl mx-auto pt-10 animate-fade-in-up">
                    {badge && <Confetti recycle={false} numberOfPieces={500} />}

                    <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                        {/* Badge Glow */}
                        {badge && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-cyan-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                        )}

                        <div className="mb-8">
                            {badge ? (
                                <div className="inline-block p-6 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)] mb-4 animate-float">
                                    <badge.icon className={`w-24 h-24 ${badge.color}`} />
                                </div>
                            ) : (
                                <div className="inline-block p-6 rounded-full bg-gray-900 border-4 border-gray-700 mb-4 text-gray-600">
                                    <XCircle className="w-24 h-24" />
                                </div>
                            )}

                            <h2 className="text-4xl font-bold text-white mb-2">
                                {badge ? `${badge.name} Badge Unlocked!` : 'Keep Practicing'}
                            </h2>
                            <p className="text-gray-400">
                                You scored <span className="text-white font-bold text-xl">{score}</span> out of {questions.length}
                            </p>
                        </div>

                        <div className="grid gap-4 text-left mb-8">
                            <h3 className="text-gray-500 uppercase tracking-widest text-sm font-bold border-b border-gray-700 pb-2">
                                Performance Breakdown
                            </h3>
                            {questions.map((q, idx) => {
                                const isCorrect = answers[idx] === q.correct_index;
                                return (
                                    <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                        <div className="flex gap-3 mb-2">
                                            {isCorrect ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                                            <p className="font-medium text-gray-200">{q.question}</p>
                                        </div>
                                        {!isCorrect && (
                                            <p className="text-sm text-gray-400 ml-8">
                                                Correct Answer: <span className="text-white">{q.options[q.correct_index]}</span>
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500 ml-8 mt-1 italic">
                                            {q.explanation}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button onClick={() => setMode('setup')} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-colors">
                                Try Another Topic
                            </button>
                            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-cyan-500/20">
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillAssessment;
