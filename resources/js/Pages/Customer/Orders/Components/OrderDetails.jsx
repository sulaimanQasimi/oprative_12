import React, { useState } from 'react';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';

export default function OrderDetails({ order, visible, onClose }) {
    const [activeSection, setActiveSection] = useState('products');

    if (!visible || !order) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-center">Select an order to view details</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    };

    const getOrderStatusColor = (status) => {
        return {
            pending: {
                bg: 'from-amber-500/10 to-orange-500/10',
                text: 'text-amber-700'
            },
            processing: {
                bg: 'from-blue-500/10 to-indigo-500/10',
                text: 'text-blue-700'
            },
            completed: {
                bg: 'from-emerald-500/10 to-green-500/10',
                text: 'text-emerald-700'
            },
            default: {
                bg: 'bg-gray-100',
                text: 'text-gray-700'
            }
        }[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    };

    const statusColors = getOrderStatusColor(order.order_status);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Order #{order.id}</h2>
                        <div className="flex items-center gap-2 text-indigo-100 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{formatDate(order.created_at)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg backdrop-blur-sm p-4">
                        <span className="text-indigo-100 text-sm">Status</span>
                        <div className={`mt-1 inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${statusColors.bg} ${statusColors.text}`}>
                            {order.order_status ? order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1) : ''}
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg backdrop-blur-sm p-4">
                        <span className="text-indigo-100 text-sm">Total</span>
                        <p className="text-xl font-bold text-white mt-1">${Number(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg backdrop-blur-sm p-4">
                        <span className="text-indigo-100 text-sm">Payment</span>
                        <p className="text-xl font-bold text-white mt-1">{order.is_paid ? 'Paid' : 'Unpaid'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="flex overflow-x-auto">
                    <button
                        onClick={() => setActiveSection('products')}
                        className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 ${
                            activeSection === 'products' ? 'text-indigo-600 border-indigo-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Products
                    </button>
                    <button
                        onClick={() => setActiveSection('details')}
                        className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200 ${
                            activeSection === 'details' ? 'text-indigo-600 border-indigo-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Details
                    </button>
                    <div className="flex-grow"></div>
                    <Link
                        href={route('customer.orders.invoice', order.id)}
                        className="flex items-center px-6 py-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeSection === 'products' && (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items && order.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="font-medium text-gray-900">{item.product?.name}</div>
                                                <div className="text-sm text-gray-500">Stock: {item.product?.stock}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">{item.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">${Number(item.unit_price).toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">${Number(item.quantity * item.unit_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">${Number(order.total_amount - (order.tax || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium text-gray-900">${Number(order.tax || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 text-lg font-bold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-indigo-600">${Number(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'details' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Customer Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-500">Name</span>
                                    <p className="font-medium text-gray-900">{order.customer?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Email</span>
                                    <p className="font-medium text-gray-900">{order.customer?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Phone</span>
                                    <p className="font-medium text-gray-900">{order.customer?.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Order Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-500">Order Number</span>
                                    <p className="font-medium text-gray-900">
                                        {order.order_number || `#${String(order.id).padStart(6, '0')}`}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Date</span>
                                    <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Payment Status</span>
                                    <p className={`font-medium ${order.is_paid ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {order.is_paid ? 'Paid' : 'Unpaid'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 