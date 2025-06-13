import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    ArrowRightLeft,
    Package,
    DollarSign,
    Hash,
    FileText,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    Users,
    ShoppingCart,
    Store
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import { Alert, AlertDescription } from '@/Components/ui/alert';

export default function CreateTransfer({ auth, warehouse, warehouses, warehouseProducts }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [availableStock, setAvailableStock] = useState(0);
    const [customerType, setCustomerType] = useState('wholesale'); // wholesale or retail

    // Form for creating transfers
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        to_warehouse_id: '',
        quantity: '',
        price: '',
        customer_type: 'wholesale',
        notes: '',
    });

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fa-IR', {
            style: 'currency',
            currency: 'IRR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const handleProductChange = (productId) => {
        const product = warehouseProducts.find(p => p.id === parseInt(productId));
        setSelectedProduct(product);
        setAvailableStock(product ? product.stock_quantity : 0);
        setData('product_id', productId);
        
        // Auto-set price based on customer type and product pricing
        if (product) {
            const price = customerType === 'wholesale' 
                ? (product.wholesale_price || product.price)
                : (product.retail_price || product.price);
            setData('price', price);
        }

        // Reset quantity when product changes
        setData('quantity', '');
    };

    const handleCustomerTypeChange = (type) => {
        setCustomerType(type);
        setData('customer_type', type);
        
        // Update price based on customer type
        if (selectedProduct) {
            const price = type === 'wholesale' 
                ? (selectedProduct.wholesale_price || selectedProduct.price)
                : (selectedProduct.retail_price || selectedProduct.price);
            setData('price', price);
        }
    };

    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value) || 0;
        setData('quantity', e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side validation for stock
        if (parseInt(data.quantity) > availableStock) {
            alert(`موجودی کافی نیست. موجودی فعلی: ${availableStock} واحد`);
            return;
        }

        post(route('admin.warehouses.transfers.store', warehouse.id));
    };

    const calculateTotal = () => {
        const quantity = parseFloat(data.quantity) || 0;
        const price = parseFloat(data.price) || 0;
        return quantity * price;
    };

    const isQuantityValid = () => {
        const quantity = parseInt(data.quantity) || 0;
        return quantity > 0 && quantity <= availableStock;
    };

    const getCustomerTypeInfo = () => {
        return {
            wholesale: {
                icon: <Building2 className="h-4 w-4" />,
                label: t('Wholesale'),
                description: t('Bulk transfer at wholesale prices'),
                color: 'blue'
            },
            retail: {
                icon: <Store className="h-4 w-4" />,
                label: t('Retail'),
                description: t('Individual transfer at retail prices'),
                color: 'green'
            }
        };
    };

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Create Transfer")}`}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
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
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.warehouses" />

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
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                                        <ArrowRightLeft className="w-8 h-8 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1"
                                    >
                                        {warehouse?.name} - {t("Create Transfer")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                    >
                                        {t("New Warehouse Transfer")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {t("Transfer inventory with wholesale/retail pricing")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.warehouses.transfers", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Transfers")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-4xl mx-auto space-y-6"
                            >
                                {/* Customer Type Selection */}
                                <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20 dark:border-slate-700/50">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Transfer Type")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Select the type of transfer to determine pricing")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(getCustomerTypeInfo()).map(([type, info]) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => handleCustomerTypeChange(type)}
                                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                                        customerType === type
                                                            ? `border-${info.color}-500 bg-${info.color}-50 dark:bg-${info.color}-900/20`
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${
                                                            customerType === type
                                                                ? `bg-${info.color}-500 text-white`
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                        }`}>
                                                            {info.icon}
                                            </div>
                                                        <div className="text-left">
                                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                                {info.label}
                                                            </h3>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                {info.description}
                                                            </p>
                                            </div>
                                            </div>
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Transfer Form */}
                                <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20 dark:border-slate-700/50">
                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                                <Package className="h-5 w-5 text-white" />
                                            </div>
                                            {t("Transfer Details")}
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {t("Fill in the transfer information below")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Product Selection */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="product_id" className="text-base font-semibold flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-purple-600" />
                                                        {t("Product")} <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select value={data.product_id} onValueChange={handleProductChange}>
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue placeholder={t("Select a product")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {warehouseProducts.map((product) => (
                                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                                    <div className="flex items-center justify-between w-full">
                                                                        <div className="flex items-center gap-2">
                                                                            <Package className="h-4 w-4 text-purple-500" />
                                                                            <div>
                                                                                <p className="font-medium">{product.name}</p>
                                                                                <div className="flex gap-2 text-xs">
                                                                                    <span className="text-slate-500">
                                                                                        W: {formatCurrency(product.wholesale_price || product.price)}
                                                                                    </span>
                                                                                    <span className="text-slate-500">
                                                                                        R: {formatCurrency(product.retail_price || product.price)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <Badge variant="outline" className="ml-2">
                                                                            {t("Stock")}: {product.stock_quantity}
                                                                        </Badge>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.product_id && (
                                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.product_id}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Destination Warehouse */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="to_warehouse_id" className="text-base font-semibold flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-purple-600" />
                                                        {t("Destination Warehouse")} <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select value={data.to_warehouse_id} onValueChange={(value) => setData('to_warehouse_id', value)}>
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue placeholder={t("Select destination warehouse")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {warehouses.filter(w => w.id !== warehouse.id).map((w) => (
                                                                <SelectItem key={w.id} value={w.id.toString()}>
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="h-4 w-4 text-blue-500" />
                                                                        <div>
                                                                            <p className="font-medium">{w.name}</p>
                                                                            <p className="text-xs text-slate-500">
                                                                                {t("Code")}: {w.code}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.to_warehouse_id && (
                                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.to_warehouse_id}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Quantity */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="quantity" className="text-base font-semibold flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-purple-600" />
                                                        {t("Quantity")} <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        min="1"
                                                        max={availableStock}
                                                        value={data.quantity}
                                                        onChange={handleQuantityChange}
                                                        placeholder={t("Enter quantity")}
                                                        className={`h-12 text-lg ${!isQuantityValid() && data.quantity ? 'border-red-500' : ''}`}
                                                    />
                                                    {selectedProduct && (
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="outline">
                                                                {t("Available")}: {availableStock} {t("units")}
                                                            </Badge>
                                                            {data.quantity && !isQuantityValid() && (
                                                                <Badge variant="destructive">
                                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                                    {t("Exceeds stock")}
                                                                </Badge>
                                                            )}
                                                            {data.quantity && isQuantityValid() && (
                                                                <Badge variant="success">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    {t("Valid quantity")}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                    {errors.quantity && (
                                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.quantity}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Unit Price */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="price" className="text-base font-semibold flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-purple-600" />
                                                        {t("Unit Price")} ({customerType === 'wholesale' ? t('Wholesale') : t('Retail')}) <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={data.price}
                                                        onChange={(e) => setData('price', e.target.value)}
                                                        placeholder={t("Enter unit price")}
                                                        className="h-12 text-lg"
                                                    />
                                                    {errors.price && (
                                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.price}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Total Calculation */}
                                            {data.quantity && data.price && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                                >
                                                    <Alert>
                                                        <AlertCircle className="h-4 w-4" />
                                                        <AlertDescription>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                                <div>
                                                                    <strong>{t("Transfer Type")}: </strong>
                                                                    <Badge variant={customerType === 'wholesale' ? 'default' : 'secondary'}>
                                                                        {customerType === 'wholesale' ? t('Wholesale') : t('Retail')}
                                                                    </Badge>
                                                                </div>
                                                                <div>
                                                                    <strong>{t("Unit Price")}: </strong>
                                                                    {formatCurrency(data.price)}
                                                                </div>
                                                                <div>
                                                                    <strong>{t("Total Value")}: </strong>
                                                                    <span className="text-lg font-bold">{formatCurrency(calculateTotal())}</span>
                                                                </div>
                                                            </div>
                                                        </AlertDescription>
                                                    </Alert>
                                                </motion.div>
                                            )}

                                            {/* Notes */}
                                            <div className="space-y-2">
                                                <Label htmlFor="notes" className="text-base font-semibold flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-purple-600" />
                                                    {t("Notes")} ({t("Optional")})
                                                </Label>
                                                <Textarea
                                                    id="notes"
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    placeholder={t("Enter any additional notes for this transfer")}
                                                    rows={4}
                                                    className="resize-none"
                                                />
                                                {errors.notes && (
                                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.notes}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Form Actions */}
                                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                                                <Link href={route("admin.warehouses.transfers", warehouse.id)}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="px-8 py-3 hover:scale-105 transition-transform"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        {t("Cancel")}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing || !isQuantityValid() || !data.product_id || !data.to_warehouse_id}
                                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-transform"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            {t("Creating...")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            {t("Create Transfer")}
                                                        </>
                                                    )}
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
