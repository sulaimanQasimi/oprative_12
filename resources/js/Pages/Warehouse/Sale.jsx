import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import {
    Search,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Calendar,
    Download,
    DollarSign,
    Settings,
    Eye,
    ShoppingCart,
    Package,
    Receipt,
    Users,
    Zap,
    BarChart,
    Filter,
    ArrowUpDown,
    RefreshCw,
    X,
    CheckCircle,
    ChevronDown,
} from "lucide-react";
import anime from "animejs";
import Navigation from "@/Components/Warehouse/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/Components/Admin/PageLoader";

// Safe querySelector utility function that checks if element exists
const safeQuerySelector = (element, selector) => {
    if (!element || !selector) return null;
    try {
        return element.querySelector(selector);
    } catch (error) {
        console.error("Error in querySelector:", error);
        return null;
    }
};

// Enhanced AnimatedCounter component with better animations
const AnimatedCounter = ({
    value,
    prefix = "",
    suffix = "",
    duration = 1500,
    className = "",
}) => {
    const nodeRef = useRef(null);
    const [counted, setCounted] = useState(false);

    useEffect(() => {
        if (!counted && nodeRef.current) {
            anime({
                targets: nodeRef.current,
                innerHTML: [0, value],
                easing: "easeOutExpo",
                duration: duration,
                round: 1,
                delay: 300,
                begin: () => setCounted(true),
            });
        }
    }, [value, counted, duration]);

    return (
        <span className={`inline-block font-bold ${className}`} ref={nodeRef}>
            {prefix}0{suffix}
        </span>
    );
};



