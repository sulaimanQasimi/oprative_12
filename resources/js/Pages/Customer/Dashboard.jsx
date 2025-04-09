import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import {
    ShoppingCart,
    Package,
    FileText,
    DollarSign,
    BarChart,
    CreditCard,
    Calendar
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

// PageLoader component copied from Income.jsx
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
                            <ShoppingCart className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function CustomerDashboard({ auth }) {
    const [stats, setStats] = useState({
        totalOrders: 42,
        pendingOrders: 7,
        totalSales: 15000,
        totalAccounts: 12,
        stockItems: 156,
    });

    const [isLoading, setIsLoading] = useState(true);

    // Data for charts
    const salesData = [
        { month: 'Jan', value: 2400 },
        { month: 'Feb', value: 1398 },
        { month: 'Mar', value: 9800 },
        { month: 'Apr', value: 3908 },
        { month: 'May', value: 4800 },
        { month: 'Jun', value: 3800 },
    ];

    const orderStatusData = [
        { name: 'Pending', value: 7, color: '#FFBB28' },
        { name: 'Processing', value: 15, color: '#00C49F' },
        { name: 'Completed', value: 20, color: '#0088FE' },
    ];

    useEffect(() => {
        // Simulate API loading
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        // You can uncomment this when your API endpoints are ready
        /*
        const fetchDashboardData = async () => {
            try {
                // API calls go here
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
        */
    }, []);

    // Stat Card component
    const StatCard = ({ icon, title, value, bgColor }) => (
        <div className={`p-6 rounded-lg shadow-md ${bgColor} text-white`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-75">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                    {icon}
                </div>
            </div>
        </div>
    );

    // Simple bar chart component
    const SimpleBarChart = ({ data }) => {
        const maxValue = Math.max(...data.map(item => item.value));

        return (
            <div className="flex h-64 items-end justify-around px-4">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="flex flex-col items-center justify-end h-[200px]">
                            <div
                                className="bg-blue-500 w-12 rounded-t-md transition-all duration-500 flex items-end justify-center pb-1 text-white text-xs font-bold"
                                style={{
                                    height: `${(item.value / maxValue) * 180}px`
                                }}
                            >
                                ${item.value.toLocaleString()}
                            </div>
                        </div>
                        <span className="text-xs mt-2 font-medium text-gray-600">{item.month}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Simple status breakdown component
    const StatusBreakdown = ({ data }) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);

        return (
            <div className="space-y-6 pt-4">
                {data.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="font-medium text-gray-900">{item.value} orders ({Math.round(item.value / total * 100)}%)</span>
                        </div>
                        <div className="h-2.5 w-full bg-gray-200 rounded-full">
                            <div
                                className="h-2.5 rounded-full"
                                style={{
                                    width: `${(item.value / total) * 100}%`,
                                    backgroundColor: item.color
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title="Customer Dashboard">
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

            {/* Page Loader */}
            <PageLoader isVisible={isLoading} />

            <CustomerNavbar />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<ShoppingCart className="h-6 w-6 text-white" />}
                        title="Total Orders"
                        value={stats.totalOrders}
                        bgColor="bg-blue-500"
                    />

                    <StatCard
                        icon={<DollarSign className="h-6 w-6 text-white" />}
                        title="Total Sales"
                        value={`$${stats.totalSales.toLocaleString()}`}
                        bgColor="bg-green-500"
                    />

                    <StatCard
                        icon={<Package className="h-6 w-6 text-white" />}
                        title="Stock Items"
                        value={stats.stockItems}
                        bgColor="bg-purple-500"
                    />

                    <StatCard
                        icon={<CreditCard className="h-6 w-6 text-white" />}
                        title="Accounts"
                        value={stats.totalAccounts}
                        bgColor="bg-orange-500"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Sales Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h2>
                        <SimpleBarChart data={salesData} />
                    </div>

                    {/* Order Status Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>
                        <StatusBreakdown data={orderStatusData} />
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                        <a href={route('customer.orders')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View All
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* This would be populated with your actual data */}
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #ORD-123456
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Jun 15, 2023
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        $120.00
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #ORD-123457
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Jun 12, 2023
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            Processing
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        $85.50
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}