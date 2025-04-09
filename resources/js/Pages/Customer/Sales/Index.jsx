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
    Route
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

export default function SalesIndex({ auth, sales = { data: [], links: [], total: 0 }, filters = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isSaleDetailsModalOpen, setIsSaleDetailsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [saleDetails, setSaleDetails] = useState(null);

    const { data, setData, get, processing, errors } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        confirmedByWarehouse: filters.confirmedByWarehouse || '',
        confirmedByShop: filters.confirmedByShop || '',
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
        });
        get(route('customer.sales.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const showSaleDetails = async (saleId) => {
        if (!saleId) return;

        setLoading(true);
        try {
            const response = await fetch(`/customer/sales/${saleId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch sale details');
            }
            const data = await response.json();
            setSaleDetails(data);
            setIsSaleDetailsModalOpen(true);
        } catch (error) {
            console.error('Error fetching sale details:', error);
        } finally {
            setLoading(false);
        }
    };

    const closeSaleDetailsModal = () => {
        setIsSaleDetailsModalOpen(false);
        setSaleDetails(null);
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

    // Ensure sales data is properly structured
    const completedSales = sales?.data?.filter(sale => sale?.status === 'completed')?.length || 0;
    const pendingSales = sales?.data?.filter(sale => sale?.status === 'pending')?.length || 0;

    return (
        <>
            <Head title={t('My Orders')}>
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
                    }

                    html, body {
                        overflow-x: hidden;
                        max-width: 100%;
                    }

                    .responsive-chart-container {
                        max-width: 100%;
                        overflow-x: hidden;
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {/* Total Orders */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t('Total Orders')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sales?.total || 0}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('All time orders')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Completed Orders */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 dark:hover:border-green-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/30 dark:to-emerald-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">{t('Completed Orders')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedSales}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('Successfully delivered')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <PackageCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pending Orders */}
                                    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-amber-100 dark:hover:border-amber-800 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-900/30 dark:to-yellow-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">{t('Pending Orders')}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingSales}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('In transit')}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <Route className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-300">
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                                        <Filter className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                                        {t('Quick Filters')}
                                    </h3>

                                    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Reference')}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Search className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="search"
                                                    value={data.search}
                                                    onChange={e => setData('search', e.target.value)}
                                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    placeholder={t('Search by reference')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Status')}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <select
                                                    name="status"
                                                    value={data.status}
                                                    onChange={e => setData('status', e.target.value)}
                                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                >
                                                    <option value="">{t('All Statuses')}</option>
                                                    <option value="completed">{t('Completed')}</option>
                                                    <option value="pending">{t('Pending')}</option>
                                                    <option value="cancelled">{t('Cancelled')}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Warehouse Confirmation')}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Building2 className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <select
                                                    name="confirmedByWarehouse"
                                                    value={data.confirmedByWarehouse}
                                                    onChange={e => setData('confirmedByWarehouse', e.target.value)}
                                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                >
                                                    <option value="">{t('All')}</option>
                                                    <option value="1">{t('Yes')}</option>
                                                    <option value="0">{t('No')}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Shop Confirmation')}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <select
                                                    name="confirmedByShop"
                                                    value={data.confirmedByShop}
                                                    onChange={e => setData('confirmedByShop', e.target.value)}
                                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                >
                                                    <option value="">{t('All')}</option>
                                                    <option value="1">{t('Yes')}</option>
                                                    <option value="0">{t('No')}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full px-4 py-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white text-sm font-medium rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 relative overflow-hidden group"
                                            >
                                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                                <span className="relative flex items-center justify-center">
                                                    <Search className="h-5 w-5 mr-2 text-white" />
                                                    {t('Search')}
                                                </span>
                                            </button>
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
                                            >
                                                <span className="flex items-center justify-center">
                                                    <RefreshCw className="h-5 w-5 mr-2" />
                                                    {t('Reset')}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Sales Table */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                            <Truck className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                            {t('Your Orders')}
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                    <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Reference')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Date')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Total Amount')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {t('Status')}
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pr-8">
                                                        {t('Actions')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {sales?.data?.map((sale) => (
                                                    <tr key={sale.id} className="hover:bg-indigo-50/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md">
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="mx-6 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                                                                    <Receipt className="h-6 w-6" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-base font-medium text-gray-900">{sale.reference}</div>
                                                                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                                        <User className="h-4 w-4 mr-1 text-gray-400" />
                                                                        {sale.customer?.name || 'N/A'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <div className="text-sm text-gray-900 bg-gray-50 py-1.5 px-3 rounded-md inline-flex items-center float-right">
                                                                <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                                                                {new Date(sale.date).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <div className="text-sm font-mono bg-indigo-50 text-indigo-800 py-1.5 px-3 rounded-md border border-indigo-100 shadow-sm inline-flex items-center float-right">
                                                                <DollarSign className="h-4 w-4 mr-1.5 text-indigo-500" />
                                                                {sale.total}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <div className="flex justify-end">
                                                                {sale.status === 'completed' ? (
                                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm">
                                                                        <span className="flex items-center justify-center h-5 w-5 bg-green-500 rounded-full mr-1.5 shadow-inner">
                                                                            <CheckCircle className="h-3 w-3 text-white" />
                                                                        </span>
                                                                        Completed
                                                                    </span>
                                                                ) : sale.status === 'cancelled' ? (
                                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200 shadow-sm">
                                                                        <span className="flex items-center justify-center h-5 w-5 bg-red-500 rounded-full mr-1.5 shadow-inner">
                                                                            <XCircle className="h-3 w-3 text-white" />
                                                                        </span>
                                                                        Cancelled
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-3.5 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200 shadow-sm">
                                                                        <span className="flex items-center justify-center h-5 w-5 bg-amber-500 rounded-full mr-1.5 shadow-inner">
                                                                            <Clock className="h-3 w-3 text-white" />
                                                                        </span>
                                                                        Pending
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-right">
                                                            <button
                                                                onClick={() => showSaleDetails(sale.id)}
                                                                className="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg overflow-hidden"
                                                            >
                                                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                                <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                                                <span className="absolute left-0 inset-y-0 flex items-center pl-3 relative">
                                                                    <Eye className="h-4 w-4 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                                                </span>
                                                                <span className="pl-6 relative">{t('View Details')}</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="px-8 py-6 border-t border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                                        {/* RTL Pagination */}
                                        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 rtl:flex-row-reverse">
                                            {/* Records Info */}
                                            <div className="text-sm text-gray-600 rtl:text-right">
                                                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                                                    <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md rtl:font-semibold">
                                                        RTL {t('Support')}
                                                    </span>
                                                    {sales?.total > 0 ? (
                                                        <p>
                                                            {t('Showing')} <span className="font-medium text-indigo-600">{sales.from}</span> {t('to')}{' '}
                                                            <span className="font-medium text-indigo-600">{sales.to}</span> {t('of')}{' '}
                                                            <span className="font-medium text-indigo-600">{sales.total}</span> {t('records')}
                                                        </p>
                                                    ) : (
                                                        <p>{t('No records found')}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pagination Controls */}
                                            {sales?.links && sales.links.length > 3 && (
                                                <div className="flex items-center justify-center rtl:flex-row-reverse">
                                                    <nav
                                                        className="relative z-0 inline-flex rounded-xl shadow-md -space-x-px rtl:space-x-reverse overflow-hidden"
                                                        aria-label="Pagination"
                                                        style={{ boxShadow: '0 4px 20px -2px rgba(103, 58, 183, 0.15)' }}
                                                    >
                                                        {/* First Page Button */}
                                                        <Link
                                                            href={sales.first_page_url}
                                                            className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium ${
                                                                sales.current_page === 1
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                                                            } transition-colors duration-200 ease-in-out rtl:rotate-180 border-r border-indigo-100 rtl:border-r-0 rtl:border-l`}
                                                            disabled={sales.current_page === 1}
                                                        >
                                                            <span className="sr-only">{t('First Page')}</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>

                                                        {/* Previous Page Button */}
                                                        <Link
                                                            href={sales.prev_page_url}
                                                            className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium ${
                                                                sales.prev_page_url === null
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                                                            } transition-colors duration-200 ease-in-out rtl:rotate-180 border-r border-indigo-100 rtl:border-r-0 rtl:border-l`}
                                                            disabled={sales.prev_page_url === null}
                                                        >
                                                            <span className="sr-only">{t('Previous')}</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>

                                                        {/* Page Numbers */}
                                                        {sales.links.slice(1, -1).map((link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                                className={`relative inline-flex items-center px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-in-out border-r border-indigo-100 rtl:border-r-0 rtl:border-l ${
                                                                    link.active
                                                                        ? 'z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md transform scale-105'
                                                                        : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                                                }`}
                                                            >
                                                                {link.label.replace(/&laquo;|&raquo;/g, '')}
                                                                {link.active && (
                                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full transform translate-y-1/2 opacity-60"></span>
                                                                )}
                                                            </Link>
                                                        ))}

                                                        {/* Next Page Button */}
                                                        <Link
                                                            href={sales.next_page_url}
                                                            className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium ${
                                                                sales.next_page_url === null
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                                                            } transition-colors duration-200 ease-in-out rtl:rotate-180 border-r border-indigo-100 rtl:border-r-0 rtl:border-l`}
                                                            disabled={sales.next_page_url === null}
                                                        >
                                                            <span className="sr-only">{t('Next')}</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>

                                                        {/* Last Page Button */}
                                                        <Link
                                                            href={sales.last_page_url}
                                                            className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium ${
                                                                sales.current_page === sales.last_page
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                                                            } transition-colors duration-200 ease-in-out rtl:rotate-180`}
                                                            disabled={sales.current_page === sales.last_page}
                                                        >
                                                            <span className="sr-only">{t('Last Page')}</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    </nav>
                                                </div>
                                            )}
                                        </div>

                                        {/* Page Selection Dropdown - For Mobile */}
                                        {sales.last_page > 1 && (
                                            <div className="mt-4 sm:hidden">
                                                <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
                                                    <div className="text-sm text-gray-600">{t('Go to page')}:</div>
                                                    <select
                                                        value={sales.current_page}
                                                        onChange={(e) => {
                                                            const page = parseInt(e.target.value);
                                                            window.location.href = route('customer.sales.index', {
                                                                ...filters,
                                                                page,
                                                            });
                                                        }}
                                                        className="form-select block w-full md:w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    >
                                                        {[...Array(sales.last_page)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>
                                                                {i + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Sale Details Modal */}
            {isSaleDetailsModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-opacity duration-300">
                    <div className="relative top-20 mx-auto p-0 border-0 max-w-5xl shadow-2xl rounded-xl bg-white overflow-hidden transform transition-all duration-300">
                        {loading ? (
                            <div className="py-20">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
                                    <p className="text-gray-500 text-lg">{t('Loading sale details...')}</p>
                                </div>
                            </div>
                        ) : saleDetails ? (
                            <div>
                                {/* Header with gradient background */}
                                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-6 px-8 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4 backdrop-blur-sm">
                                            <Receipt className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{t('Sale #')}{saleDetails.reference}</h3>
                                            <p className="text-indigo-100 flex items-center mt-1">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(saleDetails.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                if (saleDetails.status === 'pending') {
                                                    showPaymentModal(saleDetails);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium mr-2 ${
                                                saleDetails.status === 'pending'
                                                    ? 'bg-white text-indigo-700 hover:bg-indigo-50 transition-colors duration-200'
                                                    : 'bg-white bg-opacity-20 text-white cursor-not-allowed'
                                            }`}
                                            disabled={saleDetails.status !== 'pending'}
                                        >
                                            <DollarSign className="h-4 w-4 mr-1" />
                                            {t('Add Payment')}
                                        </button>
                                        <button
                                            onClick={closeSaleDetailsModal}
                                            className="bg-transparent text-white hover:bg-white hover:bg-opacity-10 rounded-full p-2 transition-colors duration-200"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-8 py-6">
                                    {/* Status Bar */}
                                    <div className="mb-6 flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${
                                                saleDetails.status === 'completed' ? 'bg-green-500' :
                                                saleDetails.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                                            }`}></div>
                                            <span className="text-sm font-medium capitalize">
                                                {t('Status')}: {saleDetails.status}
                                            </span>
                                        </div>
                                        <div className="flex space-x-6">
                                            <div className="flex items-center">
                                                <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                                                <span className={`text-sm font-medium ${saleDetails.confirmed_by_warehouse ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {t('Warehouse')}: {saleDetails.confirmed_by_warehouse ? t('Confirmed') : t('Pending')}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <ShoppingBag className="h-5 w-5 mr-2 text-gray-400" />
                                                <span className={`text-sm font-medium ${saleDetails.confirmed_by_shop ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {t('Shop')}: {saleDetails.confirmed_by_shop ? t('Confirmed') : t('Pending')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{t('Total Amount')}</h4>
                                                <div className="bg-indigo-100 rounded-full p-1.5">
                                                    <DollarSign className="h-4 w-4 text-indigo-600" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                                {saleDetails.total} {saleDetails.currency?.symbol}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xs font-semibold text-green-600 uppercase tracking-wider">{t('Paid Amount')}</h4>
                                                <div className="bg-green-100 rounded-full p-1.5">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                                {saleDetails.paid_amount} {saleDetails.currency?.symbol}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{t('Due Amount')}</h4>
                                                <div className="bg-amber-100 rounded-full p-1.5">
                                                    <Clock className="h-4 w-4 text-amber-600" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                                {saleDetails.due_amount} {saleDetails.currency?.symbol}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer with actions */}
                                    <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                                        <button
                                            onClick={closeSaleDetailsModal}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            {t('Close')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

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
        </>
    );
}
