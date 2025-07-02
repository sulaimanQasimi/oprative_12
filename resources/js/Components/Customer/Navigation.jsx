import React, { useEffect, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
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
    Store,
    Receipt,
    DollarSign,
    TrendingUp,
    Database,
    ClipboardList
} from 'lucide-react';

export default function Navigation({ user }) {
    const { t } = useLaravelReactI18n();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { post } = useForm();
    const { url } = usePage();

    // Determine current route based on URL
    const getCurrentRoute = () => {
        const path = url.split('?')[0]; // Remove query parameters

        if (path.endsWith('/dashboard')) return 'customer.dashboard';
        if (path.endsWith('/profile')) return 'customer.profile.show';
        if (path.endsWith('/stock-products')) return 'customer.stock-products';
        if (path.endsWith('/stock-incomes')) return 'customer.stock-incomes.index';
        if (path.endsWith('/stock-outcomes')) return 'customer.stock-outcomes.index';
        if (path.endsWith('/orders')) return 'customer.orders';
        if (path.endsWith('/create-orders')) return 'customer.create_orders';
        if (path.endsWith('/sales')) return 'customer.sales.index';
        if (path.endsWith('/accounts')) return 'customer.accounts.index';
        if (path.includes('/reports/account/')) return 'customer.reports.account-statement';
        if (path.endsWith('/reports')) return 'customer.reports';

        // For more specific routes
        if (path.includes('/stock-incomes/create')) return 'customer.stock-incomes.create';
        if (path.includes('/stock-incomes/')) return 'customer.stock-incomes.show';
        if (path.includes('/stock-outcomes/')) return 'customer.stock-outcomes.show';
        if (path.includes('/accounts/create')) return 'customer.accounts.create';
        if (path.includes('/accounts/')) return 'customer.accounts.show';
        if (path.includes('/sales/')) return 'customer.sales.show';

        return '';
    };

    const currentRoute = getCurrentRoute();

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
        <div className="w-20 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg z-10">
            <div className="h-full flex flex-col items-center justify-between py-6">
                <div className="flex flex-col items-center space-y-8">
                    {/* Logo */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
                        <Store className="h-6 w-6" />
                    </div>
                    
                    <nav className="flex flex-col items-center space-y-6">
                        {/* Dashboard */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.dashboard')}>
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
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Dashboard')}
                            </span>
                        </div>

                        {/* Stock */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.stock-products')}>
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
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Stock')}
                            </span>
                        </div>

                        {/* Import */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.stock-incomes.index')}>
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
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Import')}
                            </span>
                        </div>

                        {/* Export */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.stock-outcomes.index')}>
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
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Export')}
                            </span>
                        </div>

                        {/* Orders */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.orders')}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`${currentRoute === 'customer.orders' ?
                                        'text-blue-600 bg-blue-100 dark:bg-blue-900/20 shadow-md' :
                                        'text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20'}`}
                                    type="button"
                                >
                                    <ClipboardList className="h-5 w-5" />
                                </Button>
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Orders')}
                            </span>
                        </div>

                        {/* New Order */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.create_orders')}>
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
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('New Order')}
                            </span>
                        </div>

                        {/* Received from Warehouse */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.sales.index')}>
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
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                {t('Received from')}<br/>{t('Warehouse')}
                            </span>
                        </div>

                        {/* Accounts */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.accounts.index')}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`${currentRoute === 'customer.accounts.index' ?
                                        'text-amber-600 bg-amber-100 dark:bg-amber-900/20 shadow-md' :
                                        'text-gray-500 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/20'}`}
                                    type="button"
                                >
                                    <DollarSign className="h-5 w-5" />
                                </Button>
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Accounts')}
                            </span>
                        </div>

                        {/* Reports */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.reports')}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`${currentRoute === 'customer.reports' ?
                                        'text-rose-600 bg-rose-100 dark:bg-rose-900/20 shadow-md' :
                                        'text-gray-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/20'}`}
                                    type="button"
                                >
                                    <TrendingUp className="h-5 w-5" />
                                </Button>
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Reports')}
                            </span>
                        </div>

                        {/* Profile */}
                        <div className="flex flex-col items-center group">
                            <Link href={safeRoute('customer.profile.show')}>
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
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Profile')}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <div className="flex flex-col items-center group">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
                                type="button"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('Logout')}
                            </span>
                        </div>
                    </nav>
                </div>
                
                {/* User Avatar */}
                <div className="flex flex-col items-center space-y-2">
                    <Avatar className="border-2 border-purple-200 dark:border-purple-900/40 shadow-md">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=8b5cf6&color=fff`} />
                        <AvatarFallback className="bg-purple-600 text-white">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {user.name}
                    </span>
                </div>
            </div>
        </div>
    );
}
