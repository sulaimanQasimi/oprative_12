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
            showError(t('Error processing barcode') + ': ' + (error.response?.data?.message || error.message));
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
        
        // Use batch-specific data if available
        const unitPrice = batch ? parseFloat(batch.retail_price) : parseFloat(product.retail_price);
        const wholesalePrice = batch ? parseFloat(batch.wholesale_price) : parseFloat(product.wholesale_price || 0);
        const unitAmount = batch ? parseFloat(batch.unit_amount || 1) : 1;
        const unitName = batch ? batch.unit_name : product.unit_name;
        const stock = batch ? batch.stock : product.stock;

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
                unit_amount: unitAmount,
                is_wholesale: false,
                wholesale_price: wholesalePrice,
                retail_price: unitPrice,
                batch_id: batch ? batch.id : null,
                batch_reference: batch ? batch.reference_number : null,
                batch_expire_date: batch ? batch.expire_date : null,
                batch_expiry_status: batch ? batch.expiry_status : null,
                batch_days_to_expiry: batch ? batch.days_to_expiry : null,
                unit_type: unitName || t('Retail Unit'),
                unit_name: unitName,
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
        
        const unitPrice = batch ? parseFloat(batch.retail_price) : parseFloat(product.retail_price);
        const wholesalePrice = batch ? parseFloat(batch.wholesale_price) : parseFloat(product.wholesale_price || 0);
        const unitAmount = batch ? parseFloat(batch.unit_amount || 1) : 1;
        const unitName = batch ? batch.unit_name : product.unit_name;
        const stock = batch ? batch.stock : product.stock;

        const updatedItems = [...orderItems];
        updatedItems[itemIndex] = {
            ...item,
            price: unitPrice,
            total: item.quantity * unitPrice,
            max_stock: stock,
            unit_amount: unitAmount,
            wholesale_price: wholesalePrice,
            retail_price: unitPrice,
            batch_id: batch ? batch.id : null,
            batch_reference: batch ? batch.reference_number : null,
            batch_expire_date: batch ? batch.expire_date : null,
            batch_expiry_status: batch ? batch.expiry_status : null,
            batch_days_to_expiry: batch ? batch.days_to_expiry : null,
            unit_type: unitName || t('Retail Unit'),
            unit_name: unitName,
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
                quantity: item.quantity,
                price: item.price,
                total: item.total,
                unit_amount: item.unit_amount || 1,
                is_wholesale: item.is_wholesale || false,
                batch_id: item.batch_id || null,
                batch_reference: item.batch_reference || null,
                unit_type: item.unit_type || 'retail',
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
            } else {
                showError(t('Error completing order') + ': ' + (error.response?.data?.message || error.message));
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

            <div className="flex h-screen bg-gray-50">
                <CustomerNavbar auth={auth} currentRoute="customer.sales.market-order" />

                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{t('Point of Sale')}</h1>
                                <p className="text-sm text-gray-600">{t('Customer Portal')}</p>
                            </div>
                            <button
                                onClick={startNewOrder}
                                disabled={isLoading || orderSectionVisible}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                {t('Start New Sale')}
                            </button>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto">
                        {orderSectionVisible ? (
                            <div className="p-6">
                                <div className="max-w-7xl mx-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Left Column - Products */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Barcode Scanner */}
                                            <div className="bg-white rounded-lg shadow p-6">
                                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                    <Barcode className="h-5 w-5 mr-2" />
                                                    {t('Barcode Scanner')}
                                                </h3>
                                                <div className="relative">
                                                    <input
                                                        ref={barcodeInputRef}
                                                        type="text"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="bg-white rounded-lg shadow">
                                                <div className="p-6 border-b border-gray-200">
                                                    <h3 className="text-lg font-semibold flex items-center">
                                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                                        {t('Order Items')}
                                                    </h3>
                                                </div>
                                                <div className="p-6">
                                                    {orderItems.length === 0 ? (
                                                        <div className="text-center py-12">
                                                            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                            <p className="text-gray-500">{t('No items in order')}</p>
                                                            <p className="text-sm text-gray-400">{t('Scan products to add them')}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {orderItems.map((item, index) => (
                                                                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                            {getProductIcon(item)}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-medium">{item.name}</h4>
                                                                            <p className="text-sm text-gray-500">
                                                                                {item.batch_reference && (
                                                                                    <span className="inline-flex items-center mr-2">
                                                                                        <Hash className="h-3 w-3 mr-1" />
                                                                                        {item.batch_reference}
                                                                                    </span>
                                                                                )}
                                                                                {item.quantity} × {formatMoney(item.price)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="flex items-center space-x-2">
                                                                            <button
                                                                                onClick={() => updateQuantity(index, -1)}
                                                                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                                                                            >
                                                                                <Minus className="h-4 w-4" />
                                                                            </button>
                                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                                            <button
                                                                                onClick={() => updateQuantity(index, 1)}
                                                                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                                                                            >
                                                                                <Plus className="h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="font-medium">{formatMoney(item.total)}</p>
                                                                            {item.batches && item.batches.length > 1 && (
                                                                                <button
                                                                                    onClick={() => changeItemBatch(index)}
                                                                                    className="text-xs text-blue-600 hover:text-blue-800"
                                                                                >
                                                                                    {t('Change Batch')}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                        <button
                                                                            onClick={() => removeItem(index)}
                                                                            className="text-red-500 hover:text-red-700"
                                                                        >
                                                                            <X className="h-5 w-5" />
                                                                        </button>
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
                                            <div className="bg-white rounded-lg shadow p-6">
                                                <h3 className="text-lg font-semibold mb-4">{t('Order Summary')}</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span>{t('Subtotal')}</span>
                                                        <span>{formatMoney(subtotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>{t('Total')}</span>
                                                        <span className="font-semibold text-lg">{formatMoney(total)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment */}
                                            <div className="bg-white rounded-lg shadow p-6">
                                                <h3 className="text-lg font-semibold mb-4">{t('Payment')}</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {t('Payment Method')}
                                                        </label>
                                                        <select
                                                            value={paymentMethod}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            {paymentMethods.map((method) => (
                                                                <option key={method.id} value={method.id}>
                                                                    {method.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {t('Amount Paid')}
                                                        </label>
                                                        <input
                                                            ref={amountPaidRef}
                                                            type="number"
                                                            value={amountPaid}
                                                            onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="0.00"
                                                        />
                                                    </div>

                                                    {changeDue > 0 && (
                                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                            <p className="text-green-800 font-medium">
                                                                {t('Change Due')}: {formatMoney(changeDue)}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {amountPaid < total && (
                                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                            <p className="text-yellow-800">
                                                                {t('Remaining')}: {formatMoney(total - amountPaid)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Complete Order */}
                                            <button
                                                onClick={completeOrder}
                                                disabled={isLoading || orderItems.length === 0}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                        {t('Processing...')}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        <CheckCircle className="h-5 w-5 mr-2" />
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
                                <div className="text-center">
                                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('Ready to Start')}</h2>
                                    <p className="text-gray-600 mb-6">{t('Click "Start New Sale" to begin')}</p>
                                    <button
                                        onClick={startNewOrder}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {batchSelectionMode === 'new' ? t('Select Batch for') : t('Change Batch for')}: {selectedProduct.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {batchSelectionMode === 'new' ? t('Choose a batch to add to your order') : t('Choose a new batch for this item')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowBatchModal(false);
                                        setSelectedProduct(null);
                                        setSelectedBatch(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* No Batch Option */}
                                <button
                                    onClick={() => selectBatch(null)}
                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="h-5 w-5 text-gray-500" />
                                        <span className="font-medium">{t('No Batch')}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{t('Use default pricing')}</p>
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
                                                     <span className="font-medium">{batch.stock}</span>
                                                 </div>
                                                 <div className="flex justify-between">
                                                     <span className="text-gray-500">{t('Price')}:</span>
                                                     <span className="font-medium text-green-600">{formatMoney(batch.retail_price)}</span>
                                                 </div>
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
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                    notification.type === 'success' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                }`}>
                    <div className="flex items-center">
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 mr-2" />
                        )}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
        </>
    );
}                                                   