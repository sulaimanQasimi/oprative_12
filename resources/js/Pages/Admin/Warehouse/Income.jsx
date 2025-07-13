import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    TrendingUp,
    Search,
    Plus,
    Package,
    Calendar,
    DollarSign,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    Sparkles,
    ChevronDown,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function Income({ auth, warehouse, incomes, filters = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [dateFilter, setDateFilter] = useState(filters.date_filter || "");
    const [batchFilter, setBatchFilter] = useState(filters.batch_filter || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "desc");
    const [showFilters, setShowFilters] = useState(false);
    const [perPage, setPerPage] = useState(filters.per_page || 15);
    const [filteredIncomes, setFilteredIncomes] = useState(incomes?.data || []);

    // Safety check for incomes data
    const incomesData = incomes?.data || [];
    const paginationInfo = {
        current_page: incomes?.current_page || 1,
        last_page: incomes?.last_page || 1,
        from: incomes?.from || 0,
        to: incomes?.to || 0,
        total: incomes?.total || 0,
        links: incomes?.links || []
    };

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Handle search/filter
    const handleSearch = () => {
        router.get(route('admin.warehouses.income', warehouse.id), {
            search: searchTerm,
            date_filter: dateFilter,
            batch_filter: batchFilter,
            sort_by: sortBy,
            sort_order: sortOrder,
            per_page: perPage,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDateFilter("");
        setBatchFilter("");
        setSortBy("created_at");
        setSortOrder("desc");
        setPerPage(15);
        router.get(route('admin.warehouses.income', warehouse.id));
    };

    // Update filtered incomes when incomes data changes
    useEffect(() => {
        setFilteredIncomes(incomes?.data || []);
    }, [incomes?.data]);

    // Calculate totals
    const totalImports = (filteredIncomes || []).length;
    const totalQuantity = (filteredIncomes || []).reduce((sum, income) => {
        // For wholesale items, show the actual wholesale quantity (not the converted retail units)
        if (income.is_wholesale && income.unit_amount) {
            return sum + (income.quantity / income.unit_amount);
        }
        return sum + (income.quantity || 0);
    }, 0);
    const totalValue = (filteredIncomes || []).reduce((sum, income) => sum + (income.total || 0), 0);
    const avgImportValue = totalImports > 0 ? totalValue / totalImports : 0;

    // Calculate batch statistics
    const batchStats = (filteredIncomes || []).reduce((stats, income) => {
        if (income.batch) {
            stats.withBatch++;
            stats.totalBatchValue += income.batch.total || 0;
            stats.totalBatchQuantity += income.batch.quantity || 0;
            
            if (income.batch.expire_date) {
                const expireDate = new Date(income.batch.expire_date);
                const now = new Date();
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                
                if (expireDate < now) {
                    stats.expired++;
                    stats.expiredValue += income.batch.total || 0;
                } else if (expireDate <= thirtyDaysFromNow) {
                    stats.expiringSoon++;
                    stats.expiringSoonValue += income.batch.total || 0;
                } else {
                    stats.valid++;
                    stats.validValue += income.batch.total || 0;
                }
            }
        } else {
            stats.withoutBatch++;
        }
        return stats;
    }, { 
        withBatch: 0, 
        withoutBatch: 0, 
        expired: 0, 
        expiringSoon: 0, 
        valid: 0,
        totalBatchValue: 0,
        totalBatchQuantity: 0,
        expiredValue: 0,
        expiringSoonValue: 0,
        validValue: 0
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Persian date conversion function
    const toPersianDate = (gregorianDate) => {
        const date = new Date(gregorianDate);
        const gy = date.getFullYear();
        const gm = date.getMonth() + 1;
        const gd = date.getDate();
        
        // Check for leap year
        const isLeap = (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0);
        
        // Days in each Gregorian month
        const gdm = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Calculate number of days passed since start of Gregorian year
        let days = gd;
        for (let i = 0; i < gm - 1; i++) {
            days += gdm[i];
        }
        
        // Calculate the Persian year and day offset from March 21
        const marchDay = isLeap ? 80 : 79;
        let jy, jm, jd;
        
        if (days > marchDay) {
            jy = gy - 621;
            days = days - marchDay;
        } else {
            jy = gy - 622;
            const prevYearLeap = ((gy - 1) % 4 === 0 && (gy - 1) % 100 !== 0) || ((gy - 1) % 400 === 0);
            days = days + (prevYearLeap ? 286 : 285);
        }
        
        // Convert days into Persian month/day
        if (days <= 186) {
            jm = Math.floor((days - 1) / 31) + 1;
            jd = days - ((jm - 1) * 31);
        } else {
            days = days - 186;
            jm = Math.floor((days - 1) / 30) + 7;
            jd = days - ((jm - 7) * 30);
        }
        
        return {
            year: jy,
            month: jm,
            day: jd
        };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const persianDate = toPersianDate(dateString);
        
        
        const time = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        return `${persianDate.year}/${persianDate.month.toString().padStart(2, '0')}/${persianDate.day.toString().padStart(2, '0')} - ${time}`;
    };

    const formatPersianDateWithName = (dateString) => {
        const date = new Date(dateString);
        const persianDate = toPersianDate(dateString);
        
              // Persian month names
              const persianMonths = [
                "حمل","ثور","جوزا","سرطان","اسد","سنبله","میزان","عقرب","قوس","جدی","دلو","حوت"
            ];
      
        const time = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        return `${persianDate.day} ${persianMonths[persianDate.month - 1]} ${persianDate.year} - ${time}`;
    };

    // Pagination component
    const renderPagination = () => {
        if (!paginationInfo.links || paginationInfo.links.length <= 3) return null;
        return (
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="flex items-center justify-center space-x-2"
            >
                <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                    {paginationInfo.links.map((link, index) => {
                        if (link.label.includes('Previous')) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                        link.url
                                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                </Link>
                            );
                        }
                        if (link.label.includes('Next')) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                        link.url
                                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            );
                        }
                        return (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                    link.active
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg'
                                        : link.url
                                            ? 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
                                            : 'text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Import Records")}`}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulse-glow 2s ease-in-out infinite;
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

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                        border: 1px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(15 23 42), rgb(15 23 42)) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
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

                    /* Dark mode fixes for cards */
                    .dark .bg-white {
                        background-color: rgb(15 23 42) !important;
                    }

                    .dark .bg-white\/50 {
                        background-color: rgba(15, 23, 42, 0.5) !important;
                    }

                    .dark .bg-white\/80 {
                        background-color: rgba(15, 23, 42, 0.8) !important;
                    }

                    .dark .border-white\/20 {
                        border-color: rgba(255, 255, 255, 0.2) !important;
                    }

                    .dark .border-white\/30 {
                        border-color: rgba(255, 255, 255, 0.3) !important;
                    }

                    .dark .text-slate-800 {
                        color: rgb(248 250 252) !important;
                    }

                    .dark .text-slate-700 {
                        color: rgb(203 213 225) !important;
                    }

                    .dark .text-slate-600 {
                        color: rgb(148 163 184) !important;
                    }

                    .dark .text-slate-500 {
                        color: rgb(100 116 139) !important;
                    }

                    .dark .text-slate-400 {
                        color: rgb(148 163 184) !important;
                    }

                    .dark .border-slate-200 {
                        border-color: rgb(51 65 85) !important;
                    }

                    .dark .border-slate-700 {
                        border-color: rgb(71 85 105) !important;
                    }

                    .dark .bg-slate-50 {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .bg-slate-100 {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .bg-slate-800 {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .bg-slate-800\/80 {
                        background-color: rgba(30, 41, 59, 0.8) !important;
                    }

                    .dark .hover\:bg-green-50:hover {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .hover\:bg-green-900\/20:hover {
                        background-color: rgba(30, 41, 59, 0.8) !important;
                    }

                    .dark .hover\:bg-green-900\/10:hover {
                        background-color: rgba(30, 41, 59, 0.6) !important;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={TrendingUp} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <TrendingUp className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {warehouse?.name} - {t("Import Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {t("Import Records")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t("Track and manage incoming inventory")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.warehouses.income.create", warehouse.id)}>
                                    <Button className="gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white hover:scale-105 transition-all duration-200 shadow-lg">
                                        <Plus className="h-4 w-4" />
                                        {t("New Import")}
                                    </Button>
                                </Link>
                                <BackButton link={route("admin.warehouses.show", warehouse.id)} />
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="space-y-8"
                            >

                                {/* Advanced Filters */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.4 }}
                                >
                                    <Card className="content-card border-0 shadow-2xl backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-600/50">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                        <Filter className="h-5 w-5 text-white" />
                                                    </div>
                                                    {t("Search & Filter")}
                                                </CardTitle>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowFilters(!showFilters)}
                                                    className="gap-2 dark:text-white text-black"
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
                                                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col lg:flex-row gap-4">
                                                    <div className="relative flex-1">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                        <Input
                                                            placeholder={t("Search by reference, product name, barcode, type, or batch...")}
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="pl-12 h-12 text-lg border-2 border-green-200 focus:border-green-500 rounded-xl dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                                                        />
                                                        {searchTerm && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setSearchTerm("")}
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button type="submit" className="gap-2 h-12 bg-green-600 hover:bg-green-700">
                                                            <Search className="h-4 w-4" />
                                                            {t("Search")}
                                                        </Button>
                                                        {(searchTerm || dateFilter || batchFilter) && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={clearFilters}
                                                                className="gap-2 h-12 border-green-200 hover:border-green-300 dark:border-green-600 dark:hover:border-green-400"
                                                            >
                                                                <RefreshCw className="h-4 w-4" />
                                                                {t("Clear")}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </form>
                                            </div>

                                            {/* Advanced Filters */}
                                            <AnimatePresence>
                                                {showFilters && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Date Filter")}
                                                                </label>
                                                                <Input
                                                                    type="date"
                                                                    value={dateFilter}
                                                                    onChange={(e) => setDateFilter(e.target.value)}
                                                                    className="h-10 dark:bg-slate-700 dark:text-white"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Batch Filter")}
                                                                </label>
                                                                <Select value={batchFilter} onValueChange={setBatchFilter}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue placeholder={t("All Batches")} />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="">{t("All Batches")}</SelectItem>
                                                                        <SelectItem value="with_batch">{t("With Batch")}</SelectItem>
                                                                        <SelectItem value="without_batch">{t("Without Batch")}</SelectItem>
                                                                        <SelectItem value="expired">{t("Expired")}</SelectItem>
                                                                        <SelectItem value="expiring_soon">{t("Expiring Soon")}</SelectItem>
                                                                        <SelectItem value="valid">{t("Valid")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Sort By")}
                                                                </label>
                                                                <Select value={sortBy} onValueChange={setSortBy}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="created_at">{t("Date Created")}</SelectItem>
                                                                        <SelectItem value="reference_number">{t("Reference")}</SelectItem>
                                                                        <SelectItem value="product.name">{t("Product Name")}</SelectItem>
                                                                        <SelectItem value="batch.reference_number">{t("Batch Reference")}</SelectItem>
                                                                        <SelectItem value="quantity">{t("Quantity")}</SelectItem>
                                                                        <SelectItem value="total">{t("Total Value")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Sort Order")}
                                                                </label>
                                                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="desc">{t("Descending")}</SelectItem>
                                                                        <SelectItem value="asc">{t("Ascending")}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                                    {t("Per Page")}
                                                                </label>
                                                                <Select value={perPage.toString()} onValueChange={(value) => setPerPage(parseInt(value))}>
                                                                    <SelectTrigger className="h-10">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="10">10</SelectItem>
                                                                        <SelectItem value="15">15</SelectItem>
                                                                        <SelectItem value="25">25</SelectItem>
                                                                        <SelectItem value="50">50</SelectItem>
                                                                        <SelectItem value="100">100</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex items-end">
                                                                <Button
                                                                    type="button"
                                                                    onClick={handleSearch}
                                                                    className="w-full h-10 gap-2 bg-green-600 hover:bg-green-700 text-white"
                                                                >
                                                                    <Filter className="h-4 w-4" />
                                                                    {t("Apply Filters")}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Batch Statistics */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.4 }}
                                >
                                    <Card className="content-card border-0 shadow-2xl backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-600/50">
                                            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <Package className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Batch Statistics")}
                                                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {t("Current Page")}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Pagination Summary */}
                                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-4">
                                                        <span>
                                                            {t("Showing")} {paginationInfo.from} - {paginationInfo.to} {t("of")} {paginationInfo.total} {t("records")}
                                                        </span>
                                                        {paginationInfo.current_page && (
                                                            <span>
                                                                {t("Page")} {paginationInfo.current_page} {t("of")} {paginationInfo.last_page}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span>{t("Per page")}: {perPage}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                        {batchStats.withBatch}
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("With Batch")}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                        {formatCurrency(batchStats.totalBatchValue)}
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                                        {batchStats.withoutBatch}
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Without Batch")}
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                        {batchStats.valid}
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Valid")}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                        {formatCurrency(batchStats.validValue)}
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                        {batchStats.expiringSoon}
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Expiring Soon")}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                        {formatCurrency(batchStats.expiringSoonValue)}
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                        {batchStats.expired}
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {t("Expired")}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                        {formatCurrency(batchStats.expiredValue)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Additional Batch Metrics */}
                                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                                    {t("Batch Summary")}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                                            {t("Total Batch Quantity")}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                            {batchStats.totalBatchQuantity.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                                            {t("Total Batch Value")}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                            {formatCurrency(batchStats.totalBatchValue)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                                            {t("Avg Batch Value")}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                            {batchStats.withBatch > 0 ? formatCurrency(batchStats.totalBatchValue / batchStats.withBatch) : formatCurrency(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Import Table */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.4 }}
                                >
                                    <Card className="content-card border-0 shadow-2xl backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-600/50">
                                            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                    <BarChart3 className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Import Records")}
                                                <Badge variant="secondary" className="ml-auto">
                                                    {incomesData.length} {t("of")} {paginationInfo.total}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 dark:bg-slate-600/50">
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Reference")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Product")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Quantity")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Unit Type")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Unit Price")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Total Value")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Import Date")}
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                                                {t("Batch")}
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredIncomes && filteredIncomes.length > 0 ? (
                                                            filteredIncomes.map((income, index) => (
                                                                <TableRow
                                                                    key={income.id}
                                                                    className="hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                                                                >
                                                                    <TableCell>
                                                                        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                                                                            {income.reference_number || '-'}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                                                                                <Package className="h-4 w-4 text-green-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-800 dark:text-white">{income.product.name}</p>
                                                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                                                    {income.product.barcode && (
                                                                                        <Badge variant="outline" className="text-xs">
                                                                                            {income.product.barcode}
                                                                                        </Badge>
                                                                                    )}
                                                                                    <span className="text-xs">{income.product.type}</span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-col gap-1">
                                                                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 w-fit">
                                                                                {income.is_wholesale 
                                                                                    ? `${(income.quantity / (income.unit_amount || 1)).toLocaleString()}`
                                                                                    : income.quantity?.toLocaleString() || 0
                                                                                }
                                                                                {income.unit_name && (
                                                                                    <span className="ml-1 text-xs opacity-75">
                                                                                        {income.unit_name}
                                                                                    </span>
                                                                                )}
                                                                            </Badge>
                                                                            {income.is_wholesale && (
                                                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                                    ({income.quantity?.toLocaleString() || 0} units total)
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge 
                                                                            variant={income.is_wholesale ? "default" : "outline"}
                                                                            className={
                                                                                income.is_wholesale 
                                                                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                                            }
                                                                        >
                                                                            {income.unit_type === 'wholesale' ? t('Wholesale') : t('Retail')}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {formatCurrency(income.price)}
                                                                    </TableCell>
                                                                    <TableCell className="font-bold text-green-600">
                                                                        {formatCurrency(income.total)}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4" />
                                                                            <div className="flex flex-col">
                                                                                <span className="font-medium" title={formatDate(income.created_at)}>
                                                                                    {formatPersianDateWithName(income.created_at)}
                                                                                </span>
                                                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                                                    {formatDate(income.created_at)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                                        {income.batch ? (
                                                                            <div 
                                                                                className="flex items-start gap-2 cursor-help"
                                                                                title={`Batch Details:
Reference: ${income.batch.reference_number}
Issue Date: ${income.batch.issue_date ? formatDate(income.batch.issue_date) : 'N/A'}
Expire Date: ${income.batch.expire_date ? formatDate(income.batch.expire_date) : 'N/A'}
Days to Expiry: ${income.batch.days_to_expiry !== null ? (income.batch.days_to_expiry > 0 ? '+' : '') + income.batch.days_to_expiry + ' days' : 'N/A'}
Unit: ${income.batch.unit_name || 'N/A'}
Unit Amount: ${income.batch.unit_amount || 'N/A'}
Purchase Price: ${formatCurrency(income.batch.purchase_price || 0)}
Wholesale Price: ${formatCurrency(income.batch.wholesale_price || 0)}
Retail Price: ${formatCurrency(income.batch.retail_price || 0)}
Batch Quantity: ${income.batch.quantity || 'N/A'}
Batch Total: ${formatCurrency(income.batch.total || 0)}
Notes: ${income.batch.notes || 'N/A'}`}
                                                                            >
                                                                                <div className={`p-1 rounded-lg mt-1 ${
                                                                                    income.batch.expire_date ? 
                                                                                        (new Date(income.batch.expire_date) < new Date() ? 
                                                                                            'bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30' :
                                                                                            (new Date(income.batch.expire_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ?
                                                                                                'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30' :
                                                                                                'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
                                                                                        )) :
                                                                                        'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30'
                                                                                }`}>
                                                                                    <Package className={`h-3 w-3 ${
                                                                                        income.batch.expire_date ? 
                                                                                            (new Date(income.batch.expire_date) < new Date() ? 'text-red-600' :
                                                                                            (new Date(income.batch.expire_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600' : 'text-green-600'))
                                                                                            : 'text-blue-600'
                                                                                    }`} />
                                                                                </div>
                                                                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="font-medium text-slate-800 dark:text-white truncate" title={income.batch.reference_number}>
                                                                                            {income.batch.reference_number}
                                                                                        </span>
                                                                                        {income.batch.expiry_status && (
                                                                                            <Badge 
                                                                                                variant="outline" 
                                                                                                className={`text-xs ${
                                                                                                    income.batch.expiry_status === 'expired' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' :
                                                                                                    income.batch.expiry_status === 'expiring_soon' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800' :
                                                                                                    income.batch.expiry_status === 'valid' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' :
                                                                                                    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                                                                                }`}
                                                                                            >
                                                                                                {income.batch.expiry_status === 'expired' ? t('Expired') :
                                                                                                 income.batch.expiry_status === 'expiring_soon' ? t('Expiring Soon') :
                                                                                                 income.batch.expiry_status === 'valid' ? t('Valid') :
                                                                                                 t('No Expiry')}
                                                                                            </Badge>
                                                                                        )}
                                                                                    </div>
                                                                                    
                                                                                    {income.batch.expire_date && (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <Calendar className="h-3 w-3 text-slate-400" />
                                                                                            <span className={`text-xs ${
                                                                                                new Date(income.batch.expire_date) < new Date() ? 'text-red-500' :
                                                                                                (new Date(income.batch.expire_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-500' : 'text-green-500')
                                                                                            }`}>
                                                                                                {formatDate(income.batch.expire_date)}
                                                                                                {income.batch.days_to_expiry !== null && (
                                                                                                    <span className="ml-1">
                                                                                                        ({income.batch.days_to_expiry > 0 ? '+' : ''}{income.batch.days_to_expiry} {t('days')})
                                                                                                    </span>
                                                                                                )}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    
                                                                                    {income.batch.issue_date && (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                                                                {t('Issue')}: {formatDate(income.batch.issue_date)}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    
                                                                                    {income.batch.unit_name && (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                                                                {t('Unit')}: {income.batch.unit_name}
                                                                                                {income.batch.unit_amount && income.batch.unit_amount > 1 && (
                                                                                                    <span className="ml-1">({income.batch.unit_amount})</span>
                                                                                                )}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    
                                                                                    {income.batch.notes && (
                                                                                        <div className="flex items-start gap-1">
                                                                                            <span className="text-xs text-slate-400 dark:text-slate-500 truncate" title={income.batch.notes}>
                                                                                                {t('Notes')}: {income.batch.notes}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-slate-400 dark:text-slate-500">-</span>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan="8" className="h-32 text-center">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                            <TrendingUp className="h-8 w-8 text-slate-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                                {searchTerm || dateFilter || batchFilter ? t("No import records found") : t("No import records available")}
                                                                            </p>
                                                                            <p className="text-sm text-slate-500">
                                                                                {searchTerm || dateFilter || batchFilter ? t("Try adjusting your filters") : t("Create your first import record")}
                                                                            </p>
                                                                        </div>
                                                                        {!searchTerm && !dateFilter && !batchFilter && (
                                                                            <Link href={route("admin.warehouses.income.create", warehouse.id)}>
                                                                                <Button className="gap-2">
                                                                                    <Plus className="h-4 w-4" />
                                                                                    {t("Create Import")}
                                                                                </Button>
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            {renderPagination()}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
