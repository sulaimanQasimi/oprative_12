import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import {
    CreditCard,
    Plus,
    FileText,
    DollarSign,
    MinusCircle,
    Check,
    Printer,
    Calendar,
    AlertCircle
} from 'lucide-react';

export default function AccountShow({
    account,
    incomes,
    outcomes,
    totalIncome,
    pendingIncome,
    monthlyIncome,
    yearlyIncome,
    totalOutcome,
    pendingOutcome,
    monthlyOutcome,
    yearlyOutcome,
    success,
    incomeByMonth
}) {
    const [activeTab, setActiveTab] = useState(window.location.search.includes('tab=outcomes') ? 'outcomes' : 'incomes');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(!!success);

    // Form for creating new income
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        description: ''
    });

    // Hide success message after 3 seconds
    React.useEffect(() => {
        if (showSuccessMessage) {
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.accounts.incomes.store', account.id), {
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
                setShowSuccessMessage(true);
            }
        });
    };

    return (
        <>
            <Head title={`Account: ${account.name}`} />
            <CustomerNavbar />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="md:flex md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex-1 min-w-0">
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 bg-gradient-to-l from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Customer Account
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full">
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{account.name} - {account.account_number}</p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 space-x-6">
                        <Link
                            href={route('customer.reports.account-statement', account.id)}
                            className="group relative inline-flex items-center px-6 py-2.5 border-2 border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ml-2"
                        >
                            <FileText className="ml-2 h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300" />
                            <span className="relative">Account Statement</span>
                        </Link>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="group relative inline-flex items-center px-6 py-2.5 border-2 border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ml-2"
                        >
                            <Plus className="ml-2 h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300" />
                            <span className="relative">Add New Income</span>
                        </button>
                        <Link
                            href={route('customer.accounts.index')}
                            className="group relative inline-flex items-center px-6 py-2.5 border-2 border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition-all duration-300 hover:scale-105 hover:shadow-md ml-2"
                        >
                            <span className="relative ml-2">Back to Accounts</span>
                        </Link>
                    </div>
                </div>

                {/* Success Message */}
                {showSuccessMessage && (
                    <div className="rounded-md bg-green-50 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Check className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Income */}
                    <div className="group relative bg-white rounded-2xl shadow-sm border border-indigo-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">Total Income</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalIncome)}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <DollarSign className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    {/* Total Rent/Outcome */}
                    <div className="group relative bg-white rounded-2xl shadow-sm border border-red-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-red-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-red-600">Total Rent</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalOutcome)}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <MinusCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    {/* Monthly Income */}
                    <div className="group relative bg-white rounded-2xl shadow-sm border border-green-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-green-600">Monthly Income</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlyIncome)}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Monthly Rent/Outcome */}
                    <div className="group relative bg-white rounded-2xl shadow-sm border border-yellow-50 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-yellow-600">Monthly Rent</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlyOutcome)}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <MinusCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
