import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Layout, BookOpen, Mic, FileText, Briefcase,
    Menu, X, Terminal, User, Award, BarChart3
} from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { path: '/dashboard/home', label: 'Dashboard', icon: BarChart3 },
        { path: '/dashboard/roadmap', label: 'My Roadmap', icon: Layout },
        { path: '/dashboard/assessment', label: 'Skill Assessment', icon: Award },
        { path: '/dashboard/coding', label: 'Coding Arena', icon: Terminal },
        { path: '/dashboard/profile', label: 'My Profile', icon: User },
        { path: '/dashboard/interviews', label: 'Mock Interviews', icon: Mic },
        { path: '/dashboard/resume', label: 'Resume Builder', icon: FileText },
        { path: '/jobs', label: 'Job Portal', icon: Briefcase, external: true },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500 font-sans selection:bg-primary-500/30">
            <Navbar />

            {/* Background Gradient Blob */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20"></div>
            </div>

            <div className="flex pt-16 relative z-10 h-[calc(100vh-4rem)]">
                {/* Desktop Premium Sidebar */}
                <aside className="hidden md:flex flex-col w-72 bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 fixed h-full transition-all duration-300">
                    <div className="px-6 py-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">
                            Main Menu
                        </h3>
                        <nav className="space-y-1.5">
                            {navItems.map((item) => (
                                item.external ? (
                                    <a
                                        key={item.path}
                                        href="https://genhire.vercel.app/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-200"
                                    >
                                        <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                                        {item.label}
                                        <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                    </a>
                                ) : (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
                                                ? 'text-primary-600 dark:text-white bg-primary-50/80 dark:bg-primary-500/10 shadow-sm border border-primary-100/50 dark:border-primary-500/20'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"></div>
                                                )}
                                                <item.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${isActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                    }`} />
                                                {item.label}
                                            </>
                                        )}
                                    </NavLink>
                                )
                            ))}
                        </nav>
                    </div>

                    {/* Sidebar Footer removed as requested */}
                </aside>

                {/* Mobile Menu Button */}
                <div className="md:hidden fixed bottom-6 right-6 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-4 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:scale-105 transition-all active:scale-95"
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <div
                            onClick={e => e.stopPropagation()}
                            className="absolute bottom-20 right-6 w-72 bg-white dark:bg-dark-card rounded-3xl shadow-2xl p-3 space-y-1 border border-gray-100 dark:border-gray-800 animate-slideUp"
                        >
                            {navItems.map((item) => (
                                !item.external ? (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-3.5 rounded-2xl transition-all ${isActive
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`
                                        }
                                    >
                                        <item.icon className={`mr-3 h-5 w-5 ${item.isActive ? 'text-white' : ''}`} />
                                        {item.label}
                                    </NavLink>
                                ) : (
                                    <a
                                        key={item.path}
                                        href="https://genhire.vercel.app/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center px-4 py-3.5 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </a>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Area - Fluid Layout (Full Width) */}
                <main className="flex-1 md:ml-72 p-6 md:p-8 overflow-y-auto h-full scrollbar-hidden">
                    <div className="w-full h-full pb-20 animate-fadeIn">
                        <Outlet />
                    </div>
                </main>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                /* Hide scrollbar for clean look */
                .scrollbar-hidden::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hidden {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
