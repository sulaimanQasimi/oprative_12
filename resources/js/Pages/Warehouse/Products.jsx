import React, { useState, useEffect, useRef, useMemo, Component } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    Search, TrendingUp, ChevronRight, Plus, Filter, ArrowUpRight, ArrowDownRight,
    BarChart3, Calendar, Clock, Download, MoreHorizontal, ExternalLink, Tag, User,
    CreditCard, DollarSign, Mail, Settings, Inbox, ChevronDown, Eye, RefreshCw, Sliders,
    ShoppingCart, Package, UserCheck, Layers, PieChart, Grid, List, LayoutGrid
} from 'lucide-react';
import anime from 'animejs';
import Navigation from '@/Components/Warehouse/Navigation';

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

// Add PageLoader component
const PageLoader = ({ isVisible }) => {
    if (!isVisible) return null;
    
    return (
        <div
            className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Main container */}
                <div className="relative">
                    {/* Logo/icon in center */}
                    <div
                        className="relative z-10 bg-gradient-to-br from-emerald-500 to-teal-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
                    >
                        <Package className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Error Boundary Component
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error("Product component error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 my-4">
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Something went wrong.</h2>
                    <p className="text-red-600 dark:text-red-300">
                        There was an error loading the products. Please try refreshing the page.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Wrap the default export with the ErrorBoundary
const ProductsWithErrorBoundary = ({ auth, products }) => (
    <ErrorBoundary>
        <Products auth={auth} products={products} />
    </ErrorBoundary>
);

export default function Products({ auth, products }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('grid');
    const [isAnimated, setIsAnimated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Refs for animation targets
    const headerRef = useRef(null);
    const cardsRef = useRef(null);
    const gridItemsRef = useRef([]);
    const listItemsRef = useRef([]);
    const dashboardCardsRef = useRef([]);

    // Animation timeline
    const timelineRef = useRef(null);

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0) return [];
        
        return products.filter(product => {
            // Check if product exists and has valid structure
            if (!product) return false;
            
            // Check if product.product is a valid array with at least one item
            if (!product.product || !Array.isArray(product.product) || product.product.length === 0) return false;
            
            // Get the first product item
            const productItem = product.product[0];
            if (!productItem) return false;
            
            // Check if name or barcode matches search term
            const nameMatch = typeof productItem.name === 'string' && 
                productItem.name.toLowerCase().includes(searchTerm.toLowerCase());
                
            const barcodeMatch = typeof productItem.barcode === 'string' && 
                productItem.barcode.toLowerCase().includes(searchTerm.toLowerCase());
                
            return nameMatch || barcodeMatch;
        });
    }, [products, searchTerm]);

    // Calculate total inventory value using useMemo
    const totalValue = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0) return 0;
        
        return products.reduce((sum, product) => {
            if (!product) return sum;
            
            const quantity = typeof product.net_quantity === 'number' ? product.net_quantity : 0;
            const price = typeof product.income_price === 'number' ? product.income_price : 0;
            
            return sum + (quantity * price);
        }, 0);
    }, [products]);

    // Count low stock products using useMemo
    const lowStockCount = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0) return 0;
        
        return products.filter(product => {
            if (!product) return false;
            
            const quantity = typeof product.net_quantity === 'number' ? product.net_quantity : 0;
            return quantity < 10;
        }).length;
    }, [products]);

    // Get unique product categories using useMemo
    const categories = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0) return [];
        
        return Array.from(new Set(products.map(p => {
            if (!p || !p.product || !Array.isArray(p.product) || p.product.length === 0) {
                return 'Uncategorized';
            }
            
            const productItem = p.product[0];
            if (!productItem || typeof productItem.type !== 'string') {
                return 'Uncategorized';
            }
            
            return productItem.type || 'Uncategorized';
        })));
    }, [products]);
    
    // Determine category counts using useMemo
    const categoryStats = useMemo(() => {
        if (!categories || !Array.isArray(categories) || categories.length === 0) return [];
        if (!products || !Array.isArray(products) || products.length === 0) return [];
        
        return categories.map(category => {
            if (typeof category !== 'string') return { name: 'Uncategorized', count: 0 };
            
            const count = products.filter(p => {
                if (!p || !p.product || !Array.isArray(p.product) || p.product.length === 0) {
                    return category === 'Uncategorized';
                }
                
                const productItem = p.product[0];
                if (!productItem || typeof productItem.type !== 'string') {
                    return category === 'Uncategorized';
                }
                
                return (productItem.type || 'Uncategorized') === category;
            }).length;
            
            return { name: category, count };
        }).sort((a, b) => b.count - a.count);
    }, [categories, products]);

    // Get weekly activity data
    const getWeeklyActivity = () => {
        if (!products || products.length === 0) return [];

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayOfWeek = days[date.getDay()];

            const dateString = date.toISOString().split('T')[0];
            // Count transactions on this day with safety checks
            const count = products.filter(item => {
                if (!item || typeof item.created_at !== 'string') return false;
                try {
                    const itemDate = new Date(item.created_at);
                    if (isNaN(itemDate.getTime())) return false; // Invalid date check
                    return itemDate.toISOString().split('T')[0] === dateString;
                } catch (error) {
                    console.error("Error processing date:", error);
                    return false;
                }
            }).length;

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
            <Head title="Warehouse Products">
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
                <Navigation auth={auth} currentRoute="warehouse.products" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header ref={headerRef} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">Warehouse Management</span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    Products Inventory
                                    <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full">
                                        {products?.length || 0}
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
                            <Button size="sm" className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md rounded-full px-4">
                                <Plus className="h-4 w-4 mr-1.5" />
                                <span>New Product</span>
                            </Button>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-950/30 opacity-80"></div>

                            {/* Animated background elements */}
                            <div className="absolute -left-40 -top-40 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full filter blur-3xl animate-pulse"></div>
                            <div className="absolute right-20 top-10 w-72 h-72 bg-teal-200/20 dark:bg-teal-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
                            <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-green-200/20 dark:bg-green-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
                            <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-lime-200/20 dark:bg-lime-900/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '18s', animationDelay: '1s' }}></div>

                            <div className="relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        {
                                            title: "Total Value",
                                            value: "$" + totalValue.toFixed(2),
                                            icon: <DollarSign className="h-6 w-6" />,
                                            bgClass: "from-emerald-500 to-teal-600",
                                            trend: "Total inventory value",
                                            trendIcon: <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                        },
                                        {
                                            title: "Products Count",
                                            value: products?.length || 0,
                                            icon: <Layers className="h-6 w-6" />,
                                            bgClass: "from-teal-500 to-emerald-600",
                                            trend: "Total product variants",
                                            trendIcon: <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                        },
                                        {
                                            title: "Low Stock",
                                            value: lowStockCount,
                                            icon: <ArrowDownRight className="h-6 w-6" />,
                                            bgClass: "from-green-500 to-emerald-600",
                                            trend: "Items needing restock",
                                            trendIcon: lowStockCount > 0 ? <ArrowDownRight className="h-3.5 w-3.5 mr-1" /> : null
                                        },
                                        {
                                            title: "Categories",
                                            value: categories.length,
                                            icon: <PieChart className="h-6 w-6" />,
                                            bgClass: "from-lime-500 to-green-600",
                                            trend: "Product classifications",
                                            trendIcon: null
                                        }
                                    ].map((card, index) => (
                                        <div
                                            key={index}
                                            ref={el => dashboardCardsRef.current[index] = el}
                                            className={`bg-gradient-to-br ${card.bgClass} text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group`}
                                        >
                                            <div className="p-6 relative z-10">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="font-medium text-lg">{card.title}</span>
                                                    <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm border border-white/10">
                                                        {card.icon}
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-bold mt-2">
                                                    {typeof card.value === 'string' && card.value.startsWith('$') ? 
                                                        card.value : 
                                                        card.value
                                                    }
                                                </div>
                                                <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit border border-white/10">
                                                    {card.trendIcon}
                                                    <span>{card.trend}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Search and Tabs Section */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div
                                    className="w-full md:w-96 relative"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200"
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
                                </div>

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
                                                <LayoutGrid className="h-4 w-4" />
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="list"
                                                active={view === 'list'}
                                                onClick={() => handleViewChange('list')}
                                                className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                            >
                                                <List className="h-4 w-4" />
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </div>

                            {searchTerm && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4 animate-pulse">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    <p>Showing results for: <span className="font-medium text-slate-700 dark:text-slate-300">{searchTerm}</span></p>
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center mb-6">
                                {searchTerm ? 'Search Results' : 'Products Inventory'}
                            </h2>

                            {/* Grid and List Views */}
                            <div ref={cardsRef} className="transition-opacity duration-300" style={{ minHeight: '200px' }}>
                                <TabsContent value="grid" activeValue={view} className="mt-0">
                                    {filteredProducts && filteredProducts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredProducts.map((product, index) => (
                                                <div
                                                    key={product.product_id}
                                                    ref={el => gridItemsRef.current[index] = el}
                                                    className="mb-4"
                                                >
                                                    <Card
                                                        className="bg-white dark:bg-slate-900 border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full"
                                                        onMouseEnter={(e) => animateHover(e.currentTarget, true)}
                                                        onMouseLeave={(e) => animateHover(e.currentTarget, false)}
                                                    >
                                                        <div className="flex justify-between items-start p-5 pb-3">
                                                            <div className="flex gap-3 items-start">
                                                                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                                                    <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                                                                        {product.product && Array.isArray(product.product) && product.product.length > 0 ? 
                                                                            product.product[0].name || 'Unnamed Product' : 
                                                                            'Unnamed Product'}
                                                                    </h3>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400">ID: {product.product_id}</p>
                                                                </div>
                                                            </div>
                                                            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-medium border-0">
                                                                {product.product && Array.isArray(product.product) && product.product.length > 0 ? 
                                                                    product.product[0].type || 'Item' : 
                                                                    'Item'}
                                                            </Badge>
                                                        </div>

                                                        <CardContent className="px-5 pt-0 pb-3">
                                                            <div className="mt-3 flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Stock</p>
                                                                    <p className={`text-xl font-bold ${product.net_quantity < 10 ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                        {product.net_quantity}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Price</p>
                                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">${product.income_price}</p>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Incoming</p>
                                                                    <p className="text-sm font-medium text-emerald-600">{product.income_quantity}</p>
                                                                </div>
                                                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Outgoing</p>
                                                                    <p className="text-sm font-medium text-rose-600">{product.outcome_quantity}</p>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                    <Tag className="h-3 w-3" />
                                                                    Barcode: {
                                                                    product.product && Array.isArray(product.product) && product.product.length > 0 ? 
                                                                    product.product[0].barcode || 'N/A' : 
                                                                    'N/A'
                                                                    }
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 justify-end">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(product.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </CardContent>

                                                        <CardFooter className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 px-2 h-8">
                                                                <Eye className="h-3.5 w-3.5" />
                                                                <span>View</span>
                                                            </Button>
                                                            <div className="flex gap-1">
                                                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 w-8 h-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="default" size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8">
                                                                    Details
                                                                </Button>
                                                            </div>
                                                        </CardFooter>
                                                    </Card>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
                                            <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                <Package className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No products found</h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                                {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'No products have been added yet. Add your first product to get started.'}
                                            </p>
                                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Product
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="list" activeValue={view} className="mt-0">
                                    {filteredProducts && filteredProducts.length > 0 ? (
                                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-5 py-3 grid grid-cols-12 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                <div className="col-span-4 md:col-span-5 lg:col-span-4 flex items-center gap-2">
                                                    <span>Product Name</span>
                                                </div>
                                                <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden md:flex items-center justify-center">
                                                    <span>Type</span>
                                                </div>
                                                <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center hidden md:flex items-center justify-center">
                                                    <span>Stock</span>
                                                </div>
                                                <div className="col-span-6 md:col-span-2 lg:col-span-2 text-center flex items-center justify-center">
                                                    <span>Price</span>
                                                </div>
                                                <div className="col-span-2 md:col-span-1 lg:col-span-2 text-right">
                                                    <span>Actions</span>
                                                </div>
                                            </div>
                                            <div>
                                                {filteredProducts.map((product, index) => (
                                                    <div
                                                        key={product.product_id}
                                                        ref={el => listItemsRef.current[index] = el}
                                                        className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 grid grid-cols-12 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                                                    >
                                                        <div className="col-span-4 md:col-span-5 lg:col-span-4 flex items-center gap-3">
                                                            <div className="h-9 w-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="font-medium text-slate-900 dark:text-white truncate">
                                                                    {product.product && Array.isArray(product.product) && product.product.length > 0 ? 
                                                                        product.product[0].name || 'Unnamed Product' : 
                                                                        'Unnamed Product'}
                                                                </h3>
                                                                <div className="mt-0.5 md:hidden">
                                                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                                        <Tag className="h-3 w-3 mr-1" />
                                                                        {product.product && Array.isArray(product.product) && product.product.length > 0 ? 
                                                                            product.product[0].type || 'Item' : 
                                                                            'Item'}
                                                                    </div>
                                                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                                        <Layers className="h-3 w-3 mr-1" />
                                                                        Stock: {product.net_quantity || 0}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden md:block text-sm text-slate-700 dark:text-slate-300">
                                                            {product.product && Array.isArray(product.product) && product.product.length > 0 ? 
                                                                product.product[0].type || 'Item' : 
                                                                'Item'}
                                                        </div>
                                                        <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center hidden md:block">
                                                            <Badge className={`${product.net_quantity < 10 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                                {product.net_quantity}
                                                            </Badge>
                                                        </div>
                                                        <div className="col-span-6 md:col-span-2 lg:col-span-2 text-center font-medium text-emerald-600 dark:text-emerald-400">
                                                            ${product.income_price}
                                                        </div>
                                                        <div className="col-span-2 md:col-span-1 lg:col-span-2 flex justify-end gap-1">
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-transparent dark:text-slate-400 dark:border-slate-700 text-slate-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <span>Details</span>
                                                                <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    ) : (
                                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
                                            <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                <Package className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No products found</h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                                {searchTerm ? 'Try adjusting your search criteria or check for typos.' : 'No products have been added yet. Add your first product to get started.'}
                                            </p>
                                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Product
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}