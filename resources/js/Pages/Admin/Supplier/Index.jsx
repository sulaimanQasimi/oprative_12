import React, { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import {
    Search,
    Plus,
    Truck,
    CheckCircle,
    AlertCircle,
    Filter,
    ArrowUpDown,
    Phone,
    Mail,
    CreditCard,
    FileText,
    ShoppingBag,
    Building,
    Users,
    Activity,
    DollarSign,
    Package,
    Zap,
    RefreshCw,
    Settings,
    XCircle,
    Eye,
    Edit,
    Trash2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, suppliers = [], permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const tableRef = useRef(null);

    // Calculate statistics
    const stats = {
        total: suppliers?.length || 0,
        active: suppliers?.filter(s => s.is_active !== false)?.length || 0,
        withPurchases: suppliers?.filter(s => s.purchases_count > 0)?.length || 0,
        pending: suppliers?.filter(s => s.pending_payments > 0)?.length || 0,
        totalValue: suppliers?.reduce((sum, s) => sum + (parseFloat(s.total_purchases) || 0), 0) || 0,
    };

    // Filter suppliers based on search term and filters
    const filteredSuppliers = suppliers
        ? suppliers.filter((supplier) => {
              const matchesSearch =
                  (supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (supplier?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (supplier?.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (supplier?.contact_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (supplier?.id_number || "").toLowerCase().includes(searchTerm.toLowerCase());

              const matchesStatus = filterStatus === "all" ||
                  (filterStatus === "active" && supplier.is_active !== false) ||
                  (filterStatus === "inactive" && supplier.is_active === false) ||
                  (filterStatus === "with_purchases" && supplier.purchases_count > 0) ||
                  (filterStatus === "pending" && supplier.pending_payments > 0);

              return matchesSearch && matchesStatus;
          })
        : [];

    // Sort suppliers
    const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (aValue < bValue) {
            return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    });

    // Sort handler
    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Bulk actions
    const handleSelectAll = () => {
        if (selectedSuppliers.length === sortedSuppliers.length) {
            setSelectedSuppliers([]);
        } else {
            setSelectedSuppliers(sortedSuppliers.map(s => s.id));
        }
    };

    const handleSelectSupplier = (supplierId) => {
        setSelectedSuppliers(prev =>
            prev.includes(supplierId)
                ? prev.filter(id => id !== supplierId)
                : [...prev, supplierId]
        );
    };

    // Delete handler
    const handleDelete = (supplierId) => {
        if (confirm(t("Are you sure you want to delete this supplier?"))) {
            router.delete(route("admin.suppliers.destroy", supplierId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Add success notification
                },
                onError: () => {
                    // Optional: Add error notification
                }
            });
        }
    };

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Animate header
            anime({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-30, 0],
                duration: 800,
                easing: "easeOutExpo",
            });

            // Animate stats
            anime({
                targets: statsRef.current?.children,
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100),
                duration: 600,
                easing: "easeOutExpo",
            });

            // Animate table
            anime({
                targets: tableRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 700,
                easing: "easeOutExpo",
                delay: 400,
            });

            setIsAnimated(true);
        }
    }, [isAnimated]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "indigo" }) => (
        <Card className="stat-card relative overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {title}
                        </p>
                        <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>
                            {typeof value === 'number' && title.includes('Value')
                                ? `$${value.toLocaleString()}`
                                : value.toLocaleString()}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
                        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title={t("Supplier Management")}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }
                    .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
                        background-size: 20px 20px;
                    }
                    .dark .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    }
                    .glass-effect {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                    }
                    .dark .glass-effect {
                        background: rgba(15, 23, 42, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                    }
                    .table-row {
                        transition: all 0.3s ease;
                        background: linear-gradient(to right, transparent, transparent);
                    }
                    .table-row:hover {
                        background: linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
                        transform: translateX(4px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .dark .table-row:hover {
                        background: linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
                    }
                    .stat-card {
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    }
                    .dark .stat-card {
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }
                    .content-card {
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    }
                    .dark .content-card {
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }
                    .search-input {
                        background: rgba(255, 255, 255, 1);
                        border: 1px solid rgba(226, 232, 240, 1);
                        transition: all 0.2s ease-in-out;
                    }
                    .dark .search-input {
                        background: rgba(30, 41, 59, 1);
                        border: 1px solid rgba(51, 65, 85, 1);
                    }
                    .search-input:focus {
                        border-color: #6366f1;
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                    }
                    .dark .search-input:focus {
                        border-color: #818cf8;
                        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
                    }
                    .supplier-dropdown {
                        position: absolute !important;
                        z-index: 50 !important;
                        width: 10rem !important;
                        top: 100% !important;
                        left: 0 !important;
                        margin-top: 0.25rem !important;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-grid-pattern overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.suppliers" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <header
                        ref={headerRef}
                        className="glass-effect border-b border-slate-200/50 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25"></div>
                                    <div className="relative bg-white dark:bg-slate-900 p-3 rounded-lg">
                                        <Truck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                                            {t("Supply Chain Management")}
                                        </span>
                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700">
                                            Live
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
                                        {t("Supplier Management")}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                        {t("Manage your supplier network and relationships")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                {permissions.can_create && (
                                    <Link href={route("admin.suppliers.create")}>
                                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                                            <Plus className="h-4 w-4 mr-2" />
                                            {t("Add Supplier")}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Statistics Cards */}
                            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <StatCard
                                    icon={Building}
                                    title={t("Total Suppliers")}
                                    value={stats.total}
                                    subtitle={t("All registered suppliers")}
                                    color="indigo"
                                />
                                <StatCard
                                    icon={CheckCircle}
                                    title={t("Active Suppliers")}
                                    value={stats.active}
                                    subtitle={t("Currently working with")}
                                    color="green"
                                />
                                <StatCard
                                    icon={ShoppingBag}
                                    title={t("With Purchases")}
                                    value={stats.withPurchases}
                                    subtitle={t("Have purchase history")}
                                    color="blue"
                                />
                                <StatCard
                                    icon={AlertCircle}
                                    title={t("Pending Payments")}
                                    value={stats.pending}
                                    subtitle={t("Outstanding balances")}
                                    color="orange"
                                />
                                <StatCard
                                    icon={DollarSign}
                                    title={t("Total Value")}
                                    value={stats.totalValue}
                                    subtitle={t("Total purchase value")}
                                    color="emerald"
                                />
                            </div>

                            {/* Enhanced Filters and Search */}
                            <Card className="content-card overflow-visible">
                                <CardContent className="p-6 overflow-visible">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        {/* Search */}
                                        <div className="flex-1 max-w-md">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder={t("Search suppliers, contacts, emails...")}
                                                    className="search-input w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                {searchTerm && (
                                                    <button
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                        onClick={() => setSearchTerm("")}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Filters */}
                                        <div className="flex items-center gap-3">
                                            <div className="relative z-50">
                                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                    <SelectTrigger className="w-40 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                                        <SelectValue placeholder={t("Status")} />
                                                    </SelectTrigger>
                                                    <SelectContent className="supplier-dropdown bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg">
                                                        <SelectItem value="all">{t("All Status")}</SelectItem>
                                                        <SelectItem value="active">{t("Active")}</SelectItem>
                                                        <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                                                        <SelectItem value="with_purchases">{t("With Purchases")}</SelectItem>
                                                        <SelectItem value="pending">{t("Pending Payments")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Button variant="outline" size="sm" className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                {t("Refresh")}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Results Summary */}
                                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                        <div>
                                            {t("Showing")} <span className="font-medium">{sortedSuppliers.length}</span> {t("of")} <span className="font-medium">{suppliers?.length || 0}</span> {t("suppliers")}
                                        </div>
                                        {selectedSuppliers.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span>{selectedSuppliers.length} {t("selected")}</span>
                                                <Button variant="outline" size="sm">
                                                    {t("Bulk Actions")}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enhanced Suppliers Table */}
                            <Card ref={tableRef} className="content-card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b-2 border-slate-200 dark:border-slate-600">
                                                <th className="px-6 py-5 text-left">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSuppliers.length === sortedSuppliers.length && sortedSuppliers.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:focus:ring-indigo-400 scale-110"
                                                    />
                                                </th>
                                                <th
                                                    className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                                                    onClick={() => handleSort("name")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Building className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        <span>{t("Supplier")}</span>
                                                        <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                                                    onClick={() => handleSort("contact_name")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        <span>{t("Contact")}</span>
                                                        <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                    </div>
                                                </th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        <span>{t("Email")}</span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{t("Phone")}</span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        <span>{t("ID Number")}</span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="h-4 w-4" />
                                                        <span>{t("Status")}</span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Settings className="h-4 w-4" />
                                                        <span>{t("Actions")}</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            <AnimatePresence>
                                                {sortedSuppliers.map((supplier, index) => (
                                                    <motion.tr
                                                        key={supplier.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        className="table-row rounded-lg"
                                                    >
                                                        <td className="px-6 py-5">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSuppliers.includes(supplier.id)}
                                                                onChange={() => handleSelectSupplier(supplier.id)}
                                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:focus:ring-indigo-400 scale-110"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative">
                                                                    <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center shadow-md">
                                                                        <Truck className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                        {supplier.name}
                                                                    </div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                        {supplier.city}, {supplier.country}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="font-medium text-slate-900 dark:text-white">
                                                                {supplier.contact_name || "—"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="text-slate-600 dark:text-slate-400">
                                                                {supplier.email || "—"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="text-slate-600 dark:text-slate-400">
                                                                {supplier.phone || "—"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="font-mono text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg shadow-inner">
                                                                {supplier.id_number || "—"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex flex-wrap gap-2">
                                                                {supplier.is_active !== false && (
                                                                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-400 dark:border-green-700 shadow-sm">
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                        {t("Active")}
                                                                    </Badge>
                                                                )}
                                                                {(supplier.purchases_count || 0) > 0 && (
                                                                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400 dark:border-blue-700 shadow-sm">
                                                                        <ShoppingBag className="h-3 w-3 mr-1" />
                                                                        {t("Has Orders")}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center justify-center gap-2">
                                                                {permissions.can_view && (
                                                                    <Link href={route("admin.suppliers.show", supplier.id)}>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700 shadow-sm"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                                {permissions.can_update && (
                                                                    <Link href={route("admin.suppliers.edit", supplier.id)}>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200 dark:hover:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-700 shadow-sm"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                                {permissions.can_delete && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDelete(supplier.id)}
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-700 shadow-sm"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>

                                {sortedSuppliers.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="relative inline-block">
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-25"></div>
                                            <div className="relative bg-white dark:bg-slate-900 p-6 rounded-full">
                                                <Truck className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 mt-6">
                                            {t("No suppliers found")}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                            {searchTerm || filterStatus !== "all"
                                                ? t("Try adjusting your search or filters to find what you're looking for")
                                                : t("Get started by adding your first supplier to the system")}
                                        </p>
                                        {(!searchTerm && filterStatus === "all" && permissions.can_create) && (
                                            <Link href={route("admin.suppliers.create")}>
                                                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    {t("Add Your First Supplier")}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
