import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Rocket } from 'lucide-react';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Check if logged in based on token existence (simple check for UI)
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
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-800 glass">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
                    <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-500 transition-colors">
                        <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <span className="self-center text-2xl font-bold whitespace-nowrap font-display tracking-tight text-gray-900 dark:text-white">
                        Interview<span className="text-primary-600 dark:text-primary-400">Coach</span>
                    </span>
                </Link>

                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="mr-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all duration-300 transform active:scale-95"
                        aria-label="Toggle Dark Mode"
                    >
                        <div className="relative w-5 h-5">
                            <Sun className={`absolute inset-0 w-5 h-5 text-yellow-400 fill-current transition-all duration-500 transform ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'}`} />
                            <Moon className={`absolute inset-0 w-5 h-5 text-gray-600 transition-all duration-500 transform ${theme === 'light' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0'}`} />
                        </div>
                    </button>

                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 transition-colors ml-2 hidden md:block"
                        >
                            Logout
                        </button>
                    )}

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`}
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`block py-2 px-3 rounded md:p-0 transition-colors duration-200 ${link.primary
                                        ? 'text-white bg-primary-600 md:bg-transparent md:text-primary-600 md:dark:text-primary-500 md:border md:border-primary-600 md:dark:border-primary-500 md:px-4 md:py-1.5 md:rounded-full md:hover:bg-primary-600 md:hover:text-white md:dark:hover:bg-primary-500 md:dark:hover:text-white'
                                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-600 md:dark:hover:text-primary-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                                        }`}
                                    aria-current={location.pathname === link.path ? 'page' : undefined}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        {isAuthenticated && (
                            <li className="md:hidden mt-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block py-2 px-3 text-red-600 rounded hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
