import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Truck,
    ArrowLeft,
    Edit,
    Plus,
    CreditCard,
    Calendar,
    DollarSign,
    Hash,
    FileText,
    Info,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Payments({ auth, supplier, payments = [], permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    // Format currency helper
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(date);
    };

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={`${t("Supplier Payments")}: ${supplier.name}`}>
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
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.suppliers" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {t("Admin Panel")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Supplier Payments")}
                                    <ChevronRight className="h-5 w-5 text-slate-400" />
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        {supplier.name}
                                    </span>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.suppliers.show", supplier.id)}>
                                <Button
                                    variant="outline"
                                    className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    {t("Back to Supplier")}
                                </Button>
                            </Link>
                            {permissions.can_create && (
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("Add Payment")}
                                </Button>
                            )}
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6 max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-indigo-500" />
                                            {t("Payment History")}
                                        </CardTitle>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
                                                {payments.length} {t("Payments")}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {payments.length > 0 ? (
                                            <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                                {payments.map((payment) => (
                                                    <div key={payment.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                                                    <DollarSign className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                                        {formatCurrency(payment.amount)}
                                                                    </div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                        {payment.payment_method}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Date")}
                                                                </div>
                                                                <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                                    {formatDate(payment.payment_date)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Reference")}
                                                                </div>
                                                                <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                    <Hash className="h-3.5 w-3.5 text-slate-400" />
                                                                    {payment.reference_number || t("N/A")}
                                                                </div>
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Notes")}
                                                                </div>
                                                                <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate">
                                                                    <FileText className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                                                    <span className="truncate">
                                                                        {payment.notes || t("No notes provided")}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                    <CreditCard className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                                    {t("No payments found")}
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                                    {t("No payment records found for this supplier. Add your first payment using the button above.")}
                                                </p>
                                                {permissions.can_create && (
                                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        {t("Add First Payment")}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
