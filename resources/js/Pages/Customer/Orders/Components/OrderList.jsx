import React from 'react';
import { format } from 'date-fns';
import moment from 'moment-jalaali';

const getOrderStatusBadge = (status) => {
    const styles = {
        pending: {
            bg: 'bg-amber-100',
            text: 'text-amber-800',
            border: 'border-amber-200',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        processing: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            )
        },
        completed: {
            bg: 'bg-emerald-100',
            text: 'text-emerald-800',
            border: 'border-emerald-200',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        default: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-200',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    }[status] || styles.default;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text} ${styles.border}`}>
            {styles.icon}
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        </span>
    );
};

export default function OrderList({ orders, activeTab, setActiveTab, onOrderSelect, loading, pagination, onPageChange }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const momentDate = moment(dateString);
        return momentDate.format('jYYYY/jMM/jDD HH:mm');
    };

    const isToday = (dateString) => {
        if (!dateString) return false;
        const momentDate = moment(dateString);
        const today = moment();
        return momentDate.format('jYYYY/jMM/jDD') === today.format('jYYYY/jMM/jDD');
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
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            All Orders
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                            activeTab === 'pending'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-[1.02]'
                                : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                            activeTab === 'completed'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md scale-[1.02]'
                                : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                        </div>
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-xl shadow-sm">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg">No orders found matching your criteria.</p>
                        <p className="text-sm mt-2">Try changing your filters or search parameters.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-xl overflow-hidden border-collapse">
                        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                        Order #
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Order Number
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Date
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Amount
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Items
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Status
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Actions
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                                    style={{
                                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                                            <span className="bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                #{order.id}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center justify-end">
                                            <span className="bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors duration-150 py-1 px-2.5 rounded-lg">
                                                {order.order_number || `#${String(order.id).padStart(6, '0')}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center justify-end">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-indigo-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className={isToday(order.created_at) ? "text-green-600 font-medium" : ""}>
                                                {formatDate(order.created_at)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center justify-end">
                                            <span className="bg-green-100 text-green-700 py-1 px-2.5 rounded-lg group-hover:bg-green-200 transition-colors duration-150">
                                                ${Number(order.total_amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center justify-end">
                                            <span className="bg-purple-100 text-purple-600 py-1 px-2.5 rounded-lg group-hover:bg-purple-200 transition-colors duration-150">
                                                <span className="font-semibold">{order.items ? order.items.length : 0}</span> items
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex justify-end">
                                            {getOrderStatusBadge(order.order_status)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => onOrderSelect(order.id)}
                                                className="flex items-center text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 hover:bg-indigo-100 transition-colors duration-150 px-3 py-1.5 rounded-lg group-hover:scale-105 transform"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View Details
                                            </button>
                                        </div>
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

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            ` }} />
        </>
    );
}
