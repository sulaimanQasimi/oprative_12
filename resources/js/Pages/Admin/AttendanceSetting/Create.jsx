import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Clock,
    Save,
    Calendar,
    Sparkles,
    Timer,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        enter_time: "",
        exit_time: "",
        date: "",
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
        post(route("admin.attendance-settings.store"));
    };

    return (
        <>
            <Head title={t("Create Attendance Setting")}>
                <style>{`
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
                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
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
                <Navigation auth={auth} currentRoute="admin.attendance-settings" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Clock className="w-8 h-8 text-white" />
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
                                        {t("Time Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {t("Create Setting")}
                                    </motion.h1>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                            >
                                <Link href={route("admin.attendance-settings.index")}>
                                    <Button
                                        variant="outline"
                                        className="gap-2 text-black dark:text-white  hover:scale-105 transition-all duration-200"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to List")}
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
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="max-w-2xl mx-auto"
                            >
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                <Clock className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Attendance Setting Details")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Enter Time */}
                                            <div className="space-y-2">
                                                <Label htmlFor="enter_time" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {t("Enter Time")} *
                                                </Label>
                                                <Input
                                                    id="enter_time"
                                                    type="time"
                                                    value={data.enter_time}
                                                    onChange={(e) => setData("enter_time", e.target.value)}
                                                    className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-lg"
                                                    required
                                                />
                                                {errors.enter_time && (
                                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.enter_time}</p>
                                                )}
                                            </div>

                                            {/* Exit Time */}
                                            <div className="space-y-2">
                                                <Label htmlFor="exit_time" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {t("Exit Time")} *
                                                </Label>
                                                <Input
                                                    id="exit_time"
                                                    type="time"
                                                    value={data.exit_time}
                                                    onChange={(e) => setData("exit_time", e.target.value)}
                                                    className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-lg"
                                                    required
                                                />
                                                {errors.exit_time && (
                                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.exit_time}</p>
                                                )}
                                            </div>

                                            {/* Date */}
                                            <div className="space-y-2">
                                                <Label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {t("Date")}
                                                </Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="date"
                                                        type="date"
                                                        value={data.date}
                                                        onChange={(e) => setData("date", e.target.value)}
                                                        className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-lg"
                                                    />
                                                </div>
                                                {errors.date && (
                                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.date}</p>
                                                )}
                                            </div>

                                            {/* Duration Preview */}
                                            {data.enter_time && data.exit_time && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Timer className="w-5 h-5 text-indigo-600" />
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("Work Duration")}</p>
                                                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                                {(() => {
                                                                    const enter = new Date(`2000-01-01T${data.enter_time}`);
                                                                    const exit = new Date(`2000-01-01T${data.exit_time}`);
                                                                    const duration = Math.abs(exit - enter) / (1000 * 60 * 60);
                                                                    return `${duration.toFixed(1)} ${t("hours")}`;
                                                                })()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Submit Buttons */}
                                            <div className="flex items-center justify-end space-x-4 pt-6">
                                                <Link href={route("admin.attendance-settings.index")}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="px-6 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                                    >
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {processing ? t("Creating...") : t("Create Setting")}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 