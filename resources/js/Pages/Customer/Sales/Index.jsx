import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { motion } from 'framer-motion';
import {
    Package,
    Search,
    RefreshCw,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    DollarSign,
    Building2,
    ShoppingBag,
    FileText,
    Filter,
    ChevronDown,
    Mail,
    User,
    Receipt,
    CreditCard,
    Wallet,
    ArrowDownRight,
    ArrowUpRight,
    CircleDollarSign,
    BanknoteIcon,
    ReceiptText,
    ArrowRightLeft,
    Truck,
    PackageCheck,
    PackageX,
    PackageOpen,
    Warehouse,
    Box,
    MapPin,
    Route,
    Plus,
    Minus,
    AlertTriangle,
    TrendingDown,
    Download,
    Upload,
    ExternalLink,
    Globe,
    Ship,
    Plane,
    Container,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
// Import the lottie player package
import '@lottiefiles/lottie-player';

// Create a React wrapper component for the lottie-player web component
const LottiePlayer = ({ src, background = "transparent", speed = "1", style, loop = true, autoplay = true }) => {
    useEffect(() => {
        // Ensure the web component is properly defined
        if (typeof document !== 'undefined') {
            import('@lottiefiles/lottie-player');
        }
    }, []);

    return React.createElement('lottie-player', {
        src,
        background,
        speed,
        style,
        loop: loop ? '' : null,
        autoplay: autoplay ? '' : null
    });
};

// PageLoader component
const PageLoader = ({ isVisible }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 z-50 flex flex-col items-center justify-center overflow-hidden"
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
                        className="absolute bg-gradient-to-r from-blue-400/10 via-indigo-500/10 to-transparent h-[30vh] w-[100vw]"
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
                        className="absolute w-64 h-64 rounded-full bg-blue-600/5 filter blur-2xl"
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
                        className="absolute w-72 h-72 rounded-full bg-indigo-500/5 filter blur-2xl transform -translate-x-4 translate-y-4"
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
                            className="absolute h-full w-full rounded-full border-4 border-blue-300/10"
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
                            className="absolute h-[85%] w-[85%] rounded-full border-4 border-indigo-400/20"
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
                            className="absolute h-[70%] w-[70%] rounded-full border-4 border-blue-400/30"
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
                            className="absolute h-full w-full rounded-full border-4 border-r-blue-400 border-t-transparent border-l-transparent border-b-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute h-full w-full rounded-full border-4 border-b-indigo-400 border-t-transparent border-l-transparent border-r-transparent"
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
                            className="relative z-10 bg-gradient-to-br from-blue-500 to-indigo-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl"
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
                            <Truck className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function SalesIndex({ 
    auth, 
    sales = { data: [], links: [], total: 0 }, 
    filters = {},
    products = [],
    statistics = {}
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Ensure sales data is properly structured
    const safeSales = {
        data: Array.isArray(sales?.data) ? sales.data : [],
        links: Array.isArray(sales?.links) ? sales.links : [],
        total: parseInt(sales?.total) || 0,
        from: parseInt(sales?.from) || 0,
        to: parseInt(sales?.to) || 0,
        current_page: parseInt(sales?.current_page) || 1,
        last_page: parseInt(sales?.last_page) || 1,
        ...sales
    };

    const { data, setData, get, processing, errors } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        confirmedByWarehouse: filters.confirmedByWarehouse || '',
        confirmedByShop: filters.confirmedByShop || '',
        confirmedByStoreByWarehouse: filters.confirmedByStoreByWarehouse || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('customer.sales.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            status: '',
            confirmedByWarehouse: '',
            confirmedByShop: '',
            confirmedByStoreByWarehouse: '',
            date_from: '',
            date_to: '',
        });
        get(route('customer.sales.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const showPaymentModal = (sale) => {
        if (!sale) return;
        setSelectedSale(sale);
        setIsPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedSale(null);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSale?.id) return;

        try {
            const response = await fetch(`/customer/sales/${selectedSale.id}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    paymentAmount: e.target.paymentAmount.value,
                    paymentDate: e.target.paymentDate.value,
                    paymentNotes: e.target.paymentNotes.value,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit payment');
            }

            closePaymentModal();
            window.location.reload();
        } catch (error) {
            console.error('Error adding payment:', error);
        }
    };

    // Calculate statistics
    const confirmedByShop = safeSales?.data?.filter(sale => sale?.confirmed_by_shop)?.length || 0;
    const pendingByShop = safeSales?.data?.filter(sale => !sale?.confirmed_by_shop)?.length || 0;
    const confirmedByStoreByWarehouse = safeSales?.data?.filter(sale => sale?.confirmed_by_store_by_warehouse)?.length || 0;

    return (
        <>
            <Head title={t('My Orders')}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer { animation: shimmer 3s infinite; }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
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
                    }

                    html, body {
                        overflow-x: hidden;
                        max-width: 100%;
                    }

                    .responsive-chart-container {
                        max-width: 100%;
                        overflow-x: hidden;
                    }

                    /* Dark mode fixes for cards */
                    .dark .bg-white {
                        background-color: rgb(15 23 42) !important;
                    }

                    .dark .border-gray-100 {
                        border-color: rgb(51 65 85) !important;
                    }

                    .dark .text-gray-900 {
                        color: rgb(248 250 252) !important;
                    }

                    .dark .text-gray-700 {
                        color: rgb(203 213 225) !important;
                    }

                    .dark .text-gray-500 {
                        color: rgb(148 163 184) !important;
                    }

                    .dark .text-gray-400 {
                        color: rgb(148 163 184) !important;
                    }

                    .dark .bg-gray-50 {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .bg-gray-100 {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .border-gray-200 {
                        border-color: rgb(51 65 85) !important;
                    }

                    .dark .border-gray-300 {
                        border-color: rgb(71 85 105) !important;
                    }

                    .dark .divide-gray-200 {
                        border-color: rgb(51 65 85) !important;
                    }

                    .dark .divide-gray-100 {
                        border-color: rgb(51 65 85) !important;
                    }

                    .dark .hover\:bg-gray-50:hover {
                        background-color: rgb(30 41 59) !important;
                    }

                    .dark .hover\:border-gray-300:hover {
                        border-color: rgb(71 85 105) !important;
                    }

                    .dark .focus\:border-gray-300:focus {
                        border-color: rgb(71 85 105) !important;
                    }

                    .dark .focus\:ring-gray-200:focus {
                        --tw-ring-color: rgb(51 65 85) !important;
                    }

                    .dark .shadow-md {
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2) !important;
                    }

                    .dark .shadow-lg {
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3) !important;
                    }

                    /* Additional dark mode fixes */
                    .dark .bg-white\/80 {
                        background-color: rgba(15, 23, 42, 0.8) !important;
                    }

                    .dark .bg-white\/10 {
                        background-color: rgba(15, 23, 42, 0.1) !important;
                    }

                    .dark .border-white\/20 {
                        border-color: rgba(255, 255, 255, 0.2) !important;
                    }

                    .dark .border-white\/30 {
                        border-color: rgba(255, 255, 255, 0.3) !important;
                    }

                    .dark .text-white\/80 {
                        color: rgba(255, 255, 255, 0.8) !important;
                    }

                    .dark .text-white\/10 {
                        color: rgba(255, 255, 255, 0.1) !important;
                    }

                    /* Ensure all form elements have proper dark mode styling */
                    .dark input[type="text"],
                    .dark input[type="email"],
                    .dark input[type="password"],
                    .dark input[type="number"],
                    .dark input[type="tel"],
                    .dark input[type="url"],
                    .dark input[type="search"],
                    .dark select,
                    .dark textarea {
                        background-color: rgb(30, 41, 59) !important;
                        border-color: rgb(51, 65, 85) !important;
                        color: rgb(248, 250, 252) !important;
                    }

                    .dark input[type="text"]:focus,
                    .dark input[type="email"]:focus,
                    .dark input[type="password"]:focus,
                    .dark input[type="number"]:focus,
                    .dark input[type="tel"]:focus,
                    .dark input[type="url"]:focus,
                    .dark input[type="search"]:focus,
                    .dark select:focus,
                    .dark textarea:focus {
                        border-color: rgb(99, 102, 241) !important;
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
                    }

                    .dark input::placeholder,
                    .dark textarea::placeholder {
                        color: rgb(148, 163, 184) !important;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.sales.index"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("My Orders")}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Hero Section with Gradient Background */}
                                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-10 mb-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-pink-400 to-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-20 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                                {t('Sales Management')}
                                            </h1>
                                            <p className="text-indigo-100 text-lg max-w-2xl">
                                                {t('Manage and track your sales transactions securely in one place.')}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <Truck className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                    {/* Total Orders */}
                                    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-700 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t('Total Orders')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{safeSales?.total || 0}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('All time orders')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Confirmed by Shop */}
                                    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 dark:hover:border-green-700 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/30 dark:to-emerald-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">{t('Confirmed by Shop')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{confirmedByShop}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Shop confirmed')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pending by Shop */}
                                    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-amber-100 dark:hover:border-amber-700 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-900/30 dark:to-yellow-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">{t('Pending by Shop')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingByShop}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Awaiting shop confirmation')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Confirmed by Store by Warehouse */}
                                    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 dark:hover:border-purple-700 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-900/30 dark:to-violet-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">{t('Confirmed by Store by Warehouse')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{confirmedByStoreByWarehouse}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Fully confirmed')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900 dark:to-violet-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filters Section */}
                                <div className="mb-6 bg-gradient-to-br from-white/80 to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/50 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                                    <div className="p-4 border-b border-indigo-100/50 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
                                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <div className="p-2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                </svg>
                                            </div>
                                            {t('Filters')}
                                        </h3>
                                        <button 
                                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                            className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 hover:text-indigo-700 transition-all duration-200 group"
                                        >
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 transform transition-transform duration-300 ${showAdvancedFilters ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                    {showAdvancedFilters && (
                                        <div className="p-6 space-y-6 bg-gradient-to-br from-white to-indigo-50/30">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                                {/* Date Range Filter */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {t('Date Range')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.date_from && data.date_to ? 'custom' : 'all'}
                                                            onChange={(e) => {
                                                                if (e.target.value === 'all') {
                                                                    setData('date_from', '');
                                                                    setData('date_to', '');
                                                                }
                                                            }}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value="all">{t('All Time')}</option>
                                                            <option value="today">{t('Today')}</option>
                                                            <option value="week">{t('This Week')}</option>
                                                            <option value="month">{t('This Month')}</option>
                                                            <option value="year">{t('This Year')}</option>
                                                            <option value="custom">{t('Custom Range')}</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reference Number Search */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                        {t('Reference Number')}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={data.search}
                                                            onChange={(e) => setData('search', e.target.value)}
                                                            placeholder={t('Search by reference number...')}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200"
                                                        />
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <div className="p-1.5 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Filter */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        {t('Status')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.status}
                                                            onChange={(e) => setData('status', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value="">{t('All Statuses')}</option>
                                                            <option value="completed">{t('Completed')}</option>
                                                            <option value="pending">{t('Pending')}</option>
                                                            <option value="cancelled">{t('Cancelled')}</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Warehouse Confirmation */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        {t('Warehouse Confirmation')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.confirmedByWarehouse}
                                                            onChange={(e) => setData('confirmedByWarehouse', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value="">{t('All')}</option>
                                                            <option value="1">{t('Yes')}</option>
                                                            <option value="0">{t('No')}</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Shop Confirmation */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                        {t('Shop Confirmation')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.confirmedByShop}
                                                            onChange={(e) => setData('confirmedByShop', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value="">{t('All')}</option>
                                                            <option value="1">{t('Yes')}</option>
                                                            <option value="0">{t('No')}</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Confirmed by Store by Warehouse */}
                                                <div className="group">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        {t('Confirmed by Store by Warehouse')}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data.confirmedByStoreByWarehouse}
                                                            onChange={(e) => setData('confirmedByStoreByWarehouse', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200 text-gray-700"
                                                        >
                                                            <option value="">{t('All')}</option>
                                                            <option value="1">{t('Yes')}</option>
                                                            <option value="0">{t('No')}</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Custom Date Range (shown when custom is selected) */}
                                            {(data.date_from || data.date_to) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="group">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {t('From Date')}
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={data.date_from}
                                                            onChange={(e) => setData('date_from', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200"
                                                        />
                                                    </div>
                                                    <div className="group">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {t('To Date')}
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={data.date_to}
                                                            onChange={(e) => setData('date_to', e.target.value)}
                                                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pl-4 pr-4 py-3 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2 inline" />
                                                    {t('Reset')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={processing}
                                                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                                >
                                                    <Search className="h-4 w-4 mr-2 inline" />
                                                    {t('Apply Filters')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sales Table */}
                                <div className="overflow-x-auto rounded-xl shadow-sm">
                                    {safeSales.data.length === 0 ? (
                                        <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <p className="text-lg">
                                                {t('No sales found matching your criteria.')}
                                            </p>
                                            <p className="text-sm mt-2">
                                                {t('Try changing your filters or search parameters.')}
                                            </p>
                                        </div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-xl overflow-hidden border-collapse">
                                            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                                                />
                                                            </svg>
                                                            {t('Reference')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            {t('Date')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            {t('Total Amount')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                                />
                                                            </svg>
                                                            {t('Confirmed by Store')}
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end group relative">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                                />
                                                            </svg>
                                                            {t('Confirmed by Store by Warehouse')}
                                                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap z-10">
                                                                {t('Both warehouse and shop have confirmed')}
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center justify-end">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                            </svg>
                                                            {t('Actions')}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {safeSales.data.map((sale, index) => (
                                                    <tr
                                                        key={sale.id}
                                                        className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                                                        style={{
                                                            animation: `fadeIn 0.5s ease-out ${
                                                                index * 0.1
                                                            }s both`,
                                                        }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <div className="flex items-center justify-end">
                                                                <div className="flex items-center">
                                                                    <div className="mx-3 flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                                                                        <Receipt className="h-5 w-5" />
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <div className="text-sm font-medium text-gray-900">{sale.reference}</div>
                                                                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                                                                            <User className="h-3 w-3 mr-1 text-gray-400" />
                                                                            {sale.customer?.name || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center justify-end">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-indigo-400 group-hover:text-indigo-500"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                                <span className="text-green-600 font-medium">
                                                                    {new Intl.DateTimeFormat('fa-IR', {
                                                                        year: 'numeric',
                                                                        month: '2-digit',
                                                                        day: 'numeric',
                                                                        calendar: 'persian',
                                                                        numberingSystem: 'arab'
                                                                    }).format(new Date(sale.date))}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center justify-end">
                                                                <span className="bg-green-100 text-green-700 py-1 px-2.5 rounded-lg group-hover:bg-green-200 transition-colors duration-150">
                                                                    {sale.total}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex justify-end">
                                                                {sale.confirmed_by_shop ? (
                                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm">
                                                                        <span className="flex items-center justify-center h-5 w-5 bg-green-500 rounded-full mr-1.5 shadow-inner">
                                                                            <CheckCircle className="h-3 w-3 text-white" />
                                                                        </span>
                                                                        {t('Confirmed')}
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border border-gray-200 shadow-sm">
                                                                        <span className="flex items-center justify-center h-5 w-5 bg-gray-500 rounded-full mr-1.5 shadow-inner">
                                                                            <Clock className="h-3 w-3 text-white" />
                                                                        </span>
                                                                        {t('Pending')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex justify-end">
                                                                {sale.confirmed_by_store_by_warehouse ? (
                                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm">
                                                                        <span className="flex items-center justify-center h-5 w-5 bg-green-500 rounded-full mr-1.5 shadow-inner">
                                                                            <CheckCircle className="h-3 w-3 text-white" />
                                                                        </span>
                                                                        {t('Confirmed')}
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border border-gray-200 shadow-sm">
                                                                        <span className="flex items-center justify-center h-5 w-5 bg-gray-500 rounded-full mr-1.5 shadow-inner">
                                                                            <Clock className="h-3 w-3 text-white" />
                                                                        </span>
                                                                        {t('Pending')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                            <Link
                                                                href={route('customer.sales.show', sale.id)}
                                                                className="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg overflow-hidden"
                                                            >
                                                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                                <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                                                <span className="absolute left-0 inset-y-0 flex items-center pl-3 relative">
                                                                    <Eye className="h-4 w-4 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                                                </span>
                                                                <span className="pl-6 relative">{t('View Details')}</span>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {safeSales.links && safeSales.links.length > 3 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex flex-col items-center space-y-4"
                                    >
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {t("Showing")} {safeSales.from || 0} {t("to")} {safeSales.to || 0} {t("of")} {safeSales.total || 0} {t("results")}
                                        </div>
                                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100 dark:border-green-900/30">
                                            {/* Previous Page */}
                                            <button
                                                onClick={() => {
                                                    const prevPage = safeSales.current_page - 1;
                                                    if (prevPage >= 1) {
                                                        get(route('customer.sales.index', { page: prevPage }), {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                disabled={!safeSales.links || safeSales.current_page <= 1}
                                                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                    safeSales.links && safeSales.current_page > 1
                                                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                                <span className="ml-1 hidden sm:inline">{t('Previous')}</span>
                                            </button>

                                            {/* Page Numbers */}
                                            {safeSales.links && safeSales.links.slice(1, -1).map((link, index) => {
                                                if (link.url === null) {
                                                    return (
                                                        <span key={index} className="px-3 py-2 text-gray-400">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                
                                                const pageNum = link.label;
                                                const isActive = link.active;
                                                
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            const url = new URL(link.url);
                                                            const page = url.searchParams.get('page');
                                                            if (page) {
                                                                get(route('customer.sales.index', { page }), {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                });
                                                            }
                                                        }}
                                                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                            isActive
                                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            {/* Next Page */}
                                            <button
                                                onClick={() => {
                                                    const nextPage = safeSales.current_page + 1;
                                                    if (nextPage <= safeSales.last_page) {
                                                        get(route('customer.sales.index', { page: nextPage }), {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                disabled={!safeSales.links || safeSales.current_page >= safeSales.last_page}
                                                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                                    safeSales.links && safeSales.current_page < safeSales.last_page
                                                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <span className="mr-1 hidden sm:inline">{t('Next')}</span>
                                                <ChevronRight className="h-4 w-4 rotate-180" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && selectedSale && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-6 border w-1/2 shadow-xl rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                <BanknoteIcon className="h-6 w-6 mr-2 text-indigo-600" />
                                {t('Add Payment')}
                            </h3>
                            <button
                                onClick={closePaymentModal}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <input type="hidden" name="saleId" value={selectedSale.id} />
                            <div>
                                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                                    {t('Amount')}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="paymentAmount"
                                    name="paymentAmount"
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                                    {t('Date')}
                                </label>
                                <input
                                    type="date"
                                    id="paymentDate"
                                    name="paymentDate"
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="paymentNotes" className="block text-sm font-medium text-gray-700">
                                    {t('Notes')}
                                </label>
                                <textarea
                                    id="paymentNotes"
                                    name="paymentNotes"
                                    rows="3"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closePaymentModal}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    {t('Submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `,
                }}
            />
        </>
    );
}
