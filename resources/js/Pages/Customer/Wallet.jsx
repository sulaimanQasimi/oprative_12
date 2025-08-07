import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, TrendingUp, Plus, RefreshCw, Calendar, Clock, Download, CreditCard, DollarSign, Eye, MoreHorizontal, Search, Filter, SortAsc, SortDesc, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomerNavbar from "@/Components/CustomerNavbar";
import { motion } from 'framer-motion';
import anime from 'animejs';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { debounce } from 'lodash';

// Memoized animation variants to prevent re-creation
const animationVariants = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    },
    slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    },
    staggerChildren: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
};

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

// Memoized AnimatedCounter component
const AnimatedCounter = React.memo(({
    value,
    prefix = "",
    suffix = "",
    duration = 1500,
}) => {
    const nodeRef = useRef(null);
    const [counted, setCounted] = useState(false);

    useEffect(() => {
        if (!counted && nodeRef.current) {
            anime({
                targets: nodeRef.current,
                innerHTML: [0, value],
                easing: "easeInOutExpo",
                duration: duration,
                round: 1,
                delay: 300,
                begin: () => setCounted(true),
            });
        }
    }, [value, counted, duration]);

    return (
        <span className="inline-block" ref={nodeRef}>
            {prefix}0{suffix}
        </span>
    );
});

// Memoized PageLoader component
const PageLoader = React.memo(({ isVisible }) => (
    <motion.div
        className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'all' : 'none' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="relative z-10 flex flex-col items-center">
            <motion.div className="relative" animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="relative flex items-center justify-center h-40 w-40">
                    <motion.div className="relative z-10 bg-gradient-to-br from-emerald-500 to-teal-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl" animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                        <WalletIcon className="h-10 w-10 text-white drop-shadow-lg" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    </motion.div>
));

