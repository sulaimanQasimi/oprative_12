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
import BackButton from "@/Components/BackButton";

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
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    }

                    .dark .glass-effect {
                        background: rgba(15, 15, 15, 0.95);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    }

                    .gradient-border {
                        background: linear-gradient(white, white) padding-box,
                                    linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4) border-box;
                        border: 1px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(15 23 42), rgb(15 23 42)) padding-box,
                                    linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4) border-box;
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
                className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden"
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
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm"
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center space-x-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl blur opacity-75 dark:opacity-50"></div>
                                        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-700 dark:via-purple-700 dark:to-cyan-700 p-3 rounded-xl shadow-lg">
                                            <Building className="w-6 h-6 text-white" />
                                    </div>
                                </motion.div>
                                    <div className="space-y-1">
                                        <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                            className="flex items-center gap-2"
                                    >
                                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                        {t("Access Management")}
                                            </span>
                                        </motion.div>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                            className="text-2xl font-bold text-gray-900 dark:text-white"
                                    >
                                        {t("Add New Gate")}
                                    </motion.h1>
                                        <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {t("Create a new access gate for your system")}
                                        </motion.div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                >
                                  
                                    <BackButton className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-100" link={route("admin.gates.index")}/>
                                    
                            </motion.div>
                            </div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900">
                        <div className="container mx-auto px-6 py-8">
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
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardHeader className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
                                                <CardTitle className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                                            <Building className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {t("Gate Information")}
                                                            </h2>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {t("Enter the basic details for the new gate")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="default" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-6 py-8">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.0, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                            <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t("Gate Name")} *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData("name", e.target.value)}
                                                            className={`h-11 transition-all duration-200 input-glow bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                                                            }`}
                                                            placeholder={t("Enter gate name")}
                                                            required
                                                        />
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {t("Gate name must be unique across all gates")}
                                                        </p>
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1"
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
                                                        <Label htmlFor="user_id" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t("Assigned User")} *
                                                        </Label>
                                                        <Select
                                                            value={data.user_id?.toString() || ""}
                                                            onValueChange={(value) => setData("user_id", value)}
                                                            required
                                                        >
                                                            <SelectTrigger className={`h-11 transition-all duration-200 input-glow bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                errors.user_id ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                                                            }`}>
                                                                <SelectValue placeholder={t("Select a user")}>
                                                                    {displayUserName || <span className="text-gray-500 dark:text-gray-400">{t("Select a user")}</span>}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-lg">
                                                                {users.map((user) => (
                                                                    <SelectItem key={user.id} value={user.id.toString()} className="hover:bg-gray-100 dark:hover:bg-slate-600 focus:bg-gray-100 dark:focus:bg-slate-600">
                                                                        <div className="flex items-center gap-3 w-full">
                                                                            <div className="p-1.5 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-md">
                                                                                <User className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="font-medium text-gray-900 dark:text-white truncate">{user.name}</div>
                                                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {t("Each user can only be assigned to one gate")}
                                                        </p>
                                                        {errors.user_id && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1"
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
                                                    className="lg:col-span-2 bg-blue-50 dark:bg-slate-700/50 rounded-lg p-6 border border-blue-200 dark:border-slate-600"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 dark:bg-indigo-600 rounded-lg flex items-center justify-center">
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-blue-900 dark:text-white mb-2">
                                                                {t("Gate Configuration")}
                                                            </h3>
                                                            <p className="text-sm text-blue-800 dark:text-gray-300 leading-relaxed">
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
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardHeader className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
                                                <CardTitle className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                                            <FileText className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {t("Access Information")}
                                                            </h2>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {t("Learn about gate access management")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="default" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                                        {t("Info")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-6 py-8">
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.4, duration: 0.4 }}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                                >
                                                    <div className="bg-indigo-50 dark:bg-slate-700/50 rounded-lg p-5 border border-indigo-200 dark:border-slate-600">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                                                <User className="w-4 h-4 text-white" />
                                                            </div>
                                                            <h4 className="font-semibold text-indigo-900 dark:text-white">
                                                                {t("User Assignment")}
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm text-indigo-800 dark:text-gray-300 leading-relaxed">
                                                                {t("Each gate must be assigned to a user who will manage its operations and employee access.")}
                                                            </p>
                                                        </div>

                                                    <div className="bg-purple-50 dark:bg-slate-700/50 rounded-lg p-5 border border-purple-200 dark:border-slate-600">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                                                <Building className="w-4 h-4 text-white" />
                                                            </div>
                                                            <h4 className="font-semibold text-purple-900 dark:text-white">
                                                                {t("Gate Access")}
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm text-purple-800 dark:text-gray-300 leading-relaxed">
                                                            {t("Gates control employee access to specific areas and track entry/exit activities.")}
                                                        </p>
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
                                        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {t("Create Gate")}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t("Review the information and create the new gate")}
                                                </p>
                                            </div>
                                            <div className="flex space-x-3">
                                        <Link href={route("admin.gates.index")}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                        className="gap-2 px-6 py-2 h-10 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                                    className="gap-2 px-6 py-2 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            </div>
                                        </div>
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