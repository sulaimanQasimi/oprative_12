import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    Search, TrendingUp, ChevronRight, Plus, Filter, ArrowUpRight, ArrowDownRight,
    BarChart3, Calendar, Clock, Download, MoreHorizontal, ExternalLink, Tag, User,
    CreditCard, DollarSign, Mail, Settings, Inbox, ChevronDown, Eye, RefreshCw, Sliders,
    ShoppingCart, Package, UserCheck
} from 'lucide-react';
import anime from 'animejs';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion } from 'framer-motion';

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

// AnimatedCounter component
const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 1500 }) => {
    const nodeRef = useRef(null);
    const [counted, setCounted] = useState(false);

    useEffect(() => {
        if (!counted && nodeRef.current) {
            anime({
                targets: nodeRef.current,
                innerHTML: [0, value],
                easing: 'easeInOutExpo',
                duration: duration,
                round: 1, // Rounds the values to 1 decimal
                delay: 300,
                begin: () => setCounted(true)
            });
        }
    }, [value, counted, duration]);

    return (
        <span className="inline-block" ref={nodeRef}>
            {prefix}0{suffix}
        </span>
    );
};

// Add PageLoader component
const PageLoader = ({ isVisible }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-rose-900 via-red-900 to-rose-950 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'all' : 'none'
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Animated light beams */}
            <div className="absolute w-full h-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-r from-rose-400/10 via-red-500/10 to-transparent h-[30vh] w-[100vw]"
                        style={{
                            top: `${10 + i * 20}%`,
                            left: '-100%',
                            transformOrigin: 'left center',
                            rotate: `${-20 + i * 10}deg`,
                        }}
                        animate={{
                            left: ['100%', '-100%'],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 3,
                        }}
                    />
                ))}
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                        animate={{
                            y: [null, `${-Math.random() * 100 - 50}%`],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Main animated container */}
                <motion.div
                    className="relative"
                    animate={{
                        scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Pulsing background circles */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-full bg-rose-600/5 filter blur-2xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute w-72 h-72 rounded-full bg-red-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />

                    {/* Animated logo/icon container */}
                    <div className="relative flex items-center justify-center h-40 w-40">
                        {/* Spinning rings */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-rose-300/10"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />
                        <motion.div
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-red-400/20"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />
                        <motion.div
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-rose-400/30"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 10,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />

                        {/* Spinner arcs */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-r-rose-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-red-400 border-t-transparent border-l-transparent border-r-transparent"
                            animate={{ rotate: -180 }}
                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        />

                        {/* Icon/logo in center */}
                        <motion.div
                            className="relative z-10 bg-gradient-to-br from-rose-500 to-red-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.1, 1, 1.1, 1]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <TrendingUp className="h-10 w-10 text-white drop-shadow-lg rotate-180" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function Outcome({ auth, outcome }) {
    const { t } = useLaravelReactI18n();
    
    // State for loading and animations
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('grid');
    const [isAnimated, setIsAnimated] = useState(false);
    const [dateFilter, setDateFilter] = useState('all');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [showCharts, setShowCharts] = useState(true);
    const [loading, setLoading] = useState(true);

    // Refs for animation targets
    const headerRef = useRef(null);
    const cardsRef = useRef(null);
    const gridItemsRef = useRef([]);
    const listItemsRef = useRef([]);
    const dashboardCardsRef = useRef([]);

    // Animation timeline
    const timelineRef = useRef(null);

    // Filter outcome records based on search term and date filter
    const filteredOutcome = outcome && outcome.length
        ? outcome.filter(record => {
            // Text search filter
            const textMatch = (record.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             record.destination?.toLowerCase().includes(searchTerm.toLowerCase()));

            // Date filter
            let dateMatch = true;
            if (dateFilter !== 'all') {
                const recordDate = new Date(record.date);
                const now = new Date();

                switch(dateFilter) {
                    case 'today':
                        dateMatch = recordDate.toDateString() === now.toDateString();
                        break;
                    case 'yesterday':
                        const yesterday = new Date(now);
                        yesterday.setDate(now.getDate() - 1);
                        dateMatch = recordDate.toDateString() === yesterday.toDateString();
                        break;
                    case 'week':
                        const weekAgo = new Date(now);
                        weekAgo.setDate(now.getDate() - 7);
                        dateMatch = recordDate >= weekAgo;
                        break;
                    case 'month':
                        dateMatch = recordDate.getMonth() === now.getMonth() &&
                                  recordDate.getFullYear() === now.getFullYear();
                        break;
                }
            }

            return textMatch && dateMatch;
          })
        : [];

    // Calculate total outcome value
    const totalOutcomeValue = outcome?.reduce((sum, record) => sum + record.amount, 0) || 0;

    // Calculate this month's outcome
    const thisMonthOutcome = outcome?.filter(i => {
        const date = new Date(i.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    }).reduce((sum, i) => sum + i.amount, 0) || 0;

    // Calculate last month's outcome
    const lastMonthOutcome = outcome?.filter(i => {
        const date = new Date(i.date);
        const now = new Date();
        let lastMonth = now.getMonth() - 1;
        let year = now.getFullYear();
        if (lastMonth < 0) {
            lastMonth = 11;
            year--;
        }
        return date.getMonth() === lastMonth &&
               date.getFullYear() === year;
    }).reduce((sum, i) => sum + i.amount, 0) || 0;

    // Calculate outcome change percentage
    const outcomeChangePercent = lastMonthOutcome ?
        ((thisMonthOutcome - lastMonthOutcome) / lastMonthOutcome * 100) : 0;

    // Get unique destinations and their totals
    const destinationTotals = outcome && outcome.length ?
        Array.from(new Set(outcome.map(i => i.destination)))
            .map(destination => ({
                name: destination,
                total: outcome.filter(i => i.destination === destination)
                    .reduce((sum, i) => sum + i.amount, 0)
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5) : [];

    // Get transaction count by day for the past week
    const getWeeklyActivity = () => {
        if (!outcome || outcome.length === 0) return [];

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayOfWeek = days[date.getDay()];

            const dateString = date.toISOString().split('T')[0];
            const count = outcome.filter(item => item.date === dateString).length;

            result.push({ name: dayOfWeek, value: count });
        }

        return result;
    };

    const weeklyActivity = getWeeklyActivity();

    // Function to get month name from number
    const getMonthName = (monthNumber) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNumber];
    };

    // Calculate monthly breakdown
    const calculateMonthlyBreakdown = () => {
        if (!outcome || outcome.length === 0) return [];

        const monthlyData = {};
        const now = new Date();
        const currentYear = now.getFullYear();

        // Initialize all months for current year
        for (let i = 0; i < 12; i++) {
            monthlyData[i] = {
                month: getMonthName(i),
                value: 0,
                count: 0
            };
        }

        // Populate with actual data
        outcome.forEach(record => {
            const date = new Date(record.date);
            if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                monthlyData[month].value += record.amount;
                monthlyData[month].count += 1;
            }
        });

        // Convert to array and add percentage
        return Object.values(monthlyData).map((item, index) => {
            const prevMonth = index > 0 ? monthlyData[index - 1].value : 0;
            const percentChange = prevMonth === 0
                ? 0
                : ((item.value - prevMonth) / prevMonth * 100);

            return {
                ...item,
                percentChange: percentChange
            };
        });
    };

    const monthlyBreakdown = calculateMonthlyBreakdown();

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Initialize the timeline
            timelineRef.current = anime.timeline({
                easing: 'easeOutExpo',
                duration: 800
            });

            // Animate header
            timelineRef.current.add({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600
            });

            // Animate dashboard cards with stagger
            timelineRef.current.add({
                targets: dashboardCardsRef.current,
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100),
                duration: 700
            }, '-=400');

            // Animate outcome cards or list items with stagger based on view
            if (view === 'grid' && gridItemsRef.current.length > 0) {
                timelineRef.current.add({
                    targets: gridItemsRef.current,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    scale: [0.95, 1],
                    delay: anime.stagger(50),
                    duration: 600
                }, '-=500');
            } else if (view === 'list' && listItemsRef.current.length > 0) {
                timelineRef.current.add({
                    targets: listItemsRef.current,
                    opacity: [0, 1],
                    translateX: [-20, 0],
                    delay: anime.stagger(30),
                    duration: 500
                }, '-=500');
            }

            setIsAnimated(true);
        }
    }, [isAnimated, view, filteredOutcome.length]);

    // Reset animation state when view changes
    useEffect(() => {
        setIsAnimated(false);
        // Clear refs
        gridItemsRef.current = [];
        listItemsRef.current = [];
    }, [view, searchTerm]);

    // Animation for view transition
    const handleViewChange = (newView) => {
        if (newView === view) return;

        anime({
            targets: cardsRef.current,
            opacity: [1, 0],
            scale: [1, 0.95],
            duration: 200,
            easing: 'easeInOutQuad',
            complete: () => {
                setView(newView);
                // Force immediate rerender to avoid flash of empty content
                setTimeout(() => {
                    anime({
                        targets: cardsRef.current,
                        opacity: [0, 1],
                        scale: [0.95, 1],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }, 50);
            }
        });
    };

    // Animation for hover effects
    const animateHover = (target, enter) => {
        anime({
            targets: target,
            scale: enter ? 1.03 : 1,
            boxShadow: enter ? '0 10px 30px rgba(0, 0, 0, 0.1)' : '0 4px 10px rgba(0, 0, 0, 0.08)',
            duration: 300,
            easing: 'spring(1, 80, 10, 0)'
        });
    };

    // Add useEffect to handle page loading
    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t("Warehouse Outcome")}>
                <style>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="warehouse.outcome" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header ref={headerRef} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-0.5">{t('Warehouse Management')}</span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t('Outcome Transactions')}
                                    <Badge variant="outline" className="ml-2 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 rounded-full">
                                        {outcome?.length || 0}
                                    </Badge>
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container - will modify dashboard cards next */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-950/30 opacity-80"></div>

                            {/* Animated background elements */}
                            <div className="absolute -left-40 -top-40 w-96 h-96 bg-rose-200/20 dark:bg-rose-900/10 rounded-full filter blur-3xl animate-pulse"></div>
                            <div className="absolute right-20 top-10 w-72 h-72 bg-red-200/20 dark:bg-red-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
                            <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-pink-200/20 dark:bg-pink-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
                            <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-orange-200/20 dark:bg-orange-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '18s', animationDelay: '1s' }}></div>

                            <div className="relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        {
                                            title: t("Total Outcome"),
                                            value: "$" + totalOutcomeValue.toFixed(2),
                                            icon: <DollarSign className="h-6 w-6" />,
                                            bgClass: "from-rose-500 to-red-600",
                                            secondaryIcon: <motion.div
                                                initial={{ opacity: 0.1, scale: 0.8 }}
                                                animate={{ opacity: [0.1, 0.15, 0.1], scale: [0.8, 0.9, 0.8] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute right-4 bottom-4"
                                            >
                                                <CreditCard className="h-16 w-16" />
                                            </motion.div>,
                                            trend: "All time transactions",
                                            trendIcon: <ArrowDownRight className="h-3.5 w-3.5 mr-1" />,
                                            trendValue: "",
                                            decorator: <motion.div
                                                className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full"
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.3, 0.2, 0.3]
                                                }}
                                                transition={{
                                                    duration: 8,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        },
                                        {
                                            title: t("This Month"),
                                            value: "$" + thisMonthOutcome.toFixed(2),
                                            icon: <Calendar className="h-6 w-6" />,
                                            bgClass: "from-red-500 to-rose-600",
                                            secondaryIcon: <motion.div
                                                initial={{ opacity: 0.1, rotate: 0 }}
                                                animate={{ opacity: [0.1, 0.15, 0.1], rotate: [0, 5, 0] }}
                                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute right-4 bottom-4"
                                            >
                                                <TrendingUp className="h-16 w-16 rotate-180" />
                                            </motion.div>,
                                            trend: outcomeChangePercent > 0
                                                ? t(`Up ${Math.abs(outcomeChangePercent).toFixed(1)}% from last month`)
                                                : t(`Down ${Math.abs(outcomeChangePercent).toFixed(1)}% from last month`),
                                            trendIcon: outcomeChangePercent >= 0
                                                ? <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                                : <ArrowDownRight className="h-3.5 w-3.5 mr-1" />,
                                            decorator: <motion.div
                                                className="absolute -left-6 -bottom-6 w-24 h-24 bg-red-500/10 rounded-full"
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.3, 0.2, 0.3]
                                                }}
                                                transition={{
                                                    duration: 7,
                                                    delay: 1,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        },
                                        {
                                            title: t("Transactions"),
                                            value: outcome?.length || 0,
                                            icon: <CreditCard className="h-6 w-6" />,
                                            bgClass: "from-pink-500 to-rose-600",
                                            secondaryIcon: <motion.div
                                                initial={{ opacity: 0.1, y: 0 }}
                                                animate={{ opacity: [0.1, 0.15, 0.1], y: [0, -5, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute right-4 bottom-4"
                                            >
                                                <Package className="h-16 w-16" />
                                            </motion.div>,
                                            trend: t("Total recorded transactions"),
                                            trendIcon: null,
                                            trendValue: "",
                                            decorator: <motion.div
                                                className="absolute right-10 top-10 w-16 h-16 bg-pink-500/10 rounded-full"
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [0.3, 0.2, 0.3]
                                                }}
                                                transition={{
                                                    duration: 5,
                                                    delay: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        },
                                        {
                                            title: t("Avg. Transaction"),
                                            value: "$" + (outcome && outcome.length ? (totalOutcomeValue / outcome.length).toFixed(2) : "0.00"),
                                            icon: <BarChart3 className="h-6 w-6" />,
                                            bgClass: "from-red-600 to-rose-500",
                                            secondaryIcon: <motion.div
                                                initial={{ opacity: 0.1, scale: 1 }}
                                                animate={{ opacity: [0.1, 0.15, 0.1], scale: [1, 1.05, 1] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute right-4 bottom-4"
                                            >
                                                <UserCheck className="h-16 w-16" />
                                            </motion.div>,
                                            trend: t("Average per transaction"),
                                            trendIcon: null,
                                            trendValue: "",
                                            decorator: <motion.div
                                                className="absolute left-10 bottom-10 w-20 h-20 bg-red-500/10 rounded-full"
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.3, 0.15, 0.3]
                                                }}
                                                transition={{
                                                    duration: 6,
                                                    delay: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        }
                                    ].map((card, index) => (
                                        <motion.div
                                            key={index}
                                            className={`bg-gradient-to-br ${card.bgClass} text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group`}
                                            style={{ perspective: '1000px' }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                                ease: "easeOut"
                                            }}
                                            whileHover={{
                                                translateY: -8,
                                                transition: { duration: 0.3 }
                                            }}
                                            onHoverStart={(e) => {
                                                try {
                                                    anime({
                                                        targets: e.currentTarget,
                                                        boxShadow: ['0 4px 12px rgba(0,0,0,0.1)', '0 20px 40px rgba(0,0,0,0.2)'],
                                                        translateZ: ['0px', '30px'],
                                                        rotateX: [-2, 0],
                                                        rotateY: [0, -3],
                                                        duration: 500,
                                                        easing: 'easeOutQuint'
                                                    });

                                                    // Animate the card shine - use safe querySelector
                                                    const shineElement = safeQuerySelector(e.currentTarget, '.card-shine');
                                                    if (shineElement) {
                                                        anime({
                                                            targets: shineElement,
                                                            translateX: ['0%', '100%'],
                                                            duration: 1200,
                                                            easing: 'easeInOutQuart'
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error("Error in onHoverStart:", error);
                                                }
                                            }}
                                            onHoverEnd={(e) => {
                                                try {
                                                    anime({
                                                        targets: e.currentTarget,
                                                        boxShadow: ['0 20px 40px rgba(0,0,0,0.2)', '0 4px 12px rgba(0,0,0,0.1)'],
                                                        translateZ: ['30px', '0px'],
                                                        rotateX: [0, 0],
                                                        rotateY: [-3, 0],
                                                        duration: 500,
                                                        easing: 'easeOutQuint'
                                                    });
                                                } catch (error) {
                                                    console.error("Error in onHoverEnd:", error);
                                                }
                                            }}
                                        >
                                            <div
                                                ref={el => dashboardCardsRef.current[index] = el}
                                                className="w-full h-full"
                                            >
                                                {/* Card shine effect */}
                                                <div className="card-shine absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full pointer-events-none"></div>

                                                {/* Glass overlay effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[1px] opacity-50"></div>

                                                {/* Background decorations */}
                                                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full transform rotate-12 -translate-y-8 translate-x-8"></div>
                                                <div className="absolute left-10 bottom-10 w-16 h-16 bg-white/5 rounded-full"></div>
                                                <div className="absolute right-10 bottom-0 w-20 h-20 bg-white/5 rounded-tl-full"></div>

                                                {/* Extra decorative elements */}
                                                {card.decorator}

                                                {card.secondaryIcon}

                                                <div className="p-6 relative z-10">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="font-medium text-lg">{card.title}</span>
                                                        <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                            {card.icon}
                                                        </div>
                                                    </div>
                                                    <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                        <AnimatedCounter
                                                            value={typeof card.value === 'string' ?
                                                                parseInt(card.value.replace(/[^0-9.-]+/g, '')) :
                                                                card.value}
                                                            prefix={typeof card.value === 'string' && card.value.startsWith('$') ? '$' : ''}
                                                            duration={2000}
                                                        />
                                                        <span className="text-sm ml-2 mb-1 font-medium text-white/80 group-hover:translate-x-1 transition-transform duration-300">{card.trendValue}</span>
                                                    </div>
                                                    <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                        {card.trendIcon}
                                                        <span>{card.trend}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Search and Tabs Section */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full md:w-96 relative"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t("Search transactions...")}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all duration-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                        </button>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            <span>{t('Refresh')}</span>
                                        </Button>
                                        <Tabs defaultValue="grid" className="w-auto">
                                            <TabsList className="p-1 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <TabsTrigger
                                                    value="grid"
                                                    active={view === 'grid'}
                                                    onClick={() => handleViewChange('grid')}
                                                    className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="list"
                                                    active={view === 'list'}
                                                    onClick={() => handleViewChange('list')}
                                                    className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </motion.div>
                            </div>

                            {searchTerm && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4 animate-pulse">
                                    <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                                    <p>Showing results for: <span className="font-medium text-slate-700 dark:text-slate-300">{searchTerm}</span></p>
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center mb-6">
                                {searchTerm ? t('Search Results') : t('Recent Transactions')}
                            </h2>

                            {/* Grid and List Views */}
                            <div ref={cardsRef} className="transition-opacity duration-300" style={{ minHeight: '200px' }}>
                                <TabsContent value="grid" activeValue={view} className="mt-0">
                                    {filteredOutcome && filteredOutcome.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredOutcome.map((record, index) => (
                                                <motion.div
                                                    key={record.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <Card
                                                        ref={el => gridItemsRef.current[index] = el}
                                                        className="bg-white dark:bg-slate-900 border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full"
                                                        onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                                                        onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                                                    >
                                                        <div className="flex justify-between items-start p-5 pb-3">
                                                            <div className="flex gap-3 items-start">
                                                                <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                                                                    <TrendingUp className="h-5 w-5 text-rose-600 dark:text-rose-400 rotate-180" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{record.reference}</h3>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{record.destination}</p>
                                                                </div>
                                                            </div>
                                                            <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-full font-medium border-0">
                                                                {t('Outcome')}
                                                            </Badge>
                                                        </div>

                                                        <CardContent className="px-5 pt-0 pb-3">
                                                            <div className="mt-3 flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('Amount')}</p>
                                                                    <p className="text-xl font-bold text-rose-600 dark:text-rose-400">${record.amount.toFixed(2)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('Date')}</p>
                                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{record.date}</p>
                                                                </div>
                                                            </div>

                                                            {record.notes && (
                                                                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('Notes')}</p>
                                                                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{record.notes}</p>
                                                                </div>
                                                            )}

                                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                    <Tag className="h-3 w-3" />
                                                                    ID: {record.id}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 justify-end">
                                                                    <Clock className="h-3 w-3" />
                                                                    {record.created_at}
                                                                </div>
                                                            </div>
                                                        </CardContent>

                                                        <CardFooter className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                                            <Link href={route('warehouse.outcome.show', { outcome: record.id })}>
                                                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 px-2 h-8">
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                    <span>View</span>
                                                                </Button>
                                                            </Link>
                                                            <div className="flex gap-1">
                                                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 w-8 h-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                                <Link href={route('warehouse.outcome.show', { outcome: record.id })}>
                                                                    <Button variant="default" size="sm" className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-8">
                                                                        Details
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </CardFooter>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center"
                                        >
                                            <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                <TrendingUp className="h-8 w-8 text-slate-400 rotate-180" />
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No transactions found</h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                                {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'No outcome transactions have been recorded yet. Add your first transaction to get started.'}
                                            </p>
                                            <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Transaction
                                            </Button>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="list" activeValue={view} className="mt-0">
                                    {filteredOutcome && filteredOutcome.length > 0 ? (
                                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-5 py-3 grid grid-cols-12 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                <div className="col-span-4 md:col-span-5 lg:col-span-4 flex items-center gap-2">
                                                    <span>Reference</span>
                                                </div>
                                                <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden md:flex items-center justify-center">
                                                    <span>Date</span>
                                                </div>
                                                <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center hidden md:flex items-center justify-center">
                                                    <span>Destination</span>
                                                </div>
                                                <div className="col-span-6 md:col-span-2 lg:col-span-2 text-center flex items-center justify-center">
                                                    <span>Amount</span>
                                                </div>
                                                <div className="col-span-2 md:col-span-1 lg:col-span-2 text-right">
                                                    <span>Actions</span>
                                                </div>
                                            </div>
                                            <div>
                                                {filteredOutcome.map((record, index) => (
                                                    <motion.div
                                                        key={record.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                                        ref={el => listItemsRef.current[index] = el}
                                                        className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 grid grid-cols-12 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                                                    >
                                                        <div className="col-span-4 md:col-span-5 lg:col-span-4 flex items-center gap-3">
                                                            <div className="h-9 w-9 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
                                                                <TrendingUp className="h-5 w-5 rotate-180" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="font-medium text-slate-900 dark:text-white truncate">{record.reference}</h3>
                                                                <div className="mt-0.5 md:hidden">
                                                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                                        <Calendar className="h-3 w-3 mr-1" />
                                                                        {record.date}
                                                                    </div>
                                                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                                        <User className="h-3 w-3 mr-1" />
                                                                        {record.destination}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden md:block text-sm text-slate-700 dark:text-slate-300">
                                                            {record.date}
                                                        </div>
                                                        <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center hidden md:block text-sm text-slate-700 dark:text-slate-300">
                                                            {record.destination}
                                                        </div>
                                                        <div className="col-span-6 md:col-span-2 lg:col-span-2 text-center font-medium text-rose-600 dark:text-rose-400">
                                                            ${record.amount.toFixed(2)}
                                                        </div>
                                                        <div className="col-span-2 md:col-span-1 lg:col-span-2 flex justify-end gap-1">
                                                            <Link href={route('warehouse.outcome.show', { outcome: record.id })}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                            <Link href={route('warehouse.outcome.show', { outcome: record.id })}>
                                                                <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-transparent dark:text-slate-400 dark:border-slate-700 text-slate-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <span>Details</span>
                                                                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </Card>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center"
                                        >
                                            <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                <TrendingUp className="h-8 w-8 text-slate-400 rotate-180" />
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No transactions found</h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                                {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'No outcome transactions have been recorded yet. Add your first transaction to get started.'}
                                            </p>
                                            <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Transaction
                                            </Button>
                                        </motion.div>
                                    )}
                                </TabsContent>
                            </div>
                        </div>

                        {/* Additional Content Area */}
                        <div className="p-6 bg-gray-100 dark:bg-gray-900">
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Transaction Table */}
                                <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400">
                                                Recent Transactions
                                            </h2>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex items-center gap-1.5"
                                                onClick={() => {
                                                    // Export to CSV functionality
                                                    if (!outcome || outcome.length === 0) return;

                                                    const headers = ['ID', 'Reference', 'Amount', 'Date', 'Destination', 'Notes', 'Created'];
                                                    const csvData = outcome.map(record => [
                                                        record.id,
                                                        record.reference,
                                                        record.amount,
                                                        record.date,
                                                        record.destination,
                                                        record.notes || '',
                                                        record.created_at
                                                    ]);

                                                    let csvContent = "data:text/csv;charset=utf-8," +
                                                        headers.join(",") + "\n" +
                                                        csvData.map(row => row.join(",")).join("\n");

                                                    const encodedUri = encodeURI(csvContent);
                                                    const link = document.createElement("a");
                                                    link.setAttribute("href", encodedUri);
                                                    link.setAttribute("download", `outcome_transactions_${new Date().toISOString().split('T')[0]}.csv`);
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                            >
                                                <Download className="h-4 w-4" />
                                                <span>Export CSV</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">ID</th>
                                                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                                                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                                                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {(outcome && outcome.length > 0) ?
                                                    outcome.slice(0, 10).map((record) => (
                                                        <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800">{record.id}</td>
                                                            <td className="px-4 py-3 whitespace-nowrap bg-white dark:bg-gray-800">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-md flex items-center justify-center text-red-600">
                                                                        <TrendingUp className="h-4 w-4 rotate-180" />
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{record.reference}</div>
                                                                        {record.notes && (
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px]">{record.notes}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800">{record.date}</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800">{record.destination}</td>
                                                            <td className="px-4 py-3 whitespace-nowrap bg-white dark:bg-gray-800">
                                                                <span className="text-sm font-medium text-red-600 dark:text-red-300">${record.amount.toFixed(2)}</span>
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium bg-white dark:bg-gray-800">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 dark:text-gray-300">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="outline" size="sm" className="h-8 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-200 hover:border-red-300">
                                                                        View
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                    :
                                                    <tr>
                                                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                                                            No transactions found
                                                        </td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    {outcome && outcome.length > 10 && (
                                        <div className="p-4 flex justify-center">
                                            <Button variant="outline" size="sm" className="text-red-600 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-200 hover:border-red-300">
                                                View All Transactions
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Outcome Statistics Sidebar */}
                                <div className="xl:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="font-semibold text-xl dark:text-white">Outcome Statistics</h2>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <Card className="shadow-sm border-none bg-gradient-to-br from-red-500 to-rose-600 text-white">
                                                <CardContent className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm opacity-80">Total Outcome</span>
                                                        <span className="text-2xl font-bold mt-1">
                                                            ${totalOutcomeValue.toFixed(2)}
                                                        </span>
                                                        <span className="text-xs mt-1">All time transactions</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card className="mt-4 shadow-sm border-none">
                                            <CardContent className="p-4">
                                                <h3 className="font-medium mb-3 dark:text-white">Recent Destinations</h3>
                                                {outcome && outcome.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {destinationTotals.map((destination, index) => (
                                                            <div key={index} className="flex items-center justify-between">
                                                                <span className="text-sm dark:text-gray-200">{destination.name}</span>
                                                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full dark:text-gray-200">
                                                                    ${destination.total.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 text-center py-2">No destinations found</p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        <Card className="mt-4 shadow-sm border-none">
                                            <CardContent className="p-4">
                                                <h3 className="font-medium mb-3 dark:text-white">Monthly Overview</h3>
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">This Month</p>
                                                        <p className="font-semibold text-red-600 dark:text-red-300">
                                                            ${thisMonthOutcome.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Last Month</p>
                                                        <p className="font-semibold text-red-600 dark:text-red-300">
                                                            ${lastMonthOutcome.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">This Year</p>
                                                        <p className="font-semibold text-red-600 dark:text-red-300">
                                                            ${totalOutcomeValue.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
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
