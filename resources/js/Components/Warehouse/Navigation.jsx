import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Package, TrendingUp, Settings, Sun, Moon, ShoppingCart, BarChart3, LogOut, FileText } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';

export default function Navigation({ auth, currentRoute }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { post } = useForm();

    // Check system preference and localStorage on component mount
    useEffect(() => {
        // Check if user has saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
            document.documentElement.classList.toggle('dark', prefersDark);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        // Update document class
        document.documentElement.classList.toggle('dark', newMode);

        // Save preference to localStorage
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const handleLogout = () => {
        post(route('warehouse.logout'));
    };

    return (
        <div className="w-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg z-10">
            <div className="h-full flex flex-col items-center justify-between py-6">
                <div className="flex flex-col items-center space-y-8">
                    <div className="bg-purple-600 text-white p-2 rounded-xl">
                        <Package className="h-6 w-6" />
                    </div>
                    <nav className="flex flex-col items-center space-y-8">
                        <Link href={route('warehouse.dashboard')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'warehouse.dashboard' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <BarChart3 className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={route('warehouse.products')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'warehouse.products' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <Package className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={route('warehouse.sales')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'warehouse.sales' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={route('warehouse.income')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'warehouse.income' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <TrendingUp className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={route('warehouse.outcome')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'warehouse.outcome' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <TrendingUp className="h-5 w-5 rotate-180" />
                            </Button>
                        </Link>

                        <Link href={route('warehouse.reports')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'warehouse.reports' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <FileText className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={route('warehouse.profile.edit')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'warehouse.profile.edit' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>
                        </Link>

                        {/* Dark Mode Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-200"
                            type="button"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5 text-amber-400" />
                            ) : (
                                <Moon className="h-5 w-5 text-slate-700" />
                            )}
                        </Button>

                        {/* Logout Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
                            type="button"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </nav>
                </div>
                <Avatar className="border-2 border-purple-200 dark:border-purple-900/40">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=8b5cf6&color=fff`} />
                    <AvatarFallback className="bg-purple-600 text-white">{auth.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
