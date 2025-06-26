import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Wallet as WalletIcon, ArrowUpRight } from 'lucide-react';
import Navigation from '@/Components/Warehouse/Navigation';
import { motion } from 'framer-motion';

const PageLoader = ({ isVisible }) => (
    <motion.div
        className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 z-50 flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'all' : 'none' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="absolute w-full h-full overflow-hidden">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-gradient-to-r from-emerald-400/10 via-teal-500/10 to-transparent h-[30vh] w-[100vw]"
                    style={{ top: `${10 + i * 20}%`, left: '-100%', transformOrigin: 'left center', rotate: `${-20 + i * 10}deg` }}
                    animate={{ left: ['100%', '-100%'] }}
                    transition={{ duration: 15 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 3 }}
                />
            ))}
        </div>
        <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1, x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.2 }}
                    animate={{ y: [null, `${-Math.random() * 100 - 50}%`], opacity: [null, 0] }}
                    transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, ease: 'linear' }}
                />
            ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
            <motion.div className="relative" animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <motion.div className="absolute w-64 h-64 rounded-full bg-emerald-600/5 filter blur-2xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div className="absolute w-72 h-72 rounded-full bg-teal-500/5 filter blur-2xl transform -translate-x-4 translate-y-4" animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
                <div className="relative flex items-center justify-center h-40 w-40">
                    <motion.div className="absolute h-full w-full rounded-full border-4 border-emerald-300/10" animate={{ rotate: 360 }} transition={{ duration: 20, ease: 'linear', repeat: Infinity }} />
                    <motion.div className="absolute h-[85%] w-[85%] rounded-full border-4 border-teal-400/20" animate={{ rotate: -360 }} transition={{ duration: 15, ease: 'linear', repeat: Infinity }} />
                    <motion.div className="absolute h-[70%] w-[70%] rounded-full border-4 border-emerald-400/30" animate={{ rotate: 360 }} transition={{ duration: 10, ease: 'linear', repeat: Infinity }} />
                    <motion.div className="absolute h-full w-full rounded-full border-4 border-r-emerald-400 border-t-transparent border-l-transparent border-b-transparent" animate={{ rotate: 360 }} transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }} />
                    <motion.div className="absolute h-full w-full rounded-full border-4 border-b-teal-400 border-t-transparent border-l-transparent border-r-transparent" animate={{ rotate: -180 }} transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
                    <motion.div className="relative z-10 bg-gradient-to-br from-emerald-500 to-teal-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl" animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                        <WalletIcon className="h-10 w-10 text-white drop-shadow-lg" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    </motion.div>
);

export default function WalletDeposit({ auth, warehouse, wallet }) {
    const { data, setData, post, processing, errors } = useForm({ amount: '', description: '' });
    const [loading, setLoading] = useState(true);
    useEffect(() => { const timer = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(timer); }, []);
    const [success, setSuccess] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('warehouse.wallet.deposit'), { onSuccess: () => setSuccess('Deposit successful!') });
    };
    return (
        <>
            <Head title={`Deposit to ${warehouse.name} Wallet`}>
                <style>{`
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }
                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>
            <PageLoader isVisible={loading} />
            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <Navigation auth={auth} currentRoute="warehouse.wallet" />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">Wallet</span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    Deposit to {warehouse.name} Wallet
                                </h1>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6 max-w-xl mx-auto">
                            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
                                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-5 py-3">
                                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <ArrowUpRight className="h-5 w-5 text-green-500" /> Deposit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                                        <div>
                                            <label className="block mb-1 font-medium">Amount (AFN)</label>
                                            <input type="number" min="0.01" step="0.01" className="w-full border rounded px-3 py-2" value={data.amount} onChange={e => setData('amount', e.target.value)} required />
                                            {errors.amount && <div className="text-red-600 text-xs mt-1">{errors.amount}</div>}
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Description</label>
                                            <input type="text" className="w-full border rounded px-3 py-2" value={data.description} onChange={e => setData('description', e.target.value)} />
                                            {errors.description && <div className="text-red-600 text-xs mt-1">{errors.description}</div>}
                                        </div>
                                        <Button type="submit" disabled={processing}>Deposit</Button>
                                        {success && <div className="text-green-600 mt-2">{success}</div>}
                                    </form>
                                    <div className="mt-4">
                                        <Link href={route('warehouse.wallet')} className="text-blue-600">Back to Wallet</Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
