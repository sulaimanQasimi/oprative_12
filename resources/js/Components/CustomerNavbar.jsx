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
    Truck,
    PackageCheck,
    PackageX,
    PackageOpen,
    Warehouse,
    Box,
    MapPin,
    Route,
    ClipboardList,
    AlertCircle
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

export default function CustomerNavbar({ auth, currentRoute }) {
    const { t } = useLaravelReactI18n();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { post } = useForm();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await post(route('customer.logout'));
        } catch (error) {
            console.error('Error during logout:', error);
            setIsLoggingOut(false);
        }
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
        <div className="w-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg z-10">
            <div className="h-full flex flex-col items-center justify-between py-6">
                {/* Top section with logo and main navigation */}
                <div className="flex flex-col items-center space-y-8">
                    <div className="bg-purple-600 text-white p-2 rounded-xl">
                        <Truck className="h-6 w-6" />
                    </div>
                    <nav className="flex flex-col items-center space-y-8">
                        <Link href={safeRoute('customer.dashboard')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.dashboard' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <Warehouse className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={safeRoute('customer.stock-products')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.stock-products' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <Box className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={safeRoute('customer.orders')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.orders' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <PackageCheck className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={safeRoute('customer.create_orders')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.create_orders' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <PackageOpen className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={safeRoute('customer.sales.index')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.sales.index' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <Route className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={safeRoute('customer.accounts.index')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.accounts.index' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <CreditCard className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={safeRoute('customer.reports')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.reports' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <ClipboardList className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={safeRoute('customer.settings')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.settings' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href={safeRoute('customer.profile.show')}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${currentRoute === 'customer.profile.show' ?
                                    'text-purple-600 bg-purple-100 dark:bg-purple-900/20' :
                                    'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
                                type="button"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    </nav>
                </div>

                {/* Bottom section with theme toggle, logout, and avatar */}
                <div className="flex flex-col items-center space-y-4">
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

                    {/* Logout Button with Confirmation Dialog */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
                                type="button"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    {t('Confirm Logout')}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                                    {t('Are you sure you want to logout? Any unsaved changes will be lost.')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border-0">
                                    {t('Cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="bg-red-600 hover:bg-red-700 text-white border-0 flex items-center gap-2"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t('Logging out...')}
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="h-4 w-4" />
                                            {t('Logout')}
                                        </>
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* User Avatar */}
                    <Avatar className="border-2 border-purple-200 dark:border-purple-900/40">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=8b5cf6&color=fff`} />
                        <AvatarFallback className="bg-purple-600 text-white">{auth.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
