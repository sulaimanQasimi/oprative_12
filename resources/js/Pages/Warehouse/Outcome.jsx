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

export default function Outcome({ auth, outcome }) {
    // Add debugging to check outcome data
    console.log("Outcome data received:", outcome);

    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('grid');
    const [isAnimated, setIsAnimated] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const cardsRef = useRef(null);
    const gridItemsRef = useRef([]);
    const listItemsRef = useRef([]);
    const dashboardCardsRef = useRef([]);

    // Animation timeline
    const timelineRef = useRef(null);

    // Filter outcome records based on search term
    const filteredOutcome = outcome && outcome.length
        ? outcome.filter(record =>
            (record.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.destination?.toLowerCase().includes(searchTerm.toLowerCase()))
          )
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
                            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
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
                                <Card
                                    key={index}
                                    ref={el => dashboardCardsRef.current[index] = el}
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
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=Warehouse+Outcome`} />
                                        <AvatarFallback>WO</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-lg">Outcome Transactions</h2>
                                        <p className="text-sm text-gray-500">{auth.user.warehouse.name} • {outcome?.length || 0} transactions</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Transaction
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Section */}
                        <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
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
                                                <Search className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search by reference or destination..."
                                                className="flex-1 py-3 pl-11 pr-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                                <Card
                                                    key={record.id}
                                                    ref={el => gridItemsRef.current[index] = el}
                                                    className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow relative"
                                                    onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                                                    onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                                                >
                                                    <div className="h-2 bg-gradient-to-r from-red-400 via-red-500 to-rose-600" />
                                                    <div className="absolute top-4 right-4">
                                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
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
                                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                                        <Tag className="h-3 w-3" />
                                                                        ID: {record.id}
                                                                    </Badge>
                                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
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
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                            <BarChart3 className="h-4 w-4 text-red-500" />
                                                            {record.destination}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 rounded-full">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                                                Details
                                                                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                                                            </Button>
                                                        </div>
                                                    </CardFooter>
                                                </Card>
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
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700 grid grid-cols-12 text-sm font-medium text-gray-500 dark:text-gray-400">
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
                                                                backgroundColor: 'rgba(254, 226, 226, 0.3)',
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
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <div className="col-span-4 flex items-center">
                                                            <div className="h-10 w-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-sm">
                                                                <TrendingUp className="h-5 w-5 rotate-180" />
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
                                                        <div className="col-span-2 text-center text-sm text-gray-600 dark:text-gray-300">{record.destination}</div>
                                                        <div className="col-span-2 text-center font-medium text-red-600">${record.amount.toFixed(2)}</div>
                                                        <div className="col-span-1 text-right">
                                                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    </div>
                </div>
            </div>
        </>
    );
}
