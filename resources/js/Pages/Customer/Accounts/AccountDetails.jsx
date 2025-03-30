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
    ChevronLeft,
    CreditCard as CardIcon,
    ReceiptText
} from 'lucide-react';

export default function AccountDetails({ account, incomes, outcomes, totalIncome, pendingIncome,
                                 monthlyIncome, yearlyIncome, incomeByMonth, totalOutcome,
                                 pendingOutcome, monthlyOutcome, yearlyOutcome, tab, customer }) {
    const { t } = useLaravelReactI18n();
    const [activeTab, setActiveTab] = useState(tab);
    const [showCreateIncomeModal, setShowCreateIncomeModal] = useState(false);
    const [showCreateOutcomeModal, setShowCreateOutcomeModal] = useState(false);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        description: '',
    });

    const outcomeForm = useForm({
        amount: '',
        reference_number: '',
        date: new Date().toISOString().substr(0, 10),
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

    const handleCreateOutcome = (e) => {
        e.preventDefault();
        outcomeForm.post(route('customer.accounts.outcomes.store', account.id), {
            onSuccess: () => {
                setShowCreateOutcomeModal(false);
                outcomeForm.reset();
            }
        });
    };

    return (
        <>
            <Head title={t('Account Details')} />
            <CustomerNavbar />

            {/* Background gradient */}
            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50/10 to-indigo-50/20">
                <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-12 relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-6 -left-10 w-40 h-40 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl opacity-60"></div>
                        <div className="absolute -bottom-8 right-0 w-32 h-32 bg-gradient-to-tr from-purple-100/40 to-pink-100/40 rounded-full blur-2xl opacity-70"></div>

                        <div className="relative">
                            <div className="flex items-center mb-8">
                                <Link
                                    href={route('customer.accounts.index')}
                                    className="mr-4 p-2.5 rounded-full bg-white shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    <ChevronLeft className="h-5 w-5 text-indigo-600" />
                                </Link>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                                        {t('Account Details')}
                                    </h2>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="text-gray-700 font-semibold">{account.name}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-600 font-mono text-sm bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-100">{account.account_number}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
                            <div className="bg-white rounded-xl shadow-lg px-5 py-4 flex items-center space-x-4 border border-gray-100 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:border-indigo-100">
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-3 rounded-xl">
                                    <CreditCard className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Account Balance')}</p>
                                    <p className="text-xl font-bold text-gray-800">{formatNumber(totalIncome - totalOutcome)}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap sm:flex-nowrap gap-3">
                                <Link href={route('reports.account.statement', account.id)} target="_blank"
                                    className="inline-flex items-center px-5 py-3 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    {t('Export Statement')}
                                </Link>
                                <button onClick={() => setShowCreateIncomeModal(true)}
                                    className="inline-flex items-center px-5 py-3 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Add Income')}
                                </button>
                                <button onClick={() => setShowCreateOutcomeModal(true)}
                                    className="inline-flex items-center px-5 py-3 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    <CardIcon className="mr-2 h-4 w-4" />
                                    {t('Add Rent/Loan')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Income Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* Total Income */}
                        <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-50 p-6 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-indigo-200 hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/50 transform hover:-translate-y-1">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                            <div className="absolute top-0 right-0 mt-6 mr-6">
                                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-3 rounded-xl transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
                                    <DollarSign className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                            <div className="space-y-3 pr-16">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{t('Total Income')}</p>
                                <div className="relative">
                                    <p className="text-2xl font-bold text-indigo-600 group-hover:opacity-0 transition-opacity duration-300">
                                        {formatNumber(totalIncome)}
                                    </p>
                                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {formatNumber(totalIncome)}
                                    </p>
                                </div>
                                <div className="h-1.5 w-16 bg-indigo-100 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                                </div>
                            </div>
                        </div>

                        {/* Total Rent/Outcome */}
                        <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-red-50 p-6 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-red-200 hover:bg-gradient-to-br hover:from-white hover:to-red-50/50 transform hover:-translate-y-1">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                            <div className="absolute top-0 right-0 mt-6 mr-6">
                                <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 rounded-xl transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                            <div className="space-y-3 pr-16">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{t('Total Rent')}</p>
                                <div className="relative">
                                    <p className="text-2xl font-bold text-red-600 group-hover:opacity-0 transition-opacity duration-300">
                                        {formatNumber(totalOutcome)}
                                    </p>
                                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {formatNumber(totalOutcome)}
                                    </p>
                                </div>
                                <div className="h-1.5 w-16 bg-red-100 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Income */}
                        <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-50 p-6 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-green-200 hover:bg-gradient-to-br hover:from-white hover:to-green-50/50 transform hover:-translate-y-1">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                            <div className="absolute top-0 right-0 mt-6 mr-6">
                                <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="space-y-3 pr-16">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{t('Monthly Income')}</p>
                                <div className="relative">
                                    <p className="text-2xl font-bold text-green-600 group-hover:opacity-0 transition-opacity duration-300">
                                        {formatNumber(monthlyIncome)}
                                    </p>
                                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {formatNumber(monthlyIncome)}
                                    </p>
                                </div>
                                <div className="h-1.5 w-16 bg-green-100 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Rent/Outcome */}
                        <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-50 p-6 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-yellow-200 hover:bg-gradient-to-br hover:from-white hover:to-yellow-50/50 transform hover:-translate-y-1">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                            <div className="absolute top-0 right-0 mt-6 mr-6">
                                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-xl transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-md">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                            <div className="space-y-3 pr-16">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{t('Monthly Rent')}</p>
                                <div className="relative">
                                    <p className="text-2xl font-bold text-yellow-600 group-hover:opacity-0 transition-opacity duration-300">
                                        {formatNumber(monthlyOutcome)}
                                    </p>
                                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {formatNumber(monthlyOutcome)}
                                    </p>
                                </div>
                                <div className="h-1.5 w-16 bg-yellow-100 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table section */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 mb-12">
                        <div className="flex flex-wrap justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{t('Income History')}</h2>
                                <p className="text-sm text-gray-500">{t('Manage and track your income transactions')}</p>
                            </div>
                            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                                        placeholder={t('Search transactions...')}
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <button className="inline-flex items-center p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200">
                                        <Filter className="h-4 w-4" />
                                    </button>
                                    <button className="inline-flex items-center p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200">
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-8">
                            <div className="inline-block min-w-full align-middle px-8">
                                <div className="overflow-hidden border border-gray-200 rounded-xl shadow-md">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Description')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Amount')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Status')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {incomes.data && incomes.data.length > 0 ? (
                                                incomes.data.map((income) => (
                                                    <tr key={income.id} className="hover:bg-indigo-50/30 transition-colors duration-200">
                                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-800">
                                                            <div className="font-semibold">{income.description || t('Income payment')}</div>
                                                            <div className="text-gray-500 text-xs mt-1">{new Date(income.date).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-base font-medium text-gray-900">${formatNumber(income.amount)}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
                                                                ${income.status === 'approved'
                                                                    ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20'
                                                                    : income.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20'
                                                                        : 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
                                                                }`}>
                                                                {income.status === 'approved' && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                                                                {income.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1.5" />}
                                                                {income.status.charAt(0).toUpperCase() + income.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                                                            {income.status === 'pending' && (
                                                                <Link
                                                                    href={route('customer.accounts.incomes.approve', {account: account.id, income: income.id})}
                                                                    method="post"
                                                                    as="button"
                                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                                >
                                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                                    {t('Approve')}
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">
                                                        <div className="flex flex-col items-center">
                                                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                                                <svg className="h-14 w-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-base font-medium text-gray-600 mb-1">{t('No income transactions found')}</p>
                                                            <p className="text-sm text-gray-500 mb-4">{t('Start by adding your first income transaction')}</p>
                                                            <button
                                                                onClick={() => setShowCreateIncomeModal(true)}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                                            >
                                                                <Plus className="w-4 h-4 mr-2" />
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
                            <div className="px-6 py-6 border-t border-gray-200 mt-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="text-sm text-gray-700">
                                            {t('Showing')} <span className="font-semibold">{incomes.from}</span> {t('to')} <span className="font-semibold">{incomes.to}</span> {t('of')} <span className="font-semibold">{incomes.total}</span> {t('results')}
                                        </p>
                                    </div>
                                    <nav className="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <Link
                                            href={incomes.prev_page_url}
                                            className={`relative inline-flex items-center px-4 py-2 rounded-l-lg border ${!incomes.prev_page_url ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors'}`}
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
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 font-semibold'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors'
                                                }`}
                                            >
                                                {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                            </Link>
                                        ))}

                                        <Link
                                            href={incomes.next_page_url}
                                            className={`relative inline-flex items-center px-4 py-2 rounded-r-lg border ${!incomes.next_page_url ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors'}`}
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

                    {/* Rent/Loan History Table */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                        <div className="flex flex-wrap justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{t('Rent & Loan History')}</h2>
                                <p className="text-sm text-gray-500">{t('Track your rental payments and loan records')}</p>
                            </div>
                            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm"
                                        placeholder={t('Search loans & rents...')}
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <button className="inline-flex items-center p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200">
                                        <Filter className="h-4 w-4" />
                                    </button>
                                    <button className="inline-flex items-center p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200">
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-8">
                            <div className="inline-block min-w-full align-middle px-8">
                                <div className="overflow-hidden border border-gray-200 rounded-xl shadow-md">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Description')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Reference')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Amount')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Status')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                    {t('Actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {outcomes.data && outcomes.data.length > 0 ? (
                                                outcomes.data.map((outcome) => (
                                                    <tr key={outcome.id} className="hover:bg-pink-50/30 transition-colors duration-200">
                                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-800">
                                                            <div className="font-semibold">{outcome.description || t('Rent payment')}</div>
                                                            <div className="text-gray-500 text-xs mt-1">{new Date(outcome.date).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded-md inline-flex">
                                                                {outcome.reference_number || '-'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-base font-medium text-red-600">${formatNumber(outcome.amount)}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
                                                                ${outcome.status === 'approved'
                                                                    ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-600/20'
                                                                    : outcome.status === 'pending'
                                                                        ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20'
                                                                        : 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
                                                                }`}>
                                                                {outcome.status === 'approved' && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                                                                {outcome.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1.5" />}
                                                                {outcome.status.charAt(0).toUpperCase() + outcome.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                                                            {outcome.status === 'pending' && (
                                                                <Link
                                                                    href={route('customer.accounts.outcomes.approve', {account: account.id, outcome: outcome.id})}
                                                                    method="post"
                                                                    as="button"
                                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                                >
                                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                                    {t('Approve')}
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                                                        <div className="flex flex-col items-center">
                                                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                                                <ReceiptText className="h-14 w-14 text-gray-400" />
                                                            </div>
                                                            <p className="text-base font-medium text-gray-600 mb-1">{t('No rent or loan transactions found')}</p>
                                                            <p className="text-sm text-gray-500 mb-4">{t('Add your first rental or loan payment')}</p>
                                                            <button
                                                                onClick={() => setShowCreateOutcomeModal(true)}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 shadow-sm hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                                            >
                                                                <Plus className="w-4 h-4 mr-2" />
                                                                {t('Add Rent/Loan')}
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

                        {/* Pagination for outcomes */}
                        {activeTab === 'outcomes' && outcomes.links && outcomes.links.length > 3 && (
                            <div className="px-6 py-6 border-t border-gray-200 mt-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="text-sm text-gray-700">
                                            {t('Showing')} <span className="font-semibold">{outcomes.from}</span> {t('to')} <span className="font-semibold">{outcomes.to}</span> {t('of')} <span className="font-semibold">{outcomes.total}</span> {t('results')}
                                        </p>
                                    </div>
                                    <nav className="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <Link
                                            href={outcomes.prev_page_url}
                                            className={`relative inline-flex items-center px-4 py-2 rounded-l-lg border ${!outcomes.prev_page_url ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 transition-colors'}`}
                                            disabled={!outcomes.prev_page_url}
                                        >
                                            <span className="sr-only">{t('Previous')}</span>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>

                                        {outcomes.links && outcomes.links.slice(1, -1).map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-pink-50 border-pink-500 text-pink-600 font-semibold'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 transition-colors'
                                                }`}
                                            >
                                                {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                            </Link>
                                        ))}

                                        <Link
                                            href={outcomes.next_page_url}
                                            className={`relative inline-flex items-center px-4 py-2 rounded-r-lg border ${!outcomes.next_page_url ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 transition-colors'}`}
                                            disabled={!outcomes.next_page_url}
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
                        {/* Background overlay with blur effect */}
                        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

                        {/* Modal positioning trick */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal container */}
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-fadeIn">
                            <div className="absolute top-0 right-0 pt-5 pr-5 z-10">
                                <button
                                    type="button"
                                    className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-600 focus:outline-none transform transition-all hover:rotate-90 hover:scale-110 hover:shadow-md"
                                    onClick={() => setShowCreateIncomeModal(false)}
                                >
                                    <span className="sr-only">{t('Close')}</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br from-indigo-100/60 to-blue-100/60 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-tr from-green-100/50 to-emerald-100/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                            <form onSubmit={handleCreateIncome} className="relative z-10">
                                {/* Modal Header */}
                                <div className="px-8 pt-8 pb-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-xl mr-4 shadow-lg">
                                            <DollarSign className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {t('Add New Income')}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{t('Create a new income transaction for your account')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="px-8 py-6 bg-gray-50/80 border-y border-gray-200">
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="source_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Source Number')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Shield className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="source_number"
                                                    className="bg-white/80 text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 pr-3 py-3 sm:text-sm border-gray-300 rounded-lg shadow-sm"
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
                                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="amount"
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg shadow-sm bg-white"
                                                    placeholder="0.00"
                                                    value={data.amount}
                                                    onChange={(e) => setData('amount', e.target.value)}
                                                    required
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 font-medium sm:text-sm">USD</span>
                                                </div>
                                            </div>
                                            {errors.amount && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
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
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="date"
                                                    className="bg-white/80 text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 pr-3 py-3 sm:text-sm border-gray-300 rounded-lg shadow-sm"
                                                    value={new Date().toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
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
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-3 px-4 sm:text-sm border-gray-300 rounded-lg shadow-sm bg-white"
                                                placeholder={t('Enter details about this income')}
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                required
                                            ></textarea>
                                            {errors.description && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-8 py-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 bg-white">
                                    <button
                                        type="button"
                                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        onClick={() => setShowCreateIncomeModal(false)}
                                    >
                                        {t('Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('Processing...')}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                {t('Create Income')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Outcome/Loan Modal */}
            {showCreateOutcomeModal && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay with blur effect */}
                        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

                        {/* Modal positioning trick */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal container */}
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-fadeIn">
                            <div className="absolute top-0 right-0 pt-5 pr-5 z-10">
                                <button
                                    type="button"
                                    className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-600 focus:outline-none transform transition-all hover:rotate-90 hover:scale-110 hover:shadow-md"
                                    onClick={() => setShowCreateOutcomeModal(false)}
                                >
                                    <span className="sr-only">{t('Close')}</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br from-red-100/60 to-pink-100/60 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-tr from-purple-100/50 to-pink-100/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                            <form onSubmit={handleCreateOutcome} className="relative z-10">
                                {/* Modal Header */}
                                <div className="px-8 pt-8 pb-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl mr-4 shadow-lg">
                                            <CardIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {t('Add Rent or Loan')}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{t('Record a new rent payment or loan transaction')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="px-8 py-6 bg-gray-50/80 border-y border-gray-200">
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Reference Number')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <ReceiptText className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="reference_number"
                                                    className="bg-white text-gray-700 focus:ring-red-500 focus:border-red-500 block w-full pl-11 pr-3 py-3 sm:text-sm border-gray-300 rounded-lg shadow-sm"
                                                    placeholder={t('Enter reference number')}
                                                    value={outcomeForm.data.reference_number}
                                                    onChange={(e) => outcomeForm.setData('reference_number', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Amount')} <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-lg shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="outcome_amount"
                                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-11 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg shadow-sm bg-white"
                                                    placeholder="0.00"
                                                    value={outcomeForm.data.amount}
                                                    onChange={(e) => outcomeForm.setData('amount', e.target.value)}
                                                    required
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 font-medium sm:text-sm">USD</span>
                                                </div>
                                            </div>
                                            {outcomeForm.errors.amount && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {outcomeForm.errors.amount}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="outcome_date" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Date')} <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    id="outcome_date"
                                                    className="bg-white text-gray-700 focus:ring-red-500 focus:border-red-500 block w-full pl-11 pr-3 py-3 sm:text-sm border-gray-300 rounded-lg shadow-sm"
                                                    value={outcomeForm.data.date}
                                                    onChange={(e) => outcomeForm.setData('date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {outcomeForm.errors.date && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {outcomeForm.errors.date}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="outcome_description" className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('Description')} <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="outcome_description"
                                                rows="3"
                                                className="focus:ring-red-500 focus:border-red-500 block w-full py-3 px-4 sm:text-sm border-gray-300 rounded-lg shadow-sm bg-white"
                                                placeholder={t('Enter details about this payment')}
                                                value={outcomeForm.data.description}
                                                onChange={(e) => outcomeForm.setData('description', e.target.value)}
                                                required
                                            ></textarea>
                                            {outcomeForm.errors.description && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {outcomeForm.errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-8 py-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 bg-white">
                                    <button
                                        type="button"
                                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        onClick={() => setShowCreateOutcomeModal(false)}
                                    >
                                        {t('Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={outcomeForm.processing}
                                        className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                                    >
                                        {outcomeForm.processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('Processing...')}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                {t('Create Payment')}
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
