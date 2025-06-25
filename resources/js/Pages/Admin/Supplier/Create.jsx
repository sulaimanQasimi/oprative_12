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
        id_number: "",
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
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }
                    .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
                        background-size: 20px 20px;
                    }
                    .dark .bg-grid-pattern {
                        background-image:
                            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    }
                    .glass-effect {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                    }
                    .dark .glass-effect {
                        background: rgba(15, 23, 42, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                    }
                    .form-section {
                        transition: all 0.3s ease;
                    }
                    .form-section:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    }
                    .dark .form-section:hover {
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-grid-pattern overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.suppliers" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header */}
                    <header className="glass-effect border-b border-slate-200/50 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95">
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
                                    <Button variant="outline" className="shadow-sm border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-800">
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
                                    <Card className="form-section border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
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
                                    <Card className="form-section border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
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

                                    {/* Action Buttons */}
                                    <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
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
