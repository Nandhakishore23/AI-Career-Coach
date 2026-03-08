import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi there! I'm your AI Career Coach. How can I help you today?", isBot: true }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const AI_SERVICE_URL = "http://127.0.0.1:5002"; // Adjust if your AI service runs on a different port

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userText = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { text: userText, isBot: false }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${AI_SERVICE_URL}/chat/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userText, context: messages.slice(-5) })
            });

            if (!response.ok) {
                throw new Error("Failed to communicate with AI");
            }

            const data = await response.json();
            setMessages(prev => [...prev, { text: data.response || "I'm sorry, I couldn't generate a response.", isBot: true }]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, { text: "Connection error. Please ensure the AI service is running.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chatbot Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 rounded-full bg-cyan-600 text-white shadow-lg hover:bg-cyan-500 hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
                aria-label="Open AI Assistant"
            >
                <MessageSquare className="w-6 h-6" />
            </button>

            {/* Chatbot Window */}
            <div
                className={`fixed bottom-6 right-6 w-80 md:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
                style={{ height: '500px', maxHeight: '80vh' }}
            >
                {/* Header */}
                <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Bot className="w-5 h-5" />
                        <h3 className="font-bold text-gray-100">AI Career Coach</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-900/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isBot ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-300'}`}>
                                {msg.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm leading-relaxed ${msg.isBot ? 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700/50' : 'bg-cyan-600 text-white rounded-tr-none shadow-md'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="px-4 py-3 bg-gray-800 rounded-2xl rounded-tl-none border border-gray-700/50 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                                <span className="text-xs text-gray-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 shrink-0">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="absolute right-2 p-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Chatbot;
