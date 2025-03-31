import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import CustomerNavbar from '@/Components/CustomerNavbar';
import { 
    ShoppingCart, 
    Package, 
    FileText, 
    Plus,
    Search,
    Minus,
    CheckCircle,
    X,
    CreditCard,
    DollarSign,
    Barcode,
    Coffee,
    ShoppingBag,
    Apple,
    Pizza,
    Utensils,
    Shirt,
    Smartphone,
    Headphones,
    Laptop,
    BookOpen,
    Scissors,
    Gift,
    Baby,
    Heart,
    Pill
} from 'lucide-react';
import axios from 'axios';

// Configure axios for Laravel
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Attempt to get CSRF token from Laravel's XSRF-TOKEN cookie
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
};

// Get CSRF token either from cookie or meta tag
const xsrfToken = getCookie('XSRF-TOKEN');
if (xsrfToken) {
    axios.defaults.headers.common['X-XSRF-TOKEN'] = xsrfToken;
}

// Add response interceptor for debugging
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default function MarketOrderCreate({ auth, products, paymentMethods, tax_percentage, defaultCurrency }) {
    const { t } = useLaravelReactI18n();
    
    // State management
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [changeDue, setChangeDue] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [notes, setNotes] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [accountSearchQuery, setAccountSearchQuery] = useState('');
    const [accountSearchResults, setAccountSearchResults] = useState([]);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [accountHighlightIndex, setAccountHighlightIndex] = useState(0);
    const [orderSectionVisible, setOrderSectionVisible] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [accountSearchLoading, setAccountSearchLoading] = useState(false);
    
    // Refs
    const searchInputRef = useRef(null);
    const accountSearchInputRef = useRef(null);
    
    // Add CSS keyframes for animations
    const animationStyles = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes floatIn {
            0% {
                opacity: 0;
                transform: translateY(10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse-slow {
            0%, 100% {
                opacity: 0.8;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.05);
            }
        }
        
        .animation-delay-1000 {
            animation-delay: 1s;
        }
        
        .animate-pulse-slow {
            animation: pulse-slow 4s infinite;
        }
        
        .animate-button {
            transition: all 0.3s;
        }
        .animate-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
    `;

    // On component mount
    useEffect(() => {
        // Initialize any required data
    }, []);
    
    // Calculate totals whenever order items change
    useEffect(() => {
        calculateTotal();
    }, [orderItems]);
    
    // Calculate total, tax, etc.
    const calculateTotal = () => {
        const newSubtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        setSubtotal(newSubtotal);
        setTotal(newSubtotal); // Can add tax calculation here if needed
        updateChangeDue();
    };
    
    // Start a new order
    const startNewOrder = async () => {
        // If order section is visible but we have no items and no current order ID,
        // then we've just completed an order and want to start a new one
        const isPostCompletionState = orderSectionVisible && orderItems.length === 0 && !currentOrderId;
        
        setIsLoading(true);
        try {
            const response = await axios.post('/customer/market-order/start');
            
            if (response.data.success) {
                const orderId = response.data.order_id;
                
                if (!orderId) {
                    showError(t('Error: No order ID returned from server'));
                    return;
                }
                
                setCurrentOrderId(orderId);
                setOrderSectionVisible(true);
                showSuccess(t('Order started successfully'));
                
                // Focus search input after order is started
                setTimeout(() => {
                    if (searchInputRef.current) {
                        searchInputRef.current.focus();
                    }
                }, 100);
            } else {
                showError(response.data.message || t('Error starting order'));
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Validation errors
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.entries(validationErrors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                    
                showError(t('Validation error') + ':\n' + errorMessages);
            } else {
                showError(t('Error starting order') + ': ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // Process barcode scan
    const processBarcode = async (barcode) => {
        if (!barcode) return;
        
        setIsLoading(true);
        try {
            const response = await axios.post('/customer/market-order/process-barcode', 
                { barcode }
            );
            
            if (response.data.success && response.data.product) {
                // Ensure product has a consistent structure
                const product = {
                    ...response.data.product,
                    id: response.data.product.product_id || response.data.product.id,
                    product_id: response.data.product.product_id || response.data.product.id
                };
                
                addProductToOrder(product);
                showSuccess(t('Product added') + ': ' + product.name);
            } else {
                showError(t('Product not found or out of stock'));
            }
        } catch (error) {
            console.error('Barcode process error:', error);
            showError(t('Error processing barcode') + ': ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
            // Reset search input
            if (searchInputRef.current) {
                searchInputRef.current.value = '';
                searchInputRef.current.focus();
            }
        }
    };
    
    // Handle barcode input
    const handleBarcodeInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const barcode = e.target.value.trim();
            if (barcode) {
                processBarcode(barcode);
            }
        }
    };
    
    // Add product to order
    const addProductToOrder = (product) => {
        // Make sure product has a valid id
        if (!product.id && !product.product_id) {
            showError(t('Cannot add product: Missing product ID'));
            return;
        }

        // Use product_id if available, otherwise use id
        const productId = product.product_id || product.id;
        
        const existingItemIndex = orderItems.findIndex(item => item.product_id === productId);
        
        if (existingItemIndex !== -1) {
            // Check if there's enough stock
            if (orderItems[existingItemIndex].quantity >= product.stock) {
                showError(t('No more stock available for this product'));
                return;
            }
            
            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].quantity += 1;
            updatedItems[existingItemIndex].total = 
                updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
            setOrderItems(updatedItems);
        } else {
            setOrderItems([
                ...orderItems,
                {
                    product_id: productId,
                    name: product.name,
                    price: parseFloat(product.price || product.retail_price),
                    quantity: 1,
                    total: parseFloat(product.price || product.retail_price),
                    max_stock: product.stock
                }
            ]);
        }
    };
    
    // Update quantity of an item
    const updateQuantity = (index, change) => {
        if (!orderItems[index]) return;
        
        const newQuantity = orderItems[index].quantity + change;
        
        if (newQuantity > orderItems[index].max_stock) {
            showError(t('No more stock available for this product'));
            return;
        }
        
        if (newQuantity > 0) {
            const updatedItems = [...orderItems];
            updatedItems[index].quantity = newQuantity;
            updatedItems[index].total = newQuantity * updatedItems[index].price;
            setOrderItems(updatedItems);
        } else {
            removeItem(index);
        }
    };
    
    // Remove item from order
    const removeItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };
    
    // Update change due based on amount paid
    const updateChangeDue = () => {
        const newChangeDue = Math.max(0, amountPaid - total);
        setChangeDue(newChangeDue);
    };
    
    // Format money with currency symbol
    const formatMoney = (amount) => {
        return defaultCurrency.symbol + parseFloat(amount).toFixed(2);
    };
    
    // Show success notification
    const showSuccess = (message) => {
        setNotification({
            type: 'success',
            message
        });
        
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };
    
    // Show error notification
    const showError = (message) => {
        setNotification({
            type: 'error',
            message
        });
        
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };
    
    // Complete the order
    const completeOrder = async () => {
        if (orderItems.length === 0) {
            showError(t('Please add items to the order before completing'));
            return;
        }
        
        if (amountPaid < total && !selectedAccount) {
            showError(t('Please enter full payment or select an account for the remaining balance'));
            return;
        }

        // Check if we have a valid order_id before submitting
        if (!currentOrderId) {
            showError(t('Invalid order ID. Please start a new order.'));
            return;
        }

        // Validate each item to ensure it has a valid product_id
        const invalidItems = orderItems.filter(item => !item.product_id);
        if (invalidItems.length > 0) {
            showError(t('Some items have invalid product IDs. Please remove them and try again.'));
            return;
        }
        
        const orderData = {
            order_id: currentOrderId,
            items: orderItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                total: item.total
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
            const response = await axios.post(
                '/customer/market-order/complete', 
                orderData
            );
            
            if (response.data.success) {
                showSuccess(response.data.message || t('Order completed successfully'));
                // Reset order data but keep the order section visible
                resetOrder(false);
                // Focus on new order button after completion
                setTimeout(() => {
                    const newOrderButton = document.querySelector('[data-new-order-button]');
                    if (newOrderButton) {
                        newOrderButton.focus();
                    }
                }, 100);
            } else {
                showError(response.data.message || t('Error completing order'));
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Validation errors
                const validationErrors = error.response.data.errors;
                
                // Create a readable error message from all validation errors
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
    
    // Reset order state
    const resetOrder = (hideOrderSection = true) => {
        setCurrentOrderId(null);
        setOrderItems([]);
        setSubtotal(0);
        setTotal(0);
        setAmountPaid(0);
        setChangeDue(0);
        setPaymentMethod('cash');
        setNotes('');
        setSearchQuery('');
        setSearchResults([]);
        setShowDropdown(false);
        setHighlightIndex(0);
        setAccountSearchQuery('');
        setAccountSearchResults([]);
        setShowAccountDropdown(false);
        setSelectedAccount(null);
        setAccountHighlightIndex(0);
        
        // Only hide the order section if explicitly requested
        if (hideOrderSection) {
            setOrderSectionVisible(false);
        }
    };
    
    // Function to get icon based on product name or category
    const getProductIcon = (product) => {
        const name = product.name.toLowerCase();
        
        // Detect product type based on name
        if (name.includes('coffee') || name.includes('tea') || name.includes('café')) {
            return <Coffee className="h-4 w-4 text-green-600" />;
        } else if (name.includes('phone') || name.includes('mobile') || name.includes('smart')) {
            return <Smartphone className="h-4 w-4 text-green-600" />;
        } else if (name.includes('laptop') || name.includes('computer') || name.includes('pc')) {
            return <Laptop className="h-4 w-4 text-green-600" />;
        } else if (name.includes('headphone') || name.includes('earphone') || name.includes('audio')) {
            return <Headphones className="h-4 w-4 text-green-600" />;
        } else if (name.includes('book') || name.includes('novel') || name.includes('magazine')) {
            return <BookOpen className="h-4 w-4 text-green-600" />;
        } else if (name.includes('food') || name.includes('pizza') || name.includes('burger')) {
            return <Pizza className="h-4 w-4 text-green-600" />;
        } else if (name.includes('fruit') || name.includes('apple') || name.includes('vegetable')) {
            return <Apple className="h-4 w-4 text-green-600" />;
        } else if (name.includes('shirt') || name.includes('cloth') || name.includes('dress')) {
            return <Shirt className="h-4 w-4 text-green-600" />;
        } else if (name.includes('med') || name.includes('pill') || name.includes('drug')) {
            return <Pill className="h-4 w-4 text-green-600" />;
        } else if (name.includes('baby') || name.includes('toy') || name.includes('child')) {
            return <Baby className="h-4 w-4 text-green-600" />;
        } else if (name.includes('beauty') || name.includes('cosmetic') || name.includes('makeup')) {
            return <Heart className="h-4 w-4 text-green-600" />;
        } else if (name.includes('gift') || name.includes('present')) {
            return <Gift className="h-4 w-4 text-green-600" />;
        } else if (name.includes('scissor') || name.includes('tool')) {
            return <Scissors className="h-4 w-4 text-green-600" />;
        } else if (name.includes('meal') || name.includes('dish') || name.includes('food')) {
            return <Utensils className="h-4 w-4 text-green-600" />;
        } else {
            // Default icon
            return <Package className="h-4 w-4 text-green-600" />;
        }
    };
    
    // Handle account search
    const handleAccountSearch = async (query) => {
        if (query.length < 2) {
            setAccountSearchResults([]);
            setShowAccountDropdown(false);
            return;
        }

        setAccountSearchLoading(true);
        try {
            // Change from POST to GET request with query parameter
            const response = await axios.get(`/customer/market-order/search-accounts?query=${encodeURIComponent(query)}`);
            
            setAccountSearchResults(response.data);
            setShowAccountDropdown(true);
            setAccountHighlightIndex(0);
        } catch (error) {
            console.error('Error searching accounts:', error);
            showError(t('Error searching accounts'));
        } finally {
            setAccountSearchLoading(false);
        }
    };

    // Handle account selection
    const selectAccount = (account) => {
        setSelectedAccount(account);
        setAccountSearchQuery(account.name);
        setShowAccountDropdown(false);
    };

    // Handle account search input change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (accountSearchQuery.length >= 2) {
                handleAccountSearch(accountSearchQuery);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [accountSearchQuery]);

    // Handle keyboard navigation for account dropdown
    const handleAccountKeyDown = (e) => {
        if (!showAccountDropdown || accountSearchResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setAccountHighlightIndex(prev => 
                prev < accountSearchResults.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setAccountHighlightIndex(prev => prev > 0 ? prev - 1 : 0);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedAccount = accountSearchResults[accountHighlightIndex];
            if (selectedAccount) {
                selectAccount(selectedAccount);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setShowAccountDropdown(false);
        }
    };

    // Close account dropdown when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (accountSearchInputRef.current && !accountSearchInputRef.current.contains(e.target)) {
                setShowAccountDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <>
            <Head title={t('Point of Sale')} />
            <CustomerNavbar />
            
            {/* Add the CSS animation styles */}
            <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
            
            <div className="container" dir="rtl">
                {/* Single root element wrapper */}
                <div className="relative">
                    {/* Three.js background container */}
                    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-100 via-white to-gray-100"></div>
                    
                    <div className="relative min-h-screen p-4">
                        {/* Main container with enhanced styling */}
                        <div className="relative bg-white/80 backdrop-blur-3xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40 transition-all duration-500 hover:shadow-green-500/30 overflow-hidden">
                            {/* Decorative elements */}
                            <div
                                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/20 rounded-full blur-3xl translate-x-20 -translate-y-20 animate-pulse-slow">
                            </div>
                            <div
                                className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-full blur-3xl -translate-x-20 translate-y-20 animate-pulse-slow animation-delay-1000">
                            </div>
                            
                            {/* Content */}
                            <div className="relative">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/20 animate-button">
                                                <ShoppingCart className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {t('Point of Sale')}
                                                </h2>
                                                <p className="text-sm text-gray-500">{t('Manage sales transactions efficiently')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={startNewOrder}
                                        disabled={isLoading || orderSectionVisible}
                                        data-new-order-button
                                        className={`w-full md:w-auto animate-button px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/20 ${
                                            (isLoading || orderSectionVisible) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <Plus className="h-5 w-5" />
                                        )}
                                        {t('Start New Sale')}
                                    </button>
                                </div>
                                
                                {/* Order section - Only visible after starting an order */}
                                {orderSectionVisible && (
                                    <div>
                                        {/* POS-style layout: Two-column grid for large screens */}
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                            {/* Left column - Products and Barcode Scanner */}
                                            <div className="lg:col-span-8">
                                                {/* Product Search and Barcode Scanner */}
                                                <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                            <Barcode className="h-6 w-6 mr-2 text-green-600" />
                                                            {t('Barcode Scanner')}
                                                        </h3>
                                                        <button 
                                                            onClick={startNewOrder}
                                                            data-new-order-button
                                                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-transparent rounded-lg text-sm font-medium text-green-700 hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 focus:outline-none transition-colors shadow-sm hover:shadow"
                                                        >
                                                            <Plus className="h-4 w-4 mr-1" />
                                                            {t('New Sale')}
                                                        </button>
                                                    </div>

                                                    <div className="relative mb-2 group" id="searchInputContainer">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Search className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                                                        </div>
                                                        <input 
                                                            ref={searchInputRef}
                                                            type="text" 
                                                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 rounded-xl group-hover:border-green-300 transition-colors duration-300" 
                                                            placeholder={t('Enter barcode and press Enter to add product')}
                                                            onKeyDown={handleBarcodeInput}
                                                        />
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                            {isLoading && (
                                                                <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            )}
                                                            <Barcode className="h-5 w-5 text-gray-400 ml-2 group-hover:text-green-500 transition-colors duration-300" />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-4">{t('Scan a barcode or type a product name and press Enter')}</p>
                                                </div>

                                                {/* Order Items Section */}
                                                <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                            <ShoppingCart className="h-6 w-6 mr-2 text-green-600" />
                                                            {t('Order Items')}
                                                        </h3>
                                                        
                                                        <div className="flex space-x-2">
                                                            
                                                            <button 
                                                                onClick={() => {
                                                                    if (orderItems.length > 0 && confirm(t('Are you sure you want to clear the current order?'))) {
                                                                        setOrderItems([]);
                                                                    }
                                                                }}
                                                                className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-transparent rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none transition-colors shadow-sm hover:shadow"
                                                            >
                                                                <X className="h-4 w-4 mr-1" />
                                                                {t('Clear Order')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Quick Stats Cards */}
                                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 shadow-sm border border-green-100">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-green-700 text-sm font-medium">{t('Items')}</p>
                                                                    <h4 className="text-2xl font-bold text-green-800">{orderItems.length}</h4>
                                                                </div>
                                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                                    <Package className="h-6 w-6 text-green-500" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-blue-100">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-blue-700 text-sm font-medium">{t('Quantity')}</p>
                                                                    <h4 className="text-2xl font-bold text-blue-800">
                                                                        {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                                                                    </h4>
                                                                </div>
                                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                                    <Package className="h-6 w-6 text-blue-500" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm border border-purple-100">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-purple-700 text-sm font-medium">{t('Total')}</p>
                                                                    <h4 className="text-2xl font-bold text-purple-800">{formatMoney(total)}</h4>
                                                                </div>
                                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                                    <DollarSign className="h-6 w-6 text-purple-500" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Order Items List - Larger View */}
                                                    <div className="bg-gray-50 rounded-xl p-4 max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin">
                                                        <div className="space-y-3">
                                                            {orderItems.length === 0 ? (
                                                                <div className="text-center py-10">
                                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                                                                    </div>
                                                                    <h3 className="text-lg font-medium text-gray-500 mb-1">{t('Your cart is empty')}</h3>
                                                                    <p className="text-gray-400 text-sm">{t('Scan products with the barcode scanner to add them')}</p>
                                                                </div>
                                                            ) : (
                                                                orderItems.map((item, index) => (
                                                                    <div 
                                                                        key={`${item.product_id}-${index}`}
                                                                        className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:shadow-green-500/10 transform hover:scale-[1.01] transition-all duration-300 border border-white/80 backdrop-blur-sm relative overflow-hidden group mb-2"
                                                                        style={{
                                                                            animation: `fadeIn 0.5s ${index * 0.1}s both`,
                                                                            opacity: 0
                                                                        }}
                                                                    >
                                                                        {/* Decorative gradient background */}
                                                                        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                                        
                                                                        {/* Streamlined layout - horizontal flex */}
                                                                        <div className="flex items-center gap-2 relative">
                                                                            {/* Item number badge */}
                                                                            <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-sm transition-all duration-300 group-hover:from-green-100 group-hover:to-emerald-100">
                                                                                <span className="text-gray-700 font-bold text-xs group-hover:text-green-700 transition-all duration-300">#{index + 1}</span>
                                                                            </div>
                                                                            
                                                                            {/* Product icon instead of avatar */}
                                                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:from-green-200 group-hover:to-emerald-300">
                                                                                {getProductIcon(item)}
                                                                            </div>
                                                                            
                                                                            {/* Product info - flexible width */}
                                                                            <div className="flex-1 min-w-0">
                                                                                <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-green-800 transition-all duration-300">{item.name}</h4>
                                                                                <div className="flex items-center text-xs gap-1">
                                                                                    <span className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-medium">{formatMoney(item.price)}</span>
                                                                                    <span className="text-gray-400">×</span>
                                                                                    <span className="font-medium text-gray-600">{item.quantity}</span>
                                                                                    <span className="text-gray-400">=</span>
                                                                                    <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{formatMoney(item.price * item.quantity)}</span>
                                                                                </div>
                                                                                
                                                                                {/* Stock indicator */}
                                                                                <div className="flex items-center mt-1">
                                                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                                                                                        <div 
                                                                                            className={`h-1.5 rounded-full ${
                                                                                                (item.max_stock - item.quantity) / item.max_stock > 0.6 
                                                                                                ? 'bg-green-500' 
                                                                                                : (item.max_stock - item.quantity) / item.max_stock > 0.3 
                                                                                                ? 'bg-yellow-500' 
                                                                                                : 'bg-red-500'
                                                                                            }`}
                                                                                            style={{ width: `${Math.min(100, ((item.max_stock - item.quantity) / item.max_stock) * 100)}%` }}
                                                                                        ></div>
                                                                                    </div>
                                                                                    <span className={`text-xs font-medium ${
                                                                                        (item.max_stock - item.quantity) / item.max_stock > 0.6 
                                                                                        ? 'text-green-600' 
                                                                                        : (item.max_stock - item.quantity) / item.max_stock > 0.3 
                                                                                        ? 'text-yellow-600' 
                                                                                        : 'text-red-600'
                                                                                    }`}>
                                                                                        {item.max_stock - item.quantity} {t('left')}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {/* Quantity controls */}
                                                                            <div className="flex items-center rounded-lg overflow-hidden border border-gray-200/90 shadow-sm group-hover:shadow-md group-hover:border-green-200/90 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                                                                <button 
                                                                                    onClick={() => updateQuantity(index, -1)}
                                                                                    className="p-1.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 active:bg-red-200 transition-all duration-300"
                                                                                >
                                                                                    <Minus className="h-3.5 w-3.5" />
                                                                                </button>
                                                                                <span className="w-8 text-center font-medium py-1.5 px-1 bg-white text-sm">{item.quantity}</span>
                                                                                <button 
                                                                                    onClick={() => updateQuantity(index, 1)}
                                                                                    disabled={item.quantity >= item.max_stock}
                                                                                    className={`p-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 transition-all duration-300 ${
                                                                                        item.quantity >= item.max_stock 
                                                                                        ? 'opacity-50 cursor-not-allowed' 
                                                                                        : 'hover:from-green-50 hover:to-green-100 hover:text-green-600 active:bg-green-200'
                                                                                    }`}
                                                                                >
                                                                                    <Plus className="h-3.5 w-3.5" />
                                                                                </button>
                                                                            </div>
                                                                            
                                                                            {/* Remove button */}
                                                                            <button 
                                                                                onClick={() => removeItem(index)}
                                                                                className="flex items-center justify-center p-1.5 text-red-500 bg-red-50/80 hover:bg-red-100/90 rounded-lg transition-all duration-300 hover:shadow-sm hover:shadow-red-100/50 hover:scale-105 backdrop-blur-sm"
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Right column - Payment and Checkout */}
                                            <div className="lg:col-span-4">
                                                <div id="paymentSection" className="bg-white rounded-2xl shadow-xl p-5 mb-6 sticky top-24">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                            <CreditCard className="h-6 w-6 mr-2 text-green-600" />
                                                            {t('Payment & Checkout')}
                                                        </h3>
                                                        <span className="text-green-600 text-lg font-bold">{formatMoney(total)}</span>
                                                    </div>

                                                    {/* Order Summary Section */}
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('Order Summary')}</h4>
                                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-600 text-sm">{t('Subtotal')}</span>
                                                                <span className="font-medium">{formatMoney(subtotal)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-600 text-sm">{t('Tax')} ({tax_percentage}%)</span>
                                                                <span className="font-medium">{formatMoney(0)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-600 text-sm">{t('Shipping')}</span>
                                                                <span className="font-medium">{formatMoney(0)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                                                <span className="text-gray-800 font-medium">{t('Total')}</span>
                                                                <span className="text-green-600 font-bold">{formatMoney(total)}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mb-4 mt-4">
                                                            <h4 className="font-medium text-gray-700 mb-2">{t('Payment Method')}</h4>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {paymentMethods.map((method, index) => (
                                                                    <label 
                                                                        key={method.id}
                                                                        className={`flex items-center bg-gradient-to-r from-white to-gray-50 p-2 rounded-lg shadow-sm border transition-all cursor-pointer ${
                                                                            paymentMethod === method.id 
                                                                                ? 'border-green-200' 
                                                                                : 'border-gray-200 hover:border-green-200'
                                                                        }`}
                                                                    >
                                                                        <input 
                                                                            type="radio" 
                                                                            name="payment_method" 
                                                                            value={method.id} 
                                                                            checked={paymentMethod === method.id}
                                                                            onChange={() => setPaymentMethod(method.id)}
                                                                            className="text-green-600 focus:ring-green-500 h-4 w-4" 
                                                                        />
                                                                        <div className="ml-2">
                                                                            <div className="flex items-center">
                                                                                {method.id === 'cash' && <DollarSign className="h-4 w-4 text-green-500 mr-1" />}
                                                                                {method.id === 'card' && <CreditCard className="h-4 w-4 text-green-500 mr-1" />}
                                                                                {method.id === 'bank_transfer' && <FileText className="h-4 w-4 text-green-500 mr-1" />}
                                                                                <span className="font-medium text-sm text-gray-800">{t(method.name)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mb-4">
                                                            <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-1">{t('Amount Received')}</label>
                                                            <div className="relative rounded-md shadow-sm">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <span className="text-gray-500 sm:text-sm">{defaultCurrency.symbol}</span>
                                                                </div>
                                                                <input 
                                                                    type="number" 
                                                                    name="amount_paid" 
                                                                    id="amountPaid" 
                                                                    value={amountPaid}
                                                                    onChange={(e) => {
                                                                        setAmountPaid(parseFloat(e.target.value) || 0);
                                                                        updateChangeDue();
                                                                    }}
                                                                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-lg" 
                                                                    placeholder="0.00" 
                                                                    step="0.01" 
                                                                />
                                                            </div>
                                                            {changeDue > 0 && (
                                                                <div className="mt-2 flex justify-between text-gray-600">
                                                                    <span>{t('Change')}</span>
                                                                    <span className="font-medium">{formatMoney(changeDue)}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {amountPaid < total && (
                                                                <div className="mt-4">
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('Select Account for Remaining Balance')}</label>
                                                                    <div className="relative" ref={accountSearchInputRef}>
                                                                        <input
                                                                            type="text"
                                                                            value={accountSearchQuery}
                                                                            onChange={(e) => setAccountSearchQuery(e.target.value)}
                                                                            onKeyDown={handleAccountKeyDown}
                                                                            className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                                                                            placeholder={t('Search by account name or number')}
                                                                        />
                                                                        
                                                                        {accountSearchLoading && (
                                                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                                                <svg className="animate-spin h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {showAccountDropdown && accountSearchResults.length > 0 && (
                                                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden max-h-60 overflow-y-auto">
                                                                                <ul className="py-1 divide-y divide-gray-100">
                                                                                    {accountSearchResults.map((account, index) => (
                                                                                        <li 
                                                                                            key={account.id}
                                                                                            onClick={() => selectAccount(account)}
                                                                                            className={`cursor-pointer px-4 py-2 hover:bg-green-50 transition-colors ${
                                                                                                index === accountHighlightIndex ? 'bg-green-50' : ''
                                                                                            }`}
                                                                                        >
                                                                                            <div className="flex justify-between">
                                                                                                <div>
                                                                                                    <div className="font-medium text-gray-800">{account.name}</div>
                                                                                                    <div className="text-xs text-gray-500">
                                                                                                        {t('Account')} #{account.account_number}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="text-right">
                                                                                                    <div className="font-medium text-green-600">{formatMoney(account.balance)}</div>
                                                                                                    <div className="text-xs text-gray-500">
                                                                                                        {t('Balance')}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {showAccountDropdown && accountSearchQuery.length >= 2 && accountSearchResults.length === 0 && !accountSearchLoading && (
                                                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden">
                                                                                <div className="px-4 py-3 text-sm text-gray-500">
                                                                                    {t('No accounts found matching your search')}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    {selectedAccount && (
                                                                        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
                                                                            <div className="flex justify-between items-center">
                                                                                <div>
                                                                                    <div className="font-medium text-green-800">{selectedAccount.name}</div>
                                                                                    <div className="text-sm text-green-600">
                                                                                        {t('Account')} #{selectedAccount.account_number}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <div className="font-medium text-green-800">{formatMoney(selectedAccount.balance)}</div>
                                                                                    <div className="text-sm text-green-600">
                                                                                        {t('Balance')}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="mt-2 flex justify-between items-center pt-2 border-t border-green-200">
                                                                                <div className="text-sm text-green-700">{t('Remaining Amount')}:</div>
                                                                                <div className="font-medium text-green-700">{formatMoney(total - amountPaid)}</div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <button 
                                                            onClick={completeOrder}
                                                            disabled={isLoading || orderItems.length === 0}
                                                            className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center ${
                                                                (isLoading || orderItems.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        >
                                                            {isLoading ? (
                                                                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <CheckCircle className="h-5 w-5 mr-2" />
                                                            )}
                                                            {t('Complete Order')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Success notification */}
                        {notification && (
                            <div 
                                className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl transform transition-all duration-300 flex items-center gap-2 ${
                                    notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}
                            >
                                {notification.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <X className="h-5 w-5" />
                                )}
                                <span>{notification.message}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 