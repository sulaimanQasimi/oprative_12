import React, { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import {
    Package,
    ShoppingCart,
    Plus,
    BarChart3,
    CreditCard,
    FileText,
    LogOut,
    Settings,
    User,
    HelpCircle,
    Moon,
    Sun,
    Home,
    PackageCheck,
    PackageX,
    Download,
    Upload,
    Truck,
    Warehouse,
    Receipt,
    DollarSign,
    TrendingUp,
    Database,
    Wallet
} from 'lucide-react';

export default function CustomerNavbar({ auth, currentRoute }) {
    const { t } = useLaravelReactI18n();
    const [isDarkMode, setIsDarkMode] = useState(false);
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
        post(route('customer.logout'));
    };

    // Helper function to safely access routes
    const safeRoute = (routeName) => {
        try {
            return route(routeName);
        } catch (error) {
            console.error(`Route not found: ${routeName}`);
            return '#'; // Fallback URL
        }
    };

    return (
        <div className="w-20 flex-shrink-0 bg-white shadow-lg z-10">
            <div className="h-full flex flex-col items-center justify-between py-6">
                <div className="flex flex-col items-center space-y-6">
                    {/* Logo */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
                        <Warehouse className="h-6 w-6" />
                    </div>
                    
                    <nav className="flex flex-col items-center space-y-3">
                        {/* Dashboard */}
                        <Link href={safeRoute('customer.dashboard')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.dashboard' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20 shadow-md' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <Home className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Dashboard')}
                            </div>
                        </Link>

                        {/* Stock */}
                        <Link href={safeRoute('customer.stock-products')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.stock-products' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20 shadow-md' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <Database className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Stock')}
                            </div>
                        </Link>

                        {/* Import */}
                        <Link href={safeRoute('customer.stock-incomes.index')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.stock-incomes.index' ?
                                    'text-green-600 bg-green-100 dark:bg-green-900/20 shadow-md' :
                                    'text-gray-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'}`}
                                type="button"
                            >
                                <Download className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Import')}
                            </div>
                        </Link>

                        {/* Export */}
                        <Link href={safeRoute('customer.stock-outcomes.index')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.stock-outcomes.index' ?
                                    'text-orange-600 bg-orange-100 dark:bg-orange-900/20 shadow-md' :
                                    'text-gray-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20'}`}
                                type="button"
                            >
                                <Upload className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Export')}
                            </div>
                        </Link>

                        {/* Orders */}
                        <Link href={safeRoute('customer.orders')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.orders' ?
                                    'text-blue-600 bg-blue-100 dark:bg-blue-900/20 shadow-md' :
                                    'text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20'}`}
                                type="button"
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Orders')}
                            </div>
                        </Link>

                        {/* New Order */}
                        <Link href={safeRoute('customer.create_orders')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.create_orders' ?
                                    'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 shadow-md' :
                                    'text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/20'}`}
                                type="button"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('New Order')}
                            </div>
                        </Link>

                        {/* Received from Warehouse */}
                        <Link href={safeRoute('customer.sales.index')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.sales.index' ?
                                    'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 shadow-md' :
                                    'text-gray-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'}`}
                                type="button"
                            >
                                <Truck className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Received from Warehouse')}
                            </div>
                        </Link>

                        {/* Wallet */}
                        <Link href={safeRoute('customer.wallet')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.wallet' || currentRoute === 'customer.wallet.deposit' || currentRoute === 'customer.wallet.withdraw' ?
                                    'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 shadow-md' :
                                    'text-gray-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'}`}
                                type="button"
                            >
                                <Wallet className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Wallet')}
                            </div>
                        </Link>

                        {/* Accounts */}
                        <Link href={safeRoute('customer.accounts.index')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.accounts.index' ?
                                    'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 shadow-md' :
                                    'text-gray-500 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'}`}
                                type="button"
                            >
                                <DollarSign className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Accounts')}
                            </div>
                        </Link>

                        {/* Reports */}
                        <Link href={safeRoute('customer.reports')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.reports' ?
                                    'text-red-600 bg-red-100 dark:bg-red-900/20 shadow-md' :
                                    'text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'}`}
                                type="button"
                            >
                                <TrendingUp className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Reports')}
                            </div>
                        </Link>

                        {/* Profile */}
                        <Link href={safeRoute('customer.profile.show')} className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.profile.show' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20 shadow-md' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Profile')}
                            </div>
                        </Link>

                        {/* Logout Button */}
                        <div className="group relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
                                type="button"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('Logout')}
                            </div>
                        </div>
                    </nav>
                </div>
                
                {/* User Avatar */}
                <div className="flex flex-col items-center space-y-3">
                    <Avatar className="border-2 border-purple-200 dark:border-purple-900/40 shadow-md">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=8b5cf6&color=fff`} />
                        <AvatarFallback className="bg-purple-600 text-white">{auth.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    {/* Dark Mode Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDarkMode}
                        className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-200"
                        type="button"
                        title={isDarkMode ? t('Light Mode') : t('Dark Mode')}
                    >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
