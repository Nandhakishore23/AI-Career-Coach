import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Confetti from 'react-confetti';
import {
    Terminal, Play, Trophy, CheckCircle, XCircle,
    ChevronRight, Code, Cpu, AlertCircle, Loader,
    Maximize2, Minimize2, MoreVertical, Zap, Settings, Volume2, ArrowLeft, Layout,
    Lightbulb, Filter, BarChart3, Eye, EyeOff, Clock
} from 'lucide-react';
import { BLIND_75, CATEGORIES } from '../data/blind75';
import { CONTROLS } from '../data/dsa_problems';
import { playSuccess, playError, playClick, playRun } from '../utils/sounds';
import api from '../utils/api';

// Hook for typewriter effect
const useTypewriter = (text, speed = 10) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (!text) return;
        setDisplayedText('');
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    return displayedText;
};

const CodingArena = () => {
    // State
    const [roadmap, setRoadmap] = useState(BLIND_75);
    const [view, setView] = useState('roadmap'); // 'roadmap' | 'workspace'
    const [activeProblem, setActiveProblem] = useState(null);
    const [problemDetails, setProblemDetails] = useState({}); // Cache: { problemId: { desc, code, tests } }

    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState('# Select a problem to start');

    // Test Case State
    const [testResults, setTestResults] = useState(null); // Array of results
    const [activeTestCase, setActiveTestCase] = useState(0);
    const [output, setOutput] = useState(null); // Raw output (for errors)

    const [isRunning, setIsRunning] = useState(false);
    const [isLoadingProblem, setIsLoadingProblem] = useState(false);
    const [activeTab, setActiveTab] = useState('problem'); // problem, results
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const containerRef = useRef(null); // Ref for component-level fullscreen

    // Hint & Filter State
    const [showHintLevel, setShowHintLevel] = useState(0); // 0=hidden, 1=hint1, 2=hint2, 3=full solution
    const [difficultyFilter, setDifficultyFilter] = useState('All'); // All, Easy, Medium, Hard
    const [categoryFilter, setCategoryFilter] = useState('all'); // all, must-know, pattern-mastery, practice

    // Solved Problem Tracking
    const [solvedIds, setSolvedIds] = useState(new Set());

    // For AI Simulation
    const [simulatedDesc, setSimulatedDesc] = useState('');

    const AI_SERVICE_URL = "http://127.0.0.1:5002";

    // Fetch solved problems on mount
    useEffect(() => {
        const fetchSolvedProblems = async () => {
            try {
                const res = await api.get('/coding/stats');
                if (res.data?.solvedIds) {
                    setSolvedIds(new Set(res.data.solvedIds));
                }
            } catch (err) {
                console.log('Could not fetch solved stats:', err.message);
            }
        };
        fetchSolvedProblems();
    }, []);

    // Piston API Version Map
    const PISTON_VERSIONS = {
        javascript: '18.15.0',
        python: '3.10.0',
        java: '15.0.2',
        cpp: '10.2.0',
        go: '1.16.2'
    };

    // Extended Languages
    const LANGUAGES = [
        { id: 'python', name: 'Python 3', icon: '🐍' },
        { id: 'javascript', name: 'JavaScript', icon: '📜' },
        { id: 'java', name: 'Java', icon: '☕' },
        { id: 'cpp', name: 'C++', icon: '⚙️' },
        { id: 'go', name: 'Go', icon: '🐹' },
    ];

    // Judge0 Language IDs
    const JUDGE0_IDS = {
        javascript: 63, // Node.js 12.14.0
        python: 71,     // Python 3.8.1
        java: 62,       // Java (OpenJDK 13.0.1)
        cpp: 54,        // C++ (GCC 9.2.0)
        go: 60          // Go (1.13.5)
    };



    const handleProblemSelect = async (problem) => {
        playClick();
        setActiveProblem(problem);
        setView('workspace'); // Switch to IDE view
        setTestResults(null);
        setOutput(null);
        setActiveTab('problem');
        setSimulatedDesc(''); // Reset typewriter
        setShowHintLevel(0); // Reset hints for new problem

        // 1. Check if Pre-defined Data exists (Instant Load)
        if (problem.description && problem.starterCode) {
            setProblemDetails(prev => ({
                ...prev,
                [problem.id]: {
                    description: problem.description,
                    starter_code: problem.starterCode[language] || problem.starterCode['python'],
                    test_cases: problem.testCases || [],
                    examples: problem.examples
                }
            }));
            setCode(problem.starterCode[language] || problem.starterCode['python']);
            // Simulate AI Streaming for "Cool Factor"
            simulateStreaming(problem.description);
            return;
        }

        // 2. Check Cache
        if (problemDetails[problem.id]) {
            const details = problemDetails[problem.id];
            setCode(details.starter_code);
            simulateStreaming(details.description); // Re-simulate for cached problems
            return;
        }

        // 3. Fetch from AI (Fallback)
        setIsLoadingProblem(true);
        try {
            const res = await axios.post(`${AI_SERVICE_URL}/code/generate`, {
                title: problem.title,
                topic: getTopicName(problem.id),
                difficulty: problem.difficulty
            });

            const details = res.data;
            setProblemDetails(prev => ({
                ...prev,
                [problem.id]: {
                    description: details.description,
                    starter_code: details.starter_code,
                    test_cases: details.test_cases || [], // Ensure test_cases is an array
                    examples: details.examples
                }
            }));
            setCode(details.starter_code);
            simulateStreaming(details.description);
        } catch (err) {
            console.error("Failed to generate problem", err);
            alert("AI Generation Failed. Please try again.");
        } finally {
            setIsLoadingProblem(false);
        }
    };

    const simulateStreaming = (fullText) => {
        // Just set it immediately for now, but in a real app we could chunk it
        // We will use a CSS animation or simple effect
        setSimulatedDesc(fullText);
    };

    const getTopicName = (problemId) => {
        for (const section of roadmap) {
            if (section.problems.find(p => p.id === problemId)) return section.title;
        }
        return 'Algorithms';
    };

    const runCode = async () => {
        playRun();
        setIsRunning(true);
        setActiveTab('results'); // Switch tab to show results
        setTestResults(null);
        setOutput('Running code...');
        setShowConfetti(false);

        try {
            // Prepend Imports based on language
            let finalCode = code;
            const currentDetails = problemDetails[activeProblem?.id];

            // 1. PYTHON: Construct a robust test runner using JSON
            if (language === 'python') {
                const imports = `from typing import *
import collections, math, heapq, functools, itertools, re, sys, bisect, json
from collections import Counter, defaultdict, deque
`;
                // If we have structured test cases, use them
                if (currentDetails?.test_cases && currentDetails.test_cases.length > 0) {
                    // We use a safe JSON injection strategy
                    const testCasesJSON = JSON.stringify(currentDetails.test_cases.map(tc => ({ args: tc.args, expected: tc.expected })));

                    const driverCode = `
# --- DRIVER CODE ---
if __name__ == "__main__":
    try:
        class Solution:
            pass
        
        # Execute user's code
        exec(compile(__user_code__, '<string>', 'exec'))

        sol = Solution()
        
        # Safe JSON loading
        test_cases_json = '''${testCasesJSON}'''
        test_cases = json.loads(test_cases_json)
        
        results = []
        
        # Find method
        method_name = None
        for m in dir(sol):
            if not m.startswith('__') and callable(getattr(sol, m)):
                method_name = m
                break
        
        if not method_name:
            raise Exception("No method found in Solution class")

        method = getattr(sol, method_name)

        for i, tc in enumerate(test_cases):
            args = tc['args']
            expected = tc['expected']
            
            # Capture stdout
            import io
            from contextlib import redirect_stdout
            f = io.StringIO()
            with redirect_stdout(f):
                try:
                    call_args = args if isinstance(args, list) or isinstance(args, tuple) else [args]
                    result = method(*call_args)
                    
                    # Robust Comparison Logic
                    passed = False
                    
                    # 1. List/Tuple Comparison (Order Independent for Two Sum, strict for others?)
                    # For now, we assume verify order matters usually, but for Two Sum it doesn't.
                    # Heuristic: If it's a list of numbers, try sorted comparison if direct fails
                    if isinstance(expected, list) and isinstance(result, (list, tuple)):
                        if result == expected:
                            passed = True
                        else:
                            # Try sorted comparison (for Two Sum etc)
                            try:
                                passed = sorted(list(result)) == sorted(expected)
                            except:
                                passed = False
                    else:
                        passed = result == expected
                    
                    results.append({
                        "id": i,
                        "args": str(args),
                        "expected": str(expected),
                        "actual": str(result),
                        "passed": passed,
                        "stdout": f.getvalue()
                    })
                except Exception as e:
                    results.append({
                        "id": i,
                        "args": str(args),
                        "expected": str(expected),
                        "actual": "Error",
                        "error": str(e),
                        "passed": False,
                        "stdout": f.getvalue()
                    })

        print("JSON_START")
        print(json.dumps(results))
        print("JSON_END")

    except Exception as e:
        print(f"Driver Error: {e}")
`;
                    finalCode = `${imports}\n__user_code__ = """\n${code}\n"""\n${driverCode}`;
                } else {
                    // If no structured test cases, just run the code with imports
                    finalCode = `${imports}\n${code}`;
                }
            } else if (language === 'cpp') {
                finalCode = `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <map>\n#include <set>\n#include <unordered_map>\n#include <unordered_set>\n#include <queue>\n#include <stack>\nusing namespace std;\n${code}`;
            } else if (language === 'java') {
                finalCode = `import java.util.*;\nimport java.io.*;\n${code}`;
            } else {
                // Default for other languages, no special imports or test runner
                finalCode = code;
            }

            const response = await axios.post('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
                source_code: finalCode,
                language_id: JUDGE0_IDS[language],
                stdin: "",
            });

            const result = response.data;

            if (result.stdout) {
                const outputStr = result.stdout;

                // Check for JSON output (Test Runner Mode)
                if (outputStr.includes("JSON_START") && outputStr.includes("JSON_END")) {
                    try {
                        const jsonPart = outputStr.split("JSON_START")[1].split("JSON_END")[0];
                        const parsedResults = JSON.parse(jsonPart);
                        setTestResults(parsedResults);

                        // Strict Success Check
                        const allPassed = parsedResults.every(r => r.passed);
                        if (allPassed) {
                            playSuccess();
                            setShowConfetti(true);
                            setTimeout(() => setShowConfetti(false), 5000);

                            // Persist solved problem to backend
                            if (activeProblem) {
                                try {
                                    await api.post('/coding/solved', {
                                        problemId: activeProblem.id,
                                        title: activeProblem.title,
                                        difficulty: activeProblem.difficulty,
                                        language: language
                                    });
                                    setSolvedIds(prev => new Set([...prev, activeProblem.id]));
                                } catch (err) {
                                    console.log('Could not save solved status:', err.message);
                                }
                            }
                        } else {
                            playError(); // Fail sound if specific tests failed
                        }
                    } catch (e) {
                        console.error("Test Results Parse Error:", e);
                        setOutput(`Error parsing results: ${e.message}\n${outputStr}`);
                        playError();
                    }
                } else {
                    // Standard Execution Mode (No test cases or non-Python)
                    setOutput(outputStr);

                    // Simple Success Heuristic
                    if (!result.stderr && !result.compile_output && outputStr.trim().length > 0) {
                        // Only play success if it looks like a clean run
                        playSuccess();
                    } else {
                        playError();
                    }
                }

            } else if (result.stderr) {
                playError();
                setOutput(`Runtime Error:\n${result.stderr}`);
            } else if (result.compile_output) {
                playError();
                setOutput(`Compilation Error:\n${result.compile_output}`);
            } else if (result.message) {
                playError();
                setOutput(`Error: ${result.message}`);
            } else {
                setOutput(`Program executed successfully. No output.`);
            }

        } catch (error) {
            playError();
            console.error("Execution Error:", error);
            setOutput("Failed to execute code. Judge0 API might be down or rate-limited.");
        } finally {
            setIsRunning(false);
        }
    };

    // Fullscreen Logic
    const toggleFullscreen = () => {
        playClick();
        if (!document.fullscreenElement) {
            if (containerRef.current) {
                containerRef.current.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Listen for fullscreen change (e.g. user presses ESC)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // --- RENDER HELPERS ---

    // Compute total problems and solved count for stats
    const totalProblems = roadmap.reduce((acc, topic) => acc + topic.problems.length, 0);
    const solvedCount = roadmap.reduce((acc, topic) => acc + topic.problems.filter(p => solvedIds.has(p.id)).length, 0);
    const solvedPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    // Filter roadmap by category and difficulty
    let filteredRoadmap = categoryFilter === 'all'
        ? roadmap
        : roadmap.filter(topic => topic.category === categoryFilter);

    if (difficultyFilter !== 'All') {
        filteredRoadmap = filteredRoadmap.map(topic => ({
            ...topic,
            problems: topic.problems.filter(p => p.difficulty === difficultyFilter)
        })).filter(topic => topic.problems.length > 0);
    }

    const renderRoadmap = () => (
        <div className="max-w-7xl mx-auto w-full p-6 animate-fadeIn">
            <div className="mb-6 text-center pt-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400 mb-2">Coding Arena</h1>
                <p className="text-gray-400">Master Data Structures & Algorithms — {totalProblems} Problems</p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 justify-center flex-wrap">
                <button onClick={() => setCategoryFilter('all')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${categoryFilter === 'all' ? 'bg-gray-700 text-white border border-gray-600' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}>
                    📋 All Topics
                </button>
                {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${categoryFilter === cat.id ? `bg-${cat.color}-500/20 text-${cat.color}-400 border border-${cat.color}-500/30` : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Stats Bar */}
            <div className="bg-[#111] rounded-xl border border-gray-800 p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary-400" />
                        <span className="text-sm font-bold text-gray-200">{solvedCount}/{totalProblems}</span>
                        <span className="text-xs text-gray-500">solved</span>
                    </div>
                    <div className="w-48 bg-gray-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2 rounded-full transition-all duration-700" style={{ width: `${solvedPercent}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{solvedPercent}%</span>
                </div>

                {/* Difficulty Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-gray-500" />
                    {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                        <button key={d} onClick={() => setDifficultyFilter(d)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${difficultyFilter === d
                                ? d === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : d === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : d === 'Hard' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                            : 'bg-gray-700 text-white border border-gray-600'
                                : 'text-gray-500 hover:text-gray-300 border border-transparent'
                                }`}>{d}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoadmap.map((topic) => (
                    <div key={topic.id} className="bg-[#111] rounded-2xl border border-gray-800 p-5 hover:border-primary-500/30 transition-all hover:shadow-2xl group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-200 flex items-center">
                                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                                {topic.title}
                            </h3>
                            <span className="text-[10px] text-gray-600">{topic.problems.filter(p => solvedIds.has(p.id)).length}/{topic.problems.length}</span>
                        </div>
                        <div className="space-y-2">
                            {topic.problems.map((prob) => (
                                <button
                                    key={prob.id}
                                    onClick={() => handleProblemSelect(prob)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all flex items-center justify-between group/btn ${solvedIds.has(prob.id)
                                        ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
                                        : 'bg-black/40 hover:bg-gray-800 border-gray-800/50 hover:border-gray-700'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {solvedIds.has(prob.id) && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                                        <span className={`${solvedIds.has(prob.id) ? 'text-emerald-300' : 'text-gray-400'} group-hover/btn:text-white transition-colors`}>{prob.title}</span>
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${prob.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' :
                                        prob.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                                        }`}>
                                        {prob.difficulty}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderWorkspace = () => (
        <div className={`flex flex-col h-full ${isFullscreen ? 'p-4' : 'p-0'}`}>
            {showConfetti && <Confetti recycle={false} numberOfPieces={500} colors={['#10B981', '#3B82F6', '#8B5CF6']} />}

            {/* Header / Nav */}
            <div className="flex items-center justify-between bg-[#111] border border-gray-800 rounded-xl p-3 mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => { playClick(); setView('roadmap'); }} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center">
                        <h2 className="font-bold text-gray-200 mr-3">{activeProblem?.title}</h2>
                        <span className={`text-[10px] px-2 py-1 rounded border uppercase font-bold ${activeProblem?.difficulty === 'Easy' ? 'border-emerald-500/20 text-emerald-400' :
                            activeProblem?.difficulty === 'Medium' ? 'border-amber-500/20 text-amber-400' : 'border-rose-500/20 text-rose-400'
                            }`}>{activeProblem?.difficulty}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={language}
                        onChange={(e) => {
                            playClick();
                            setLanguage(e.target.value);
                            if (activeProblem && activeProblem.starterCode) {
                                setCode(activeProblem.starterCode[e.target.value] || code);
                            }
                        }}
                        className="bg-black border border-gray-700 rounded-lg text-xs py-2 px-3 text-gray-300 focus:border-primary-500 outline-none"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.icon} {lang.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={runCode}
                        disabled={isRunning || !activeProblem}
                        className={`flex items-center px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isRunning ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                        Run Code
                    </button>

                    <button onClick={toggleFullscreen} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Main Split View */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Left Panel: Problem & Results */}
                <div className="w-1/2 flex flex-col bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-800">
                        <button
                            onClick={() => { playClick(); setActiveTab('problem'); }}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'problem' ? 'text-primary-400 border-b-2 border-primary-500 bg-gray-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => { playClick(); setActiveTab('results'); }}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'results' ? 'text-primary-400 border-b-2 border-primary-500 bg-gray-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Test Results
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
                        {activeTab === 'problem' ? (
                            isLoadingProblem ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <div className="relative">
                                        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-primary-500 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="mt-4 font-mono text-xs text-primary-400 animate-pulse">GENERATING CHALLENGE...</p>
                                </div>
                            ) : (
                                <div className="animate-fadeIn">
                                    <div className="prose prose-invert prose-sm max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: problemDetails[activeProblem.id]?.description || simulatedDesc }} />
                                    {/* Examples */}
                                    {problemDetails[activeProblem.id]?.examples && (
                                        <div className="mt-8 space-y-4">
                                            {problemDetails[activeProblem.id].examples.map((ex, idx) => (
                                                <div key={idx} className="bg-black/30 p-4 rounded-xl border border-gray-800">
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Example {idx + 1}</div>
                                                    <div className="space-y-1 font-mono text-xs">
                                                        <div><span className="text-gray-500">Input:</span> <span className="text-gray-200">{ex.input}</span></div>
                                                        <div><span className="text-gray-500">Output:</span> <span className="text-gray-200">{ex.output}</span></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Approach Hints */}
                                    {activeProblem?.approach && (
                                        <div className="mt-6 border-t border-gray-800 pt-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                                                    <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                                                    Approach
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    {activeProblem.approach.pattern && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">{activeProblem.approach.pattern}</span>
                                                    )}
                                                    <button onClick={() => setShowHintLevel(prev => Math.min(prev + 1, 3))}
                                                        className="text-[10px] font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                                                        {showHintLevel < 3 ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                        {showHintLevel === 0 ? 'Show Hint' : showHintLevel === 1 ? 'More Hint' : showHintLevel === 2 ? 'Show Solution' : 'All Revealed'}
                                                    </button>
                                                </div>
                                            </div>

                                            {showHintLevel >= 1 && (
                                                <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3 mb-2 animate-fadeIn">
                                                    <p className="text-xs text-yellow-300/80"><span className="font-bold text-yellow-400">💡 Hint 1:</span> {activeProblem.approach.hint1}</p>
                                                </div>
                                            )}
                                            {showHintLevel >= 2 && (
                                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 mb-2 animate-fadeIn">
                                                    <p className="text-xs text-blue-300/80"><span className="font-bold text-blue-400">💡 Hint 2:</span> {activeProblem.approach.hint2}</p>
                                                </div>
                                            )}
                                            {showHintLevel >= 3 && (
                                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 mb-2 animate-fadeIn">
                                                    <p className="text-xs text-emerald-300/80"><span className="font-bold text-emerald-400">✅ Solution:</span> {activeProblem.approach.solution}</p>
                                                    <div className="flex gap-4 mt-2">
                                                        <span className="text-[10px] text-gray-500"><Clock className="w-3 h-3 inline mr-1" />Time: {activeProblem.approach.timeComplexity}</span>
                                                        <span className="text-[10px] text-gray-500">Space: {activeProblem.approach.spaceComplexity}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            <div className="h-full flex flex-col animate-fadeIn">
                                {testResults ? (
                                    <div className="flex flex-col h-full">
                                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                            {testResults.map((result, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => { playClick(); setActiveTestCase(idx); }}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTestCase === idx
                                                        ? 'bg-gray-800 text-white border border-gray-700'
                                                        : 'bg-transparent text-gray-500 border border-transparent hover:bg-gray-900'
                                                        }`}
                                                >
                                                    Case {idx + 1}
                                                    {result.passed ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="bg-black/40 rounded-xl p-6 border border-gray-800 font-mono text-sm space-y-4">
                                            <div>
                                                <div className="text-gray-500 text-xs uppercase mb-1">Input</div>
                                                <div className="bg-gray-900 p-3 rounded-lg text-gray-300">{testResults[activeTestCase].args}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-xs uppercase mb-1">Expected Output</div>
                                                <div className="bg-gray-900 p-3 rounded-lg text-gray-300">{testResults[activeTestCase].expected}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-xs uppercase mb-1">Your Output</div>
                                                <div className={`p-3 rounded-lg ${testResults[activeTestCase].passed ? 'bg-emerald-900/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-900/10 text-rose-400 border border-rose-500/20'}`}>
                                                    {testResults[activeTestCase].actual}
                                                </div>
                                            </div>
                                            {(testResults[activeTestCase].stdout && testResults[activeTestCase].stdout.trim()) && (
                                                <div>
                                                    <div className="text-gray-500 text-xs uppercase mb-1">Stdout</div>
                                                    <div className="bg-gray-900 p-3 rounded-lg text-gray-500 text-xs">{testResults[activeTestCase].stdout}</div>
                                                </div>
                                            )}
                                            {testResults[activeTestCase].error && (
                                                <div>
                                                    <div className="text-gray-500 text-xs uppercase mb-1">Error</div>
                                                    <div className="bg-rose-900/10 p-3 rounded-lg text-rose-400 text-xs">{testResults[activeTestCase].error}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : output ? (
                                    <div className="p-4 bg-rose-900/10 border border-rose-500/20 rounded-xl text-rose-400 font-mono text-xs whitespace-pre-wrap">
                                        {output}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                        <Play className="w-12 h-12 mb-4 opacity-20" />
                                        <p>Run your code to see results</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Editor */}
                <div className="w-1/2 bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden shadow-2xl relative">
                    <Editor
                        height="100%"
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'Fira Code', 'Consolas', monospace",
                            padding: { top: 20 },
                            wordWrap: 'on',
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div
            ref={containerRef}
            className={`transition-all duration-300 bg-[#0a0a0a] min-h-screen ${isFullscreen ? 'fixed inset-0 z-[9999]' : ''}`}
        >
            {view === 'roadmap' ? renderRoadmap() : renderWorkspace()}
        </div>
    );
};

export default CodingArena;
