import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Package, Download, Upload, Store, ShoppingCart, BarChart3, LogOut, Menu, X, Wallet } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Navigation({ auth, currentRoute }) {
    const { t } = useLaravelReactI18n();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { post } = useForm();

    // Check system preference and localStorage on component mount
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        // Check if user has saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            if (document.documentElement) {
                document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            }
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
            if (document.documentElement) {
                document.documentElement.classList.toggle('dark', prefersDark);
            }
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        // Update document class
        if (document.documentElement) {
            document.documentElement.classList.toggle('dark', newMode);
        }

        // Save preference to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
        }
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
            label: t('Move to Shop'),
            route: 'warehouse.sales',
            icon: Store,
            routeKey: 'warehouse.sales',
            permission:'warehouse.view_sales'
        },
        {
            label: t('Import'),
            route: 'warehouse.income',
            icon: Download,
            routeKey: 'warehouse.income',
            permission:'warehouse.view_income'
        },
        {
            label: t('Export'),
            route: 'warehouse.outcome',
            icon: Upload,
            routeKey: 'warehouse.outcome',
            permission:'warehouse.view_outcome'
        },
        {
            label: t('Wallet'),
            route: 'warehouse.wallet',
            icon: Wallet,
            routeKey: 'warehouse.wallet',
            permission:'warehouse.view_wallet'
        }
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 xl:w-72
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex-shrink-0 bg-gradient-to-b from-white via-white to-slate-50/50
                dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/50
                shadow-2xl border-r border-slate-200/50 dark:border-slate-700/50
                backdrop-blur-xl
            `}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 lg:p-5 xl:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white p-3 rounded-2xl shadow-xl ring-4 ring-emerald-100 dark:ring-emerald-900/40 transform hover:scale-105 transition-transform duration-200">
                                <ShoppingCart className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-xl xl:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                                    {t('Store')}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {t('Management System')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 p-4 lg:p-3 xl:p-4 space-y-1">
                        {navigationItems
                        .filter(item=>{
                            if(!item.permission)return true;
                            
                                            // Check if user has the required permission
                                            const hasPermission = auth.user.permissions?.includes(item.permission);
                                            return hasPermission;
                        })
                        
                        .map((item) => {
                            const IconComponent = item.icon;
                            const isActive = currentRoute === item.routeKey;

                            return (
                                <Link
                                    key={item.routeKey}
                                    href={route(item.route)}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start h-12 lg:h-11 xl:h-12 px-4 lg:px-3 xl:px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                                            isActive
                                                ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-200/50 dark:shadow-emerald-900/30 hover:from-emerald-600 hover:to-teal-700 ring-2 ring-emerald-300/50 dark:ring-emerald-700/50'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950/50 dark:hover:to-teal-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 hover:shadow-lg'
                                        }`}
                                        type="button"
                                    >
                                        <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                                        <span className="font-semibold text-sm lg:text-xs xl:text-sm">{item.label}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Section */}
                    <div className="p-4 lg:p-3 xl:p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-700/30">
                        {/* Logout Button */}
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start h-12 lg:h-11 xl:h-12 px-4 lg:px-3 xl:px-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/50 dark:hover:to-pink-950/50 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                            type="button"
                        >
                            <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
                            <span className="font-semibold text-sm lg:text-xs xl:text-sm">{t('Logout')}</span>
                        </Button>

                        {/* User Profile */}
                        <div className="flex items-center space-x-3 p-4 lg:p-3 xl:p-4 rounded-2xl bg-gradient-to-r from-white to-slate-50/80 dark:from-slate-800 dark:to-slate-700/80 shadow-lg border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
                            <Avatar className="border-3 border-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-600 dark:to-teal-600 w-12 h-12 shadow-lg">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=10b981&color=fff`} />
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-bold">
                                    {auth.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm lg:text-xs xl:text-sm font-bold text-slate-800 dark:text-white truncate">
                                    {auth.user.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {t('Store Staff')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
