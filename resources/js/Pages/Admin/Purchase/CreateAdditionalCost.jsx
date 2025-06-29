import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Save,
    DollarSign,
    Sparkles,
    AlertCircle,
    FileText,
    Calculator,
    Receipt
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function CreateAdditionalCost({ auth, purchase, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        amount: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        router.post(route('admin.purchases.additional-costs.store', purchase.id), data, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                console.log('Submission errors:', errors);
                setLoading(false);
            },
            onSuccess: () => {
                setLoading(false);
            }
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: purchase.currency?.code || 'USD',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <>
            <Head title={`${t("Add Additional Cost")} - ${purchase.invoice_number}`} />
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .float-animation { animation: float 6s ease-in-out infinite; }
                .glass-effect { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
                .dark .glass-effect { background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px); }
                .gradient-border {
                    background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #f59e0b, #d97706) border-box;
                    border: 2px solid transparent;
                }
                .dark .gradient-border {
                    background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box, linear-gradient(45deg, #f59e0b, #d97706) border-box;
                }
            `}</style>

            <PageLoader isVisible={loading} icon={Receipt} color="orange" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.purchases" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-4 rounded-2xl shadow-2xl">
                                        <Receipt className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" /> {t("Add Additional Cost")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent"
                                    >
                                        {purchase.invoice_number}
                                    </motion.h1>
                                </div>
                            </div>

                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
                                <Link href={route("admin.purchases.show", purchase.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                                        <ArrowLeft className="h-4 w-4" /> {t("Back to Purchase")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-orange-300 dark:scrollbar-thumb-orange-700 scrollbar-track-transparent p-8">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-4xl mx-auto">
                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <Receipt className="h-6 w-6 text-orange-600" />
                                        {t("Add Additional Cost")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Name */}
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1, duration: 0.4 }}
                                            className="space-y-3"
                                        >
                                            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-orange-500" />
                                                {t("Cost Name")} *
                                            </Label>
                                            <div className="relative">
                                                <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder={t("Enter cost name (e.g., Shipping, Insurance, Tax)")}
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-orange-300 focus:border-orange-500'} bg-white dark:bg-slate-800`}
                                                />
                                            </div>
                                            {errors.name && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        {/* Amount */}
                                        <motion.div
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                            className="space-y-3"
                                        >
                                            <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-green-500" />
                                                {t("Amount")} *
                                            </Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder={t("Enter amount")}
                                                    value={data.amount}
                                                    onChange={(e) => setData('amount', e.target.value)}
                                                    className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.amount ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200 hover:border-green-300 focus:border-green-500'} bg-white dark:bg-slate-800`}
                                                />
                                            </div>
                                            {data.amount && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calculator className="w-4 h-4" />
                                                    <span>{t("Amount in")} {purchase.currency?.code}: {formatCurrency(data.amount)}</span>
                                                </div>
                                            )}
                                            {errors.amount && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.amount}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        <div className="flex justify-end space-x-4 pt-6">
                                            <Link href={route("admin.purchases.show", purchase.id)}>
                                                <Button type="button" variant="outline" className="px-8 py-3">
                                                    {t("Cancel")}
                                                </Button>
                                            </Link>
                                            <Button type="submit" disabled={processing} className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3">
                                                {processing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        {t("Saving...")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        {t("Add Cost")}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 