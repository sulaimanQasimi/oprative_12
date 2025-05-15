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
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Create({ auth }) {
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
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Product Type */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="type"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Product Type")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
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
                                                        className={
                                                            errors.type
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.type && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.type}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Product Name */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="name"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Product Name")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
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
                                                        className={
                                                            errors.name
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.name && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Barcode */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="barcode"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
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
                                                        className={
                                                            errors.barcode
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.barcode && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.barcode}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Purchase Price */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="purchase_price"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Purchase Price")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
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
                                                        className={
                                                            errors.purchase_price
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.purchase_price && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.purchase_price}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Wholesale Price */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="wholesale_price"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Wholesale Price")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
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
                                                        className={
                                                            errors.wholesale_price
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.wholesale_price && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.wholesale_price}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Retail Price */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="retail_price"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Retail Price")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
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
                                                        className={
                                                            errors.retail_price
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.retail_price && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.retail_price}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Purchase Profit */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="purchase_profit"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Purchase Profit")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
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
                                                        className={
                                                            errors.purchase_profit
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.purchase_profit && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.purchase_profit}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Wholesale Profit */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="wholesale_profit"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Wholesale Profit")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
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
                                                        className={
                                                            errors.wholesale_profit
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.wholesale_profit && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.wholesale_profit}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Retail Profit */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="retail_profit"
                                                        className="text-slate-800 dark:text-slate-200"
                                                    >
                                                        {t("Retail Profit")}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
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
                                                        className={
                                                            errors.retail_profit
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }
                                                    />
                                                    {errors.retail_profit && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            {errors.retail_profit}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status Checkboxes */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                                <div className="space-y-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="is_activated"
                                                            checked={data.is_activated}
                                                            onCheckedChange={(checked) =>
                                                                setData(
                                                                    "is_activated",
                                                                    checked
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor="is_activated"
                                                            className="text-slate-800 dark:text-slate-200"
                                                        >
                                                            {t("Active")}
                                                        </Label>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="is_in_stock"
                                                            checked={data.is_in_stock}
                                                            onCheckedChange={(checked) =>
                                                                setData(
                                                                    "is_in_stock",
                                                                    checked
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor="is_in_stock"
                                                            className="text-slate-800 dark:text-slate-200"
                                                        >
                                                            {t("In Stock")}
                                                        </Label>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="is_shipped"
                                                            checked={data.is_shipped}
                                                            onCheckedChange={(checked) =>
                                                                setData(
                                                                    "is_shipped",
                                                                    checked
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor="is_shipped"
                                                            className="text-slate-800 dark:text-slate-200"
                                                        >
                                                            {t("Shipped")}
                                                        </Label>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="is_trend"
                                                            checked={data.is_trend}
                                                            onCheckedChange={(checked) =>
                                                                setData(
                                                                    "is_trend",
                                                                    checked
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor="is_trend"
                                                            className="text-slate-800 dark:text-slate-200"
                                                        >
                                                            {t("Trending")}
                                                        </Label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end space-x-3">
                                                <Link
                                                    href={route(
                                                        "admin.products.index"
                                                    )}
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
