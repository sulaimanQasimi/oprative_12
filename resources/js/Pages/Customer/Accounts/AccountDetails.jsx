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
    ReceiptText,
    Printer
} from 'lucide-react';

export default function AccountDetails({ account, incomes, outcomes, totalIncome, pendingIncome,
                                 monthlyIncome, yearlyIncome, incomeByMonth, totalOutcome,
                                 pendingOutcome, monthlyOutcome, yearlyOutcome, tab, customer }) {
    const { t } = useLaravelReactI18n();
    const [activeTab, setActiveTab] = useState(tab);
    const [showCreateIncomeModal, setShowCreateIncomeModal] = useState(false);
    const [showCreateOutcomeModal, setShowCreateOutcomeModal] = useState(false);
    const [searchIncomeQuery, setSearchIncomeQuery] = useState('');
    const [searchOutcomeQuery, setSearchOutcomeQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        description: '',
    });

    const outcomeForm = useForm({
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
                            {/* Balance Card with Dynamic Background */}
                            {(() => {
                                const balance = totalIncome - totalOutcome;
                                let bgGradient, borderColor, iconGradient, iconColor, textColor, hoverBgGradient, title;

                                if (balance < 0) {
                                    // Negative balance - Red theme
                                    bgGradient = "from-red-50 to-red-100";
                                    borderColor = "border-red-200";
                                    iconGradient = "from-red-100 to-red-200";
                                    iconColor = "text-red-600";
                                    textColor = "text-red-600";
                                    hoverBgGradient = "hover:from-red-100 hover:to-red-50";
                                    title = t('Negative Balance');
                                } else if (balance === 0) {
                                    // Zero balance - Yellow theme
                                    bgGradient = "from-amber-50 to-amber-100";
                                    borderColor = "border-amber-200";
                                    iconGradient = "from-amber-100 to-amber-200";
                                    iconColor = "text-amber-600";
                                    textColor = "text-amber-600";
                                    hoverBgGradient = "hover:from-amber-100 hover:to-amber-50";
                                    title = t('Zero Balance');
                                } else {
                                    // Positive balance - Green theme
                                    bgGradient = "from-green-50 to-green-100";
                                    borderColor = "border-green-200";
                                    iconGradient = "from-green-100 to-green-200";
                                    iconColor = "text-green-600";
                                    textColor = "text-green-600";
                                    hoverBgGradient = "hover:from-green-100 hover:to-green-50";
                                    title = t('Positive Balance');
                                }

                                return (
                                    <div className={`bg-gradient-to-br ${bgGradient} rounded-xl shadow-lg px-5 py-4 flex items-center space-x-4 border ${borderColor} backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br ${hoverBgGradient} transform hover:scale-105`}>
                                        <div className={`bg-gradient-to-br ${iconGradient} p-3 rounded-xl shadow-md`}>
                                            <CreditCard className={`h-6 w-6 ${iconColor}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Account Balance')}</p>
                                            <p className={`text-xl font-bold ${textColor}`}>
                                                {balance < 0 && "-"}${formatNumber(Math.abs(balance))}
                                            </p>
                                            <p className="text-xs font-medium text-gray-400 mt-1">{title}</p>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="flex flex-wrap sm:flex-nowrap gap-3">
                                <a href={route('reports.account.statement', account.id)} target="_blank"
                                    className="inline-flex items-center px-5 py-3 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    {t('Export Statement')}
                                </a>
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
                            <div className="flex items-center">
                                <div className="mr-3 bg-gradient-to-br from-indigo-100 to-blue-100 p-2.5 rounded-xl shadow-md">
                                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                                </div>
                            <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
                                        {t('Income History')}
                                        <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            {incomes.data ? incomes.data.length : 0}
                                        </span>
                                    </h2>
                                <p className="text-sm text-gray-500">{t('Manage and track your income transactions')}</p>
                            </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
                                <div className="relative w-full sm:w-64 md:w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm bg-white backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                                        placeholder={t('Search transactions or reference number...')}
                                        value={searchIncomeQuery}
                                        onChange={(e) => setSearchIncomeQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setIsSearching(true);
                                            setTimeout(() => setIsSearching(false), 500);
                                        }}
                                        className="group relative inline-flex items-center p-2.5 border border-gray-200 rounded-xl bg-white text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <Search className={`h-4 w-4 transition-all duration-300 ${isSearching ? 'scale-110 text-indigo-500' : ''}`} />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">{t('Search')}</span>
                                    </button>
                                    <button className="group relative inline-flex items-center p-2.5 border border-gray-200 rounded-xl bg-white text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md">
                                        <Filter className="h-4 w-4 transition-transform group-hover:scale-110" />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">{t('Filter')}</span>
                                    </button>
                                    <button
                                        onClick={() => setSearchIncomeQuery('')}
                                        className={`group relative inline-flex items-center p-2.5 border border-gray-200 rounded-xl bg-white text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${searchIncomeQuery ? 'opacity-100' : 'opacity-50'}`}
                                    >
                                        <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">{t('Reset')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-8">
                            <div className="inline-block min-w-full align-middle px-8">
                                <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-lg bg-white backdrop-blur-sm">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                    {t('Description')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                    {t('Amount')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                    {t('Status')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                    {t('Actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {incomes.data && incomes.data.length > 0 ? (
                                                incomes.data
                                                .filter(income => {
                                                    if (!searchIncomeQuery) return true;
                                                    const searchText = searchIncomeQuery.toLowerCase();
                                                    return (
                                                        (income.description || '').toLowerCase().includes(searchText) ||
                                                        (income.id || '').toString().includes(searchText) ||
                                                        (income.amount || '').toString().includes(searchText)
                                                    );
                                                })
                                                .map((income) => (
                                                    <tr key={income.id} className="hover:bg-indigo-50/40 transition-all duration-200 border-b border-gray-50 last:border-b-0">
                                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-800">
                                                            <div className="font-semibold">{income.description || t('Income payment')}</div>
                                                            <div className="flex items-center text-gray-500 text-xs mt-1">
                                                                <Calendar className="w-3 h-3 mr-1 text-indigo-400" />
                                                                {new Date(income.date).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-base font-medium bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">${formatNumber(income.amount)}</div>
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
                                                            <div className="flex items-center justify-end space-x-2">
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

                                                                <a
                                                                    href={route('thermal.print.income', income.id)}
                                                                    target="_blank"
                                                                    className="inline-flex items-center px-2 py-2 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 group"
                                                                >
                                                                    <Printer className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-600" />

                                                                </a>
                                                            </div>
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
                            <div className="flex items-center">
                                <div className="mr-3 bg-gradient-to-br from-pink-100 to-red-100 p-2.5 rounded-xl shadow-md">
                                    <TrendingDown className="h-6 w-6 text-pink-600" />
                                </div>
                            <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
                                        {t('Rent & Loan History')}
                                        <span className="ml-2 bg-pink-100 text-pink-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                            <CardIcon className="w-3 h-3 mr-1" />
                                            {outcomes.data ? outcomes.data.length : 0}
                                        </span>
                                    </h2>
                                <p className="text-sm text-gray-500">{t('Track your rental payments and loan records')}</p>
                            </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
                                <div className="relative w-full sm:w-64 md:w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm bg-white backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                                        placeholder={t('Search by description or reference...')}
                                        value={searchOutcomeQuery}
                                        onChange={(e) => setSearchOutcomeQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setIsSearching(true);
                                            setTimeout(() => setIsSearching(false), 500);
                                        }}
                                        className="group relative inline-flex items-center p-2.5 border border-gray-200 rounded-xl bg-white text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <Search className={`h-4 w-4 transition-all duration-300 ${isSearching ? 'scale-110 text-pink-500' : ''}`} />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">{t('Search')}</span>
                                    </button>
                                    <button className="group relative inline-flex items-center p-2.5 border border-gray-200 rounded-xl bg-white text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 shadow-sm hover:shadow-md">
                                        <Filter className="h-4 w-4 transition-transform group-hover:scale-110" />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">{t('Filter')}</span>
                                    </button>
                                    <button
                                        onClick={() => setSearchOutcomeQuery('')}
                                        className={`group relative inline-flex items-center p-2.5 border border-gray-200 rounded-xl bg-white text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 shadow-sm hover:shadow-md ${searchOutcomeQuery ? 'opacity-100' : 'opacity-50'}`}
                                    >
                                        <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">{t('Reset')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-8">
                            <div className="inline-block min-w-full align-middle px-8">
                                <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-lg bg-white backdrop-blur-sm">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gradient-to-r from-pink-50 to-red-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-pink-600 uppercase tracking-wider">
                                                    {t('Description')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-pink-600 uppercase tracking-wider">
                                                    {t('Reference')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-pink-600 uppercase tracking-wider">
                                                    {t('Amount')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-pink-600 uppercase tracking-wider">
                                                    {t('Status')}
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-pink-600 uppercase tracking-wider">
                                                    {t('Actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {outcomes.data && outcomes.data.length > 0 ? (
                                                outcomes.data
                                                .filter(outcome => {
                                                    if (!searchOutcomeQuery) return true;
                                                    const searchText = searchOutcomeQuery.toLowerCase();
                                                    return (
                                                        (outcome.description || '').toLowerCase().includes(searchText) ||
                                                        (outcome.reference_number || '').toLowerCase().includes(searchText) ||
                                                        (outcome.amount || '').toString().includes(searchText) ||
                                                        (outcome.id || '').toString().includes(searchText)
                                                    );
                                                })
                                                .map((outcome) => (
                                                    <tr key={outcome.id} className="hover:bg-pink-50/40 transition-all duration-200 border-b border-gray-50 last:border-b-0">
                                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-800">
                                                            <div className="font-semibold">{outcome.description || t('Rent payment')}</div>
                                                            <div className="flex items-center text-gray-500 text-xs mt-1">
                                                                <Calendar className="w-3 h-3 mr-1 text-pink-400" />
                                                                {new Date(outcome.date).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2.5 py-1.5 rounded-lg inline-flex items-center border border-gray-100 shadow-sm">
                                                                <span className="text-xs text-pink-500 mr-1.5">#</span>
                                                                {outcome.reference_number || '-'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-base font-medium bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">${formatNumber(outcome.amount)}</div>
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
                                                            <div className="flex items-center justify-end space-x-2">
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

                                                                <a
                                                                    href={route('thermal.print.outcome', outcome.id)}
                                                                    target="_blank"
                                                                    className="inline-flex items-center px-2 py-2 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 group"
                                                                >
                                                                    <Printer className="w-3.5 h-3.5  text-pink-500 group-hover:text-pink-600" />

                                                                </a>
                                                            </div>
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
                <div className="fixed inset-0 overflow-y-auto z-50 animate-fadeIn">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay with enhanced blur effect */}
                        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-indigo-900/70 backdrop-blur-md transition-all duration-300"
                             aria-hidden="true"
                             onClick={() => setShowCreateIncomeModal(false)}></div>

                        {/* Modal positioning trick */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal container */}
                        <div className="inline-block align-bottom bg-white/95 backdrop-blur-sm rounded-3xl text-left rtl:text-right overflow-hidden shadow-2xl transform transition-all duration-500 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slideUp border border-indigo-100">
                            <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 pt-5 pr-5 rtl:pr-0 rtl:pl-5 z-10">
                                <button
                                    type="button"
                                    className="bg-white/80 backdrop-blur-sm rounded-full p-2.5 text-gray-400 hover:text-indigo-600 focus:outline-none transform transition-all hover:rotate-90 hover:scale-110 hover:shadow-lg border border-gray-100 shadow-sm"
                                    onClick={() => setShowCreateIncomeModal(false)}
                                >
                                    <span className="sr-only">{t('Close')}</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Enhanced decorative elements */}
                            <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-indigo-200/60 via-blue-200/50 to-indigo-100/60 rounded-full blur-3xl opacity-60 animate-pulse-slow pointer-events-none"></div>
                            <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tr from-emerald-200/50 via-green-200/40 to-teal-100/50 rounded-full blur-3xl opacity-60 animate-pulse-slow animation-delay-1000 pointer-events-none"></div>
                            <div className="absolute top-1/3 -right-16 w-32 h-32 bg-gradient-to-tr from-blue-300/30 to-indigo-200/30 rounded-full blur-2xl opacity-40 animate-pulse-slow animation-delay-2000 pointer-events-none"></div>
                            <div className="absolute bottom-1/3 -left-16 w-32 h-32 bg-gradient-to-tr from-green-300/30 to-emerald-200/30 rounded-full blur-2xl opacity-40 animate-pulse-slow animation-delay-3000 pointer-events-none"></div>

                            <form onSubmit={handleCreateIncome} className="relative z-10">
                                {/* Modal Header - Fixed RTL Layout */}
                                <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-white to-indigo-50/30">
                                    <div className="flex items-center mb-4 rtl:flex-row-reverse">
                                      
                                        <div className="rtl:text-right">
                                            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                                                {t('Add New Income')}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{t('Create a new income transaction for your account')}</p>
                                        </div>
                                          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3.5 rounded-2xl mr-4 rtl:mr-0 rtl:ml-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:rotate-3 hover:shadow-indigo-200/50">
                                            <DollarSign className="h-7 w-7 text-white drop-shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="px-8 py-6 bg-gradient-to-br from-gray-50/80 to-indigo-50/20 border-y border-indigo-100/50 shadow-inner">
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="source_number" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-1 rtl:text-right">
                                                {t('Source Number')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                                                    <Shield className="h-5 w-5 text-indigo-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="source_number"
                                                    className="bg-white/90 backdrop-blur-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 pr-3 py-3 sm:text-sm border-gray-200 rounded-xl shadow-sm transition-all duration-200 rtl:text-right rtl:pl-3 rtl:pr-11"
                                                    value={`S-${new Date().getTime().toString().slice(-8)}`}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-1 rtl:text-right">
                                                {t('Amount')} <span className="text-indigo-500">*</span>
                                            </label>
                                            <div className="relative rounded-xl shadow-sm">
                                                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                                                    <DollarSign className="h-5 w-5 text-indigo-400" />
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="amount"
                                                    className="focus:ring-indigo-500 focus:border-indigo-400 block w-full pl-11 pr-12 py-3 sm:text-sm border-gray-200 rounded-xl shadow-md bg-white/90 backdrop-blur-sm transition-all duration-200 focus:shadow-indigo-100 rtl:text-right rtl:pl-12 rtl:pr-11"
                                                    placeholder="0.00"
                                                    value={data.amount}
                                                    onChange={(e) => setData('amount', e.target.value)}
                                                    required
                                                />
                                                <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center pointer-events-none">
                                                    <span className="text-indigo-500 font-medium sm:text-sm bg-indigo-50 px-2 py-1 rounded-md">USD</span>
                                                </div>
                                            </div>
                                            {errors.amount && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5 rtl:mr-0 rtl:ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.amount}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-1 rtl:text-right">
                                                {t('Date')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-indigo-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="date"
                                                    className="bg-white/90 backdrop-blur-sm text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 pr-3 py-3 sm:text-sm border-gray-200 rounded-xl shadow-sm transition-all duration-200 rtl:text-right rtl:pl-3 rtl:pr-11"
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
                                            <label htmlFor="description" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-1 rtl:text-right">
                                                {t('Description')} <span className="text-indigo-500">*</span>
                                            </label>
                                            <textarea
                                                id="description"
                                                rows="3"
                                                className="focus:ring-indigo-500 focus:border-indigo-400 block w-full py-3 px-4 sm:text-sm border-gray-200 rounded-xl shadow-md bg-white/90 backdrop-blur-sm transition-all duration-200 focus:shadow-indigo-100 rtl:text-right"
                                                placeholder={t('Enter details about this income')}
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                required
                                            ></textarea>
                                            {errors.description && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5 rtl:mr-0 rtl:ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-8 py-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 rtl:sm:space-x-reverse bg-gradient-to-br from-white to-indigo-50/20 border-t border-indigo-100/50">
                                    <button
                                        type="button"
                                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                                        onClick={() => setShowCreateIncomeModal(false)}
                                    >
                                        {t('Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-100/60"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white rtl:-mr-1 rtl:ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('Processing...')}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
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
                <div className="fixed inset-0 overflow-y-auto z-50 animate-fadeIn">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay with enhanced blur effect */}
                        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-pink-900/70 backdrop-blur-md transition-all duration-300"
                             aria-hidden="true"
                             onClick={() => setShowCreateOutcomeModal(false)}></div>

                        {/* Modal positioning trick */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal container */}
                        <div className="inline-block align-bottom bg-white/95 backdrop-blur-sm rounded-3xl text-left rtl:text-right overflow-hidden shadow-2xl transform transition-all duration-500 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slideUp border border-pink-100">
                            <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 pt-5 pr-5 rtl:pr-0 rtl:pl-5 z-10">
                                <button
                                    type="button"
                                    className="bg-white/80 backdrop-blur-sm rounded-full p-2.5 text-gray-400 hover:text-pink-600 focus:outline-none transform transition-all hover:rotate-90 hover:scale-110 hover:shadow-lg border border-gray-100 shadow-sm"
                                    onClick={() => setShowCreateOutcomeModal(false)}
                                >
                                    <span className="sr-only">{t('Close')}</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Enhanced decorative elements */}
                            <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-pink-200/60 via-red-200/50 to-pink-100/60 rounded-full blur-3xl opacity-60 animate-pulse-slow pointer-events-none"></div>
                            <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tr from-purple-200/50 via-pink-200/40 to-red-100/50 rounded-full blur-3xl opacity-60 animate-pulse-slow animation-delay-1000 pointer-events-none"></div>
                            <div className="absolute top-1/3 -right-16 w-32 h-32 bg-gradient-to-tr from-red-300/30 to-pink-200/30 rounded-full blur-2xl opacity-40 animate-pulse-slow animation-delay-2000 pointer-events-none"></div>
                            <div className="absolute bottom-1/3 -left-16 w-32 h-32 bg-gradient-to-tr from-purple-300/30 to-pink-200/30 rounded-full blur-2xl opacity-40 animate-pulse-slow animation-delay-3000 pointer-events-none"></div>

                            <form onSubmit={handleCreateOutcome} className="relative z-10">
                                {/* Modal Header - Fixed RTL Layout */}
                                <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-white to-pink-50/30">
                                    <div className="flex items-center mb-4 rtl:flex-row-reverse">
                                      
                                        <div className="rtl:text-right">
                                            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                                                {t('Add Rent or Loan')}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{t('Record a new rent payment or loan transaction')}</p>
                                        </div>  
                                        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3.5 rounded-2xl mr-4 rtl:mr-0 rtl:ml-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:rotate-3 hover:shadow-pink-200/50">
                                            <CardIcon className="h-7 w-7 text-white drop-shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="px-8 py-6 bg-gradient-to-br from-gray-50/80 to-pink-50/20 border-y border-pink-100/50 shadow-inner">
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-1 rtl:text-right">
                                                {t('Amount')} <span className="text-pink-500">*</span>
                                            </label>
                                            <div className="relative rounded-xl shadow-sm">
                                                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                                                    <DollarSign className="h-5 w-5 text-pink-400" />
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="amount"
                                                    className="focus:ring-pink-500 focus:border-pink-400 block w-full pl-11 pr-12 py-3 sm:text-sm border-gray-200 rounded-xl shadow-md bg-white/90 backdrop-blur-sm transition-all duration-200 focus:shadow-pink-100 rtl:text-right rtl:pl-12 rtl:pr-11"
                                                    placeholder="0.00"
                                                    value={outcomeForm.data.amount}
                                                    onChange={(e) => outcomeForm.setData('amount', e.target.value)}
                                                    required
                                                />
                                                <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center pointer-events-none">
                                                    <span className="text-pink-500 font-medium sm:text-sm bg-pink-50 px-2 py-1 rounded-md">USD</span>
                                                </div>
                                            </div>
                                            {outcomeForm.errors.amount && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5 rtl:mr-0 rtl:ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {outcomeForm.errors.amount}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="reference_number" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-1 rtl:text-right">
                                                {t('Reference Number')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                                                    <ReceiptText className="h-5 w-5 text-pink-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="reference_number"
                                                    className="bg-gray-100 text-gray-500 block w-full pl-11 pr-3 py-3 sm:text-sm border-gray-200 rounded-lg shadow-sm rtl:text-right rtl:pl-3 rtl:pr-11"
                                                    value={t('Auto-generated by system')}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="outcome_date" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-1 rtl:text-right">
                                                {t('Date')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-pink-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="outcome_date"
                                                    className="bg-gray-100 text-gray-500 block w-full pl-11 pr-3 py-3 sm:text-sm border-gray-200 rounded-lg shadow-sm rtl:text-right rtl:pl-3 rtl:pr-11"
                                                    value={new Date().toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="outcome_description" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-1 rtl:text-right">
                                                {t('Description')} <span className="text-pink-500">*</span>
                                            </label>
                                            <textarea
                                                id="outcome_description"
                                                rows="3"
                                                className="focus:ring-pink-500 focus:border-pink-400 block w-full py-3 px-4 sm:text-sm border-gray-200 rounded-xl shadow-md bg-white/90 backdrop-blur-sm transition-all duration-200 focus:shadow-pink-100 rtl:text-right"
                                                placeholder={t('Enter details about this payment')}
                                                value={outcomeForm.data.description}
                                                onChange={(e) => outcomeForm.setData('description', e.target.value)}
                                                required
                                            ></textarea>
                                            {outcomeForm.errors.description && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                                                    <svg className="h-3.5 w-3.5 text-red-500 mr-1.5 rtl:mr-0 rtl:ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {outcomeForm.errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-8 py-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 rtl:sm:space-x-reverse bg-gradient-to-br from-white to-pink-50/20 border-t border-indigo-100/50">
                                    <button
                                        type="button"
                                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 transform hover:scale-105"
                                        onClick={() => setShowCreateOutcomeModal(false)}
                                    >
                                        {t('Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={outcomeForm.processing}
                                        className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                                    >
                                        {outcomeForm.processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white rtl:-mr-1 rtl:ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('Processing...')}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
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
