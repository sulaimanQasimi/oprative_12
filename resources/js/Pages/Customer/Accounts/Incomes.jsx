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
    ChevronRight
} from 'lucide-react';

export default function Incomes({ account, incomes, outcomes, totalIncome, pendingIncome,
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

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="md:flex md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex-1 min-w-0">
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 bg-gradient-to-l from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                {t('Customer Account')}
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full">
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{account.name} - {account.account_number}</p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 space-x-6 space-x-reverse">
                        <Link href={route('reports.account.statement', account.id)} target="_blank"
                            className="group relative inline-flex items-center px-6 py-2.5 border-2 border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ml-2">
                            <svg className="ml-2 h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="relative">{t('Print Report')}</span>
                        </Link>
                        <button onClick={() => setShowCreateIncomeModal(true)}
                            className="group relative inline-flex items-center px-6 py-2.5 border-2 border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ml-2">
                            <svg className="ml-2 h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="relative">{t('Add New Income')}</span>
                        </button>
                        <Link href={route('customer.accounts.index')}
                            className="group relative inline-flex items-center px-6 py-2.5 border-2 border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition-all duration-300 hover:scale-105 hover:shadow-md ml-2">
                            <span className="relative ml-2">{t('Back to Accounts')}</span>
                            <svg className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Income Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Income */}
                    <div className="group relative bg-white rounded-2xl shadow-sm border border-indigo-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">{t('Total Income')}</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">{formatNumber(totalIncome)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <DollarSign className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    {/* Total Rent */}
                    <div className="group relative bg-white rounded-2xl shadow-sm border border-red-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-red-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-red-600">{t('Total Rent')}</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">{formatNumber(totalOutcome)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Income */}
                    <div className="group relative bg-white rounded-2xl shadow-sm border border-green-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-green-600">{t('Monthly Income')}</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">{formatNumber(monthlyIncome)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Monthly Rent */}
                    <div className="group relative bg-white rounded-2xl shadow-sm border border-yellow-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-yellow-600">{t('Monthly Rent')}</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">{formatNumber(monthlyOutcome)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <TrendingDown className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table section */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-medium mb-4">{t('Income History')}</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        {t('Description')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        {t('Amount')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        {t('Status')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        {t('Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {incomes.data && incomes.data.map((income) => (
                                    <tr key={income.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {income.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {income.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {income.status}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {income.status === 'pending' && (
                                                <Link
                                                    href={route('customer.accounts.incomes.approve', {account: account.id, income: income.id})}
                                                    method="post"
                                                    as="button"
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    {t('Approve')}
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    {activeTab === 'incomes' && incomes.links && incomes.links.length > 3 && (
                        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {incomes.prev_page_url && (
                                    <Link
                                        href={incomes.prev_page_url}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        {t('Previous')}
                                    </Link>
                                )}
                                {incomes.next_page_url && (
                                    <Link
                                        href={incomes.next_page_url}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        {t('Next')}
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        {t('Showing')} <span className="font-medium">{incomes.from}</span> {t('to')} <span className="font-medium">{incomes.to}</span> {t('of')} <span className="font-medium">{incomes.total}</span> {t('results')}
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <Link
                                            href={incomes.prev_page_url}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${!incomes.prev_page_url && 'opacity-50 cursor-not-allowed'}`}
                                            disabled={!incomes.prev_page_url}
                                        >
                                            <span className="sr-only">{t('Previous')}</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
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
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${!incomes.next_page_url && 'opacity-50 cursor-not-allowed'}`}
                                            disabled={!incomes.next_page_url}
                                        >
                                            <span className="sr-only">{t('Next')}</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Income Modal */}
            {showCreateIncomeModal && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleCreateIncome}>
                                {/* Modal Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 sm:px-6 flex items-center justify-between">
                                    <h3 className="text-lg leading-6 font-medium text-white">
                                        {t('Create New Income')}
                                    </h3>
                                    <button
                                        type="button"
                                        className="text-white hover:text-gray-200 focus:outline-none"
                                        onClick={() => setShowCreateIncomeModal(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="source_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Source Number')}
                                            </label>
                                            <input
                                                type="text"
                                                id="source_number"
                                                className="bg-gray-100 text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5"
                                                value={`S-${new Date().getTime().toString().slice(-8)}`}
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Amount')} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                id="amount"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5"
                                                placeholder="0.00"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                required
                                            />
                                            {errors.amount && (
                                                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Date')}
                                            </label>
                                            <input
                                                type="text"
                                                id="date"
                                                className="bg-gray-100 text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5"
                                                value={new Date().toLocaleDateString()}
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Description')} <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="description"
                                                rows="3"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5"
                                                placeholder={t('Enter income description')}
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                required
                                            ></textarea>
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {processing ? t('Saving...') : t('Save Income')}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setShowCreateIncomeModal(false)}
                                    >
                                        {t('Cancel')}
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
