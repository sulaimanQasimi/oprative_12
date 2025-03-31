import React from 'react';
import { format } from 'date-fns';

const getOrderStatusBadge = (status) => {
    const styles = {
        pending: {
            bg: 'bg-amber-100',
            text: 'text-amber-800',
            border: 'border-amber-200'
        },
        processing: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200'
        },
        completed: {
            bg: 'bg-emerald-100',
            text: 'text-emerald-800',
            border: 'border-emerald-200'
        },
        default: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-200'
        }
    }[status] || styles.default;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text} ${styles.border}`}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        </span>
    );
};

export default function OrderList({ orders, activeTab, setActiveTab, onOrderSelect, loading, pagination, onPageChange }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    };

    // Filter orders by active tab (filtering is handled on the server, but we still filter locally for tab view)
    const filteredOrders = orders.filter(order => activeTab === 'all' || order.order_status === activeTab);

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

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

            {/* Orders Table */}
            <div className="overflow-x-auto">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                        No orders found matching your criteria.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order #
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr 
                                    key={order.id} 
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(order.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.items ? order.items.length : 0} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getOrderStatusBadge(order.order_status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => onOrderSelect(order.id)}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse" aria-label="Pagination">
                            {/* First Page Button */}
                            <button
                                onClick={() => onPageChange(1)}
                                disabled={pagination.current_page === 1}
                                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                    pagination.current_page === 1 
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                        : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200 shadow-sm hover:shadow hover:scale-105'
                                }`}
                                title="First Page"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {/* Previous Page Button */}
                            <button
                                onClick={() => onPageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                    pagination.current_page === 1 
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                        : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200 shadow-sm hover:shadow hover:scale-105'
                                }`}
                                title="Previous Page"
                            >
                                <svg className="h-5 w-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {/* Page Indicator */}
                            <div className="relative px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm border border-indigo-100">
                                <span className="text-indigo-600 font-bold">{pagination.current_page}</span>
                                <span> of </span>
                                <span className="text-indigo-600 font-bold">{pagination.last_page}</span>
                            </div>
                            
                            {/* Next Page Button */}
                            <button
                                onClick={() => onPageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                    pagination.current_page === pagination.last_page 
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                        : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200 shadow-sm hover:shadow hover:scale-105'
                                }`}
                                title="Next Page"
                            >
                                <svg className="h-5 w-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {/* Last Page Button */}
                            <button
                                onClick={() => onPageChange(pagination.last_page)}
                                disabled={pagination.current_page === pagination.last_page}
                                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                    pagination.current_page === pagination.last_page 
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                        : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200 shadow-sm hover:shadow hover:scale-105'
                                }`}
                                title="Last Page"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm7 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L15.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 