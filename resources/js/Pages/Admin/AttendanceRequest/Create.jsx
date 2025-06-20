import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Save,
    User,
    Calendar,
    AlertCircle,
    FileText,
    Clock,
    UserX,
    CheckCircle,
    Info,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, employee, suggestedDate = '', suggestedType = 'absent' }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        date: suggestedDate || '',
        type: suggestedType || 'absent',
        reason: '',
    });

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.attendance-requests.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const getTypeInfo = (type) => {
        const typeConfig = {
            late: {
                color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
                icon: Clock,
                description: t("You arrived late to work on this date"),
                examples: [
                    t("Traffic jam or transportation issues"),
                    t("Personal emergency or family matter"),
                    t("Medical appointment"),
                    t("Weather conditions"),
                ]
            },
            absent: {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                icon: UserX,
                description: t("You were absent from work on this date"),
                examples: [
                    t("Illness or medical condition"),
                    t("Family emergency"),
                    t("Personal urgent matter"),
                    t("Transportation failure"),
                ]
            },
        };
        return typeConfig[type] || typeConfig.absent;
    };

    const typeInfo = getTypeInfo(data.type);
    const TypeIcon = typeInfo.icon;

    // Get today's date for max date validation
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Head title={t("Submit Attendance Request")}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
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
                                    linear-gradient(45deg, #3b82f6, #8b5cf6) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #8b5cf6) border-box;
                    }

                    .input-glow:focus {
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                        border-color: #3b82f6;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.attendance-requests" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <FileText className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1"
                                    >
                                        {t("Attendance Justification")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Submit Request")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4" />
                                        {employee.first_name} {employee.last_name} - {employee.employee_id}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.attendance-requests.my-requests")}>
                                    <Button variant="outline" className="gap-2 border-2 hover:border-blue-300">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Requests")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-4xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Request Information Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                                        <FileText className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Request Details")}
                                                    <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
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
                                                        <Label htmlFor="date" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-blue-600" />
                                                            {t("Date")} *
                                                        </Label>
                                                        <Input
                                                            id="date"
                                                            type="date"
                                                            max={today}
                                                            value={data.date}
                                                            onChange={(e) => setData("date", e.target.value)}
                                                            className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.date ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-blue-300"
                                                            }`}
                                                            required
                                                        />
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {t("Select the date you were late or absent")}
                                                        </p>
                                                        {errors.date && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.date}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: 1.1, duration: 0.4 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor="type" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                            <TypeIcon className="w-4 h-4 text-blue-600" />
                                                            {t("Type")} *
                                                        </Label>
                                                        <Select
                                                            value={data.type}
                                                            onValueChange={(value) => setData("type", value)}
                                                            required
                                                        >
                                                            <SelectTrigger className={`h-12 border-2 transition-all duration-200 input-glow ${
                                                                errors.type ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-blue-300"
                                                            }`}>
                                                                <SelectValue placeholder={t("Select request type")} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="late">
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="h-4 w-4 text-orange-600" />
                                                                        <div>
                                                                            <div className="font-medium">{t("Late Arrival")}</div>
                                                                            <div className="text-sm text-slate-500">{t("You arrived late to work")}</div>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="absent">
                                                                    <div className="flex items-center gap-2">
                                                                        <UserX className="h-4 w-4 text-red-600" />
                                                                        <div>
                                                                            <div className="font-medium">{t("Absence")}</div>
                                                                            <div className="text-sm text-slate-500">{t("You were absent from work")}</div>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {typeInfo.description}
                                                        </p>
                                                        {errors.type && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.type}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.2, duration: 0.4 }}
                                                    className="space-y-2"
                                                >
                                                    <Label htmlFor="reason" className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                        {t("Reason for Justification")} *
                                                    </Label>
                                                    <Textarea
                                                        id="reason"
                                                        value={data.reason}
                                                        onChange={(e) => setData("reason", e.target.value)}
                                                        className={`min-h-32 border-2 transition-all duration-200 input-glow resize-none ${
                                                            errors.reason ? "border-red-300 focus:border-red-500" : "border-slate-200 hover:border-blue-300"
                                                        }`}
                                                        placeholder={t("Please provide a detailed explanation for your absence or late arrival...")}
                                                        required
                                                    />
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {t("Minimum 10 characters required")}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {data.reason.length}/1000
                                                        </p>
                                                    </div>
                                                    {errors.reason && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.reason}
                                                        </motion.p>
                                                    )}
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Guidelines Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.3, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-blue-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
                                                        <Info className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Justification Guidelines")}
                                                    <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                        {t("Tips")}
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
                                                    <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                                                            <Badge className={typeInfo.color}>
                                                                {t(data.type.charAt(0).toUpperCase() + data.type.slice(1))}
                                                            </Badge>
                                                            {t("Common Reasons")}
                                                        </h4>
                                                        <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                                                            {typeInfo.examples.map((example, index) => (
                                                                <li key={index} className="flex items-center gap-2">
                                                                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                                                    {example}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                                                        <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {t("Important Notes")}
                                                        </h4>
                                                        <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1">
                                                            <li>• {t("Be honest and specific in your explanation")}</li>
                                                            <li>• {t("Provide relevant details that support your request")}</li>
                                                            <li>• {t("Submit requests as soon as possible after the incident")}</li>
                                                            <li>• {t("Your manager will review and respond to your request")}</li>
                                                        </ul>
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
                                        <Link href={route("admin.attendance-requests.my-requests")}>
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
                                            className="gap-2 h-12 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 pulse-glow"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    {t("Submitting...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    {t("Submit Request")}
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