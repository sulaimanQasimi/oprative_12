import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import OrderList from './Components/OrderList';
import OrderDetails from './Components/OrderDetails';
import OrderFilters from './Components/OrderFilters';
import OrderStats from './Components/OrderStats';
import CustomerNavbar from '@/Components/CustomerNavbar';

export default function Index() {
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
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/30">
            <Head title="Customer Orders" />
            
            {/* Navbar */}
            <CustomerNavbar />
            
            {/* Page Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-300/20 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/3 -left-24 w-80 h-80 bg-indigo-300/20 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-300/20 rounded-full filter blur-3xl"></div>
            </div>
            
            {/* Main Content */}
            <div dir="rtl" className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </span>
                            سفارشات مشتری
                        </h1>
                        <p className="text-gray-600 mt-1">مدیریت و پیگیری تمام سفارشات در یک مکان</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => fetchOrders()}
                            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-indigo-600 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            تازه‌سازی
                        </button>
                    </div>
                </div>
                
                {/* Stats Section */}
                <OrderStats stats={stats} />
                
                {/* Filters Section */}
                <OrderFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
                
                {/* Orders Table */}
                <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
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
                
                {/* Order Details Modal */}
                {showOrderDetails && selectedOrder && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                                <div className="absolute top-0 right-0 pt-4 pr-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowOrderDetails(false)}
                                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-6">
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
                
                {/* Footer */}
                <div className="mt-12 text-center text-gray-500 text-sm py-6 border-t border-gray-200">
                    <p>© {new Date().getFullYear()} سیستم مدیریت سفارشات مشتری</p>
                </div>
            </div>
        </div>
    );
} 