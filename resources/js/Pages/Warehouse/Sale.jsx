import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Search, ShoppingCart, ChevronRight, Plus, Filter, ArrowUpRight, ArrowDownRight, BarChart3, Calendar, Clock, Download, MoreHorizontal, ExternalLink, Tag, User, ChevronLeft, Package, TrendingUp, CreditCard, UserCheck, AlertCircle } from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion } from 'framer-motion';

// Add the AnimatedCounter component right before the main component
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

// After the AnimatedCounter component, add this new component
const MiniBarChart = ({ data, height = 40, barWidth = 6, gapWidth = 6, animated = true, className = "" }) => {
    const max = Math.max(...data.map(d => d.value));

    return (
        <div className={`flex items-end ${className}`} style={{ height: `${height}px`, gap: `${gapWidth}px` }}>
            {data.map((item, i) => {
                const barHeight = (item.value / max) * 100;
                return (
                    <motion.div
                        key={i}
                        className="relative group"
                        initial={animated ? { height: "0%", opacity: 0 } : { height: `${barHeight}%`, opacity: 1 }}
                        animate={animated ? {
                            height: `${barHeight}%`,
                            opacity: 1
                        } : {}}
                        transition={{
                            duration: 1,
                            delay: i * 0.1,
                            ease: "easeOut"
                        }}
                    >
                        <div
                            className="rounded-t-sm bg-gradient-to-b from-white/80 to-white/40 hover:from-white/90 hover:to-white/50 transition-all duration-200"
                            style={{ width: `${barWidth}px` }}
                        ></div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                            {item.name}: {item.value}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

// Add PageLoader component after AnimatedCounter
const PageLoader = ({ isVisible }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'all' : 'none'
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="relative">
                <motion.div
                    className="h-24 w-24 rounded-full border-4 border-blue-300/20"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, ease: "linear", repeat: Infinity },
                        scale: { duration: 1, repeat: Infinity }
                    }}
                />
                <motion.div
                    className="h-24 w-24 rounded-full border-4 border-r-blue-400 border-t-transparent border-l-transparent border-b-transparent absolute top-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [0.9, 1.1, 0.9]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ShoppingCart className="h-10 w-10" />
                </motion.div>
            </div>
            <motion.div
                className="absolute bottom-1/3 left-0 right-0 text-center text-white text-lg font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                Loading Dashboard...
            </motion.div>
        </motion.div>
    );
};

// First, add a new component after PageLoader
const NewsTicker = () => {
    const notifications = [
        { id: 1, icon: <ArrowUpRight className="h-3 w-3 text-green-500" />, text: "Sales increased by 12% compared to last month" },
        { id: 2, icon: <User className="h-3 w-3 text-blue-500" />, text: "3 new customers registered today" },
        { id: 3, icon: <ShoppingCart className="h-3 w-3 text-purple-500" />, text: "23 sales transactions completed in the past 24 hours" },
        { id: 4, icon: <Package className="h-3 w-3 text-amber-500" />, text: "New product shipment arriving tomorrow" },
        { id: 5, icon: <AlertCircle className="h-3 w-3 text-red-500" />, text: "Please check pending approvals in your dashboard" }
    ];

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-blue-100 dark:border-gray-700 py-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-opacity-[0.03] dark:bg-opacity-[0.02]"></div>
            <div className="relative">
                <motion.div
                    className="flex items-center gap-6 whitespace-nowrap"
                    animate={{
                        x: [0, -2500],
                    }}
                    transition={{
                        x: {
                            duration: 30,
                            ease: "linear",
                            repeat: Infinity,
                        }
                    }}
                >
                    {[...notifications, ...notifications, ...notifications].map((notification, index) => (
                        <div
                            key={`${notification.id}-${index}`}
                            className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-blue-100 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 dark:bg-gray-700">
                                {notification.icon}
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {notification.text}
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default function Sale({ auth, sales }) {
    // Add debugging to check sales data
    console.log("Sales data received:", sales);

    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('grid');
    const [isAnimated, setIsAnimated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Refs for animation targets
    const headerRef = useRef(null);
    const cardsRef = useRef(null);
    const gridItemsRef = useRef([]);
    const listItemsRef = useRef([]);
    const dashboardCardsRef = useRef([]);

    // Animation timeline
    const timelineRef = useRef(null);

    // Add this ref for content area
    const contentRef = useRef(null);

    // Add a new state at the beginning of the component
    const [loading, setLoading] = useState(true);

    // Filter sales records based on search term
    const filteredSales = sales && sales.length
        ? sales.filter(record =>
            (record.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             record.customer?.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : [];

    // Paginate the filtered sales
    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    // Calculate total sales value
    const totalSalesValue = sales?.reduce((sum, record) => sum + record.amount, 0) || 0;

    // Calculate this month's sales
    const thisMonthSales = sales?.filter(s => {
        const date = new Date(s.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    }).reduce((sum, s) => sum + s.amount, 0) || 0;

    // Calculate last month's sales
    const lastMonthSales = sales?.filter(s => {
        const date = new Date(s.date);
        const now = new Date();
        let lastMonth = now.getMonth() - 1;
        let year = now.getFullYear();
        if (lastMonth < 0) {
            lastMonth = 11;
            year--;
        }
        return date.getMonth() === lastMonth &&
               date.getFullYear() === year;
    }).reduce((sum, s) => sum + s.amount, 0) || 0;

    // Calculate sales change percentage
    const salesChangePercent = lastMonthSales ?
        ((thisMonthSales - lastMonthSales) / lastMonthSales * 100) : 0;

    // Get unique customers and their totals
    const customerTotals = sales && sales.length ?
        Array.from(new Set(sales.map(s => s.customer)))
            .map(customer => ({
                name: customer,
                total: sales.filter(s => s.customer === customer)
                    .reduce((sum, s) => sum + s.amount, 0)
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5) : [];

    // Get transaction count by day for the past week
    const getWeeklyActivity = () => {
        if (!sales || sales.length === 0) return [];

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayOfWeek = days[date.getDay()];

            const dateString = date.toISOString().split('T')[0];
            const count = sales.filter(item => item.date === dateString).length;

            result.push({ name: dayOfWeek, value: count });
        }

        return result;
    };

    const weeklyActivity = getWeeklyActivity();

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

            // Animate sales cards or list items with stagger based on view
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
    }, [isAnimated, view, filteredSales.length]);

    // Reset animation state when view changes
    useEffect(() => {
        setIsAnimated(false);
        // Clear refs
        gridItemsRef.current = [];
        listItemsRef.current = [];
    }, [view, searchTerm]);

    // Reset current page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

    // Update the Pagination component with a more modern design
    const Pagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if end page is maxed out
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex justify-center mt-10">
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`h-9 w-9 p-0 text-gray-600 dark:text-gray-300 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'} transition-all duration-200`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                    </Button>

                    {startPage > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                className={`h-9 w-9 p-0 text-sm font-medium rounded-lg ${currentPage === 1 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'} transition-all duration-200`}
                            >
                                1
                            </Button>
                            {startPage > 2 && (
                                <span className="text-gray-400 dark:text-gray-500 px-1">•••</span>
                            )}
                        </>
                    )}

                    {pages.map(page => (
                        <Button
                            key={page}
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`h-9 w-9 p-0 text-sm font-medium rounded-lg ${currentPage === page ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'} transition-all duration-200`}
                        >
                            {page}
                        </Button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <span className="text-gray-400 dark:text-gray-500 px-1">•••</span>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                className={`h-9 w-9 p-0 text-sm font-medium rounded-lg ${currentPage === totalPages ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'} transition-all duration-200`}
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`h-9 w-9 p-0 text-gray-600 dark:text-gray-300 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'} transition-all duration-200`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                    </Button>
                </div>
            </div>
        );
    };

    // Reset animation when page changes
    useEffect(() => {
        setIsAnimated(false);
        // Scroll to top of content with animation
        if (contentRef.current) {
            anime({
                targets: contentRef.current,
                scrollTop: 0,
                duration: 500,
                easing: 'easeOutQuad'
            });
        }
    }, [currentPage]);

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
            <Head title="Warehouse Sales" />

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="warehouse.sales" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-auto" ref={contentRef}>
                    {/* Header */}
                    <header ref={headerRef} className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between relative overflow-hidden backdrop-blur-sm flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-900/90 opacity-90"></div>
                        <div className="absolute -left-40 -top-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full filter blur-3xl"></div>
                        <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full filter blur-3xl"></div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-600"></div>
                        <div className="flex items-center space-x-3 relative z-10">
                            <div className="relative">
                                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Sales Transactions</h1>
                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50/80 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 ml-2 px-3 py-1 rounded-full font-medium shadow-sm">
                                {sales?.length || 0} transactions
                            </Badge>
                        </div>
                        <div className="relative z-10 flex space-x-2">
                            <Button size="sm" variant="outline" className="flex items-center gap-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all duration-200 shadow-sm">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center gap-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all duration-200 shadow-sm">
                                <Download className="h-4 w-4" />
                                <span>Export</span>
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
                                <Plus className="h-4 w-4 mr-1.5" />
                                <span>New Sale</span>
                            </Button>
                        </div>
                    </header>

                    <NewsTicker className="flex-shrink-0" />

                    {/* Dashboard Summary - removed overflow-hidden */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-white/30 dark:from-gray-800/30 dark:to-gray-900/30 opacity-80"></div>

                        {/* Animated background elements */}
                        <div className="absolute -left-40 -top-40 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute right-20 top-10 w-72 h-72 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
                        <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
                        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '18s', animationDelay: '1s' }}></div>

                        <div className="relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        title: "Total Sales",
                                        value: "$" + totalSalesValue.toFixed(2),
                                        icon: <BarChart3 className="h-6 w-6" />,
                                        bgClass: "from-blue-500 to-indigo-600",
                                        secondaryIcon: <motion.div
                                            initial={{ opacity: 0.1, scale: 0.8 }}
                                            animate={{ opacity: [0.1, 0.15, 0.1], scale: [0.8, 0.9, 0.8] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute right-4 bottom-4"
                                        >
                                            <CreditCard className="h-16 w-16" />
                                        </motion.div>,
                                        trend: "All time transactions",
                                        trendIcon: <ArrowUpRight className="h-3.5 w-3.5 mr-1" />,
                                        trendValue: "+12% YTD",
                                        decorator: <motion.div
                                            className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full"
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
                                        title: "This Month",
                                        value: "$" + thisMonthSales.toFixed(2),
                                        icon: <Calendar className="h-6 w-6" />,
                                        bgClass: "from-cyan-500 to-teal-600",
                                        secondaryIcon: <motion.div
                                            initial={{ opacity: 0.1, rotate: 0 }}
                                            animate={{ opacity: [0.1, 0.15, 0.1], rotate: [0, 5, 0] }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute right-4 bottom-4"
                                        >
                                            <TrendingUp className="h-16 w-16" />
                                        </motion.div>,
                                        trend: salesChangePercent > 0
                                            ? `Up ${Math.abs(salesChangePercent).toFixed(1)}% from last month`
                                            : `Down ${Math.abs(salesChangePercent).toFixed(1)}% from last month`,
                                        trendIcon: salesChangePercent >= 0
                                            ? <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                            : <ArrowDownRight className="h-3.5 w-3.5 mr-1" />,
                                        decorator: <motion.div
                                            className="absolute -left-6 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full"
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
                                        title: "Transactions",
                                        value: sales?.length || 0,
                                        icon: <ShoppingCart className="h-6 w-6" />,
                                        bgClass: "from-purple-500 to-indigo-600",
                                        secondaryIcon: <motion.div
                                            initial={{ opacity: 0.1, y: 0 }}
                                            animate={{ opacity: [0.1, 0.15, 0.1], y: [0, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute right-4 bottom-4"
                                        >
                                            <Package className="h-16 w-16" />
                                        </motion.div>,
                                        trend: "Total recorded sales",
                                        trendIcon: null,
                                        trendValue: "+3 last week",
                                        decorator: <motion.div
                                            className="absolute right-10 top-10 w-16 h-16 bg-purple-500/10 rounded-full"
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
                                        title: "Avg. Transaction",
                                        value: "$" + (sales && sales.length ? (totalSalesValue / sales.length).toFixed(2) : "0.00"),
                                        icon: <BarChart3 className="h-6 w-6" />,
                                        bgClass: "from-amber-500 to-orange-600",
                                        secondaryIcon: <motion.div
                                            initial={{ opacity: 0.1, scale: 1 }}
                                            animate={{ opacity: [0.1, 0.15, 0.1], scale: [1, 1.05, 1] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute right-4 bottom-4"
                                        >
                                            <UserCheck className="h-16 w-16" />
                                        </motion.div>,
                                        trend: "Average per transaction",
                                        trendIcon: null,
                                        trendValue: "+5% this week",
                                        decorator: <motion.div
                                            className="absolute left-10 bottom-10 w-20 h-20 bg-amber-500/10 rounded-full"
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
                                            anime({
                                                targets: e.currentTarget,
                                                boxShadow: ['0 4px 12px rgba(0,0,0,0.1)', '0 20px 40px rgba(0,0,0,0.2)'],
                                                translateZ: ['0px', '30px'],
                                                rotateX: [-2, 0],
                                                rotateY: [0, -3],
                                                duration: 500,
                                                easing: 'easeOutQuint'
                                            });

                                            // Animate the card shine
                                            anime({
                                                targets: e.currentTarget.querySelector('.card-shine'),
                                                translateX: ['0%', '100%'],
                                                duration: 1200,
                                                easing: 'easeInOutQuart'
                                            });
                                        }}
                                        onHoverEnd={(e) => {
                                            anime({
                                                targets: e.currentTarget,
                                                boxShadow: ['0 20px 40px rgba(0,0,0,0.2)', '0 4px 12px rgba(0,0,0,0.1)'],
                                                translateZ: ['30px', '0px'],
                                                rotateX: [0, 0],
                                                rotateY: [-3, 0],
                                                duration: 500,
                                                easing: 'easeOutQuint'
                                            });
                                        }}
                                    >
                                        <div
                                            ref={el => dashboardCardsRef.current[index] = el}
                                            className="w-full h-full"
                                        >
                                            {/* Card shine effect */}
                                            <div className="card-shine absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full pointer-events-none"></div>

                                            {/* Background decorations */}
                                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full transform rotate-12 -translate-y-8 translate-x-8"></div>
                                            <div className="absolute left-10 bottom-10 w-16 h-16 bg-white/5 rounded-full"></div>

                                            {/* Extra decorative elements */}
                                            {card.decorator}

                                            {card.secondaryIcon}

                                            <div className="p-5 relative z-10">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-medium text-lg">{card.title}</span>
                                                    <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300">
                                                        {card.icon}
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-bold mt-1 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                    <AnimatedCounter
                                                        value={typeof card.value === 'string' ?
                                                            parseInt(card.value.replace(/[^0-9.-]+/g, '')) :
                                                            card.value}
                                                        prefix={typeof card.value === 'string' && card.value.startsWith('$') ? '$' : ''}
                                                        duration={2000}
                                                    />
                                                    <span className="text-sm ml-2 mb-1 font-medium text-white/70 group-hover:translate-x-1 transition-transform duration-300">{card.trendValue}</span>
                                                </div>
                                                <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-2.5 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300">
                                                    {card.trendIcon}
                                                    <span>{card.trend}</span>
                                                </div>

                                                {/* Interactive elements that appear on hover */}
                                                <div className="mt-4 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                    <motion.button
                                                        className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <BarChart3 className="h-4 w-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Animated Chart Section - removed overflow-hidden */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 border-b border-indigo-700 relative flex-shrink-0">
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Animated particles */}
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full bg-white/10"
                                    style={{
                                        width: Math.random() * 8 + 2,
                                        height: Math.random() * 8 + 2,
                                        x: Math.random() * 100 + "%",
                                        y: Math.random() * 100 + "%",
                                    }}
                                    animate={{
                                        y: [null, "-100%"],
                                        opacity: [0, 0.5, 0],
                                    }}
                                    transition={{
                                        duration: Math.random() * 10 + 10,
                                        repeat: Infinity,
                                        delay: Math.random() * 5,
                                        ease: "linear",
                                    }}
                                />
                            ))}
                        </div>

                        <div className="container mx-auto px-6 py-10 relative z-10">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                                <div className="lg:w-1/2">
                                    <motion.h3
                                        className="text-2xl font-bold text-white mb-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        Weekly Sales Performance
                                    </motion.h3>
                                    <motion.p
                                        className="text-blue-100 mb-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                    >
                                        Track your sales trends across the week. Hovering over bars reveals detailed metrics.
                                    </motion.p>

                                    <motion.div
                                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        whileHover={{
                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                                            y: -5,
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        <div className="flex justify-between mb-8">
                                            <div>
                                                <h4 className="text-white/70 text-sm mb-1">Total Weekly Transactions</h4>
                                                <div className="text-2xl font-bold text-white flex items-baseline gap-2">
                                                    <AnimatedCounter value={weeklyActivity.reduce((sum, day) => sum + day.value, 0)} />
                                                    <span className="text-sm text-green-300 flex items-center">
                                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                                        8.2%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.button
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Filter className="h-4 w-4 text-white" />
                                                </motion.button>
                                                <motion.button
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Download className="h-4 w-4 text-white" />
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <MiniBarChart data={weeklyActivity} height={100} barWidth={12} gapWidth={6} className="mx-auto" />
                                            <div className="flex justify-between mt-2 text-xs text-blue-200">
                                                {weeklyActivity.map((day, i) => (
                                                    <span key={i}>{day.name}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-white/10 pt-4 mt-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-blue-200">Highest: {Math.max(...weeklyActivity.map(d => d.value))} sales on {weeklyActivity.find(d => d.value === Math.max(...weeklyActivity.map(d => d.value))).name}</span>
                                                <span className="text-blue-200">Average: {(weeklyActivity.reduce((sum, day) => sum + day.value, 0) / weeklyActivity.length).toFixed(1)} sales/day</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="lg:w-1/2">
                                    <motion.div
                                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl relative overflow-hidden"
                                        style={{ perspective: '900px' }}
                                        initial={{ opacity: 0, y: 20, rotateY: -10 }}
                                        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.7, delay: 0.3 }}
                                        whileHover={{
                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                                            rotateY: 5,
                                            transition: { duration: 0.4 }
                                        }}
                                    >
                                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full filter blur-2xl"></div>
                                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 rounded-full filter blur-2xl"></div>

                                        <h4 className="text-white font-bold text-lg mb-4 relative z-10">Top 5 Customers</h4>

                                        <div className="space-y-4 relative z-10">
                                            {customerTotals.map((customer, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors duration-200 group"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10 border-2 border-white/20 shadow-md">
                                                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                                                                    {customer.name.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h5 className="text-white font-medium">{customer.name}</h5>
                                                                <p className="text-blue-200 text-xs">{Math.floor(Math.random() * 10) + 1} transactions</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-white font-bold">${customer.total.toFixed(2)}</div>
                                                            <div className="text-xs text-green-300 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ArrowUpRight className="h-3 w-3" />
                                                                {(Math.random() * 20).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-blue-300 to-indigo-300"
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${(customer.total / customerTotals[0].total) * 100}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <motion.button
                                            className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors relative z-10 group overflow-hidden"
                                            whileHover={{ y: -2 }}
                                            whileTap={{ y: 0 }}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-1">
                                                View All Customers
                                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: "0%" }}
                                                transition={{ duration: 0.4 }}
                                            />
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Section - removed the overflow-auto from this div */}
                    <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
                        <div className="relative px-6 lg:px-8 py-6 mb-6 overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900/90 shadow-md">
                            {/* Header code remains the same */}
                        </div>

                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 flex items-center">
                                <span>{searchTerm ? `Search Results: "${searchTerm}"` : 'All Sales'}</span>
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2 h-7 text-gray-500 hover:text-gray-700"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </h2>
                            <Tabs defaultValue="grid" className="w-auto">
                                <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <TabsTrigger
                                        value="grid"
                                        active={view === 'grid'}
                                        onClick={() => handleViewChange('grid')}
                                        className="flex items-center gap-1.5 px-4 py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200 data-[state=active]:shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                                        <span>Grid</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="list"
                                        active={view === 'list'}
                                        onClick={() => handleViewChange('list')}
                                        className="flex items-center gap-1.5 px-4 py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200 data-[state=active]:shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                                        <span>List</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 px-8 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-gray-800/30 dark:to-gray-900/30 opacity-80"></div>

                            <div className="relative z-10 flex justify-between">
                                <div className="grid grid-cols-4 w-full gap-10">
                                    {[
                                        {
                                            label: "Total Customers",
                                            value: 56,
                                            icon: <UserCheck className="h-10 w-10 text-blue-500/20 dark:text-blue-400/20 absolute right-0 top-1/2 transform -translate-y-1/2" />,
                                            change: "+12% from last month",
                                            color: "text-blue-600 dark:text-blue-400"
                                        },
                                        {
                                            label: "Product Categories",
                                            value: 24,
                                            icon: <Package className="h-10 w-10 text-purple-500/20 dark:text-purple-400/20 absolute right-0 top-1/2 transform -translate-y-1/2" />,
                                            change: "+3 new categories",
                                            color: "text-purple-600 dark:text-purple-400"
                                        },
                                        {
                                            label: "Average Order Value",
                                            value: 156,
                                            prefix: "$",
                                            icon: <CreditCard className="h-10 w-10 text-emerald-500/20 dark:text-emerald-400/20 absolute right-0 top-1/2 transform -translate-y-1/2" />,
                                            change: "+5.2% growth rate",
                                            color: "text-emerald-600 dark:text-emerald-400"
                                        },
                                        {
                                            label: "Sales This Week",
                                            value: 23,
                                            icon: <TrendingUp className="h-10 w-10 text-amber-500/20 dark:text-amber-400/20 absolute right-0 top-1/2 transform -translate-y-1/2" />,
                                            change: "12 more than last week",
                                            color: "text-amber-600 dark:text-amber-400"
                                        }
                                    ].map((stat, index) => (
                                        <div
                                            key={index}
                                            className="relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800 group"
                                            onMouseEnter={(e) => {
                                                anime({
                                                    targets: e.currentTarget,
                                                    translateY: [0, -4],
                                                    boxShadow: ['0 1px 2px rgba(0,0,0,0.05)', '0 8px 24px rgba(0,0,0,0.1)'],
                                                    duration: 500,
                                                    easing: 'easeOutQuad'
                                                });
                                            }}
                                            onMouseLeave={(e) => {
                                                anime({
                                                    targets: e.currentTarget,
                                                    translateY: [-4, 0],
                                                    boxShadow: ['0 8px 24px rgba(0,0,0,0.1)', '0 1px 2px rgba(0,0,0,0.05)'],
                                                    duration: 500,
                                                    easing: 'easeOutQuad'
                                                });
                                            }}
                                        >
                                            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out"></div>
                                            <div className="relative">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                                <h3 className={`text-3xl font-bold mt-1 ${stat.color}`}>
                                                    <AnimatedCounter
                                                        value={stat.value}
                                                        prefix={stat.prefix || ''}
                                                        suffix={stat.suffix || ''}
                                                    />
                                                </h3>
                                                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">{stat.change}</p>
                                                {stat.icon}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mb-5 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden backdrop-filter backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 opacity-90"></div>
                            <div className="absolute -left-20 -top-20 w-40 h-40 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-2xl"></div>
                            <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full filter blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2.5 rounded-lg shadow-md">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sale Search</h3>
                                </div>
                                <div className="relative w-full group">
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-focus-within:opacity-100 blur transition-opacity -m-0.5"></div>
                                    <div className="relative flex">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by reference or customer..."
                                            className="flex-1 py-3.5 pl-11 pr-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onFocus={(e) => {
                                                anime({
                                                    targets: e.currentTarget,
                                                    scale: [1, 1.02],
                                                    boxShadow: ['0 1px 2px rgba(0,0,0,0.05)', '0 4px 20px rgba(0,0,0,0.1)'],
                                                    duration: 300,
                                                    easing: 'easeOutQuad'
                                                });
                                            }}
                                            onBlur={(e) => {
                                                anime({
                                                    targets: e.currentTarget,
                                                    scale: [1.02, 1],
                                                    boxShadow: ['0 4px 20px rgba(0,0,0,0.1)', '0 1px 2px rgba(0,0,0,0.05)'],
                                                    duration: 300,
                                                    easing: 'easeOutQuad'
                                                });
                                            }}
                                        />
                                        {searchTerm && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                onClick={() => setSearchTerm('')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {searchTerm && (
                                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 animate-pulse">
                                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                        Searching for: <span className="font-medium text-blue-600 dark:text-blue-400">{searchTerm}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div ref={cardsRef} className="transition-opacity duration-300" style={{ minHeight: '200px' }}>
                            <TabsContent value="grid" activeValue={view} className="mt-0">
                                {filteredSales && filteredSales.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paginatedSales.map((record, index) => (
                                                <Card
                                                    key={record.id}
                                                    className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 relative group hover:translate-y-[-3px]"
                                                    onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                                                    onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                                                >
                                                    <div
                                                        ref={el => gridItemsRef.current[index] = el}
                                                        className="w-full h-full"
                                                    >
                                                        <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600" />
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <Badge className={`${
                                                                record.status === 'completed'
                                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                                    : record.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                            } hover:bg-opacity-80 shadow-sm font-medium transition-all duration-200`}>
                                                                {record.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 dark:from-blue-900/10 dark:to-indigo-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                        <CardContent className="p-6 pt-8 relative z-0">
                                                            <div className="flex items-start">
                                                                <div className="h-14 w-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-sm">
                                                                    <ShoppingCart className="h-7 w-7" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">{record.reference}</h3>
                                                                    <div className="mt-1 flex flex-wrap gap-2">
                                                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                                            <Tag className="h-3 w-3" />
                                                                            ID: {record.id}
                                                                        </Badge>
                                                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                                            <User className="h-3 w-3" />
                                                                            {record.customer}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-6 grid grid-cols-2 gap-4">
                                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <div className="flex items-center gap-1.5 mb-1">
                                                                        <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                                                    </div>
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{record.date}</p>
                                                                </div>
                                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <div className="flex items-center gap-1.5 mb-1">
                                                                        <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                                                                    </div>
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{record.created_at}</p>
                                                                </div>
                                                                <div className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                                                    <div className="flex items-center gap-1.5 mb-1">
                                                                        <ArrowUpRight className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                                                    </div>
                                                                    <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">${record.amount.toFixed(2)}</p>
                                                                </div>
                                                            </div>

                                                            {record.notes && (
                                                                <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{record.notes}</p>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                        <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4 flex justify-between border-t border-gray-200 dark:border-gray-700 relative z-0">
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                                <BarChart3 className="h-4 w-4 text-blue-500" />
                                                                Items: {record.items_count || 0}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors duration-200">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                                <Link href={record.detail_url}>
                                                                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
                                                                        Details
                                                                        <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </CardFooter>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>

                                        <Pagination />

                                        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Showing {Math.min(filteredSales.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredSales.length, currentPage * itemsPerPage)} of {filteredSales.length} sales
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center relative overflow-hidden backdrop-filter backdrop-blur-md">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-80"></div>
                                        <div className="relative z-10">
                                            <div className="inline-flex h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-8 shadow-inner">
                                                <ShoppingCart className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">No sales found</h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg">
                                                {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'No sales have been recorded yet. Add your first sale to get started.'}
                                            </p>
                                            <Link href={route('warehouse.sales.create')}>
                                                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg py-6 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                                                    <Plus className="h-5 w-5 mr-2" />
                                                    Add First Sale
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="list" activeValue={view} className="mt-0">
                                {filteredSales && filteredSales.length > 0 ? (
                                    <>
                                        <Card className="border-0 shadow-md overflow-hidden rounded-xl">
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700 grid grid-cols-12 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <div className="col-span-4 flex items-center gap-2">
                                                    <ShoppingCart className="h-4 w-4 text-blue-500" />
                                                    Reference
                                                </div>
                                                <div className="col-span-1 text-center flex items-center justify-center gap-1">
                                                    <Tag className="h-3.5 w-3.5 text-indigo-500" />
                                                    ID
                                                </div>
                                                <div className="col-span-2 text-center flex items-center justify-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                                    Date
                                                </div>
                                                <div className="col-span-2 text-center flex items-center justify-center gap-1">
                                                    <User className="h-3.5 w-3.5 text-amber-500" />
                                                    Customer
                                                </div>
                                                <div className="col-span-2 text-center flex items-center justify-center gap-1">
                                                    <ArrowUpRight className="h-3.5 w-3.5 text-blue-500" />
                                                    Amount
                                                </div>
                                                <div className="col-span-1 text-right">
                                                    <MoreHorizontal className="h-4 w-4 ml-auto text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {paginatedSales.map((record, index) => (
                                                    <div
                                                        key={record.id}
                                                        className="px-6 py-4 bg-white dark:bg-gray-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 grid grid-cols-12 items-center relative overflow-hidden group"
                                                        onMouseEnter={(e) => {
                                                            anime({
                                                                targets: e.currentTarget,
                                                                backgroundColor: 'rgba(219, 234, 254, 0.3)',
                                                                duration: 300,
                                                                easing: 'easeOutQuad'
                                                            });
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            anime({
                                                                targets: e.currentTarget,
                                                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                                                duration: 300,
                                                                easing: 'easeOutQuad'
                                                            });
                                                        }}
                                                    >
                                                        <div
                                                            ref={el => listItemsRef.current[index] = el}
                                                            className="contents"
                                                        >
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            <div className="col-span-4 flex items-center">
                                                                <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-sm">
                                                                    <ShoppingCart className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-medium text-gray-900 dark:text-white">{record.reference}</h3>
                                                                    {record.notes && (
                                                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{record.notes}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-span-1 text-center text-sm text-gray-600 dark:text-gray-300">{record.id}</div>
                                                            <div className="col-span-2 text-center text-sm text-gray-600 dark:text-gray-300">{record.date}</div>
                                                            <div className="col-span-2 text-center text-sm text-gray-600 dark:text-gray-300">{record.customer}</div>
                                                            <div className="col-span-2 text-center font-medium text-blue-600">${record.amount.toFixed(2)}</div>
                                                            <div className="col-span-1 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Badge className={`${record.status === 'completed' ? 'bg-green-100 text-green-700' : record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'} text-xs`}>
                                                                        {record.status}
                                                                    </Badge>
                                                                    <Link href={record.detail_url}>
                                                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
                                                                            <ExternalLink className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>

                                        <Pagination />

                                        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Showing {Math.min(filteredSales.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredSales.length, currentPage * itemsPerPage)} of {filteredSales.length} sales
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center relative overflow-hidden backdrop-filter backdrop-blur-md">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-80"></div>
                                        <div className="relative z-10">
                                            <div className="inline-flex h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-8 shadow-inner">
                                                <ShoppingCart className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">No sales found</h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg">
                                                {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'No sales have been recorded yet. Add your first sale to get started.'}
                                            </p>
                                            <Link href={route('warehouse.sales.create')}>
                                                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg py-6 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                                                    <Plus className="h-5 w-5 mr-2" />
                                                    Add First Sale
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
