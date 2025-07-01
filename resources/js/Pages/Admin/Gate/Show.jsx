import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Building,
    Save,
    User,
    Sparkles,
    CheckCircle,
    AlertCircle,
    FileText,
    Building2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, users = [], permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        user_id: "",
    });

    // Get the selected user's name for display
    const selectedUser = users.find(user => user.id.toString() === data.user_id?.toString());
    const displayUserName = selectedUser ? selectedUser.name : "";

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
        post(route("admin.gates.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title={t("Add New Gate")}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.5); }
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
                                    linear-gradient(45deg, #6366f1, #8b5cf6) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #6366f1, #8b5cf6) border-box;
                    }

                    .input-glow:focus {
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                        border-color: #6366f1;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.gates" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/60 py-6 px-8 sticky top-0 z-30 shadow-sm dark:shadow-slate-900/20"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Building className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Access Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
                                    >
                                        {t("Add New Gate")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {t("Create a new access gate for your system")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.gates.index")}>
                                    <Button variant="outline" className="gap-2 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 dark:text-white">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Gates")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-4xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Gate Information Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                                            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                                        <Building className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Gate Information")}
                                                    <Badge className="ml-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
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
                                                            <Building className="w-4 h-4 text-indigo-600" />
                                                            {t("Gate Name")} *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData("name", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 ${
                                                                errors.name ? "border-red-300 focus:border-red-500" : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                                                            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20`}
                                                            placeholder={t("Enter gate name")}
                                                            required
                                                        />
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {t("Gate name must be unique across all gates")}
                                                        </p>
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
                                                        <Label htmlFor="user_id" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <User className="w-4 h-4 text-indigo-600" />
                                                            {t("Assigned User")} *
                                                        </Label>
                                                        <Select
                                                            value={data.user_id?.toString() || ""}
                                                            onValueChange={(value) => setData("user_id", value)}
                                                            required
                                                        >
                                                            <SelectTrigger className={`h-12 border-2 transition-all duration-200 ${
                                                                errors.user_id ? "border-red-300 focus:border-red-500" : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                                                            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20`}>
                                                                <SelectValue placeholder={t("Select a user")}>
                                                                    {displayUserName || <span className="text-slate-500 dark:text-slate-400">{t("Select a user")}</span>}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                                {users.map((user) => (
                                                                    <SelectItem key={user.id} value={user.id.toString()} className="hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white">
                                                                        <div className="flex items-center gap-2 w-full">
                                                                            <div className="p-1 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded">
                                                                                <User className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                                                                                <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {t("Each user can only be assigned to one gate")}
                                                        </p>
                                                        {errors.user_id && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.user_id}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.2, duration: 0.4 }}
                                                    className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                            <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                                {t("Gate Configuration")}
                                                            </h4>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                                {t("The assigned user will have full access to manage this gate and its associated employees. You can modify these settings later from the gate management panel.")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Additional Information Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.3, duration: 0.4 }}
                                    >
                                        <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                                            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                                                        <FileText className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Access Information")}
                                                    <Badge className="ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                        {t("Info")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.4, duration: 0.4 }}
                                                    className="space-y-4"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                                <h5 className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("User Assignment")}
                                                                </h5>
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                {t("Each gate must be assigned to a user who will manage its operations and employee access.")}
                                                            </p>
                                                        </div>

                                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                                <h5 className="font-semibold text-slate-700 dark:text-slate-300">
                                                                    {t("Gate Access")}
                                                                </h5>
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                {t("Gates control employee access to specific areas and track entry/exit activities.")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex justify-end space-x-4"
                                    >
                                        <Link href={route("admin.gates.index")}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="gap-2 h-12 px-8 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 dark:text-white"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="gap-2 h-12 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    {t("Creating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    {t("Create Gate")}
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