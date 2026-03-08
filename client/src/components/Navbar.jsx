import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Rocket } from 'lucide-react';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Check if logged in
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const navLinks = isAuthenticated
        ? [
            { name: 'Dashboard', path: '/dashboard' },
        ]
        : [
            { name: 'Home', path: '/' },
            { name: 'Login', path: '/login' },
            { name: 'Get Started', path: '/signup', primary: true },
        ];

    return (
        <nav className="fixed w-full z-50 top-4 px-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/70 dark:bg-black/60 border border-white/20 dark:border-white/10 rounded-2xl shadow-lg">
                <div className="flex flex-wrap items-center justify-between p-4 mix-blend-normal">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <span className="self-center text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
                            Interview<span className="text-cyan-500">Coach</span>
                        </span>
                    </Link>

                    <div className="flex md:order-2 space-x-2 md:space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
                        >
                            <div className="relative w-5 h-5">
                                <Sun className={`absolute inset-0 w-5 h-5 text-yellow-400 transition-all ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                                <Moon className={`absolute inset-0 w-5 h-5 text-gray-600 transition-all ${theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
                            </div>
                        </button>

                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="hidden md:block text-sm font-medium text-red-500 hover:text-red-400 px-4 transition-colors"
                            >
                                Logout
                            </button>
                        )}

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`}>
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={`block py-2 px-3 rounded md:p-0 transition-all duration-200 ${link.primary
                                            ? 'text-white bg-gray-900 dark:bg-white dark:text-black px-5 py-2 rounded-full font-bold hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:-translate-y-0.5'
                                            : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white relative group'
                                            }`}
                                    >
                                        {link.name}
                                        {!link.primary && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full"></span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
