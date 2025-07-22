import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import CustomerNavbar from '@/Components/CustomerNavbar';
import {
    ShoppingCart, Plus, X, Search, Minus, CheckCircle,
    CreditCard, DollarSign, Barcode, Package, ShoppingBag,
    Hash, Calendar, AlertTriangle, Clock, Eye, EyeOff,
    Coffee, Smartphone, Laptop, BookOpen
} from 'lucide-react';
import axios from 'axios';

// Configure axios
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// CSRF token setup
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
};

const xsrfToken = getCookie('XSRF-TOKEN');
if (xsrfToken) {
    axios.defaults.headers.common['X-XSRF-TOKEN'] = xsrfToken;
}

export default function MarketOrderCreate({ auth, paymentMethods, tax_percentage, defaultCurrency }) {
    const { t } = useLaravelReactI18n();

    // Core POS State
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [changeDue, setChangeDue] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [notes, setNotes] = useState('');
    const [orderSectionVisible, setOrderSectionVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // Batch Selection State
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batchSelectionMode, setBatchSelectionMode] = useState('new'); // 'new' or 'change'

    // Account Selection State
    const [accountSearchQuery, setAccountSearchQuery] = useState('');
    const [accountSearchResults, setAccountSearchResults] = useState([]);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [accountHighlightIndex, setAccountHighlightIndex] = useState(0);
    const [accountSearchLoading, setAccountSearchLoading] = useState(false);

    // UI State
    const [notification, setNotification] = useState(null);

    // Refs
    const barcodeInputRef = useRef(null);
    const accountSearchInputRef = useRef(null);
    const amountPaidRef = useRef(null);

    // Utility Functions
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: defaultCurrency?.code || 'AFN',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const showSuccess = (message) => {
        setNotification({ type: 'success', message });
        setTimeout(() => setNotification(null), 3000);
    };

    const showError = (message) => {
        setNotification({ type: 'error', message });
        setTimeout(() => setNotification(null), 5000);
    };

    const getProductIcon = (product) => {
        const name = product.name?.toLowerCase() || '';
        if (name.includes('coffee') || name.includes('tea')) return <Coffee className="h-4 w-4" />;
        if (name.includes('phone') || name.includes('mobile')) return <Smartphone className="h-4 w-4" />;
        if (name.includes('laptop') || name.includes('computer')) return <Laptop className="h-4 w-4" />;
        if (name.includes('book')) return <BookOpen className="h-4 w-4" />;
        return <Package className="h-4 w-4" />;
    };

    // Core POS Functions
    const startNewOrder = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/customer/market-order/start');
            if (response.data.success) {
                setCurrentOrderId(response.data.order_id);
                setOrderSectionVisible(true);
                showSuccess(t('New order started'));
                setTimeout(() => barcodeInputRef.current?.focus(), 100);
            } else {
                showError(response.data.message || t('Error starting order'));
            }
        } catch (error) {
            showError(t('Error starting order') + ': ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const processBarcode = async (barcode) => {
        if (!barcode) return;
        
        setIsLoading(true);
        try {
            const response = await axios.post('/customer/market-order/process-barcode', { barcode });
            
            if (response.data.success && response.data.product) {
                const product = response.data.product;
                
                // Check if product has multiple batches
                if (product.has_multiple_batches && product.batches && product.batches.length > 1) {
                    setSelectedProduct(product);
                    setBatchSelectionMode('new');
                    setShowBatchModal(true);
                } else {
                    // Single batch or no batches - add directly
                    const batch = product.batches && product.batches.length === 1 ? product.batches[0] : null;
                    addProductToOrder(product, batch);
                }
                showSuccess(t('Product found') + ': ' + product.name);
            } else {
                showError(t('Product not found or out of stock'));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            if (error.response && error.response.status === 404 && errorMessage.includes('order')) {
                showError(t('Order expired or not found. Please start a new order.'));
                resetOrder(true);
            } else if (errorMessage.includes('order') && errorMessage.includes('invalid')) {
                showError(t('Invalid order ID. Click "Start New Sale" to begin a fresh order.'));
                resetOrder(true);
            } else {
                showError(t('Error processing barcode') + ': ' + errorMessage);
            }
        } finally {
            setIsLoading(false);
            if (barcodeInputRef.current) {
                barcodeInputRef.current.value = '';
                barcodeInputRef.current.focus();
            }
        }
    };

    const addProductToOrder = (product, batch = null) => {
        const productId = product.product_id || product.id;
        
        // Use batch-specific data if available, otherwise use product data
        const retailPrice = batch ? parseFloat(batch.retail_price) : parseFloat(product.retail_price);
        const wholesalePrice = batch ? parseFloat(batch.wholesale_price) : parseFloat(product.wholesale_price || 0);
        const retailUnitName = batch ? batch.retail_unit_name : product.retail_unit_name || 'Piece';
        const wholesaleUnitName = batch ? batch.wholesale_unit_name : product.wholesale_unit_name || 'Wholesale Unit';
        const wholesaleUnitAmount = batch ? parseFloat(batch.unit_amount || 1) : parseFloat(product.wholesale_unit_amount || 1);
        const stock = batch ? batch.stock : product.stock;

        // Always start with retail pricing
        const unitPrice = retailPrice;
        const isWholesale = false; // Always start with retail

        // Check if item already exists with same batch
        const existingItemIndex = orderItems.findIndex(item => 
            item.product_id === productId && item.batch_id === (batch ? batch.id : null)
        );

        if (existingItemIndex !== -1) {
            // Update existing item
            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].quantity += 1;
            updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
            setOrderItems(updatedItems);
        } else {
            // Add new item
            const newItem = {
                product_id: productId,
                name: product.name,
                price: unitPrice,
                quantity: 1,
                total: unitPrice,
                max_stock: stock,
                unit_amount: 1, // Always start with retail (1 unit)
                wholesale_unit_amount: wholesaleUnitAmount,
                is_wholesale: isWholesale,
                wholesale_price: wholesalePrice,
                retail_price: retailPrice,
                batch_id: batch ? batch.id : null,
                batch_reference: batch ? batch.reference_number : null,
                batch_expire_date: batch ? batch.expire_date : null,
                batch_expiry_status: batch ? batch.expiry_status : null,
                batch_days_to_expiry: batch ? batch.days_to_expiry : null,
                unit_type: 'retail', // Always start with retail
                retail_unit_name: retailUnitName,
                wholesale_unit_name: wholesaleUnitName,
                unit_name: retailUnitName, // Current active unit name
                expiry_status: batch ? batch.expiry_status : null,
                days_to_expiry: batch ? batch.days_to_expiry : null,
                barcode: product.barcode,
                batches: product.batches
            };
            
            setOrderItems([...orderItems, newItem]);
        }
    };

    const selectBatch = (batch) => {
        if (batchSelectionMode === 'new') {
            addProductToOrder(selectedProduct, batch);
        } else {
            // Change batch for existing item
            updateItemBatch(selectedProduct.itemIndex, batch);
        }
        
        setShowBatchModal(false);
        setSelectedProduct(null);
        setSelectedBatch(null);
    };

    const updateItemBatch = (itemIndex, batch) => {
        if (itemIndex < 0 || itemIndex >= orderItems.length) return;
        
        const item = orderItems[itemIndex];
        const product = selectedProduct;
        
        const retailPrice = batch ? parseFloat(batch.retail_price) : parseFloat(product.retail_price);
        const wholesalePrice = batch ? parseFloat(batch.wholesale_price) : parseFloat(product.wholesale_price || 0);
        const retailUnitName = batch ? batch.retail_unit_name : product.retail_unit_name || 'Piece';
        const wholesaleUnitName = batch ? batch.wholesale_unit_name : product.wholesale_unit_name || 'Wholesale Unit';
        const wholesaleUnitAmount = batch ? parseFloat(batch.unit_amount || 1) : parseFloat(product.wholesale_unit_amount || 1);
        const stock = batch ? batch.stock : product.stock;

        // Calculate price and unit information based on current wholesale/retail mode
        let currentPrice, currentUnitAmount, currentUnitName;
        
        if (item.is_wholesale) {
            // Wholesale mode: use wholesale price and wholesale unit amount
            currentPrice = wholesalePrice > 0 ? wholesalePrice : retailPrice;
            currentUnitAmount = wholesaleUnitAmount; // Use the wholesale unit amount
            currentUnitName = wholesaleUnitName;
        } else {
            // Retail mode: use retail price and unit amount = 1
            currentPrice = retailPrice;
            currentUnitAmount = 1; // Retail is always 1 unit
            currentUnitName = retailUnitName;
        }

        const updatedItems = [...orderItems];
        updatedItems[itemIndex] = {
            ...item,
            price: currentPrice,
            total: item.quantity * currentPrice,
            max_stock: stock,
            unit_amount: currentUnitAmount,
            wholesale_unit_amount: wholesaleUnitAmount,
            wholesale_price: wholesalePrice,
            retail_price: retailPrice,
            batch_id: batch ? batch.id : null,
            batch_reference: batch ? batch.reference_number : null,
            batch_expire_date: batch ? batch.expire_date : null,
            batch_expiry_status: batch ? batch.expiry_status : null,
            batch_days_to_expiry: batch ? batch.days_to_expiry : null,
            unit_type: item.is_wholesale ? 'wholesale' : 'retail',
            retail_unit_name: retailUnitName,
            wholesale_unit_name: wholesaleUnitName,
            unit_name: currentUnitName,
            expiry_status: batch ? batch.expiry_status : null,
            days_to_expiry: batch ? batch.days_to_expiry : null,
        };

        setOrderItems(updatedItems);
        
        if (batch) {
            showSuccess(t('Updated item with batch') + ': ' + batch.reference_number);
        } else {
            showSuccess(t('Removed batch selection from item'));
        }
    };

    const changeItemBatch = (itemIndex) => {
        const item = orderItems[itemIndex];
        if (!item.batches || item.batches.length === 0) {
            showError(t('No batches available for this product'));
            return;
        }
        
        setSelectedProduct({
            ...item,
            product_id: item.product_id,
            id: item.product_id,
            name: item.name,
            batches: item.batches,
            itemIndex: itemIndex
        });
        setBatchSelectionMode('change');
        setShowBatchModal(true);
    };

    const updateQuantity = (index, change) => {
        if (index < 0 || index >= orderItems.length) return;
        
        const updatedItems = [...orderItems];
        const newQuantity = updatedItems[index].quantity + change;
        
        if (newQuantity <= 0) {
            removeItem(index);
            return;
        }
        
        if (newQuantity > updatedItems[index].max_stock) {
            showError(t('Cannot exceed available stock'));
            return;
        }
        
        updatedItems[index].quantity = newQuantity;
        updatedItems[index].total = newQuantity * updatedItems[index].price;
        setOrderItems(updatedItems);
    };

    const removeItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const toggleItemWholesale = (index) => {
        if (index < 0 || index >= orderItems.length) return;
        
        const item = orderItems[index];
        if (!item.wholesale_price || item.wholesale_price <= 0) {
            showError(t('No wholesale price available for this item'));
            return;
        }

        const updatedItems = [...orderItems];
        const newIsWholesale = !item.is_wholesale;
        
        // Calculate new price and unit information
        let newPrice, newUnitAmount, newUnitName;
        
        if (newIsWholesale) {
            // Switching to wholesale: use wholesale price and wholesale unit amount
            newPrice = item.wholesale_price;
            newUnitAmount = item.wholesale_unit_amount || 1; // Use the wholesale unit amount
            newUnitName = item.wholesale_unit_name || 'Wholesale Unit';
        } else {
            // Switching to retail: use retail price and unit_amount = 1
            newPrice = item.retail_price;
            newUnitAmount = 1; // Retail is always 1 unit
            newUnitName = item.retail_unit_name || 'Piece';
        }
        
        updatedItems[index] = {
            ...item,
            is_wholesale: newIsWholesale,
            price: newPrice,
            unit_amount: newUnitAmount,
            unit_name: newUnitName,
            total: item.quantity * newPrice,
            unit_type: newIsWholesale ? 'wholesale' : 'retail'
        };
        
        setOrderItems(updatedItems);
        
        showSuccess(newIsWholesale ? t('Switched to wholesale pricing') : t('Switched to retail pricing'));
    };

    const calculateTotal = () => {
        const newSubtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        setSubtotal(newSubtotal);
        setTotal(newSubtotal);
        updateChangeDue();
    };

    const updateChangeDue = () => {
        const newChangeDue = amountPaid - total;
        setChangeDue(newChangeDue);
    };

    const completeOrder = async () => {
        if (orderItems.length === 0) {
            showError(t('Please add items to the order before completing'));
            return;
        }

        if (amountPaid < total && !selectedAccount) {
            showError(t('Please enter full payment or select an account for the remaining balance'));
            return;
        }

        if (!currentOrderId) {
            showError(t('Invalid order ID. Please start a new order.'));
            return;
        }

        const orderData = {
            order_id: currentOrderId,
            items: orderItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity, // Frontend quantity (boxes, pieces, etc.)
                price: item.price,
                total: item.total,
                unit_amount: item.unit_amount || 1, // Unit multiplier for wholesale
                is_wholesale: item.is_wholesale || false,
                batch_id: item.batch_id || null,
                batch_reference: item.batch_reference || null,
                batch_number: item.batch_reference || null, // Add batch number for backend
                unit_type: item.is_wholesale ? 'wholesale' : 'retail',
                unit_name: item.unit_name || null
            })),
            subtotal,
            total,
            payment_method: paymentMethod,
            amount_paid: amountPaid,
            account_id: selectedAccount ? selectedAccount.id : null,
            notes
        };

        setIsLoading(true);
        try {
            const response = await axios.post('/customer/market-order/complete', orderData);

            if (response.data.success) {
                showSuccess(response.data.message || t('Order completed successfully'));
                resetOrder(false);
            } else {
                showError(response.data.message || t('Error completing order'));
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.entries(validationErrors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                showError(t('Validation error') + ':\n' + errorMessages);
            } else if (error.response && error.response.status === 404) {
                // Order not found - offer to start new order
                showError(t('Order expired or not found. Please start a new order.'));
                resetOrder(true);
            } else {
                const errorMessage = error.response?.data?.message || error.message;
                if (errorMessage.includes('order') && errorMessage.includes('invalid')) {
                    // Invalid order ID - offer to start new order
                    showError(t('Invalid order ID. Click "Start New Sale" to begin a fresh order.'));
                    resetOrder(true);
                } else {
                    showError(t('Error completing order') + ': ' + errorMessage);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resetOrder = (hideOrderSection = true) => {
        setCurrentOrderId(null);
        setOrderItems([]);
        setSubtotal(0);
        setTotal(0);
        setAmountPaid(0);
        setChangeDue(0);
        setPaymentMethod('cash');
        setNotes('');
        setAccountSearchQuery('');
        setAccountSearchResults([]);
        setShowAccountDropdown(false);
        setSelectedAccount(null);
        setAccountHighlightIndex(0);
        setShowBatchModal(false);
        setSelectedProduct(null);
        setSelectedBatch(null);

        if (hideOrderSection) {
            setOrderSectionVisible(false);
        }
    };

    // Account Search Functions
    const handleAccountSearch = async (query) => {
        if (query.length < 2) {
            setAccountSearchResults([]);
            setShowAccountDropdown(false);
            return;
        }

        setAccountSearchLoading(true);
        try {
            const response = await axios.post('/customer/market-order/search-accounts', { query });
            setAccountSearchResults(response.data);
            setShowAccountDropdown(true);
            setAccountHighlightIndex(0);
        } catch (error) {
            console.error('Account search error:', error);
        } finally {
            setAccountSearchLoading(false);
        }
    };

    const selectAccount = (account) => {
        setSelectedAccount(account);
        setAccountSearchQuery(account.name);
        setShowAccountDropdown(false);
        setAccountSearchResults([]);
    };

    // Effects
    useEffect(() => {
        calculateTotal();
    }, [orderItems]);

    useEffect(() => {
        updateChangeDue();
    }, [amountPaid, total]);



    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'Enter' && orderItems.length > 0 && amountPaid >= total) {
                e.preventDefault();
                completeOrder();
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                startNewOrder();
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                barcodeInputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [orderItems, amountPaid, total]);

    return (
        <>
            <Head title={t('Point of Sale')} />

            <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <CustomerNavbar auth={auth} currentRoute="customer.sales.market-order" />

                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 border-b border-purple-500/20 px-6 py-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <ShoppingCart className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">{t('Point of Sale')}</h1>
                                    <p className="text-purple-100 font-medium">{t('Customer Portal')}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {orderSectionVisible && (
                                    <button
                                        onClick={() => resetOrder(false)}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        {t('Reset Order')}
                                    </button>
                                )}
                                <button
                                    onClick={startNewOrder}
                                    disabled={isLoading || orderSectionVisible}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    {t('Start New Sale')}
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
                        {orderSectionVisible ? (
                            <div className="p-6">
                                <div className="max-w-7xl mx-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column - Products */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Barcode Scanner */}
                                            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300">
                                                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
                                                        <Barcode className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t('Barcode Scanner')}
                                                </h3>
                                                <div className="relative">
                                                    <input
                                                        ref={barcodeInputRef}
                                                        type="text"
                                                        className="w-full px-6 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-500 transition-all duration-200"
                                                        placeholder={t('Scan barcode to add product')}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const barcode = e.target.value.trim();
                                                                if (barcode) {
                                                                    processBarcode(barcode);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    {isLoading && (
                                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                            <div className="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                                                <div className="p-6 border-b border-emerald-200 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                                                    <h3 className="text-xl font-bold flex items-center text-gray-800">
                                                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-3">
                                                            <ShoppingCart className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t('Order Items')}
                                                        {orderItems.length > 0 && (
                                                            <span className="ml-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                                {orderItems.length}
                                                            </span>
                                                        )}
                                                    </h3>
                                                </div>
                                                <div className="p-6">
                                                    {orderItems.length === 0 ? (
                                                        <div className="text-center py-16">
                                                            <div className="relative mb-6">
                                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                                                <div className="relative bg-gradient-to-br from-emerald-100 to-teal-100 p-6 rounded-2xl mx-auto w-fit">
                                                                    <ShoppingCart className="h-16 w-16 text-emerald-600 mx-auto" />
                                                                </div>
                                                            </div>
                                                            <p className="text-xl font-semibold text-gray-700 mb-2">{t('No items in order')}</p>
                                                            <p className="text-gray-500">{t('Scan products to add them')}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {orderItems.map((item, index) => (
                                                                <div key={index} className="group bg-gradient-to-r from-white to-blue-50/50 border-2 border-blue-100 rounded-2xl p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:scale-[1.02]">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center space-x-4">
                                                                            <div className="relative">
                                                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                                    {getProductIcon(item)}
                                                                                </div>
                                                                                {item.expiry_status === 'expiring_soon' && (
                                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                                                                        <AlertTriangle className="h-2 w-2 text-white" />
                                                                                    </div>
                                                                                )}
                                                                                {item.expiry_status === 'expired' && (
                                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                                                        <X className="h-2 w-2 text-white" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        <div className="flex-1">
                                                                            <h4 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h4>
                                                                            
                                                                            {/* Batch Information */}
                                                                            {item.batch_reference && (
                                                                                <div className="mb-2">
                                                                                    <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs rounded-lg font-medium">
                                                                                        <Hash className="h-3 w-3 mr-1" />
                                                                                        {t('Batch')}: {item.batch_reference}
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {/* Quantity and Unit Information */}
                                                                            <div className="space-y-1 mb-2">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-sm font-semibold text-gray-700">{t('Quantity')}:</span>
                                                                                    <span className="text-lg font-bold text-blue-600">
                                                                                        {item.quantity} {item.is_wholesale ? item.wholesale_unit_name : item.retail_unit_name}
                                                                                    </span>
                                                                                    {item.is_wholesale && item.unit_amount > 1 && (
                                                                                        <span className="text-sm text-gray-500">
                                                                                            ({item.quantity * item.unit_amount} {item.retail_unit_name})
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-sm font-semibold text-gray-700">{t('Unit Price')}:</span>
                                                                                    <span className="text-lg font-bold text-green-600">{formatMoney(item.price)}</span>
                                                                                    <span className="text-sm text-gray-500">
                                                                                        per {item.is_wholesale ? item.wholesale_unit_name : item.retail_unit_name}
                                                                                    </span>
                                                                                </div>

                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-sm font-semibold text-gray-700">{t('Remaining Stock')}:</span>
                                                                                    <span className={`text-sm font-bold ${item.max_stock > 10 ? 'text-green-600' : item.max_stock > 5 ? 'text-orange-600' : 'text-red-600'}`}>
                                                                                        {item.max_stock} {item.retail_unit_name || 'units'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Mode Badge */}
                                                                            <div className="flex items-center space-x-2">
                                                                                {item.is_wholesale ? (
                                                                                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-bold shadow-md">
                                                                                        <ShoppingBag className="h-3 w-3 mr-1" />
                                                                                        {t('Wholesale')}
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs rounded-full font-bold shadow-md">
                                                                                        <Package className="h-3 w-3 mr-1" />
                                                                                        {t('Retail')}
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            {/* Price Comparison */}
                                                                            {item.wholesale_price > 0 && item.retail_price !== item.wholesale_price && (
                                                                                <div className="mt-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                                                                    <div className="flex justify-between text-xs">
                                                                                        <span className="text-emerald-600 font-medium">
                                                                                            {t('Retail')}: {formatMoney(item.retail_price)}/{item.retail_unit_name}
                                                                                        </span>
                                                                                        <span className="text-blue-600 font-medium">
                                                                                            {t('Wholesale')}: {formatMoney(item.wholesale_price)}/{item.wholesale_unit_name}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col space-y-4 ml-4">
                                                                        {/* Quantity Controls */}
                                                                        <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3">
                                                                            <button
                                                                                onClick={() => updateQuantity(index, -1)}
                                                                                className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                            >
                                                                                <Minus className="h-5 w-5" />
                                                                            </button>
                                                                            <div className="flex flex-col items-center">
                                                                                <span className="text-2xl font-bold text-gray-800">{item.quantity}</span>
                                                                                <span className="text-xs text-gray-500">{item.is_wholesale ? item.wholesale_unit_name : item.retail_unit_name}</span>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => updateQuantity(index, 1)}
                                                                                className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                            >
                                                                                <Plus className="h-5 w-5" />
                                                                            </button>
                                                                        </div>

                                                                        {/* Total and Actions */}
                                                                        <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3">
                                                                            <p className="text-sm text-gray-600 mb-1">{t('Total')}</p>
                                                                            <p className="text-2xl font-bold text-purple-600">{formatMoney(item.total)}</p>
                                                                            
                                                                            <div className="flex flex-col gap-2 mt-3">
                                                                                {item.wholesale_price > 0 && (
                                                                                    <button
                                                                                        onClick={() => toggleItemWholesale(index)}
                                                                                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                                                                                            item.is_wholesale
                                                                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                                                                                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                                                                                        }`}
                                                                                    >
                                                                                        {item.is_wholesale ? t('Switch to Retail') : t('Switch to Wholesale')}
                                                                                    </button>
                                                                                )}
                                                                                {item.batches && item.batches.length > 1 && (
                                                                                    <button
                                                                                        onClick={() => changeItemBatch(index)}
                                                                                        className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                                                                    >
                                                                                        {t('Change Batch')}
                                                                                    </button>
                                                                                )}
                                                                                <button
                                                                                    onClick={() => removeItem(index)}
                                                                                    className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                                                                >
                                                                                    <X className="h-4 w-4 mr-1 inline" />
                                                                                    {t('Remove')}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - Payment */}
                                        <div className="space-y-6">
                                            {/* Order Summary */}
                                            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6">
                                                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                                                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mr-3">
                                                        <DollarSign className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t('Order Summary')}
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                                        <span className="text-gray-700 font-medium">{t('Subtotal')}</span>
                                                        <span className="text-lg font-bold text-gray-800">{formatMoney(subtotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                                                        <span className="font-semibold">{t('Total')}</span>
                                                        <span className="font-bold text-2xl">{formatMoney(total)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment */}
                                            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl border border-emerald-100 p-6">
                                                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                                                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-3">
                                                        <CreditCard className="h-6 w-6 text-white" />
                                                    </div>
                                                    {t('Payment')}
                                                </h3>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-3">
                                                            {t('Payment Method')}
                                                        </label>
                                                        <select
                                                            value={paymentMethod}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200"
                                                        >
                                                            {paymentMethods.map((method) => (
                                                                <option key={method.id} value={method.id}>
                                                                    {method.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-3">
                                                            {t('Amount Paid')}
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                ref={amountPaidRef}
                                                                type="number"
                                                                value={amountPaid}
                                                                onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                                                                className="w-full px-6 py-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/80 backdrop-blur-sm text-xl font-bold placeholder-gray-500 transition-all duration-200"
                                                                placeholder="0.00"
                                                            />
                                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                                <DollarSign className="h-6 w-6 text-emerald-500" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {changeDue > 0 && (
                                                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4 shadow-lg">
                                                            <div className="flex items-center">
                                                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg mr-3">
                                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-emerald-800 font-bold text-lg">
                                                                        {t('Change Due')}: {formatMoney(changeDue)}
                                                                    </p>
                                                                    <p className="text-emerald-600 text-sm">Payment exceeds total</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {amountPaid < total && (
                                                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 shadow-lg">
                                                            <div className="flex items-center">
                                                                <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg mr-3">
                                                                    <Clock className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-orange-800 font-bold text-lg">
                                                                        {t('Remaining')}: {formatMoney(total - amountPaid)}
                                                                    </p>
                                                                    <p className="text-orange-600 text-sm">Select account or add payment</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Complete Order */}
                                            <button
                                                onClick={completeOrder}
                                                disabled={isLoading || orderItems.length === 0}
                                                className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-xl"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                                                        {t('Processing...')}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        <div className="p-1 bg-white/20 rounded-lg mr-3">
                                                            <CheckCircle className="h-6 w-6" />
                                                        </div>
                                                        {t('Complete Order')}
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center max-w-lg mx-auto">
                                    <div className="relative mb-8">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-full blur-3xl opacity-30 animate-pulse scale-150"></div>
                                        <div className="relative bg-gradient-to-br from-white to-purple-50 p-8 rounded-3xl shadow-2xl border border-purple-100">
                                            <ShoppingCart className="h-20 w-20 text-purple-600 mx-auto mb-4" />
                                            <div className="flex justify-center space-x-2 mb-4">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-4">{t('Ready to Start')}</h2>
                                    <p className="text-xl text-purple-100 mb-8 font-medium">{t('Click "Start New Sale" to begin')}</p>
                                    <button
                                        onClick={startNewOrder}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                                    >
                                        <div className="p-1 bg-white/20 rounded-lg mr-3">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        {t('Start New Sale')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Batch Selection Modal */}
            {showBatchModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-3xl shadow-2xl border-2 border-purple-200 max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-purple-200 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl">
                                        <Package className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {batchSelectionMode === 'new' ? t('Select Batch for') : t('Change Batch for')}
                                        </h3>
                                        <p className="text-xl font-semibold text-purple-600 mt-1">
                                            {selectedProduct.name}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {batchSelectionMode === 'new' ? t('Choose a batch to add to your order') : t('Choose a new batch for this item')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowBatchModal(false);
                                        setSelectedProduct(null);
                                        setSelectedBatch(null);
                                    }}
                                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                                >
                                    <X className="h-8 w-8" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* No Batch Option */}
                                <button
                                    onClick={() => selectBatch(null)}
                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="h-5 w-5 text-gray-500" />
                                        <span className="font-medium">{t('No Batch')}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{t('Use default retail pricing')}</p>
                                </button>

                                                                 {/* Batch Options */}
                                 {selectedProduct.batches && selectedProduct.batches
                                     .sort((a, b) => {
                                         const statusOrder = { 'valid': 1, 'expiring_soon': 2, 'expired': 3, 'no_expiry': 0 };
                                         return (statusOrder[a.expiry_status] || 4) - (statusOrder[b.expiry_status] || 4);
                                     })
                                     .map((batch, index) => (
                                         <button
                                             key={batch.id || index}
                                             onClick={() => selectBatch(batch)}
                                             className={`p-4 border-2 rounded-lg text-left transition-all ${
                                                 batch.expiry_status === 'expired'
                                                     ? 'bg-red-50 border-red-200 hover:border-red-300'
                                                     : batch.expiry_status === 'expiring_soon'
                                                         ? 'bg-orange-50 border-orange-200 hover:border-orange-300'
                                                         : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'
                                             }`}
                                         >
                                             <div className="flex items-center justify-between mb-2">
                                                 <div className="flex items-center gap-2">
                                                     <Hash className="h-5 w-5 text-purple-500" />
                                                     <span className="font-medium text-gray-700">{batch.reference_number}</span>
                                                 </div>
                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                     batch.expiry_status === 'expired' 
                                                         ? 'bg-red-100 text-red-700' 
                                                         : batch.expiry_status === 'expiring_soon' 
                                                             ? 'bg-orange-100 text-orange-700' 
                                                             : batch.expiry_status === 'valid' 
                                                                 ? 'bg-green-100 text-green-700' 
                                                                 : 'bg-gray-100 text-gray-700'
                                                 }`}>
                                                     {batch.expiry_status === 'expired' ? t('Expired') :
                                                      batch.expiry_status === 'expiring_soon' ? t('Expiring Soon') :
                                                      batch.expiry_status === 'valid' ? t('Valid') :
                                                      t('No Expiry')}
                                                 </span>
                                             </div>
                                             
                                             <div className="space-y-1 text-xs">
                                                 <div className="flex justify-between">
                                                     <span className="text-gray-500">{t('Stock')}:</span>
                                                     <span className="font-medium">{batch.stock} {batch.retail_unit_name || 'units'}</span>
                                                 </div>
                                                 <div className="flex justify-between">
                                                     <span className="text-gray-500">{t('Retail Price')}:</span>
                                                     <span className="font-medium text-green-600">{formatMoney(batch.retail_price)} / {batch.retail_unit_name || 'unit'}</span>
                                                 </div>
                                                 {batch.wholesale_price > 0 && (
                                                     <div className="flex justify-between">
                                                         <span className="text-gray-500">{t('Wholesale Price')}:</span>
                                                         <span className="font-medium text-blue-600">{formatMoney(batch.wholesale_price)} / {batch.wholesale_unit_name || 'unit'}</span>
                                                     </div>
                                                 )}
                                                 {batch.expire_date && (
                                                     <div className="flex justify-between">
                                                         <span className="text-gray-500">{t('Expires')}:</span>
                                                         <span className={`font-medium ${
                                                             batch.expiry_status === 'expired' ? 'text-red-600' :
                                                             batch.expiry_status === 'expiring_soon' ? 'text-orange-600' :
                                                             'text-green-600'
                                                         }`}>
                                                             {new Date(batch.expire_date).toLocaleDateString()}
                                                         </span>
                                                     </div>
                                                 )}
                                                 {batch.days_to_expiry !== null && (
                                                     <div className="flex justify-between">
                                                         <span className="text-gray-500">{t('Days to expiry')}:</span>
                                                         <span className={`font-medium ${
                                                             batch.days_to_expiry < 0 ? 'text-red-600' :
                                                             batch.days_to_expiry <= 30 ? 'text-orange-600' :
                                                             'text-green-600'
                                                         }`}>
                                                             {batch.days_to_expiry > 0 ? '+' : ''}{batch.days_to_expiry} {t('days')}
                                                         </span>
                                                     </div>
                                                 )}
                                             </div>
                                         </button>
                                     )                                             )}
                             </div>
                         </div>
                     </div>
                 </div>
             )}

            {/* Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 p-6 rounded-2xl shadow-2xl z-50 border-2 backdrop-blur-sm transform animate-in slide-in-from-right duration-300 ${
                    notification.type === 'success' 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400'
                }`}>
                    <div className="flex items-center">
                        <div className="p-2 bg-white/20 rounded-xl mr-4">
                            {notification.type === 'success' ? (
                                <CheckCircle className="h-6 w-6" />
                            ) : (
                                <AlertTriangle className="h-6 w-6" />
                            )}
                        </div>
                        <span className="font-semibold text-lg">{notification.message}</span>
                    </div>
                </div>
            )}
        </>
    );
}                                                   