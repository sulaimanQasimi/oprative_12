import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Search,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RefreshCw,
    Filter,
    Calendar,
    DollarSign,
    Package,
    X,
    Building2,
    ShoppingBag
} from "lucide-react";
import Navigation from "@/Components/Admin/Navigation";
import { motion } from "framer-motion";

// Jalali date conversion utility (reuse from Warehouse/Income.jsx)
const toJalali = (gregorianDate) => {
    if (!gregorianDate) return '';
    const date = new Date(gregorianDate);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        calendar: 'persian',
        numberingSystem: 'latn'
    };
    try {
        return new Intl.DateTimeFormat('fa-IR', options).format(date);
    } catch (error) {
        return gregorianDate;
    }
};

const toJalaliRelative = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} ثانیه پیش`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} روز پیش`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} ماه پیش`;
    return `${Math.floor(diffInSeconds / 31536000)} سال پیش`;
};

export default function IncomeIndex({ auth, incomes = [], pagination = {}, filters = {}, availableWarehouses = [], availableProducts = [], stats = {} }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [perPage, setPerPage] = useState(filters?.per_page || 15);
    const [sortBy, setSortBy] = useState(filters?.sort || "created_at");
    const [sortOrder, setSortOrder] = useState(filters?.direction || "desc");
    const [dateFrom, setDateFrom] = useState(filters?.date_from || "");
    const [dateTo, setDateTo] = useState(filters?.date_to || "");
    const [warehouseFilter, setWarehouseFilter] = useState(filters?.warehouse_id || "");
    const [productFilter, setProductFilter] = useState(filters?.product_id || "");
    const [showFilters, setShowFilters] = useState(false);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilter();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilter = () => {
        const params = {
            search: searchTerm,
            per_page: perPage,
            sort: sortBy,
            direction: sortOrder,
            date_from: dateFrom,
            date_to: dateTo,
            warehouse_id: warehouseFilter,
            product_id: productFilter,
        };
        Object.keys(params).forEach(key => {
            if (!params[key]) delete params[key];
        });
        router.get(route('admin.incomes.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (column) => {
        const newDirection = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(newDirection);
        router.get(route('admin.incomes.index'), {
            ...filters,
            sort: column,
            direction: newDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page) => {
        router.get(route('admin.incomes.index'), {
            ...filters,
            page: page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDateFrom("");
        setDateTo("");
        setWarehouseFilter("");
        setProductFilter("");
        setSortBy("created_at");
        setSortOrder("desc");
        setPerPage(15);
        router.get(route('admin.incomes.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <>
            <Head title={t("Warehouse Income Management")} />
            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                <Navigation auth={auth} currentRoute="admin.incomes" />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60 dark:opacity-40"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <Download className="w-8 h-8 text-white" />
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
                                        <Filter className="w-4 h-4" />
                                        {t("Warehouse Income Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Warehouse Income")}
                                    </motion.h1>
                                </div>
                            </div>
                        </div>
                    </motion.header>
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            {/* Search and Filters */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="mb-6"
                            >
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                    <Filter className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Search & Filter")}
                                            </CardTitle>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="gap-2"
                                            >
                                                <Filter className="h-4 w-4" />
                                                {showFilters ? t("Hide Filters") : t("Show Filters")}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {/* Search Bar */}
                                        <div className="mb-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <Input
                                                    placeholder={t("Search by reference, warehouse, or product...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-12 h-12 text-lg border-2 border-green-200 focus:border-green-500 rounded-xl"
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
                                        </div>
                                        {/* Advanced Filters */}
                                        {showFilters && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="grid grid-cols-1 md:grid-cols-7 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Date From")}
                                                    </label>
                                                    <Input
                                                        type="date"
                                                        value={dateFrom}
                                                        onChange={(e) => setDateFrom(e.target.value)}
                                                        className="h-10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Date To")}
                                                    </label>
                                                    <Input
                                                        type="date"
                                                        value={dateTo}
                                                        onChange={(e) => setDateTo(e.target.value)}
                                                        className="h-10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Warehouse")}
                                                    </label>
                                                    <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                                                        <SelectTrigger className="h-10">
                                                            <SelectValue placeholder={t("All Warehouses")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">{t("All Warehouses")}</SelectItem>
                                                            {availableWarehouses.map((warehouse) => (
                                                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                                    {warehouse.name} ({warehouse.code})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {t("Product")}
                                                    </label>
                                                    <Select value={productFilter} onValueChange={setProductFilter}>
                                                        <SelectTrigger className="h-10">
                                                            <SelectValue placeholder={t("All Products")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">{t("All Products")}</SelectItem>
                                                            {availableProducts.map((product) => (
                                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                                    {product.name} ({product.barcode})
                                                                </SelectItem>
                                                            ))}
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
                                                            <SelectItem value="total">{t("Amount")}</SelectItem>
                                                            <SelectItem value="quantity">{t("Quantity")}</SelectItem>
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
                                                <div className="flex items-end gap-2">
                                                    <Button
                                                        onClick={handleFilter}
                                                        className="h-10 bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        {t("Apply")}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={clearFilters}
                                                        className="h-10"
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                            {/* Statistics */}
                            {stats && Object.keys(stats).length > 0 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                    <DollarSign className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Income Statistics")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                        {stats.total_incomes?.toLocaleString() || 0}
                                                    </div>
                                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                                        {t("Total Records")}
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                        ${stats.total_amount?.toLocaleString() || 0}
                                                    </div>
                                                    <div className="text-sm text-green-700 dark:text-green-300">
                                                        {t("Total Amount")}
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                        {stats.total_quantity?.toLocaleString() || 0}
                                                    </div>
                                                    <div className="text-sm text-purple-700 dark:text-purple-300">
                                                        {t("Total Quantity")}
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                        ${stats.average_price?.toFixed(2) || 0}
                                                    </div>
                                                    <div className="text-sm text-orange-700 dark:text-orange-300">
                                                        {t("Average Price")}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Table */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                <Download className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Warehouse Income")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {incomes && incomes.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                                        <tr>
                                                            <th
                                                                className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                                onClick={() => handleSort('reference_number')}
                                                            >
                                                                {t("Reference")} {getSortIcon('reference_number')}
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Batch")}
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Warehouse")}
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                {t("Product")}
                                                            </th>
                                                            <th
                                                                className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                                onClick={() => handleSort('quantity')}
                                                            >
                                                                {t("Quantity")} {getSortIcon('quantity')}
                                                            </th>
                                                            <th
                                                                className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                                onClick={() => handleSort('date')}
                                                            >
                                                                {t("Date (Jalali)")} {getSortIcon('date')}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                                        {incomes.map((record, index) => (
                                                            <motion.tr
                                                                key={record.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                                                                            <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                                {record.reference_number}
                                                                            </div>
                                                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                                ID: {record.id}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        {record.batch ? (
                                                                            <>
                                                                                <Package className="h-4 w-4 text-indigo-600" />
                                                                                <div>
                                                                                    <div className="font-semibold text-slate-800 dark:text-white">
                                                                                        {record.batch.reference_number}
                                                                                    </div>
                                                                                    {record.batch.expire_date && (
                                                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                                            {t("Expire")}: {toJalali(record.batch.expire_date)}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <span className="text-sm text-slate-500 dark:text-slate-400 italic">
                                                                                {t("No batch")}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="h-4 w-4 text-purple-600" />
                                                                        <div>
                                                                            <div className="font-semibold text-slate-800 dark:text-white">{record.warehouse.name}</div>
                                                                            <div className="text-sm text-slate-500 dark:text-slate-400">{record.warehouse.code}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                                                                        <div>
                                                                            <div className="font-semibold text-slate-800 dark:text-white">{record.product.name}</div>
                                                                            <div className="text-sm text-slate-500">{record.product.barcode}</div>
                                                                            <div className="text-xs text-slate-400">{record.product.type}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <div className="text-center">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                                                            {record.quantity / record.batch.unit_amount}
                                                                        </span>
                                                                        {record.unit_name && (
                                                                            <div className="text-xs text-slate-500 mt-1">
                                                                                {record.unit_name}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                    <div className="text-sm text-slate-900 dark:text-white" dir="rtl">
                                                                        {toJalali(record.created_at)}
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400" dir="rtl">
                                                                        {toJalaliRelative(record.created_at)}
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Download className="mx-auto h-12 w-12 text-slate-400" />
                                                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                                                    {t("No income records found")}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    {searchTerm || warehouseFilter || productFilter || dateFrom || dateTo
                                                        ? t("Try adjusting your search criteria.")
                                                        : t("No warehouse income has been recorded yet.")}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                            {/* Pagination */}
                            {pagination && pagination.last_page > 1 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.5 }}
                                    className="mt-6 flex items-center justify-between"
                                >
                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        {t("Showing")} {pagination.from} {t("to")} {pagination.to} {t("of")} {pagination.total} {t("results")}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(1)}
                                            disabled={pagination.current_page === 1}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronsLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            disabled={pagination.current_page === 1}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        {/* Page numbers */}
                                        {(() => {
                                            const pages = [];
                                            const totalPages = pagination.last_page;
                                            const currentPage = pagination.current_page;
                                            let startPage = Math.max(1, currentPage - 2);
                                            let endPage = Math.min(totalPages, currentPage + 2);
                                            if (endPage - startPage < 4) {
                                                if (startPage === 1) {
                                                    endPage = Math.min(totalPages, startPage + 4);
                                                } else if (endPage === totalPages) {
                                                    startPage = Math.max(1, endPage - 4);
                                                }
                                            }
                                            for (let i = startPage; i <= endPage; i++) {
                                                pages.push(
                                                    <Button
                                                        key={i}
                                                        variant={currentPage === i ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handlePageChange(i)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        {i}
                                                    </Button>
                                                );
                                            }
                                            return pages;
                                        })()}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.last_page)}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 