import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Wallet as WalletIcon, ArrowDownRight, DollarSign, CreditCard, ArrowLeft, RefreshCw, AlertTriangle, Shield, TrendingDown, Zap } from 'lucide-react';
import CustomerNavbar from "@/Components/CustomerNavbar";
import { useLaravelReactI18n } from "laravel-react-i18n";

export default function WalletWithdraw({ auth, customer, wallet }) {
    const { t } = useLaravelReactI18n();
    const { data, setData, post, processing, errors } = useForm({ amount: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.wallet.withdraw'), {
            onSuccess: () => setSuccess('Withdrawal successful!'),
        });
    };

    return (
        <>
            <Head title={`Withdraw from ${customer.name} Wallet`}>
                <style>{`
                    .gradient-bg {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .gradient-card {
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    }
                    .gradient-success {
                        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    }
                    .gradient-warning {
                        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                    }
                    .glass-effect {
                        backdrop-filter: blur(20px);
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    .shadow-glow {
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    }
                    .shadow-glow-hover:hover {
                        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                        transform: translateY(-2px);
                    }
                `}</style>
            </Head>
            
            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-blue-950/20 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.wallet.withdraw"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Professional Header */}
                    <header className="glass-effect border-b border-white/20 py-6 px-8 flex items-center justify-between sticky top-0 z-30 shadow-glow">
                        <div className="flex items-center space-x-6">
                            <div className="relative flex flex-col">
                                <span className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
                                    {t("Wallet Management")}
                                </span>
                                <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-4">
                                    <div className="p-3 rounded-2xl gradient-card shadow-glow">
                                        <WalletIcon className="h-8 w-8 text-white" />
                                    </div>
                                    {t("Withdraw from")} {customer.name} {t("Wallet")}
                                    <Badge className="ml-4 gradient-success text-white border-0 px-6 py-2 text-lg font-bold shadow-glow">
                                        {t("Balance")}: {wallet.balance} AFN
                                    </Badge>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href={route('customer.wallet')}>
                                <Button variant="outline" className="border-white/20 text-slate-700 dark:text-slate-300 rounded-2xl flex items-center gap-3 px-6 py-3 glass-effect shadow-glow hover:bg-white/20">
                                    <ArrowLeft className="h-5 w-5" />
                                    {t("Back to Wallet")}
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-2 border-white/20 text-slate-700 dark:text-slate-300 rounded-2xl px-4 py-3 glass-effect shadow-glow hover:bg-white/20"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="h-4 w-4" />
                                {t("Refresh")}
                            </Button>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
                        <div className="max-w-4xl mx-auto relative">
                            {/* Background Elements */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/60 to-blue-50/60 dark:from-purple-900/30 dark:to-blue-900/30 pointer-events-none rounded-3xl"></div>
                            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/30 rounded-full filter blur-3xl pointer-events-none"></div>
                            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/30 rounded-full filter blur-3xl pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Current Balance Card */}
                                <div className="mb-8">
                                    <Card className="gradient-card text-white border-0 rounded-3xl shadow-glow overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                        <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-bl-full transform rotate-12 -translate-y-10 translate-x-10"></div>
                                        <div className="absolute right-6 bottom-6">
                                            <CreditCard className="h-20 w-20 text-white/80" />
                                        </div>
                                        <CardContent className="p-8 relative z-10">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="font-semibold text-xl">Available Balance</span>
                                                <div className="p-4 bg-white/20 rounded-2xl shadow-glow backdrop-blur-sm border border-white/20">
                                                    <WalletIcon className="h-8 w-8" />
                                                </div>
                                            </div>
                                            <div className="text-5xl font-bold mb-4">{wallet.balance} AFN</div>
                                            <div className="flex items-center gap-3 text-white/90 backdrop-blur-sm bg-white/10 py-3 px-4 rounded-2xl w-fit border border-white/20">
                                                <Shield className="h-5 w-5" />
                                                <span className="font-medium">Available for withdrawal</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Withdrawal Form */}
                                <div className="relative">
                                    <Card className="glass-effect border-white/20 shadow-glow rounded-3xl overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-purple-50/80 via-white to-blue-50/80 dark:from-purple-900/30 dark:via-slate-900 dark:to-blue-900/30 border-b border-white/20 px-8 py-6">
                                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                                <div className="p-3 gradient-card rounded-2xl shadow-glow">
                                                    <ArrowDownRight className="h-8 w-8 text-white" />
                                                </div>
                                                Withdraw Funds
                                            </CardTitle>
                                            <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
                                                Withdraw funds from your wallet (ensure sufficient balance)
                                            </p>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <form onSubmit={handleSubmit} className="space-y-8">
                                                <div>
                                                    <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                                        Amount (AFN) <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <DollarSign className="h-6 w-6 text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            max={wallet.balance}
                                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-slate-700 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 text-xl font-medium shadow-glow backdrop-blur-sm"
                                                            placeholder="Enter amount to withdraw"
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
                                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        Available balance: {wallet.balance} AFN
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                                        Description (Optional)
                                                    </label>
                                                    <textarea
                                                        rows={4}
                                                        className="w-full px-6 py-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-slate-700 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 resize-none shadow-glow backdrop-blur-sm text-base"
                                                        placeholder="Enter a description for this withdrawal..."
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
                                                        disabled={processing || Number(data.amount) > wallet.balance}
                                                        className="flex-1 gradient-card text-white font-semibold py-4 rounded-2xl shadow-glow transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
                                                    >
                                                        {processing ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                Processing...
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-3">
                                                                <ArrowDownRight className="h-6 w-6" />
                                                                Withdraw Funds
                                                            </div>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>

                                {success && (
                                    <div className="gradient-success text-white border-0 rounded-2xl p-6 mt-8 shadow-glow">
                                        <div className="flex items-center gap-3">
                                            <div className="h-3 w-3 rounded-full bg-white"></div>
                                            <span className="font-semibold text-lg">{success}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 