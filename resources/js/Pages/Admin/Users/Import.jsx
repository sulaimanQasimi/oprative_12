import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Upload,
    FileText,
    Download,
    CheckCircle,
    AlertCircle,
    X,
    Sparkles,
    Users,
    UserPlus,
    Info,
    FileSpreadsheet,
    Save
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
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function ImportUsers({ auth }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
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
        if (!data.file) {
            return;
        }
        
        post(route('admin.users.import'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('file', file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                setData('file', file);
            }
        }
    };

    const downloadTemplate = () => {
        // Create a sample CSV template
        const csvContent = "name,email,password,roles\nJohn Doe,john@example.com,password123,admin\nJane Smith,jane@example.com,password123,user";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_import_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            <Head title={t("Import Users")}>
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulse-glow 2s ease-in-out infinite;
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
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Upload} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.users" />

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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                        <Upload className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Admin Panel")} - {t("User Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {t("Import Users")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {t("Upload a CSV file to import multiple users")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                            >
                                <Link href={route("admin.users.index")}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Users")}
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
                                className="max-w-4xl mx-auto space-y-8"
                            >
                                {/* Instructions Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <Info className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Import Instructions")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                                        {t("CSV Format Requirements")}
                                                    </h3>
                                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            {t("Required columns: name, email")}
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            {t("Optional columns: password, roles")}
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            {t("First row should contain column headers")}
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            {t("Email addresses must be unique")}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                                        <AlertCircle className="h-5 w-5 text-amber-600" />
                                                        {t("Important Notes")}
                                                    </h3>
                                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                                        <li className="flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                            {t("Default password will be set if not provided")}
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                            {t("Roles should be comma-separated")}
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                            {t("Maximum file size: 2MB")}
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                            {t("Existing users will be skipped")}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                                <Button
                                                    onClick={downloadTemplate}
                                                    variant="outline"
                                                    className="gap-2 hover:scale-105 transition-all duration-200"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    {t("Download CSV Template")}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Upload Form */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                        <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                                    <Upload className="h-5 w-5 text-white" />
                                                </div>
                                                {t("Upload CSV File")}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                {/* File Upload Area */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="file" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        {t("CSV File")} <span className="text-red-500">*</span>
                                                    </Label>
                                                    
                                                    <div
                                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                                            dragActive
                                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                                : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                                                        }`}
                                                        onDragEnter={handleDrag}
                                                        onDragLeave={handleDrag}
                                                        onDragOver={handleDrag}
                                                        onDrop={handleDrop}
                                                    >
                                                        <Input
                                                            id="file"
                                                            type="file"
                                                            accept=".csv,text/csv"
                                                            onChange={handleFileChange}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            required
                                                        />
                                                        
                                                        <div className="space-y-4">
                                                            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                                <Upload className="h-8 w-8 text-blue-600" />
                                                            </div>
                                                            
                                                            {data.file ? (
                                                                <div>
                                                                    <p className="text-lg font-medium text-green-600 dark:text-green-400">
                                                                        {data.file.name}
                                                                    </p>
                                                                    <p className="text-sm text-slate-500">
                                                                        {(data.file.size / 1024).toFixed(2)} KB
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                                                                        {t("Drag and drop your CSV file here")}
                                                                    </p>
                                                                    <p className="text-sm text-slate-500">
                                                                        {t("or click to browse files")}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {errors.file && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm flex items-center gap-1"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            {errors.file}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Submit Button */}
                                                <div className="flex justify-end gap-4">
                                                    <Link href={route("admin.users.index")}>
                                                        <Button type="button" variant="outline" className="gap-2">
                                                            <X className="h-4 w-4" />
                                                            {t("Cancel")}
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        type="submit"
                                                        disabled={processing || !data.file}
                                                        className="gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-lg"
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                {t("Importing...")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="h-4 w-4" />
                                                                {t("Import Users")}
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 