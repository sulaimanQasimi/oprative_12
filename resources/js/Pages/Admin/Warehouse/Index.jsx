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

export default function Index({ auth, warehouses = [] }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedWarehouses, setSelectedWarehouses] = useState([]);

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
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:shadow-xl transition-all duration-300">
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
                        backdrop-filter: blur(20px);
                        background: rgba(255, 255, 255, 0.8);
                    }
                    .dark .glass-effect {
                        background: rgba(15, 23, 42, 0.8);
                    }
                    .warehouse-card {
                        transition: all 0.3s ease;
                    }
                    .warehouse-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    }
                    .dark .warehouse-card:hover {
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 bg-grid-pattern overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <header ref={headerRef} className="glass-effect border-b border-slate-200/50 dark:border-slate-800/50 py-6 px-8 sticky top-0 z-40">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25"></div>
                                    <div className="relative bg-white dark:bg-slate-900 p-3 rounded-lg">
                                        <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                            {t("Warehouse Management")}
                                        </span>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                            <Activity className="h-3 w-3 mr-1" />
                                            {stats.total} {t("Total")}
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                        {t("Warehouses")}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        {t("Manage your warehouse facilities and storage locations")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Button variant="outline" className="shadow-sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    {t("Refresh")}
                                </Button>
                                <Link href={route("admin.warehouses.create")}>
                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("Add Warehouse")}
                                    </Button>
                                </Link>
                            </div>
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

                            {/* Filters and Search */}
                            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="text"
                                                placeholder={t("Search warehouses by name, code, or location...")}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                <SelectTrigger className="w-48 bg-white/50 dark:bg-slate-800/50">
                                                    <Filter className="h-4 w-4 mr-2" />
                                                    <SelectValue placeholder={t("Filter by status")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">{t("All Warehouses")}</SelectItem>
                                                    <SelectItem value="active">{t("Active Only")}</SelectItem>
                                                    <SelectItem value="inactive">{t("Inactive Only")}</SelectItem>
                                                    <SelectItem value="with_users">{t("With Users")}</SelectItem>
                                                    <SelectItem value="with_products">{t("With Products")}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleSort("name")}
                                                className="bg-white/50 dark:bg-slate-800/50"
                                            >
                                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                                {t("Sort")}
                                            </Button>
                                        </div>
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
                                                    <Card className="warehouse-card border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
                                                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-slate-200/50 dark:border-slate-700/50">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                                        <Building2 className="h-5 w-5 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                                                            {warehouse.name}
                                                                        </CardTitle>
                                                                        <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                                                            {warehouse.code}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Badge
                                                                    variant={warehouse.is_active ? "default" : "secondary"}
                                                                    className={`${
                                                                        warehouse.is_active
                                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                                    }`}
                                                                >
                                                                    {warehouse.is_active ? (
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                    ) : (
                                                                        <XCircle className="h-3 w-3 mr-1" />
                                                                    )}
                                                                    {warehouse.is_active ? t("Active") : t("Inactive")}
                                                                </Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-6">
                                                            <div className="space-y-4">
                                                                {warehouse.description && (
                                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                                        {warehouse.description}
                                                                    </p>
                                                                )}

                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Users className="h-4 w-4 text-blue-500" />
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                                                            {warehouse.users_count || 0} {t("Users")}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Package className="h-4 w-4 text-green-500" />
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                                                            {warehouse.products_count || 0} {t("Products")}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {warehouse.location && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <MapPin className="h-4 w-4 text-orange-500" />
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                                                            {warehouse.location}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-700/50 p-4">
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex items-center space-x-2">
                                                                    <Link href={route("admin.warehouses.show", warehouse.id)}>
                                                                        <Button size="sm" variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-950/30">
                                                                            <Eye className="h-3 w-3 mr-1" />
                                                                            {t("View")}
                                                                        </Button>
                                                                    </Link>
                                                                    <Link href={route("admin.warehouses.edit", warehouse.id)}>
                                                                        <Button size="sm" variant="outline" className="hover:bg-green-50 dark:hover:bg-green-950/30">
                                                                            <Edit className="h-3 w-3 mr-1" />
                                                                            {t("Edit")}
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleDelete(warehouse.id)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </CardFooter>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
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
                                                    {!searchTerm && (
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
