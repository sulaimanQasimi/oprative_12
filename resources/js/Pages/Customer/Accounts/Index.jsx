import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import {
    CreditCard,
    Plus,
    Search,
    X,
    Filter,
    ChevronRight
} from 'lucide-react';

export default function AccountsIndex({ accounts, search_id_number, search_account_number, isFilterOpen, customer }) {
    const [filterOpen, setFilterOpen] = useState(isFilterOpen);

    return (
        <>
            <Head title="Bank Accounts" />
            <CustomerNavbar />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="md:flex md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex-1 min-w-0">
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 bg-gradient-to-l from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Customer Accounts
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full">
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Manage your banking accounts</p>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 account-card">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="p-3 rounded-full bg-indigo-100 mb-4">
                                <Plus className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Create New Account</h3>
                            <p className="text-gray-600 text-sm mb-4">Add a new banking account to your profile</p>
                            <Link
                                href={route('customer.accounts.create')}
                                className="group relative px-4 py-2 text-sm font-medium leading-5 text-white transition-all duration-300 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 overflow-hidden shadow-md hover:shadow-lg"
                            >
                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-tilt"></span>
                                <span className="relative">Create Account</span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100">
                                    <CreditCard className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Accounts</p>
                                    <p className="text-2xl font-bold text-gray-900">{accounts.total}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <CreditCard className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Active Accounts</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {accounts.data.filter(account => account.status === 'active').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <CreditCard className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Customer Name</p>
                                    <p className="text-lg font-bold text-gray-900">{customer.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="mb-6">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        <span>{filterOpen ? 'Hide Filters' : 'Show Filters'}</span>
                    </button>

                    {filterOpen && (
                        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                            <form action={route('customer.accounts.index')} method="GET" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="search_id_number" className="block text-sm font-medium text-gray-700 mb-1">
                                        ID Number
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="search_id_number"
                                            id="search_id_number"
                                            defaultValue={search_id_number}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Search by ID"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="search_account_number" className="block text-sm font-medium text-gray-700 mb-1">
                                        Account Number
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="search_account_number"
                                            id="search_account_number"
                                            defaultValue={search_account_number}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Search by account #"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex justify-between">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Search className="h-4 w-4 mr-2" />
                                        Search
                                    </button>

                                    <Link
                                        href={route('customer.accounts.resetFilters')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Reset Filters
                                    </Link>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Accounts List */}
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl overflow-hidden mb-8 account-list">
                    <div className="px-8 py-5 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <CreditCard className="h-6 w-6 mr-2 text-indigo-600" />
                            Your Accounts
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Account
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Account Number
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Balance
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {accounts.data.length > 0 ? (
                                    accounts.data.map(account => (
                                        <tr key={account.id} className="hover:bg-indigo-50/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mx-6 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                                                        <CreditCard className="h-6 w-6" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-base font-medium text-gray-900">{account.name}</div>
                                                        <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                            {account.address ? account.address.substring(0, 30) : 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {account.account_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    account.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {account.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.balance)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('customer.accounts.show', account.id)}
                                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                                >
                                                    View Details
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                            No accounts found. Create a new account to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {accounts.links && (
                        <div className="px-6 py-4 bg-gray-50">
                            <nav className="flex items-center justify-between">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{accounts.from}</span> to <span className="font-medium">{accounts.to}</span> of <span className="font-medium">{accounts.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <div className="relative z-0 inline-flex shadow-sm rounded-md">
                                            {accounts.links.map((link, i) => (
                                                <Link
                                                    key={i}
                                                    href={link.url}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600 z-10'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${i === 0 ? 'rounded-l-md' : ''} ${i === accounts.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
