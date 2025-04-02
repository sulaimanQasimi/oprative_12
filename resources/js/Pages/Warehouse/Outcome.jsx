import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Search, TrendingUp, ChevronRight, Plus, Filter, ArrowUpRight, ArrowDownRight, BarChart3, Calendar, Clock, Download, MoreHorizontal, ExternalLink, Tag, User, Bell } from 'lucide-react';
import anime from 'animejs';
import Navigation from '@/Components/Warehouse/Navigation';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="warehouse.outcome" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header ref={headerRef} className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-white dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-rose-600"></div>
                        <div className="flex items-center space-x-3 relative z-10">
                            <div className="relative">
                                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400">Outcome Transactions</h1>
                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
                            </div>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 ml-2 px-2.5 py-0.5 rounded-full font-medium">
                                {outcome?.length || 0} transactions
                            </Badge>
                        </div>
                        <div className="relative z-10 flex space-x-2">
                            <div className="relative">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1.5"
                                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                >
                                    <Filter className="h-4 w-4" />
                                    <span>Filter: {dateFilter === 'all' ? 'All Time' :
                                        dateFilter === 'today' ? 'Today' :
                                        dateFilter === 'yesterday' ? 'Yesterday' :
                                        dateFilter === 'week' ? 'This Week' : 'This Month'}</span>
                                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-90' : ''}`} />
                                </Button>

                                {isFilterMenuOpen && (
                                    <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 w-40 z-50">
                                        {[
                                            { id: 'all', label: 'All Time' },
                                            { id: 'today', label: 'Today' },
                                            { id: 'yesterday', label: 'Yesterday' },
                                            { id: 'week', label: 'This Week' },
                                            { id: 'month', label: 'This Month' }
                                        ].map(item => (
                                            <div
                                                key={item.id}
                                                className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                                                    dateFilter === item.id
                                                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium'
                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                                onClick={() => {
                                                    setDateFilter(item.id);
                                                    setIsFilterMenuOpen(false);
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1.5"
                                onClick={() => {
                                    // Export to CSV functionality
                                    if (!outcome || outcome.length === 0) return;

                                    const headers = ['ID', 'Reference', 'Amount', 'Date', 'Destination', 'Notes', 'Created'];
                                    const csvData = filteredOutcome.map(record => [
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
                                <span>Export</span>
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-sm">
                                <Plus className="h-4 w-4 mr-1.5" />
                                <span>New Transaction</span>
                            </Button>
                        </div>
                    </header>

                    {/* Dashboard Summary */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                {
                                    title: "Total Outcome",
                                    value: "$" + totalOutcomeValue.toFixed(2),
                                    icon: <BarChart3 className="h-5 w-5" />,
                                    bgClass: "from-red-500 to-rose-600",
                                    trend: "All time transactions",
                                    trendIcon: <ArrowDownRight className="h-3 w-3 mr-1" />
                                },
                                {
                                    title: "This Month",
                                    value: "$" + thisMonthOutcome.toFixed(2),
                                    icon: <Calendar className="h-5 w-5" />,
                                    bgClass: "from-blue-500 to-cyan-600",
                                    trend: outcomeChangePercent > 0
                                        ? `Up ${Math.abs(outcomeChangePercent).toFixed(1)}% from last month`
                                        : `Down ${Math.abs(outcomeChangePercent).toFixed(1)}% from last month`,
                                    trendIcon: outcomeChangePercent >= 0
                                        ? <ArrowUpRight className="h-3 w-3 mr-1" />
                                        : <ArrowDownRight className="h-3 w-3 mr-1" />
                                },
                                {
                                    title: "Transactions",
                                    value: outcome?.length || 0,
                                    icon: <TrendingUp className="h-5 w-5" />,
                                    bgClass: "from-purple-500 to-indigo-600",
                                    trend: "Total recorded transactions",
                                    trendIcon: null
                                },
                                {
                                    title: "Avg. Transaction",
                                    value: "$" + (outcome && outcome.length ? (totalOutcomeValue / outcome.length).toFixed(2) : "0.00"),
                                    icon: <BarChart3 className="h-5 w-5" />,
                                    bgClass: "from-amber-500 to-orange-600",
                                    trend: "Average per transaction",
                                    trendIcon: null
                                }
                            ].map((card, index) => (
                                <div key={index} ref={el => dashboardCardsRef.current[index] = el}>
                                    <Card
                                        className={`bg-gradient-to-br ${card.bgClass} text-white border-0 shadow-lg`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">{card.title}</span>
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    {card.icon}
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold mt-1">{card.value}</div>
                                            <div className="mt-3 text-xs flex items-center text-white/80">
                                                {card.trendIcon}
                                                <span>{card.trend}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Statistics Summary */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowCharts(!showCharts)}
                                className="flex items-center gap-1.5"
                            >
                                {showCharts ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                        <span>Hide Charts</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                        <span>Show Charts</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {showCharts && (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <OutcomeChart data={weeklyActivity} />
                                    <DestinationsChart data={destinationTotals} />
                                </div>

                                {/* Monthly Breakdown */}
                                <div className="mt-4">
                                    <div className="border-0 shadow-md overflow-hidden">
                                        <Card className="border-0 overflow-hidden">
                                            <CardHeader className="pb-0">
                                                <div className="flex justify-between items-center">
                                                    <CardTitle className="text-lg font-medium">Monthly Breakdown</CardTitle>
                                                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                                        {new Date().getFullYear()}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-500">Monthly outcome analysis for the current year</p>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <div className="overflow-x-auto -mx-4 px-4">
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                                                                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transactions</th>
                                                                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Amount</th>
                                                                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {monthlyBreakdown.map((month, index) => (
                                                                <tr
                                                                    key={month.month}
                                                                    className={`hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-150 ${
                                                                        new Date().getMonth() === index ? 'bg-red-50/30 dark:bg-red-900/10' : 'bg-white dark:bg-gray-800'
                                                                    }`}
                                                                >
                                                                    <td className="px-4 py-3 whitespace-nowrap bg-white dark:bg-gray-800">
                                                                        <div className="flex items-center">
                                                                            <div className={`h-2 w-2 rounded-full mr-2 ${
                                                                                new Date().getMonth() === index
                                                                                    ? 'bg-red-500'
                                                                                    : month.count > 0
                                                                                        ? 'bg-gray-400 dark:bg-gray-300'
                                                                                        : 'bg-gray-200 dark:bg-gray-600'
                                                                            }`}></div>
                                                                            <span className={`text-sm ${
                                                                                new Date().getMonth() === index
                                                                                    ? 'font-medium text-gray-900 dark:text-white'
                                                                                    : 'text-gray-700 dark:text-gray-300'
                                                                            }`}>
                                                                                {month.month}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                                                                        {month.count}
                                                                    </td>
                                                                    <td className="px-4 py-3 whitespace-nowrap bg-white dark:bg-gray-800">
                                                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                                            ${month.value.toFixed(2)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                                        {month.percentChange !== 0 ? (
                                                                            <div className={`flex items-center text-sm ${
                                                                                month.percentChange > 0
                                                                                    ? 'text-green-600 dark:text-green-400'
                                                                                    : 'text-red-600 dark:text-red-400'
                                                                            }`}>
                                                                                {month.percentChange > 0 ? (
                                                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                                                ) : (
                                                                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                                                                )}
                                                                                {Math.abs(month.percentChange).toFixed(1)}%
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-y-scroll">


                        {/* Main Content Section */}
                        <div className="flex-1 flex flex-col  p-6 bg-gray-100 dark:bg-gray-900">
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 flex items-center">
                                    <span>{searchTerm ? `Search Results: "${searchTerm}"` : 'All Transactions'}</span>
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
                                            className="flex items-center gap-1.5 px-4 py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500 data-[state=active]:to-rose-600 data-[state=active]:text-white rounded-lg transition-all duration-200 data-[state=active]:shadow-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                                            <span>Grid</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="list"
                                            active={view === 'list'}
                                            onClick={() => handleViewChange('list')}
                                            className="flex items-center gap-1.5 px-4 py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500 data-[state=active]:to-rose-600 data-[state=active]:text-white rounded-lg transition-all duration-200 data-[state=active]:shadow-md"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                                            <span>List</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="mb-5 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-white dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-2 rounded-lg">
                                            <Search className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Transaction Search</h3>
                                    </div>
                                    <div className="relative w-full group">
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-400 to-rose-500 opacity-0 group-focus-within:opacity-100 blur transition-opacity -m-0.5"></div>
                                        <div className="relative flex">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                                                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search by reference or destination..."
                                                className="flex-1 py-3 pl-11 pr-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 dark:text-gray-200 dark:placeholder-gray-400"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onFocus={(e) => {
                                                    anime({
                                                        targets: e.currentTarget,
                                                        scale: [1, 1.02],
                                                        boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 4px 20px rgba(0,0,0,0.1)'],
                                                        duration: 300,
                                                        easing: 'easeOutQuad'
                                                    });
                                                }}
                                                onBlur={(e) => {
                                                    anime({
                                                        targets: e.currentTarget,
                                                        scale: [1.02, 1],
                                                        boxShadow: ['0 4px 20px rgba(0,0,0,0.1)', '0 0 0 rgba(0,0,0,0)'],
                                                        duration: 300,
                                                        easing: 'easeOutQuad'
                                                    });
                                                }}
                                            />
                                            {searchTerm && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                                    onClick={() => setSearchTerm('')}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {searchTerm && (
                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 animate-pulse">
                                            <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                                            Searching for: {searchTerm}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div ref={cardsRef} className="transition-opacity duration-300" style={{ minHeight: '200px' }}>
                                <TabsContent value="grid" activeValue={view} className="mt-0">
                                    {filteredOutcome && filteredOutcome.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredOutcome.map((record, index) => (
                                                <div
                                                    key={record.id}
                                                    ref={el => gridItemsRef.current[index] = el}
                                                    className="overflow-hidden"
                                                >
                                                    <Card
                                                        className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow relative"
                                                        onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                                                        onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                                                    >
                                                        <div className="h-2 bg-gradient-to-r from-red-400 via-red-500 to-rose-600" />
                                                        <div className="absolute top-4 right-4">
                                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50">
                                                                Outcome
                                                            </Badge>
                                                        </div>
                                                        <CardContent className="p-6 pt-8">
                                                            <div className="flex items-start">
                                                                <div className="h-14 w-14 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-sm">
                                                                    <TrendingUp className="h-7 w-7 rotate-180" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">{record.reference}</h3>
                                                                    <div className="mt-1 flex flex-wrap gap-2">
                                                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center gap-1">
                                                                            <Tag className="h-3 w-3" />
                                                                            ID: {record.id}
                                                                        </Badge>
                                                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center gap-1">
                                                                            <User className="h-3 w-3" />
                                                                            {record.destination}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-6 grid grid-cols-2 gap-4">
                                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <div className="flex items-center gap-1.5 mb-1">
                                                                        <Calendar className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
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
                                                                <div className="col-span-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-800">
                                                                    <div className="flex items-center gap-1.5 mb-1">
                                                                        <ArrowDownRight className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                                                    </div>
                                                                    <p className="text-xl font-semibold text-red-600 dark:text-red-400">${record.amount.toFixed(2)}</p>
                                                                </div>
                                                            </div>

                                                            {record.notes && (
                                                                <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{record.notes}</p>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                        <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
                                                            <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1.5">
                                                                <BarChart3 className="h-4 w-4 text-red-500 dark:text-red-400" />
                                                                {record.destination}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 dark:text-gray-300">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                                                    Details
                                                                    <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                                                                </Button>
                                                            </div>
                                                        </CardFooter>
                                                    </Card>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                                            <div className="inline-flex h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-6">
                                                <TrendingUp className="h-10 w-10 text-red-600 rotate-180" />
                                            </div>
                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No outcome transactions found</h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                                {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'No outcome transactions have been recorded yet. Add your first transaction to get started.'}
                                            </p>
                                            <Button className="bg-red-600 hover:bg-red-700">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Transaction
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="list" activeValue={view} className="mt-0">
                                    {filteredOutcome && filteredOutcome.length > 0 ? (
                                        <Card className="border-0 shadow-md overflow-hidden rounded-xl">
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700 grid grid-cols-12 text-sm font-medium text-gray-500 dark:text-gray-300">
                                                <div className="col-span-4 flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
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
                                                    Destination
                                                </div>
                                                <div className="col-span-2 text-center flex items-center justify-center gap-1">
                                                    <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                                                    Amount
                                                </div>
                                                <div className="col-span-1 text-right">
                                                    <MoreHorizontal className="h-4 w-4 ml-auto text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {filteredOutcome.map((record, index) => (
                                                    <div
                                                        key={record.id}
                                                        ref={el => listItemsRef.current[index] = el}
                                                        className="px-6 py-4 bg-white dark:bg-gray-800 hover:bg-red-50/30 dark:hover:bg-red-900/10 grid grid-cols-12 items-center relative overflow-hidden group"
                                                        onMouseEnter={(e) => {
                                                            anime({
                                                                targets: e.currentTarget,
                                                                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(127, 29, 29, 0.1)' : 'rgba(254, 226, 226, 0.3)',
                                                                duration: 300,
                                                                easing: 'easeOutQuad'
                                                            });
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            anime({
                                                                targets: e.currentTarget,
                                                                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 1)' : 'rgba(255, 255, 255, 1)',
                                                                duration: 300,
                                                                easing: 'easeOutQuad'
                                                            });
                                                        }}
                                                    >
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <div className="col-span-4 flex items-center">
                                                            <div className="h-10 w-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-sm">
                                                                <TrendingUp className="h-5 w-5 rotate-180" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white">{record.reference}</h3>
                                                                {record.notes && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{record.notes}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1 text-center text-sm text-gray-600 dark:text-gray-200">{record.id}</div>
                                                        <div className="col-span-2 text-center text-sm text-gray-600 dark:text-gray-200">{record.date}</div>
                                                        <div className="col-span-2 text-center text-sm text-gray-600 dark:text-gray-200">{record.destination}</div>
                                                        <div className="col-span-2 text-center font-medium text-red-600 dark:text-red-300">${record.amount.toFixed(2)}</div>
                                                        <div className="col-span-1 text-right">
                                                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                                            <div className="inline-flex h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-6">
                                                <TrendingUp className="h-10 w-10 text-red-600 rotate-180" />
                                            </div>
                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No outcome transactions found</h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                                {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'No outcome transactions have been recorded yet. Add your first transaction to get started.'}
                                            </p>
                                            <Button className="bg-red-600 hover:bg-red-700">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Transaction
                                            </Button>
                                        </div>
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
                    </div>
                </div>
            </div>
        </>
    );
}

// Chart components
const OutcomeChart = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleMouseEnter = (data, index) => {
        setActiveIndex(index);
    };

    return (
        <div className="border-0 shadow-md overflow-hidden">
            <Card className="border-0 overflow-hidden">
                <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium">Outcome Trend</CardTitle>
                    <p className="text-sm text-gray-500">Showing last 7 days of transactions</p>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={data}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                                                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                                                    <p className="text-sm font-semibold text-red-600">
                                                        {`${payload[0].value} transaction${payload[0].value !== 1 ? 's' : ''}`}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorOutcome)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: "#ef4444" }}
                                    onMouseEnter={handleMouseEnter}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-1">
                        {data.map((entry, index) => (
                            <div
                                key={`dot-${index}`}
                                className={`cursor-pointer py-2 px-0.5 text-center rounded-md transition-colors duration-200 ${
                                    index === activeIndex
                                        ? 'bg-red-50 dark:bg-red-900/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <div className="text-xs font-medium">{entry.name}</div>
                                <div className={`text-sm mt-1 ${
                                    index === activeIndex ? 'text-red-600 font-semibold' : 'text-gray-500'
                                }`}>{entry.value}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const DestinationsChart = ({ data }) => {
    return (
        <div className="border-0 shadow-md overflow-hidden">
            <Card className="border-0 overflow-hidden">
                <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium">Top Destinations</CardTitle>
                    <p className="text-sm text-gray-500">Distribution of outcomes by destination</p>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                barSize={20}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" scale="point" />
                                <YAxis />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                                                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                                                    <p className="text-sm font-semibold text-red-600">
                                                        ${payload[0].value.toFixed(2)}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#ef4444"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
