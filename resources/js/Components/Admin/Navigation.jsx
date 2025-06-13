import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    DollarSign,
    BarChart3,
    Settings,
    Users,
    Package,
    ShoppingCart,
    Layers,
    CreditCard,
    Globe,
    Home,
    LogOut,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Truck,
    Ruler,
    Warehouse,
    TrendingUp,
    Shield,
    User,
    Menu,
    Sparkles,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRightLeft,
    Store,
    Zap
} from "lucide-react";

const Navigation = ({ auth, currentRoute }) => {
    const { t } = useLaravelReactI18n();
    const { url } = usePage();
    const [expandedGroups, setExpandedGroups] = useState({
        inventory: true,
        warehouse: false,
        system: false,
    });

    const toggleGroup = (groupKey) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    // Helper function to safely access routes
    const safeRoute = (routeName) => {
        try {
            if (typeof route !== 'undefined') {
                return route(routeName);
            }
            
            // Fallback URLs
            switch (routeName) {
                case 'admin.dashboard':
                    return '/adminpanel/dashboard';
                case 'admin.profile.edit':
                    return '/adminpanel/profile';
                case 'admin.products.index':
                    return '/adminpanel/products';
                case 'admin.suppliers.index':
                    return '/adminpanel/suppliers';
                case 'admin.warehouses.index':
                    return '/adminpanel/warehouses';
                case 'admin.warehouses.sales.index':
                    return '/adminpanel/warehouses/sales';
                case 'admin.warehouses.income.index':
                    return '/adminpanel/warehouses/income';
                case 'admin.warehouses.outcome.index':
                    return '/adminpanel/warehouses/outcome';
                case 'admin.warehouses.transfers.index':
                    return '/adminpanel/warehouses/transfers';
                case 'admin.units.index':
                    return '/adminpanel/units';
                case 'admin.currencies.index':
                    return '/adminpanel/currencies';
                case 'admin.employees.index':
                    return '/adminpanel/employees';
                case 'admin.customers.index':
                    return '/adminpanel/customers';
                case 'admin.accounts.index':
                    return '/adminpanel/accounts';
                default:
                    return '#';
            }
        } catch (error) {
            console.error(`Route not found: ${routeName}`, error);
            return '#';
        }
    };

    // Handle logout
    const handleLogout = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/adminpanel/logout';

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }

        document.body.appendChild(form);
        form.submit();
    };

    // Define navigation groups and items
    const navigationGroups = [
        {
            title: t("Dashboard"),
            items: [
                {
                    name: t("Dashboard"),
                    icon: <Home className="w-5 h-5" />,
                    route: "admin.dashboard",
                    active: currentRoute === "admin.dashboard",
                },
            ],
        },
        {
            title: t("Inventory Management"),
            key: "inventory",
            icon: <Package className="w-4 h-4" />,
            items: [
                {
                    name: t("Products"),
                    icon: <Package className="w-5 h-5" />,
                    route: "admin.products.index",
                    active: currentRoute?.startsWith("admin.products"),
                    badge: "Hot",
                },
                {
                    name: t("Suppliers"),
                    icon: <Truck className="w-5 h-5" />,
                    route: "admin.suppliers.index",
                    active: currentRoute?.startsWith("admin.suppliers"),
                },
                {
                    name: t("Stores"),
                    icon: <ShoppingCart className="w-5 h-5" />,
                    route: "admin.customers.index",
                    active: currentRoute?.startsWith("admin.customers"),
                },
                {
                    name: t("Employees"),
                    icon: <Users className="w-5 h-5" />,
                    route: "admin.employees.index",
                    active: currentRoute?.startsWith("admin.employees"),
                },
                {
                    name: t("Accounts"),
                    icon: <CreditCard className="w-5 h-5" />,
                    route: "admin.accounts.index",
                    active: currentRoute?.startsWith("admin.accounts"),
                },
            ],
        },
        {
            title: t("Warehouse Operations"),
            key: "warehouse",
            icon: <Warehouse className="w-4 h-4" />,
            items: [
                {
                    name: t("Warehouses"),
                    icon: <Warehouse className="w-5 h-5" />,
                    route: "admin.warehouses.index",
                    active: currentRoute === "admin.warehouses.index",
                },
                {
                    name: t("Shop Sales"),
                    icon: <Store className="w-5 h-5" />,
                    route: "admin.warehouses.sales.index",
                    active: currentRoute?.includes("sales"),
                },
                {
                    name: t("Income"),
                    icon: <ArrowDownRight className="w-5 h-5" />,
                    route: "admin.warehouses.income.index",
                    active: currentRoute?.includes("income"),
                },
                {
                    name: t("Outcome"),
                    icon: <ArrowUpRight className="w-5 h-5" />,
                    route: "admin.warehouses.outcome.index",
                    active: currentRoute?.includes("outcome"),
                },
                {
                    name: t("Transfers"),
                    icon: <ArrowRightLeft className="w-5 h-5" />,
                    route: "admin.warehouses.transfers.index",
                    active: currentRoute?.includes("transfers"),
                },
            ],
        },
        {
            title: t("System Configuration"),
            key: "system",
            icon: <Settings className="w-4 h-4" />,
            items: [
                {
                    name: t("Units"),
                    icon: <Ruler className="w-5 h-5" />,
                    route: "admin.units.index",
                    active: currentRoute?.startsWith("admin.units"),
                },
                {
                    name: t("Currencies"),
                    icon: <Globe className="w-5 h-5" />,
                    route: "admin.currencies.index",
                    active: currentRoute?.startsWith("admin.currencies"),
                },
            ],
        },
    ];

    return (
        <aside className="w-80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 shadow-2xl border-r border-slate-700/50">
            {/* Enhanced Logo and branding */}
            <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl blur opacity-75"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-white">
                            {t("Admin Panel")}
                        </h1>
                        <p className="text-sm text-blue-400 font-medium">
                            {t("Management System")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Enhanced Navigation links */}
            <nav className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                {navigationGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6">
                        {/* Group Header */}
                        <div className="px-6 mb-3">
                            {group.key ? (
                                <button
                                    onClick={() => toggleGroup(group.key)}
                                    className="flex items-center justify-between w-full text-left group hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
                                            {group.icon}
                                        </span>
                                        <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                                            {group.title}
                                        </p>
                                    </div>
                                    {expandedGroups[group.key] ? (
                                        <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                    )}
                                </button>
                            ) : (
                                <div className="flex items-center space-x-3 ml-2">
                                    <span className="text-blue-400">
                                        <Home className="w-4 h-4" />
                                    </span>
                                    <p className="text-sm font-bold text-slate-300">
                                        {group.title}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Group Items */}
                        {(!group.key || expandedGroups[group.key]) && (
                            <ul className="space-y-2 px-4">
                                {group.items.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={safeRoute(item.route)}
                                            className={`group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                                                item.active
                                                    ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white shadow-lg border border-blue-500/30 backdrop-blur-sm"
                                                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                            }`}
                                        >
                                            {/* Active indicator */}
                                            {item.active && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r"></div>
                                            )}

                                            {/* Icon */}
                                            <span
                                                className={`transition-colors flex-shrink-0 ${
                                                    item.active
                                                        ? "text-blue-400"
                                                        : "text-slate-500 group-hover:text-blue-400"
                                                }`}
                                            >
                                                {item.icon}
                                            </span>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-sm truncate">
                                                        {item.name}
                                                    </span>
                                                    {item.badge && (
                                                        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full animate-pulse">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Active arrow */}
                                            {item.active && (
                                                <ChevronRight className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </nav>

            {/* Enhanced User profile with actions */}
            <div className="p-6 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm space-y-4">
                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full blur opacity-60"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                            {auth.user.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400 font-medium">{t("Administrator")}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <Link
                        href={safeRoute('admin.profile.edit')}
                        className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30"
                    >
                        <span className="text-slate-500 group-hover:text-blue-400 transition-colors">
                            <User className="w-4 h-4" />
                        </span>
                        <span className="font-medium text-sm">
                            {t("Profile Settings")}
                        </span>
                        <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
                    >
                        <span className="text-slate-500 group-hover:text-red-400 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </span>
                        <span className="font-medium text-sm">
                            {t("Sign Out")}
                        </span>
                        <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Status indicator */}
                <div className="pt-3 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-slate-400">{t("System Online")}</span>
                        </div>
                        <span className="text-slate-500">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Navigation;
