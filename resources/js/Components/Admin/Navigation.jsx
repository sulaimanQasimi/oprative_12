import React from "react";
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
} from "lucide-react";

const Navigation = ({ auth, currentRoute }) => {
    const { t } = useLaravelReactI18n();
    const { url } = usePage();

    // Define navigation items
    const navItems = [
        // {
        //     name: t("Dashboard"),
        //     icon: <Home className="w-5 h-5" />,
        //     route: "admin.dashboard",
        //     active: currentRoute === "admin.dashboard",
        // },
        // {
        //     name: t("Currencies"),
        //     icon: <Globe className="w-5 h-5" />,
        //     route: "admin.currencies.index",
        //     active: currentRoute.startsWith("admin.currencies"),
        // },
        // {
        //     name: t("Settings"),
        //     icon: <Settings className="w-5 h-5" />,
        //     route: "admin.settings",
        //     active: currentRoute === "admin.settings",
        // },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0">
            {/* Logo and branding */}
            <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                        <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-white">
                            {t("Admin Panel")}
                        </h1>
                        <p className="text-xs text-slate-400">
                            {t("System Management")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <div className="px-3 mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-3 mb-1">
                        {t("Main Menu")}
                    </p>
                </div>

                <ul className="space-y-1 px-3">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={route(item.route)}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    item.active
                                        ? "bg-slate-800 text-emerald-400"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                                }`}
                            >
                                <span
                                    className={`${
                                        item.active
                                            ? "text-emerald-400"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {item.icon}
                                </span>
                                <span className="font-medium text-sm">
                                    {item.name}
                                </span>
                                {item.active && (
                                    <span className="ml-auto">
                                        <ChevronRight className="h-4 w-4 text-emerald-400" />
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="px-3 mt-6 mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-3 mb-1">
                        {t("Account")}
                    </p>
                </div>

                <ul className="space-y-1 px-3">
                    <li>
                        <Link
                            href={'load'}
                            method="post"
                            as="button"
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-800/70"
                        >
                            <span className="text-slate-500">
                                <LogOut className="w-5 h-5" />
                            </span>
                            <span className="font-medium text-sm">
                                {t("Logout")}
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* User profile */}
            <div className="p-4 border-t border-slate-700/50">
                <div className="flex items-center space-x-3">
                    <div className="bg-slate-800 p-1.5 rounded-full">
                        <div className="bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-300">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                            {auth.user.email}
                        </p>
                    </div>
                    <button className="ml-auto text-slate-400 hover:text-white">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Navigation;
