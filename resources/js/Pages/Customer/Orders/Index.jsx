import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import OrderList from './Components/OrderList';
import OrderDetails from './Components/OrderDetails';
import OrderFilters from './Components/OrderFilters';
import OrderStats from './Components/OrderStats';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { motion } from 'framer-motion';
import {
    ShoppingCart, Calendar, Package, Clock, RefreshCw,
    Plus, ChevronRight, Check, Filter, BarChart3
} from 'lucide-react';

export default function Index({ auth }) {
    const { t } = useLaravelReactI18n();

    // State management
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 4,
        total: 0
    });
    const [stats, setStats] = useState({
        total_orders: 0,
        total_amount: 0,
        pending_orders: 0,
        completed_orders: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [filters, setFilters] = useState({
        searchQuery: '',
        statusFilter: 'all',
        dateRange: 'all',
        sortField: 'created_at',
        sortDirection: 'desc',
        page: 1
    });
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);

    // Fetch orders data based on current filters
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('customer.api.orders.index'), {
                params: {
                    search: filters.searchQuery,
                    status: filters.statusFilter,
                    dateRange: filters.dateRange,
                    sortField: filters.sortField,
                    sortDirection: filters.sortDirection,
                    page: filters.page
                }
            });
            setOrders(response.data.orders);
            setPagination(response.data.pagination);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch and when filters change
    useEffect(() => {
        fetchOrders();
    }, [filters]);

    // Handle order selection
    const handleOrderSelect = async (orderId) => {
        try {
            const response = await axios.get(route('customer.api.orders.show', orderId));
            setSelectedOrder(response.data);
            setShowOrderDetails(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    // Handle filter changes
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1 // Reset to page 1 when filters change
        }));
    };

    // Handle sorting
    const handleSortChange = (field) => {
        const newDirection = filters.sortField === field && filters.sortDirection === 'asc' ? 'desc' : 'asc';
        setFilters(prev => ({
            ...prev,
            sortField: field,
            sortDirection: newDirection,
            page: 1 // Reset to page 1 when sort changes
        }));
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            setFilters(prev => ({
                ...prev,
                page
            }));
        }
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Update status filter when tab changes
        if (tab !== 'all') {
            setFilters(prev => ({
                ...prev,
                statusFilter: tab,
                page: 1 // Reset to page 1 when tab changes
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                statusFilter: 'all',
                page: 1 // Reset to page 1 when tab changes
            }));
        }
    };

    return (
        <>
            <Head title={t('Customer Orders')}>
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

                    /* Fix for horizontal scroll */
                    html, body {
                        overflow-x: hidden;
                        max-width: 100%;
                    }

                    .responsive-chart-container {
                        max-width: 100%;
                        overflow-x: hidden;
                    }

                    @keyframes modalFadeIn {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>
            </Head>

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.orders"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">{t('Customer Portal')}</span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t('Orders Management')}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => fetchOrders()}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-200"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {t('Refresh')}
                            </button>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto space-y-6">
                                {/* Stats Section */}
                                <OrderStats stats={stats} />

                                {/* Filters Section */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl p-5">
                                    <OrderFilters
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                        onSortChange={handleSortChange}
                                    />
                                </div>

                                {/* Orders Table */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
                                    <div className="p-5">
                                        <OrderList
                                            orders={orders}
                                            activeTab={activeTab}
                                            setActiveTab={handleTabChange}
                                            onOrderSelect={handleOrderSelect}
                                            loading={loading}
                                            pagination={pagination}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop with improved blur effect */}
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-indigo-900/70 backdrop-blur-sm"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal container with animation */}
                        <div
                            className="inline-block align-bottom bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-800/30 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-indigo-100 dark:border-indigo-900/50"
                            style={{
                                animation: 'modalFadeIn 0.3s ease-out forwards'
                            }}
                        >
                            {/* Close button - enhanced */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    type="button"
                                    onClick={() => setShowOrderDetails(false)}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-gray-500 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-400 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 transform hover:scale-110 focus:outline-none shadow-md hover:shadow-lg"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 sm:p-8">
                                <OrderDetails
                                    order={selectedOrder}
                                    visible={showOrderDetails}
                                    onClose={() => setShowOrderDetails(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
