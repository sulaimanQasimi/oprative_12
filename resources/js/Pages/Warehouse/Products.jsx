import React, { useState, useEffect, useRef, useMemo, Component } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Search,
    TrendingUp,
    ChevronRight,
    Plus,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Calendar,
    Clock,
    Download,
    MoreHorizontal,
    ExternalLink,
    Tag,
    User,
    CreditCard,
    DollarSign,
    Mail,
    Settings,
    Inbox,
    ChevronDown,
    Eye,
    RefreshCw,
    Sliders,
    ShoppingCart,
    Package,
    UserCheck,
    Layers,
    PieChart,
    Grid,
    List,
    LayoutGrid,
    AlertTriangle,
} from "lucide-react";
import anime from "animejs";
import Navigation from "@/Components/Warehouse/Navigation";
import { motion } from "framer-motion";

// Safe querySelector utility function that checks if element exists
const safeQuerySelector = (element, selector) => {
    if (!element || !selector) return null;
    try {
        return element.querySelector(selector);
    } catch (error) {
        console.error(t("Error in querySelector:"), error);
        return null;
    }
};

// AnimatedCounter component
const AnimatedCounter = ({
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
                round: 1, // Rounds the values to 1 decimal
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
};

// Add PageLoader component
const PageLoader = ({ isVisible }) => {
    const { t } = useLaravelReactI18n();

    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "all" : "none",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

            {/* Animated light beams */}
            <div className="absolute w-full h-full overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-r from-emerald-400/10 via-teal-500/10 to-transparent h-[30vh] w-[100vw]"
                        style={{
                            top: `${10 + i * 20}%`,
                            left: "-100%",
                            transformOrigin: "left center",
                            rotate: `${-20 + i * 10}deg`,
                        }}
                        animate={{
                            left: ["100%", "-100%"],
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
                        ease: "easeInOut",
                    }}
                >
                    {/* Pulsing background circles */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-full bg-emerald-600/5 filter blur-2xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute w-72 h-72 rounded-full bg-teal-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />

                    {/* Animated logo/icon container */}
                    <div className="relative flex items-center justify-center h-40 w-40">
                        {/* Spinning rings */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-emerald-300/10"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-teal-400/20"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-emerald-400/30"
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 10,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />

                        {/* Spinner arcs */}
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-r-emerald-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-teal-400 border-t-transparent border-l-transparent border-r-transparent"
                            animate={{ rotate: -180 }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />

                        {/* Icon/logo in center */}
                        <motion.div
                            className="relative z-10 bg-gradient-to-br from-emerald-500 to-teal-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.1, 1, 1.1, 1],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Package className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
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
        const { t } = this.props.i18n;

        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 my-4">
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
                        {t("Something went wrong.")}
                    </h2>
                    <p className="text-red-600 dark:text-red-300">
                        {t(
                            "There was an error loading the products. Please try refreshing the page."
                        )}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                        {t("Refresh Page")}
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Wrap the default export with the ErrorBoundary
const ProductsWithErrorBoundary = ({ auth, products }) => {
    const i18n = useLaravelReactI18n();

    return (
        <ErrorBoundary i18n={i18n}>
            <Products auth={auth} products={products} />
        </ErrorBoundary>
    );
};

export default function Products({ auth, products }) {
    const { t } = useLaravelReactI18n();

    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState("grid");
    const [isAnimated, setIsAnimated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // grid, table

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
        if (!products || !Array.isArray(products) || products.length === 0)
            return [];

        return products.filter((product) => {
            // Check if product exists and has valid structure
            if (!product) return false;

            // Check if product.product is a valid array with at least one item
            if (
                !product.product ||
                !Array.isArray(product.product) ||
                product.product.length === 0
            )
                return false;

            // Get the first product item
            const productItem = product.product[0];
            if (!productItem) return false;

            // Check if name or barcode matches search term
            const nameMatch =
                typeof productItem.name === "string" &&
                productItem.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const barcodeMatch =
                typeof productItem.barcode === "string" &&
                productItem.barcode
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return nameMatch || barcodeMatch;
        });
    }, [products, searchTerm]);

    // Calculate total inventory value using useMemo
    const totalValue = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0)
            return 0;

        return products.reduce((sum, product) => {
            if (!product) return sum;

            const quantity =
                typeof product.net_quantity === "number"
                    ? product.net_quantity
                    : 0;
            const price =
                typeof product.income_price === "number"
                    ? product.income_price
                    : 0;

            return sum + quantity * price;
        }, 0);
    }, [products]);

    // Count low stock products using useMemo
    const lowStockCount = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0)
            return 0;

        return products.filter((product) => {
            if (!product) return false;

            const quantity =
                typeof product.net_quantity === "number"
                    ? product.net_quantity
                    : 0;
            return quantity < 10;
        }).length;
    }, [products]);

    // Get unique product categories using useMemo
    const categories = useMemo(() => {
        if (!products || !Array.isArray(products) || products.length === 0)
            return [];

        return Array.from(
            new Set(
                products.map((p) => {
                    if (
                        !p ||
                        !p.product ||
                        !Array.isArray(p.product) ||
                        p.product.length === 0
                    ) {
                        return "Uncategorized";
                    }

                    const productItem = p.product[0];
                    if (!productItem || typeof productItem.type !== "string") {
                        return "Uncategorized";
                    }

                    return productItem.type || "Uncategorized";
                })
            )
        );
    }, [products]);

    // Determine category counts using useMemo
    const categoryStats = useMemo(() => {
        if (
            !categories ||
            !Array.isArray(categories) ||
            categories.length === 0
        )
            return [];
        if (!products || !Array.isArray(products) || products.length === 0)
            return [];

        return categories
            .map((category) => {
                if (typeof category !== "string")
                    return { name: "Uncategorized", count: 0 };

                const count = products.filter((p) => {
                    if (
                        !p ||
                        !p.product ||
                        !Array.isArray(p.product) ||
                        p.product.length === 0
                    ) {
                        return category === "Uncategorized";
                    }

                    const productItem = p.product[0];
                    if (!productItem || typeof productItem.type !== "string") {
                        return category === "Uncategorized";
                    }

                    return (productItem.type || "Uncategorized") === category;
                }).length;

                return { name: category, count };
            })
            .sort((a, b) => b.count - a.count);
    }, [categories, products]);

    // Get weekly activity data
    const getWeeklyActivity = () => {
        if (!products || products.length === 0) return [];

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const result = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayOfWeek = days[date.getDay()];

            const dateString = date.toISOString().split("T")[0];
            // Count transactions on this day with safety checks
            const count = products.filter((item) => {
                if (!item || typeof item.created_at !== "string") return false;
                try {
                    const itemDate = new Date(item.created_at);
                    if (isNaN(itemDate.getTime())) return false; // Invalid date check
                    return itemDate.toISOString().split("T")[0] === dateString;
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
                easing: "easeOutExpo",
                duration: 800,
            });

            // Animate header
            timelineRef.current.add({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600,
            });

            // Animate dashboard cards with stagger
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

            // Animate product cards or list items with stagger based on view
            if (view === "grid" && gridItemsRef.current.length > 0) {
                timelineRef.current.add(
                    {
                        targets: gridItemsRef.current,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        scale: [0.95, 1],
                        delay: anime.stagger(50),
                        duration: 600,
                    },
                    "-=500"
                );
            } else if (view === "list" && listItemsRef.current.length > 0) {
                timelineRef.current.add(
                    {
                        targets: listItemsRef.current,
                        opacity: [0, 1],
                        translateX: [-20, 0],
                        delay: anime.stagger(30),
                        duration: 500,
                    },
                    "-=500"
                );
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
            easing: "easeInOutQuad",
            complete: () => {
                setView(newView);
                // Force immediate rerender to avoid flash of empty content
                setTimeout(() => {
                    anime({
                        targets: cardsRef.current,
                        opacity: [0, 1],
                        scale: [0.95, 1],
                        duration: 300,
                        easing: "easeOutQuad",
                    });
                }, 50);
            },
        });
    };

    // Animation for hover effects
    const animateHover = (target, enter) => {
        anime({
            targets: target,
            scale: enter ? 1.03 : 1,
            boxShadow: enter
                ? "0 10px 30px rgba(0, 0, 0, 0.1)"
                : "0 4px 10px rgba(0, 0, 0, 0.08)",
            duration: 300,
            easing: "spring(1, 80, 10, 0)",
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
            <Head title={t("Warehouse Products")}>
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
                    <header
                        ref={headerRef}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                                    {t("Warehouse Management")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Products Inventory")}
                                    <Badge
                                        variant="outline"
                                        className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full"
                                    >
                                        {products?.length || 0}
                                    </Badge>
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {/* Dashboard Stats Section */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-950/30 opacity-80"></div>

                            {/* Animated background elements */}
                            <div className="absolute -left-40 -top-40 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full filter blur-3xl animate-pulse"></div>
                            <div
                                className="absolute right-20 top-10 w-72 h-72 bg-teal-200/20 dark:bg-teal-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{ animationDuration: "15s" }}
                            ></div>
                            <div
                                className="absolute -right-40 -bottom-40 w-80 h-80 bg-green-200/20 dark:bg-green-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{
                                    animationDuration: "20s",
                                    animationDelay: "2s",
                                }}
                            ></div>
                            <div
                                className="absolute left-1/3 bottom-0 w-64 h-64 bg-lime-200/20 dark:bg-lime-900/10 rounded-full filter blur-3xl animate-pulse"
                                style={{
                                    animationDuration: "18s",
                                    animationDelay: "1s",
                                }}
                            ></div>

                            <div className="relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        {
                                            title: t("Total Value"),
                                            value: "$" + totalValue.toFixed(2),
                                            icon: (
                                                <DollarSign className="h-6 w-6" />
                                            ),
                                            bgClass:
                                                "from-emerald-500 to-teal-600",
                                            secondaryIcon: (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0.1,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: [
                                                            0.1, 0.15, 0.1,
                                                        ],
                                                        scale: [0.8, 0.9, 0.8],
                                                    }}
                                                    transition={{
                                                        duration: 5,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="absolute right-4 bottom-4"
                                                >
                                                    <CreditCard className="h-16 w-16" />
                                                </motion.div>
                                            ),
                                            trend: t("Total inventory value"),
                                            trendIcon: (
                                                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                            ),
                                            decorator: (
                                                <motion.div
                                                    className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full"
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [
                                                            0.3, 0.2, 0.3,
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 8,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            ),
                                        },
                                        {
                                            title: t("Products Count"),
                                            value: products?.length || 0,
                                            icon: (
                                                <Layers className="h-6 w-6" />
                                            ),
                                            bgClass:
                                                "from-teal-500 to-emerald-600",
                                            secondaryIcon: (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0.1,
                                                        rotate: 0,
                                                    }}
                                                    animate={{
                                                        opacity: [
                                                            0.1, 0.15, 0.1,
                                                        ],
                                                        rotate: [0, 5, 0],
                                                    }}
                                                    transition={{
                                                        duration: 6,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="absolute right-4 bottom-4"
                                                >
                                                    <Package className="h-16 w-16" />
                                                </motion.div>
                                            ),
                                            trend: t("Total product variants"),
                                            trendIcon: (
                                                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                            ),
                                            decorator: (
                                                <motion.div
                                                    className="absolute -left-6 -bottom-6 w-24 h-24 bg-teal-500/10 rounded-full"
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [
                                                            0.3, 0.2, 0.3,
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 7,
                                                        delay: 1,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            ),
                                        },
                                        {
                                            title: t("Low Stock"),
                                            value: lowStockCount,
                                            icon: (
                                                <ArrowDownRight className="h-6 w-6" />
                                            ),
                                            bgClass:
                                                "from-green-500 to-emerald-600",
                                            secondaryIcon: (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0.1,
                                                        y: 0,
                                                    }}
                                                    animate={{
                                                        opacity: [
                                                            0.1, 0.15, 0.1,
                                                        ],
                                                        y: [0, -5, 0],
                                                    }}
                                                    transition={{
                                                        duration: 4,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="absolute right-4 bottom-4"
                                                >
                                                    <ShoppingCart className="h-16 w-16" />
                                                </motion.div>
                                            ),
                                            trend: t("Items needing restock"),
                                            trendIcon:
                                                lowStockCount > 0 ? (
                                                    <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                                                ) : null,
                                            decorator: (
                                                <motion.div
                                                    className="absolute right-10 top-10 w-16 h-16 bg-green-500/10 rounded-full"
                                                    animate={{
                                                        scale: [1, 1.3, 1],
                                                        opacity: [
                                                            0.3, 0.2, 0.3,
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 5,
                                                        delay: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            ),
                                        },
                                        {
                                            title: t("Categories"),
                                            value: categories.length,
                                            icon: (
                                                <PieChart className="h-6 w-6" />
                                            ),
                                            bgClass:
                                                "from-lime-500 to-green-600",
                                            secondaryIcon: (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0.1,
                                                        scale: 1,
                                                    }}
                                                    animate={{
                                                        opacity: [
                                                            0.1, 0.15, 0.1,
                                                        ],
                                                        scale: [1, 1.05, 1],
                                                    }}
                                                    transition={{
                                                        duration: 5,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="absolute right-4 bottom-4"
                                                >
                                                    <Grid className="h-16 w-16" />
                                                </motion.div>
                                            ),
                                            trend: t("Product classifications"),
                                            trendIcon: null,
                                            decorator: (
                                                <motion.div
                                                    className="absolute left-10 bottom-10 w-20 h-20 bg-lime-500/10 rounded-full"
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [
                                                            0.3, 0.15, 0.3,
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 6,
                                                        delay: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            ),
                                        },
                                    ].map((card, index) => (
                                        <motion.div
                                            key={index}
                                            className={`bg-gradient-to-br ${card.bgClass} text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group`}
                                            style={{ perspective: "1000px" }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                                ease: "easeOut",
                                            }}
                                            whileHover={{
                                                translateY: -8,
                                                transition: { duration: 0.3 },
                                            }}
                                            onHoverStart={(e) => {
                                                try {
                                                    anime({
                                                        targets:
                                                            e.currentTarget,
                                                        boxShadow: [
                                                            "0 4px 12px rgba(0,0,0,0.1)",
                                                            "0 20px 40px rgba(0,0,0,0.2)",
                                                        ],
                                                        translateZ: [
                                                            "0px",
                                                            "30px",
                                                        ],
                                                        rotateX: [-2, 0],
                                                        rotateY: [0, -3],
                                                        duration: 500,
                                                        easing: "easeOutQuint",
                                                    });

                                                    // Animate the card shine - use safe querySelector
                                                    const shineElement =
                                                        safeQuerySelector(
                                                            e.currentTarget,
                                                            ".card-shine"
                                                        );
                                                    if (shineElement) {
                                                        anime({
                                                            targets:
                                                                shineElement,
                                                            translateX: [
                                                                "0%",
                                                                "100%",
                                                            ],
                                                            duration: 1200,
                                                            easing: "easeInOutQuart",
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error(
                                                        "Error in onHoverStart:",
                                                        error
                                                    );
                                                }
                                            }}
                                            onHoverEnd={(e) => {
                                                try {
                                                    anime({
                                                        targets:
                                                            e.currentTarget,
                                                        boxShadow: [
                                                            "0 20px 40px rgba(0,0,0,0.2)",
                                                            "0 4px 12px rgba(0,0,0,0.1)",
                                                        ],
                                                        translateZ: [
                                                            "30px",
                                                            "0px",
                                                        ],
                                                        rotateX: [0, 0],
                                                        rotateY: [-3, 0],
                                                        duration: 500,
                                                        easing: "easeOutQuint",
                                                    });
                                                } catch (error) {
                                                    console.error(
                                                        "Error in onHoverEnd:",
                                                        error
                                                    );
                                                }
                                            }}
                                        >
                                            <div
                                                ref={(el) =>
                                                    (dashboardCardsRef.current[
                                                        index
                                                    ] = el)
                                                }
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
                                                        <span className="font-medium text-lg">
                                                            {card.title}
                                                        </span>
                                                        <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-300 border border-white/10">
                                                            {card.icon}
                                                        </div>
                                                    </div>
                                                    <div className="text-3xl font-bold mt-2 flex items-end transform group-hover:scale-105 transition-transform origin-left duration-300">
                                                        <AnimatedCounter
                                                            value={
                                                                typeof card.value ===
                                                                "string"
                                                                    ? parseInt(
                                                                          card.value.replace(
                                                                              /[^0-9.-]+/g,
                                                                              ""
                                                                          )
                                                                      )
                                                                    : card.value
                                                            }
                                                            prefix={
                                                                typeof card.value ===
                                                                    "string" &&
                                                                card.value.startsWith(
                                                                    "$"
                                                                )
                                                                    ? "$"
                                                                    : ""
                                                            }
                                                            duration={2000}
                                                        />
                                                    </div>
                                                    <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                                                        {card.trendIcon}
                                                        <span>
                                                            {card.trend}
                                                        </span>
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
                                <div className="w-full md:w-96 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t("Search products...")}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    {searchTerm && (
                                        <button
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 6 6 18"></path>
                                                <path d="m6 6 12 12"></path>
                                            </svg>
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
                                        <span>{t("Refresh")}</span>
                                    </Button>
                                    <Tabs
                                        defaultValue="grid"
                                        className="w-auto"
                                    >
                                        <TabsList className="p-1 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <TabsTrigger
                                                value="grid"
                                                active={view === "grid"}
                                                onClick={() =>
                                                    handleViewChange("grid")
                                                }
                                                className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
                                            >
                                                <LayoutGrid className="h-4 w-4" />
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="list"
                                                active={view === "list"}
                                                onClick={() =>
                                                    handleViewChange("list")
                                                }
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
                                    <p>
                                        {t("Showing results for:")}{" "}
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {searchTerm}
                                        </span>
                                    </p>
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center mb-6">
                                {searchTerm
                                    ? t("Search Results")
                                    : t("Products Inventory")}
                            </h2>

                            {/* Grid and List Views */}
                            <div
                                ref={cardsRef}
                                className="transition-opacity duration-300"
                                style={{ minHeight: "200px" }}
                            >
                                <TabsContent
                                    value="grid"
                                    activeValue={view}
                                    className="mt-0"
                                >
                                    {filteredProducts &&
                                    filteredProducts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredProducts.map(
                                                (product, index) => (
                                                    <motion.div
                                                        key={product.product_id}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: index * 0.05,
                                                        }}
                                                    >
                                                        <Card
                                                            ref={(el) =>
                                                                (gridItemsRef.current[
                                                                    index
                                                                ] = el)
                                                            }
                                                            className="bg-white dark:bg-slate-900 border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full"
                                                            onMouseEnter={(e) =>
                                                                animateHover(
                                                                    e.currentTarget,
                                                                    true
                                                                )
                                                            }
                                                            onMouseLeave={(e) =>
                                                                animateHover(
                                                                    e.currentTarget,
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <div className="flex justify-between items-start p-5 pb-3">
                                                                <div className="flex gap-3 items-start">
                                                                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                                                        <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                                                                            {product.product &&
                                                                            Array.isArray(
                                                                                product.product
                                                                            ) &&
                                                                            product
                                                                                .product
                                                                                .length >
                                                                                0
                                                                                ? product
                                                                                      .product[0]
                                                                                      .name ||
                                                                                  t(
                                                                                      "Unnamed Product"
                                                                                  )
                                                                                : t(
                                                                                      "Unnamed Product"
                                                                                  )}
                                                                        </h3>
                                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                            {t(
                                                                                "ID"
                                                                            )}
                                                                            :{" "}
                                                                            {
                                                                                product.product_id
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-medium border-0">
                                                                    {product.product &&
                                                                    Array.isArray(
                                                                        product.product
                                                                    ) &&
                                                                    product
                                                                        .product
                                                                        .length >
                                                                        0
                                                                        ? product
                                                                              .product[0]
                                                                              .type ||
                                                                          t(
                                                                              "Item"
                                                                          )
                                                                        : t(
                                                                              "Item"
                                                                          )}
                                                                </Badge>
                                                            </div>

                                                            <CardContent className="px-5 pt-0 pb-3">
                                                                <div className="mt-3 flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                    <div>
                                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                            {t(
                                                                                "Stock"
                                                                            )}
                                                                        </p>
                                                                        <p
                                                                            className={`text-xl font-bold ${
                                                                                product.net_quantity <
                                                                                10
                                                                                    ? "text-amber-600 dark:text-amber-500"
                                                                                    : "text-emerald-600 dark:text-emerald-400"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                product.net_quantity
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                            {t(
                                                                                "Price"
                                                                            )}
                                                                        </p>
                                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                            $
                                                                            {
                                                                                product.income_price
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 grid grid-cols-2 gap-2">
                                                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                            {t(
                                                                                "Incoming"
                                                                            )}
                                                                        </p>
                                                                        <p className="text-sm font-medium text-emerald-600">
                                                                            {
                                                                                product.income_quantity
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                            {t(
                                                                                "Outgoing"
                                                                            )}
                                                                        </p>
                                                                        <p className="text-sm font-medium text-rose-600">
                                                                            {
                                                                                product.outcome_quantity
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 grid grid-cols-2 gap-2">
                                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                        <Tag className="h-3 w-3" />
                                                                        {t(
                                                                            "Barcode"
                                                                        )}
                                                                        :{" "}
                                                                        {product.product &&
                                                                        Array.isArray(
                                                                            product.product
                                                                        ) &&
                                                                        product
                                                                            .product
                                                                            .length >
                                                                            0
                                                                            ? product
                                                                                  .product[0]
                                                                                  .barcode ||
                                                                              t(
                                                                                  "N/A"
                                                                              )
                                                                            : t(
                                                                                  "N/A"
                                                                              )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 justify-end">
                                                                        <Clock className="h-3 w-3" />
                                                                        {new Date(
                                                                            product.created_at
                                                                        ).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                            </CardContent>

                                                            <CardFooter className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 px-2 h-8"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                    <span>
                                                                        {t(
                                                                            "View"
                                                                        )}
                                                                    </span>
                                                                </Button>
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 w-8 h-8 p-0"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8"
                                                                    >
                                                                        {t(
                                                                            "Details"
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </CardFooter>
                                                        </Card>
                                                    </motion.div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center"
                                        >
                                            <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                <Package className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                                {t("No products found")}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                                {searchTerm
                                                    ? t(
                                                          "Try adjusting your search criteria or check for typos."
                                                      )
                                                    : t(
                                                          "No products have been added yet. Add your first product to get started."
                                                      )}
                                            </p>
                                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                                <Plus className="h-4 w-4 mr-2" />
                                                {t("Add First Product")}
                                            </Button>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent
                                    value="list"
                                    activeValue={view}
                                    className="mt-0"
                                >
                                    {filteredProducts &&
                                    filteredProducts.length > 0 ? (
                                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-5 py-3 grid grid-cols-12 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                <div className="col-span-4 md:col-span-5 lg:col-span-4 flex items-center gap-2">
                                                    <span>
                                                        {t("Product Name")}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden md:flex items-center justify-center">
                                                    <span>{t("Type")}</span>
                                                </div>
                                                <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center hidden md:flex items-center justify-center">
                                                    <span>{t("Stock")}</span>
                                                </div>
                                                <div className="col-span-6 md:col-span-2 lg:col-span-2 text-center flex items-center justify-center">
                                                    <span>{t("Price")}</span>
                                                </div>
                                                <div className="col-span-2 md:col-span-1 lg:col-span-2 text-right">
                                                    <span>{t("Actions")}</span>
                                                </div>
                                            </div>
                                            <div>
                                                {filteredProducts.map(
                                                    (product, index) => (
                                                        <motion.div
                                                            key={
                                                                product.product_id
                                                            }
                                                            initial={{
                                                                opacity: 0,
                                                                y: 10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                                delay:
                                                                    index *
                                                                    0.03,
                                                            }}
                                                            ref={(el) =>
                                                                (listItemsRef.current[
                                                                    index
                                                                ] = el)
                                                            }
                                                            className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 grid grid-cols-12 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                                                        >
                                                            <div className="col-span-4 md:col-span-5 lg:col-span-4 flex items-center gap-3">
                                                                <div className="h-9 w-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                                    <Package className="h-5 w-5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h3 className="font-medium text-slate-900 dark:text-white truncate">
                                                                        {product.product &&
                                                                        Array.isArray(
                                                                            product.product
                                                                        ) &&
                                                                        product
                                                                            .product
                                                                            .length >
                                                                            0
                                                                            ? product
                                                                                  .product[0]
                                                                                  .name ||
                                                                              t(
                                                                                  "Unnamed Product"
                                                                              )
                                                                            : t(
                                                                                  "Unnamed Product"
                                                                              )}
                                                                    </h3>
                                                                    <div className="mt-0.5 md:hidden">
                                                                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                                            <Tag className="h-3 w-3 mr-1" />
                                                                            {product.product &&
                                                                            Array.isArray(
                                                                                product.product
                                                                            ) &&
                                                                            product
                                                                                .product
                                                                                .length >
                                                                                0
                                                                                ? product
                                                                                      .product[0]
                                                                                      .type ||
                                                                                  t(
                                                                                      "Item"
                                                                                  )
                                                                                : t(
                                                                                      "Item"
                                                                                  )}
                                                                        </div>
                                                                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                                            <Layers className="h-3 w-3 mr-1" />
                                                                            {t(
                                                                                "Stock"
                                                                            )}
                                                                            :{" "}
                                                                            {product.net_quantity ||
                                                                                0}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center hidden md:block text-sm text-slate-700 dark:text-slate-300">
                                                                {product.product &&
                                                                Array.isArray(
                                                                    product.product
                                                                ) &&
                                                                product.product
                                                                    .length > 0
                                                                    ? product
                                                                          .product[0]
                                                                          .type ||
                                                                      t("Item")
                                                                    : t("Item")}
                                                            </div>
                                                            <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center hidden md:block">
                                                                <Badge
                                                                    className={`${
                                                                        product.net_quantity <
                                                                        10
                                                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                                                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                                    }`}
                                                                >
                                                                    {
                                                                        product.net_quantity
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <div className="col-span-6 md:col-span-2 lg:col-span-2 text-center font-medium text-emerald-600 dark:text-emerald-400">
                                                                $
                                                                {
                                                                    product.income_price
                                                                }
                                                            </div>
                                                            <div className="col-span-2 md:col-span-1 lg:col-span-2 flex justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 bg-white dark:bg-transparent dark:text-slate-400 dark:border-slate-700 text-slate-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <span>
                                                                        {t(
                                                                            "Details"
                                                                        )}
                                                                    </span>
                                                                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                )}
                                            </div>
                                        </Card>
                                    ) : (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center"
                                        >
                                            <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                <Package className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                                {t("No products found")}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                                {searchTerm
                                                    ? t(
                                                          "Try adjusting your search criteria or check for typos."
                                                      )
                                                    : t(
                                                          "No products have been added yet. Add your first product to get started."
                                                      )}
                                            </p>
                                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                                <Plus className="h-4 w-4 mr-2" />
                                                {t("Add First Product")}
                                            </Button>
                                        </motion.div>
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
