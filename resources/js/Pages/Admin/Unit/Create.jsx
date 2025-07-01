import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Save,
    Package,
    Hash,
    Star,
    AlertCircle,
    CheckCircle,
    Sparkles,
    Info,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        symbol: "",
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
        setLoading(true);
        post(route("admin.units.store"), {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Head title={t("Create Unit")}>
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
                        50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
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
                                    linear-gradient(45deg, #6366f1, #4f46e5) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #6366f1, #4f46e5) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Package} color="indigo" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.units" />

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
                                    initial={{
                                        scale: 0.8,
                                        opacity: 0,
                                        rotate: -180,
                                    }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        rotate: 0,
                                    }}
                                    transition={{
                                        delay: 0.3,
                                        duration: 0.6,
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                    className="relative float-animation"
                                >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-xl blur opacity-75 dark:opacity-50"></div>
                                        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 dark:from-indigo-700 dark:via-purple-700 dark:to-indigo-700 p-3 rounded-xl shadow-lg">
                                            <Package className="w-6 h-6 text-white" />
                                    </div>
                                </motion.div>
                                    <div className="space-y-1">
                                        <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.4,
                                        }}
                                            className="flex items-center gap-2"
                                    >
                                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                                {t("Unit Management")}
                                            </span>
                                        </motion.div>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            duration: 0.4,
                                        }}
                                            className="text-2xl font-bold text-gray-900 dark:text-white"
                                    >
                                            {t("Create Unit")}
                                    </motion.h1>
                                        <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.6,
                                            duration: 0.4,
                                        }}
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t(
                                            "Create a new measurement unit for your inventory system"
                                        )}
                                        </motion.div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.units.index")}>
                                    <Button
                                        variant="outline"
                                            className="gap-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Units")}
                                    </Button>
                                </Link>
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
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                >
                                    {/* Form Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.9,
                                            duration: 0.5,
                                        }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700">
                                            <CardHeader className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
                                                <CardTitle className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {t("Unit Details")}
                                                            </h2>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {t(
                                                                    "Enter the details for the new measurement unit"
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                                    >
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-6 py-8 space-y-8">
                                                {/* Error Alert */}
                                                <AnimatePresence>
                                                    {Object.keys(errors)
                                                        .length > 0 && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                        >
                                                            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                                                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                                <AlertDescription className="text-red-700 dark:text-red-400 font-medium">
                                                                    {t(
                                                                        "Please correct the errors below and try again."
                                                                    )}
                                                                </AlertDescription>
                                                            </Alert>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Name */}
                                                    <motion.div
                                                        initial={{
                                                            x: -20,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            x: 0,
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay: 1.0,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                                        >
                                                            <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t("Name")} *
                                                        </Label>
                                                            <Input
                                                                id="name"
                                                                type="text"
                                                                placeholder={t(
                                                                    "Enter unit name (e.g., Kilogram, Piece)"
                                                                )}
                                                                value={
                                                                    data.name
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "name",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            className={`h-11 transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                    errors.name
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                    : "border-gray-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                                                            }`}
                                                            />
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.name}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    {/* Code */}
                                                    <motion.div
                                                        initial={{
                                                            x: 20,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            x: 0,
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay: 1.1,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="code"
                                                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                                        >
                                                            <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            {t("Code")}
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                                                            >
                                                                {t("Optional")}
                                                            </Badge>
                                                        </Label>
                                                            <Input
                                                                id="code"
                                                                type="text"
                                                                placeholder={t(
                                                                    "Enter unit code (e.g., KG, PCS)"
                                                                )}
                                                                value={
                                                                    data.code
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "code",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            className={`h-11 transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                    errors.code
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                    : "border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                                                            }`}
                                                            />
                                                        {errors.code && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.code}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Symbol */}
                                                <motion.div
                                                    initial={{
                                                        y: 20,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        y: 0,
                                                        opacity: 1,
                                                    }}
                                                    transition={{
                                                        delay: 1.2,
                                                        duration: 0.4,
                                                    }}
                                                    className="space-y-3"
                                                >
                                                    <Label
                                                        htmlFor="symbol"
                                                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                                    >
                                                        <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                        {t("Symbol")}
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                                                        >
                                                            {t("Optional")}
                                                        </Badge>
                                                    </Label>
                                                        <Input
                                                            id="symbol"
                                                            type="text"
                                                            placeholder={t(
                                                                "Enter unit symbol (e.g., kg, pcs, m)"
                                                            )}
                                                            value={data.symbol}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "symbol",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        className={`h-11 transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                                                errors.symbol
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                                : "border-gray-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                                                        }`}
                                                        />
                                                    {errors.symbol && (
                                                        <motion.p
                                                            initial={{
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                            }}
                                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.symbol}
                                                        </motion.p>
                                                    )}
                                                </motion.div>

                                                {/* Info Alert */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay: 1.3,
                                                        duration: 0.4,
                                                    }}
                                                >
                                                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                                                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                        <AlertDescription className="text-blue-700 dark:text-blue-400 font-medium">
                                                            <strong>
                                                                {t("Tip")}:
                                                            </strong>{" "}
                                                            {t(
                                                                "Create clear and consistent unit names. Symbols should be short and universally recognized."
                                                            )}
                                                        </AlertDescription>
                                                    </Alert>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 1.4,
                                            duration: 0.4,
                                        }}
                                        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {t("Create Unit")}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t("Review the information and create the new unit")}
                                                </p>
                                            </div>
                                            <div className="flex space-x-3">
                                        <Link href={route("admin.units.index")}>
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
                                                    className="gap-2 px-6 py-2 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    {t("Creating...")}
                                                </>
                                            ) : (
                                                <>
                                                            <Save className="h-4 w-4" />
                                                    {t("Create Unit")}
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
