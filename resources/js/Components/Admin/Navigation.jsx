import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Settings,
    Users,
    Package,
    ShoppingCart,
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
    Shield,
    User,
    Menu,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRightLeft,
    Store,
    Zap,
    UserCheck,
    Key,
    Building2,
    X,
    Clock,
    Scan,
    FileText,
    Sun,
    Moon,
} from "lucide-react";

const Navigation = ({ auth, currentRoute }) => {
    const { t } = useLaravelReactI18n();
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({
        inventory: false,
        warehouse: false,
        attendance: false,
        users: false,
        system: false,
    });
    const [theme, setTheme] = useState(() => {
        // Check for saved theme preference or default to 'dark'
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            // Check if dark mode is already applied
            if (document.documentElement && document.documentElement.classList.contains('dark')) {
                return 'dark';
            }
            return 'dark'; // Default to dark
        }
        return 'dark';
    });

    // Apply theme to document
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        const root = document.documentElement;
        const body = document.body;
        
        if (root && body) {
            if (theme === 'dark') {
                root.classList.add('dark');
                body.classList.add('dark');
            } else {
                root.classList.remove('dark');
                body.classList.remove('dark');
            }
        }
        
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }, [theme]);

    // Initialize theme on mount and sync with DOM
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        const root = document.documentElement;
        const body = document.body;
        
        if (root && body) {
            // Check if DOM already has dark class
            const isDarkInDOM = root.classList.contains('dark');
            const savedTheme = localStorage.getItem('theme');
            
            // Sync theme state with DOM
            if (savedTheme && savedTheme !== theme) {
                setTheme(savedTheme);
            } else if (!savedTheme && isDarkInDOM && theme !== 'dark') {
                setTheme('dark');
            } else if (!savedTheme && !isDarkInDOM && theme !== 'light') {
                setTheme('light');
            }
            
            // Apply current theme to DOM
            if (theme === 'dark') {
                root.classList.add('dark');
                body.classList.add('dark');
            } else {
                root.classList.remove('dark');
                body.classList.remove('dark');
            }
        }
    }, []);

    // Listen for theme changes from other components
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        const handleThemeChange = (event) => {
            const { theme: newTheme } = event.detail;
            if (newTheme !== theme) {
                setTheme(newTheme);
            }
        };

        window.addEventListener('themeChanged', handleThemeChange);
        return () => window.removeEventListener('themeChanged', handleThemeChange);
    }, [theme]);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
            return newTheme;
        });
    };

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
        // Only run on client side
        if (typeof window === 'undefined') return;
        
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
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        if (document.body) {
            if (isMobileMenuOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "unset";
            }
        }

        return () => {
            if (document.body) {
                document.body.style.overflow = "unset";
            }
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
                case "admin.employees.verify":
                    return "/adminpanel/employees/verify";
                case "admin.employees.manual-attendance":
                    return "/adminpanel/employees/manual-attendance";
                case "admin.employees.attendance-report":
                    return "/adminpanel/employees/attendance-report";
                case "admin.attendance-settings.index":
                    return "/adminpanel/attendance-settings";
                case "admin.gates.index":
                    return "/adminpanel/gates";
                case "admin.customers.index":
                    return "/adminpanel/customers";
                case "admin.customer-users.index":
                    return "/adminpanel/customer-users";
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
                case "admin.activity-logs.index":
                    return "/adminpanel/activity-logs";
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
            items: [
                {
                    name: t("Dashboard"),
                    icon: <Home className="w-5 h-5" />,
                    route: "admin.dashboard",
                    active: currentRoute === "admin.dashboard",
                },
                {
                    name: t("Purchases"),
                    icon: <ShoppingCart className="w-5 h-5" />,
                    route: "admin.purchases.index",
                    active: currentRoute?.startsWith("admin.purchases"),
                    badge: "New",
                    permission: "view_any_purchase",
                },
            ],
        },
        {
            title: t("Warehouse Operations"),
            key: "warehouse",
            icon: <Warehouse className="w-4 h-4" />,
            items: [
                {
                    name: t("Batches"),
                    icon: <Store className="w-5 h-5" />,
                    route: "admin.batches.index",
                    active: currentRoute?.includes("batches"),
                    // permission: "view_any_batch",
                },
                {
                    name: t("Customer Transfers"),
                    icon: <Store className="w-5 h-5" />,
                    route: "admin.customer-transfers.index",
                    active: currentRoute?.includes("customer-transfers"),
                    permission: "view_any_customer_transfer",
                },
                {
                    name: t("Move to shop"),
                    icon: <Store className="w-5 h-5" />,
                    route: "admin.sales.index",
                    active: currentRoute?.includes("sales"),
                    permission: "view_any_sale",
                },
                {
                    name: t("Import"),
                    icon: <ArrowDownRight className="w-5 h-5" />,
                    route: "admin.incomes.index",
                    active: currentRoute?.includes("income"),
                    permission: "view_any_income",
                },
                {
                    name: t("Export"),
                    icon: <ArrowUpRight className="w-5 h-5" />,
                    route: "admin.outcomes.index",
                    active: currentRoute?.includes("outcome"),
                    permission: "view_any_outcome",
                },
                {
                    name: t("Transfers"),
                    icon: <ArrowRightLeft className="w-5 h-5" />,
                    route: "admin.transfers.index",
                    active: currentRoute?.includes("transfers"),    
                    permission: "view_any_transfer",
                },
            ],
        },
        {
            title: t("Employee Attendance"),
            key: "attendance",
            icon: <Users className="w-4 h-4" />,
            items: [
                {
                    name: t("Employees"),
                    icon: <Users className="w-5 h-5" />,
                    route: "admin.employees.index",
                    active: currentRoute?.startsWith("admin.employees") &&
                           currentRoute !== "admin.employees.verify" &&
                           currentRoute !== "admin.employees.manual-attendance" &&
                           currentRoute !== "admin.employees.attendance-report" &&
                           currentRoute !== "admin.employees.face",
                    permission: "view_any_employee",
                },
                {
                    name: t("Face Recognition"),
                    icon: <Scan className="w-5 h-5" />,
                    route: "admin.employees.face",
                    active: currentRoute === "admin.employees.face",
                    badge: "AI",
                    permission: "view_any_employee",
                },
                {
                    name: t("Employee Verification"),
                    icon: <Scan className="w-5 h-5" />,
                    route: "admin.employees.verify",
                    active: currentRoute === "admin.employees.verify",
                    badge: "Live",
                    permission: "view_any_employee",
                },
                {
                    name: t("Manual Attendance"),
                    icon: <Clock className="w-5 h-5" />,
                    route: "admin.employees.manual-attendance",
                    active: currentRoute === "admin.employees.manual-attendance",
                    badge: "New",
                    permission: "view_any_employee",
                },
                {
                    name: t("Attendance Report"),
                    icon: <FileText className="w-5 h-5" />,
                    route: "admin.employees.attendance-report",
                    active: currentRoute === "admin.employees.attendance-report",
                    badge: "Hot",
                    permission: "view_any_employee",
                },
                {
                    name: t("Attendance Settings"),
                    icon: <Clock className="w-5 h-5" />,
                    route: "admin.attendance-settings.index",
                    active: currentRoute?.startsWith("admin.attendance-settings"),
                    permission: "view_any_employee",
                },
                {
                    name: t("Gates"),
                    icon: <Building2 className="w-5 h-5" />,
                    route: "admin.gates.index",
                    active: currentRoute?.startsWith("admin.gates"),
                    permission: "view_any_gate",
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
                    permission: "view_any_user",
                    badge: "New",
                },
                {
                    name: t("Roles"),
                    icon: <Shield className="w-5 h-5" />,
                    route: "admin.roles.index",
                    active: currentRoute?.startsWith("admin.roles"),
                    permission: "view_any_role",
                },
                {
                    name: t("Permissions"),
                    icon: <Key className="w-5 h-5" />,
                    route: "admin.permissions.index",
                    active: currentRoute?.startsWith("admin.permissions"),
                    permission: "view_any_permission",
                    badge: "Hot",
                },
                // Moved items below
                {
                    name: t("Products"),
                    icon: <Package className="w-5 h-5" />,
                    route: "admin.products.index",
                    active: currentRoute?.startsWith("admin.products"),
                    badge: "Hot",
                    permission: "view_any_product",
                },
                {
                    name: t("Warehouses"),
                    icon: <Warehouse className="w-5 h-5" />,
                    route: "admin.warehouses.index",
                    active: currentRoute?.startsWith("admin.warehouses"),
                    permission: "view_any_warehouse",
                },
                {
                    name: t("Currencies"),
                    icon: <Globe className="w-5 h-5" />,
                    route: "admin.currencies.index",
                    active: currentRoute?.startsWith("admin.currencies"),
                    permission: "view_any_currency",
                },
                {
                    name: t("Units"),
                    icon: <Ruler className="w-5 h-5" />,
                    route: "admin.units.index",
                    active: currentRoute?.startsWith("admin.units"),
                    permission: "view_any_unit",
                },
                {
                    name: t("Suppliers"),
                    icon: <Truck className="w-5 h-5" />,
                    route: "admin.suppliers.index",
                    active: currentRoute?.startsWith("admin.suppliers"),
                    permission: "view_any_supplier",
                },
                {
                    name: t("Stores"),
                    icon: <ShoppingCart className="w-5 h-5" />,
                    route: "admin.customers.index",
                    active: currentRoute?.startsWith("admin.customers"),
                    permission: "view_any_customer",
                },
                {
                    name: t("Store Users"),
                    icon: <UserCheck className="w-5 h-5" />,
                    route: "admin.customer-users.index",
                    active: currentRoute?.startsWith("admin.customer-users"),
                    permission: "view_any_customer_user",
                },
                {
                    name: t("Accounts"),
                    icon: <CreditCard className="w-5 h-5" />,
                    route: "admin.accounts.index",
                    active: currentRoute?.startsWith("admin.accounts"),
                    permission: "view_any_account",
                },
            ],
        },
        {
            title: t("System Configuration"),
            key: "system",
            icon: <Settings className="w-4 h-4" />,
            items: [
                {
                    name: t("Activity Logs"),
                    icon: <FileText className="w-5 h-5" />,
                    route: "admin.activity-logs.index",
                    active: currentRoute?.startsWith("admin.activity-logs"),
                    permission: "view_activity_logs",
                    badge: "Monitor",
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
                    bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl shadow-lg backdrop-blur-sm
                    border border-gray-200 dark:border-slate-700
                    hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl
                    active:scale-95 transform transition-all duration-200
                    ${isMobileMenuOpen ? "bg-white dark:bg-slate-900" : ""}
                    ${isAnimating ? "pointer-events-none" : "hover:scale-105"}
                `}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
            >
                <div className="relative w-6 h-6 flex items-center justify-center">
                    <Menu
                        className={`w-6 h-6 text-gray-700 dark:text-white absolute transition-all duration-300 transform ${
                            isMobileMenuOpen
                                ? "opacity-0 rotate-180 scale-0"
                                : "opacity-100 rotate-0 scale-100"
                        }`}
                    />
                    <X
                        className={`w-6 h-6 text-gray-700 dark:text-white absolute transition-all duration-300 transform ${
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
                    bg-white dark:bg-slate-900 text-gray-900 dark:text-white
                    flex-shrink-0 flex flex-col h-screen shadow-xl border-r border-gray-200 dark:border-slate-700 z-[60]
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
                {/* Professional Header */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-20"></div>
                                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {t("Admin Panel")}
                                </h1>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    {t("Management System")}
                                </p>
                            </div>
                        </div>
                        
                        {/* Enhanced Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="relative p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200 group backdrop-blur-sm"
                            title={theme === 'dark' ? t('Switch to Light Mode') : t('Switch to Dark Mode')}
                            aria-label={theme === 'dark' ? t('Switch to Light Mode') : t('Switch to Dark Mode')}
                        >
                            <div className="relative w-5 h-5 flex items-center justify-center">
                                <Sun
                                    className={`w-5 h-5 text-amber-500 absolute transition-all duration-300 transform ${
                                        theme === 'light'
                                            ? 'opacity-100 rotate-0 scale-100'
                                            : 'opacity-0 -rotate-90 scale-0'
                                    }`}
                                />
                                <Moon
                                    className={`w-5 h-5 text-slate-600 dark:text-blue-400 absolute transition-all duration-300 transform ${
                                        theme === 'dark'
                                            ? 'opacity-100 rotate-0 scale-100'
                                            : 'opacity-0 rotate-90 scale-0'
                                    }`}
                                />
                            </div>
                            
                            {/* Hover effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            
                            {/* Active indicator */}
                            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                                theme === 'dark' 
                                    ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                                    : 'bg-amber-500 shadow-lg shadow-amber-500/50'
                            }`}></div>
                        </button>
                    </div>
                </div>

                {/* Enhanced Navigation Content */}
                <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {navigationGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-6">
                            {/* Professional Group Header */}
                            <div className="px-6 mb-3">
                                {group.key ? (
                                    <button
                                        onClick={() => toggleGroup(group.key)}
                                        className="flex items-center justify-between w-full text-left group hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl p-3 transition-all duration-200 touch-manipulation"
                                        aria-expanded={expandedGroups[group.key]}
                                    >
                                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                                                <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                                    {group.icon}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors uppercase tracking-wider truncate">
                                                {group.title}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 ml-3">
                                            {expandedGroups[group.key] ? (
                                                <ChevronUp className="h-4 w-4 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-3 ml-2 p-2">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider truncate">
                                            {group.title}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Professional Group Items */}
                            {(!group.key || expandedGroups[group.key]) && (
                                <ul className="space-y-1 px-3">
                                    {group.items
                                        .filter(item => {
                                            if (!item.permission) return true;
                                            const hasPermission = auth.user.permissions?.includes(item.permission);
                                            return hasPermission;
                                        })
                                        .map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={safeRoute(item.route)}
                                                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden touch-manipulation ${
                                                    item.active
                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                        : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                                }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {/* Active indicator */}
                                                {item.active && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-sm"></div>
                                                )}

                                                {/* Icon */}
                                                <span
                                                    className={`transition-colors flex-shrink-0 ${
                                                        item.active
                                                            ? "text-white"
                                                            : "text-gray-500 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
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
                                                            <span className={`ml-2 px-2.5 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                                                                item.badge === 'Hot' 
                                                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse' 
                                                                    : item.badge === 'New'
                                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                                    : item.badge === 'Live'
                                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse'
                                                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                                            }`}>
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Active arrow */}
                                                {item.active && (
                                                    <ChevronRight className="h-4 w-4 text-white flex-shrink-0" />
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* Professional User Profile Section */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-20"></div>
                            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold text-white">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                {t("Administrator")}
                            </p>
                        </div>
                    </div>

                    {/* Professional Action Buttons */}
                    <div className="flex space-x-2">
                        <Link
                            href={safeRoute("admin.profile.edit")}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 shadow-sm hover:shadow-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                            title={t("Profile")}
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline font-medium">
                                {t("Profile")}
                            </span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-gray-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-500 shadow-sm hover:shadow-md"
                            title={t("Sign Out")}
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline font-medium">
                                {t("Sign Out")}
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Navigation;
