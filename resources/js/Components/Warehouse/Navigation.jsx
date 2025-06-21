import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Package, TrendingUp, Settings, Sun, Moon, ShoppingCart, BarChart3, LogOut, FileText, User } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Navigation({ auth, currentRoute }) {
    const { t } = useLaravelReactI18n();
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

    const navigationItems = [
        {
            label: t('Dashboard'),
            route: 'warehouse.dashboard',
            icon: BarChart3,
            routeKey: 'warehouse.dashboard'
        },
        {
            label: t('Products'),
            route: 'warehouse.products',
            icon: Package,
            routeKey: 'warehouse.products'
        },
        {
            label: t('Sales'),
            route: 'warehouse.sales',
            icon: ShoppingCart,
            routeKey: 'warehouse.sales'
        },
        {
            label: t('Income'),
            route: 'warehouse.income',
            icon: TrendingUp,
            routeKey: 'warehouse.income'
        },
        {
            label: t('Outcome'),
            route: 'warehouse.outcome',
            icon: TrendingUp,
            routeKey: 'warehouse.outcome',
            iconProps: { className: "h-5 w-5 rotate-180" }
        },
        {
            label: t('Reports'),
            route: 'warehouse.reports',
            icon: FileText,
            routeKey: 'warehouse.reports'
        },
        {
            label: t('Settings'),
            route: 'warehouse.profile.edit',
            icon: Settings,
            routeKey: 'warehouse.profile.edit'
        }
    ];

    return (
        <div className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700 z-10">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-3 rounded-xl shadow-lg">
                            <ShoppingCart className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {t('Store')}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t('Management System')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = currentRoute === item.routeKey;
                        
                        return (
                            <Link key={item.routeKey} href={route(item.route)}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start h-12 px-4 transition-all duration-200 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:from-emerald-600 hover:to-teal-700'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400'
                                    }`}
                                    type="button"
                                >
                                    <IconComponent 
                                        className={`h-5 w-5 mr-3 ${item.iconProps?.className || ''}`}
                                    />
                                    <span className="font-medium">{item.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    {/* Dark Mode Toggle */}
                 
                    {/* Logout Button */}
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start h-12 px-4 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                        type="button"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="font-medium">{t('Logout')}</span>
                    </Button>

                    {/* User Profile */}
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 mt-4">
                        <Avatar className="border-2 border-emerald-200 dark:border-emerald-900/40 w-10 h-10">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=10b981&color=fff`} />
                            <AvatarFallback className="bg-emerald-600 text-white text-sm">
                                {auth.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t('Store Staff')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
