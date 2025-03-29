import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import NavbarAnimation from './NavbarAnimation';

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
    const navbarHeight = 80; // Fixed height for the navbar

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
        // Check permissions from Inertia props first (from middleware)
        if (permissions && permissions.includes(permission)) {
            return true;
        }
        
        // Fallback to checking user permissions directly
        if (auth.user && auth.user.permissions && auth.user.permissions.includes(permission)) {
            return true;
        }
        
        // Check if user has role with permission
        if (auth.user && auth.user.roles) {
            return auth.user.roles.some(role => 
                role.permissions && role.permissions.includes(permission)
            );
        }
        
        // If no specific permission required or for development
        if (permission === undefined || process.env.NODE_ENV === 'development') {
            return true;
        }
        
        return false;
    };

    // Filter menu items based on permissions
    const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar-3d relative overflow-hidden shadow-xl mb-6 transition-all duration-300 sticky top-0 z-50" style={{ height: `${navbarHeight}px` }}>
            {/* 3D Animation Background */}
            <NavbarAnimation height={navbarHeight} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 navbar-3d-content h-full">
                <div className="flex justify-between h-full">
                    <div className="flex">
                        {/* Logo/Brand */}
                        <div className="flex-shrink-0 flex items-center">
                            <div className="flex items-center gap-3 navbar-3d-logo">
                                <div className="p-2.5 bg-white/20 backdrop-blur-lg shadow-lg transform transition-all duration-300 hover:shadow-xl hover:rotate-3 rounded-lg border border-white/10">
                                    <Package className="h-5 w-5 text-white transform transition-transform hover:scale-110" />
                                </div>
                                <span className="text-base font-semibold text-white hover:text-white/90 transition-all duration-500">
                                    Customer Portal
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-8 md:flex md:space-x-2">
                            {filteredMenuItems.length > 0 ? (
                                filteredMenuItems.map((item) => (
                                    <div key={item.route} className="relative group">
                                        {item.submenu ? (
                                            <div className="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out cursor-pointer group navbar-3d-item">
                                                <item.icon className="h-5 w-5 mr-2 text-white/80 group-hover:text-white transition-colors" />
                                                <span className="font-medium text-white/90 group-hover:text-white">{item.name}</span>
                                                <ChevronDown className="h-4 w-4 ml-1 text-white/60 transform transition-transform group-hover:rotate-180" />
                                                
                                                {/* Submenu */}
                                                <div className="absolute left-0 z-10 mt-7 w-56 origin-top-left bg-white/95 backdrop-blur-md rounded-md shadow-xl ring-1 ring-black/5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                                                    <div className="py-1">
                                                        {item.submenu.map((subitem) => (
                                                            <Link
                                                                key={subitem.id || `${subitem.route}-${subitem.name}`}
                                                                href={route(subitem.route)}
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                            >
                                                                {subitem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href={route(item.route)}
                                                className={`inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out rounded-lg navbar-3d-item ${
                                                    route().current(item.route)
                                                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                                                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <item.icon className="h-5 w-5 mr-2" />
                                                <span className="font-medium">{item.name}</span>
                                            </Link>
                                        )}
                                    </div>
                                ))
                            ) : (
                                // Display default menu items if no filtered items (development or fallback)
                                menuItems.map((item) => (
                                    <div key={item.route} className="relative group">
                                        {item.submenu ? (
                                            <div className="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out cursor-pointer group navbar-3d-item">
                                                <item.icon className="h-5 w-5 mr-2 text-white/80 group-hover:text-white transition-colors" />
                                                <span className="font-medium text-white/90 group-hover:text-white">{item.name}</span>
                                                <ChevronDown className="h-4 w-4 ml-1 text-white/60 transform transition-transform group-hover:rotate-180" />
                                                
                                                {/* Submenu */}
                                                <div className="absolute left-0 z-10 mt-7 w-56 origin-top-left bg-white/95 backdrop-blur-md rounded-md shadow-xl ring-1 ring-black/5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                                                    <div className="py-1">
                                                        {item.submenu.map((subitem) => (
                                                            <Link
                                                                key={subitem.id || `${subitem.route}-${subitem.name}`}
                                                                href={route(subitem.route)}
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                            >
                                                                {subitem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href={route(item.route)}
                                                className={`inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out rounded-lg navbar-3d-item ${
                                                    route().current(item.route)
                                                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                                                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <item.icon className="h-5 w-5 mr-2" />
                                                <span className="font-medium">{item.name}</span>
                                            </Link>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Profile Menu */}
                        <div ref={profileDropdownRef} className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className={`flex items-center gap-3 px-3 py-1.5 text-sm transition-all duration-200 hover:bg-white/15 focus:outline-none rounded-lg border navbar-3d-item ${
                                    route().current('customer.profile.show') || profileDropdownOpen 
                                    ? 'bg-white/20 shadow-lg border-white/20' 
                                    : 'border-transparent hover:border-white/10'
                                }`}
                            >
                                <div className="relative">
                                    <div className="h-10 w-10 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-lg flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-3 rounded-lg border border-white/10 shadow-inner">
                                        <span className="text-white font-semibold text-lg">
                                            {auth.user?.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-400 rounded-full border-2 border-indigo-700 animate-pulse"></div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">{auth.user?.name || 'User'}</span>
                                        <ChevronDown className={`h-4 w-4 text-white/70 transform transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-white/80">
                                        <Mail className="h-3 w-3" />
                                        <span className="text-xs truncate max-w-[150px]">{auth.user?.email || 'user@example.com'}</span>
                                    </div>
                                </div>
                            </button>
                            
                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden z-10 border border-indigo-100 animate-fade-in-down">
                                    <div className="border-b px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <p className="text-sm font-medium text-gray-900">{auth.user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{auth.user?.email || 'user@example.com'}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href={route('customer.profile.show')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 items-center gap-2 transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>Your Profile</span>
                                        </Link>
                                        <Link
                                            href={route('customer.settings')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 items-center gap-2 transition-colors"
                                        >
                                            <Settings className="h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                        <Link
                                            href={route('customer.help')}
                                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 items-center gap-2 transition-colors"
                                        >
                                            <HelpCircle className="h-4 w-4" />
                                            <span>Help & Support</span>
                                        </Link>
                                        <form method="POST" action={route('customer.logout')}>
                                            <button
                                                type="submit"
                                                className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 items-center gap-2 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Sign out</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200 border border-transparent hover:border-white/10 navbar-3d-item"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? (
                                    <X className="block h-6 w-6" />
                                ) : (
                                    <Menu className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-lg fixed w-full z-50 animate-fade-in-down">
                    <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {(filteredMenuItems.length > 0 ? filteredMenuItems : menuItems).map((item) => (
                            <div key={item.route}>
                                {item.submenu ? (
                                    <div className="space-y-1">
                                        <div className="block px-3 py-2 rounded-md text-base font-medium text-white bg-white/5 flex items-center justify-between border border-white/5 navbar-3d-item">
                                            <div className="flex items-center gap-2">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </div>
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                        <div className="pl-4 space-y-1 border-l border-white/10 ml-4">
                                            {item.submenu.map((subitem) => (
                                                <Link
                                                    key={subitem.id || `${subitem.route}-${subitem.name}`}
                                                    href={route(subitem.route)}
                                                    className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10 transition duration-150 ease-in-out navbar-3d-item"
                                                >
                                                    {subitem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={route(item.route)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2 navbar-3d-item ${
                                            route().current(item.route)
                                                ? 'bg-white/15 text-white border border-white/10'
                                                : 'text-white/90 border border-transparent'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                        
                        {/* Mobile profile links */}
                        <div className="border-t border-white/10 pt-4">
                            <Link
                                href={route('customer.profile.show')}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2 navbar-3d-item"
                            >
                                <User className="h-5 w-5" />
                                <span>Your Profile</span>
                            </Link>
                            <Link
                                href={route('customer.settings')}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2 navbar-3d-item"
                            >
                                <Settings className="h-5 w-5" />
                                <span>Settings</span>
                            </Link>
                            <Link
                                href={route('customer.help')}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2 navbar-3d-item"
                            >
                                <HelpCircle className="h-5 w-5" />
                                <span>Help & Support</span>
                            </Link>
                        </div>
                        
                        <form method="POST" action={route('customer.logout')} className="block">
                            <button
                                type="submit"
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2 hover:text-red-300 navbar-3d-item"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Sign out</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
} 