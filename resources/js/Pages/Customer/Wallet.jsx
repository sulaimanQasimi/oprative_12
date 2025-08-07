import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, TrendingUp, Plus, RefreshCw, Calendar, Clock, Download, CreditCard, DollarSign, Eye, MoreHorizontal, Search, Filter, SortAsc, SortDesc, ChevronLeft, ChevronRight, Sparkles, Zap, Star } from 'lucide-react';
import CustomerNavbar from "@/Components/CustomerNavbar";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { debounce } from 'lodash';

// Professional gradient color schemes
const gradientSchemes = {
    primary: "from-blue-600 via-purple-600 to-indigo-700",
    secondary: "from-emerald-500 via-teal-600 to-cyan-600",
    accent: "from-rose-500 via-pink-600 to-purple-600",
    success: "from-green-500 via-emerald-600 to-teal-600",
    warning: "from-amber-500 via-orange-600 to-red-600",
    info: "from-blue-500 via-cyan-600 to-teal-600"
};

// Enhanced AnimatedCounter component
const AnimatedCounter = React.memo(({
    value,
    prefix = "",
    suffix = "",
    duration = 2000,
}) => {
    const nodeRef = useRef(null);
    const [counted, setCounted] = useState(false);

    useEffect(() => {
        if (!counted && nodeRef.current) {
            const startValue = 0;
            const endValue = value;
            const startTime = Date.now();
            
            const updateCounter = () => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / duration, 1);
                const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
                
                if (nodeRef.current) {
                    nodeRef.current.textContent = prefix + currentValue + suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    setCounted(true);
                }
            };
            
            updateCounter();
        }
    }, [value, counted, duration, prefix, suffix]);

    return (
        <span className="inline-block" ref={nodeRef}>
            {prefix}0{suffix}
        </span>
    );
});

// Professional PageLoader
const PageLoader = React.memo(({ isVisible }) => {
    const { t } = useLaravelReactI18n();
    
    if (!isVisible) return null;
    
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex flex-col items-center justify-center">
            <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl">
                    <WalletIcon className="h-12 w-12 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl opacity-20 blur-xl"></div>
            </div>
            <div className="mt-8 text-white/90 text-lg font-medium">
                {t('Loading Wallet...')}
            </div>
        </div>
    );
});

