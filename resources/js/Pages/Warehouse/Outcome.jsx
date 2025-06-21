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
    Upload,
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
    Store
} from "lucide-react";
import Navigation from "@/Components/Warehouse/Navigation";
import { motion } from "framer-motion";

// Jalali date conversion utility
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
        // Fallback to basic conversion if Intl.DateTimeFormat fails
        const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        const jy = (date.getFullYear() <= 1600) ? 0 : 979;
        const gy = date.getFullYear() - 1600;
        const gm = date.getMonth() + 1;
        const gd = date.getDate();
        
        let g_day_no = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400) - 80 + gd + g_d_m[gm - 1];
        if (gm > 2) g_day_no += Math.floor(gy / 4) - Math.floor(gy / 100) + Math.floor(gy / 400) - Math.floor(1600 / 4) + Math.floor(1600 / 100) - Math.floor(1600 / 400);
        
        const j_day_no = g_day_no - 79;
        const j_np = Math.floor(j_day_no / 12053);
        const jy_final = 979 + 33 * j_np + 4 * Math.floor((j_day_no % 12053) / 1461) + Math.floor(((j_day_no % 12053) % 1461) / 365);
        
        let jp = 0;
        if ((j_day_no % 12053) % 1461 >= 365) {
            jp = Math.floor(((j_day_no % 12053) % 1461) / 365);
        }
        
        const jd_remaining = ((j_day_no % 12053) % 1461) % 365;
        let jm, jd;
        
        if (jd_remaining < 186) {
            jm = 1 + Math.floor(jd_remaining / 31);
            jd = 1 + (jd_remaining % 31);
        } else {
            jm = 7 + Math.floor((jd_remaining - 186) / 30);
            jd = 1 + ((jd_remaining - 186) % 30);
        }
        
        return `${jy_final + jp}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
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

export default function Outcome({ auth, outcome, pagination, filters }) {
    const { t } = useLaravelReactI18n();
    
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const [sortBy, setSortBy] = useState(filters?.sort || "created_at");
    const [sortOrder, setSortOrder] = useState(filters?.direction || "desc");
    const [dateFrom, setDateFrom] = useState(filters?.date_from || "");
    const [dateTo, setDateTo] = useState(filters?.date_to || "");
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
        };
        
        // Remove empty parameters
        Object.keys(params).forEach(key => {
            if (!params[key]) delete params[key];
        });
        
        router.get(route('warehouse.outcome'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (column) => {
        const newDirection = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(newDirection);
        
        router.get(route('warehouse.outcome'), {
            ...filters,
            sort: column,
            direction: newDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page) => {
        router.get(route('warehouse.outcome'), {
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
        setSortBy("created_at");
        setSortOrder("desc");
        setPerPage(10);
        
        router.get(route('warehouse.outcome'), {}, {
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
            <Head title={t("Export Product")} />
            
            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                <Navigation auth={auth} currentRoute="warehouse.outcome" />
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-rose-500 via-red-500 to-rose-600 p-4 rounded-2xl shadow-2xl">
                                        <Upload className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-2"
                                    >
                                        <Store className="w-4 h-4" />
                                        {t("Store Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 bg-clip-text text-transparent"
                                    >
                                        {t("Export Product")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Track and manage your export records")}
                                    </motion.p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800">
                                    {pagination?.total || 0} {t("exports")}
                                </Badge>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-rose-300 dark:scrollbar-thumb-rose-700 scrollbar-track-transparent">
                        <div className="p-8">
                            {/* Search and Filters */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="mb-6"
                            >
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader className="bg-gradient-to-r from-rose-500/20 via-red-500/20 to-rose-500/20 border-b border-white/30 dark:border-slate-700/50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-rose-500 to-red-600 rounded-lg">
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
                                                    placeholder={t("Search by reference, destination, or notes...")}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-12 h-12 text-lg border-2 border-rose-200 focus:border-rose-500 rounded-xl"
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
                                                className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700"
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
                                                            <SelectItem value="25">25</SelectItem>
                                                            <SelectItem value="50">50</SelectItem>
                                                            <SelectItem value="100">100</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex items-end gap-2">
                                                    <Button
                                                        onClick={handleFilter}
                                                        className="h-10 bg-rose-600 hover:bg-rose-700 text-white"
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

                            {/* Table */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-rose-500/20 via-red-500/20 to-rose-500/20 border-b border-white/30 dark:border-slate-700/50">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-rose-500 to-red-600 rounded-lg">
                                                <Upload className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Export Product")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {outcome && outcome.length > 0 ? (
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
                                                                {t("Destination")}
                                                            </th>
                                                            <th 
                                                                className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                                onClick={() => handleSort('quantity')}
                                                            >
                                                                {t("Quantity")} {getSortIcon('quantity')}
                                                            </th>
                                                            <th 
                                                                className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                                onClick={() => handleSort('price')}
                                                            >
                                                                {t("Price")} {getSortIcon('price')}
                                                            </th>
                                                            <th 
                                                                className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                                onClick={() => handleSort('total')}
                                                            >
                                                                {t("Total Amount")} {getSortIcon('total')}
                                                            </th>
                                                            <th 
                                                                className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                                onClick={() => handleSort('created_at')}
                                                            >
                                                                {t("Date (Jalali)")} {getSortIcon('created_at')}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                                        {outcome.map((record, index) => (
                                                            <motion.tr
                                                                key={record.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mr-3">
                                                                            <Upload className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                                {record.reference}
                                                                            </div>
                                                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                                ID: {record.id}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-slate-900 dark:text-white">
                                                                        {record.destination}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">
                                                                        {record.quantity}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <div className="text-sm text-slate-900 dark:text-white">
                                                                        ${record.price}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <div className="text-sm font-medium text-rose-600 dark:text-rose-400">
                                                                        ${record.amount}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                    <div className="text-sm text-slate-900 dark:text-white" dir="rtl">
                                                                        {toJalali(record.date)}
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400" dir="rtl">
                                                                        {toJalaliRelative(record.created_at_raw)}
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                                                    {t("No export records found")}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    {searchTerm 
                                                        ? t("Try adjusting your search criteria.")
                                                        : t("No export Product have been recorded yet.")}
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
                                            
                                            // Calculate start and end page numbers
                                            let startPage = Math.max(1, currentPage - 2);
                                            let endPage = Math.min(totalPages, currentPage + 2);
                                            
                                            // Adjust if we don't have enough pages on one side
                                            if (endPage - startPage < 4) {
                                                if (startPage === 1) {
                                                    endPage = Math.min(totalPages, startPage + 4);
                                                } else if (endPage === totalPages) {
                                                    startPage = Math.max(1, endPage - 4);
                                                }
                                            }
                                            
                                            // Generate page buttons
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