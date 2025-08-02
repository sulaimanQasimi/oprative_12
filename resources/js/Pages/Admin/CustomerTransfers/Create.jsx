import React, { useState, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Store,
    ArrowLeft,
    Plus,
    Trash2,
    Package,
    Users,
    Search,
    X,
    AlertCircle,
    Package2,
    Weight,
    Hash,
    DollarSign,
    Building2,
    CheckCircle
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import BackButton from "@/Components/BackButton";
import ApiSelect from "@/Components/ApiSelect";

export default function Create({ auth, customers = [], products = [] }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [formData, setFormData] = useState({
        from_customer_id: '',
        to_customer_id: '',
        notes: '',
        transfer_items: []
    });
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [currentItem, setCurrentItem] = useState({
        inventory_id: '',
        product_id: '',
        batch_id: '',
        quantity: '',
        unit_type: 'batch_unit',
        unit_price: ''
    });
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

    // Animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setIsAnimated(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter products based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products]);

    // Reset inventory selection when from_customer_id changes
    useEffect(() => {
        setCurrentItem({
            inventory_id: '',
            product_id: '',
            batch_id: '',
            quantity: '',
            unit_type: 'batch_unit',
            unit_price: ''
        });
        setSelectedInventoryItem(null);
    }, [formData.from_customer_id]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const addTransferItem = () => {
        if (!selectedInventoryItem || !currentItem.quantity || !currentItem.unit_price) {
            return;
        }

        const newItem = {
            id: Date.now(),
            inventory_id: currentItem.inventory_id,
            product_id: selectedInventoryItem.data.product_id,
            batch_id: selectedInventoryItem.data.batch_id,
            product: {
                name: selectedInventoryItem.data.product_name,
                barcode: selectedInventoryItem.data.product_barcode
            },
            batch: {
                reference_number: selectedInventoryItem.data.batch_reference,
                expire_date: selectedInventoryItem.data.expire_date,
                unit_name: selectedInventoryItem.data.unit_name,
                wholesale_price: selectedInventoryItem.data.wholesale_price,
                retail_price: selectedInventoryItem.data.retail_price
            },
            unit_type: currentItem.unit_type,
            quantity: parseFloat(currentItem.quantity),
            unit_price: parseFloat(currentItem.unit_price),
            total_price: parseFloat(currentItem.quantity) * parseFloat(currentItem.unit_price)
        };

        setFormData(prev => ({
            ...prev,
            transfer_items: [...prev.transfer_items, newItem]
        }));

        // Reset current item
        setCurrentItem({
            inventory_id: '',
            product_id: '',
            batch_id: '',
            quantity: '',
            unit_type: 'batch_unit',
            unit_price: ''
        });
        setSelectedInventoryItem(null);
    };

    const getAvailableUnits = (inventoryItem) => {
        if (!inventoryItem) return [];

        const units = [];
        
        if (inventoryItem.data.unit_name && inventoryItem.data.unit_amount) {
            units.push({
                type: 'batch_unit',
                label: `${inventoryItem.data.unit_name} (${inventoryItem.data.available_quantity}/${inventoryItem.data.unit_amount} ${inventoryItem.data.unit_name})`,
                amount: inventoryItem.data.unit_amount,
                wholesale_price: inventoryItem.data.wholesale_price,
                retail_price: inventoryItem.data.retail_price,
                unit_name: inventoryItem.data.unit_name
            });
        }

        return units;
    };

    const getAvailableStock = (inventoryItem, unitType) => {
        if (!inventoryItem) return 0;

        let stock = inventoryItem.data.available_quantity || 0;
        if (unitType === 'batch_unit' && inventoryItem.data.unit_amount) {
            stock = Math.floor(stock / inventoryItem.data.unit_amount);
        }
        return stock;
    };

    const calculateActualQuantity = (inventoryItem, unitType, quantity) => {
        let actualQuantity = parseFloat(quantity) || 0;

        if (unitType === 'batch_unit' && inventoryItem?.data?.unit_amount) {
            actualQuantity = actualQuantity * inventoryItem.data.unit_amount;
        }

        return actualQuantity;
    };

    const removeTransferItem = (itemId) => {
        setFormData(prev => ({
            ...prev,
            transfer_items: prev.transfer_items.filter(item => item.id !== itemId)
        }));
    };

    const updateTransferItem = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            transfer_items: prev.transfer_items.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors = {};
        
        if (!formData.from_customer_id) {
            newErrors.from_customer_id = t('From customer is required');
        }
        
        if (!formData.to_customer_id) {
            newErrors.to_customer_id = t('To customer is required');
        }
        
        if (formData.from_customer_id === formData.to_customer_id) {
            newErrors.to_customer_id = t('From and To customers must be different');
        }
        
        if (formData.transfer_items.length === 0) {
            newErrors.transfer_items = t('At least one transfer item is required');
        }
        
        formData.transfer_items.forEach((item, index) => {
            if (!item.product_id) {
                newErrors[`transfer_items.${index}.product_id`] = t('Product is required');
            }
            if (!item.quantity || item.quantity <= 0) {
                newErrors[`transfer_items.${index}.quantity`] = t('Quantity must be greater than 0');
            }
            if (!item.unit_price || item.unit_price <= 0) {
                newErrors[`transfer_items.${index}.unit_price`] = t('Unit price must be greater than 0');
            }
        });
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        router.post(route('admin.customer-transfers.store'), formData);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AFN',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const calculateTotal = () => {
        return formData.transfer_items.reduce((total, item) => {
            return total + (item.total_price || 0);
        }, 0);
    };

    const getTotalItems = () => {
        return formData.transfer_items.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <>
            <Head title={t("Create Customer Transfer")}>
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 1000px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .float-animation {
                        animation: float 6s ease-in-out infinite;
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
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                        border: 2px solid transparent;
                    }

                    .dark .gradient-border {
                        background: linear-gradient(rgb(30 41 59), rgb(30 41 59)) padding-box,
                                    linear-gradient(45deg, #10b981, #059669) border-box;
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
            >
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.customer-transfers" />

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
                                        <Users className="w-8 h-8 text-white" />
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
                                        <Package className="w-4 h-4" />
                                        {t("Create Transfer")}
                                    </motion.p>
                                    <motion.h1
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent"
                                    >
                                        {t("New Customer Transfer")}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <Store className="w-4 h-4" />
                                        {t("Transfer products between customers")}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="flex items-center gap-x-2"
                            >
                                <BackButton link={route("admin.customer-transfers.index")} />
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
                                className="max-w-6xl mx-auto space-y-8"
                            >
                                <form onSubmit={handleSubmit}>
                                    {/* Transfer Details */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.4 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                        <Users className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Transfer Details")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {t("From Customer")} *
                                                        </label>

                                                        <ApiSelect
                                                            apiEndpoint="/api/customers/select"
                                                            placeholder={t("Select From Customer")}
                                                            searchPlaceholder={t("Search customers...")}
                                                            icon={Users}
                                                            direction="ltr"
                                                            value={formData.from_customer_id}
                                                            onChange={(value, option) => handleInputChange('from_customer_id', option.value)}
                                                            searchParam="search"
                                                            requireAuth={false}
                                                            className="w-full"
                                                            error={errors.from_customer_id}
                                                        />
                                                        
                                                        {errors.from_customer_id && (
                                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.from_customer_id}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {formData.from_customer_id && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {t("To Customer")} *
                                                        </label>
                                                        <ApiSelect
                                                            apiEndpoint={`/api/customers/select?except=${formData.from_customer_id}`}
                                                            placeholder={t("Select To Customer")}
                                                            searchPlaceholder={t("Search customers...")}
                                                            icon={Users}
                                                            direction="ltr"
                                                            value={formData.to_customer_id}
                                                            onChange={(value, option) => handleInputChange('to_customer_id', option.value)}
                                                            searchParam="search"
                                                            requireAuth={false}
                                                            className="w-full"
                                                            error={errors.to_customer_id}
                                                        />
                                                        {errors.to_customer_id && (
                                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {errors.to_customer_id}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-6 space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        {t("Notes")}
                                                    </label>
                                                    <Textarea
                                                        value={formData.notes}
                                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                                        placeholder={t("Add any notes about this transfer...")}
                                                        className="min-h-[100px] border-2 border-slate-200 hover:border-green-300 focus:border-green-500 transition-colors"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                    {formData.from_customer_id && formData.to_customer_id && (
                                    <>
                                    {/* Add Product Item */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.0, duration: 0.5 }}
                                    >
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl gradient-border">
                                            <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b border-white/30 dark:border-slate-700/50 rounded-t-xl">
                                                <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-xl">
                                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                        <Plus className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t("Add Product to Transfer")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Inventory Selection */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Package className="w-5 h-5 text-blue-500" />
                                                            {t("Customer Inventory")} *
                                                        </Label>
                                                        <ApiSelect
                                                            apiEndpoint={`/api/customer-inventory/select?customer_id=${formData.from_customer_id}`}
                                                            placeholder={t("Choose inventory item...")}
                                                            searchPlaceholder={t("Search products...")}
                                                            icon={Package}
                                                            direction="ltr"
                                                            value={currentItem.inventory_id}
                                                            onChange={(value, option) => {
                                                                setCurrentItem({ ...currentItem, inventory_id: value ,unit_price:option.data.purchase_price});
                                                                setSelectedInventoryItem(option);
                                                            }}
                                                            searchParam="search"
                                                            requireAuth={false}
                                                            disabled={!formData.from_customer_id}
                                                            className="w-full"
                                                            error={formData.from_customer_id && !selectedInventoryItem ? t("No inventory items found for this customer") : null}
                                                        />
                                                        {!formData.from_customer_id && (
                                                            <p className="text-sm text-orange-600 flex items-center gap-1">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {t("Please select 'From Customer' first")}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Unit Type - Auto-determined from batch */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <Weight className="w-5 h-5 text-orange-500" />
                                                            {t("Unit Type")}
                                                        </Label>
                                                        <div className="h-12 flex items-center px-3 border-2 border-slate-200 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 rounded-md">
                                                            <span className="text-slate-600 dark:text-slate-400">
                                                                {selectedInventoryItem && selectedInventoryItem.data.unit_name ?
                                                                    `${selectedInventoryItem.data.available_quantity / selectedInventoryItem.data.unit_amount} ${selectedInventoryItem.data.unit_name}` :
                                                                    t("Select inventory item to see unit")
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                                            max={selectedInventoryItem ? getAvailableStock(selectedInventoryItem, currentItem.unit_type) : undefined}
                                                            placeholder={t("Enter quantity")}
                                                            value={currentItem.quantity}
                                                            onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                                                            className="h-12 text-base border-2 border-slate-200 hover:border-green-300 focus:border-green-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                                                            disabled={!selectedInventoryItem}
                                                        />
                                                        {selectedInventoryItem && currentItem.unit_type && (
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                {t('Available:')} {getAvailableStock(selectedInventoryItem, currentItem.unit_type)} {selectedInventoryItem.data.unit_name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Unit Price Selection */}
                                                    <div className="space-y-3">
                                                        <Label className="text-slate-700 dark:text-slate-300 font-semibold text-lg flex items-center gap-2">
                                                            <DollarSign className="w-5 h-5 text-purple-500" />
                                                            {t("Unit Price")} *
                                                        </Label>
                                                        <div className="h-12 flex items-center px-3 border-2 border-slate-200 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 rounded-md">
                                                            <span className="text-slate-600 dark:text-slate-400"
                                                            dir="ltr"
                                                            onValueChange={(value) => setCurrentItem({ ...currentItem, unit_price: value })}
                                                            onValueChangeCapture={(value) => setCurrentItem({ ...currentItem, unit_price: value })}
                                                            >
                                                                {selectedInventoryItem && selectedInventoryItem.data.purchase_price ?
                                                                    `${formatCurrency(selectedInventoryItem.data.purchase_price)}` :
                                                                    t("Select inventory item to see unit price")
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Add Button */}
                                                {selectedInventoryItem && currentItem.unit_price && currentItem.quantity < (selectedInventoryItem.data.available_quantity/selectedInventoryItem.data.unit_amount) && (
                                                <div className="flex justify-center">
                                                    <Button
                                                        type="button"
                                                        onClick={addTransferItem}
                                                        disabled={!selectedInventoryItem || !currentItem.quantity || !currentItem.unit_price}
                                                        className="gap-2 h-12 px-8 bg-green-600 hover:bg-green-700 text-lg"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        {t("Add Item")}
                                                    </Button>
                                                </div>
                                                )}
                                                {/* Inventory Information Display */}
                                                <AnimatePresence>
                                                    {selectedInventoryItem && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Alert className={`border-2 ${selectedInventoryItem.data.expiry_status === 'expired' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                                                                    selectedInventoryItem.data.expiry_status === 'expiring_soon' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20' :
                                                                        'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                                                                }`}>
                                                                <Package2 className={`h-5 w-5 ${selectedInventoryItem.data.expiry_status === 'expired' ? 'text-red-600' :
                                                                        selectedInventoryItem.data.expiry_status === 'expiring_soon' ? 'text-orange-600' :
                                                                            'text-blue-600'
                                                                    }`} />
                                                                <AlertDescription className={`${selectedInventoryItem.data.expiry_status === 'expired' ? 'text-red-700 dark:text-red-400' :
                                                                        selectedInventoryItem.data.expiry_status === 'expiring_soon' ? 'text-orange-700 dark:text-orange-400' :
                                                                            'text-blue-700 dark:text-blue-400'
                                                                    }`}>
                                                                    <div className="space-y-2">
                                                                        <div className="font-medium flex items-center gap-2">
                                                                            {t('Selected Item')}: {selectedInventoryItem.data.product_name} - {selectedInventoryItem.data.batch_reference}
                                                                            {selectedInventoryItem.data.expiry_status === 'expired' && (
                                                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">{t('Expired')}</span>
                                                                            )}
                                                                            {selectedInventoryItem.data.expiry_status === 'expiring_soon' && (
                                                                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">
                                                                                    {t('Expires in')} {selectedInventoryItem.data.days_to_expiry} {t('days')}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            {t('Available')}: <span className="font-medium">{selectedInventoryItem.data.available_quantity} {selectedInventoryItem.data.unit_name}</span>
                                                                            {selectedInventoryItem.data.expire_date && (
                                                                                <span> | {t('Expires')}: {new Date(selectedInventoryItem.data.expire_date).toLocaleDateString()}</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            {t('Wholesale')}: {formatCurrency(selectedInventoryItem.data.wholesale_price || 0)} | {t('Retail')}: {formatCurrency(selectedInventoryItem.data.retail_price || 0)}
                                                                        </div>
                                                                    </div>
                                                                </AlertDescription>
                                                            </Alert>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                    </>
                                    )}
                                    {/* Transfer Items List */}
                                    <AnimatePresence>
                                        {formData.transfer_items.length > 0 && (
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
                                                                <Package className="h-6 w-6 text-white" />
                                                            </div>
                                                            {t("Transfer Items")}
                                                            <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                                {formData.transfer_items.length} {t("items")}
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
                                                                    {formData.transfer_items.map((item, index) => (
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
                                                                                    <Package2 className="h-4 w-4 text-indigo-600" />
                                                                                    <div>
                                                                                        <div className="font-semibold text-slate-800 dark:text-white">
                                                                                            {item.batch?.reference_number || 'N/A'}
                                                                                        </div>
                                                                                        {item.batch?.expire_date && (
                                                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                Exp: {new Date(item.batch.expire_date).toLocaleDateString()}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <Badge variant="outline" className="capitalize">
                                                                                    {item.unit_type === 'batch_unit' && item.batch?.unit_name ? `${item.batch.unit_name}` : item.unit_type}
                                                                                </Badge>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-semibold text-slate-800 dark:text-white">
                                                                                        {item.unit_type === 'batch_unit' && item.batch?.unit_name ?
                                                                                            `${item.quantity} ${item.batch.unit_name}` :
                                                                                            `${item.quantity} units`
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <span className="font-semibold text-green-600">
                                                                                    {formatCurrency(item.unit_price)}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <span className="font-semibold text-green-600">
                                                                                    {formatCurrency(item.total_price)}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => removeTransferItem(item.id)}
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

                                    {/* Transfer Summary */}
                                    <AnimatePresence>
                                        {formData.transfer_items.length > 0 && (
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
                                                                <Hash className="h-6 w-6 text-white" />
                                                            </div>
                                                            {t("Transfer Summary")}
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
                                                                    {formData.transfer_items.length}
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
                                                            <div className="text-center p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-lg border border-green-200/50 dark:border-green-700/50">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-center gap-2">
                                                                    <DollarSign className="w-4 h-4" />
                                                                    {t("Total Amount")}
                                                                </p>
                                                                <p className="text-3xl font-bold text-green-600">
                                                                    {formatCurrency(calculateTotal())}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-1">{t("AFN")}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.4 }}
                                        className="flex justify-end space-x-6 pt-6"
                                    >
                                        <Link href={route("admin.customer-transfers.index")}>
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
                                            disabled={formData.transfer_items.length === 0}
                                            className={`px-8 py-4 text-lg shadow-2xl transition-all duration-200 ${formData.transfer_items.length === 0
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 hover:scale-105 hover:shadow-3xl'
                                                } text-white`}
                                        >
                                            <Package className="h-5 w-5 mr-3" />
                                            {t("Create Transfer")}
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