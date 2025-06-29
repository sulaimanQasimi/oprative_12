import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Wallet as WalletIcon, ArrowDownRight, DollarSign, CreditCard, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import CustomerNavbar from "@/Components/CustomerNavbar";
import { useLaravelReactI18n } from "laravel-react-i18n";
import anime from 'animejs';
import { motion } from 'framer-motion';

// Safe querySelector utility function
const safeQuerySelector = (element, selector) => {
    if (!element || !selector) return null;
    try {
        return element.querySelector(selector);
    } catch (error) {
        console.error("Error in querySelector:", error);
        return null;
    }
};

const PageLoader = ({ isVisible }) => (
    <motion.div
        className="fixed inset-0 bg-gradient-to-br from-rose-900 via-red-900 to-rose-950 z-50 flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'all' : 'none' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="relative z-10 flex flex-col items-center">
            <motion.div className="relative" animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="relative flex items-center justify-center h-40 w-40">
                    <motion.div className="relative z-10 bg-gradient-to-br from-rose-500 to-red-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl" animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                        <WalletIcon className="h-10 w-10 text-white drop-shadow-lg" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    </motion.div>
);

export default function WalletWithdraw({ auth, customer, wallet }) {
    const { t } = useLaravelReactI18n();
    const { data, setData, post, processing, errors } = useForm({ amount: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(null);
    const [isAnimated, setIsAnimated] = useState(false);

    // Refs for animation targets
    const headerRef = useRef(null);
    const formCardRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Initialize animations
    useEffect(() => {
        if (!isAnimated && !loading) {
            timelineRef.current = anime.timeline({
                easing: "easeOutExpo",
                duration: 800,
            });

            timelineRef.current.add({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600,
            });

            timelineRef.current.add(
                {
                    targets: formCardRef.current,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    scale: [0.95, 1],
                    duration: 700,
                },
                "-=400"
            );

            setIsAnimated(true);
        }
    }, [isAnimated, loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.wallet.withdraw'), {
            onSuccess: () => setSuccess('Withdrawal successful!'),
            onError: () => {
                // Add shake animation on error
                if (formCardRef.current) {
                    anime({
                        targets: formCardRef.current,
                        translateX: [0, -10, 10, -10, 10, 0],
                        duration: 500,
                        easing: "easeInOutQuart",
                    });
                }
            }
        });
    };

    return (
        <>
            <Head title={`Withdraw from ${customer.name} Wallet`}>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer { animation: shimmer 3s infinite; }
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }
                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                    .card-shine {
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                        animation: shimmer 3s infinite;
                    }
                `}</style>
            </Head>
            <PageLoader isVisible={loading} />
            
            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.wallet.withdraw"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <motion.header
                        ref={headerRef}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-0.5">
                                    {t("Wallet Management")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Withdraw from")} {customer.name} {t("Wallet")}
                                    <Badge variant="outline" className="ml-2 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 rounded-full">
                                        {t("Balance")}: {wallet.balance} AFN
                                    </Badge>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href={route('customer.wallet')}>
                                    <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg flex items-center gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Wallet")}
                                    </Button>
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                                    onClick={() => window.location.reload()}
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    {t("Refresh")}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-slate-50 dark:bg-slate-950">
                        <div className="max-w-2xl mx-auto relative">
                            {/* Background Elements */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/30 to-red-50/30 dark:from-slate-900/30 dark:to-slate-800/30 pointer-events-none"></div>
                            <div className="absolute -top-40 -left-40 w-80 h-80 bg-rose-200/30 dark:bg-rose-900/20 rounded-full filter blur-3xl animate-pulse pointer-events-none"></div>
                            <div
                                className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-200/30 dark:bg-red-900/20 rounded-full filter blur-3xl animate-pulse pointer-events-none"
                                style={{ animationDelay: "1s" }}
                            ></div>

                            <div className="relative z-10">
                    {/* Current Balance Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <Card className="bg-gradient-to-br from-rose-500 to-red-600 text-white border-0 rounded-2xl shadow-lg overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[1px] opacity-50"></div>
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full transform rotate-12 -translate-y-8 translate-x-8"></div>
                            <motion.div
                                initial={{ opacity: 0.1, scale: 0.8 }}
                                animate={{ opacity: [0.1, 0.15, 0.1], scale: [0.8, 0.9, 0.8] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute right-4 bottom-4"
                            >
                                <CreditCard className="h-16 w-16" />
                            </motion.div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-medium text-lg">Available Balance</span>
                                    <div className="p-2.5 bg-white/20 rounded-lg shadow-inner backdrop-blur-sm border border-white/10">
                                        <WalletIcon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold">{wallet.balance} AFN</div>
                                <div className="mt-4 text-sm flex items-center text-white/90 backdrop-blur-sm bg-white/10 py-1.5 px-3 rounded-lg w-fit border border-white/10">
                                    <span>Available for withdrawal</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Withdrawal Form */}
                    <motion.div
                        ref={formCardRef}
                        className="relative"
                    >
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden relative">
                            <div className="card-shine absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full pointer-events-none"></div>
                        <CardHeader className="bg-gradient-to-r from-rose-50 via-white to-rose-50 dark:from-slate-800/50 dark:via-slate-900 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-6 py-4 relative">
                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-rose-500 rounded-lg shadow-lg">
                                    <ArrowDownRight className="h-6 w-6 text-white" />
                                </div>
                                Withdraw Funds
                            </CardTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 relative z-10">
                                Withdraw funds from your wallet (ensure sufficient balance)
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Amount (AFN) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            max={wallet.balance}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all duration-200 text-lg font-medium"
                                            placeholder="Enter amount to withdraw"
                                            value={data.amount}
                                            onChange={e => setData('amount', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.amount && (
                                        <div className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                            <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                            {errors.amount}
                                        </div>
                                    )}
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Available balance: {wallet.balance} AFN
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all duration-200 resize-none"
                                        placeholder="Enter a description for this withdrawal..."
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                    {errors.description && (
                                        <div className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                            <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing || Number(data.amount) > wallet.balance}
                                        className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-medium py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <ArrowDownRight className="h-5 w-5" />
                                                Withdraw Funds
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        </Card>
                    </motion.div>

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mt-6"
                        >
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="font-medium">{success}</span>
                            </div>
                        </motion.div>
                    )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 