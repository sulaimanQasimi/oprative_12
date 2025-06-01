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
} from "lucide-react";

const Navigation = ({ auth, currentRoute }) => {
    const { t } = useLaravelReactI18n();
    const { url } = usePage();
    const [expandedGroups, setExpandedGroups] = useState({
        inventory: true,
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
        // Check if route function exists globally
        if (typeof window.route === 'undefined' && typeof route === 'undefined') {
            console.warn('Ziggy route helper not available, using fallback URLs');
            // Provide fallbacks when Ziggy is not available
            switch (routeName) {
                case 'logout':
                    return '/logout';
                case 'admin.dashboard':
                    return '/adminpanel/dashboard';
                case 'admin.products.index':
                    return '/adminpanel/products';
                case 'admin.suppliers.index':
                    return '/adminpanel/suppliers';
                case 'admin.warehouses.index':
                    return '/adminpanel/warehouses';
                case 'admin.units.index':
                    return '/adminpanel/units';
                case 'admin.currencies.index':
                    return '/adminpanel/currencies';
                default:
                    return '#';
            }
        }

        try {
            // Check if route function exists and the route is defined
            if (typeof route !== 'undefined' && route.has && route.has(routeName)) {
                return route(routeName);
            }
            // Fallback for specific known routes
            if (routeName === 'logout') {
                return '/logout';
            }
            return route(routeName);
        } catch (error) {
            console.error(`Route not found: ${routeName}`, error);
            // Provide specific fallbacks for known routes
            switch (routeName) {
                case 'logout':
                    return '/logout';
                case 'admin.dashboard':
                    return '/adminpanel/dashboard';
                case 'admin.products.index':
                    return '/adminpanel/products';
                case 'admin.suppliers.index':
                    return '/adminpanel/suppliers';
                case 'admin.warehouses.index':
                    return '/adminpanel/warehouses';
                case 'admin.units.index':
                    return '/adminpanel/units';
                case 'admin.currencies.index':
                    return '/adminpanel/currencies';
                default:
                    return '#'; // Fallback URL
            }
        }
    };

    // Handle logout
    const handleLogout = () => {
        // Create a form and submit it for logout
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout'; // Use direct path instead of route helper

        // Add CSRF token
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
                    description: t("Overview & Analytics"),
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
                    description: t("Manage product catalog"),
                    badge: "Hot",
                },
                {
                    name: t("Suppliers"),
                    icon: <Truck className="w-5 h-5" />,
                    route: "admin.suppliers.index",
                    active: currentRoute?.startsWith("admin.suppliers"),
                    description: t("Supplier relationships"),
                },
                {
                    name: t("Warehouses"),
                    icon: <Warehouse className="w-5 h-5" />,
                    route: "admin.warehouses.index",
                    active: currentRoute?.startsWith("admin.warehouses"),
                    description: t("Storage management"),
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
                    description: t("Measurement units"),
                },
                {
                    name: t("Currencies"),
                    icon: <Globe className="w-5 h-5" />,
                    route: "admin.currencies.index",
                    active: currentRoute?.startsWith("admin.currencies"),
                    description: t("Currency settings"),
                },
            ],
        },
    ];

    return (
        <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 shadow-2xl border-r border-slate-700/50">
            {/* Enhanced Logo and branding */}
            <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-60"></div>
                        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                            <Settings className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-white">
                            {t("Admin Panel")}
                        </h1>
                        <p className="text-sm text-emerald-400 font-medium">
                            {t("System Management")}
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
                                    className="flex items-center justify-between w-full text-left group"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className="text-emerald-400">
                                            {group.icon}
                                        </span>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-emerald-400 transition-colors">
                                            {group.title}
                                        </p>
                                    </div>
                                    {expandedGroups[group.key] ? (
                                        <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                    )}
                                </button>
                            ) : (
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-300 ml-2">
                                    {group.title}
                                </p>
                            )}
                        </div>

                        {/* Group Items */}
                        {(!group.key || expandedGroups[group.key]) && (
                            <ul className="space-y-1 px-4">
                                {group.items.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={safeRoute(item.route)}
                                            className={`group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                                                item.active
                                                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 shadow-lg border border-emerald-500/30"
                                                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                            }`}
                                        >
                                            {/* Active indicator */}
                                            {item.active && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r"></div>
                                            )}

                                            {/* Icon */}
                                            <span
                                                className={`transition-colors ${
                                                    item.active
                                                        ? "text-emerald-400"
                                                        : "text-slate-500 group-hover:text-emerald-400"
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
                                                        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Active arrow */}
                                            {item.active && (
                                                <ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}

                {/* Account Section */}
                <div className="mt-8 px-6 mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-300 ml-2">
                        {t("Account")}
                    </p>
                </div>

                <ul className="space-y-1 px-4">
                    <li>
                        <button
                            onClick={handleLogout}
                            className="group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-slate-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                            <span className="text-slate-500 group-hover:text-red-400 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </span>
                            <div className="flex-1 min-w-0 text-left">
                                <span className="font-semibold text-sm">
                                    {t("Logout")}
                                </span>
                                <p className="text-xs text-slate-500 group-hover:text-red-400/70 transition-colors">
                                    {t("Sign out securely")}
                                </p>
                            </div>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Enhanced User profile */}
            <div className="p-6 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur opacity-60"></div>
                        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
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
                        <p className="text-xs text-emerald-400 font-medium mt-0.5">
                            {t("Administrator")}
                        </p>
                    </div>
                    <button className="text-slate-400 hover:text-emerald-400 transition-colors p-1">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Status indicator */}
                <div className="mt-4 flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-400">{t("Online")}</span>
                    <div className="flex-1"></div>
                    <span className="text-slate-500">{new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        </aside>
    );
};

export default Navigation;
