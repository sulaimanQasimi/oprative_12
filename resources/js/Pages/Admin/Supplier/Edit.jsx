import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Truck,
    ArrowLeft,
    Save,
    AlertCircle,
    CheckCircle,
    X,
    Building,
    Mail,
    Phone,
    MapPin,
    FileText,
    CreditCard,
    BookOpen,
    Globe,
    Trash2,
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
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Edit({ auth, supplier }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: supplier.name || "",
        contact_name: supplier.contact_name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        city: supplier.city || "",
        state: supplier.state || "",
        country: supplier.country || "",
        postal_code: supplier.postal_code || "",
        id_number: supplier.id_number || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.suppliers.update", supplier.id));
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
            <Head title={t("Edit Supplier")}>
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
                                    {t("Edit Supplier")}
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
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6 max-w-4xl mx-auto">
                            <div className="mb-6 flex justify-between">
                                <div className="flex space-x-2">
                                    <Link href={route("admin.suppliers.show", supplier.id)}>
                                        <Button
                                            variant="outline"
                                            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                        >
                                            {t("View Details")}
                                        </Button>
                                    </Link>
                                    <Link href={route("admin.suppliers.payments", supplier.id)}>
                                        <Button
                                            variant="outline"
                                            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                        >
                                            {t("View Payments")}
                                        </Button>
                                    </Link>
                                    <Link href={route("admin.suppliers.purchases", supplier.id)}>
                                        <Button
                                            variant="outline"
                                            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                        >
                                            {t("View Purchases")}
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <Truck className="h-5 w-5 text-indigo-500" />
                                            {t("Supplier Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {Object.keys(errors).length > 0 && (
                                            <Alert
                                                variant="destructive"
                                                className="mb-6 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    {t(
                                                        "Please correct the errors below."
                                                    )}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Supplier Name */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="name"
                                                        className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                                                    >
                                                        <Building className="h-3.5 w-3.5 text-slate-500" />
                                                        {t("Supplier Name")}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            "e.g. ABC Corporation"
                                                        )}
                                                        className={
                                                            errors.name
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.name && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Email */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="email"
                                                        className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                                                    >
                                                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                                                        {t("Email Address")}
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData(
                                                                "email",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            "e.g. contact@supplier.com"
                                                        )}
                                                        className={
                                                            errors.email
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.email && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Phone */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="phone"
                                                        className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                                                    >
                                                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                                                        {t("Phone Number")}
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        type="text"
                                                        value={data.phone}
                                                        onChange={(e) =>
                                                            setData(
                                                                "phone",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            "e.g. +1 234 567 8900"
                                                        )}
                                                        className={
                                                            errors.phone
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.phone && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.phone}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Tax Number */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="id_number"
                                                        className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                                                    >
                                                        <FileText className="h-3.5 w-3.5 text-slate-500" />
                                                        {t("Tax Number")}
                                                    </Label>
                                                    <Input
                                                        id="id_number"
                                                        type="text"
                                                        value={data.id_number}
                                                        onChange={(e) =>
                                                            setData(
                                                                "id_number",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            "e.g. TAX123456789"
                                                        )}
                                                        className={
                                                            errors.id_number
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.id_number && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.id_number}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Website */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="website"
                                                        className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                                                    >
                                                        <Globe className="h-3.5 w-3.5 text-slate-500" />
                                                        {t("Website")}
                                                    </Label>
                                                    <Input
                                                        id="website"
                                                        type="url"
                                                        value={data.website}
                                                        onChange={(e) =>
                                                            setData(
                                                                "website",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            "e.g. https://supplier.com"
                                                        )}
                                                        className={
                                                            errors.website
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.website && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.website}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Bank Account */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="bank_account"
                                                        className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                                                    >
                                                        <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                                                        {t("Bank Account")}
                                                    </Label>
                                                    <Input
                                                        id="bank_account"
                                                        type="text"
                                                        value={data.bank_account}
                                                        onChange={(e) =>
                                                            setData(
                                                                "bank_account",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            "e.g. BANK1234567890"
                                                        )}
                                                        className={
                                                            errors.bank_account
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.bank_account && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.bank_account}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="address"
                                                    className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                                                >
                                                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                                    {t("Address")}
                                                </Label>
                                                <Textarea
                                                    id="address"
                                                    value={data.address}
                                                    onChange={(e) =>
                                                        setData(
                                                            "address",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={t(
                                                        "Enter the supplier's full address"
                                                    )}
                                                    rows={3}
                                                    className={
                                                        errors.address
                                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.address && (
                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                        {errors.address}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="description"
                                                    className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                                                >
                                                    <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                                                    {t("Description")}
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={t(
                                                        "Enter additional information about the supplier"
                                                    )}
                                                    rows={4}
                                                    className={
                                                        errors.description
                                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.description && (
                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-between">
                                                <div>
                                                    <Link
                                                        href={route(
                                                            "admin.suppliers.destroy",
                                                            supplier.id
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            {t(
                                                                "Delete Supplier"
                                                            )}
                                                        </Button>
                                                    </Link>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <Link
                                                        href={route(
                                                            "admin.suppliers.index"
                                                        )}
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                                        >
                                                            <X className="h-4 w-4 mr-2" />
                                                            {t("Cancel")}
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                    >
                                                        <Save className="h-4 w-4 mr-2" />
                                                        {processing
                                                            ? t("Saving...")
                                                            : t(
                                                                  "Update Supplier"
                                                              )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
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
