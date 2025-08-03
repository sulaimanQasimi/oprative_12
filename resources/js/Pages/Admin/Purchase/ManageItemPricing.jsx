import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Package,
    Save,
    DollarSign,
    TrendingUp,
    FileText,
    Info,
    Calculator,
    ShoppingCart,
    Tags,
    Building,
    Package2,
    Receipt,
    Calendar
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
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";

export default function ManageItemPricing({ auth, purchase, item, additionalCosts = [], totalAdditionalCosts = 0, permissions = {} }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        wholesale_price: item.batch?.wholesale_price || '',
        retail_price: item.batch?.retail_price || '',
        purchase_price: item.batch?.purchase_price || '',
        notes: item.batch?.notes || ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: purchase.currency?.code || 'USD',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return t("Not set");
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getExpiryStatus = (expireDate) => {
        if (!expireDate) return { status: 'no-expiry', text: t("No expiry"), color: 'gray' };

        const today = new Date();
        const expiry = new Date(expireDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { status: 'expired', text: t("Expired"), color: 'red' };
        } else if (diffDays <= 30) {
            return { status: 'expiring', text: `${diffDays} ${t("days left")}`, color: 'orange' };
        } else {
            return { status: 'fresh', text: `${diffDays} ${t("days left")}`, color: 'green' };
        }
    };

    const calculateProfitMargins = () => {
        const purchasePrice = parseFloat(data.purchase_price || item.price || 0);
        const wholesalePrice = parseFloat(data.wholesale_price || 0);
        const retailPrice = parseFloat(data.retail_price || 0);

        // Include additional costs in the base cost calculation
        const totalCostPerUnit = purchasePrice + (totalAdditionalCosts / (item.quantity / item.unit_amount));

        const wholesaleMargin = (data.wholesale_price || 0) - (item.price + (totalAdditionalCosts / (item.quantity / item.unit_amount)));

        const retailMargin = retailPrice > 0 && totalCostPerUnit > 0
            ? ((retailPrice - totalCostPerUnit) / totalCostPerUnit * 100)
            : 0;

        return { wholesaleMargin, retailMargin, totalCostPerUnit };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.purchases.items.pricing.update', [purchase.id, item.id]));
    };

    const { wholesaleMargin, retailMargin, totalCostPerUnit } = calculateProfitMargins();
    const expiryStatus = getExpiryStatus(item.batch?.expire_date);

    return (
        <>
            <Head title={`${t("Manage Pricing")} - ${purchase.invoice_number}`} />
            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .float-animation { animation: float 6s ease-in-out infinite; }
                .glass-effect { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
                .dark .glass-effect { background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px); }
                .gradient-border {
                    background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                    border: 2px solid transparent;
                }
                .dark .gradient-border {
                    background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box, linear-gradient(45deg, #3b82f6, #1d4ed8) border-box;
                }
            `}</style>

            <PageLoader isVisible={loading} icon={Tags} color="blue" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                <Navigation auth={auth} currentRoute="admin.purchases" />

                <div className="flex-1 flex flex-col overflow-hidden">
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
                                        <Tags className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Item Pricing Management")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                                    >
                                        {item.product?.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Purchase")}: {purchase.invoice_number}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
                                <BackButton link={route("admin.purchases.show", purchase.id)} />
                            </motion.div>
                        </div>
                    </motion.header>

                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent p-8">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>

                            {/* Global Steps Progress */}
                            <div className="max-w-6xl mx-auto mb-8">
                                <div className="flex items-center justify-between">
                                    {/* Step 1: Create Item */}
                                    <div className="flex items-center opacity-60">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 text-green-600 border-2 border-green-300">
                                            <Package className="w-7 h-7" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{t("Create Item")}</p>
                                            <p className="text-sm text-green-500 dark:text-green-400">{t("Step 1 - Completed")}</p>
                                        </div>
                                    </div>

                                    <div className="w-24 h-1 bg-green-400 rounded"></div>

                                    {/* Step 2: Additional Costs */}
                                    <div className="flex items-center opacity-60">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 border-2 border-orange-300">
                                            <Receipt className="w-7 h-7" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{t("Additional Costs")}</p>
                                            <p className="text-sm text-orange-500 dark:text-orange-400">{t("Step 2 - Completed")}</p>
                                        </div>
                                    </div>

                                    <div className="w-24 h-1 bg-orange-400 rounded"></div>

                                    {/* Step 3: Pricing (Current) */}
                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg ring-4 ring-blue-100 dark:ring-blue-900">
                                            <DollarSign className="w-7 h-7" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{t("Pricing")}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t("Step 3 - Active")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Item Summary */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
                                {/* Item Details */}
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                    <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <Package className="h-6 w-6 text-green-600" />
                                            {t("Item Details")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <div>
                                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t("Product")}</p>
                                                    <p className="text-lg font-bold text-green-800 dark:text-green-200">{item.product?.name}</p>
                                                    <p className="text-xs text-green-500">{item.product?.barcode}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t("Quantity")}</p>
                                                    <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                                                        {(item.quantity / item.unit_amount).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-blue-500">{item.batch?.unit_name || t("Units")}</p>
                                                </div>
                                                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{t("Unit Price")}</p>
                                                    <p className="text-lg font-bold text-purple-800 dark:text-purple-200">{formatCurrency(item.price)}</p>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium text-center">{t("Item Total")}</p>
                                                <p className="text-xl font-bold text-orange-800 dark:text-orange-200 text-center">{formatCurrency(item.total_price)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Batch & Additional Costs */}
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                    <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <Receipt className="h-6 w-6 text-blue-600" />
                                            {t("Batch & Costs")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Batch Dates */}
                                            {item.batch && (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{t("Issue Date")}</p>
                                                            <p className="text-sm font-bold text-blue-800 dark:text-blue-200">{formatDate(item.batch.issue_date)}</p>
                                                        </div>
                                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">{t("Expire Date")}</p>
                                                            <p className="text-sm font-bold text-orange-800 dark:text-orange-200">{formatDate(item.batch.expire_date)}</p>
                                                        </div>
                                                    </div>

                                                    {/* Expiry Status */}
                                                    <div className="flex justify-center">
                                                        <Badge className={`${expiryStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                                                                expiryStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                                                                    expiryStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {expiryStatus.text}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Additional Costs */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("Additional Costs")}</p>
                                                    <Link
                                                        href={route("admin.purchases.items.additional-costs", [purchase.id, item.id])}
                                                        className="text-blue-600 hover:text-blue-800 text-xs"
                                                    >
                                                        {t("Manage")}
                                                    </Link>
                                                </div>

                                                {additionalCosts.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {additionalCosts.slice(0, 3).map((cost) => (
                                                            <div key={cost.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                                                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{cost.name}</span>
                                                                <span className="text-xs font-mono text-gray-800 dark:text-gray-200">{formatCurrency(cost.amount)}</span>
                                                            </div>
                                                        ))}
                                                        {additionalCosts.length > 3 && (
                                                            <p className="text-xs text-gray-500 text-center">+{additionalCosts.length - 3} {t("more")}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500 text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">{t("No additional costs")}</p>
                                                )}

                                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-t">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-bold text-red-700 dark:text-red-300">{t("Total Additional")}</span>
                                                        <span className="text-lg font-bold text-red-800 dark:text-red-200">{formatCurrency(totalAdditionalCosts)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Pricing Form */}
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-6xl mx-auto mb-8">
                                <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <Tags className="h-6 w-6 text-blue-600" />
                                        {t("Pricing Management")}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("Set purchase, wholesale, and retail prices for this item")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Pricing Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {/* Purchase Price */}
                                            <div className="space-y-3">
                                                <Label htmlFor="purchase_price" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                    <ShoppingCart className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                                    {t("Purchase Price")}
                                                </Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="purchase_price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder={t("Enter purchase price")}
                                                        value={data.purchase_price}
                                                        onChange={(e) => setData('purchase_price', e.target.value)}
                                                        className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.purchase_price ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-purple-300 focus:border-purple-500'}`}
                                                    />
                                                </div>
                                                {errors.purchase_price && (
                                                    <p className="text-sm text-red-600 font-medium">{errors.purchase_price}</p>
                                                )}
                                                <p className="text-xs text-gray-500">{t("Base cost for this item")}</p>
                                            </div>

                                            {/* Wholesale Price */}
                                            <div className="space-y-3">
                                                <Label htmlFor="wholesale_price" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                    <Building className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                                    {t("Wholesale Price")}
                                                </Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="wholesale_price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder={t("Enter wholesale price")}
                                                        value={data.wholesale_price}
                                                        onChange={(e) => setData('wholesale_price', e.target.value)}
                                                        className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.wholesale_price ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-blue-300 focus:border-blue-500'}`}
                                                    />
                                                </div>
                                                {errors.wholesale_price && (
                                                    <p className="text-sm text-red-600 font-medium">{errors.wholesale_price}</p>
                                                )}
                                                {wholesaleMargin > 0 && (
                                                    <p className="text-xs text-blue-600 font-medium">
                                                        {t("Margin")}: {wholesaleMargin.toFixed(1)}%
                                                    </p>
                                                )}
                                            </div>

                                            {/* Retail Price */}
                                            <div className="space-y-3">
                                                <Label htmlFor="retail_price" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                    <Package2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                                                    {t("Retail Price")}
                                                </Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                    <Input
                                                        id="retail_price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder={t("Enter retail price")}
                                                        value={data.retail_price}
                                                        onChange={(e) => setData('retail_price', e.target.value)}
                                                        className={`pl-12 h-14 text-lg border-2 transition-all duration-200 ${errors.retail_price ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-green-300 focus:border-green-500'}`}
                                                    />
                                                </div>
                                                {errors.retail_price && (
                                                    <p className="text-sm text-red-600 font-medium">{errors.retail_price}</p>
                                                )}
                                                {retailMargin > 0 && (
                                                    <p className="text-xs text-green-600 font-medium">
                                                        {t("Margin")}: {retailMargin.toFixed(1)}%
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-3">
                                            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                                {t("Pricing Notes")}
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                placeholder={t("Enter pricing notes (optional)")}
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                className="min-h-[100px] border-2 border-gray-300 hover:border-slate-300 focus:border-slate-500 resize-none"
                                                rows={4}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-4">
                                                <Link href={route("admin.purchases.show", purchase.id)}>
                                                    <Button type="button" variant="outline" className="px-6">
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            {t("Saving...")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            {t("Update")}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Enhanced Profit Analysis */}
                            {(data.purchase_price || data.wholesale_price || data.retail_price) && (
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border max-w-6xl mx-auto">
                                    <CardHeader className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <TrendingUp className="h-6 w-6 text-green-600" />
                                            {t("Profit Analysis")}
                                        </CardTitle>
                                        <CardDescription>
                                            {t("Includes additional costs in profit calculations")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {/* Cost Breakdown */}
                                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                                <Calculator className="h-5 w-5" />
                                                {t("Total Cost Per Unit")}
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-600">{t("Base Purchase Price")}:</span>
                                                    <span className="font-mono">{formatCurrency(item.price)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-600">{t("Additional Costs per Unit")}:</span>
                                                    <span className="font-mono">+ {formatCurrency(totalAdditionalCosts / (item.quantity / item.unit_amount))}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2 font-bold">
                                                    <span className="text-slate-800 dark:text-slate-200">{t("Total Cost per Unit")}:</span>
                                                    <span className="font-mono text-slate-800 dark:text-slate-200">{formatCurrency(item.price + (totalAdditionalCosts / (item.quantity / item.unit_amount)))}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Wholesale Analysis */}
                                            {data.wholesale_price && (
                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                                                        <Building className="h-5 w-5" />
                                                        {t("Wholesale Analysis")}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-blue-600">{t("Selling Price")}:</span>
                                                            <span className="font-mono">{formatCurrency(data.wholesale_price)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-blue-600">{t("Total Cost")}:</span>
                                                            <span className="font-mono">- {formatCurrency(item.price + (totalAdditionalCosts / (item.quantity / item.unit_amount)))}</span>
                                                        </div>
                                                        <div className="flex justify-between border-t pt-2">
                                                            <span className="font-semibold text-blue-800">{t("Profit")}:</span>
                                                            <span className="font-bold font-mono text-green-600">
                                                                {formatCurrency((data.wholesale_price || 0) - (item.price + (totalAdditionalCosts / (item.quantity / item.unit_amount))))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Retail Analysis */}
                                            {data.retail_price && (
                                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                                                        <Package2 className="h-5 w-5" />
                                                        {t("Retail Analysis")}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-green-600">{t("Selling Price")}:</span>
                                                            <span className="font-mono">{formatCurrency(data.retail_price)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-green-600">{t("Total Cost")}:</span>
                                                            <span className="font-mono">- {formatCurrency(data.retail_price * item.unit_amount)}</span>
                                                        </div>
                                                        <div className="flex justify-between border-t pt-2">
                                                            <span className="font-semibold text-green-800">{t("Profit")}:</span>
                                                            <span className="font-bold font-mono text-green-600">
                                                                {/* {formatCurrency(data.retail_price * item.unit_amount-(data.retail_price || 0))} - {formatCurrency(data.purchase_price)} */}
                                                                {formatCurrency(data.retail_price * item.unit_amount-(data.purchase_price || 0))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </>
    );
} 