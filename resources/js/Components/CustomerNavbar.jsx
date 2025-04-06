import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

import {
    Home,
    Package,
    ShoppingCart,
    Plus,
    BarChart,
    CreditCard,
    FileText,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Mail,
    Settings,
    User,
    HelpCircle,
    Search,
    Moon,
    Sun
} from 'lucide-react';

// Error boundary component to catch errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("CustomerNavbar error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI when an error occurs
            return (
                <nav className="sticky top-0 z-50 bg-white/95 text-gray-800 shadow-sm border-b border-gray-200/70">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg flex items-center justify-center bg-indigo-50 border border-indigo-100">
                                            <Package className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <span className="text-base font-semibold hidden sm:block text-gray-900">
                                            Customer Portal
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {process.env.NODE_ENV === 'development' && (
                                <div className="flex items-center text-xs text-red-600">
                                    <span>Error in navbar. Check console for details.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            );
        }

        return this.props.children;
    }
}

export default function CustomerNavbar() {
    try {
        const { t } = useLaravelReactI18n();
        const [isOpen, setIsOpen] = useState(false);
        const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
        const [searchOpen, setSearchOpen] = useState(false);
        const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

        // Safer way to access props with fallbacks
        const pageProps = usePage().props || {};
        const auth = pageProps.auth || {};
        const permissions = pageProps.permissions || [];

        const profileDropdownRef = useRef(null);
        const mobileMenuRef = useRef(null);
        const searchInputRef = useRef(null);

        const menuItems = [
            {
                name: t('Dashboard'),
                route: 'customer.dashboard',
                icon: Home,
                permission: 'customer.view_dashboard'
            },
            {
                name: t('Stock Products'),
                route: 'customer.stock-products',
                icon: Package,
                permission: 'customer.view_stock'
            },
            {
                name: t('Orders'),
                route: 'customer.orders',
                icon: ShoppingCart,
                permission: 'customer.view_orders',
            },
            {
                name: t('Create Order'),
                route: 'customer.create_orders',
                icon: Plus,
                permission: 'customer.create_orders'
            },
            {
                name: t('Move form Warehouse to Store'),
                route: 'customer.sales.index',
                icon: BarChart,
                permission: 'customer.view_sales'
            },
            {
                name: t('Bank Accounts'),
                route: 'customer.accounts.index',
                icon: CreditCard,
                permission: 'customer.view_accounts'
            },
            {
                name: t('Reports'),
                route: 'customer.reports',
                icon: FileText,
                permission: 'customer.view_reports',
            }
        ];

        const hasPermission = (permission) => {
            try {
                if (!permission) return true;

                // Check permissions array
                if (permissions && Array.isArray(permissions) && permissions.includes(permission)) {
                    return true;
                }

                // Check user permissions
                if (auth && auth.user && Array.isArray(auth.user.permissions) && auth.user.permissions.includes(permission)) {
                    return true;
                }

                // Check role permissions
                if (auth && auth.user && auth.user.roles && Array.isArray(auth.user.roles)) {
                    // Check each role's permissions
                    for (const role of auth.user.roles) {
                        if (role && Array.isArray(role.permissions) && role.permissions.includes(permission)) {
                            return true;
                        }
                    }
                }

                // Development environment bypass
                if (process.env.NODE_ENV === 'development') {
                    return true;
                }

                return false;
            } catch (error) {
                console.error("Permission check error:", error);
                // Default to showing items in development or if permission check fails
                return process.env.NODE_ENV === 'development';
            }
        };

        const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

        // Toggle dark mode
        const toggleDarkMode = () => {
            try {
                const newDarkMode = !darkMode;
                setDarkMode(newDarkMode);
                localStorage.setItem('darkMode', newDarkMode.toString());
                document.documentElement.classList.toggle('dark', newDarkMode);
            } catch (error) {
                console.error("Dark mode toggle error:", error);
            }
        };

        // Initialize dark mode on component mount
        useEffect(() => {
            try {
                document.documentElement.classList.toggle('dark', darkMode);
            } catch (error) {
                console.error("Dark mode initialization error:", error);
            }
        }, [darkMode]);

        // Close dropdowns when clicking outside
        useEffect(() => {
            function handleClickOutside(event) {
                try {
                    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                        setProfileDropdownOpen(false);
                    }
                    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-mobile-menu-button]')) {
                        setIsOpen(false);
                    }
                } catch (error) {
                    console.error("Click outside handler error:", error);
                }
            }

            function handleEscapeKey(event) {
                try {
                    if (event.key === 'Escape') {
                        setProfileDropdownOpen(false);
                        setIsOpen(false);
                        setSearchOpen(false);
                    }
                } catch (error) {
                    console.error("Escape key handler error:", error);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscapeKey);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
                document.removeEventListener("keydown", handleEscapeKey);
            };
        }, []);

        // Focus search input when opened
        useEffect(() => {
            try {
                if (searchOpen && searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            } catch (error) {
                console.error("Search focus error:", error);
            }
        }, [searchOpen]);

        return (
            <ErrorBoundary>
                <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${darkMode ? 'bg-gray-900/80 text-white border-b border-gray-800/50' : 'bg-white/80 text-gray-800 shadow-sm border-b border-gray-200/50'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                {/* Logo */}
                                <div className="flex-shrink-0 flex items-center">
                                    <div className={`flex items-center gap-3 transition-all duration-300 ${isOpen ? 'opacity-50 md:opacity-100' : 'opacity-100'}`}>
                                        <div className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105
                                        ${darkMode ? 'bg-indigo-600/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10' : 'bg-indigo-50 border border-indigo-100 shadow-md'}`}>
                                            <Package className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        </div>
                                        <span className={`text-base font-semibold hidden sm:block ${darkMode ? 'text-white' : 'text-gray-900'} transition-all duration-200`}>
                                            Customer Portal
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop Navigation */}
                                <div className="hidden md:ml-8 md:flex md:items-center md:space-x-2">
                                    {filteredMenuItems.map((item) => (
                                        <Link
                                            key={item.route}
                                            href={route(item.route)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:scale-105
                                                ${route().current(item.route)
                                                ? (darkMode
                                                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm')
                                                : (darkMode
                                                    ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-50/90 hover:text-indigo-600 hover:shadow-sm')}`}
                                        >
                                            <item.icon className={`h-4 w-4 mr-2 transition-transform duration-150 group-hover:scale-110 ${route().current(item.route) ? (darkMode ? 'text-indigo-300' : 'text-indigo-600') : ''}`} />
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}

                                    {/* Additional nav links */}
                                    <Link
                                        href={route('customer.profile.show')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:scale-105
                                            ${route().current('customer.profile.show')
                                            ? (darkMode
                                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm')
                                            : (darkMode
                                                ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-md'
                                                : 'text-gray-700 hover:bg-gray-50/90 hover:text-indigo-600 hover:shadow-sm')}`}
                                    >
                                        <User className={`h-4 w-4 mr-2 transition-transform duration-150 group-hover:scale-110 ${route().current('customer.profile.show') ? (darkMode ? 'text-indigo-300' : 'text-indigo-600') : ''}`} />
                                        <span>Your Profile</span>
                                    </Link>
                                    <Link
                                        href={route('customer.settings')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:scale-105
                                            ${route().current('customer.settings')
                                            ? (darkMode
                                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm')
                                            : (darkMode
                                                ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-md'
                                                : 'text-gray-700 hover:bg-gray-50/90 hover:text-indigo-600 hover:shadow-sm')}`}
                                    >
                                        <Settings className={`h-4 w-4 mr-2 transition-transform duration-150 group-hover:scale-110 ${route().current('customer.settings') ? (darkMode ? 'text-indigo-300' : 'text-indigo-600') : ''}`} />
                                        <span>Settings</span>
                                    </Link>
                                    <form method="POST" action={route('customer.logout')} className="inline">
                                        <button
                                            type="submit"
                                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:scale-105
                                                ${darkMode
                                                    ? 'text-gray-300 hover:bg-red-900/30 hover:text-red-300 hover:shadow-md'
                                                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-sm'}`}
                                        >
                                            <LogOut className={`h-4 w-4 mr-2 transition-transform duration-150 group-hover:scale-110 ${darkMode ? 'text-gray-400 group-hover:text-red-400' : 'text-gray-500 group-hover:text-red-500'}`} />
                                            <span>Sign out</span>
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="flex items-center">
                                {/* Mobile menu button */}
                                <button
                                    data-mobile-menu-button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={`md:hidden p-2.5 rounded-lg focus:outline-none transition-all duration-200
                                    ${darkMode
                                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 hover:shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-105 hover:shadow-sm'}`}
                                    aria-expanded={isOpen}
                                >
                                    <span className="sr-only">Open menu</span>
                                    {isOpen ? (
                                        <X className="block h-6 w-6" />
                                    ) : (
                                        <Menu className="block h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isOpen && (
                        <div
                            ref={mobileMenuRef}
                            className={`md:hidden fixed inset-0 pt-16 z-40 transition-all duration-300 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl animate-in fade-in slide-in-from-top-5`}
                        >
                            <div className="px-5 pt-5 pb-6 space-y-3 h-full overflow-y-auto">
                                {/* Search in mobile menu */}
                                <div className={`mb-4 ${darkMode ? 'bg-gray-800/70 border border-gray-700/70' : 'bg-gray-50/80 border border-gray-200/70'} rounded-xl p-2.5 flex items-center shadow-sm`}>
                                    <Search className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className={`w-full text-sm border-none focus:ring-0 outline-none ${darkMode ? 'bg-transparent text-white placeholder-gray-400' : 'bg-transparent text-gray-800 placeholder-gray-400'}`}
                                    />
                                </div>

                                {/* Mobile menu links */}
                                {filteredMenuItems.map((item, index) => (
                                    <Link
                                        key={item.route}
                                        href={route(item.route)}
                                        className={`block px-4 py-3.5 rounded-xl text-base font-medium flex items-center transition-all duration-200 animate-in fade-in slide-in-from-right-5
                                            ${route().current(item.route)
                                            ? (darkMode
                                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm')
                                            : (darkMode
                                                ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-md'
                                                : 'text-gray-700 hover:bg-gray-50/90 hover:text-indigo-600 hover:shadow-sm')}`}
                                        onClick={() => setIsOpen(false)}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <item.icon className={`h-5 w-5 mr-3 ${route().current(item.route) ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}

                                {/* Additional mobile menu links */}
                                <div className="space-y-3 mt-4 pt-4 border-t border-gray-200/10">
                                    <Link
                                        href={route('customer.profile.show')}
                                        className={`block px-4 py-3.5 rounded-xl text-base font-medium flex items-center transition-all duration-200
                                            ${route().current('customer.profile.show')
                                            ? (darkMode
                                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm')
                                            : (darkMode
                                                ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-md'
                                                : 'text-gray-700 hover:bg-gray-50/90 hover:text-indigo-600 hover:shadow-sm')}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User className={`h-5 w-5 mr-3 ${route().current('customer.profile.show') ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                                        <span>Your Profile</span>
                                    </Link>
                                    <Link
                                        href={route('customer.settings')}
                                        className={`block px-4 py-3.5 rounded-xl text-base font-medium flex items-center transition-all duration-200
                                            ${route().current('customer.settings')
                                            ? (darkMode
                                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm')
                                            : (darkMode
                                                ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-md'
                                                : 'text-gray-700 hover:bg-gray-50/90 hover:text-indigo-600 hover:shadow-sm')}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Settings className={`h-5 w-5 mr-3 ${route().current('customer.settings') ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                                        <span>Settings</span>
                                    </Link>
                                    <Link
                                        href={route('customer.help')}
                                        className={`block px-4 py-3.5 rounded-xl text-base font-medium flex items-center transition-all duration-200
                                            ${route().current('customer.help')
                                            ? (darkMode
                                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm')
                                            : (darkMode
                                                ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-md'
                                                : 'text-gray-700 hover:bg-gray-50/90 hover:text-indigo-600 hover:shadow-sm')}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <HelpCircle className={`h-5 w-5 mr-3 ${route().current('customer.help') ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                                        <span>Help & Support</span>
                                    </Link>
                                    <form method="POST" action={route('customer.logout')} className="mt-2">
                                        <button
                                            type="submit"
                                            className={`w-full text-left px-4 py-3.5 rounded-xl text-base font-medium flex items-center transition-all duration-200
                                                ${darkMode
                                                    ? 'text-red-300 hover:bg-red-900/30 hover:shadow-md'
                                                    : 'text-red-600 hover:bg-red-50 hover:shadow-sm'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LogOut className={`h-5 w-5 mr-3 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                                            <span>Sign out</span>
                                        </button>
                                    </form>
                                </div>

                                <div className={`mt-6 rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800/70 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-lg`}>
                                    <div className="px-5 py-4">
                                        <div className="flex items-center">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mr-4 overflow-hidden ${darkMode ? 'bg-indigo-600/30 border border-indigo-500/30' : 'bg-indigo-100 border border-indigo-200'}`}>
                                                <span className={`font-medium text-lg ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                                    {auth && auth.user && auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{auth && auth.user && auth.user.name ? auth.user.name : 'User'}</p>
                                                <p className={`text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    <span className="truncate max-w-[200px]">{auth && auth.user && auth.user.email ? auth.user.email : 'user@example.com'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Dark/Light mode toggle in mobile menu */}
                                        <div className={`mt-5 rounded-lg p-3 ${darkMode ? 'bg-gray-900/70 border border-gray-800/70' : 'bg-gray-50/90 border border-gray-200/70'}`}>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {darkMode ? 'Dark Mode' : 'Light Mode'}
                                                </span>
                                                <button
                                                    onClick={toggleDarkMode}
                                                    className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? 'bg-indigo-600/20 text-yellow-400 border border-indigo-500/30' : 'bg-white shadow-sm border border-gray-200 text-indigo-600'}`}
                                                >
                                                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </ErrorBoundary>
        );
    } catch (error) {
        console.error("CustomerNavbar render error:", error);
        return (
            <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg flex items-center justify-center bg-indigo-50 border border-indigo-100">
                                        <Package className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <span className="text-base font-semibold hidden sm:block text-gray-900">
                                        Customer Portal
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
