import React from 'react';
import { format } from 'date-fns';

export default function OrderDetails({ order }) {
    if (!order) {
        return null;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    };

    // Format the order number with a proper fallback
    const formattedOrderNumber = order.order_number || `#${String(order.id).padStart(6, '0')}`;

    return (
        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-200/30 to-emerald-200/30 rounded-full -ml-10 -mb-10"></div>
            
            <div className="relative">
                {/* Order Header with gradient background */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </span>
                            Order #{order.id} Details
                        </h2>
                        <div className="mt-3 sm:mt-0">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 backdrop-blur-sm text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Order Number: {formattedOrderNumber}
                            </span>
                        </div>
                    </div>
                    <p className="text-indigo-100 mt-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Order placed on {formatDate(order.created_at)}
                    </p>
                </div>

                <div className="px-6 sm:px-8">
                    {/* Order Status Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 mb-8 border border-indigo-100 shadow-sm transform transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex flex-wrap justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Order Status
                                </h3>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm ${
                                        order.order_status === 'completed' 
                                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                                            : order.order_status === 'pending' 
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                    }`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {order.order_status === 'completed' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            ) : order.order_status === 'pending' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            )}
                                        </svg>
                                        {order.order_status ? order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1) : 'Unknown'}
                                    </span>
                                    {order.is_paid && (
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Paid
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="text-right mt-4 sm:mt-0">
                                <span className="text-sm text-gray-600">Total Amount</span>
                                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                                    ${Number(order.total_amount).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Order Items
                        </h3>
                        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                </svg>
                                                Product
                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                Quantity
                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Price
                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                </svg>
                                                Total
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {order.items && order.items.map((item, index) => (
                                        <tr 
                                            key={item.id} 
                                            className="hover:bg-indigo-50/30 transition-colors duration-150"
                                            style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
                                        >
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                        </svg>
                                                    </span>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{item.product ? item.product.name : 'Unknown Product'}</div>
                                                        {item.product && item.product.stock !== undefined && (
                                                            <div className="text-gray-500 text-xs">Stock: {item.product.stock}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className="text-gray-900">${Number(item.unit_price).toFixed(2)}</span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                                                <span className="text-indigo-600">${(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <tr>
                                        <th scope="row" colSpan="3" className="pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900">Subtotal</th>
                                        <td className="pl-3 pr-4 pt-4 text-right text-sm font-medium text-gray-900">
                                            ${(Number(order.total_amount) - (Number(order.tax) || 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" colSpan="3" className="pl-4 pr-3 py-2 text-right text-sm font-semibold text-gray-900">Tax</th>
                                        <td className="pl-3 pr-4 py-2 text-right text-sm text-gray-900">
                                            ${(Number(order.tax) || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr className="border-t border-gray-200">
                                        <th scope="row" colSpan="3" className="pl-4 pr-3 pt-4 pb-4 text-right text-base font-bold text-gray-900">Total</th>
                                        <td className="pl-3 pr-4 pt-4 pb-4 text-right text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                                            ${Number(order.total_amount).toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Customer Information
                        </h3>
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 shadow-sm transform transition-all hover:shadow-md hover:-translate-y-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Customer ID</p>
                                        <p className="text-sm font-medium text-gray-900">{order.customer_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Shipping Address</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {order.shipping_address || 'No shipping address provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {order.payment_method || 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Notes</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {order.notes || 'No notes provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end space-x-6 mt-8">
                        <a
                            href={route('customer.orders.invoice', order.id)}
                            className="px-4 py-2.5 flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Invoice
                        </a>
                        
                        <a
                            href={route('customer.orders.thermal-print', order.id)}
                            className="px-4 py-2.5 flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Thermal Print
                        </a>
                      
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
} 