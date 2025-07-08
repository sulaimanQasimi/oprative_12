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
    Globe,
    User,
    Users,
    MapPinIcon as Address,
    Hash,
    Sparkles,
    Calendar,
    Activity,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        contact_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        image: "",
        id_number: "",
        // Bank information
        bank_name: "",
        bank_account_number: "",
        bank_account_name: "",
        bank_account_branch: "",
        bank_account_swift_code: "",
        bank_account_iban: "",
        // License information
        license_number: "",
        license_expiration_date: "",
        license_type: "",
        license_file: "",
        // Other information
        notes: "",
        status: "",
        type: "",
        website: "",
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
        pinterest: "",
        snapchat: "",
        telegram: "",
        whatsapp: "",
        // Personal information
        personal_id_number: "",
        personal_id_file: "",
        personal_id_type: "",
        personal_id_expiration_date: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.suppliers.store"));
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
            <Head title={t("Add Supplier")}>
                <style>{`
                    .scrollbar-thin::-webkit-scrollbar {
                        width: 6px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb {
                        background: rgba(148, 163, 184, 0.5);
                        border-radius: 3px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                        background: rgba(148, 163, 184, 0.7);
                    }
                    .dark .scrollbar-thin::-webkit-scrollbar-thumb {
                        background: rgba(71, 85, 105, 0.5);
                    }
                    .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                        background: rgba(71, 85, 105, 0.7);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.suppliers" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 px-8 sticky top-0 z-40">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25"></div>
                                    <div className="relative bg-white dark:bg-slate-900 p-3 rounded-lg">
                                        <Truck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                                            {t("Supply Chain Management")}
                                        </span>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            {t("New Supplier")}
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
                                        {t("Add New Supplier")}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                        {t("Create a new supplier profile and manage their information")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Link href={route("admin.suppliers.index")}>
                                    <Button variant="outline" className="shadow-sm border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-800">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        {t("Back to List")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8 max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Error Alert */}
                                {Object.keys(errors).length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-8"
                                    >
                                        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 shadow-lg">
                                            <AlertCircle className="h-5 w-5" />
                                            <AlertDescription className="text-sm font-medium">
                                                {t("Please correct the errors below to continue.")}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Basic Information */}
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 pb-6">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                    <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <span>{t("Basic Information")}</span>
                                                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                                                        {t("Essential supplier details and identification")}
                                                    </p>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Supplier Name */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Building className="h-4 w-4 text-slate-500" />
                                                        {t("Supplier Name")}
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData("name", e.target.value)}
                                                        placeholder={t("e.g. ABC Corporation")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.name
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    />
                                                    {errors.name && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.name}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Contact Person */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="contact_name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <User className="h-4 w-4 text-slate-500" />
                                                        {t("Contact Person")}
                                                    </Label>
                                                    <Input
                                                        id="contact_name"
                                                        type="text"
                                                        value={data.contact_name}
                                                        onChange={(e) => setData("contact_name", e.target.value)}
                                                        placeholder={t("e.g. John Doe")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.contact_name
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    />
                                                    {errors.contact_name && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.contact_name}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Email */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-slate-500" />
                                                        {t("Email Address")}
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData("email", e.target.value)}
                                                        placeholder={t("e.g. contact@supplier.com")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.email
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    />
                                                    {errors.email && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.email}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Phone */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-slate-500" />
                                                        {t("Phone Number")}
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        type="text"
                                                        value={data.phone}
                                                        onChange={(e) => setData("phone", e.target.value)}
                                                        placeholder={t("e.g. +1 234 567 8900")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.phone
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    />
                                                    {errors.phone && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.phone}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* ID Number */}
                                                <div className="space-y-3 lg:col-span-2">
                                                    <Label htmlFor="id_number" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-slate-500" />
                                                        {t("ID Number / Tax ID")}
                                                    </Label>
                                                    <Input
                                                        id="id_number"
                                                        type="text"
                                                        value={data.id_number}
                                                        onChange={(e) => setData("id_number", e.target.value)}
                                                        placeholder={t("e.g. TAX-123456789")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.id_number
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    />
                                                    {errors.id_number && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.id_number}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Address Information */}
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 pb-6">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <span>{t("Address Information")}</span>
                                                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                                                        {t("Location and contact details")}
                                                    </p>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Address */}
                                                <div className="space-y-3 lg:col-span-2">
                                                    <Label htmlFor="address" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Address className="h-4 w-4 text-slate-500" />
                                                        {t("Street Address")}
                                                    </Label>
                                                    <Textarea
                                                        id="address"
                                                        value={data.address}
                                                        onChange={(e) => setData("address", e.target.value)}
                                                        placeholder={t("e.g. 123 Business Street, Suite 100")}
                                                        rows={3}
                                                        className={`transition-all duration-200 resize-none ${
                                                            errors.address
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.address && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.address}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* City */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="city" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Building className="h-4 w-4 text-slate-500" />
                                                        {t("City")}
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        type="text"
                                                        value={data.city}
                                                        onChange={(e) => setData("city", e.target.value)}
                                                        placeholder={t("e.g. New York")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.city
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.city && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.city}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* State */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="state" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-slate-500" />
                                                        {t("State / Province")}
                                                    </Label>
                                                    <Input
                                                        id="state"
                                                        type="text"
                                                        value={data.state}
                                                        onChange={(e) => setData("state", e.target.value)}
                                                        placeholder={t("e.g. NY")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.state
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.state && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.state}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Country */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="country" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("Country")}
                                                    </Label>
                                                    <Input
                                                        id="country"
                                                        type="text"
                                                        value={data.country}
                                                        onChange={(e) => setData("country", e.target.value)}
                                                        placeholder={t("e.g. United States")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.country
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.country && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.country}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Postal Code */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="postal_code" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-slate-500" />
                                                        {t("Postal Code")}
                                                    </Label>
                                                    <Input
                                                        id="postal_code"
                                                        type="text"
                                                        value={data.postal_code}
                                                        onChange={(e) => setData("postal_code", e.target.value)}
                                                        placeholder={t("e.g. 10001")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.postal_code
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.postal_code && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.postal_code}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Bank Information */}
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 pb-6">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                    <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <span>{t("Bank Information")}</span>
                                                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                                                        {t("Bank account and payment details")}
                                                    </p>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Bank Name */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="bank_name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Building className="h-4 w-4 text-slate-500" />
                                                        {t("Bank Name")}
                                                    </Label>
                                                    <Input
                                                        id="bank_name"
                                                        type="text"
                                                        value={data.bank_name}
                                                        onChange={(e) => setData("bank_name", e.target.value)}
                                                        placeholder={t("e.g. National Bank")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.bank_name
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-green-500/20 focus:border-green-500"
                                                        }`}
                                                    />
                                                    {errors.bank_name && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.bank_name}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Bank Account Number */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="bank_account_number" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-slate-500" />
                                                        {t("Account Number")}
                                                    </Label>
                                                    <Input
                                                        id="bank_account_number"
                                                        type="text"
                                                        value={data.bank_account_number}
                                                        onChange={(e) => setData("bank_account_number", e.target.value)}
                                                        placeholder={t("e.g. 1234567890")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.bank_account_number
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-green-500/20 focus:border-green-500"
                                                        }`}
                                                    />
                                                    {errors.bank_account_number && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.bank_account_number}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Bank Account Name */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="bank_account_name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <User className="h-4 w-4 text-slate-500" />
                                                        {t("Account Holder Name")}
                                                    </Label>
                                                    <Input
                                                        id="bank_account_name"
                                                        type="text"
                                                        value={data.bank_account_name}
                                                        onChange={(e) => setData("bank_account_name", e.target.value)}
                                                        placeholder={t("e.g. John Doe")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.bank_account_name
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-green-500/20 focus:border-green-500"
                                                        }`}
                                                    />
                                                    {errors.bank_account_name && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.bank_account_name}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Bank Branch */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="bank_account_branch" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-slate-500" />
                                                        {t("Branch")}
                                                    </Label>
                                                    <Input
                                                        id="bank_account_branch"
                                                        type="text"
                                                        value={data.bank_account_branch}
                                                        onChange={(e) => setData("bank_account_branch", e.target.value)}
                                                        placeholder={t("e.g. Main Branch")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.bank_account_branch
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-green-500/20 focus:border-green-500"
                                                        }`}
                                                    />
                                                    {errors.bank_account_branch && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.bank_account_branch}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* SWIFT Code */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="bank_account_swift_code" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-slate-500" />
                                                        {t("SWIFT Code")}
                                                    </Label>
                                                    <Input
                                                        id="bank_account_swift_code"
                                                        type="text"
                                                        value={data.bank_account_swift_code}
                                                        onChange={(e) => setData("bank_account_swift_code", e.target.value)}
                                                        placeholder={t("e.g. NBOCCATT")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.bank_account_swift_code
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-green-500/20 focus:border-green-500"
                                                        }`}
                                                    />
                                                    {errors.bank_account_swift_code && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.bank_account_swift_code}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* IBAN */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="bank_account_iban" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-slate-500" />
                                                        {t("IBAN")}
                                                    </Label>
                                                    <Input
                                                        id="bank_account_iban"
                                                        type="text"
                                                        value={data.bank_account_iban}
                                                        onChange={(e) => setData("bank_account_iban", e.target.value)}
                                                        placeholder={t("e.g. SA0380000000608010167519")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.bank_account_iban
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-green-500/20 focus:border-green-500"
                                                        }`}
                                                    />
                                                    {errors.bank_account_iban && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.bank_account_iban}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* License Information */}
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 pb-6">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div>
                                                    <span>{t("License Information")}</span>
                                                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                                                        {t("Business license and legal documents")}
                                                    </p>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* License Number */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="license_number" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-slate-500" />
                                                        {t("License Number")}
                                                    </Label>
                                                    <Input
                                                        id="license_number"
                                                        type="text"
                                                        value={data.license_number}
                                                        onChange={(e) => setData("license_number", e.target.value)}
                                                        placeholder={t("e.g. LIC-123456789")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.license_number
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-purple-500/20 focus:border-purple-500"
                                                        }`}
                                                    />
                                                    {errors.license_number && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.license_number}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* License Type */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="license_type" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-slate-500" />
                                                        {t("License Type")}
                                                    </Label>
                                                    <Input
                                                        id="license_type"
                                                        type="text"
                                                        value={data.license_type}
                                                        onChange={(e) => setData("license_type", e.target.value)}
                                                        placeholder={t("e.g. Commercial License")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.license_type
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-purple-500/20 focus:border-purple-500"
                                                        }`}
                                                    />
                                                    {errors.license_type && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.license_type}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* License Expiration Date */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="license_expiration_date" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-slate-500" />
                                                        {t("Expiration Date")}
                                                    </Label>
                                                    <Input
                                                        id="license_expiration_date"
                                                        type="date"
                                                        value={data.license_expiration_date}
                                                        onChange={(e) => setData("license_expiration_date", e.target.value)}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.license_expiration_date
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-purple-500/20 focus:border-purple-500"
                                                        }`}
                                                    />
                                                    {errors.license_expiration_date && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.license_expiration_date}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* License File */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="license_file" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-slate-500" />
                                                        {t("License File")}
                                                    </Label>
                                                    <Input
                                                        id="license_file"
                                                        type="text"
                                                        value={data.license_file}
                                                        onChange={(e) => setData("license_file", e.target.value)}
                                                        placeholder={t("e.g. license.pdf")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.license_file
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-purple-500/20 focus:border-purple-500"
                                                        }`}
                                                    />
                                                    {errors.license_file && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.license_file}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Social Media & Website */}
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 pb-6">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <span>{t("Social Media & Website")}</span>
                                                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                                                        {t("Online presence and social media links")}
                                                    </p>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Website */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="website" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("Website")}
                                                    </Label>
                                                    <Input
                                                        id="website"
                                                        type="url"
                                                        value={data.website}
                                                        onChange={(e) => setData("website", e.target.value)}
                                                        placeholder={t("e.g. https://www.example.com")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.website
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.website && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.website}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Facebook */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="facebook" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("Facebook")}
                                                    </Label>
                                                    <Input
                                                        id="facebook"
                                                        type="url"
                                                        value={data.facebook}
                                                        onChange={(e) => setData("facebook", e.target.value)}
                                                        placeholder={t("e.g. https://facebook.com/company")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.facebook
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.facebook && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.facebook}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Instagram */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="instagram" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("Instagram")}
                                                    </Label>
                                                    <Input
                                                        id="instagram"
                                                        type="url"
                                                        value={data.instagram}
                                                        onChange={(e) => setData("instagram", e.target.value)}
                                                        placeholder={t("e.g. https://instagram.com/company")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.instagram
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.instagram && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.instagram}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Twitter */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="twitter" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("Twitter")}
                                                    </Label>
                                                    <Input
                                                        id="twitter"
                                                        type="url"
                                                        value={data.twitter}
                                                        onChange={(e) => setData("twitter", e.target.value)}
                                                        placeholder={t("e.g. https://twitter.com/company")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.twitter
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.twitter && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.twitter}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* LinkedIn */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="linkedin" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("LinkedIn")}
                                                    </Label>
                                                    <Input
                                                        id="linkedin"
                                                        type="url"
                                                        value={data.linkedin}
                                                        onChange={(e) => setData("linkedin", e.target.value)}
                                                        placeholder={t("e.g. https://linkedin.com/company/company")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.linkedin
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.linkedin && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.linkedin}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* YouTube */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="youtube" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("YouTube")}
                                                    </Label>
                                                    <Input
                                                        id="youtube"
                                                        type="url"
                                                        value={data.youtube}
                                                        onChange={(e) => setData("youtube", e.target.value)}
                                                        placeholder={t("e.g. https://youtube.com/@company")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.youtube
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.youtube && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.youtube}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* TikTok */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="tiktok" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("TikTok")}
                                                    </Label>
                                                    <Input
                                                        id="tiktok"
                                                        type="url"
                                                        value={data.tiktok}
                                                        onChange={(e) => setData("tiktok", e.target.value)}
                                                        placeholder={t("e.g. https://tiktok.com/@company")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.tiktok
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.tiktok && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.tiktok}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Pinterest */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="pinterest" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("Pinterest")}
                                                    </Label>
                                                    <Input
                                                        id="pinterest"
                                                        type="url"
                                                        value={data.pinterest}
                                                        onChange={(e) => setData("pinterest", e.target.value)}
                                                        placeholder={t("e.g. https://pinterest.com/company")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.pinterest
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.pinterest && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.pinterest}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Snapchat */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="snapchat" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("Snapchat")}
                                                    </Label>
                                                    <Input
                                                        id="snapchat"
                                                        type="text"
                                                        value={data.snapchat}
                                                        onChange={(e) => setData("snapchat", e.target.value)}
                                                        placeholder={t("e.g. company_username")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.snapchat
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.snapchat && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.snapchat}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Telegram */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="telegram" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("Telegram")}
                                                    </Label>
                                                    <Input
                                                        id="telegram"
                                                        type="text"
                                                        value={data.telegram}
                                                        onChange={(e) => setData("telegram", e.target.value)}
                                                        placeholder={t("e.g. @company_channel")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.telegram
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.telegram && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.telegram}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* WhatsApp */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="whatsapp" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-slate-500" />
                                                        {t("WhatsApp")}
                                                    </Label>
                                                    <Input
                                                        id="whatsapp"
                                                        type="text"
                                                        value={data.whatsapp}
                                                        onChange={(e) => setData("whatsapp", e.target.value)}
                                                        placeholder={t("e.g. +1234567890")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.whatsapp
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                                        }`}
                                                    />
                                                    {errors.whatsapp && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.whatsapp}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Personal Information */}
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 pb-6">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                    <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <span>{t("Personal Information")}</span>
                                                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                                                        {t("Personal identification and documents")}
                                                    </p>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Personal ID Number */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="personal_id_number" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-slate-500" />
                                                        {t("Personal ID Number")}
                                                    </Label>
                                                    <Input
                                                        id="personal_id_number"
                                                        type="text"
                                                        value={data.personal_id_number}
                                                        onChange={(e) => setData("personal_id_number", e.target.value)}
                                                        placeholder={t("e.g. 123456789")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.personal_id_number
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-orange-500/20 focus:border-orange-500"
                                                        }`}
                                                    />
                                                    {errors.personal_id_number && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.personal_id_number}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Personal ID Type */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="personal_id_type" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-slate-500" />
                                                        {t("ID Type")}
                                                    </Label>
                                                    <Input
                                                        id="personal_id_type"
                                                        type="text"
                                                        value={data.personal_id_type}
                                                        onChange={(e) => setData("personal_id_type", e.target.value)}
                                                        placeholder={t("e.g. National ID, Passport")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.personal_id_type
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-orange-500/20 focus:border-orange-500"
                                                        }`}
                                                    />
                                                    {errors.personal_id_type && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.personal_id_type}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Personal ID Expiration Date */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="personal_id_expiration_date" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-slate-500" />
                                                        {t("ID Expiration Date")}
                                                    </Label>
                                                    <Input
                                                        id="personal_id_expiration_date"
                                                        type="date"
                                                        value={data.personal_id_expiration_date}
                                                        onChange={(e) => setData("personal_id_expiration_date", e.target.value)}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.personal_id_expiration_date
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-orange-500/20 focus:border-orange-500"
                                                        }`}
                                                    />
                                                    {errors.personal_id_expiration_date && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.personal_id_expiration_date}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Personal ID File */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="personal_id_file" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-slate-500" />
                                                        {t("ID File")}
                                                    </Label>
                                                    <Input
                                                        id="personal_id_file"
                                                        type="text"
                                                        value={data.personal_id_file}
                                                        onChange={(e) => setData("personal_id_file", e.target.value)}
                                                        placeholder={t("e.g. id_document.pdf")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.personal_id_file
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-orange-500/20 focus:border-orange-500"
                                                        }`}
                                                    />
                                                    {errors.personal_id_file && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.personal_id_file}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Additional Information */}
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 pb-6">
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                                                    <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <span>{t("Additional Information")}</span>
                                                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                                                        {t("Additional details and notes")}
                                                    </p>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Status */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="status" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Activity className="h-4 w-4 text-slate-500" />
                                                        {t("Status")}
                                                    </Label>
                                                    <Input
                                                        id="status"
                                                        type="text"
                                                        value={data.status}
                                                        onChange={(e) => setData("status", e.target.value)}
                                                        placeholder={t("e.g. Active, Inactive")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.status
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-gray-500/20 focus:border-gray-500"
                                                        }`}
                                                    />
                                                    {errors.status && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.status}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Type */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="type" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Building className="h-4 w-4 text-slate-500" />
                                                        {t("Type")}
                                                    </Label>
                                                    <Input
                                                        id="type"
                                                        type="text"
                                                        value={data.type}
                                                        onChange={(e) => setData("type", e.target.value)}
                                                        placeholder={t("e.g. Manufacturer, Distributor")}
                                                        className={`h-12 transition-all duration-200 ${
                                                            errors.type
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-gray-500/20 focus:border-gray-500"
                                                        }`}
                                                    />
                                                    {errors.type && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.type}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Notes */}
                                                <div className="space-y-3 lg:col-span-2">
                                                    <Label htmlFor="notes" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-slate-500" />
                                                        {t("Notes")}
                                                    </Label>
                                                    <Textarea
                                                        id="notes"
                                                        value={data.notes}
                                                        onChange={(e) => setData("notes", e.target.value)}
                                                        placeholder={t("Additional notes about the supplier...")}
                                                        rows={4}
                                                        className={`transition-all duration-200 resize-none ${
                                                            errors.notes
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "focus:ring-gray-500/20 focus:border-gray-500"
                                                        }`}
                                                    />
                                                    {errors.notes && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.notes}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Action Buttons */}
                                    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <CardContent className="p-8">
                                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                                <Link href={route("admin.suppliers.index")}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                                                        disabled={processing}
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {processing ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            {t("Creating...")}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <Save className="h-4 w-4" />
                                                            {t("Create Supplier")}
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </form>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