// Professional Pagination component
const Pagination = React.memo(({ data, onPageChange }) => {
    const { t } = useLaravelReactI18n();
    if (!data || !data.links || data.links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">
                    {t('Showing')} {data.from || 0} {t('to')} {data.to || 0} {t('of')} {data.total || 0} {t('results')}
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
                                className="flex items-center gap-1 rounded-xl border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {t('Previous')}
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
                                className="flex items-center gap-1 rounded-xl border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
                            >
                                {t('Next')}
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
                            className={`min-w-[2.5rem] rounded-xl transition-all duration-200 ${
                                link.active 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500'
                            }`}
                        >
                            {link.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
});

// Professional Dashboard Card component
const DashboardCard = React.memo(({ card, index }) => (
    <div className={`relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer bg-gradient-to-br ${card.bgClass} border border-white/20`}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 p-6">
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                        {card.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                        {card.trend}
                    </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                    {card.icon}
                </div>
            </div>
            
            <div className="text-3xl font-bold text-white mb-4 flex items-end">
                <AnimatedCounter 
                    value={typeof card.value === "string" ? parseInt(card.value.replace(/[^0-9.-]+/g, "")) : card.value} 
                    suffix={card.suffix || ""} 
                    duration={2000} 
                />
            </div>
            
            <div className="inline-flex items-center gap-3 bg-white/25 backdrop-blur-sm py-2 px-4 rounded-xl border border-white/30 shadow-lg">
                <Star className="h-4 w-4 text-white/90" />
                <span className="text-white/95 text-sm font-semibold">{card.trend}</span>
            </div>
        </div>
    </div>
));

// Professional Transaction Row component
const TransactionRow = React.memo(({ tx, index }) => {
    const { t } = useLaravelReactI18n();
    
    return (
        <div className="px-6 py-4 bg-white/95 dark:bg-slate-900/95 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 grid grid-cols-12 items-center hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-slate-800/50 dark:hover:to-blue-900/20 transition-all duration-300 group">
            <div className="col-span-4 md:col-span-3 lg:col-span-3 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg ${
                    tx.type === 'deposit' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-br from-rose-500 to-red-600'
                }`}>
                    {tx.type === 'deposit' ? (
                        <ArrowUpRight className="h-6 w-6" />
                    ) : (
                        <ArrowDownRight className="h-6 w-6" />
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate text-lg">
                        {tx.type === 'deposit' ? t('Wallet Deposit') : t('Wallet Withdrawal')}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            tx.type === 'deposit' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {t('ID')}: {tx.id}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden md:block">
                <div className={`font-bold text-xl ${
                    tx.type === 'deposit' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                }`}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} AFN
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {tx.type === 'deposit' ? t('Credit') : t('Debit')}
                </div>
            </div>
            
            <div className="col-span-3 md:col-span-3 lg:col-span-3 text-center hidden md:block">
                <div className="text-sm text-slate-700 dark:text-slate-300 truncate font-medium">
                    {tx.description || t('No description provided')}
                </div>
            </div>
            
            <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden lg:block">
                <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {tx.formatted_date || new Date(tx.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {tx.formatted_time || new Date(tx.created_at).toLocaleTimeString()}
                </div>
            </div>
            
            <div className="col-span-8 md:col-span-2 lg:col-span-2 flex justify-end gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                    title={t('View Details')}
                >
                    <Eye className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
});

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
            title: t("Current Balance"),
            value: wallet.balance,
            suffix: " AFN",
            icon: <WalletIcon className="h-6 w-6" />,
            bgClass: "from-emerald-500 via-teal-600 to-emerald-700",
            trend: t("Available for transactions"),
        },
        {
            title: t("Total Deposits"),
            value: statistics.total_deposits,
            suffix: " AFN",
            icon: <ArrowUpRight className="h-6 w-6" />,
            bgClass: "from-green-500 via-emerald-600 to-teal-600",
            trend: t("All time deposits"),
        },
        {
            title: t("Total Withdrawals"),
            value: statistics.total_withdrawals,
            suffix: " AFN",
            icon: <ArrowDownRight className="h-6 w-6" />,
            bgClass: "from-rose-500 via-pink-600 to-purple-600",
            trend: t("All time withdrawals"),
        },
    ], [wallet.balance, statistics.total_deposits, statistics.total_withdrawals, t]);

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
            // Removed animation logic as per new_code
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
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    .animate-float { animation: float 3s ease-in-out infinite; }
                    @keyframes glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
                    }
                    .animate-glow { animation: glow 2s ease-in-out infinite; }
                `}</style>
            </Head>
            <PageLoader isVisible={loading} />
            
            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-950 dark:via-emerald-950/20 dark:to-teal-950/20 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.wallet"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Premium Enhanced Header */}
                    <header
                        ref={headerRef}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 py-6 px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xl">
                        <div className="flex items-center space-x-10">
                            <div className="relative flex flex-col">
                                <span 
                                    className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3"
                                >
                                    {t("Wallet Management")}
                                </span>
                                <h1 
                                    className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-4"
                                >
                                    <div 
                                        className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-xl border border-white/20 animate-glow"
                                    >
                                        <WalletIcon className="h-8 w-8 text-white drop-shadow-lg" />
                                    </div>
                                    <span 
                                    >
                                        {customer.name} {t('Wallet')}
                                    </span>
                                    <div
                                    >
                                        <Badge variant="outline" className="ml-4 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-400 dark:border-emerald-800 rounded-full px-6 py-2 text-lg font-bold shadow-lg">
                                            {wallet.balance} AFN
                                        </Badge>
                                    </div>
                                </h1>
                            </div>
                        </div>

                        <div 
                            className="flex items-center space-x-6"
                        >
                            {(customer.permissions.withdraw_wallet) && (
                                <Link href={route('customer.wallet.withdraw.form')}>
                                    <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center gap-3 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800">
                                        <ArrowDownRight className="h-5 w-5" />
                                        {t("Withdraw")}
                                    </Button>
                                </Link>
                            )}

                            {(customer.permissions.deposit_wallet) && (
                                <Link href={route('customer.wallet.deposit.form')}>
                                    <Button className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-800 text-white flex items-center gap-3 px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border border-white/20">
                                        <Plus className="h-5 w-5" />
                                        {t("Deposit")}
                                    </Button>
                                </Link>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-3 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
                                onClick={handleRefresh}
                                disabled={isFiltering}
                            >
                                <RefreshCw className={`h-5 w-5 ${isFiltering ? 'animate-spin' : ''}`} />
                                {t("Refresh")}
                            </Button>
                        </div>
                    </header>

                    {/* Professional Main Content Container */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
                        <div className="max-w-7xl mx-auto relative">
                            {/* Professional Background Elements */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/70 to-purple-50/70 dark:from-slate-900/70 dark:to-slate-800/70 pointer-events-none"></div>
                            <div 
                                className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/60 dark:bg-blue-900/50 rounded-full filter blur-3xl pointer-events-none"
                            />
                            <div
                                className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/60 dark:bg-purple-900/50 rounded-full filter blur-3xl pointer-events-none"
                                style={{ animationDelay: "1s" }}
                            />
                            <div
                                className="absolute top-1/3 right-1/4 w-48 h-48 bg-indigo-200/50 dark:bg-indigo-900/40 rounded-full filter blur-2xl pointer-events-none"
                                style={{ animationDelay: "2s" }}
                            />

                            <div className="relative z-10">
                                {/* Professional Dashboard Stats Section */}
                                <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/50 p-8 relative flex-shrink-0 mb-8 rounded-2xl shadow-xl backdrop-blur-2xl">
                                    <div className="relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {dashboardCards.map((card, index) => (
                                                <DashboardCard
                                                    key={index}
                                                    card={card}
                                                    index={index}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Transactions Section */}
                                <div className="mb-12">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 shadow-lg">
                                                <WalletIcon className="h-8 w-8 text-white" />
                                            </div>
                                            {t('Transaction History')}
                                            {isFiltering && (
                                                <div className="ml-4 animate-spin">
                                                    <RefreshCw className="h-6 w-6 text-blue-500" />
                                                </div>
                                            )}
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={clearFilters}
                                                className="flex items-center gap-3 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
                                                disabled={!hasActiveFilters}
                                            >
                                                <Filter className="h-5 w-5" />
                                                {t('Clear Filters')}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Professional Advanced Filters */}
                                    <div>
                                        <Card className="border border-slate-200/50 dark:border-slate-800/50 shadow-xl rounded-2xl overflow-hidden mb-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl">
                                            <CardHeader className="bg-gradient-to-r from-slate-50/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/30 border-b border-slate-200/50 dark:border-slate-800/50 px-8 py-6">
                                                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 shadow-lg">
                                                        <Filter className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t('Search & Filters')}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                    {/* Professional Search Input */}
                                                    <div className="relative">
                                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                        <Input
                                                            type="text"
                                                            placeholder={t("Search transactions...")}
                                                            value={searchTerm}
                                                            onChange={(e) => handleSearchChange(e.target.value)}
                                                            className="pl-12 pr-4 py-3 w-full rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                                                        />
                                                    </div>

                                                    {/* Professional Type Filter */}
                                                    <Select value={typeFilter} onValueChange={(value) => {
                                                        setTypeFilter(value);
                                                        handleFilterChange('type', value);
                                                    }}>
                                                        <SelectTrigger className="w-full rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm py-3">
                                                            <SelectValue placeholder={t("Transaction Type")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">{t("All Types")}</SelectItem>
                                                            <SelectItem value="deposit">{t("Deposits")}</SelectItem>
                                                            <SelectItem value="withdraw">{t("Withdrawals")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    {/* Professional Date From */}
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                        <Input
                                                            type="date"
                                                            placeholder={t("From Date")}
                                                            value={dateFrom}
                                                            onChange={(e) => {
                                                                setDateFrom(e.target.value);
                                                                handleFilterChange('date_from', e.target.value);
                                                            }}
                                                            className="pl-12 pr-4 py-3 w-full rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                                                        />
                                                    </div>

                                                    {/* Professional Date To */}
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                        <Input
                                                            type="date"
                                                            placeholder={t("To Date")}
                                                            value={dateTo}
                                                            onChange={(e) => {
                                                                setDateTo(e.target.value);
                                                                handleFilterChange('date_to', e.target.value);
                                                            }}
                                                            className="pl-12 pr-4 py-3 w-full rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Professional Results Summary & Per Page */}
                                                <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                                    <div className="flex items-center gap-8">
                                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                                            <span className="font-bold text-lg">
                                                                {transactions?.total || 0} {t('total results')}
                                                            </span>
                                                            {hasActiveFilters && (
                                                                <span className="ml-3 text-blue-600 dark:text-blue-400 font-bold">
                                                                    ({t('filtered')})
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">{t('Show')}:</span>
                                                            <Select value={perPage.toString()} onValueChange={(value) => {
                                                                setPerPage(parseInt(value));
                                                                handleFilterChange('per_page', value);
                                                            }}>
                                                                <SelectTrigger className="w-28 rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
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
                                    </div>

                                    {/* Premium Transactions Table */}
                                    <div
                                    >
                                        <Card className="border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-3xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl">
                                            <CardHeader className="bg-gradient-to-r from-slate-50/90 to-emerald-50/90 dark:from-slate-800/90 dark:to-emerald-900/30 border-b border-slate-200/50 dark:border-slate-800/50 px-8 py-6">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                                        <div 
                                                            className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-lg"
                                                        >
                                                            <WalletIcon className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t('Transaction History')}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant="outline" className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-400 dark:border-emerald-800 rounded-full px-6 py-3 font-bold text-lg shadow-lg">
                                                            {transactions?.data?.length || 0} {t('of')} {transactions?.total || 0} {t('records')}
                                                        </Badge>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex items-center gap-3 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                                                            onClick={handleExport}
                                                            disabled={isFiltering}
                                                        >
                                                            <Download className="h-5 w-5" />
                                                            {t('Export')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                {transactions?.data && transactions.data.length > 0 ? (
                                                    <>
                                                        <div className="overflow-x-auto">
                                                            {/* Premium Transaction Rows */}
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

                                                        {/* Premium Pagination */}
                                                        <Pagination data={transactions} onPageChange={handlePageChange} />
                                                    </>
                                                ) : (
                                                    <div
                                                        className="bg-white/95 dark:bg-slate-900/95 p-20 text-center"
                                                    >
                                                        <div 
                                                            className="inline-flex h-32 w-32 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-10 shadow-2xl"
                                                        >
                                                            <WalletIcon className="h-16 w-16 text-slate-400" />
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                                            {hasActiveFilters ? t('No matching transactions found') : t('No transactions yet')}
                                                        </h3>
                                                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg">
                                                            {hasActiveFilters
                                                                ? t('Try adjusting your search criteria or clear filters to see more results.')
                                                                : t('Start using your wallet by making your first deposit or withdrawal. All your transaction history will appear here.')
                                                            }
                                                        </p>
                                                        <div className="flex items-center justify-center gap-6">
                                                            {hasActiveFilters ? (
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={clearFilters}
                                                                    className="flex items-center gap-3 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                                                                >
                                                                    <Filter className="h-6 w-6" />
                                                                    {t('Clear Filters')}
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Link href={route('customer.wallet.deposit.form')}>
                                                                        <Button className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-800 text-white flex items-center gap-3 px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl border border-white/20">
                                                                            <Plus className="h-6 w-6" />
                                                                            {t('Make Deposit')}
                                                                        </Button>
                                                                    </Link>
                                                                    <Link href={route('customer.wallet.withdraw.form')}>
                                                                        <Button variant="outline" className="flex items-center gap-3 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                                                            <ArrowDownRight className="h-6 w-6" />
                                                                            {t('Withdraw Funds')}
                                                                        </Button>
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 
