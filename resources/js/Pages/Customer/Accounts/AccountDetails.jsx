import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import {
    CreditCard,
    Plus,
    Search,
    Filter,
    RefreshCw,
    DollarSign,
    Shield,
    User,
    Calendar,
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Clock,
    X,
    ChevronRight,
    CheckCircle,
    FileText,
    ChevronLeft
} from 'lucide-react';

export default function AccountDetails({ account, incomes, outcomes, totalIncome, pendingIncome,
                                 monthlyIncome, yearlyIncome, incomeByMonth, totalOutcome,
                                 pendingOutcome, monthlyOutcome, yearlyOutcome, tab, customer }) {
    const { t } = useLaravelReactI18n();
    const [activeTab, setActiveTab] = useState(tab);
    const [showCreateIncomeModal, setShowCreateIncomeModal] = useState(false);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        description: '',
    });

    const handleCreateIncome = (e) => {
        e.preventDefault();
        post(route('customer.accounts.incomes.store', account.id), {
            onSuccess: () => {
                setShowCreateIncomeModal(false);
                reset();
            }
        });
    };

    return (
        <>
            <Head title={t('Account Details')} />
            <CustomerNavbar />

            {/* Background gradient */}
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <Link
                                href={route('customer.accounts.index')}
                                className="mr-4 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors duration-200"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-600" />
                            </Link>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {t('Customer Account')}
                                </h2>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-gray-600 font-medium">{account.name}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500 font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{account.account_number}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center space-x-3 border border-gray-100">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{t('Account Balance')}</p>
                                    <p className="text-lg font-bold text-gray-800">{formatNumber(totalIncome - totalOutcome)}</p>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Link href={route('reports.account.statement', account.id)} target="_blank"
                                    className="inline-flex items-center px-4 py-2.5 rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                                    <FileText className="mr-2 h-4 w-4" />
                                    {t('Export Statement')}
                                </Link>
                                <button onClick={() => setShowCreateIncomeModal(true)}
                                    className="inline-flex items-center px-4 py-2.5 rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Add Income')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Income Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        {/* Total Income */}
                        <div className="group bg-white rounded-2xl shadow-md border border-indigo-50 p-5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform">
                            <div className="absolute top-0 right-0 mt-5 mr-5">
                                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg p-2.5 transform transition-all duration-300 group-hover:rotate-12">
                                    <DollarSign className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                            <div className="space-y-2 pr-16">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('Total Income')}</p>
                                <div className="relative">
                                    <p className="text-2xl font-bold text-indigo-600 group-hover:opacity-0 transition-opacity duration-300">
                                        {formatNumber(totalIncome)}
                                    </p>
                                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {formatNumber(totalIncome)}
                                    </p>
                                </div>
                                <div className="h-1.5 w-12 bg-indigo-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>
                        </div>

                        {/* Total Rent/Outcome */}
                        <div className="group bg-white rounded-2xl shadow-md border border-red-50 p-5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform">
                            <div className="absolute top-0 right-0 mt-5 mr-5">
                                <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg p-2.5 transform transition-all duration-300 group-hover:rotate-12">
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                            <div className="space-y-2 pr-16">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('Total Rent')}</p>
                                <div className="relative">
                                    <p className="text-2xl font-bold text-red-600 group-hover:opacity-0 transition-opacity duration-300">
                                        {formatNumber(totalOutcome)}
                                    </p>
                                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {formatNumber(totalOutcome)}
                                    </p>
                                </div>
                                <div className="h-1.5 w-12 bg-red-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Income */}
                        <div className="group bg-white rounded-2xl shadow-md border border-green-50 p-5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform">
                            <div className="absolute top-0 right-0 mt-5 mr-5">
                                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2.5 transform transition-all duration-300 group-hover:rotate-12">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="space-y-2 pr-16">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('Monthly Income')}</p>
                                <div className="relative">
                                    <p className="text-2xl font-bold text-green-600 group-hover:opacity-0 transition-opacity duration-300">
                                        {formatNumber(monthlyIncome)}
                                    </p>
                                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {formatNumber(monthlyIncome)}
                                    </p>
                                </div>
                                <div className="h-1.5 w-12 bg-green-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Rent/Outcome */}
                        <div className="group bg-white rounded-2xl shadow-md border border-yellow-50 p-5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform">
                            <div className="absolute top-0 right-0 mt-5 mr-5">
                                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-2.5 transform transition-all duration-300 group-hover:rotate-12">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                            <div className="space-y-2 pr-16">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('Monthly Rent')}</p>
                                <div className="relative">
                                    <p className="text-2xl font-bold text-yellow-600 group-hover:opacity-0 transition-opacity duration-300">
                                        {formatNumber(monthlyOutcome)}
                                    </p>
                                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {formatNumber(monthlyOutcome)}
                                    </p>
                                </div>
                                <div className="h-1.5 w-12 bg-yellow-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table section */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">{t('Income History')}</h2>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder={t('Search transactions...')}
                                    />
                                </div>
                                <button className="inline-flex items-center p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <Filter className="h-4 w-4" />
                                </button>
                                <button className="inline-flex items-center p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-6">
                            <div className="inline-block min-w-full align-middle px-6">
                                <div className="overflow-hidden border border-gray-200 rounded-xl">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('Description')}
                                                </th>
                                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('Amount')}
                                                </th>
                                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('Status')}
                                                </th>
                                                <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('Actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {incomes.data && incomes.data.length > 0 ? (
                                                incomes.data.map((income) => (
                                                    <tr key={income.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            <div className="font-medium">{income.description || t('Income payment')}</div>
                                                            <div className="text-gray-500 text-xs mt-0.5">{new Date(income.date).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{formatNumber(income.amount)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                                                ${income.status === 'approved'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : income.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {income.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1.5" />}
                                                                {income.status === 'pending' && <Clock className="w-3 h-3 mr-1.5" />}
                                                                {income.status.charAt(0).toUpperCase() + income.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                            {income.status === 'pending' && (
                                                                <Link
                                                                    href={route('customer.accounts.incomes.approve', {account: account.id, income: income.id})}
                                                                    method="post"
                                                                    as="button"
                                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                                >
                                                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                                    {t('Approve')}
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500">
                                                        <div className="flex flex-col items-center">
                                                            <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                            </svg>
                                                            <p>{t('No income transactions found')}</p>
                                                            <button
                                                                onClick={() => setShowCreateIncomeModal(true)}
                                                                className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
                                                            >
                                                                <Plus className="w-4 h-4 mr-1.5" />
                                                                {t('Add your first income')}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Pagination Section */}
                        {activeTab === 'incomes' && incomes.links && incomes.links.length > 3 && (
                            <div className="px-4 py-5 border-t border-gray-200 sm:px-6 mt-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="text-sm text-gray-700">
                                            {t('Showing')} <span className="font-medium">{incomes.from}</span> {t('to')} <span className="font-medium">{incomes.to}</span> {t('of')} <span className="font-medium">{incomes.total}</span> {t('results')}
                                        </p>
                                    </div>
                                    <nav className="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <Link
                                            href={incomes.prev_page_url}
                                            className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${!incomes.prev_page_url ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
                                            disabled={!incomes.prev_page_url}
                                        >
                                            <span className="sr-only">{t('Previous')}</span>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>

                                        {incomes.links && incomes.links.slice(1, -1).map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                            </Link>
                                        ))}

                                        <Link
                                            href={incomes.next_page_url}
                                            className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${!incomes.next_page_url ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
                                            disabled={!incomes.next_page_url}
                                        >
                                            <span className="sr-only">{t('Next')}</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </nav>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Income Modal */}
            {showCreateIncomeModal && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                        {/* Modal positioning trick */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal container */}
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>

                            <form onSubmit={handleCreateIncome}>
                                {/* Modal Header */}
                                <div className="px-6 pt-6 pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                            <DollarSign className="h-5 w-5 text-indigo-600 mr-2" />
                                            {t('Create New Income')}
                                        </h3>
                                        <button
                                            type="button"
                                            className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => setShowCreateIncomeModal(false)}
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">{t('Close')}</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">{t('Add a new income transaction to your account.')}</p>
                                </div>

                                {/* Modal Content */}
                                <div className="px-6 py-4 bg-gray-50 border-y border-gray-200">
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="source_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Source Number')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">#</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="source_number"
                                                    className="bg-gray-100 text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-lg"
                                                    value={`S-${new Date().getTime().toString().slice(-8)}`}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Amount')} <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-lg shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="amount"
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg"
                                                    placeholder="0.00"
                                                    value={data.amount}
                                                    onChange={(e) => setData('amount', e.target.value)}
                                                    required
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">USD</span>
                                                </div>
                                            </div>
                                            {errors.amount && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <svg className="h-3 w-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.amount}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Date')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="date"
                                                    className="bg-gray-100 text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-lg"
                                                    value={new Date().toLocaleDateString()}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Description')} <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="description"
                                                rows="3"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-3 px-4 sm:text-sm border-gray-300 rounded-lg shadow-sm"
                                                placeholder={t('Enter income description')}
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                required
                                            ></textarea>
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <svg className="h-3 w-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                                    <button
                                        type="button"
                                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => setShowCreateIncomeModal(false)}
                                    >
                                        {t('Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('Saving...')}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                {t('Save Income')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
