import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Search, MessageSquare, Package, TrendingUp, Settings, ChevronRight, Plus, Filter, ArrowUpRight, ArrowDownRight, BarChart3, Layers, PieChart, Grid, List, MoreHorizontal, ExternalLink, Tag, Clock, Calendar, LayoutGrid, Users } from 'lucide-react';
import anime from 'animejs';

export default function Products({ auth, products }) {
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

    // Filter products based on search term
    const filteredProducts = products && products.length
        ? products.filter(product =>
            product.product[0].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.product[0].barcode?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    // Calculate total inventory value
    const calculateTotalValue = () => {
        if (!products || products.length === 0) return 0;
        return products.reduce((sum, product) => {
            return sum + (product.net_quantity * product.income_price);
        }, 0).toFixed(2);
    };

    // Count low stock products
    const getLowStockCount = () => {
        if (!products || products.length === 0) return 0;
        return products.filter(product => product.net_quantity < 10).length;
    };

    // Get unique product types for categories
    const getCategories = () => {
        if (!products || products.length === 0) return [];
        return Array.from(new Set(products.map(p => p.product[0].type || 'Uncategorized')));
    };

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

            // Animate product cards or list items with stagger based on view
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
    }, [isAnimated, view, filteredProducts.length]);

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
            <Head title="Warehouse Products" />

            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar */}
                <div className="w-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg z-10">
                    <div className="h-full flex flex-col items-center justify-between py-6">
                        <div className="flex flex-col items-center space-y-8">
                            <div className="bg-purple-600 text-white p-2 rounded-xl">
                                <Package className="h-6 w-6" />
                            </div>
                            <nav className="flex flex-col items-center space-y-8">
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20" as="a" href={route('warehouse.dashboard')}>
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-purple-600 bg-purple-100 dark:bg-purple-900/20" as="a" href={route('warehouse.products')}>
                                    <Package className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20" as="a" href={route('warehouse.income')}>
                                    <TrendingUp className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20" as="a" href={route('warehouse.outcome')}>
                                    <TrendingUp className="h-5 w-5 rotate-180" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20" as="a" href={route('warehouse.profile.edit')}>
                                    <Settings className="h-5 w-5" />
                                </Button>
                            </nav>
                        </div>
                        <Avatar className="border-2 border-purple-200 dark:border-purple-900/40">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=8b5cf6&color=fff`} />
                            <AvatarFallback className="bg-purple-600 text-white">{auth.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header ref={headerRef} className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-purple-600"></div>
                        <div className="flex items-center space-x-3 relative z-10">
                            <div className="relative">
                                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Products</h1>
                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 ml-2 px-2.5 py-0.5 rounded-full font-medium">
                                {products?.length || 0} items
                            </Badge>
                        </div>
                    </header>

                    {/* Dashboard Summary */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                {
                                    title: "Total Value",
                                    value: "$" + calculateTotalValue(),
                                    icon: <BarChart3 className="h-5 w-5" />,
                                    bgClass: "from-purple-500 to-indigo-600",
                                    trend: "Up 12% from last month",
                                    trendIcon: <ArrowUpRight className="h-3 w-3 mr-1" />
                                },
                                {
                                    title: "Total Products",
                                    value: products?.length || 0,
                                    icon: <Layers className="h-5 w-5" />,
                                    bgClass: "from-blue-500 to-cyan-600",
                                    trend: "Added 5 this month",
                                    trendIcon: <ArrowUpRight className="h-3 w-3 mr-1" />
                                },
                                {
                                    title: "Low Stock",
                                    value: getLowStockCount(),
                                    icon: <ArrowDownRight className="h-5 w-5" />,
                                    bgClass: "from-pink-500 to-rose-600",
                                    trend: "Critical items need restock",
                                    trendIcon: <ArrowDownRight className="h-3 w-3 mr-1" />
                                },
                                {
                                    title: "Categories",
                                    value: getCategories().length,
                                    icon: <PieChart className="h-5 w-5" />,
                                    bgClass: "from-amber-500 to-orange-600",
                                    trend: "Product classifications",
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

                    {/* Main Content Section */}
                    <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 flex items-center">
                                <span>{searchTerm ? `Search Results: "${searchTerm}"` : 'All Products'}</span>
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
                                        className="flex items-center gap-1.5 px-4 py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200 data-[state=active]:shadow-md"
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                        <span>Grid</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="list"
                                        active={view === 'list'}
                                        onClick={() => handleViewChange('list')}
                                        className="flex items-center gap-1.5 px-4 py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200 data-[state=active]:shadow-md"
                                    >
                                        <List className="h-4 w-4" />
                                        <span>List</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div ref={cardsRef} className="transition-opacity duration-300" style={{ minHeight: '200px' }}>
                            <TabsContent value="grid" activeValue={view} className="mt-0">
                                {filteredProducts && filteredProducts.length > 0 ? (
                                    <>
                                        <div className="mb-5 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-lg">
                                                        <BarChart3 className="h-5 w-5" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Barcode Search</h3>
                                                </div>
                                                <div className="relative w-full group">
                                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-indigo-500 opacity-0 group-focus-within:opacity-100 blur transition-opacity -m-0.5"></div>
                                                    <div className="relative flex">
                                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                                                            <Tag className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Scan or type product barcode to search..."
                                                            className="flex-1 py-3 pl-11 pr-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                                                        <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                                                        Searching for: {searchTerm}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredProducts.map((product, index) => (
                                                <Card
                                                    key={product.product_id}
                                                    ref={el => gridItemsRef.current[index] = el}
                                                    className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow relative"
                                                    onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                                                    onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                                                >
                                                    <div className="h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600" />
                                                    <div className="absolute top-4 right-4">
                                                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                                            {product.product[0].type || 'Item'}
                                                        </Badge>
                                                    </div>
                                                    <CardContent className="p-6 pt-8">
                                                        <div className="flex items-start">
                                                            <div className="h-14 w-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-sm">
                                                                <Package className="h-7 w-7" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-lg text-gray-900 dark:text-white">{product.product[0].name}</h3>
                                                                <div className="mt-1 flex flex-wrap gap-2">
                                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                                        <Tag className="h-3 w-3" />
                                                                        ID: {product.product_id}
                                                                    </Badge>
                                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                                        <BarChart3 className="h-3 w-3" />
                                                                        {product.product[0].barcode || 'N/A'}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 grid grid-cols-2 gap-4">
                                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <Layers className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                                                                </div>
                                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.net_quantity}</p>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <Tag className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                                                                </div>
                                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">${product.income_price}</p>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <ArrowUpRight className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Incoming</p>
                                                                </div>
                                                                <p className="text-lg font-semibold text-green-600">{product.income_quantity}</p>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <ArrowDownRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Outgoing</p>
                                                                </div>
                                                                <p className="text-lg font-semibold text-rose-600">{product.outcome_quantity}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                            <BarChart3 className="h-4 w-4 text-indigo-500" />
                                                            ${(product.net_quantity * product.income_price).toFixed(2)}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 rounded-full">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                                                                Details
                                                                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                                                            </Button>
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                                        <div className="inline-flex h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mb-6">
                                            <Package className="h-10 w-10 text-purple-600" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                            {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'Your warehouse inventory is empty. Add products to get started.'}
                                        </p>
                                        <Button className="bg-purple-600 hover:bg-purple-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add First Product
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="list" activeValue={view} className="mt-0">
                                {filteredProducts && filteredProducts.length > 0 ? (
                                    <>
                                        <div className="mb-5 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-lg">
                                                        <BarChart3 className="h-5 w-5" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Barcode Search</h3>
                                                </div>
                                                <div className="relative w-full group">
                                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-indigo-500 opacity-0 group-focus-within:opacity-100 blur transition-opacity -m-0.5"></div>
                                                    <div className="relative flex">
                                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                                                            <Tag className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Scan or type product barcode to search..."
                                                            className="flex-1 py-3 pl-11 pr-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                                                        <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                                                        Searching for: {searchTerm}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Card className="border-0 shadow-md overflow-hidden rounded-xl">
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700 grid grid-cols-12 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <div className="col-span-4 flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-purple-500" />
                                                    Product Name
                                                </div>
                                                <div className="col-span-1 text-center flex items-center justify-center gap-1">
                                                    <Tag className="h-3.5 w-3.5 text-indigo-500" />
                                                    ID
                                                </div>
                                                <div className="col-span-1 text-center flex items-center justify-center gap-1">
                                                    <Layers className="h-3.5 w-3.5 text-green-500" />
                                                    Stock
                                                </div>
                                                <div className="col-span-1 text-center flex items-center justify-center gap-1">
                                                    <Tag className="h-3.5 w-3.5 text-amber-500" />
                                                    Price
                                                </div>
                                                <div className="col-span-1 text-center flex items-center justify-center gap-1">
                                                    <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                                                    In
                                                </div>
                                                <div className="col-span-1 text-center flex items-center justify-center gap-1">
                                                    <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
                                                    Out
                                                </div>
                                                <div className="col-span-2 text-center flex items-center justify-center gap-1">
                                                    <BarChart3 className="h-3.5 w-3.5 text-purple-500" />
                                                    Value
                                                </div>
                                                <div className="col-span-1 text-right">
                                                    <MoreHorizontal className="h-4 w-4 ml-auto text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {filteredProducts.map((product, index) => (
                                                    <div
                                                        key={product.product_id}
                                                        ref={el => listItemsRef.current[index] = el}
                                                        className="px-6 py-4 bg-white dark:bg-gray-800 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 grid grid-cols-12 items-center relative overflow-hidden group"
                                                        onMouseEnter={(e) => {
                                                            anime({
                                                                targets: e.currentTarget,
                                                                backgroundColor: 'rgba(233, 213, 255, 0.2)',
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
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <div className="col-span-4 flex items-center">
                                                            <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-sm">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white">{product.product[0].name}</h3>
                                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                    <BarChart3 className="h-3 w-3" />
                                                                    {product.product[0].barcode || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1 text-center text-sm text-gray-600 dark:text-gray-300">{product.product_id}</div>
                                                        <div className="col-span-1 text-center">
                                                            <Badge className={`${product.net_quantity < 10 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                                {product.net_quantity}
                                                            </Badge>
                                                        </div>
                                                        <div className="col-span-1 text-center font-medium text-gray-900 dark:text-white">${product.income_price}</div>
                                                        <div className="col-span-1 text-center text-green-600">{product.income_quantity}</div>
                                                        <div className="col-span-1 text-center text-rose-600">{product.outcome_quantity}</div>
                                                        <div className="col-span-2 text-center font-medium text-gray-900 dark:text-white">${(product.net_quantity * product.income_price).toFixed(2)}</div>
                                                        <div className="col-span-1 text-right">
                                                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                                        <div className="inline-flex h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mb-6">
                                            <Package className="h-10 w-10 text-purple-600" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                            {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'Your warehouse inventory is empty. Add products to get started.'}
                                        </p>
                                        <Button className="bg-purple-600 hover:bg-purple-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add First Product
                                        </Button>
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
