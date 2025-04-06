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
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("CustomerNavbar error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
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
        const { auth, permissions = [] } = usePage().props;

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
                if (permissions && permissions.includes(permission)) return true;
                if (auth.user?.permissions?.includes(permission)) return true;
                if (auth.user?.roles?.some(role => role.permissions?.includes(permission))) return true;
                if (permission === undefined || process.env.NODE_ENV === 'development') return true;
                return false;
            } catch (error) {
                console.error("Permission check error:", error);
                return true; // Default to showing items if permission check fails
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
                <nav className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${darkMode ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-800 shadow-sm border-b border-gray-200/70'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                {/* Logo */}
                                <div className="flex-shrink-0 flex items-center">
                                    <div className={`flex items-center gap-3 transition-opacity duration-200 ${isOpen ? 'opacity-50 md:opacity-100' : 'opacity-100'}`}>
                                        <div className={`p-2 rounded-lg flex items-center justify-center ${darkMode ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-100'}`}>
                                            <Package className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        </div>
                                        <span className={`text-base font-semibold hidden sm:block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Customer Portal
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop Navigation */}
                                <div className="hidden md:ml-8 md:flex md:items-center md:space-x-1">
                                    {filteredMenuItems.map((item) => (
                                        <Link
                                            key={item.route}
                                            href={route(item.route)}
                                            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-150 group
                                                ${route().current(item.route)
                                                ? (darkMode
                                                    ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800'
                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100')
                                                : (darkMode
                                                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600')}`}
                                        >
                                            <item.icon className={`h-4 w-4 mr-2 transition-transform duration-150 group-hover:scale-110 ${route().current(item.route) ? (darkMode ? 'text-indigo-300' : 'text-indigo-600') : ''}`} />
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {/* Search Button/Bar */}
                                <div className="relative">
                                    {searchOpen ? (
                                        <div className={`absolute right-0 top-0 h-full flex items-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-md shadow-md p-1 z-10`} style={{width: '280px'}}>
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Search..."
                                                className={`w-full px-3 py-1.5 text-sm border-none focus:ring-0 outline-none ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-400'}`}
                                            />
                                            <button
                                                onClick={() => setSearchOpen(false)}
                                                className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSearchOpen(true)}
                                            className={`p-2 rounded-md flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                            aria-label="Search"
                                        >
                                            <Search className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Dark Mode Toggle */}
                                <button
                                    onClick={toggleDarkMode}
                                    className={`p-2 rounded-md flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-gray-800 text-yellow-400 hover:text-yellow-300' : 'hover:bg-gray-100 text-gray-700 hover:text-indigo-600'}`}
                                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                                >
                                    {darkMode ? (
                                        <Sun className="h-5 w-5" />
                                    ) : (
                                        <Moon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Profile Dropdown */}
                                <div ref={profileDropdownRef} className="relative">
                                    <button
                                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                        className={`flex items-center space-x-2 focus:outline-none ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} p-1.5 rounded-md transition-colors duration-150`}
                                    >
                                        <div className="relative">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center overflow-hidden ${darkMode ? 'bg-indigo-600/30 border border-indigo-500/30' : 'bg-indigo-100 border border-indigo-200'}`}>
                                                <span className={`font-medium text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                                    {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-gray-900 dark:border-gray-900"></div>
                                        </div>
                                        <div className="hidden md:flex items-center">
                                            <ChevronDown className={`h-4 w-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        </div>
                                    </button>

                                    {profileDropdownOpen && (
                                        <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg overflow-hidden z-10 transform origin-top-right transition-all duration-150 animate-fade-in ${darkMode ? 'bg-gray-800 border border-gray-700 ring-1 ring-black ring-opacity-5' : 'bg-white border border-gray-200 ring-1 ring-black ring-opacity-5'}`}>
                                            <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700 bg-gray-850' : 'border-gray-100 bg-gray-50'}`}>
                                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{auth?.user?.name || 'User'}</p>
                                                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{auth?.user?.email || 'user@example.com'}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    href={route('customer.profile.show')}
                                                    className={`flex px-4 py-2 text-sm items-center ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                                                >
                                                    <User className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                    <span>Your Profile</span>
                                                </Link>
                                                <Link
                                                    href={route('customer.settings')}
                                                    className={`flex px-4 py-2 text-sm items-center ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                                                >
                                                    <Settings className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                    <span>Settings</span>
                                                </Link>
                                                <Link
                                                    href={route('customer.help')}
                                                    className={`flex px-4 py-2 text-sm items-center ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                                                >
                                                    <HelpCircle className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                    <span>Help & Support</span>
                                                </Link>
                                                <div className={`border-t my-1 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}></div>
                                                <form method="POST" action={route('customer.logout')}>
                                                    <button
                                                        type="submit"
                                                        className={`flex w-full px-4 py-2 text-sm items-center group ${darkMode ? 'text-gray-300 hover:bg-red-900/30 hover:text-red-300' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
                                                    >
                                                        <LogOut className={`h-4 w-4 mr-2 transition-colors ${darkMode ? 'text-gray-400 group-hover:text-red-400' : 'text-gray-500 group-hover:text-red-500'}`} />
                                                        <span>Sign out</span>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile menu button */}
                                <button
                                    data-mobile-menu-button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={`md:hidden p-2 rounded-md focus:outline-none transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
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
                            className={`md:hidden fixed inset-0 pt-16 z-40 transition-opacity duration-200 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md animate-fade-in`}
                        >
                            <div className="px-4 pt-4 pb-6 space-y-2 h-full overflow-y-auto">
                                {/* Search in mobile menu */}
                                <div className={`mb-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'} rounded-md p-2 flex items-center`}>
                                    <Search className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className={`w-full text-sm border-none focus:ring-0 outline-none ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-800 placeholder-gray-400'}`}
                                    />
                                </div>

                                {filteredMenuItems.map((item) => (
                                    <Link
                                        key={item.route}
                                        href={route(item.route)}
                                        className={`block px-4 py-3 rounded-md text-base font-medium flex items-center transition-all duration-150
                                            ${route().current(item.route)
                                            ? (darkMode
                                                ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800'
                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100')
                                            : (darkMode
                                                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600')}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <item.icon className={`h-5 w-5 mr-3 ${route().current(item.route) ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}

                                <div className={`border-t pt-4 mt-4 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                                    <div className="px-3 py-3">
                                        <div className="flex items-center mb-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 overflow-hidden ${darkMode ? 'bg-indigo-600/30 border border-indigo-500/30' : 'bg-indigo-100 border border-indigo-200'}`}>
                                                <span className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                                    {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{auth?.user?.name || 'User'}</p>
                                                <p className={`text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    <span className="truncate max-w-[200px]">{auth?.user?.email || 'user@example.com'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={route('customer.profile.show')}
                                            className={`block px-3 py-2.5 rounded-md text-base font-medium flex items-center ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User className={`h-5 w-5 mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                                            <span>Your Profile</span>
                                        </Link>
                                        <Link
                                            href={route('customer.settings')}
                                            className={`block px-3 py-2.5 rounded-md text-base font-medium flex items-center ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Settings className={`h-5 w-5 mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                                            <span>Settings</span>
                                        </Link>
                                        <Link
                                            href={route('customer.help')}
                                            className={`block px-3 py-2.5 rounded-md text-base font-medium flex items-center ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <HelpCircle className={`h-5 w-5 mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                                            <span>Help & Support</span>
                                        </Link>

                                        <form method="POST" action={route('customer.logout')} className="mt-3">
                                            <button
                                                type="submit"
                                                className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium flex items-center ${darkMode ? 'text-gray-300 hover:bg-red-900/30 hover:text-red-300' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
                                            >
                                                <LogOut className={`h-5 w-5 mr-3 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                                                <span>Sign out</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* Dark/Light mode toggle in mobile menu */}
                                <div className={`mt-6 px-4 py-3 rounded-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {darkMode ? 'Dark Mode' : 'Light Mode'}
                                        </span>
                                        <button
                                            onClick={toggleDarkMode}
                                            className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white shadow-sm border border-gray-200 text-gray-700'}`}
                                        >
                                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                        </button>
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
