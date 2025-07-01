import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Truck,
    ArrowLeft,
    Edit,
    Plus,
    ShoppingBag,
    Calendar,
    DollarSign,
    Hash,
    Package,
    ChevronRight,
    ShoppingCart,
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

export default function Purchases({ auth, supplier, purchases = [], permissions = {} }) {
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
            <Head title={`${t("Supplier Purchases")}: ${supplier.name}`}>
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
                    <header className="bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route("admin.suppliers.show", supplier.id)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {t("Supplier Purchases")}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                            <Truck className="h-4 w-4" />
                                            {supplier.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Link href={route("admin.suppliers.show", supplier.id)}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-10 px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            {t("Back to Supplier")}
                                        </Button>
                                    </Link>
                                    {permissions.can_create && (
                                        <Button 
                                            size="sm"
                                            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            {t("New Purchase")}
                                        </Button>
                                    )}
                                </div>
                            </div>
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
                                            <ShoppingBag className="h-5 w-5 text-indigo-500" />
                                            {t("Purchase History")}
                                        </CardTitle>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
                                                {purchases.length} {t("Purchases")}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {purchases.length > 0 ? (
                                            <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                                {purchases.map((purchase) => (
                                                    <div key={purchase.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                                                    <ShoppingCart className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                                        {purchase.invoice_number ? `${t("Invoice")} #${purchase.invoice_number}` : `${t("Order")} #${purchase.id}`}
                                                                    </div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                        {purchase.status}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Date")}
                                                                </div>
                                                                <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                                    {formatDate(purchase.invoice_date)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Total")}
                                                                </div>
                                                                <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                    <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                                                                    {formatCurrency(purchase.total_amount)}
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
                                                                >
                                                                    {t("View Details")}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                                    <ShoppingBag className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                                    {t("No purchases found")}
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                                    {t("No purchase records found for this supplier. Create your first purchase using the button above.")}
                                                </p>
                                                {permissions.can_create && (
                                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        {t("Create First Purchase")}
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
