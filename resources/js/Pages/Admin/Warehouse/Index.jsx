import React, { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import {
    Search,
    Plus,
    Building2,
    ChevronRight,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Eye,
    AlertCircle,
    Filter,
    ArrowUpDown,
    MapPin,
    Users,
    Package,
    Activity,
    Warehouse,
    Zap,
    RefreshCw,
    Settings,
    Building,
    Shield,
    BarChart3,
    X,
    ChevronDown,
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
import { Input } from "@/Components/ui/input";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, warehouses = [], permissions = {} }) {
    console.log(warehouses);
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedWarehouses, setSelectedWarehouses] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const tableRef = useRef(null);

    // Calculate statistics
    const stats = {
        total: warehouses?.length || 0,
        active: warehouses?.filter(w => w.is_active !== false)?.length || 0,
        withUsers: warehouses?.filter(w => w.users_count > 0)?.length || 0,
        withProducts: warehouses?.filter(w => w.products_count > 0)?.length || 0,
        totalCapacity: warehouses?.reduce((sum, w) => sum + (parseFloat(w.capacity) || 0), 0) || 0,
    };

    // Filter warehouses based on search term and filters
    const filteredWarehouses = warehouses
        ? warehouses.filter((warehouse) => {
              const matchesSearch =
                  (warehouse?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (warehouse?.code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (warehouse?.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (warehouse?.location || "").toLowerCase().includes(searchTerm.toLowerCase());

              const matchesStatus = filterStatus === "all" ||
                  (filterStatus === "active" && warehouse.is_active !== false) ||
                  (filterStatus === "inactive" && warehouse.is_active === false) ||
                  (filterStatus === "with_users" && warehouse.users_count > 0) ||
                  (filterStatus === "with_products" && warehouse.products_count > 0);

              return matchesSearch && matchesStatus;
          })
        : [];

    // Sort warehouses
    const sortedWarehouses = [...filteredWarehouses].sort((a, b) => {
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
        if (selectedWarehouses.length === sortedWarehouses.length) {
            setSelectedWarehouses([]);
        } else {
            setSelectedWarehouses(sortedWarehouses.map(w => w.id));
        }
    };

    const handleSelectWarehouse = (warehouseId) => {
        setSelectedWarehouses(prev =>
            prev.includes(warehouseId)
                ? prev.filter(id => id !== warehouseId)
                : [...prev, warehouseId]
        );
    };

    // Delete handler
    const handleDelete = (warehouseId) => {
        if (confirm(t("Are you sure you want to delete this warehouse?"))) {
            router.delete(route("admin.warehouses.destroy", warehouseId));
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
        <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {title}
                        </p>
                        <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>
                            {typeof value === 'number' && value > 999 ?
                                `${(value / 1000).toFixed(1)}k` :
                                value.toLocaleString()
                            }
                        </p>
                        {subtitle && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-500 to-${color}-600`}></div>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title={t("Warehouses")}>
                <style>{`
                    .scrollbar-thin::-webkit-scrollbar {
                        width: 6px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb {
                        background: rgba(148, 163, 184, 0.5);
                        border-radius: 3px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                        background: rgba(148, 163, 184, 0.7);
                    }
                    .dark .scrollbar-thin::-webkit-scrollbar-thumb {
                        background: rgba(71, 85, 105, 0.5);
                    }
                    .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                        background: rgba(71, 85, 105, 0.7);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <header ref={headerRef} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 px-8 sticky top-0 z-40 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Building2 className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Zap className="w-4 h-4" />
                                        {t("Warehouse Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Warehouses")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {t("Manage your warehouse facilities and storage locations")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Button 
                                    variant="outline" 
                                    className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    {t("Refresh")}
                                </Button>
                                {permissions.can_create && (
                                    <Link href={route("admin.warehouses.create")}>
                                        <Button className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0">
                                            <Plus className="h-4 w-4" />
                                            {t("Add Warehouse")}
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8 space-y-8">
                            {/* Statistics Cards */}
                            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <StatCard
                                    icon={Building2}
                                    title={t("Total Warehouses")}
                                    value={stats.total}
                                    subtitle={t("All facilities")}
                                    color="blue"
                                />
                                <StatCard
                                    icon={CheckCircle}
                                    title={t("Active")}
                                    value={stats.active}
                                    subtitle={t("Operational")}
                                    color="green"
                                />
                                <StatCard
                                    icon={Users}
                                    title={t("With Users")}
                                    value={stats.withUsers}
                                    subtitle={t("Staffed facilities")}
                                    color="purple"
                                />
                                <StatCard
                                    icon={Package}
                                    title={t("With Products")}
                                    value={stats.withProducts}
                                    subtitle={t("Stocked facilities")}
                                    color="orange"
                                />
                                <StatCard
                                    icon={BarChart3}
                                    title={t("Total Capacity")}
                                    value={stats.totalCapacity}
                                    subtitle={t("Storage units")}
                                    color="indigo"
                                />
                            </div>

                            {/* Enhanced Search & Filter Card */}
                            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            {t("Search & Filter")}
                                        </CardTitle>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <Filter className="h-4 w-4" />
                                            {showFilters ? t("Hide Filters") : t("Show Filters")}
                                            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {/* Search Bar */}
                                    <div className="mb-4">
                                        <div className="relative w-full">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                placeholder={t("Search warehouses by name, code, or location...")}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-12 h-12 text-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 rounded-lg w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            />
                                            {searchTerm && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSearchTerm("")}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Advanced Filters */}
                                    <AnimatePresence>
                                        {showFilters && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                }}
                                                className="relative"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="relative z-50">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            {t("Status")}
                                                        </label>
                                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                            <SelectTrigger className="h-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                                                <SelectValue>
                                                                    {filterStatus === "all" 
                                                                        ? t("All Warehouses") 
                                                                        : filterStatus === "active" 
                                                                        ? t("Active Only") 
                                                                        : filterStatus === "inactive" 
                                                                        ? t("Inactive Only") 
                                                                        : filterStatus === "with_users" 
                                                                        ? t("With Users") 
                                                                        : filterStatus === "with_products" 
                                                                        ? t("With Products") 
                                                                        : t("Select status")}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent position="popper" sideOffset={5} className="z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                                                                <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    {t("All Warehouses")}
                                                                </SelectItem>
                                                                <SelectItem value="active" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    {t("Active Only")}
                                                                </SelectItem>
                                                                <SelectItem value="inactive" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    {t("Inactive Only")}
                                                                </SelectItem>
                                                                <SelectItem value="with_users" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    {t("With Users")}
                                                                </SelectItem>
                                                                <SelectItem value="with_products" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    {t("With Products")}
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex items-end">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setFilterStatus("all");
                                                                setSearchTerm("");
                                                            }}
                                                            className="w-full h-10 gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                            {t("Clear Filters")}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Results Summary */}
                                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                        <div>
                                            {t("Showing")} <span className="font-medium">{sortedWarehouses.length}</span> {t("of")} <span className="font-medium">{warehouses?.length || 0}</span> {t("warehouses")}
                                        </div>
                                        {selectedWarehouses.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span>{selectedWarehouses.length} {t("selected")}</span>
                                                <Button variant="outline" size="sm">
                                                    {t("Bulk Actions")}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Warehouses Grid */}
                            <div ref={tableRef} className="space-y-6">
                                {sortedWarehouses.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        <AnimatePresence>
                                            {sortedWarehouses.map((warehouse, index) => (
                                                <motion.div
                                                    key={warehouse.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300">
                                                        <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 border-b border-slate-200 dark:border-slate-600 rounded-t-xl">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                                        <Building2 className="h-6 w-6 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                                                            {warehouse.name}
                                                                        </CardTitle>
                                                                        <p className="text-sm text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                                            {warehouse.code}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Badge
                                                                    variant={warehouse.is_active ? "default" : "secondary"}
                                                                    className={`px-3 py-1 text-sm font-medium ${
                                                                        warehouse.is_active
                                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                                    }`}
                                                                >
                                                                    {warehouse.is_active ? (
                                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                                    ) : (
                                                                        <XCircle className="h-4 w-4 mr-1" />
                                                                    )}
                                                                    {warehouse.is_active ? t("Active") : t("Inactive")}
                                                                </Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-6">
                                                            <div className="space-y-6">
                                                                {warehouse.description && (
                                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                                                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                                        {warehouse.description}
                                                                    </p>
                                                                    </div>
                                                                )}

                                                                <div className="grid grid-cols-2 gap-6">
                                                                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                                                {warehouse.users_count || 0}
                                                                            </div>
                                                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                                                {t("Users")}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                                            <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                                {warehouse.items_count || 0}
                                                                            </div>
                                                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                                                {t("Products")}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {warehouse.location && (
                                                                    <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                                            <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                                                {t("Location")}
                                                                            </div>
                                                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                                            {warehouse.location}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600 p-6">
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex items-center gap-3">
                                                                    {permissions.can_view && (
                                                                        <Link href={route("admin.warehouses.show", warehouse.id)}>
                                                                            <Button size="sm" variant="outline" className="h-10 w-10 p-0 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                                                                                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                            </Button>
                                                                        </Link>
                                                                    )}
                                                                    {permissions.can_update && (
                                                                        <Link href={route("admin.warehouses.edit", warehouse.id)}>
                                                                            <Button size="sm" variant="outline" className="h-10 w-10 p-0 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:border-green-600 dark:hover:bg-green-900/20 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 shadow-sm hover:shadow-md">
                                                                                <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                            </Button>
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                                {permissions.can_delete && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleDelete(warehouse.id)}
                                                                        className="h-10 w-10 p-0 border-2 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:border-red-600 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </CardFooter>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardContent className="p-12 text-center">
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                                                    <Building2 className="h-8 w-8 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                        {searchTerm ? t("No warehouses found") : t("No warehouses yet")}
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                                                        {searchTerm
                                                            ? t("Try adjusting your search criteria")
                                                            : t("Get started by creating your first warehouse")
                                                        }
                                                    </p>
                                                    {!searchTerm && permissions.can_create && (
                                                        <Link href={route("admin.warehouses.create")}>
                                                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                {t("Add First Warehouse")}
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