// Memoized Pagination component
const Pagination = React.memo(({ data, onPageChange }) => {
    if (!data || !data.links || data.links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <span>
                    Showing {data.from || 0} to {data.to || 0} of {data.total || 0} results
                </span>
            </div>
            <div className="flex items-center gap-2">
                {data.links.map((link, index) => {
                    if (index === 0) {
                        return (
                            <Button
                                key="prev"
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && onPageChange(link.url)}
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                        );
                    }
                    if (index === data.links.length - 1) {
                        return (
                            <Button
                                key="next"
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && onPageChange(link.url)}
                                className="flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        );
                    }
                    return (
                        <Button
                            key={index}
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && onPageChange(link.url)}
                            className="min-w-[2.5rem]"
                        >
                            {link.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
});

// Memoized Dashboard Card component
const DashboardCard = React.memo(({ card, index, dashboardCardsRef }) => (
    <motion.div
        className={`bg-gradient-to-br ${card.bgClass} text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        whileHover={{ translateY: -8, transition: { duration: 0.3 } }}
    >
        <div ref={(el) => (dashboardCardsRef.current[index] = el)} className="w-full h-full">
            <div className="p-6 relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-lg">{card.title}</span>
                    <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                        {card.icon}
                    </div>
                </div>
                <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                    <AnimatedCounter value={typeof card.value === "string" ? parseInt(card.value.replace(/[^0-9.-]+/g, "")) : card.value} suffix={card.suffix || ""} duration={2000} />
                </div>
                <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                    <span>{card.trend}</span>
                </div>
            </div>
        </div>
    </motion.div>
));

// Memoized Transaction Row component
const TransactionRow = React.memo(({ tx, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 grid grid-cols-12 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
    >
        <div className="col-span-4 md:col-span-3 lg:col-span-3 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${tx.type === 'deposit' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-rose-500 to-red-600'}`}>
                {tx.type === 'deposit' ? (
                    <ArrowUpRight className="h-5 w-5" />
                ) : (
                    <ArrowDownRight className="h-5 w-5" />
                )}
            </div>
            <div className="min-w-0">
                <h3 className="font-medium text-slate-900 dark:text-white truncate">
                    {tx.type === 'deposit' ? 'Wallet Deposit' : 'Wallet Withdrawal'}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tx.type === 'deposit' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        ID: {tx.id}
                    </span>
                </div>
            </div>
        </div>
        <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden md:block">
            <div className={`font-bold text-lg ${tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {tx.type === 'deposit' ? '+' : '-'}{tx.amount} AFN
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {tx.type === 'deposit' ? 'Credit' : 'Debit'}
            </div>
        </div>
        <div className="col-span-3 md:col-span-3 lg:col-span-3 text-center hidden md:block">
            <div className="text-sm text-slate-700 dark:text-slate-300 truncate">
                {tx.description || 'No description provided'}
            </div>
        </div>
        <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden lg:block">
            <div className="text-sm text-slate-700 dark:text-slate-300">
                {tx.formatted_date || new Date(tx.created_at).toLocaleDateString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {tx.formatted_time || new Date(tx.created_at).toLocaleTimeString()}
            </div>
        </div>
        <div className="col-span-8 md:col-span-2 lg:col-span-2 flex justify-end gap-1">
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                title="View Details"
            >
                <Eye className="h-4 w-4" />
            </Button>
        </div>
    </motion.div>
));

export default function Wallet({ auth, customer, wallet, transactions, statistics, filters }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.type || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [sortBy, setSortBy] = useState(filters?.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters?.sort_order || 'desc');
    const [perPage, setPerPage] = useState(filters?.per_page || 15);

    // Refs for animation targets
    const headerRef = useRef(null);
    const dashboardCardsRef = useRef([]);
    const timelineRef = useRef(null);

    // Memoized dashboard cards data
    const dashboardCards = useMemo(() => [
        {
            title: "Current Balance",
            value: wallet.balance,
            suffix: " AFN",
            icon: <WalletIcon className="h-6 w-6" />,
            bgClass: "from-emerald-500 to-teal-600",
            trend: "Available for transactions",
        },
        {
            title: "Total Deposits",
            value: statistics.total_deposits,
            suffix: " AFN",
            icon: <ArrowUpRight className="h-6 w-6" />,
            bgClass: "from-green-500 to-emerald-600",
            trend: "All time deposits",
        },
        {
            title: "Total Withdrawals",
            value: statistics.total_withdrawals,
            suffix: " AFN",
            icon: <ArrowDownRight className="h-6 w-6" />,
            bgClass: "from-rose-500 to-red-600",
            trend: "All time withdrawals",
        },
    ], [wallet.balance, statistics.total_deposits, statistics.total_withdrawals]);

    // Memoized filter parameters
    const filterParams = useMemo(() => ({
        search: searchTerm,
        type: typeFilter,
        date_from: dateFrom,
        date_to: dateTo,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: perPage,
    }), [searchTerm, typeFilter, dateFrom, dateTo, sortBy, sortOrder, perPage]);

    // Memoized has active filters
    const hasActiveFilters = useMemo(() => 
        searchTerm || typeFilter || dateFrom || dateTo, 
        [searchTerm, typeFilter, dateFrom, dateTo]
    );

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Initialize animations
    useEffect(() => {
        if (!isAnimated && !loading) {
            timelineRef.current = anime.timeline({
                easing: "easeOutExpo",
                duration: 800,
            });

            timelineRef.current.add({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600,
            });

            timelineRef.current.add(
                {
                    targets: dashboardCardsRef.current,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: anime.stagger(100),
                    duration: 700,
                },
                "-=400"
            );

            setIsAnimated(true);
        }
    }, [isAnimated, loading]);

    // Debounced search function
    const debouncedSearch = useRef(
        debounce((params) => {
            setIsFiltering(true);
            router.get(route('customer.wallet'), params, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setIsFiltering(false),
                onError: () => setIsFiltering(false),
            });
        }, 500)
    ).current;

    // Memoized event handlers
    const handleFilterChange = useCallback((key, value) => {
        const params = {
            ...filterParams,
            [key]: value,
        };

        // Remove empty parameters
        Object.keys(params).forEach(k => {
            if (!params[k]) delete params[k];
        });

        debouncedSearch(params);
    }, [filterParams, debouncedSearch]);

    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);
        handleFilterChange('search', value);
    }, [handleFilterChange]);

    const handlePageChange = useCallback((url) => {
        setIsFiltering(true);
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setIsFiltering(false),
            onError: () => setIsFiltering(false),
        });
    }, []);

    const handleSort = useCallback((field) => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(newOrder);
        handleFilterChange('sort_by', field);
        handleFilterChange('sort_order', newOrder);
    }, [sortBy, sortOrder, handleFilterChange]);

    const handleExport = useCallback(() => {
        const params = new URLSearchParams({
            search: searchTerm,
            type: typeFilter,
            date_from: dateFrom,
            date_to: dateTo,
        });

        // Remove empty parameters
        Object.keys(Object.fromEntries(params)).forEach(key => {
            if (!params.get(key)) params.delete(key);
        });

        window.open(`${route('customer.wallet.export')}?${params.toString()}`, '_blank');
    }, [searchTerm, typeFilter, dateFrom, dateTo]);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setTypeFilter('');
        setDateFrom('');
        setDateTo('');
        setSortBy('created_at');
        setSortOrder('desc');
        setPerPage(15);

        router.get(route('customer.wallet'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

    const handleRefresh = useCallback(() => {
        window.location.reload();
    }, []);

    return (
        <>
            <Head title={`${customer.name} - Wallet`}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer { animation: shimmer 3s infinite; }
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }
                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                    .card-shine {
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                        animation: shimmer 3s infinite;
                    }
                `}</style>
            </Head>
            <PageLoader isVisible={loading} />
            
            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.wallet"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Enhanced Header */}
                    <motion.header
                        ref={headerRef}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-6 px-8 flex items-center justify-between sticky top-0 z-30 shadow-lg"
                    >
                        <div className="flex items-center space-x-6">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                                    {t("Wallet Management")}
                                </span>
                                <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                                        <WalletIcon className="h-8 w-8 text-white" />
                                    </div>
                                    {customer.name} Wallet
                                    <Badge variant="outline" className="ml-3 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full px-4 py-2 text-lg font-semibold">
                                        {wallet.balance} AFN
                                    </Badge>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {(customer.permissions.withdraw_wallet) && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={route('customer.wallet.withdraw.form')}>
                                        <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center gap-2 px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200">
                                            <ArrowDownRight className="h-5 w-5" />
                                            {t("Withdraw")}
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}

                            {(customer.permissions.deposit_wallet) && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={route('customer.wallet.deposit.form')}>
                                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                                            <Plus className="h-5 w-5" />
                                            {t("Deposit")}
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                                    onClick={handleRefresh}
                                    disabled={isFiltering}
                                >
                                    <RefreshCw className={`h-4 w-4 ${isFiltering ? 'animate-spin' : ''}`} />
                                    {t("Refresh")}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-slate-50 dark:bg-slate-950">
                        <div className="max-w-7xl mx-auto relative">
                            {/* Enhanced Background Elements */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/40 to-teal-50/40 dark:from-slate-900/40 dark:to-slate-800/40 pointer-events-none"></div>
                            <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-200/40 dark:bg-emerald-900/30 rounded-full filter blur-3xl animate-pulse pointer-events-none"></div>
                            <div
                                className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-200/40 dark:bg-teal-900/30 rounded-full filter blur-3xl animate-pulse pointer-events-none"
                                style={{ animationDelay: "1s" }}
                            ></div>
                            <div
                                className="absolute top-1/3 right-1/4 w-40 h-40 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full filter blur-2xl animate-pulse pointer-events-none"
                                style={{ animationDelay: "2s" }}
                            ></div>

                            <div className="relative z-10">
                                {/* Enhanced Dashboard Stats Section */}
                                <motion.div 
                                    className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 p-8 relative flex-shrink-0 mb-8 rounded-2xl shadow-xl backdrop-blur-xl"
                                    variants={animationVariants.fadeIn}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {dashboardCards.map((card, index) => (
                                                <DashboardCard
                                                    key={index}
                                                    card={card}
                                                    index={index}
                                                    dashboardCardsRef={dashboardCardsRef}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Enhanced Transactions Section */}
                                <motion.div 
                                    className="mb-8"
                                    variants={animationVariants.slideUp}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                                                <WalletIcon className="h-6 w-6 text-white" />
                                            </div>
                                            {t('Transaction History')}
                                            {isFiltering && (
                                                <div className="ml-3 animate-spin">
                                                    <RefreshCw className="h-5 w-5 text-emerald-500" />
                                                </div>
                                            )}
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={clearFilters}
                                                className="flex items-center gap-2 rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                                                disabled={!hasActiveFilters}
                                            >
                                                <Filter className="h-4 w-4" />
                                                Clear Filters
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Enhanced Advanced Filters */}
                                    <Card className="border border-slate-200/50 dark:border-slate-800/50 shadow-xl rounded-2xl overflow-hidden mb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-slate-50/80 to-emerald-50/80 dark:from-slate-800/80 dark:to-emerald-900/20 border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-5">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                                                    <Filter className="h-5 w-5 text-white" />
                                                </div>
                                                Search & Filters
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                                {/* Enhanced Search Input */}
                                                <div className="relative">
                                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Search transactions..."
                                                        value={searchTerm}
                                                        onChange={(e) => handleSearchChange(e.target.value)}
                                                        className="pl-12 pr-4 py-3 w-full rounded-xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-sm"
                                                    />
                                                </div>

                                                {/* Enhanced Type Filter */}
                                                <Select value={typeFilter} onValueChange={(value) => {
                                                    setTypeFilter(value);
                                                    handleFilterChange('type', value);
                                                }}>
                                                    <SelectTrigger className="w-full rounded-xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-sm">
                                                        <SelectValue placeholder="Transaction Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">All Types</SelectItem>
                                                        <SelectItem value="deposit">Deposits</SelectItem>
                                                        <SelectItem value="withdraw">Withdrawals</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {/* Enhanced Date From */}
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        type="date"
                                                        placeholder="From Date"
                                                        value={dateFrom}
                                                        onChange={(e) => {
                                                            setDateFrom(e.target.value);
                                                            handleFilterChange('date_from', e.target.value);
                                                        }}
                                                        className="pl-12 pr-4 py-3 w-full rounded-xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-sm"
                                                    />
                                                </div>

                                                {/* Enhanced Date To */}
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        type="date"
                                                        placeholder="To Date"
                                                        value={dateTo}
                                                        onChange={(e) => {
                                                            setDateTo(e.target.value);
                                                            handleFilterChange('date_to', e.target.value);
                                                        }}
                                                        className="pl-12 pr-4 py-3 w-full rounded-xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Enhanced Results Summary & Per Page */}
                                            <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                                <div className="flex items-center gap-6">
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        <span className="font-semibold">
                                                            {transactions?.total || 0} total results
                                                        </span>
                                                        {hasActiveFilters && (
                                                            <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                                                (filtered)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Show:</span>
                                                        <Select value={perPage.toString()} onValueChange={(value) => {
                                                            setPerPage(parseInt(value));
                                                            handleFilterChange('per_page', value);
                                                        }}>
                                                            <SelectTrigger className="w-24 rounded-xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-sm">
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
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Enhanced Transactions Table */}
                                    <Card className="border border-slate-200/50 dark:border-slate-800/50 shadow-xl rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                                        <CardHeader className="bg-gradient-to-r from-slate-50/80 to-emerald-50/80 dark:from-slate-800/80 dark:to-emerald-900/20 border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-5">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                                                        <WalletIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                    Transaction History
                                                </CardTitle>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full px-4 py-2 font-semibold">
                                                        {transactions?.data?.length || 0} of {transactions?.total || 0} records
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex items-center gap-2 rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                                                        onClick={handleExport}
                                                        disabled={isFiltering}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Export
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {transactions?.data && transactions.data.length > 0 ? (
                                                <>
                                                    <div className="overflow-x-auto">
                                                        {/* Enhanced Transaction Rows */}
                                                        <div>
                                                            {transactions.data.map((tx, index) => (
                                                                <TransactionRow
                                                                    key={tx.id}
                                                                    tx={tx}
                                                                    index={index}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Enhanced Pagination */}
                                                    <Pagination data={transactions} onPageChange={handlePageChange} />
                                                </>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="bg-white/90 dark:bg-slate-900/90 p-16 text-center"
                                                >
                                                    <div className="inline-flex h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-8 shadow-lg">
                                                        <WalletIcon className="h-12 w-12 text-slate-400" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                                        {hasActiveFilters ? 'No matching transactions found' : 'No transactions yet'}
                                                    </h3>
                                                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
                                                        {hasActiveFilters
                                                            ? 'Try adjusting your search criteria or clear filters to see more results.'
                                                            : 'Start using your wallet by making your first deposit or withdrawal. All your transaction history will appear here.'
                                                        }
                                                    </p>
                                                    <div className="flex items-center justify-center gap-4">
                                                        {hasActiveFilters ? (
                                                            <Button
                                                                variant="outline"
                                                                onClick={clearFilters}
                                                                className="flex items-center gap-2 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                                                            >
                                                                <Filter className="h-5 w-5" />
                                                                Clear Filters
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                <Link href={route('customer.wallet.deposit.form')}>
                                                                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                                                                        <Plus className="h-5 w-5" />
                                                                        Make Deposit
                                                                    </Button>
                                                                </Link>
                                                                <Link href={route('customer.wallet.withdraw.form')}>
                                                                    <Button variant="outline" className="flex items-center gap-2 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200">
                                                                        <ArrowDownRight className="h-5 w-5" />
                                                                        Withdraw Funds
                                                                    </Button>
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 