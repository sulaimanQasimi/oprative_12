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
    Edit,
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

export default function EditUnit({ auth, unit, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: unit.name,
        code: unit.code,
        symbol: unit.symbol || "",
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
        put(route("admin.units.update", unit.id), {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Head title={t("Edit Unit")}>
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

            <PageLoader isVisible={loading} icon={Edit} color="indigo" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
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
                        className="glass-effect border-b border-white/20 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
                                        <Edit className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.4,
                                        }}
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Edit Unit")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            duration: 0.4,
                                        }}
                                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
                                    >
                                        {unit.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.6,
                                            duration: 0.4,
                                        }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Update measurement unit details")}
                                    </motion.p>
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
                                        className="gap-2 hover:scale-105 transition-all duration-200 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Units")}
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
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                                        <Edit className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Unit Details")}
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                                    >
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                                    {t(
                                                        "Update the details for this measurement unit"
                                                    )}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-8">
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
                                                            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 pulse-glow">
                                                                <AlertCircle className="h-5 w-5 text-red-600" />
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
                                                            className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2"
                                                        >
                                                            <Package className="w-5 h-5 text-indigo-500" />
                                                            {t("Name")} *
                                                        </Label>
                                                        <div className="relative">
                                                            <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
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
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${
                                                                    errors.name
                                                                        ? "border-red-500 ring-2 ring-red-200"
                                                                        : "border-slate-200 hover:border-indigo-300 focus:border-indigo-500"
                                                                } bg-white dark:bg-slate-800`}
                                                            />
                                                        </div>
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
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
                                                            className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2"
                                                        >
                                                            <Hash className="w-5 h-5 text-blue-500" />
                                                            {t("Code")}
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {t("Optional")}
                                                            </Badge>
                                                        </Label>
                                                        <div className="relative">
                                                            <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
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
                                                                className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${
                                                                    errors.code
                                                                        ? "border-red-500 ring-2 ring-red-200"
                                                                        : "border-slate-200 hover:border-blue-300 focus:border-blue-500"
                                                                } bg-white dark:bg-slate-800`}
                                                            />
                                                        </div>
                                                        {errors.code && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 font-medium flex items-center gap-1"
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
                                                        className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2"
                                                    >
                                                        <Star className="w-5 h-5 text-purple-500" />
                                                        {t("Symbol")}
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {t("Optional")}
                                                        </Badge>
                                                    </Label>
                                                    <div className="relative">
                                                        <Star className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
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
                                                            className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${
                                                                errors.symbol
                                                                    ? "border-red-500 ring-2 ring-red-200"
                                                                    : "border-slate-200 hover:border-purple-300 focus:border-purple-500"
                                                            } bg-white dark:bg-slate-800`}
                                                        />
                                                    </div>
                                                    {errors.symbol && (
                                                        <motion.p
                                                            initial={{
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                            }}
                                                            className="text-sm text-red-600 font-medium flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.symbol}
                                                        </motion.p>
                                                    )}
                                                </motion.div>

                                                {/* Success Alert */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay: 1.3,
                                                        duration: 0.4,
                                                    }}
                                                >
                                                    <Alert className="border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20">
                                                        <Info className="h-5 w-5 text-indigo-600" />
                                                        <AlertDescription className="text-indigo-700 dark:text-indigo-400 font-medium">
                                                            <strong>
                                                                {t("Editing")}:
                                                            </strong>{" "}
                                                            {t(
                                                                "You are updating the unit"
                                                            )}
                                                            :{" "}
                                                            <strong>
                                                                {unit.name}
                                                            </strong>
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
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link href={route("admin.units.index")}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="px-8 py-4 text-lg border-2 hover:scale-105 transition-all duration-200"
                                            >
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className={`px-8 py-4 text-lg shadow-2xl transition-all duration-200 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 hover:scale-105 hover:shadow-3xl text-white`}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                    {t("Updating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-3" />
                                                    {t("Update Unit")}
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
