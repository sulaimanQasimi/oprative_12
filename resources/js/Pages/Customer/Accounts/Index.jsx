import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import {
    CreditCard,
    Plus,
    Search,
    X,
    Filter,
    ChevronRight,
    RefreshCw,
    DollarSign,
    ShieldCheck,
    User,
    Calendar,
    ArrowRight
} from 'lucide-react';

export default function AccountsIndex({ accounts, search_id_number, search_account_number, isFilterOpen, customer }) {
    const { t } = useLaravelReactI18n();
    const [filterOpen, setFilterOpen] = useState(isFilterOpen);

    return (
        <>
            <Head title={t('Bank Accounts')} />
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
                                {t('Banking Accounts Management')}
                            </h1>
                            <p className="text-indigo-100 text-lg max-w-2xl">
                                {t('Securely manage your bank accounts and track your financial transactions in one place.')}
                            </p>
                            <div className="flex items-center mt-6 gap-4">
                                <Link
                                    href={route('customer.accounts.create')}
                                    className="group relative inline-flex items-center px-6 py-3 text-base font-medium leading-6 text-white transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 overflow-hidden"
                                >
                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                    <Plus className="mr-2 h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                                    <span className="relative">{t('Create New Account')}</span>
                                </Link>
                                <span className="text-indigo-200 text-sm">{accounts.total} {t('Accounts Total')}</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                            <CreditCard className="h-16 w-16 text-white opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Total Accounts */}
                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100 transform hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">{t('Total Accounts')}</p>
                                <p className="text-2xl font-bold text-gray-900">{accounts.total}</p>
                                <p className="text-xs text-gray-500">{t('Across all statuses')}</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <CreditCard className="w-8 h-8 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    {/* Active Accounts */}
                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100 transform hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-green-600">{t('Active Accounts')}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {accounts.data.filter(account => account.status === 'active').length}
                                </p>
                                <p className="text-xs text-gray-500">{t('Ready for transactions')}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <ShieldCheck className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-100 transform hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-purple-600">{t('Customer Profile')}</p>
                                <p className="text-xl font-bold text-gray-900">{customer.name}</p>
                                <p className="text-xs text-gray-500">{t('Account Holder')}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <User className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions and Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    {/* Create Account Button */}
                    <Link
                        href={route('customer.accounts.create')}
                        className="group relative inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                        <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></span>
                        <Plus className="mr-2 h-4 w-4 text-white" />
                        <span className="relative">{t('Create New Account')}</span>
                    </Link>

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

                        <form action={route('customer.accounts.index')} method="GET" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ID Number Filter */}
                            <div>
                                <label htmlFor="search_id_number" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('ID Number')}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search_id_number"
                                        id="search_id_number"
                                        defaultValue={search_id_number}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg"
                                        placeholder={t('Search by ID number')}
                                    />
                                </div>
                            </div>

                            {/* Account Number Filter */}
                            <div>
                                <label htmlFor="search_account_number" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Account Number')}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search_account_number"
                                        id="search_account_number"
                                        defaultValue={search_account_number}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg"
                                        placeholder={t('Search by account number')}
                                    />
                                </div>
                            </div>

                            {/* Filter Actions */}
                            <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-4 mt-2">
                                <Link
                                    href={route('customer.accounts.resetFilters')}
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

                {/* Accounts List */}
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="px-8 py-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <CreditCard className="h-6 w-6 mr-2 text-indigo-600" />
                            {t('Your Banking Accounts')}
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Account Details')}
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Account Number')}
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Status')}
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Balance')}
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {accounts.data.length > 0 ? (
                                    accounts.data.map(account => (
                                        <tr key={account.id} className="group hover:bg-indigo-50/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mx-6 flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md group-hover:shadow-lg group-hover:from-violet-600 group-hover:to-purple-700 transition-all duration-300">
                                                        <CreditCard className="h-7 w-7" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-base font-medium text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{account.name}</div>
                                                        <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                            <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                            {account.created_at ? new Date(account.created_at).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 bg-gray-50 group-hover:bg-indigo-100 py-1.5 px-3 rounded-md inline-flex items-center transition-colors duration-300">
                                                    <CreditCard className="h-3.5 w-3.5 mr-1.5 text-gray-500 group-hover:text-indigo-600 transition-colors duration-300" />
                                                    {account.account_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                                                    account.status === 'active'
                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                } shadow-sm`}>
                                                    <span className={`flex h-2 w-2 rounded-full mr-1.5 ${
                                                        account.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}></span>
                                                    {account.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono bg-indigo-50 text-indigo-800 py-1.5 px-3 rounded-md border border-indigo-100 shadow-sm inline-flex items-center">
                                                    <DollarSign className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.balance || 0)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('customer.accounts.show', account.id)}
                                                    className="group relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md overflow-hidden"
                                                >
                                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                    <span className="relative">{t('View Details')}</span>
                                                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="max-w-sm mx-auto">
                                                <div className="flex justify-center mb-4">
                                                    <div className="p-4 bg-indigo-100 rounded-full">
                                                        <CreditCard className="h-10 w-10 text-indigo-600" />
                                                    </div>
                                                </div>
                                                <p className="text-lg font-medium text-gray-800 mb-1">
                                                    {t('No accounts found')}
                                                </p>
                                                <p className="text-gray-500 mb-6">
                                                    {t('Create a new account to get started with managing your finances.')}
                                                </p>
                                                <Link
                                                    href={route('customer.accounts.create')}
                                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 w-full"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    {t('Create Your First Account')}
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {accounts.links && accounts.links.length > 3 && (
                        <div className="px-8 py-6 border-t border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-700">
                                    {t('Showing')} <span className="font-medium text-indigo-700">{accounts.from}</span> {t('to')} <span className="font-medium text-indigo-700">{accounts.to}</span> {t('of')} <span className="font-medium text-indigo-700">{accounts.total}</span> {t('results')}
                                </div>

                                <nav className="relative z-0 inline-flex rounded-xl shadow-md -space-x-px overflow-hidden" aria-label="Pagination">
                                    {accounts.links.map((link, i) => {
                                        // Skip the "prev" and "next" labels for special styling
                                        if (i === 0 || i === accounts.links.length - 1) {
                                            return null;
                                        }

                                        // For number pagination links
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
                                        href={accounts.prev_page_url}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                            accounts.prev_page_url
                                                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!accounts.prev_page_url}
                                    >
                                        {t('Previous')}
                                    </Link>
                                    <Link
                                        href={accounts.next_page_url}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                                            accounts.next_page_url
                                                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!accounts.next_page_url}
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
