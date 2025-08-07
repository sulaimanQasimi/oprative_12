import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, TrendingUp, Plus, RefreshCw, Calendar, Clock, Download, CreditCard, DollarSign, Eye, MoreHorizontal, Search, Filter, SortAsc, SortDesc, ChevronLeft, ChevronRight, Sparkles, Zap, Star } from 'lucide-react';
import CustomerNavbar from "@/Components/CustomerNavbar";
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { debounce } from 'lodash';

// Enhanced animation variants with more dynamic effects
const animationVariants = {
    fadeIn: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    },
    slideUp: {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    },
    staggerChildren: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    },
    cardHover: {
        hover: {
            y: -12,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    },
    pulse: {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
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

// Enhanced AnimatedCounter component with better animations
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
            anime({
                targets: nodeRef.current,
                innerHTML: [0, value],
                easing: "easeOutElastic(1, 0.5)",
                duration: duration,
                round: 1,
                delay: 500,
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

// Enhanced PageLoader with more dynamic animations
const PageLoader = React.memo(({ isVisible }) => {
    const { t } = useLaravelReactI18n();
    
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-teal-500/20 animate-pulse"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div 
                            className="relative" 
                            animate={{ 
                                scale: [0.95, 1.05, 0.95],
                                rotate: [0, 5, -5, 0]
                            }} 
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity, 
                                ease: 'easeInOut' 
                            }}
                        >
                            <div className="relative flex items-center justify-center h-48 w-48">
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 blur-xl"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <motion.div 
                                    className="relative z-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 h-24 w-24 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20"
                                    animate={{ 
                                        rotate: [0, 10, 0, -10, 0], 
                                        scale: [1, 1.1, 1, 1.1, 1] 
                                    }} 
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <WalletIcon className="h-12 w-12 text-white drop-shadow-lg" />
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="mt-8 text-white/80 text-lg font-medium"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {t('Loading Wallet...')}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

// Enhanced Pagination component
const Pagination = React.memo(({ data, onPageChange }) => {
    const { t } = useLaravelReactI18n();
    if (!data || !data.links || data.links.length <= 3) return null;

    return (
        <motion.div 
            className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50/80 to-emerald-50/80 dark:from-slate-800/80 dark:to-emerald-900/20 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">
                    {t('Showing')} {data.from || 0} {t('to')} {data.to || 0} {t('of')} {data.total || 0} {t('results')}
                </span>
            </div>
            <div className="flex items-center gap-2">
                {data.links.map((link, index) => {
                    if (index === 0) {
                        return (
                            <motion.div
                                key="prev"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && onPageChange(link.url)}
                                    className="flex items-center gap-1 rounded-xl border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    {t('Previous')}
                                </Button>
                            </motion.div>
                        );
                    }
                    if (index === data.links.length - 1) {
                        return (
                            <motion.div
                                key="next"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && onPageChange(link.url)}
                                    className="flex items-center gap-1 rounded-xl border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200"
                                >
                                    {t('Next')}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        );
                    }
                    return (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && onPageChange(link.url)}
                                className={`min-w-[2.5rem] rounded-xl transition-all duration-200 ${
                                    link.active 
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg' 
                                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500'
                                }`}
                            >
                                {link.label}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
});

// Enhanced Dashboard Card component with premium effects
const DashboardCard = React.memo(({ card, index, dashboardCardsRef }) => (
    <motion.div
        className={`relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer`}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
            duration: 0.8, 
            delay: index * 0.15, 
            ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        whileHover={{ 
            y: -15, 
            scale: 1.03,
            transition: { duration: 0.3 }
        }}
        variants={animationVariants.cardHover}
    >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.bgClass} opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        
        {/* Animated shine effect */}
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        />
        
        {/* Floating particles */}
        <motion.div
            className="absolute top-4 right-4"
            animate={{ 
                y: [0, -10, 0],
                rotate: [0, 180, 360]
            }}
            transition={{ 
                duration: 4, 
                repeat: Infinity,
                delay: index * 0.3
            }}
        >
            <Sparkles className="h-5 w-5 text-white/60" />
        </motion.div>

        <div ref={(el) => (dashboardCardsRef.current[index] = el)} className="relative z-10 p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-white/80 text-sm">{card.trend}</p>
                </div>
                <motion.div 
                    className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg"
                    whileHover={{ 
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.5 }
                    }}
                >
                    {card.icon}
                </motion.div>
            </div>
            
            <motion.div 
                className="text-4xl font-bold text-white mb-4 flex items-end"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <AnimatedCounter 
                    value={typeof card.value === "string" ? parseInt(card.value.replace(/[^0-9.-]+/g, "")) : card.value} 
                    suffix={card.suffix || ""} 
                    duration={2500} 
                />
            </motion.div>
            
            <motion.div 
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm py-2 px-4 rounded-full border border-white/20"
                whileHover={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    scale: 1.05
                }}
                transition={{ duration: 0.3 }}
            >
                <Star className="h-4 w-4 text-white/80" />
                <span className="text-white/90 text-sm font-medium">{card.trend}</span>
            </motion.div>
        </div>
    </motion.div>
));

// Enhanced Transaction Row component with better animations
const TransactionRow = React.memo(({ tx, index }) => {
    const { t } = useLaravelReactI18n();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ 
                y: -2,
                scale: 1.01,
                transition: { duration: 0.2 }
            }}
            className="px-6 py-5 bg-white/90 dark:bg-slate-900/90 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 grid grid-cols-12 items-center hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 dark:hover:from-slate-800/50 dark:hover:to-emerald-900/20 transition-all duration-300 group backdrop-blur-sm"
        >
            <div className="col-span-4 md:col-span-3 lg:col-span-3 flex items-center gap-4">
                <motion.div 
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg ${
                        tx.type === 'deposit' 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                            : 'bg-gradient-to-br from-rose-500 to-red-600'
                    }`}
                    whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2 }
                    }}
                >
                    {tx.type === 'deposit' ? (
                        <ArrowUpRight className="h-6 w-6" />
                    ) : (
                        <ArrowDownRight className="h-6 w-6" />
                    )}
                </motion.div>
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
                <motion.div 
                    className={`font-bold text-xl ${
                        tx.type === 'deposit' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} AFN
                </motion.div>
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
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={t('View Details')}
                    >
                        <Eye className="h-5 w-5" />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
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
            bgClass: "from-emerald-500 to-teal-600",
            trend: t("Available for transactions"),
        },
        {
            title: t("Total Deposits"),
            value: statistics.total_deposits,
            suffix: " AFN",
            icon: <ArrowUpRight className="h-6 w-6" />,
            bgClass: "from-green-500 to-emerald-600",
            trend: t("All time deposits"),
        },
        {
            title: t("Total Withdrawals"),
            value: statistics.total_withdrawals,
            suffix: " AFN",
            icon: <ArrowDownRight className="h-6 w-6" />,
            bgClass: "from-rose-500 to-red-600",
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
                    <motion.header
                        ref={headerRef}
                        initial={{ opacity: 0, y: -30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 py-8 px-10 flex items-center justify-between sticky top-0 z-30 shadow-2xl"
                    >
                        <div className="flex items-center space-x-8">
                            <div className="relative flex flex-col">
                                <motion.span 
                                    className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {t("Wallet Management")}
                                </motion.span>
                                <motion.h1 
                                    className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <motion.div 
                                        className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-2xl border border-white/20 animate-glow"
                                        whileHover={{ 
                                            scale: 1.1,
                                            rotate: 5,
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        <WalletIcon className="h-10 w-10 text-white drop-shadow-lg" />
                                    </motion.div>
                                    <span className="animate-float">{customer.name} {t('Wallet')}</span>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Badge variant="outline" className="ml-4 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-400 dark:border-emerald-800 rounded-full px-6 py-3 text-xl font-bold shadow-lg">
                                            {wallet.balance} AFN
                                        </Badge>
                                    </motion.div>
                                </motion.h1>
                            </div>
                        </div>

                        <motion.div 
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {(customer.permissions.withdraw_wallet) && (
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={route('customer.wallet.withdraw.form')}>
                                        <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center gap-3 px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                            <ArrowDownRight className="h-6 w-6" />
                                            {t("Withdraw")}
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}

                            {(customer.permissions.deposit_wallet) && (
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={route('customer.wallet.deposit.form')}>
                                        <Button className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-800 text-white flex items-center gap-3 px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl border border-white/20">
                                            <Plus className="h-6 w-6" />
                                            {t("Deposit")}
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}
                            <motion.div
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-3 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                                    onClick={handleRefresh}
                                    disabled={isFiltering}
                                >
                                    <RefreshCw className={`h-5 w-5 ${isFiltering ? 'animate-spin' : ''}`} />
                                    {t("Refresh")}
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.header>

                    {/* Enhanced Main Content Container */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-10 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10">
                        <div className="max-w-7xl mx-auto relative">
                            {/* Premium Background Elements */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/60 to-teal-50/60 dark:from-slate-900/60 dark:to-slate-800/60 pointer-events-none"></div>
                            <motion.div 
                                className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-900/40 rounded-full filter blur-3xl animate-pulse pointer-events-none"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-200/50 dark:bg-teal-900/40 rounded-full filter blur-3xl animate-pulse pointer-events-none"
                                style={{ animationDelay: "1s" }}
                                animate={{ 
                                    scale: [1, 1.3, 1],
                                    opacity: [0.4, 0.7, 0.4]
                                }}
                                transition={{ duration: 5, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute top-1/3 right-1/4 w-48 h-48 bg-emerald-200/40 dark:bg-emerald-900/30 rounded-full filter blur-2xl animate-pulse pointer-events-none"
                                style={{ animationDelay: "2s" }}
                                animate={{ 
                                    y: [0, -20, 0],
                                    opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{ duration: 6, repeat: Infinity }}
                            />

                            <div className="relative z-10">
                                {/* Premium Dashboard Stats Section */}
                                <motion.div 
                                    className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/50 p-10 relative flex-shrink-0 mb-10 rounded-3xl shadow-2xl backdrop-blur-2xl"
                                    variants={animationVariants.fadeIn}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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

                                {/* Premium Transactions Section */}
                                <motion.div 
                                    className="mb-10"
                                    variants={animationVariants.slideUp}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <motion.h2 
                                            className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-4"
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <motion.div 
                                                className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-lg"
                                                whileHover={{ 
                                                    scale: 1.1,
                                                    rotate: 5,
                                                    transition: { duration: 0.3 }
                                                }}
                                            >
                                                <WalletIcon className="h-8 w-8 text-white" />
                                            </motion.div>
                                            {t('Transaction History')}
                                            {isFiltering && (
                                                <motion.div 
                                                    className="ml-4 animate-spin"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <RefreshCw className="h-6 w-6 text-emerald-500" />
                                                </motion.div>
                                            )}
                                        </motion.h2>
                                        <motion.div 
                                            className="flex items-center gap-4"
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={clearFilters}
                                                className="flex items-center gap-3 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                                                disabled={!hasActiveFilters}
                                            >
                                                <Filter className="h-5 w-5" />
                                                {t('Clear Filters')}
                                            </Button>
                                        </motion.div>
                                    </div>

                                    {/* Premium Advanced Filters */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <Card className="border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-3xl overflow-hidden mb-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl">
                                            <CardHeader className="bg-gradient-to-r from-slate-50/90 to-emerald-50/90 dark:from-slate-800/90 dark:to-emerald-900/30 border-b border-slate-200/50 dark:border-slate-800/50 px-8 py-6">
                                                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                                    <motion.div 
                                                        className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-lg"
                                                        whileHover={{ 
                                                            scale: 1.1,
                                                            rotate: 5,
                                                            transition: { duration: 0.3 }
                                                        }}
                                                    >
                                                        <Filter className="h-6 w-6 text-white" />
                                                    </motion.div>
                                                    {t('Search & Filters')}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                                                    {/* Premium Search Input */}
                                                    <div className="relative">
                                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                                                        <Input
                                                            type="text"
                                                            placeholder={t("Search transactions...")}
                                                            value={searchTerm}
                                                            onChange={(e) => handleSearchChange(e.target.value)}
                                                            className="pl-12 pr-4 py-4 w-full rounded-2xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                                                        />
                                                    </div>

                                                    {/* Premium Type Filter */}
                                                    <Select value={typeFilter} onValueChange={(value) => {
                                                        setTypeFilter(value);
                                                        handleFilterChange('type', value);
                                                    }}>
                                                        <SelectTrigger className="w-full rounded-2xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm py-4">
                                                            <SelectValue placeholder={t("Transaction Type")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">{t("All Types")}</SelectItem>
                                                            <SelectItem value="deposit">{t("Deposits")}</SelectItem>
                                                            <SelectItem value="withdraw">{t("Withdrawals")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    {/* Premium Date From */}
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                                                        <Input
                                                            type="date"
                                                            placeholder={t("From Date")}
                                                            value={dateFrom}
                                                            onChange={(e) => {
                                                                setDateFrom(e.target.value);
                                                                handleFilterChange('date_from', e.target.value);
                                                            }}
                                                            className="pl-12 pr-4 py-4 w-full rounded-2xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                                                        />
                                                    </div>

                                                    {/* Premium Date To */}
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                                                        <Input
                                                            type="date"
                                                            placeholder={t("To Date")}
                                                            value={dateTo}
                                                            onChange={(e) => {
                                                                setDateTo(e.target.value);
                                                                handleFilterChange('date_to', e.target.value);
                                                            }}
                                                            className="pl-12 pr-4 py-4 w-full rounded-2xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Premium Results Summary & Per Page */}
                                                <div className="flex items-center justify-between pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
                                                    <div className="flex items-center gap-8">
                                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                                            <span className="font-bold text-lg">
                                                                {transactions?.total || 0} {t('total results')}
                                                            </span>
                                                            {hasActiveFilters && (
                                                                <span className="ml-3 text-emerald-600 dark:text-emerald-400 font-bold">
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
                                                                <SelectTrigger className="w-28 rounded-2xl border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
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
                                    </motion.div>

                                    {/* Premium Transactions Table */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 }}
                                    >
                                        <Card className="border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-3xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl">
                                            <CardHeader className="bg-gradient-to-r from-slate-50/90 to-emerald-50/90 dark:from-slate-800/90 dark:to-emerald-900/30 border-b border-slate-200/50 dark:border-slate-800/50 px-8 py-6">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                                        <motion.div 
                                                            className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-lg"
                                                            whileHover={{ 
                                                                scale: 1.1,
                                                                rotate: 5,
                                                                transition: { duration: 0.3 }
                                                            }}
                                                        >
                                                            <WalletIcon className="h-6 w-6 text-white" />
                                                        </motion.div>
                                                        {t('Transaction History')}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant="outline" className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-400 dark:border-emerald-800 rounded-full px-6 py-3 font-bold text-lg shadow-lg">
                                                            {transactions?.data?.length || 0} {t('of')} {transactions?.total || 0} {t('records')}
                                                        </Badge>
                                                        <motion.div
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
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
                                                        </motion.div>
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
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="bg-white/95 dark:bg-slate-900/95 p-20 text-center"
                                                    >
                                                        <motion.div 
                                                            className="inline-flex h-32 w-32 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-10 shadow-2xl"
                                                            animate={{ 
                                                                scale: [1, 1.1, 1],
                                                                rotate: [0, 5, -5, 0]
                                                            }}
                                                            transition={{ duration: 4, repeat: Infinity }}
                                                        >
                                                            <WalletIcon className="h-16 w-16 text-slate-400" />
                                                        </motion.div>
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
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={clearFilters}
                                                                        className="flex items-center gap-3 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                                                                    >
                                                                        <Filter className="h-6 w-6" />
                                                                        {t('Clear Filters')}
                                                                    </Button>
                                                                </motion.div>
                                                            ) : (
                                                                <>
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        <Link href={route('customer.wallet.deposit.form')}>
                                                                            <Button className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-800 text-white flex items-center gap-3 px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl border border-white/20">
                                                                                <Plus className="h-6 w-6" />
                                                                                {t('Make Deposit')}
                                                                            </Button>
                                                                        </Link>
                                                                    </motion.div>
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        <Link href={route('customer.wallet.withdraw.form')}>
                                                                            <Button variant="outline" className="flex items-center gap-3 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                                                                <ArrowDownRight className="h-6 w-6" />
                                                                                {t('Withdraw Funds')}
                                                                            </Button>
                                                                        </Link>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 