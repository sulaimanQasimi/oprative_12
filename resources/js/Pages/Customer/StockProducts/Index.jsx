import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import {
    Package,
    Plus,
    Search,
    Filter,
    RefreshCw,
    DollarSign,
    Box,
    ArrowLeft,
    PackageSearch,
    TrendingUp,
    TrendingDown
} from 'lucide-react';

export default function StockProductsIndex({ stockProducts, search, isFilterOpen }) {
    const { t } = useLaravelReactI18n();
    const [filterOpen, setFilterOpen] = useState(isFilterOpen);

    return (
        <>
            <Head title={t('Stock Products')} />
            <CustomerNavbar />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Hero Section with Gradient Background */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-10 mb-10 overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-pink-400 to-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                {t('Stock Products Management')}
                            </h1>
                            <p className="text-indigo-100 text-lg max-w-2xl">
                                {t('Track your inventory, monitor stock levels, and analyze product performance in real-time.')}
                            </p>
                            <div className="flex items-center mt-6 gap-4">
                                <span className="text-indigo-200 text-sm">{stockProducts.total} {t('Products Total')}</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                            <Package className="h-16 w-16 text-white opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Total Products */}
                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 transform hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">{t('Total Products')}</p>
                                <p className="text-2xl font-bold text-gray-900">{stockProducts.total}</p>
                                <p className="text-xs text-gray-500">{t('In your inventory')}</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <Package className="w-8 h-8 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    {/* Total Stock Value */}
                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 transform hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-green-600">{t('Total Stock Value')}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stockProducts.data.reduce((sum, product) => sum + product.net_total, 0))}
                                </p>
                                <p className="text-xs text-gray-500">{t('Current inventory value')}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <DollarSign className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Total Profit */}
                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 transform hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-purple-600">{t('Total Profit')}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stockProducts.data.reduce((sum, product) => sum + product.profit, 0))}
                                </p>
                                <p className="text-xs text-gray-500">{t('From all transactions')}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <TrendingUp className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions and Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    {/* Filter Button */}
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="group relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <span className="absolute top-0 left-0 w-full h-full bg-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"></span>
                        <Filter className={`mr-2 h-4 w-4 ${filterOpen ? 'text-indigo-600' : 'text-gray-500'} group-hover:text-indigo-600 transition-colors duration-300`} />
                        <span className="relative group-hover:text-indigo-600 transition-colors duration-300">
                            {filterOpen ? t('Hide Filters') : t('Show Filters')}
                        </span>
                    </button>
                </div>

                {/* Filter Panel */}
                {filterOpen && (
                    <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 animate-fadeIn">
                        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-indigo-500" />
                            {t('Search Filters')}
                        </h3>

                        <form action={route('customer.stock-products')} method="GET" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name Filter */}
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Product Name or Barcode')}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PackageSearch className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        defaultValue={search}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg"
                                        placeholder={t('Search by name or barcode')}
                                    />
                                </div>
                            </div>

                            {/* Filter Actions */}
                            <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-4 mt-2">
                                <Link
                                    href={route('customer.stock-products')}
                                    className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2 text-gray-500" />
                                    {t('Reset Filters')}
                                </Link>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    {t('Apply Filters')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stock Products List */}
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="px-8 py-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <Package className="h-6 w-6 mr-2 text-indigo-600" />
                            {t('Your Stock Products')}
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Product Details')}
                                    </th>
                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Stock')}
                                    </th>
                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Total Value')}
                                    </th>
                                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Profit')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {stockProducts.data.length > 0 ? (
                                    stockProducts.data.map(product => (
                                        <tr key={product.product_id} className="group hover:bg-indigo-50/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl group-hover:from-violet-600 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
                                                        <Box className="h-8 w-8" />
                                                    </div>
                                                    <div className="ml-5">
                                                        <div className="text-base font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{product.product_name}</div>
                                                        <div className="text-sm text-gray-500 mt-1.5 flex items-center">
                                                            <PackageSearch className="h-4 w-4 mr-1.5 text-gray-400" />
                                                            {product.barcode}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="text-sm font-mono bg-indigo-50/80 text-indigo-800 py-2 px-4 rounded-md border border-indigo-100 shadow-sm group-hover:shadow-md group-hover:bg-indigo-100 inline-flex items-center transition-all duration-300">
                                                    <Box className="h-4 w-4 mr-2 text-indigo-500" />
                                                    {product.net_quantity}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="text-sm font-mono bg-indigo-50/80 text-indigo-800 py-2 px-4 rounded-md border border-indigo-100 shadow-sm group-hover:shadow-md group-hover:bg-indigo-100 inline-flex items-center transition-all duration-300">
                                                    <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.net_total)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className={`text-sm font-mono py-2 px-4 rounded-md border shadow-sm group-hover:shadow-md inline-flex items-center transition-all duration-300 ${
                                                    product.profit >= 0
                                                        ? 'bg-green-50/80 text-green-800 border-green-100 group-hover:bg-green-100'
                                                        : 'bg-red-50/80 text-red-800 border-red-100 group-hover:bg-red-100'
                                                }`}>
                                                    {product.profit >= 0 ? (
                                                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                                                    ) : (
                                                        <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                                                    )}
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.profit)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="max-w-sm mx-auto">
                                                <div className="flex justify-center mb-4">
                                                    <div className="p-5 bg-indigo-100 rounded-full shadow-inner">
                                                        <Package className="h-12 w-12 text-indigo-600" />
                                                    </div>
                                                </div>
                                                <p className="text-lg font-medium text-gray-800 mb-2">
                                                    {t('No products found')}
                                                </p>
                                                <p className="text-gray-500 mb-6">
                                                    {t('No stock products match your search criteria.')}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {stockProducts.links && stockProducts.links.length > 3 && (
                        <div className="px-8 py-6 border-t border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-700">
                                    {t('Showing')} <span className="font-medium text-indigo-700">{stockProducts.from}</span> {t('to')} <span className="font-medium text-indigo-700">{stockProducts.to}</span> {t('of')} <span className="font-medium text-indigo-700">{stockProducts.total}</span> {t('results')}
                                </div>

                                <nav className="relative z-0 inline-flex rounded-xl shadow-md -space-x-px overflow-hidden" aria-label="Pagination">
                                    {stockProducts.links.map((link, i) => {
                                        if (i === 0 || i === stockProducts.links.length - 1) {
                                            return null;
                                        }

                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out border-r border-indigo-100 ${
                                                    link.active
                                                        ? 'z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md transform scale-105'
                                                        : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </nav>

                                {/* Prev/Next Buttons */}
                                <div className="flex space-x-2">
                                    <Link
                                        href={stockProducts.prev_page_url}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                            stockProducts.prev_page_url
                                                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!stockProducts.prev_page_url}
                                    >
                                        {t('Previous')}
                                    </Link>
                                    <Link
                                        href={stockProducts.next_page_url}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                            stockProducts.next_page_url
                                                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!stockProducts.next_page_url}
                                    >
                                        {t('Next')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
