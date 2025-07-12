import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Building2,
    ArrowLeft,
    TrendingUp,
    Package,
    DollarSign,
    Hash,
    Calculator,
    ShoppingCart,
    Save,
    AlertCircle,
    AlertTriangle,
    Weight,
    Package2,
    CheckCircle,
    Sparkles,
    Plus,
    Trash2,
    Edit,
    X,
    Calendar,
    Clock
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function CreateIncome({ auth, warehouse, products }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [incomeItems, setIncomeItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        product_id: '',
        batch_reference: '',
        issue_date: '',
        expire_date: '',
        quantity: '',
        price: '',
        unit_type: 'batch_unit',
        batch_notes: ''
    });

    const { data, setData, post, processing, errors } = useForm({
        income_items: [],
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

    // Update selected product when product_id changes
    useEffect(() => {
        if (currentItem.product_id) {
            const product = products.find(p => p.id === parseInt(currentItem.product_id));
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
    }, [currentItem.product_id, products]);

    // Update form data when income items change
    useEffect(() => {
        setData('income_items', incomeItems);
    }, [incomeItems]);

    const getSelectedProduct = (productId) => {
        const productsArray = Array.isArray(products) ? products : [];
        return productsArray.find(p => p.id === parseInt(productId)) || null;
    };

    const getAvailableUnits = (product) => {
        const units = [];

        if (product?.unit) {
            units.push({
                type: 'batch_unit',
                label: `${product.unit.name} (${product.unit.code})`,
                amount: 1,
                price: product.wholesale_price || product.retail_price || 0,
                unit_name: product.unit.name
            });
        }

        return units;
    };

    const calculateActualQuantity = (product, unitType, quantity) => {
        let actualQuantity = parseFloat(quantity) || 0;
        
        if (unitType === 'batch_unit' && product?.unit) {
            actualQuantity = actualQuantity * 1; // For income, we use the unit as is
        }
        
        return actualQuantity;
    };

    const addItemToIncome = () => {
        const product = getSelectedProduct(currentItem.product_id);
        
        if (!product || !currentItem.quantity || !currentItem.price || !currentItem.batch_reference) {
            return;
        }

        const actualQuantity = calculateActualQuantity(product, 'batch_unit', currentItem.quantity);
        const totalPrice = actualQuantity * parseFloat(currentItem.price);

        const newItem = {
            id: Date.now(), // Temporary ID for frontend
            product_id: parseInt(currentItem.product_id),
            product: product,
            batch_reference: currentItem.batch_reference,
            issue_date: currentItem.issue_date,
            expire_date: currentItem.expire_date,
            unit_type: 'batch_unit',
            entered_quantity: parseFloat(currentItem.quantity),
            actual_quantity: actualQuantity,
            unit_price: parseFloat(currentItem.price),
            total_price: totalPrice,
            batch_notes: currentItem.batch_notes
        };

        setIncomeItems([...incomeItems, newItem]);
        
        // Reset current item
        setCurrentItem({
            product_id: '',
            batch_reference: '',
            issue_date: '',
            expire_date: '',
            quantity: '',
            price: '',
            unit_type: 'batch_unit',
            batch_notes: ''
        });
    };

    const removeItemFromIncome = (itemId) => {
        setIncomeItems(incomeItems.filter(item => item.id !== itemId));
    };

    const getTotalIncomeAmount = () => {
        return incomeItems.reduce((sum, item) => sum + item.total_price, 0);
    };

    const getTotalItems = () => {
        return incomeItems.reduce((sum, item) => sum + item.entered_quantity, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (incomeItems.length === 0) {
            return;
        }

        setLoading(true);
        
        const submissionData = {
            income_items: incomeItems.map(item => ({
                product_id: item.product_id,
                batch_reference: item.batch_reference,
                issue_date: item.issue_date,
                expire_date: item.expire_date,
                quantity: item.actual_quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
                unit_type: item.unit_type,
                batch_notes: item.batch_notes
            })),
            notes: data.notes
        };

        router.post(route('admin.warehouses.income.store', warehouse.id), submissionData, {
            onFinish: () => setLoading(false),
            onError: (errors) => {
                console.log('Submission errors:', errors);
                setLoading(false);
            },
            onSuccess: () => {
                setLoading(false);
            }
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const currentProduct = getSelectedProduct(currentItem.product_id);

    return (
        <>
            <Head title={`${warehouse?.name} - ${t("Create Import")}`}>
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
                        0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
                        50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
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
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #22c55e, #16a34a) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} icon={TrendingUp} color="green" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
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
                                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                    className="relative float-animation"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl blur-lg opacity-60"></div>
                                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-4 rounded-2xl shadow-2xl">
                                        <TrendingUp className="w-8 h-8 text-white" />
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {warehouse?.name} - {t("Create Import")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {t("Create Import")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        {t("Create a new import with multiple products and batches")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center space-x-3"
                            >
                                <Link href={route("admin.warehouses.income", warehouse.id)}>
                                    <Button variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-700 dark:text-slate-200 hover:text-green-700 dark:hover:text-green-300">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Imports")}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-700 scrollbar-track-transparent">
                        <div className="p-8">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="max-w-6xl mx-auto"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Add Product Item */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                        <Plus className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Add Product to Import")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Product Selection */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Package className="w-5 h-5 text-green-500" />
                                                            {t("Product")} *
                                                        </Label>
                                                        <Select
                                                            value={currentItem.product_id}
                                                            onValueChange={(value) => setCurrentItem({...currentItem, product_id: value, unit_type: '', price: ''})}
                                                        >
                                                            <SelectTrigger className="h-12 text-base border-2 border-slate-200 hover:border-green-300 focus:border-green-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400">
                                                                <SelectValue placeholder={t("Select a product")} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                                {Array.isArray(products) ? products.map((product) => (
                                                                    <SelectItem key={product.id} value={product.id.toString()} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                        <div className="flex items-center space-x-3">
                                                                            <Package className="h-4 w-4 text-green-600" />
                                                                            <div>
                                                                                <div className="font-semibold text-slate-800 dark:text-white">{product.name}</div>
                                                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                                    {product.barcode} | {product.type}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                )) : (
                                                                    <SelectItem value="" disabled>
                                                                        No products available
                                                                    </SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Batch Reference */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Hash className="w-5 h-5 text-emerald-500" />
                                                            {t("Batch Reference")} *
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            placeholder={t("Enter batch reference number")}
                                                            value={currentItem.batch_reference}
                                                            onChange={(e) => setCurrentItem({...currentItem, batch_reference: e.target.value})}
                                                            className="h-12 text-base border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Issue Date */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Calendar className="w-5 h-5 text-blue-500" />
                                                            {t("Issue Date")} *
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={currentItem.issue_date}
                                                            onChange={(e) => setCurrentItem({...currentItem, issue_date: e.target.value})}
                                                            className="h-12 text-base border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white"
                                                        />
                                                    </div>

                                                    {/* Expiry Date */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Clock className="w-5 h-5 text-orange-500" />
                                                            {t("Expiry Date")}
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={currentItem.expire_date}
                                                            onChange={(e) => setCurrentItem({...currentItem, expire_date: e.target.value})}
                                                            className="h-12 text-base border-2 border-slate-200 hover:border-orange-300 focus:border-orange-500 bg-white dark:bg-slate-800 dark:text-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Unit Type - Auto-determined from product */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Weight className="w-5 h-5 text-purple-500" />
                                                            {t("Unit Type")}
                                                        </Label>
                                                        <div className="h-12 flex items-center px-3 border-2 border-slate-200 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 rounded-md">
                                                            <span className="text-slate-600 dark:text-slate-400">
                                                                {currentProduct && currentProduct.unit ? 
                                                                    `${currentProduct.unit.name} (${currentProduct.unit.code})` : 
                                                                    t("Select product to see unit")
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Hash className="w-5 h-5 text-green-500" />
                                                            {t("Quantity")} *
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            placeholder={t("Enter quantity")}
                                                            value={currentItem.quantity}
                                                            onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                                                            className="h-12 text-base border-2 border-slate-200 hover:border-green-300 focus:border-green-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                                                        />
                                                    </div>

                                                    {/* Price */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <DollarSign className="w-5 h-5 text-yellow-500" />
                                                            {t("Unit Price")} *
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder={t("Enter price")}
                                                            value={currentItem.price}
                                                            onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})}
                                                            className="h-12 text-base border-2 border-slate-200 hover:border-yellow-300 focus:border-yellow-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Batch Notes */}
                                                <div className="space-y-3">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                        <Package2 className="w-5 h-5 text-indigo-500" />
                                                        {t("Batch Notes")}
                                                    </Label>
                                                    <Textarea
                                                        placeholder={t("Enter any notes about this batch...")}
                                                        value={currentItem.batch_notes}
                                                        onChange={(e) => setCurrentItem({...currentItem, batch_notes: e.target.value})}
                                                        rows={2}
                                                        className="resize-none text-base border-2 border-slate-200 hover:border-indigo-300 focus:border-indigo-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                                                    />
                                                </div>

                                                {/* Add Button */}
                                                <div className="flex justify-end">
                                                    <Button
                                                        type="button"
                                                        onClick={addItemToIncome}
                                                        disabled={!currentItem.product_id || !currentItem.batch_reference || !currentItem.issue_date || !currentItem.quantity || !currentItem.price}
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2 px-6 py-3"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        {t("Add Item")}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Income Items List */}
                                    <AnimatePresence>
                                        {incomeItems.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                    <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                                <TrendingUp className="h-6 w-6 text-white" />
                                                            </div>
                                                            {t("Import Items")}
                                                            <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                                {incomeItems.length} {t("items")}
                                                            </Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-0">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead className="bg-slate-50 dark:bg-slate-800">
                                                                    <tr>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Product")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Batch")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Unit Type")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Quantity")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Unit Price")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Total")}</th>
                                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">{t("Actions")}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                                    {incomeItems.map((item, index) => (
                                                                        <motion.tr
                                                                            key={item.id}
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -20 }}
                                                                            transition={{ delay: index * 0.1 }}
                                                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                                        >
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex items-center gap-3">
                                                                                    <Package className="h-5 w-5 text-green-600" />
                                                                                    <div>
                                                                                        <div className="font-semibold text-slate-800 dark:text-white">{item.product.name}</div>
                                                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.product.barcode}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Hash className="h-4 w-4 text-emerald-600" />
                                                                                    <div>
                                                                                        <div className="font-semibold text-slate-800 dark:text-white">
                                                                                            {item.batch_reference}
                                                                                        </div>
                                                                                        {item.expire_date && (
                                                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                Exp: {new Date(item.expire_date).toLocaleDateString()}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <Badge variant="outline" className="capitalize">
                                                                                    {item.unit_type}
                                                                                </Badge>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-semibold text-slate-800 dark:text-white">
                                                                                        {item.entered_quantity} units
                                                                                    </span>
                                                                                    <span className="text-sm text-slate-500 dark:text-slate-400">({item.actual_quantity} pieces)</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                                                                                {formatCurrency(item.unit_price)}
                                                                            </td>
                                                                            <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">
                                                                                {formatCurrency(item.total_price)}
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => removeItemFromIncome(item.id)}
                                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </td>
                                                                        </motion.tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Income Summary */}
                                    <AnimatePresence>
                                        {incomeItems.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                                            >
                                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/30 backdrop-blur-xl">
                                                    <CardHeader className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-200/50 dark:border-green-700/50">
                                                        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                                <Calculator className="h-6 w-6 text-white" />
                                                            </div>
                                                            {t("Import Summary")}
                                                            <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                {t("Ready")}
                                                            </Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-8 space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <div className="text-center p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-lg border border-green-200/50 dark:border-green-700/50">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-center gap-2">
                                                                    <Package className="w-4 h-4" />
                                                                    {t("Total Items")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                                    {incomeItems.length}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-1">{t("products")}</p>
                                                            </div>
                                                            <div className="text-center p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-lg border border-green-200/50 dark:border-green-700/50">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-center gap-2">
                                                                    <Hash className="w-4 h-4" />
                                                                    {t("Total Quantity")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                                                    {getTotalItems().toLocaleString()}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-1">{t("pieces")}</p>
                                                            </div>
                                                            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg border-2 border-green-300 dark:border-green-700">
                                                                <p className="text-sm text-green-700 dark:text-green-400 mb-2 flex items-center justify-center gap-2">
                                                                    <DollarSign className="w-4 h-4" />
                                                                    {t("Total Amount")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                                    {formatCurrency(getTotalIncomeAmount())}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Notes */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.4, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader>
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <Package2 className="w-6 h-6 text-purple-500" />
                                                    {t("Additional Notes")}
                                                    <Badge variant="secondary" className="text-xs">
                                                        {t("Optional")}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Textarea
                                                    placeholder={t("Enter any additional notes about this import...")}
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    rows={4}
                                                    className="resize-none text-lg border-2 border-slate-200 hover:border-purple-300 focus:border-purple-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link href={route("admin.warehouses.income", warehouse.id)}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="px-8 py-4 text-lg border-2 hover:scale-105 transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
                                            >
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing || incomeItems.length === 0}
                                            className={`px-8 py-4 text-lg shadow-2xl transition-all duration-200 ${
                                                incomeItems.length === 0
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 hover:scale-105 hover:shadow-3xl'
                                            } text-white`}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                    {t("Creating...")}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-3" />
                                                    {t("Create Import")}
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
