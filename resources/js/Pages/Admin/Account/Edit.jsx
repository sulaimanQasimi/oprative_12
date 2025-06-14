import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import { Save, ArrowLeft, CreditCard, MapPin, AlertCircle, Eye } from 'lucide-react';

export default function Edit({ account, customers, auth }) {
    const { t } = useLaravelReactI18n();
    const { data, setData, put, processing, errors } = useForm({
        name: account.name || '',
        id_number: account.id_number || '',
        account_number: account.account_number || '',
        customer_id: account.customer_id || '',
        address: account.address || '',
        status: account.status || 'pending',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);

    // Animation effect
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        put(route('admin.accounts.update', account.id), {
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    return (
        <>
            <Head title={t("Edit Account - :name", { name: account.name })}>
                <style>{`
                    .glass-effect {
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }

                    .dark .glass-effect {
                        background: rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={isLoading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.accounts" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('admin.accounts.index')}
                                    className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {t("Back to Accounts")}
                                </Link>
                                <div className="border-l border-gray-300 h-6"></div>
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t("Edit Account")}</h1>
                            </div>
                            <Link
                                href={route('admin.accounts.show', account.id)}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                {t("View Details")}
                            </Link>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-4xl mx-auto"
                            >
                                {/* Form */}
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50">
                                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                                        {/* Account Information Section */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                                <CreditCard className="w-5 h-5 mr-2" />
                                                {t("Account Information")}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t("Account Name")} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                                            errors.name ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                        placeholder={t("Enter account name")}
                                                        required
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t("Customer")} <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id="customer_id"
                                                        value={data.customer_id}
                                                        onChange={(e) => setData('customer_id', e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                                            errors.customer_id ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                        required
                                                    >
                                                        <option value="">{t("Select a customer")}</option>
                                                        {customers.map(customer => (
                                                            <option key={customer.id} value={customer.id}>
                                                                {customer.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.customer_id && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.customer_id}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="id_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t("ID Number")} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="id_number"
                                                        value={data.id_number}
                                                        onChange={(e) => setData('id_number', e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                                            errors.id_number ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                        placeholder={t("Enter ID number")}
                                                        required
                                                    />
                                                    {errors.id_number && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.id_number}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t("Account Number")} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="account_number"
                                                        value={data.account_number}
                                                        onChange={(e) => setData('account_number', e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                                            errors.account_number ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                        placeholder={t("Enter account number")}
                                                        required
                                                    />
                                                    {errors.account_number && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.account_number}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t("Status")} <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id="status"
                                                        value={data.status}
                                                        onChange={(e) => setData('status', e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                                            errors.status ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                        required
                                                    >
                                                        <option value="pending">{t("Pending")}</option>
                                                        <option value="active">{t("Active")}</option>
                                                        <option value="suspended">{t("Suspended")}</option>
                                                        <option value="closed">{t("Closed")}</option>
                                                    </select>
                                                    {errors.status && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.status}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t("Address")}
                                                    </label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                        <textarea
                                                            id="address"
                                                            value={data.address}
                                                            onChange={(e) => setData('address', e.target.value)}
                                                            rows={3}
                                                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                                                errors.address ? 'border-red-300' : 'border-gray-300'
                                                            }`}
                                                            placeholder={t("Enter address (optional)")}
                                                        />
                                                    </div>
                                                    {errors.address && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.address}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <Link
                                                href={route('admin.accounts.show', account.id)}
                                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                            >
                                                {t("Cancel")}
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={processing || isLoading}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing || isLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        {t("Updating...")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        {t("Update Account")}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
