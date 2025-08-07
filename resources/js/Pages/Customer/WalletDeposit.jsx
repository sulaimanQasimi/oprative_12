import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Wallet as WalletIcon, ArrowUpRight, Plus, DollarSign, ArrowLeft, RefreshCw, Sparkles, Zap, Star } from 'lucide-react';
import CustomerNavbar from "@/Components/CustomerNavbar";
import { motion } from 'framer-motion';
import { useLaravelReactI18n } from "laravel-react-i18n";

const PageLoader = ({ isVisible }) => (
    <div className={`fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]"></div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex items-center justify-center h-48 w-48">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-30 blur-2xl"></div>
                <div className="relative z-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 h-24 w-24 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                    <WalletIcon className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
            </div>
            <div className="mt-8 text-white/90 text-lg font-medium">
                Loading Deposit Form...
            </div>
        </div>
    </div>
);

export default function WalletDeposit({ auth, customer, wallet }) {
    const { t } = useLaravelReactI18n();
    const { data, setData, post, processing, errors } = useForm({ amount: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.wallet.deposit'), {
            onSuccess: () => setSuccess('Deposit successful!'),
        });
    };

    return (
        <>
            <Head title={`Deposit to ${customer.name} Wallet`}>
                <style>{`
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 20px 20px;
                    }
                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                    .gradient-border {
                        background: linear-gradient(45deg, #10b981, #14b8a6, #06b6d4, #10b981);
                        background-size: 300% 300%;
                        animation: gradient-shift 3s ease infinite;
                    }
                    @keyframes gradient-shift {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                `}</style>
            </Head>
            <PageLoader isVisible={loading} />
            
            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-950 dark:via-emerald-950/20 dark:to-teal-950/20 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.wallet.deposit"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Premium Header */}
                    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 py-6 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xl">
                        <div className="flex items-center space-x-6">
                            <div className="relative flex flex-col">
                                <span className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                                    {t("Wallet Management")}
                                </span>
                                <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-xl">
                                        <WalletIcon className="h-8 w-8 text-white" />
                                    </div>
                                    {t("Deposit to")} {customer.name} {t("Wallet")}
                                    <Badge variant="outline" className="ml-4 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-400 dark:border-emerald-800 rounded-full px-6 py-2 text-lg font-bold shadow-lg">
                                        {t("Balance")}: {wallet.balance} AFN
                                    </Badge>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href={route('customer.wallet')}>
                                <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center gap-3 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800">
                                    <ArrowLeft className="h-5 w-5" />
                                    {t("Back to Wallet")}
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-3 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="h-5 w-5" />
                                {t("Refresh")}
                            </Button>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10">
                        <div className="max-w-4xl mx-auto relative">
                            {/* Premium Background Elements */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/60 to-teal-50/60 dark:from-slate-900/60 dark:to-slate-800/60 pointer-events-none"></div>
                            <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-200/50 dark:bg-emerald-900/40 rounded-full filter blur-3xl pointer-events-none"></div>
                            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-200/50 dark:bg-teal-900/40 rounded-full filter blur-3xl pointer-events-none"></div>
                            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-emerald-200/40 dark:bg-emerald-900/30 rounded-full filter blur-2xl pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Current Balance Card */}
                                <div className="mb-8">
                                    <Card className="bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white border-0 rounded-3xl shadow-2xl overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[1px] opacity-50"></div>
                                        <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-bl-full transform rotate-12 -translate-y-10 translate-x-10"></div>
                                        <div className="absolute right-6 bottom-6">
                                            <DollarSign className="h-20 w-20 text-white/20" />
                                        </div>
                                        <CardContent className="p-8 relative z-10">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="font-semibold text-xl">Current Balance</span>
                                                <div className="p-3 bg-white/20 rounded-2xl shadow-inner backdrop-blur-sm border border-white/20">
                                                    <WalletIcon className="h-7 w-7" />
                                                </div>
                                            </div>
                                            <div className="text-4xl font-bold mb-4">{wallet.balance} AFN</div>
                                            <div className="inline-flex items-center gap-2 text-sm text-white/90 backdrop-blur-sm bg-white/10 py-2 px-4 rounded-xl border border-white/20">
                                                <Sparkles className="h-4 w-4" />
                                                <span>Available for transactions</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Deposit Form */}
                                <div className="relative">
                                    <Card className="border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-3xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl">
                                        <CardHeader className="bg-gradient-to-r from-slate-50/90 to-emerald-50/90 dark:from-slate-800/90 dark:to-emerald-900/30 border-b border-slate-200/50 dark:border-slate-800/50 px-8 py-6">
                                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-xl">
                                                    <ArrowUpRight className="h-7 w-7 text-white" />
                                                </div>
                                                Deposit Funds
                                            </CardTitle>
                                            <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
                                                Add funds to your wallet for transactions and operations
                                            </p>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <form onSubmit={handleSubmit} className="space-y-8">
                                                <div>
                                                    <label className="block text-base font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                                        Amount (AFN) <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <DollarSign className="h-6 w-6 text-slate-400" />
                                                        </div>
                                                        <Input
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 text-lg font-medium shadow-lg"
                                                            placeholder="Enter amount to deposit"
                                                            value={data.amount}
                                                            onChange={e => setData('amount', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    {errors.amount && (
                                                        <div className="text-red-600 text-sm mt-3 flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                            {errors.amount}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-base font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                                        Description (Optional)
                                                    </label>
                                                    <Textarea
                                                        rows={4}
                                                        className="w-full px-4 py-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 resize-none shadow-lg"
                                                        placeholder="Enter a description for this deposit..."
                                                        value={data.description}
                                                        onChange={e => setData('description', e.target.value)}
                                                    />
                                                    {errors.description && (
                                                        <div className="text-red-600 text-sm mt-3 flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                            {errors.description}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 pt-6">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-800 text-white font-semibold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processing ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                Processing...
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-3">
                                                                <Plus className="h-6 w-6" />
                                                                Deposit Funds
                                                            </div>
                                                        )}
                                                    </Button>
                                                </div>

                                                {success && (
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 shadow-lg">
                                                        <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                                            <span className="font-semibold text-lg">{success}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 