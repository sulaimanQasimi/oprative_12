import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Truck,
    ArrowLeft,
    Edit,
    Building,
    Mail,
    Phone,
    MapPin,
    FileText,
    CreditCard,
    BookOpen,
    Globe,
    Trash2,
    CreditCard as PaymentIcon,
    ShoppingBag,
    User,
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

export default function Show({ auth, supplier }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={`${t("Supplier")}: ${supplier.name}`}>
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
                                    {supplier.name}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.suppliers.index")}>
                                <Button
                                    variant="outline"
                                    className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    {t("Back to List")}
                                </Button>
                            </Link>
                            <Link href={route("admin.suppliers.edit", supplier.id)}>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Edit className="h-4 w-4 mr-2" />
                                    {t("Edit Supplier")}
                                </Button>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6 max-w-4xl mx-auto">
                            <div className="mb-6 flex justify-between">
                                <div className="flex space-x-2">
                                    <Link href={route("admin.suppliers.payments", supplier.id)}>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                            <PaymentIcon className="h-4 w-4 mr-2" />
                                            {t("View Payments")}
                                        </Button>
                                    </Link>
                                    <Link href={route("admin.suppliers.purchases", supplier.id)}>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            {t("View Purchases")}
                                        </Button>
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        href={route("admin.suppliers.destroy", supplier.id)}
                                        method="delete"
                                        as="button"
                                    >
                                        <Button
                                            variant="outline"
                                            className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {t("Delete Supplier")}
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <Truck className="h-5 w-5 text-indigo-500" />
                                            {t("Supplier Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                                        <Building className="h-3.5 w-3.5" />
                                                        {t("Supplier Name")}
                                                    </h3>
                                                    <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                                                        {supplier.name || t("Not provided")}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                                        <User className="h-3.5 w-3.5" />
                                                        {t("Contact Person")}
                                                    </h3>
                                                    <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                                                        {supplier.contact_name || t("Not provided")}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {t("Email Address")}
                                                    </h3>
                                                    <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                                                        {supplier.email || t("Not provided")}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {t("Phone Number")}
                                                    </h3>
                                                    <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                                                        {supplier.phone || t("Not provided")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {t("Address")}
                                                    </h3>
                                                    <p className="text-base font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line">
                                                        {supplier.address || t("Not provided")}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                                        <Globe className="h-3.5 w-3.5" />
                                                        {t("Location")}
                                                    </h3>
                                                    <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                                                        {[supplier.city, supplier.state, supplier.country].filter(Boolean).join(", ") || t("Not provided")}
                                                        {supplier.postal_code && <span className="ml-1">({supplier.postal_code})</span>}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                                        <FileText className="h-3.5 w-3.5" />
                                                        {t("ID Number / Tax ID")}
                                                    </h3>
                                                    <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                                                        {supplier.id_number || t("Not provided")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
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
