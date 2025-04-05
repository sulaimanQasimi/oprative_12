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
    HelpCircle
} from 'lucide-react';

export default function CustomerNavbar() {
    const { t } = useLaravelReactI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const { auth, permissions = [] } = usePage().props;

    const profileDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

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
        if (permissions && permissions.includes(permission)) return true;
        if (auth.user?.permissions?.includes(permission)) return true;
        if (auth.user?.roles?.some(role => role.permissions?.includes(permission))) return true;
        if (permission === undefined || process.env.NODE_ENV === 'development') return true;
        return false;
    };

    const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-mobile-menu-button]')) {
                setIsOpen(false);
            }
        }

        function handleEscapeKey(event) {
            if (event.key === 'Escape') {
                setProfileDropdownOpen(false);
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscapeKey);
        };
    }, []);

    return (
        <nav className="bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-lg font-semibold text-white hidden sm:block">
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
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-150 ${
                                        route().current(item.route)
                                            ? 'bg-white/20 text-white shadow-sm'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Profile Dropdown */}
                        <div ref={profileDropdownRef} className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center space-x-2 text-white focus:outline-none"
                            >
                                <div className="relative">
                                    <div className="h-9 w-9 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                        <span className="text-white font-medium text-sm">
                                            {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 rounded-full border-2 border-indigo-900"></div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="text-sm font-medium text-white flex items-center">
                                        <span className="mr-1 max-w-[120px] truncate">{auth.user?.name || 'User'}</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-10 ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <p className="text-sm font-medium text-gray-900">{auth.user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{auth.user?.email || 'user@example.com'}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href={route('customer.profile.show')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 items-center"
                                        >
                                            <User className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>Your Profile</span>
                                        </Link>
                                        <Link
                                            href={route('customer.settings')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 items-center"
                                        >
                                            <Settings className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>Settings</span>
                                        </Link>
                                        <Link
                                            href={route('customer.help')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 items-center"
                                        >
                                            <HelpCircle className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>Help & Support</span>
                                        </Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <form method="POST" action={route('customer.logout')}>
                                            <button
                                                type="submit"
                                                className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 items-center"
                                            >
                                                <LogOut className="h-4 w-4 mr-2 text-gray-500" />
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
                            className="md:hidden p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
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
                    className="md:hidden bg-indigo-900/95 backdrop-blur-md fixed inset-0 pt-16 z-40"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 h-full overflow-y-auto">
                        {filteredMenuItems.map((item) => (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`block px-3 py-3 rounded-md text-base font-medium flex items-center ${
                                    route().current(item.route)
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-white/80 hover:bg-indigo-800 hover:text-white'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        <div className="border-t border-indigo-800 pt-4 mt-4">
                            <div className="px-3 py-2">
                                <div className="flex items-center mb-3">
                                    <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 mr-3">
                                        <span className="text-white font-medium">
                                            {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{auth.user?.name || 'User'}</p>
                                        <p className="text-xs text-white/70 flex items-center">
                                            <Mail className="h-3 w-3 mr-1" />
                                            <span className="truncate max-w-[200px]">{auth.user?.email || 'user@example.com'}</span>
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={route('customer.profile.show')}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-indigo-800 flex items-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="h-5 w-5 mr-3 text-indigo-400" />
                                    <span>Your Profile</span>
                                </Link>
                                <Link
                                    href={route('customer.settings')}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-indigo-800 flex items-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Settings className="h-5 w-5 mr-3 text-indigo-400" />
                                    <span>Settings</span>
                                </Link>
                                <Link
                                    href={route('customer.help')}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-indigo-800 flex items-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <HelpCircle className="h-5 w-5 mr-3 text-indigo-400" />
                                    <span>Help & Support</span>
                                </Link>

                                <form method="POST" action={route('customer.logout')} className="mt-2">
                                    <button
                                        type="submit"
                                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-red-800/30 flex items-center"
                                    >
                                        <LogOut className="h-5 w-5 mr-3 text-red-400" />
                                        <span>Sign out</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
