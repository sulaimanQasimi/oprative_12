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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/30">
            <Head title={t('Stock Products')} />

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
                                <Package className="h-7 w-7 text-indigo-600" />
                            </span>
                            {t('Stock Products Management')}
                        </h1>
                        <p className="text-gray-600 mt-1">{t('Track your inventory, monitor stock levels, and analyze product performance in real-time.')}</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-indigo-600 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            <Filter className={`h-4 w-4 ${filterOpen ? 'text-indigo-600' : 'text-gray-500'}`} />
                            {filterOpen ? t('Hide Filters') : t('Show Filters')}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Products */}
                    <div className="group relative bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 transform hover:-translate-y-1">
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
                    <div className="group relative bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 transform hover:-translate-y-1">
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
                    <div className="group relative bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 transform hover:-translate-y-1">
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

                {/* Filter Panel */}
                {filterOpen && (
                    <div className="mb-8 bg-white backdrop-blur-sm bg-opacity-80 p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 animate-fadeIn">
                        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                            <Filter className="h-5 w-5 ml-2 text-indigo-500" />
                            {t('Search Filters')}
                        </h3>

                        <form action={route('customer.stock-products')} method="GET" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name Filter */}
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Product Name or Barcode')}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <PackageSearch className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        defaultValue={search}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 pl-3 py-2.5 sm:text-sm border-gray-300 rounded-lg"
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
                                    <RefreshCw className="h-4 w-4 ml-2 text-gray-500" />
                                    {t('Reset Filters')}
                                </Link>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <Search className="h-4 w-4 ml-2" />
                                    {t('Apply Filters')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stock Products List */}
                <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <Package className="h-5 w-5 ml-2 text-indigo-600" />
                            {t('Your Stock Products')}
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Product Details')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Stock')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Total Value')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Profit')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stockProducts.data.length > 0 ? (
                                    stockProducts.data.map(product => (
                                        <tr key={product.product_id} className="group hover:bg-indigo-50/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl group-hover:from-violet-600 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
                                                        <Box className="h-5 w-5" />
                                                    </div>
                                                    <div className="mr-4">
                                                        <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{product.product_name}</div>
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <PackageSearch className="h-4 w-4 ml-1.5 text-gray-400" />
                                                            {product.barcode}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono bg-indigo-50/80 text-indigo-800 py-1.5 px-3 rounded-md border border-indigo-100 shadow-sm group-hover:shadow-md group-hover:bg-indigo-100 inline-flex items-center transition-all duration-300">
                                                    <Box className="h-4 w-4 ml-2 text-indigo-500" />
                                                    {product.net_quantity}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono bg-indigo-50/80 text-indigo-800 py-1.5 px-3 rounded-md border border-indigo-100 shadow-sm group-hover:shadow-md group-hover:bg-indigo-100 inline-flex items-center transition-all duration-300">
                                                    <DollarSign className="h-4 w-4 ml-2 text-indigo-500" />
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.net_total)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-mono py-1.5 px-3 rounded-md border shadow-sm group-hover:shadow-md inline-flex items-center transition-all duration-300 ${
                                                    product.profit >= 0
                                                        ? 'bg-green-50/80 text-green-800 border-green-100 group-hover:bg-green-100'
                                                        : 'bg-red-50/80 text-red-800 border-red-100 group-hover:bg-red-100'
                                                }`}>
                                                    {product.profit >= 0 ? (
                                                        <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                                                    ) : (
                                                        <TrendingDown className="h-4 w-4 ml-2 text-red-500" />
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
                        <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
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

                {/* Footer */}
                <div className="mt-12 text-center text-gray-500 text-sm py-6 border-t border-gray-200">
                    <p>© {new Date().getFullYear()} {t('Stock Products Management System')}</p>
                </div>
            </div>
        </div>
    );
}
