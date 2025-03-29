import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
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
    Mail
} from 'lucide-react';

export default function CustomerNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage().props;

    const menuItems = [
        {
            name: 'Dashboard',
            route: 'customer.dashboard',
            icon: Home,
            permission: 'customer.view_dashboard'
        },
        {
            name: 'Stock Products',
            route: 'customer.stock-products',
            icon: Package,
            permission: 'customer.view_stock'
        },
        {
            name: 'Orders',
            route: 'customer.orders',
            icon: ShoppingCart,
            permission: 'customer.view_orders'
        },
        {
            name: 'Create Order',
            route: 'customer.create_orders',
            icon: Plus,
            permission: 'customer.create_orders'
        },
        {
            name: 'Move form Warehouse to Store',
            route: 'customer.sales.index',
            icon: BarChart,
            permission: 'customer.view_sales'
        },
        {
            name: 'Bank Accounts',
            route: 'customer.accounts.index',
            icon: CreditCard,
            permission: 'customer.view_accounts'
        },
        {
            name: 'Reports',
            route: 'customer.reports',
            icon: FileText,
            permission: 'customer.view_reports'
        }
    ];

    const hasPermission = (permission) => {
        return auth.user.permissions.includes(permission);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg mb-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo/Brand */}
                        <div className="flex-shrink-0 flex items-center">
                            <div className="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                                <div className="p-2.5 bg-white/10 backdrop-blur-sm shadow-lg transform transition-all duration-300 hover:shadow-xl hover:rotate-3">
                                    <Package className="h-5 w-5 text-white transform transition-transform hover:scale-110" />
                                </div>
                                <span className="text-base font-semibold text-white hover:text-white/90 transition-all duration-500">
                                    Customer Portal
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-8 md:flex md:space-x-4">
                            {menuItems.map((item) => (
                                hasPermission(item.permission) && (
                                    <Link
                                        key={item.route}
                                        href={route(item.route)}
                                        className={`inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out ${
                                            route().current(item.route)
                                                ? 'bg-white/20 text-white shadow-lg'
                                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5 mr-2" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Profile Link */}
                        <div className="relative group">
                            <Link
                                href={route('customer.profile.show')}
                                className={`flex items-center gap-3 p-2 text-sm transition-all duration-200 hover:bg-white/10 focus:outline-none ${
                                    route().current('customer.profile.show') ? 'bg-white/20 shadow-lg' : ''
                                }`}
                            >
                                <div className="relative">
                                    <div className="h-10 w-10 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-3">
                                        <span className="text-white font-semibold text-lg">
                                            {auth.user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">{auth.user.name}</span>
                                        <ChevronDown className="h-4 w-4 text-white/60 transform transition-transform group-hover:rotate-180" />
                                    </div>
                                    <div className="flex items-center gap-1 text-white/80">
                                        <Mail className="h-3 w-3" />
                                        <span className="text-xs">{auth.user.email}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Logout Button */}
                        <form method="POST" action={route('customer.logout')} className="hidden md:flex items-center">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
                            >
                                <LogOut className="h-5 w-5 text-white/80" />
                                <span>Logout</span>
                            </button>
                        </form>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
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
                <div className="md:hidden bg-white/10 backdrop-blur-lg absolute w-full z-50">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {menuItems.map((item) => (
                            hasPermission(item.permission) && (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2"
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        ))}
                        <form method="POST" action={route('customer.logout')} className="block">
                            <button
                                type="submit"
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
} 