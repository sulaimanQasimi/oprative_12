import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import {
    CreditCard,
    Save,
    ArrowLeft,
    User,
    ClipboardCheck,
    Home,
    Check,
    AlertCircle
} from 'lucide-react';

export default function CreateAccount() {
    const { t } = useLaravelReactI18n();
    const [formErrors, setFormErrors] = useState({});

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        id_number: '',
        address: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('customer.accounts.store'), {
            onSuccess: () => {
                reset('name', 'id_number', 'address');
            },
        });
    };

    return (
        <>
            <Head title={t('Create Account')} />
            <CustomerNavbar />

            <div className="container px-6 mx-auto">
                {/* Header with gradient background */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl font-bold text-white">{t('Create New Account')}</h2>
                            <p className="mt-2 text-indigo-100">
                                {t('Complete the form below to request a new banking account.')}
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                                <CreditCard className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Accounts Link */}
                <div className="mb-6">
                    <Link
                        href={route('customer.accounts.index')}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                    >
                        {t('Back to Accounts')}
                        <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                </div>

                {/* Account Creation Form */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="px-8 py-5 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <ClipboardCheck className="h-6 w-6 mr-2 text-indigo-600" />
                            {t('Account Details')}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            {/* Account Name */}
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('Account Name')} <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`pl-10 block w-full rounded-md ${errors.name ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm`}
                                        placeholder={t('Enter account name')}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* ID Number */}
                            <div className="sm:col-span-3">
                                <label htmlFor="id_number" className="block text-sm font-medium text-gray-700">
                                    {t('ID Number')} <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CreditCard className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="id_number"
                                        name="id_number"
                                        value={data.id_number}
                                        onChange={e => setData('id_number', e.target.value)}
                                        className={`pl-10 block w-full rounded-md ${errors.id_number ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm`}
                                        placeholder={t('Enter ID number')}
                                    />
                                </div>
                                {errors.id_number && (
                                    <p className="mt-2 text-sm text-red-600">{errors.id_number}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="sm:col-span-6">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    {t('Address')} <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Home className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="address"
                                        name="address"
                                        rows="3"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className={`pl-10 block w-full rounded-md ${errors.address ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm`}
                                        placeholder={t('Enter complete address')}
                                    />
                                </div>
                                {errors.address && (
                                    <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                                )}
                            </div>
                        </div>

                        {/* Notice Box */}
                        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-amber-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-amber-800">{t('Important Notice')}</h3>
                                    <div className="mt-2 text-sm text-amber-700">
                                        <p>{t('Your account request will be reviewed by our team. Once approved, you will be notified and the account will be activated.')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-start">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                            >
                                <Save className="h-5 w-5 mr-2" />
                                {processing ? t('Submitting...') : t('Submit Account Request')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
