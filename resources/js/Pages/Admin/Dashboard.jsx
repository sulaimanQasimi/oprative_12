import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard() {
    const { stats, recentProducts, recentWarehouses, recentCustomers } = usePage().props;

    const StatCard = ({ title, value, icon, color, link }) => (
        <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
                    <p className="text-white text-3xl font-bold">{value}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                    {icon}
                </div>
            </div>
            {link && (
                <Link
                    href={route(link)}
                    className="mt-4 inline-flex items-center text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                    View all
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            )}
        </div>
    );

    const RecentItem = ({ title, subtitle, date, icon }) => (
        <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="text-sm text-gray-400">
                {new Date(date).toLocaleDateString()}
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-2 text-gray-600">Welcome to your admin dashboard</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Products"
                            value={stats.products}
                            color="from-blue-500 to-blue-700"
                            link="admin.products.index"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Warehouses"
                            value={stats.warehouses}
                            color="from-green-500 to-green-700"
                            link="admin.warehouses.index"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Shops"
                            value={stats.shops}
                            color="from-purple-500 to-purple-700"
                            link="admin.customers.index"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Units"
                            value={stats.units}
                            color="from-orange-500 to-orange-700"
                            link="admin.units.index"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Products */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                                    <Link
                                        href={route('admin.products.index')}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View all
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {recentProducts?.length > 0 ? (
                                    recentProducts.map((product) => (
                                        <RecentItem
                                            key={product.id}
                                            title={product.name}
                                            subtitle={`Unit: ${product.unit?.name || 'N/A'}`}
                                            date={product.created_at}
                                            icon={
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            }
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No recent products</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Warehouses */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Warehouses</h3>
                                    <Link
                                        href={route('admin.warehouses.index')}
                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                    >
                                        View all
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {recentWarehouses?.length > 0 ? (
                                    recentWarehouses.map((warehouse) => (
                                        <RecentItem
                                            key={warehouse.id}
                                            title={warehouse.name}
                                            subtitle={`Location: ${warehouse.location || 'N/A'}`}
                                            date={warehouse.created_at}
                                            icon={
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                                                </svg>
                                            }
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No recent warehouses</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Customers */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Shops</h3>
                                    <Link
                                        href={route('admin.customers.index')}
                                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                    >
                                        View all
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {recentCustomers?.length > 0 ? (
                                    recentCustomers.map((customer) => (
                                        <RecentItem
                                            key={customer.id}
                                            title={customer.name}
                                            subtitle={`Email: ${customer.email || 'N/A'}`}
                                            date={customer.created_at}
                                            icon={
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            }
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No recent shops</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                href={route('admin.products.create')}
                                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 transition-colors group"
                            >
                                <div className="flex items-center">
                                    <div className="bg-blue-600 p-2 rounded-lg mr-3 group-hover:bg-blue-700 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-blue-900">Add Product</span>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.warehouses.create')}
                                className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 transition-colors group"
                            >
                                <div className="flex items-center">
                                    <div className="bg-green-600 p-2 rounded-lg mr-3 group-hover:bg-green-700 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-green-900">Add Warehouse</span>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.customers.create')}
                                className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 transition-colors group"
                            >
                                <div className="flex items-center">
                                    <div className="bg-purple-600 p-2 rounded-lg mr-3 group-hover:bg-purple-700 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-purple-900">Add Shop</span>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.units.create')}
                                className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg border border-orange-200 transition-colors group"
                            >
                                <div className="flex items-center">
                                    <div className="bg-orange-600 p-2 rounded-lg mr-3 group-hover:bg-orange-700 transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-orange-900">Add Unit</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}