import React from 'react';
import { format } from 'date-fns';

const getOrderStatusColor = (status) => {
    return {
        pending: {
            bg: 'bg-gradient-to-r from-amber-100 to-orange-100',
            text: 'text-amber-700',
            border: 'border-amber-200'
        },
        processing: {
            bg: 'bg-gradient-to-r from-blue-100 to-indigo-100',
            text: 'text-blue-700',
            border: 'border-blue-200'
        },
        completed: {
            bg: 'bg-gradient-to-r from-emerald-100 to-green-100',
            text: 'text-emerald-700',
            border: 'border-emerald-200'
        },
        default: {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            border: 'border-gray-200'
        }
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
};

export default function OrderList({ orders, activeTab, setActiveTab, selectedOrderId, onOrderSelect, loading, pagination, onPageChange }) {
    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    };

    // Filter orders by active tab (filtering is handled on the server, but we still filter locally for tab view)
    const filteredOrders = orders.filter(order => activeTab === 'all' || order.order_status === activeTab);

    return (
        <>
            {/* Filter Tabs */}
            <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-xl rounded-xl p-2 shadow-sm border border-gray-100 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                            activeTab === 'all'
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md scale-[1.02]'
                                : 'hover:bg-gray-50'
                        }`}
                    >
                        All Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                            activeTab === 'pending'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-[1.02]'
                                : 'hover:bg-gray-50'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                            activeTab === 'completed'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md scale-[1.02]'
                                : 'hover:bg-gray-50'
                        }`}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] pr-2">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                        No orders found matching your criteria.
                    </div>
                ) : (
                    <>
                        {filteredOrders.map(order => {
                            const statusColors = getOrderStatusColor(order.order_status);
                            const isSelected = selectedOrderId === order.id;

                            return (
                                <div
                                    key={order.id}
                                    onClick={() => onOrderSelect(order.id)}
                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:scale-[1.02] group ${
                                        isSelected
                                            ? 'ring-2 ring-purple-500 shadow-xl scale-[1.02] bg-gradient-to-br from-white to-purple-50/50'
                                            : 'hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/30'
                                    }`}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">Order #{order.id}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                                            >
                                                {order.order_status ? order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1) : ''}
                                            </span>
                                        </div>

                                        <div className="mt-6 grid grid-cols-3 gap-6">
                                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 group-hover:from-emerald-100 group-hover:to-green-100 transition-all duration-300">
                                                <span className="text-sm text-gray-600 flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    Products
                                                </span>
                                                <p className="text-2xl font-bold text-emerald-600 mt-1">
                                                    {order.items ? order.items.length : 0}
                                                </p>
                                            </div>

                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                                <span className="text-sm text-gray-600 flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Amount
                                                </span>
                                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                                    ${Number(order.total_amount).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 group-hover:from-purple-100 group-hover:to-pink-100 transition-all duration-300">
                                                <span className="text-sm text-gray-600 flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Paid
                                                </span>
                                                <p className="text-2xl font-bold text-purple-600 mt-1">
                                                    {order.is_paid ? 'Yes' : 'No'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Pagination Controls */}
                        {pagination && pagination.last_page > 1 && (
                            <div className="mt-6 flex justify-center">
                                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => onPageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                            pagination.current_page === 1 
                                                ? 'text-gray-300 cursor-not-allowed' 
                                                : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                        }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    
                                    {/* Page Numbers */}
                                    {[...Array(pagination.last_page)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => onPageChange(index + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                pagination.current_page === index + 1
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => onPageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.last_page}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                            pagination.current_page === pagination.last_page 
                                                ? 'text-gray-300 cursor-not-allowed' 
                                                : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                        }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
} 