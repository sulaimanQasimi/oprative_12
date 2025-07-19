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
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [showBatchSelector, setShowBatchSelector] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);

    // Refs
    const searchInputRef = useRef(null);
    const accountSearchInputRef = useRef(null);
    const amountPaidRef = useRef(null);

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

    // Keyboard shortcuts for quick payment
    const handleKeyboardShortcuts = (e) => {
        // Only handle shortcuts when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Ctrl/Cmd + P: Set amount paid to total (exact payment)
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            setExactPayment();
        }

        // Ctrl/Cmd + T: Focus on amount paid input
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            focusAmountPaid();
        }

        // F1: Set common amount shortcuts
        if (e.key === 'F1') {
            e.preventDefault();
            setCommonAmounts();
        }

        // F2: Clear amount paid
        if (e.key === 'F2') {
            e.preventDefault();
            clearAmountPaid();
        }

        // F3: Add 5 to amount paid
        if (e.key === 'F3') {
            e.preventDefault();
            addToAmountPaid(5);
        }

        // F4: Add 10 to amount paid
        if (e.key === 'F4') {
            e.preventDefault();
            addToAmountPaid(10);
        }

        // F5: Add 20 to amount paid
        if (e.key === 'F5') {
            e.preventDefault();
            addToAmountPaid(20);
        }

        // F6: Add 50 to amount paid
        if (e.key === 'F6') {
            e.preventDefault();
            addToAmountPaid(50);
        }

        // F7: Add 100 to amount paid
        if (e.key === 'F7') {
            e.preventDefault();
            addToAmountPaid(100);
        }

        // Enter: Complete order (when amount is sufficient)
        if (e.key === 'Enter' && orderItems.length > 0 && (amountPaid >= total || selectedAccount)) {
            e.preventDefault();
            completeOrder();
        }

        // F12: Show/hide keyboard shortcuts help
        if (e.key === 'F12') {
            e.preventDefault();
            setShowKeyboardHelp(!showKeyboardHelp);
        }
    };

    // Set exact payment (amount paid = total)
    const setExactPayment = () => {
        if (total > 0) {
            setAmountPaid(total);
            updateChangeDue();
            showSuccess(t('Amount set to exact total: ') + formatMoney(total));
        }
    };

    // Focus on amount paid input
    const focusAmountPaid = () => {
        if (amountPaidRef.current) {
            amountPaidRef.current.focus();
            amountPaidRef.current.select();
        }
    };

    // Set common amounts quickly
    const setCommonAmounts = () => {
        // Round up to nearest 5, 10, 20, 50, or 100
        const roundedAmounts = [
            Math.ceil(total / 5) * 5,
            Math.ceil(total / 10) * 10,
            Math.ceil(total / 20) * 20,
            Math.ceil(total / 50) * 50,
            Math.ceil(total / 100) * 100
        ].filter(amount => amount > total);

        if (roundedAmounts.length > 0) {
            setAmountPaid(roundedAmounts[0]);
            updateChangeDue();
            showSuccess(t('Amount set to: ') + formatMoney(roundedAmounts[0]));
        }
    };

    // Clear amount paid
    const clearAmountPaid = () => {
        setAmountPaid(0);
        updateChangeDue();
        showSuccess(t('Amount cleared'));
    };

    // Add specific amount to current amount paid
    const addToAmountPaid = (amount) => {
        const newAmount = amountPaid + amount;
        setAmountPaid(newAmount);
        updateChangeDue();
        showSuccess(t('Added ') + formatMoney(amount) + t(' - Total: ') + formatMoney(newAmount));
    };

    // On component mount
    useEffect(() => {
        // Add keyboard event listeners
        document.addEventListener('keydown', handleKeyboardShortcuts);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyboardShortcuts);
        };
    }, [total, amountPaid, orderItems, selectedAccount]);

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

        // Check if product has multiple batches
        if (product.batches && product.batches.length > 1) {
            // Show batch selector
            setSelectedProduct(product);
            setShowBatchSelector(true);
            return;
        }

        // If single batch or no batches, add directly
        const batch = product.batches && product.batches.length === 1 ? product.batches[0] : null;
        addProductWithBatch(product, batch);
    };

    // Add product with specific batch
    const addProductWithBatch = (product, batch = null) => {
        const productId = product.product_id || product.id;
        
        // Use batch-specific pricing if available
        const unitPrice = batch ? parseFloat(batch.retail_price || product.retail_price) : parseFloat(product.price || product.retail_price);
        const wholesalePrice = batch ? parseFloat(batch.wholesale_price || product.wholesale_price) : parseFloat(product.wholesale_price || 0);
        const unitAmount = batch ? parseFloat(batch.unit_amount || 1) : 1;
        const unitName = batch ? batch.unit_name : product.unit_name;
        const stock = batch ? batch.stock : product.stock;

        const existingItemIndex = orderItems.findIndex(item => 
            item.product_id === productId && 
            item.batch_id === (batch ? batch.id : null)
        );

        if (existingItemIndex !== -1) {
            // Check if there's enough stock
            const currentTotalUnits = orderItems[existingItemIndex].quantity * orderItems[existingItemIndex].unit_amount;
            const newTotalUnits = currentTotalUnits + unitAmount;
            
            if (newTotalUnits > stock) {
                showError(t('No more stock available for this batch'));
                return;
            }

            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].quantity += 1;
            updatedItems[existingItemIndex].total =
                updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
            setOrderItems(updatedItems);
        } else {
            // Check if there's enough stock for the new item
            if (unitAmount > stock) {
                showError(t('No more stock available for this batch'));
                return;
            }

            setOrderItems([
                ...orderItems,
                {
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
                    whole_sale_unit_amount: parseFloat(product.whole_sale_unit_amount || 1),
                    batch_id: batch ? batch.id : null,
                    batch_reference: batch ? batch.reference_number : null,
                    batch_expire_date: batch ? batch.expire_date : null,
                    batch_expiry_status: batch ? batch.expiry_status : null,
                    batch_days_to_expiry: batch ? batch.days_to_expiry : null,
                    unit_type: unitName || t('Retail Unit'),
                    unit_name: unitName,
                    expiry_status: batch ? batch.expiry_status : null,
                    days_to_expiry: batch ? batch.days_to_expiry : null,
                }
            ]);
        }
    };

    // Toggle wholesale mode for an item
    const toggleWholesale = (index) => {
        if (!orderItems[index]) return;

        const updatedItems = [...orderItems];
        const item = updatedItems[index];
        const newIsWholesale = !item.is_wholesale;

        if (newIsWholesale) {
            // Switch to wholesale
            const wholesaleUnitsAvailable = Math.floor(item.max_stock / item.whole_sale_unit_amount);
            if (item.quantity > wholesaleUnitsAvailable) {
                showError(t('Cannot switch to wholesale: Not enough stock for current quantity'));
                return;
            }
            
            updatedItems[index] = {
                ...item,
                is_wholesale: true,
                price: item.wholesale_price,
                unit_amount: item.whole_sale_unit_amount,
                total: item.quantity * item.wholesale_price,
                unit_type: item.wholesaleUnit?.name || t('Wholesale Unit')
            };
        } else {
            // Switch to retail
            const totalUnitsRequired = item.quantity * item.whole_sale_unit_amount;
            if (totalUnitsRequired > item.max_stock) {
                showError(t('Cannot switch to retail: Not enough stock for current quantity'));
                return;
            }
            
            updatedItems[index] = {
                ...item,
                is_wholesale: false,
                price: item.retail_price,
                unit_amount: 1,
                total: item.quantity * item.retail_price,
                unit_type: item.retailUnit?.name || t('Retail Unit')
            };
        }

        setOrderItems(updatedItems);
    };

    // Update quantity of an item
    const updateQuantity = (index, change) => {
        if (!orderItems[index]) return;

        const item = orderItems[index];
        const newQuantity = item.quantity + change;
        
        // Calculate max quantity based on wholesale/retail mode
        const maxQuantity = item.is_wholesale 
            ? Math.floor(item.max_stock / item.whole_sale_unit_amount)
            : item.max_stock;

        if (newQuantity > maxQuantity) {
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
            <Head title={t('Point of Sale')}>
                <style>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }

                    .card-shine {
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                    }

                    /* Fix for horizontal scroll */
                    html, body {
                        overflow-x: hidden;
                        max-width: 100%;
                    }

                    .responsive-chart-container {
                        max-width: 100%;
                        overflow-x: hidden;
                    }

                    ${animationStyles}
                `}</style>
            </Head>

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || {user: {name: 'Customer'}}}
                    currentRoute="customer.sales.market-order"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Point of Sale")}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={startNewOrder}
                                disabled={isLoading || orderSectionVisible}
                                data-new-order-button
                                className={`inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors ${
                                    (isLoading || orderSectionVisible) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                {t('Start New Sale')}
                            </button>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Your existing content here */}
                                {orderSectionVisible && (
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                        {/* Left column - Products and Barcode Scanner */}
                                        <div className="lg:col-span-8">
                                            {/* Product Search and Barcode Scanner */}
                                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-5 mb-6">
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
                                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-5 mb-6">
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

                                                {/* Order Summary Row */}
                                                {orderItems.length > 0 && (
                                                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                            <div>
                                                                <p className="text-xs text-blue-700 font-medium">{t('Retail Items')}</p>
                                                                <p className="text-lg font-bold text-blue-800">
                                                                    {orderItems.filter(item => !item.is_wholesale).length}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-blue-700 font-medium">{t('Wholesale Items')}</p>
                                                                <p className="text-lg font-bold text-blue-800">
                                                                    {orderItems.filter(item => item.is_wholesale).length}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-blue-700 font-medium">{t('Total Units')}</p>
                                                                <p className="text-lg font-bold text-blue-800">
                                                                    {orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_amount), 0)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-blue-700 font-medium">{t('Order Value')}</p>
                                                                <p className="text-lg font-bold text-blue-800">
                                                                    {formatMoney(total)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                                                            {/* Quick Stats Cards */}
                                            <div className="grid grid-cols-4 gap-4 mb-6">
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
                                                            <p className="text-blue-700 text-sm font-medium">{t('Total Units')}</p>
                                                            <h4 className="text-2xl font-bold text-blue-800">
                                                                {orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_amount), 0)}
                                                            </h4>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                            <Package className="h-6 w-6 text-blue-500" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-sm border border-amber-100">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-amber-700 text-sm font-medium">{t('Wholesale Items')}</p>
                                                            <h4 className="text-2xl font-bold text-amber-800">
                                                                {orderItems.filter(item => item.is_wholesale).length}
                                                            </h4>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                            <ShoppingBag className="h-6 w-6 text-amber-500" />
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
                                                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin">
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
                                                                    className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md hover:shadow-green-500/10 transform hover:scale-[1.01] transition-all duration-300 border border-white/80 backdrop-blur-sm relative overflow-hidden group mb-2"
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
                                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                                <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-green-800 transition-all duration-300">{item.name}</h4>
                                                                                {item.is_wholesale ? (
                                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                                        <ShoppingBag className="h-3 w-3 mr-1" />
                                                                                        {t('Wholesale')}
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                                                        <Package className="h-3 w-3 mr-1" />
                                                                                        {t('Retail')}
                                                                                    </span>
                                                                                )}
                                                                                {item.batch_reference && (
                                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                                                        <Hash className="h-3 w-3 mr-1" />
                                                                                        {item.batch_reference}
                                                                                    </span>
                                                                                )}
                                                                                {item.expiry_status && (
                                                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                                        item.expiry_status === 'expired' 
                                                                                            ? 'bg-red-100 text-red-700' 
                                                                                            : item.expiry_status === 'expiring_soon' 
                                                                                                ? 'bg-orange-100 text-orange-700' 
                                                                                                : item.expiry_status === 'valid' 
                                                                                                    ? 'bg-green-100 text-green-700' 
                                                                                                    : 'bg-gray-100 text-gray-700'
                                                                                    }`}>
                                                                                        {item.expiry_status === 'expired' ? t('Expired') :
                                                                                         item.expiry_status === 'expiring_soon' ? t('Expiring Soon') :
                                                                                         item.expiry_status === 'valid' ? t('Valid') :
                                                                                         t('No Expiry')}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            
                                                                            {/* Pricing and Quantity Info */}
                                                                            <div className="space-y-1">
                                                                                <div className="flex items-center text-xs gap-1">
                                                                                    <span className="text-gray-500">{t('Price')}:</span>
                                                                                    <span className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-medium">{formatMoney(item.price)}</span>
                                                                                    <span className="text-gray-400">per {
                                                                                        item.unit_name || t('unit')
                                                                                    }</span>
                                                                                </div>
                                                                                
                                                                                <div className="flex items-center text-xs gap-1">
                                                                                    <span className="text-gray-500">{t('Quantity')}:</span>
                                                                                    <span className="font-medium text-gray-700">{item.quantity}</span>
                                                                                    <span className="text-gray-400">×</span>
                                                                                    <span className="text-gray-500">{item.unit_amount} {
                                                                                        item.unit_name || t('units')
                                                                                    } {t('each')}</span>
                                                                                    <span className="text-gray-400">=</span>
                                                                                    <span className="font-medium text-blue-600">{item.quantity * item.unit_amount} {
                                                                                        item.unit_name || t('units')
                                                                                    } {t('total')}</span>
                                                                                </div>
                                                                                
                                                                                <div className="flex items-center text-xs gap-1">
                                                                                    <span className="text-gray-500">{t('Total')}:</span>
                                                                                    <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-sm">{formatMoney(item.price * item.quantity)}</span>
                                                                                </div>
                                                                                
                                                                                {/* Batch Information */}
                                                                                {item.batch_reference && (
                                                                                    <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                                                                                        <div className="flex items-center justify-between text-xs">
                                                                                            <span className="text-purple-700 font-medium">{t('Batch')}: {item.batch_reference}</span>
                                                                                            {item.batch_expire_date && (
                                                                                                <span className={`text-xs ${
                                                                                                    item.expiry_status === 'expired' ? 'text-red-600' :
                                                                                                    item.expiry_status === 'expiring_soon' ? 'text-orange-600' :
                                                                                                    'text-green-600'
                                                                                                }`}>
                                                                                                    {new Date(item.batch_expire_date).toLocaleDateString()}
                                                                                                    {item.batch_days_to_expiry !== null && (
                                                                                                        <span className="ml-1">
                                                                                                            ({item.batch_days_to_expiry > 0 ? '+' : ''}{item.batch_days_to_expiry} {t('days')})
                                                                                                        </span>
                                                                                                    )}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Wholesale checkbox with pricing info */}
                                                                            <div className="mt-2 p-2 bg-gray-50 rounded-lg border">
                                                                                <label className="flex items-center justify-between cursor-pointer">
                                                                                    <div className="flex items-center">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={item.is_wholesale}
                                                                                            onChange={() => toggleWholesale(index)}
                                                                                            className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                                                                                        />
                                                                                        <span className="ml-2 text-xs font-medium text-gray-700">
                                                                                            {t('Wholesale Mode')}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <div className="text-xs text-gray-600">
                                                                                            {item.whole_sale_unit_amount} {item.retailUnit?.name || t('units')} @ {formatMoney(item.wholesale_price)}
                                                                                        </div>
                                                                                    </div>
                                                                                </label>
                                                                                
                                                                                {/* Show comparison */}
                                                                                <div className="mt-1 flex justify-between text-xs">
                                                                                    <span className="text-gray-500">
                                                                                        {t('Retail')}: {formatMoney(item.retail_price)} / {item.retailUnit?.name || t('unit')}
                                                                                    </span>
                                                                                    <span className="text-blue-600 font-medium">
                                                                                        {t('Wholesale')}: {formatMoney(item.wholesale_price)} / {item.retailUnit?.name || t('unit')}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Stock indicator */}
                                                                            <div className="flex items-center mt-1">
                                                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                                                                                    <div
                                                                                        className={`h-1.5 rounded-full ${
                                                                                            (() => {
                                                                                                const availableUnits = item.is_wholesale 
                                                                                                    ? Math.floor((item.max_stock - (item.quantity * item.unit_amount)) / item.whole_sale_unit_amount)
                                                                                                    : item.max_stock - (item.quantity * item.unit_amount);
                                                                                                const maxUnits = item.is_wholesale 
                                                                                                    ? Math.floor(item.max_stock / item.whole_sale_unit_amount)
                                                                                                    : item.max_stock;
                                                                                                const ratio = availableUnits / maxUnits;
                                                                                                return ratio > 0.6 ? 'bg-green-500' : ratio > 0.3 ? 'bg-yellow-500' : 'bg-red-500';
                                                                                            })()
                                                                                        }`}
                                                                                        style={{ 
                                                                                            width: `${Math.min(100, (() => {
                                                                                                const availableUnits = item.is_wholesale 
                                                                                                    ? Math.floor((item.max_stock - (item.quantity * item.unit_amount)) / item.whole_sale_unit_amount)
                                                                                                    : item.max_stock - (item.quantity * item.unit_amount);
                                                                                                const maxUnits = item.is_wholesale 
                                                                                                    ? Math.floor(item.max_stock / item.whole_sale_unit_amount)
                                                                                                    : item.max_stock;
                                                                                                return (availableUnits / maxUnits) * 100;
                                                                                            })())}%` 
                                                                                        }}
                                                                                    ></div>
                                                                                </div>
                                                                                <span className={`text-xs font-medium ${
                                                                                    (() => {
                                                                                        const availableUnits = item.is_wholesale 
                                                                                            ? Math.floor((item.max_stock - (item.quantity * item.unit_amount)) / item.whole_sale_unit_amount)
                                                                                            : item.max_stock - (item.quantity * item.unit_amount);
                                                                                        const maxUnits = item.is_wholesale 
                                                                                            ? Math.floor(item.max_stock / item.whole_sale_unit_amount)
                                                                                            : item.max_stock;
                                                                                        const ratio = availableUnits / maxUnits;
                                                                                        return ratio > 0.6 ? 'text-green-600' : ratio > 0.3 ? 'text-yellow-600' : 'text-red-600';
                                                                                    })()
                                                                                }`}>
                                                                                    {item.is_wholesale 
                                                                                        ? Math.floor((item.max_stock - (item.quantity * item.unit_amount)) / item.whole_sale_unit_amount)
                                                                                        : item.max_stock - (item.quantity * item.unit_amount)
                                                                                    } {item.is_wholesale 
                                                                                        ? `${item.wholesaleUnit?.name || t('wholesale units')} ${t('left')}`
                                                                                        : `${item.retailUnit?.name || t('units')} ${t('left')}`
                                                                                    }
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
                                                                                disabled={(() => {
                                                                                    const maxQuantity = item.is_wholesale 
                                                                                        ? Math.floor(item.max_stock / item.whole_sale_unit_amount)
                                                                                        : item.max_stock;
                                                                                    return item.quantity >= maxQuantity;
                                                                                })()}
                                                                                className={`p-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 transition-all duration-300 ${
                                                                                    (() => {
                                                                                        const maxQuantity = item.is_wholesale 
                                                                                            ? Math.floor(item.max_stock / item.whole_sale_unit_amount)
                                                                                            : item.max_stock;
                                                                                        return item.quantity >= maxQuantity;
                                                                                    })()
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
                                            <div id="paymentSection" className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-5 mb-6 sticky top-24">
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
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">{t('Amount Received')}</label>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowKeyboardHelp(true)}
                                                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                                                                title="F12"
                                                            >
                                                                {t('Shortcuts')}
                                                            </button>
                                                        </div>
                                                        <div className="relative rounded-md shadow-sm">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <span className="text-gray-500 sm:text-sm">{defaultCurrency.symbol}</span>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                name="amount_paid"
                                                                id="amountPaid"
                                                                ref={amountPaidRef}
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

                                                        {/* Quick Payment Buttons */}
                                                        {total > 0 && (
                                                            <div className="mt-3">
                                                                <div className="text-xs font-medium text-gray-700 mb-2">{t('Quick Payment')}</div>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={setExactPayment}
                                                                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                                                        title="Ctrl+P"
                                                                    >
                                                                        {t('Exact')}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={setCommonAmounts}
                                                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                                        title="F1"
                                                                    >
                                                                        {t('Round')}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={clearAmountPaid}
                                                                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                                                        title="F2"
                                                                    >
                                                                        {t('Clear')}
                                                                    </button>
                                                                </div>
                                                                <div className="grid grid-cols-4 gap-1 mt-2">
                                                                    {[5, 10, 20, 50].map((amount) => (
                                                                        <button
                                                                            key={amount}
                                                                            type="button"
                                                                            onClick={() => addToAmountPaid(amount)}
                                                                            className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                                                                            title={`F${amount === 5 ? '3' : amount === 10 ? '4' : amount === 20 ? '5' : '6'}`}
                                                                        >
                                                                            +{defaultCurrency.symbol}{amount}
                                                                        </button>
                                                                    ))}
                                                                </div>
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
                                )}
                            </div>
                        </div>
                    </main>
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

            {/* Batch Selector Modal */}
            {showBatchSelector && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">{t('Select Batch for')}: {selectedProduct.name}</h3>
                            <button
                                onClick={() => {
                                    setShowBatchSelector(false);
                                    setSelectedProduct(null);
                                    setSelectedBatch(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {selectedProduct.batches && selectedProduct.batches.map((batch, index) => (
                                <div
                                    key={batch.id || index}
                                    onClick={() => {
                                        setSelectedBatch(batch);
                                        addProductWithBatch(selectedProduct, batch);
                                        setShowBatchSelector(false);
                                        setSelectedProduct(null);
                                        setSelectedBatch(null);
                                    }}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                        selectedBatch?.id === batch.id 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-200 hover:border-green-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-gray-800">
                                                    {t('Batch')}: {batch.reference_number}
                                                </span>
                                                {batch.expiry_status && (
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
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">{t('Stock')}:</span>
                                                    <span className="font-medium ml-1">{batch.stock}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">{t('Retail Price')}:</span>
                                                    <span className="font-medium ml-1">{formatMoney(batch.retail_price)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">{t('Wholesale Price')}:</span>
                                                    <span className="font-medium ml-1">{formatMoney(batch.wholesale_price)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">{t('Unit')}:</span>
                                                    <span className="font-medium ml-1">{batch.unit_name || t('Unit')}</span>
                                                </div>
                                            </div>
                                            
                                            {batch.expire_date && (
                                                <div className="mt-2 text-sm">
                                                    <span className="text-gray-600">{t('Expiry Date')}:</span>
                                                    <span className={`font-medium ml-1 ${
                                                        batch.expiry_status === 'expired' ? 'text-red-600' :
                                                        batch.expiry_status === 'expiring_soon' ? 'text-orange-600' :
                                                        'text-green-600'
                                                    }`}>
                                                        {new Date(batch.expire_date).toLocaleDateString()}
                                                        {batch.days_to_expiry !== null && (
                                                            <span className="ml-1">
                                                                ({batch.days_to_expiry > 0 ? '+' : ''}{batch.days_to_expiry} {t('days')})
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {batch.issue_date && (
                                                <div className="mt-1 text-sm text-gray-600">
                                                    <span>{t('Issue Date')}: {new Date(batch.issue_date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            
                                            {batch.notes && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <span>{t('Notes')}: {batch.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="ml-4">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <Plus className="h-4 w-4 text-green-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowBatchSelector(false);
                                    setSelectedProduct(null);
                                    setSelectedBatch(null);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {t('Cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Keyboard Shortcuts Help Modal */}
            {showKeyboardHelp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">{t('Keyboard Shortcuts')}</h3>
                            <button
                                onClick={() => setShowKeyboardHelp(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">{t('Payment Shortcuts')}</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+P</span>
                                            <span className="text-gray-600">{t('Exact Payment')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+T</span>
                                            <span className="text-gray-600">{t('Focus Amount')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">F1</span>
                                            <span className="text-gray-600">{t('Round Up')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">F2</span>
                                            <span className="text-gray-600">{t('Clear Amount')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">Enter</span>
                                            <span className="text-gray-600">{t('Complete Order')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">{t('Quick Add')}</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">F3</span>
                                            <span className="text-gray-600">+{defaultCurrency.symbol}5</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">F4</span>
                                            <span className="text-gray-600">+{defaultCurrency.symbol}10</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">F5</span>
                                            <span className="text-gray-600">+{defaultCurrency.symbol}20</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">F6</span>
                                            <span className="text-gray-600">+{defaultCurrency.symbol}50</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">F7</span>
                                            <span className="text-gray-600">+{defaultCurrency.symbol}100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">F12</span>
                                    <span className="text-gray-600">{t('Toggle This Help')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
