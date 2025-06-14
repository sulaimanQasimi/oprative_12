import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Store,
    ArrowLeft,
    Save,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    DollarSign,
    FileText,
    Building2,
    Sparkles,
    CheckCircle,
    AlertCircle,
    Info,
    Edit
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function EditCustomer({ auth, customer }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        status: customer.status || "active",
        notes: customer.notes || "",
    });

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.customers.update", customer.id), {
            onSuccess: () => {
                // Success handled automatically
            },
        });
    };

    return (
        <>
            <Head title={t("Edit Store")}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulse-glow 3s ease-in-out infinite;
                    }

                    .glass-effect {
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }

                    .dark .glass-effect {
                        background: rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                    }

                    .input-glow:focus {
                        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                        border-color: #10b981;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.customers" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
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
                                        <Edit className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Store Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent"
                                    >
                                        {t("Edit Store")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {t("Update store information for")} {customer.name}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.customers.show", customer.id)}>
                                    <Button variant="outline" className="gap-2 border-2 hover:border-orange-300">
                                        <Store className="h-4 w-4" />
                                        {t("View Store")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.customers.index")}>
                                    <Button variant="outline" className="gap-2 border-2 hover:border-orange-300">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Stores")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-orange-300 dark:scrollbar-thumb-orange-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-4xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Store Information Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                                                        <User className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Store Information")}
                                                    <Badge className="ml-auto bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.0, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <Store className="w-4 h-4 text-orange-600" />
                                                            {t("Store Name")} *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData("name", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.name ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-orange-300"
                                                            }`}
                                                            placeholder={t("Enter store name")}
                                                            required
                                                        />
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.name}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.1, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-orange-600" />
                                                            {t("Email Address")}
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData("email", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-orange-300"
                                                            }`}
                                                            placeholder={t("Enter email address")}
                                                        />
                                                        {errors.email && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.email}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.2, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-orange-600" />
                                                            {t("Phone Number")}
                                                        </Label>
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            value={data.phone}
                                                            onChange={(e) => setData("phone", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.phone ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-orange-300"
                                                            }`}
                                                            placeholder={t("Enter phone number")}
                                                        />
                                                        {errors.phone && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.phone}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.3, duration: 0.4 }}
                                                    className="space-y-2"
                                                >
                                                    <Label htmlFor="address" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-orange-600" />
                                                        {t("Address")}
                                                    </Label>
                                                    <Textarea
                                                        id="address"
                                                        value={data.address}
                                                        onChange={(e) => setData("address", e.target.value)}
                                                        className={`min-h-[100px] border-2 transition-all duration-200 input-glow ${
                                                            errors.address ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-orange-300"
                                                        }`}
                                                        placeholder={t("Enter store address")}
                                                    />
                                                    {errors.address && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.address}
                                                        </motion.p>
                                                    )}
                                                </motion.div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.4, duration: 0.4 }}
                                                    className="space-y-2"
                                                >
                                                    <Label htmlFor="status" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-orange-600" />
                                                        {t("Status")}
                                                    </Label>
                                                    <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                                                        <SelectTrigger className="h-12 border-2 border-slate-200 hover:border-orange-300 focus:border-orange-500 transition-colors">
                                                            <SelectValue placeholder={t("Select status")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">{t("Active")}</SelectItem>
                                                            <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                                                            <SelectItem value="pending">{t("Pending")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.status && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.status}
                                                        </motion.p>
                                                    )}
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Additional Information Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-purple-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                                                        <FileText className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Additional Information")}
                                                    <Badge className="ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                        {t("Optional")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.6, duration: 0.4 }}
                                                    className="space-y-2"
                                                >
                                                    <Label htmlFor="notes" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-purple-600" />
                                                        {t("Notes")}
                                                    </Label>
                                                    <Textarea
                                                        id="notes"
                                                        value={data.notes}
                                                        onChange={(e) => setData("notes", e.target.value)}
                                                        className={`min-h-[120px] border-2 transition-all duration-200 input-glow ${
                                                            errors.notes ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-purple-300"
                                                        }`}
                                                        placeholder={t("Enter any additional notes about this store...")}
                                                    />
                                                    {errors.notes && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.notes}
                                                        </motion.p>
                                                    )}
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.7, duration: 0.4 }}
                                        className="flex justify-end space-x-4"
                                    >
                                        <Link href={route("admin.customers.index")}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="gap-2 h-12 px-8 border-2 hover:border-slate-300"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="gap-2 h-12 px-8 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:via-amber-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 pulse-glow"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    {t("Updating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    {t("Update Store")}
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
}
