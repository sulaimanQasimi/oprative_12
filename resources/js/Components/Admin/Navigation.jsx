import React, { useState, useEffect } from "react";
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
    Zap,
    UserCheck,
    Key,
    Building2,
    X,
} from "lucide-react";

const Navigation = ({ auth, currentRoute }) => {
    const { t } = useLaravelReactI18n();
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({
        inventory: false,
        warehouse: false,
        users: false,
        system: false,
    });

    const toggleMobileMenu = () => {
        if (isAnimating) return; // Prevent rapid clicking

        setIsAnimating(true);
        setIsMobileMenuOpen((prev) => !prev);

        // Reset animation lock after transition completes
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [url]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isMobileMenuOpen &&
                !event.target.closest(".mobile-menu") &&
                !event.target.closest(".mobile-menu-button") &&
                !isAnimating
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isMobileMenuOpen, isAnimating]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const toggleGroup = (groupKey) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupKey]: !prev[groupKey],
        }));
    };

    // Close mobile menu with animation
    const closeMobileMenu = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setIsMobileMenuOpen(false);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    // Helper function to safely access routes
    const safeRoute = (routeName) => {
        try {
            if (typeof route !== "undefined") {
                return route(routeName);
            }

            // Fallback URLs
            switch (routeName) {
                case "admin.dashboard":
                    return "/adminpanel/dashboard";
                case "admin.profile.edit":
                    return "/adminpanel/profile";
                case "admin.products.index":
                    return "/adminpanel/products";
                case "admin.suppliers.index":
                    return "/adminpanel/suppliers";
                case "admin.warehouses.index":
                    return "/adminpanel/warehouses";
                case "admin.warehouses.sales":
                    return "/adminpanel/warehouses/sales";
                case "admin.warehouses.income":
                    return "/adminpanel/warehouses/income";
                case "admin.warehouses.outcome":
                    return "/adminpanel/warehouses/outcome";
                case "admin.warehouses.transfers":
                    return "/adminpanel/warehouses/transfers";
                case "admin.units.index":
                    return "/adminpanel/units";
                case "admin.currencies.index":
                    return "/adminpanel/currencies";
                case "admin.employees.index":
                    return "/adminpanel/employees";
                case "admin.customers.index":
                    return "/adminpanel/customers";
                case "admin.accounts.index":
                    return "/adminpanel/accounts";
                case "admin.purchases.index":
                    return "/adminpanel/purchases";
                case "admin.purchases.create":
                    return "/adminpanel/purchases/create";
                case "admin.purchases.show":
                    return "/adminpanel/purchases/show";
                case "admin.purchases.edit":
                    return "/adminpanel/purchases/edit";
                case "admin.users.index":
                    return "/adminpanel/users";
                case "admin.roles.index":
                    return "/adminpanel/roles";
                case "admin.permissions.index":
                    return "/adminpanel/permissions";
                default:
                    return "#";
            }
        } catch (error) {
            console.error(`Route not found: ${routeName}`, error);
            return "#";
        }
    };

    // Handle logout
    const handleLogout = () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/adminpanel/logout";

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        if (csrfToken) {
            const csrfInput = document.createElement("input");
            csrfInput.type = "hidden";
            csrfInput.name = "_token";
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
                {
                    name: t("Purchases"),
                    icon: <ShoppingCart className="w-5 h-5" />,
                    route: "admin.purchases.index",
                    active: currentRoute?.startsWith("admin.purchases"),
                    badge: "New",
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
                    icon: <Building2 className="w-5 h-5" />,
                    route: "admin.warehouses.index",
                    active: currentRoute === "admin.warehouses.index",
                },
                {
                    name: t("Shop Sales"),
                    icon: <Store className="w-5 h-5" />,
                    route: "admin.warehouses.sales",
                    active: currentRoute?.includes("sales"),
                },
                {
                    name: t("Income"),
                    icon: <ArrowDownRight className="w-5 h-5" />,
                    route: "admin.warehouses.income",
                    active: currentRoute?.includes("income"),
                },
                {
                    name: t("Outcome"),
                    icon: <ArrowUpRight className="w-5 h-5" />,
                    route: "admin.warehouses.outcome",
                    active: currentRoute?.includes("outcome"),
                },
                {
                    name: t("Transfers"),
                    icon: <ArrowRightLeft className="w-5 h-5" />,
                    route: "admin.warehouses.transfers",
                    active: currentRoute?.includes("transfers"),
                },
            ],
        },
        {
            title: t("User Management"),
            key: "users",
            icon: <UserCheck className="w-4 h-4" />,
            items: [
                {
                    name: t("Users"),
                    icon: <Users className="w-5 h-5" />,
                    route: "admin.users.index",
                    active: currentRoute?.startsWith("admin.users"),
                },
                {
                    name: t("Roles"),
                    icon: <Shield className="w-5 h-5" />,
                    route: "admin.roles.index",
                    active: currentRoute?.startsWith("admin.roles"),
                },
                {
                    name: t("Permissions"),
                    icon: <Key className="w-5 h-5" />,
                    route: "admin.permissions.index",
                    active: currentRoute?.startsWith("admin.permissions"),
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
        <>
            {/* Mobile Menu Button */}
            <button
                type="button"
                onClick={toggleMobileMenu}
                disabled={isAnimating}
                className={`mobile-menu-button fixed top-4 right-4 z-[70] md:hidden
                    bg-gradient-to-br from-slate-900 to-slate-800 p-3 rounded-xl shadow-xl
                    border border-slate-700/50 backdrop-blur-sm
                    hover:bg-gradient-to-br hover:from-slate-800 hover:to-slate-700
                    active:scale-95 transform transition-all duration-200
                    ${isMobileMenuOpen ? "bg-slate-800" : ""}
                    ${isAnimating ? "pointer-events-none" : "hover:scale-105"}
                `}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
            >
                <div className="relative w-6 h-6 flex items-center justify-center">
                    <Menu
                        className={`w-6 h-6 text-white absolute transition-all duration-300 transform ${
                            isMobileMenuOpen
                                ? "opacity-0 rotate-180 scale-0"
                                : "opacity-100 rotate-0 scale-100"
                        }`}
                    />
                    <X
                        className={`w-6 h-6 text-white absolute transition-all duration-300 transform ${
                            isMobileMenuOpen
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-180 scale-0"
                        }`}
                    />
                </div>
            </button>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-all duration-300 ${
                    isMobileMenuOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                }`}
                onClick={() => !isAnimating && setIsMobileMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Navigation Sidebar */}
            <aside
                className={`mobile-menu
                    fixed md:relative
                    w-80 sm:w-72 md:w-72
                    bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white
                    flex-shrink-0 flex flex-col h-screen shadow-2xl border-l md:border-r md:border-l-0 border-slate-700/50 z-[60]
                    transition-all duration-300 ease-out right-0 md:left-0 top-0
                    ${
                        isMobileMenuOpen
                            ? "translate-x-0"
                            : "translate-x-full md:translate-x-0"
                    }
                    ${
                        isAnimating
                            ? "pointer-events-none md:pointer-events-auto"
                            : ""
                    }
                `}
                role="navigation"
                aria-label="Main navigation"
                aria-hidden={!isMobileMenuOpen}
            >
                {/* Enhanced Logo and branding */}
                <div className="p-4 sm:p-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl blur opacity-75"></div>
                            <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="font-bold text-base sm:text-lg text-white truncate">
                                {t("Admin Panel")}
                            </h1>
                            <p className="text-xs text-blue-400 font-medium truncate">
                                {t("Management System")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Navigation links */}
                <nav className="flex-1 overflow-y-auto py-3 sm:py-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {navigationGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-3 sm:mb-4">
                            {/* Group Header */}
                            <div className="px-3 sm:px-4 mb-2">
                                {group.key ? (
                                    <button
                                        onClick={() => toggleGroup(group.key)}
                                        className="flex items-center justify-between w-full text-left group hover:bg-slate-800/50 rounded-lg p-3 transition-all duration-200 touch-manipulation"
                                        aria-expanded={
                                            expandedGroups[group.key]
                                        }
                                    >
                                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                                            <span className="text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0">
                                                {group.icon}
                                            </span>
                                            <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-wider truncate">
                                                {group.title}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 ml-2">
                                            {expandedGroups[group.key] ? (
                                                <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-2 ml-2 p-2">
                                        <span className="text-blue-400 flex-shrink-0">
                                            <Home className="w-3 h-3" />
                                        </span>
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider truncate">
                                            {group.title}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Group Items */}
                            {(!group.key || expandedGroups[group.key]) && (
                                <ul className="space-y-1 px-2 sm:px-2">
                                    {group.items.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={safeRoute(item.route)}
                                                className={`group flex items-center space-x-3 px-3 py-3 sm:py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden touch-manipulation ${
                                                    item.active
                                                        ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white shadow-lg border border-blue-500/30 backdrop-blur-sm"
                                                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                                }`}
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
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
                                                        <span className="font-medium text-sm truncate">
                                                            {item.name}
                                                        </span>
                                                        {item.badge && (
                                                            <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full animate-pulse flex-shrink-0">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Active arrow */}
                                                {item.active && (
                                                    <ChevronRight className="h-3 w-3 text-blue-400 flex-shrink-0" />
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
                <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm space-y-3">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full blur opacity-60"></div>
                            <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold text-white">
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
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                                <span className="text-xs text-green-400 font-medium truncate">
                                    {t("Administrator")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-1">
                        <Link
                            href={safeRoute("admin.profile.edit")}
                            className="group w-full flex items-center space-x-2 px-3 py-3 rounded-lg transition-all duration-200 text-slate-400 hover:text-white hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 touch-manipulation"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0">
                                <User className="w-4 h-4" />
                            </span>
                            <span className="font-medium text-xs flex-1 truncate">
                                {t("Profile")}
                            </span>
                            <ChevronRight className="h-3 w-3 ml-auto group-hover:translate-x-1 transition-transform flex-shrink-0" />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="group w-full flex items-center space-x-2 px-3 py-3 rounded-lg transition-all duration-200 text-slate-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 touch-manipulation"
                        >
                            <span className="text-slate-500 group-hover:text-red-400 transition-colors flex-shrink-0">
                                <LogOut className="w-4 h-4" />
                            </span>
                            <span className="font-medium text-xs flex-1 truncate">
                                {t("Sign Out")}
                            </span>
                            <ChevronRight className="h-3 w-3 ml-auto group-hover:translate-x-1 transition-transform flex-shrink-0" />
                        </button>
                    </div>

                    {/* Status indicator */}
                    <div className="pt-2 border-t border-slate-700/50">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                                <span className="text-slate-400 truncate">
                                    {t("System Online")}
                                </span>
                            </div>
                            <span className="text-slate-500 text-xs flex-shrink-0 ml-2">
                                {new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Navigation;
