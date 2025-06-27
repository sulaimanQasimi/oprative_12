import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Wallet, Home, ShoppingCart, FileText, Users, Settings, LogOut } from 'lucide-react';

export default function CustomerLayout({ children }) {
    const { auth } = usePage().props;

    const navigation = [
        {
            name: 'Dashboard',
            href: route('customer.dashboard'),
            icon: Home,
            current: route().current('customer.dashboard')
        },
        {
            name: 'Orders',
            href: route('customer.orders'),
            icon: ShoppingCart,
            current: route().current('customer.orders*')
        },
        {
            name: 'Wallet',
            href: route('customer.wallet'),
            icon: Wallet,
            current: route().current('customer.wallet*')
        },
        {
            name: 'Sales',
            href: route('customer.sales.index'),
            icon: FileText,
            current: route().current('customer.sales*')
        },
        {
            name: 'Accounts',
            href: route('customer.accounts.index'),
            icon: Users,
            current: route().current('customer.accounts*')
        },
        {
            name: 'Settings',
            href: route('customer.settings'),
            icon: Settings,
            current: route().current('customer.settings')
        }
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                {/* Logo */}
                <div className="flex items-center h-16 px-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-lg">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <span className="ml-2 text-lg font-semibold text-slate-900 dark:text-white">Customer Portal</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    item.current
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                                }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-slate-700">
                                    {auth?.customer_user?.name?.charAt(0) || 'C'}
                                </span>
                            </div>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                {auth?.customer_user?.name || 'Customer'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {auth?.customer_user?.email || ''}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('customer.logout')}
                        method="post"
                        as="button"
                        className="mt-3 w-full flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
}
