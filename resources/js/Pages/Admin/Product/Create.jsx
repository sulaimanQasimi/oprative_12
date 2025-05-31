import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Package,
    ArrowLeft,
    Save,
    AlertCircle,
    CheckCircle,
    X,
    DollarSign,
    Barcode,
    Tag,
    Scale,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth, units = [] }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: "",
        name: "",
        barcode: "",
        purchase_price: "",
        wholesale_price: "",
        retail_price: "",
        purchase_profit: "",
        wholesale_profit: "",
        retail_profit: "",
        is_activated: true,
        is_in_stock: true,
        is_shipped: false,
        is_trend: false,
        wholesale_unit_id: "",
        retail_unit_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.products.store"));
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
            <Head title={t("Add Product")}>
                <style>{`
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.products" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {t("Admin Panel")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Add New Product")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.products.index")}>
                                <Button
                                    variant="outline"
                                    className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    {t("Back to List")}
                                </Button>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6 max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <Package className="h-5 w-5 text-indigo-500" />
                                            {t("Product Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {Object.keys(errors).length > 0 && (
                                            <Alert
                                                variant="destructive"
                                                className="mb-6 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    {t(
                                                        "Please correct the errors below."
                                                    )}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-8"
                                        >
                                            {/* Basic Information Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 pb-2">
                                                    <Package className="h-5 w-5 text-indigo-500" />
                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                                        {t("Basic Information")}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Product Type */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="type"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <Tag className="h-4 w-4" />
                                                            {t("Product Type")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="type"
                                                            type="text"
                                                            value={data.type}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "type",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. Electronics"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.type
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.type && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.type}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Product Name */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <Package className="h-4 w-4" />
                                                            {t("Product Name")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "name",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. iPhone 13"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.name
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.name && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Barcode */}
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label
                                                            htmlFor="barcode"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <Barcode className="h-4 w-4" />
                                                            {t("Barcode")}
                                                        </Label>
                                                        <Input
                                                            id="barcode"
                                                            type="text"
                                                            value={data.barcode}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "barcode",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. 123456789"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.barcode
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.barcode && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.barcode}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="my-8" />

                                            {/* Pricing Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 pb-2">
                                                    <DollarSign className="h-5 w-5 text-green-500" />
                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                                        {t("Pricing Information")}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {/* Purchase Price */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="purchase_price"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <DollarSign className="h-4 w-4 text-blue-500" />
                                                            {t("Purchase Price")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="purchase_price"
                                                            type="number"
                                                            step="0.01"
                                                            value={data.purchase_price}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "purchase_price",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. 799.99"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.purchase_price
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.purchase_price && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.purchase_price}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Wholesale Price */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="wholesale_price"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <DollarSign className="h-4 w-4 text-orange-500" />
                                                            {t("Wholesale Price")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="wholesale_price"
                                                            type="number"
                                                            step="0.01"
                                                            value={data.wholesale_price}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "wholesale_price",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. 899.99"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.wholesale_price
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.wholesale_price && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.wholesale_price}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Retail Price */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="retail_price"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <DollarSign className="h-4 w-4 text-green-500" />
                                                            {t("Retail Price")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="retail_price"
                                                            type="number"
                                                            step="0.01"
                                                            value={data.retail_price}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "retail_price",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. 999.99"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.retail_price
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.retail_price && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.retail_price}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="my-8" />

                                            {/* Profit Margins Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 pb-2">
                                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                                        {t("Profit Margins")}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {/* Purchase Profit */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="purchase_profit"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <TrendingUp className="h-4 w-4 text-blue-500" />
                                                            {t("Purchase Profit")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="purchase_profit"
                                                            type="number"
                                                            step="0.01"
                                                            value={data.purchase_profit}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "purchase_profit",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. 100"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.purchase_profit
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.purchase_profit && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.purchase_profit}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Wholesale Profit */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="wholesale_profit"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <TrendingUp className="h-4 w-4 text-orange-500" />
                                                            {t("Wholesale Profit")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="wholesale_profit"
                                                            type="number"
                                                            step="0.01"
                                                            value={data.wholesale_profit}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "wholesale_profit",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. 50"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.wholesale_profit
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.wholesale_profit && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.wholesale_profit}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Retail Profit */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="retail_profit"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                                                            {t("Retail Profit")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="retail_profit"
                                                            type="number"
                                                            step="0.01"
                                                            value={data.retail_profit}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "retail_profit",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "e.g. 200"
                                                            )}
                                                            className={`transition-colors ${
                                                                errors.retail_profit
                                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                    : "focus:border-indigo-500 focus:ring-indigo-500"
                                                            }`}
                                                        />
                                                        {errors.retail_profit && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.retail_profit}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="my-8" />

                                            {/* Units Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 pb-2">
                                                    <Scale className="h-5 w-5 text-purple-500" />
                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                                        {t("Unit Configuration")}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Wholesale Unit */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="wholesale_unit_id"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <Scale className="h-4 w-4 text-orange-500" />
                                                            {t("Wholesale Unit")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Select
                                                            value={data.wholesale_unit_id}
                                                            onValueChange={(value) =>
                                                                setData(
                                                                    "wholesale_unit_id",
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={`transition-colors ${
                                                                    errors.wholesale_unit_id
                                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                        : "focus:border-indigo-500 focus:ring-indigo-500"
                                                                }`}
                                                            >
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        "Select wholesale unit"
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {units.map((unit) => (
                                                                    <SelectItem
                                                                        key={unit.id}
                                                                        value={unit.id.toString()}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Scale className="h-3 w-3" />
                                                                            {unit.name} ({unit.code})
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.wholesale_unit_id && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.wholesale_unit_id}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Retail Unit */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="retail_unit_id"
                                                            className="text-slate-800 dark:text-slate-200 flex items-center gap-2"
                                                        >
                                                            <Scale className="h-4 w-4 text-purple-500" />
                                                            {t("Retail Unit")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Select
                                                            value={data.retail_unit_id}
                                                            onValueChange={(value) =>
                                                                setData(
                                                                    "retail_unit_id",
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={`transition-colors ${
                                                                    errors.retail_unit_id
                                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                        : "focus:border-indigo-500 focus:ring-indigo-500"
                                                                }`}
                                                            >
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        "Select retail unit"
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {units.map((unit) => (
                                                                    <SelectItem
                                                                        key={unit.id}
                                                                        value={unit.id.toString()}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Scale className="h-3 w-3" />
                                                                            {unit.name} ({unit.code})
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.retail_unit_id && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {errors.retail_unit_id}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="my-8" />

                                            {/* Status Configuration */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 pb-2">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                                        {t("Status Configuration")}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center space-x-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                            <Checkbox
                                                                id="is_activated"
                                                                checked={data.is_activated}
                                                                onCheckedChange={(checked) =>
                                                                    setData(
                                                                        "is_activated",
                                                                        checked
                                                                    )
                                                                }
                                                                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                                            />
                                                            <div className="flex-1">
                                                                <Label
                                                                    htmlFor="is_activated"
                                                                    className="text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                                                                >
                                                                    {t("Active")}
                                                                </Label>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {t("Product is available for use")}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                            <Checkbox
                                                                id="is_in_stock"
                                                                checked={data.is_in_stock}
                                                                onCheckedChange={(checked) =>
                                                                    setData(
                                                                        "is_in_stock",
                                                                        checked
                                                                    )
                                                                }
                                                                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                                            />
                                                            <div className="flex-1">
                                                                <Label
                                                                    htmlFor="is_in_stock"
                                                                    className="text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                                                                >
                                                                    {t("In Stock")}
                                                                </Label>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {t("Product is available in inventory")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center space-x-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                            <Checkbox
                                                                id="is_shipped"
                                                                checked={data.is_shipped}
                                                                onCheckedChange={(checked) =>
                                                                    setData(
                                                                        "is_shipped",
                                                                        checked
                                                                    )
                                                                }
                                                                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                                            />
                                                            <div className="flex-1">
                                                                <Label
                                                                    htmlFor="is_shipped"
                                                                    className="text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                                                                >
                                                                    {t("Shipped")}
                                                                </Label>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {t("Product has been shipped")}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                            <Checkbox
                                                                id="is_trend"
                                                                checked={data.is_trend}
                                                                onCheckedChange={(checked) =>
                                                                    setData(
                                                                        "is_trend",
                                                                        checked
                                                                    )
                                                                }
                                                                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                                            />
                                                            <div className="flex-1">
                                                                <Label
                                                                    htmlFor="is_trend"
                                                                    className="text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                                                                >
                                                                    {t("Trending")}
                                                                </Label>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {t("Product is currently trending")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form Actions */}
                                            <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                                                <Link
                                                    href={route(
                                                        "admin.products.index"
                                                    )}
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {processing
                                                        ? t("Saving...")
                                                        : t("Save Product")}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