// Enhanced Stats Card Component
const StatsCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    color = "emerald",
    className = "",
    delay = 0 
}) => {
    const colorClasses = {
        emerald: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
        blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
        purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
        orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300",
        red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
    };

    const iconColorClasses = {
        emerald: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
        blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
        purple: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
        orange: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
        red: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${colorClasses[color]} ${className}`}
        >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconColorClasses[color]} transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    {change && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                            changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                            {changeType === 'increase' ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4" />
                            )}
                            {change}%
                        </div>
                    )}
                </div>
                
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {title}
                    </p>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        <AnimatedCounter 
                            value={value} 
                            prefix="$" 
                            className="text-2xl font-bold"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function Sale({ auth, sales, permissions = {} }) {
    const { t } = useLaravelReactI18n();

    const [searchTerm, setSearchTerm] = useState("");
    const [isAnimated, setIsAnimated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [showFilters, setShowFilters] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const tableRef = useRef(null);
    const rowRefs = useRef([]);

    // Filter sales records based on search term
    const filteredSales = sales && sales.length
        ? sales.filter(
              (record) =>
                  record.reference
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  record.customer
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
          )
        : [];

    // Sort sales
    const sortedSales = [...filteredSales].sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

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

    // Calculate total sales value
    const totalSalesValue =
        sales?.reduce((sum, record) => sum + record.amount, 0) || 0;

    // Calculate this month's sales
    const thisMonthSales =
        sales
            ?.filter((s) => {
                const date = new Date(s.date);
                const now = new Date();
                return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                );
            })
            .reduce((sum, s) => sum + s.amount, 0) || 0;

    // Calculate last month's sales
    const lastMonthSales =
        sales
            ?.filter((s) => {
                const date = new Date(s.date);
                const now = new Date();
                let lastMonth = now.getMonth() - 1;
                let year = now.getFullYear();
                if (lastMonth < 0) {
                    lastMonth = 11;
                    year--;
                }
                return (
                    date.getMonth() === lastMonth && date.getFullYear() === year
                );
            })
            .reduce((sum, s) => sum + s.amount, 0) || 0;

    // Calculate sales change percentage
    const salesChangePercent = lastMonthSales
        ? ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100
        : 0;

    // Get unique customers and their totals
    const customerTotals =
        sales && sales.length
            ? Array.from(new Set(sales.map((s) => s.customer)))
                  .map((customer) => ({
                      name: customer,
                      total: sales
                          .filter((s) => s.customer === customer)
                          .reduce((sum, s) => sum + s.amount, 0),
                      count: sales.filter((s) => s.customer === customer).length,
                  }))
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 5)
            : [];

    // Calculate average order value
    const averageOrderValue = sales && sales.length ? totalSalesValue / sales.length : 0;

    // Calculate top performing products
    const productTotals = sales && sales.length
        ? sales.reduce((acc, sale) => {
            if (sale.products) {
                sale.products.forEach(product => {
                    if (!acc[product.name]) {
                        acc[product.name] = { name: product.name, total: 0, quantity: 0 };
                    }
                    acc[product.name].total += product.total || 0;
                    acc[product.name].quantity += product.quantity || 0;
                });
            }
            return acc;
        }, {})
        : {};

    const topProducts = Object.values(productTotals)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    // Animation effects
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortField("date");
        setSortDirection("desc");
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Sales Dashboard" />
            
            <PageLoader isVisible={loading} icon={Receipt} color="green" />
            
            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="warehouse.sales" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header
                        ref={headerRef}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                                    {t("Sales Management")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Sales Dashboard")}
                                    {auth?.user?.warehouse?.name && (
                                        <Badge
                                            variant="outline"
                                            className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full"
                                        >
                                            {auth.user.warehouse.name}
                                        </Badge>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            {/* Search and Controls Section */}
                            <motion.div
                                ref={headerRef}
                                className="mb-8 animate-header"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            Sales Overview
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Track your sales performance and customer insights
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Confirm Sales
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Sales"
                            value={totalSalesValue}
                            change={Math.abs(salesChangePercent).toFixed(1)}
                            changeType={salesChangePercent >= 0 ? 'increase' : 'decrease'}
                            icon={DollarSign}
                            color="emerald"
                            delay={0.1}
                        />
                        
                        <StatsCard
                            title="This Month"
                            value={thisMonthSales}
                            icon={Calendar}
                            color="blue"
                            delay={0.2}
                        />
                        
                        <StatsCard
                            title="Average Order"
                            value={averageOrderValue}
                            icon={BarChart3}
                            color="purple"
                            delay={0.3}
                        />
                        
                        <StatsCard
                            title="Total Orders"
                            value={sales?.length || 0}
                            icon={ShoppingCart}
                            color="orange"
                            delay={0.4}
                        />
                    </div>

                    {/* Advanced Filters */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.3, duration: 0.4 }}
                    >
                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
                            <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 dark:from-emerald-500/20 dark:via-teal-500/20 dark:to-emerald-500/20 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                                            <Filter className="h-5 w-5 text-white" />
                                        </div>
                                        {t("Search & Filter")}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setShowFilters(
                                                !showFilters
                                            )
                                        }
                                        className="gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    >
                                        <Filter className="h-4 w-4" />
                                        {showFilters
                                            ? t("Hide Filters")
                                            : t("Show Filters")}
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${
                                                showFilters
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Search Bar */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
                                        <Input
                                            placeholder={t(
                                                "Search sales by reference or customer..."
                                            )}
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="pl-12 h-12 text-lg border-2 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                                        />
                                        {searchTerm && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSearchTerm(
                                                        ""
                                                    )
                                                }
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
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
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t(
                                                            "Sort By"
                                                        )}
                                                    </label>
                                                    <Select
                                                        value={
                                                            sortField
                                                        }
                                                        onValueChange={
                                                            setSortField
                                                        }
                                                    >
                                                        <SelectTrigger className="h-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                            <SelectItem value="date">
                                                                {t(
                                                                    "Date"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="reference">
                                                                {t(
                                                                    "Reference"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="customer">
                                                                {t(
                                                                    "Customer"
                                                                )}
                                                            </SelectItem>

                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t(
                                                            "Sort Order"
                                                        )}
                                                    </label>
                                                    <Select
                                                        value={
                                                            sortDirection
                                                        }
                                                        onValueChange={
                                                            setSortDirection
                                                        }
                                                    >
                                                        <SelectTrigger className="h-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                            <SelectItem value="asc">
                                                                {t(
                                                                    "Ascending"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="desc">
                                                                {t(
                                                                    "Descending"
                                                                )}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="flex items-end">
                                                    <Button
                                                        variant="outline"
                                                        onClick={
                                                            clearFilters
                                                        }
                                                        className="w-full h-10 gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                        {t(
                                                            "Clear Filters"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Sales Table */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.4 }}
                    >
                        <Card className="border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800">
                            <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 dark:from-emerald-500/20 dark:via-teal-500/20 dark:to-emerald-500/20 border-b border-slate-200 dark:border-slate-700">
                                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                                        <Receipt className="h-5 w-5 text-white" />
                                    </div>
                                    {t("Sales")}
                                    <Badge
                                        variant="secondary"
                                        className="ml-auto bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                    >
                                        {filteredSales.length}{" "}
                                        {t("of")} {sales?.length || 0}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                                <TableHead
                                                    className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    onClick={() =>
                                                        handleSort(
                                                            "reference"
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>
                                                            {t(
                                                                "Reference"
                                                            )}
                                                        </span>
                                                        <ArrowUpDown className="h-4 w-4" />
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    onClick={() =>
                                                        handleSort(
                                                            "customer"
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>
                                                            {t(
                                                                "Customer"
                                                            )}
                                                        </span>
                                                        <ArrowUpDown className="h-4 w-4" />
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    onClick={() =>
                                                        handleSort(
                                                            "date"
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>
                                                            {t(
                                                                "Date"
                                                            )}
                                                        </span>
                                                        <ArrowUpDown className="h-4 w-4" />
                                                    </div>
                                                </TableHead>

                                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                    {t("Actions")}
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sortedSales.length >
                                            0 ? (
                                                sortedSales.map(
                                                    (
                                                        sale,
                                                        index
                                                    ) => (
                                                        <TableRow
                                                            key={
                                                                sale.id
                                                            }
                                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-800"
                                                        >
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-lg">
                                                                        <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-slate-800 dark:text-white">
                                                                            {
                                                                                sale.reference
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                            {sale.products?.length || 0} items
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                                    {sale.customer}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {formatDate(sale.date)}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell className="text-right">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <Link
                                                                        href={route('warehouse.sales.show', sale.id)}
                                                                        className="p-2 text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                    <Link
                                                                        href={route('warehouse.sales.confirm', sale.id)}
                                                                        className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Link>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan="4"
                                                        className="h-32 text-center"
                                                    >
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                <Receipt className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                    {t(
                                                                        "No sales found"
                                                                    )}
                                                                </p>
                                                                <p className="text-sm text-slate-500 dark:text-slate-500">
                                                                    {searchTerm
                                                                        ? t(
                                                                              "Try adjusting your search"
                                                                          )
                                                                        : t(
                                                                              "Create your first sale"
                                                                          )}
                                                                </p>
                                                            </div>
                                                            {!searchTerm && (
                                                                <Button className="gap-2">
                                                                    <CheckCircle className="h-4 w-4" />
                                                                    {t(
                                                                        "Confirm Sales"
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    </div>
        </>
    );
}