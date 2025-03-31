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
        <div className="bg-white rounded-xl">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </span>
                        Order #{order.id} Details
                    </h2>
                    <div className="mt-3 sm:mt-0">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Order Number: {formattedOrderNumber}
                        </span>
                    </div>
                </div>
                <p className="text-gray-600 mt-1">Order placed on {formatDate(order.created_at)}</p>
            </div>

            {/* Order Status */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
                <div className="flex flex-wrap justify-between items-center">
                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Order Status</h3>
                        <div className="mt-1 flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.order_status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : order.order_status === 'pending' 
                                        ? 'bg-amber-100 text-amber-800' 
                                        : 'bg-blue-100 text-blue-800'
                            }`}>
                                {order.order_status ? order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1) : 'Unknown'}
                            </span>
                            {order.is_paid && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    Paid
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <span className="text-sm text-gray-600">Total Amount</span>
                        <p className="text-xl font-bold text-indigo-600">${Number(order.total_amount).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Product</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {order.items && order.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                        {item.product ? item.product.name : 'Unknown Product'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.quantity}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${Number(item.unit_price).toFixed(2)}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                        ${(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-gray-200">
                                <th scope="row" colSpan="3" className="pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900">Subtotal</th>
                                <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-900">${(Number(order.total_amount) - (Number(order.tax) || 0)).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th scope="row" colSpan="3" className="pl-4 pr-3 py-2 text-right text-sm font-semibold text-gray-900">Tax</th>
                                <td className="pl-3 pr-4 py-2 text-right text-sm text-gray-900">${(Number(order.tax) || 0).toFixed(2)}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <th scope="row" colSpan="3" className="pl-4 pr-3 pt-4 pb-4 text-right text-sm font-bold text-gray-900">Total</th>
                                <td className="pl-3 pr-4 pt-4 pb-4 text-right text-sm font-bold text-indigo-600">${Number(order.total_amount).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Customer ID</p>
                            <p className="text-sm font-medium text-gray-900">{order.customer_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Shipping Address</p>
                            <p className="text-sm font-medium text-gray-900">
                                {order.shipping_address || 'No shipping address provided'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Payment Method</p>
                            <p className="text-sm font-medium text-gray-900">
                                {order.payment_method || 'Not specified'}
                            </p>
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
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8">
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                    onClick={(e) => {
                        e.preventDefault();
                        window.print();
                    }}
                >
                    Print Order
                </button>
            </div>
        </div>
    );
} 