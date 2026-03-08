import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { analyzeAnswer, endInterview } from '../utils/api';
import Navbar from '../components/Navbar';
import { Mic, MicOff, Send, Volume2, Bot, ArrowRight, XCircle, Zap, CheckCircle, BarChart, AlertTriangle, BookOpen } from 'lucide-react';
import AudioVisualizer from '../components/AudioVisualizer';

const InterviewSession = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { initialQuestion, context, role, topic } = location.state || {};

    const [currentQuestion, setCurrentQuestion] = useState(initialQuestion || "Tell me about yourself.");
    const [currentContext, setCurrentContext] = useState(context || "Introductory question.");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const [history, setHistory] = useState([]);
    const [report, setReport] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const bottomRef = useRef(null);

    // Initial redirect check
    useEffect(() => {
        if (!initialQuestion) {
            navigate('/dashboard/interviews/setup');
        } else {
            speak(initialQuestion);
        }

        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        };
    }, []);

    // Scroll to bottom on feedback
    useEffect(() => {
        if (feedback) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [feedback]);

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Prevent overlapping/repeating voices
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleMicToggle = async () => {
        if (listening) {
            SpeechRecognition.stopListening();
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
            }
        } else {
            resetTranscript();
            setManualInput(""); // Clear manual input if voice is used
            SpeechRecognition.startListening({ continuous: true });

            // Get stream for visualizer
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setMediaStream(stream);
            } catch (err) {
                console.error("Failed to get audio stream for visualizer", err);
            }
        }
    };

    const handleSubmitAnswer = async () => {
        const answerText = manualInput || transcript;
        if (!answerText.trim()) return;

        if (!answerText.trim()) return;

        SpeechRecognition.stopListening();
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
        setLoading(true);

        try {
            const { data } = await analyzeAnswer({
                question: currentQuestion,
                answer: answerText,
                role: role
            });

            setFeedback(data);

            // Save to history
            setHistory(prev => [...prev, {
                question: currentQuestion,
                answer: answerText,
                score: data.score,
                feedback: data.feedback
            }]);

            // Wait for user to read feedback, then they can click "Next Question"
        } catch (error) {
            console.error("Analysis Failed", error);
            alert("Failed to analyze answer.");
        } finally {
            setLoading(false);
        }
    };

    const handleNextQuestion = () => {
        if (!feedback) return;

        setCurrentQuestion(feedback.next_question);
        setCurrentContext(feedback.next_context);
        setFeedback(null);
        resetTranscript();
        setManualInput("");
        speak(feedback.next_question);
    };

    const handleEndSession = async () => {
        if (history.length === 0) {
            alert("No interaction history to analyze.");
            navigate('/dashboard');
            return;
        }

        setLoading(true);
        try {
            const { data } = await endInterview({ history, role });
            setReport(data);
        } catch (error) {
            console.error("Report Generation Failed", error);
            alert("Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition. Please use Chrome.</span>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-cyan-500/30">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-200">{role} Interview</h2>
                        <span className="text-sm text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">{topic}</span>
                    </div>
                    <div className="flex gap-2">
                        {!report && (
                            <button
                                onClick={handleEndSession}
                                disabled={loading || history.length === 0}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors text-sm font-medium"
                            >
                                End Session
                            </button>
                        )}
                        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-white transition-colors">
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {report ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar animate-fade-in-up">
                        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Performance Report</h2>
                                <p className="text-gray-400">Here's how you performed in your {role} mock interview.</p>
                            </div>

                            {/* Score Circle */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <svg className="w-40 h-40 transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-700" />
                                        <circle
                                            cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                                            className="text-cyan-500 transition-all duration-1000 ease-out"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * report.overall_score) / 100}
                                        />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                        <div className="text-4xl font-bold text-white">{report.overall_score}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-widest">Score</div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 mb-8">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-cyan-400" /> AI Summary
                                </h3>
                                <p className="text-gray-300 italic">"{report.summary}"</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Strengths */}
                                <div className="bg-green-500/10 p-6 rounded-xl border border-green-500/20">
                                    <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" /> Strengths
                                    </h3>
                                    <ul className="space-y-2">
                                        {report.strengths.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-300">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weaknesses */}
                                <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
                                    <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Areas to Improve
                                    </h3>
                                    <ul className="space-y-2">
                                        {report.weaknesses.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-300">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Suggestion */}
                            <div className="bg-blue-600/20 p-6 rounded-xl border border-blue-500/30">
                                <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" /> Strategic Advice
                                </h3>
                                <p className="text-gray-200">{report.suggestion}</p>
                            </div>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full mt-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                ) : (
                    // Main Interaction Area
                    <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2 custom-scrollbar">

                        {/* AI Question Bubble */}
                        <div className="flex gap-4">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                {isSpeaking && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-5 rounded-2xl rounded-tl-none shadow-xl">
                                    <p className="text-lg text-gray-100 leading-relaxed">{currentQuestion}</p>
                                </div>
                                <p className="text-sm text-gray-500 ml-2 italic">{currentContext}</p>
                                <button onClick={() => speak(currentQuestion)} className="text-gray-500 hover:text-cyan-400 text-sm flex items-center gap-1 ml-2 transition-colors">
                                    <Volume2 className="w-4 h-4" /> Replay Question
                                </button>
                            </div>
                        </div>

                        {/* Feedback Bubble (if available) */}
                        {feedback && (
                            <div className="flex gap-4 animate-fade-in-up">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                    <Zap className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="flex-1 bg-green-900/10 border border-green-500/30 p-5 rounded-2xl shadow-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="text-2xl font-bold text-green-400">{feedback.score}/10</div>
                                        <div className="text-sm text-green-300/80 uppercase tracking-wider font-semibold">AI Feedback</div>
                                    </div>
                                    <p className="text-gray-300 mb-4">{feedback.feedback}</p>

                                    <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Suggested Answer</p>
                                        <p className="text-gray-400 text-sm italic">"{feedback.suggested_answer}"</p>
                                    </div>

                                    <button
                                        onClick={handleNextQuestion}
                                        className="mt-4 w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
                                    >
                                        Next Question <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                )}

                {/* Input Area - Hide if report is shown */}
                {!feedback && !report && (
                    <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700/50 p-4 rounded-2xl shadow-2xl relative">
                        {listening && (
                            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-64 md:w-80 z-20">
                                <AudioVisualizer stream={mediaStream} isListening={listening} />
                                <div className="text-center mt-2">
                                    <span className="bg-red-500/90 text-white text-xs px-3 py-1 rounded-full animate-pulse shadow-lg">
                                        Recording...
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={handleMicToggle}
                                className={`p-4 rounded-xl transition-all duration-300 shadow-lg flex-shrink-0
                                    ${listening
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 ring-2 ring-red-500/20'
                                        : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:text-white'
                                    }`}
                            >
                                {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </button>

                            <textarea
                                value={manualInput || transcript}
                                onChange={(e) => setManualInput(e.target.value)}
                                placeholder={listening ? "Listening..." : "Type your answer here or use the mic..."}
                                className="flex-1 bg-gray-900/50 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                                rows="2"
                            />

                            <button
                                onClick={handleSubmitAnswer}
                                disabled={loading || (!manualInput && !transcript)}
                                className="p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewSession;
