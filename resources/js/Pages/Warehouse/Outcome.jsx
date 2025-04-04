import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    Search, TrendingUp, ChevronRight, Plus, Filter, ArrowUpRight, ArrowDownRight,
    BarChart3, Calendar, Clock, Download, MoreHorizontal, ExternalLink, Tag, User,
    CreditCard, DollarSign, Mail, Settings, Inbox, ChevronDown, Eye, RefreshCw, Sliders
} from 'lucide-react';
import anime from 'animejs';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion } from 'framer-motion';

export default function Outcome({ auth, outcome }) {
    // Add debugging to check outcome data
    console.log("Outcome data received:", outcome);

    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('grid');
    const [isAnimated, setIsAnimated] = useState(false);
    const [dateFilter, setDateFilter] = useState('all');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [showCharts, setShowCharts] = useState(true);

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

    return (
        <>
            <Head title="Warehouse Outcome" />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="warehouse.outcome" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header ref={headerRef} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-0.5">Warehouse Management</span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    Outcome Transactions
                                    <Badge variant="outline" className="ml-2 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 rounded-full">
                                        {outcome?.length || 0}
                                    </Badge>
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Button size="sm" variant="outline" className="flex items-center gap-1.5 rounded-full border-slate-200 dark:border-slate-700 px-4">
                                    <Filter className="h-4 w-4 text-slate-500" />
                                    <span className="text-slate-600 dark:text-slate-400">Filters</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-500 ml-1" />
                                </Button>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-full border-slate-200 dark:border-slate-700">
                                <Download className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button size="sm" className="bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md rounded-full px-4">
                                <Plus className="h-4 w-4 mr-1.5" />
                                <span>New Transaction</span>
                            </Button>
                        </div>
                    </header>

                    {/* Main Content Container - will modify dashboard cards next */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="px-6 pt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                {/* Stat Card 1 - Total Outcome */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
                                    ref={el => dashboardCardsRef.current[0] = el}
                                >
                                    <div className="p-6 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Outcome</p>
                                            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">${totalOutcomeValue.toFixed(2)}</p>
                                            <div className="mt-2 flex items-center text-xs font-medium text-rose-600 dark:text-rose-400">
                                                <ArrowDownRight className="mr-1 h-3 w-3" />
                                                <span>All time transactions</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-rose-100 dark:bg-rose-900/30 p-2.5">
                                            <DollarSign className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gradient-to-r from-rose-400 via-red-500 to-rose-500 w-full"></div>
                                </motion.div>

                                {/* Stat Card 2 - This Month */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
                                    ref={el => dashboardCardsRef.current[1] = el}
                                >
                                    <div className="p-6 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">This Month</p>
                                            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">${thisMonthOutcome.toFixed(2)}</p>
                                            <div className={`mt-2 flex items-center text-xs font-medium ${outcomeChangePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                {outcomeChangePercent >= 0 ? (
                                                    <ArrowUpRight className="mr-1 h-3 w-3" />
                                                ) : (
                                                    <ArrowDownRight className="mr-1 h-3 w-3" />
                                                )}
                                                <span>{outcomeChangePercent > 0
                                                    ? `Up ${Math.abs(outcomeChangePercent).toFixed(1)}% from last month`
                                                    : `Down ${Math.abs(outcomeChangePercent).toFixed(1)}% from last month`}</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2.5">
                                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-500 w-full"></div>
                                </motion.div>

                                {/* Stat Card 3 - Transactions */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
                                    ref={el => dashboardCardsRef.current[2] = el}
                                >
                                    <div className="p-6 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Transactions</p>
                                            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{outcome?.length || 0}</p>
                                            <div className="mt-2 flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span>Total recorded transactions</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-purple-100 dark:bg-purple-900/30 p-2.5">
                                            <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-500 w-full"></div>
                                </motion.div>

                                {/* Stat Card 4 - Avg. Transaction */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
                                    ref={el => dashboardCardsRef.current[3] = el}
                                >
                                    <div className="p-6 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Transaction</p>
                                            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                                                ${outcome && outcome.length ? (totalOutcomeValue / outcome.length).toFixed(2) : "0.00"}
                                            </p>
                                            <div className="mt-2 flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span>Average per transaction</span>
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-2.5">
                                            <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 w-full"></div>
                                </motion.div>
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
                                        placeholder="Search transactions..."
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
                                            <span>Refresh</span>
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
                                {searchTerm ? 'Search Results' : 'Recent Transactions'}
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
                                                                Outcome
                                                            </Badge>
                                                        </div>

                                                        <CardContent className="px-5 pt-0 pb-3">
                                                            <div className="mt-3 flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Amount</p>
                                                                    <p className="text-xl font-bold text-rose-600 dark:text-rose-400">${record.amount.toFixed(2)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Date</p>
                                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{record.date}</p>
                                                                </div>
                                                            </div>

                                                            {record.notes && (
                                                                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Notes</p>
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
                                                            <Link href={route('warehouse.outcome.show',record.id)}>
                                                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 px-2 h-8">
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                    <span>View</span>
                                                                </Button>
                                                            </Link>
                                                            <div className="flex gap-1">
                                                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 w-8 h-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                                <Link href={route('warehouse.outcome.show',record.id)}>
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
                                                            <Link href={route('warehouse.outcome.show', record.id)}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                            <Link href={route('warehouse.outcome.show', record.id)}>
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
