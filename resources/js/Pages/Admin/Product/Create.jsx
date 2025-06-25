import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Save,
    DollarSign,
    Package,
    Barcode,
    Tag,
    Scale,
    Activity,
    Sparkles,
    BarChart3,
    AlertCircle,
    CheckCircle,
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
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, units = [], permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        type: "",
        name: "",
        barcode: "",
        purchase_price: "",
        wholesale_price: "",
        retail_price: "",
        is_activated: false,
        is_in_stock: false,
        is_shipped: false,
        is_trend: false,
        wholesale_unit_id: "",
        retail_unit_id: "",
        whole_sale_unit_amount: "",
        retails_sale_unit_amount: "",
    });

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    function submit(e) {
        e.preventDefault();
        post(route("admin.products.store"));
    }

    return (
        <>
            <Head title={t("Create Product")}>
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
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                    }

                    .dark .glass-effect {
                        background: rgba(15, 23, 42, 0.95);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
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

                    .form-card {
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    }

                    .dark .form-card {
                        background: rgba(15, 23, 42, 0.98);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(51, 65, 85, 0.8);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    }

                    .input-field {
                        background: rgba(255, 255, 255, 1);
                        border: 1px solid rgba(226, 232, 240, 1);
                        transition: all 0.2s ease-in-out;
                    }

                    .dark .input-field {
                        background: rgba(30, 41, 59, 1);
                        border: 1px solid rgba(51, 65, 85, 1);
                    }

                    .input-field:focus {
                        border-color: #6366f1;
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                    }

                    .dark .input-field:focus {
                        border-color: #818cf8;
                        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
                    }

                    .input-field:hover {
                        border-color: #c7d2fe;
                    }

                    .dark .input-field:hover {
                        border-color: #475569;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={Package} color="indigo" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.products" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect border-b border-slate-200/50 dark:border-slate-700/50 py-6 px-8 sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95"
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-4 rounded-2xl shadow-2xl">
                                        <Package className="w-8 h-8 text-white" />
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
                                        className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {t("Product Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            duration: 0.4,
                                        }}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white bg-clip-text text-transparent"
                                    >
                                        {t("Create Product")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.6,
                                            duration: 0.4,
                                        }}
                                        className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {t(
                                            "Add a new product to your inventory"
                                        )}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.products.index")}>
                                    <Button
                                        variant="outline"
                                        className="gap-2 hover:scale-105 transition-all duration-200 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Products")}
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
                                className="max-w-5xl mx-auto"
                            >
                                <form onSubmit={submit} className="space-y-8">
                                    {/* Form Card */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.9,
                                            duration: 0.5,
                                        }}
                                    >
                                        <Card className="form-card relative overflow-hidden">
                                            <CardHeader className="relative bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-600 rounded-t-xl">
                                                <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-3 text-xl font-bold">
                                                    <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                                                        <Package className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Product Details")}
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700"
                                                    >
                                                        {t("Required")}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-300 font-medium">
                                                    {t(
                                                        "Fill in the details for the new product with proper validation"
                                                    )}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="relative p-8 space-y-8">
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
                                                                <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                                                                    {t(
                                                                        "Please correct the errors below and try again."
                                                                    )}
                                                                </AlertDescription>
                                                            </Alert>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Basic Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                                            htmlFor="type"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t("Product Type")}{" "}
                                                            *
                                                        </Label>
                                                        <Input
                                                            id="type"
                                                            type="text"
                                                            value={data.type}
                                                            placeholder={t(
                                                                "Enter product type"
                                                            )}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "type",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`input-field h-14 text-lg transition-all duration-200 ${
                                                                errors.type
                                                                    ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                    : ""
                                                            }`}
                                                        />
                                                        {errors.type && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.type}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

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
                                                            htmlFor="name"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t("Product Name")}{" "}
                                                            *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            placeholder={t(
                                                                "Enter product name"
                                                            )}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "name",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`input-field h-14 text-lg transition-all duration-200 ${
                                                                errors.name
                                                                    ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                    : ""
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
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.name}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Barcode */}
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
                                                        htmlFor="barcode"
                                                        className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                    >
                                                        <Barcode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                        {t("Barcode")}
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                                        >
                                                            {t("Optional")}
                                                        </Badge>
                                                    </Label>
                                                    <Input
                                                        id="barcode"
                                                        type="text"
                                                        value={data.barcode}
                                                        placeholder={t(
                                                            "Enter product barcode"
                                                        )}
                                                        onChange={(e) =>
                                                            setData(
                                                                "barcode",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`input-field h-14 text-lg transition-all duration-200 ${
                                                            errors.barcode
                                                                ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                : ""
                                                        }`}
                                                    />
                                                    {errors.barcode && (
                                                        <motion.p
                                                            initial={{
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                            }}
                                                            className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors.barcode}
                                                        </motion.p>
                                                    )}
                                                </motion.div>

                                                {/* Pricing Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                                                            delay: 1.3,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="purchase_price"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                            {t(
                                                                "Purchase Price"
                                                            )}{" "}
                                                            *
                                                        </Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="purchase_price"
                                                                type="number"
                                                                step="0.01"
                                                                value={
                                                                    data.purchase_price
                                                                }
                                                                placeholder="0.00"
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "purchase_price",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`input-field pl-12 h-14 text-lg transition-all duration-200 ${
                                                                    errors.purchase_price
                                                                        ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </div>
                                                        {errors.purchase_price && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {
                                                                    errors.purchase_price
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{
                                                            y: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            y: 0,
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay: 1.4,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="wholesale_price"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            {t(
                                                                "Wholesale Price"
                                                            )}{" "}
                                                            *
                                                        </Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="wholesale_price"
                                                                type="number"
                                                                step="0.01"
                                                                value={
                                                                    data.wholesale_price
                                                                }
                                                                placeholder="0.00"
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "wholesale_price",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`input-field pl-12 h-14 text-lg transition-all duration-200 ${
                                                                    errors.wholesale_price
                                                                        ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </div>
                                                        {errors.wholesale_price && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {
                                                                    errors.wholesale_price
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

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
                                                            delay: 1.5,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="retail_price"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                            {t("Retail Price")}{" "}
                                                            *
                                                        </Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                            <Input
                                                                id="retail_price"
                                                                type="number"
                                                                step="0.01"
                                                                value={
                                                                    data.retail_price
                                                                }
                                                                placeholder="0.00"
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "retail_price",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`input-field pl-12 h-14 text-lg transition-all duration-200 ${
                                                                    errors.retail_price
                                                                        ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </div>
                                                        {errors.retail_price && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {
                                                                    errors.retail_price
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Unit Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                                            delay: 1.6,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="wholesale_unit_id"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t(
                                                                "Wholesale Unit"
                                                            )}{" "}
                                                            *
                                                        </Label>
                                                        <Select
                                                            value={
                                                                data.wholesale_unit_id
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) =>
                                                                setData(
                                                                    "wholesale_unit_id",
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={`input-field h-14 text-lg transition-all duration-200 ${
                                                                    errors.wholesale_unit_id
                                                                        ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        "Select wholesale unit"
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {units.map(
                                                                    (unit) => (
                                                                        <SelectItem
                                                                            key={
                                                                                unit.id
                                                                            }
                                                                            value={unit.id.toString()}
                                                                        >
                                                                            {
                                                                                unit.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.wholesale_unit_id && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {
                                                                    errors.wholesale_unit_id
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

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
                                                            delay: 1.7,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="retail_unit_id"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t("Retail Unit")} *
                                                        </Label>
                                                        <Select
                                                            value={
                                                                data.retail_unit_id
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) =>
                                                                setData(
                                                                    "retail_unit_id",
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={`input-field h-14 text-lg transition-all duration-200 ${
                                                                    errors.retail_unit_id
                                                                        ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        "Select retail unit"
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {units.map(
                                                                    (unit) => (
                                                                        <SelectItem
                                                                            key={
                                                                                unit.id
                                                                            }
                                                                            value={unit.id.toString()}
                                                                        >
                                                                            {
                                                                                unit.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.retail_unit_id && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {
                                                                    errors.retail_unit_id
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Unit Amounts */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                                            delay: 1.8,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="whole_sale_unit_amount"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t(
                                                                "Wholesale Unit Amount"
                                                            )}{" "}
                                                            *
                                                        </Label>
                                                        <Input
                                                            id="whole_sale_unit_amount"
                                                            type="number"
                                                            step="0.01"
                                                            value={
                                                                data.whole_sale_unit_amount
                                                            }
                                                            placeholder="0"
                                                            onChange={(e) =>
                                                                setData(
                                                                    "whole_sale_unit_amount",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`input-field h-14 text-lg transition-all duration-200 ${
                                                                errors.whole_sale_unit_amount
                                                                    ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                    : ""
                                                            }`}
                                                        />
                                                        {errors.whole_sale_unit_amount && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {
                                                                    errors.whole_sale_unit_amount
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </motion.div>

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
                                                            delay: 1.9,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-3"
                                                    >
                                                        <Label
                                                            htmlFor="retails_sale_unit_amount"
                                                            className="text-slate-700 dark:text-slate-200 font-semibold text-base flex items-center gap-2"
                                                        >
                                                            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            {t(
                                                                "Retail Unit Amount"
                                                            )}{" "}
                                                            *
                                                        </Label>
                                                        <Input
                                                            id="retails_sale_unit_amount"
                                                            type="number"
                                                            step="0.01"
                                                            value={
                                                                data.retails_sale_unit_amount
                                                            }
                                                            placeholder="0"
                                                            onChange={(e) =>
                                                                setData(
                                                                    "retails_sale_unit_amount",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`input-field h-14 text-lg transition-all duration-200 ${
                                                                errors.retails_sale_unit_amount
                                                                    ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                                                                    : ""
                                                            }`}
                                                        />
                                                        {errors.retails_sale_unit_amount && (
                                                            <motion.p
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                                {
                                                                    errors.retails_sale_unit_amount
                                                                }
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Status Options */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                                            delay: 2.0,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="is_activated"
                                                                checked={
                                                                    data.is_activated
                                                                }
                                                                onCheckedChange={(
                                                                    checked
                                                                ) =>
                                                                    setData(
                                                                        "is_activated",
                                                                        checked
                                                                    )
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor="is_activated"
                                                                className="text-slate-700 dark:text-slate-200 font-medium"
                                                            >
                                                                {t(
                                                                    "Activate Product"
                                                                )}
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="is_in_stock"
                                                                checked={
                                                                    data.is_in_stock
                                                                }
                                                                onCheckedChange={(
                                                                    checked
                                                                ) =>
                                                                    setData(
                                                                        "is_in_stock",
                                                                        checked
                                                                    )
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor="is_in_stock"
                                                                className="text-slate-700 dark:text-slate-200 font-medium"
                                                            >
                                                                {t("In Stock")}
                                                            </Label>
                                                        </div>
                                                    </motion.div>

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
                                                            delay: 2.1,
                                                            duration: 0.4,
                                                        }}
                                                        className="space-y-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="is_shipped"
                                                                checked={
                                                                    data.is_shipped
                                                                }
                                                                onCheckedChange={(
                                                                    checked
                                                                ) =>
                                                                    setData(
                                                                        "is_shipped",
                                                                        checked
                                                                    )
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor="is_shipped"
                                                                className="text-slate-700 dark:text-slate-200 font-medium"
                                                            >
                                                                {t("Shipped")}
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="is_trend"
                                                                checked={
                                                                    data.is_trend
                                                                }
                                                                onCheckedChange={(
                                                                    checked
                                                                ) =>
                                                                    setData(
                                                                        "is_trend",
                                                                        checked
                                                                    )
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor="is_trend"
                                                                className="text-slate-700 dark:text-slate-200 font-medium"
                                                            >
                                                                {t("Trending")}
                                                            </Label>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 2.2,
                                            duration: 0.4,
                                        }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link
                                            href={route("admin.products.index")}
                                        >
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
                                            className="px-8 py-4 text-lg shadow-lg transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 text-white font-semibold"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                    {t("Creating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-3" />
                                                    {t("Create Product")}
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
