<x-customer-layout>


<div class="container" dir="rtl">
<!-- Single root element wrapper -->
<div class="relative">
    <!-- Three.js background container -->
    <div id="three-background" class="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>

    <div class="relative min-h-screen p-4 md:p-6 lg:p-8">
        <!-- Main container with enhanced styling -->
        <div class="relative bg-white/90 backdrop-blur-3xl rounded-3xl p-6 shadow-2xl border border-white/30 transition-all duration-500 hover:shadow-green-500/20 overflow-hidden">
            <!-- Decorative elements -->
            <div
                class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl translate-x-20 -translate-y-20 animate-pulse-slow">
            </div>
            <div
                class="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-3xl -translate-x-20 translate-y-20 animate-pulse-slow animation-delay-1000">
            </div>
            <div
                class="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000">
            </div>

            <!-- Content -->
            <div class="relative">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-3">
                            <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/20 animate-button">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    @lang('Create Market Order')</h2>
                                <p class="text-sm text-gray-500">@lang('Manage your sales transactions with ease')</p>
                            </div>
                        </div>
                    </div>
                    <button id="createOrderBtn" class="w-full md:w-auto animate-button px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        @lang('Start New Order')
                    </button>
                </div>

                <div id="orderSection" class="hidden">
                    <!-- Product List -->
                    <div class="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-gray-100/80 hover:shadow-xl transition-all duration-300">
                        <h3 class="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-100 pb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            @lang('Products')
                        </h3>

                        <div class="mb-4">
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input id="searchProduct" type="text" placeholder="@lang('Enter barcode and press Enter to add product')" 
                                    class="block w-full pl-10 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder-gray-400 text-base">
                                <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <div class="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        @lang('Press Enter to add')
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap -mx-2 hidden" id="productContainer">
                            <div class="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
                                <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100 h-full flex flex-col cursor-pointer hover:shadow-lg hover:border-green-100 transition-all duration-300 transform hover:-translate-y-1 group">
                                    <div class="flex items-center mb-4 border-b border-gray-100 pb-3">
                                        <div class="flex-shrink-0 w-10 h-10 bg-green-100 text-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-500 group-hover:text-white transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-gray-800 group-hover:text-green-600 transition-all">@lang('Add New Product')</h4>
                                            <p class="text-sm text-gray-500">@lang('Quick create')</p>
                                        </div>
                                    </div>
                                    <div class="flex-grow">
                                        <p class="text-sm text-gray-500">@lang('Quickly add a new product to your inventory')</p>
                                    </div>
                                </div>
                            </div>

                            @foreach ($products as $product)
                                <div class="w-full md:w-1/2 lg:w-1/3 px-2 mb-4 product-card" data-product-id="{{ $product->id }}" data-product-name="{{ $product->name }}" data-product-price="{{ $product->price }}" data-product-stock="{{ $product->stock }}" data-search-term="{{ strtolower($product->name) }}">
                                    <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100 h-full flex flex-col cursor-pointer hover:shadow-lg hover:border-green-100 transition-all duration-300 transform hover:-translate-y-1 group product-item">
                                        <div class="flex items-center mb-4 border-b border-gray-100 pb-3">
                                            <div class="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-500 group-hover:text-white transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <div class="flex-grow overflow-hidden">
                                                <h4 class="font-semibold text-gray-800 truncate group-hover:text-green-600 transition-all">{{ $product->name }}</h4>
                                                <p class="text-sm text-gray-500 truncate">@lang('Stock'): <span class="font-medium">{{ $product->stock }}</span></p>
                                            </div>
                                        </div>
                                        <div class="flex-grow mb-4">
                                            <div class="flex justify-between">
                                                <span class="text-gray-500 text-sm">@lang('Unit Price'):</span>
                                                <span class="font-medium text-gray-800">${{ number_format($product->price, 2) }}</span>
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <div class="text-sm text-gray-500">@lang('Tap to add to order')</div>
                                            <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div class="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <!-- Order Items with enhanced animation -->
                    <div class="space-y-4 mb-6" id="orderItemsContainer">
                        <div id="emptyOrderState" class="text-center py-12">
                            <div
                                class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">@lang('No items in the order')</h3>
                            <p class="text-gray-500">@lang('Scan products to add them to the order')</p>
                        </div>
                    </div>

                    <!-- Order Summary and Checkout with enhanced styling -->
                    <div id="orderSummarySection" class="border-t border-gray-200/50 pt-6 mb-6 space-y-6 hidden">
                        <!-- Order Summary -->
                        <div class="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow-sm border border-gray-100">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4">@lang('Order Summary')</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center text-gray-600">
                                    <span>@lang('Subtotal')</span>
                                    <span id="subtotal">$0.00</span>
                                </div>
                                <div
                                    class="flex justify-between items-center text-lg font-semibold text-gray-800 pt-3 border-t">
                                    <span>@lang('Total Amount')</span>
                                    <span id="total" class="text-green-600">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <!-- Payment Section -->
                        <div class="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow-sm border border-gray-100">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4">@lang('Payment Details')</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-3">
                                    <label class="block text-sm font-medium text-gray-700">@lang('Payment Method')</label>
                                    <select id="paymentMethod"
                                        class="w-full bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200">
                                        <option value="cash">@lang('Cash')</option>
                                        <option value="card">@lang('Card')</option>
                                        <option value="bank_transfer">@lang('Transfer')</option>
                                    </select>
                                </div>
                                <div class="space-y-3">
                                    <label class="block text-sm font-medium text-gray-700">@lang('Amount Paid')</label>
                                    <div class="relative">
                                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input type="number" id="amountPaid" step="0.01" min="0"
                                            class="w-full pr-7 bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                                            placeholder="0.00">
                                    </div>
                                </div>
                            </div>

                            <div id="accountSection" class="mt-4 space-y-3 hidden">
                                <label class="block text-sm font-medium text-gray-700">@lang('Select Account for Remaining Balance')</label>
                                <div class="relative">
                                    <input type="text" id="accountSearchQuery"
                                        class="w-full bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                                        placeholder="@lang('Search by name, account number, or ID number...')">

                                    <div id="accountDropdown" class="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto hidden">
                                        <!-- Account search results will be populated here via JavaScript -->
                                    </div>
                                </div>

                                <div id="selectedAccountContainer" class="mt-2 p-3 bg-green-50 rounded-lg border border-green-200 hidden">
                                    <!-- Selected account details will be placed here -->
                                </div>
                            </div>

                            <div id="changeDueContainer" class="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hidden">
                                <div class="flex justify-between items-center">
                                    <span class="text-green-700 font-medium">@lang('Change Due')</span>
                                    <span id="changeDue" class="text-lg font-semibold text-green-600">$0.00</span>
                                </div>
                            </div>

                            <div class="mt-4 space-y-3">
                                <label class="block text-sm font-medium text-gray-700">@lang('Order Notes')</label>
                                <textarea id="orderNotes" rows="2"
                                    class="w-full bg-white border-gray-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                                    placeholder="@lang('Add any notes about the order...')"></textarea>
                            </div>
                        </div>

                        <button id="completeOrderBtn" class="w-full px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            @lang('Complete Order')
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success notification -->
        <div id="orderSuccessNotification" class="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-2xl transform scale-0 opacity-0">
            <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Order created successfully!</span>
            </div>
        </div>
    </div>
</div>
</div>

<!-- JavaScript for Market Order Functionality -->
<script>
// Define a global variable to store order items
let globalOrderItems = [];

// Global function to remove items that will be accessible directly from HTML
function removeItemFromOrder(index) {
    console.log("Global removeItemFromOrder called with index:", index);

    // Remove the item at the specified index
    globalOrderItems = globalOrderItems.filter((_, i) => i !== index);

    // Update any UI elements
    const app = document.getElementById('app');
    if (app) {
        // Trigger an event to notify the application about the item removal
        app.dispatchEvent(new CustomEvent('itemRemoved', { detail: { index } }));
    }

    // Refresh the UI directly if possible
    if (window.refreshOrderItems) {
        window.refreshOrderItems();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // State management
    const state = {
        currentOrderId: null,
        orderItems: [],
        subtotal: 0,
        total: 0,
        amountPaid: 0,
        changeDue: 0,
        paymentMethod: 'cash',
        notes: '',
        searchQuery: '',
        searchResults: [],
        showDropdown: false,
        highlightIndex: 0,
        accountSearchQuery: '',
        accountSearchResults: [],
        showAccountDropdown: false,
        selectedAccount: null,
        accountHighlightIndex: 0
    };

    // Elements
    const createOrderBtn = document.getElementById('createOrderBtn');
    const orderSection = document.getElementById('orderSection');
    const orderItemsContainer = document.getElementById('orderItemsContainer');
    const emptyOrderState = document.getElementById('emptyOrderState');
    const orderSummarySection = document.getElementById('orderSummarySection');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const amountPaidInput = document.getElementById('amountPaid');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const accountSection = document.getElementById('accountSection');
    const accountSearchQueryInput = document.getElementById('accountSearchQuery');
    const accountDropdown = document.getElementById('accountDropdown');
    const selectedAccountContainer = document.getElementById('selectedAccountContainer');
    const changeDueContainer = document.getElementById('changeDueContainer');
    const changeDueElement = document.getElementById('changeDue');
    const orderNotesTextarea = document.getElementById('orderNotes');
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    const orderSuccessNotification = document.getElementById('orderSuccessNotification');
    const searchProductInput = document.getElementById('searchProduct');

    // Auto-focus the search input when the page loads or order is started
    function focusSearchInput() {
        if (searchProductInput && !searchProductInput.closest('.hidden')) {
            setTimeout(() => {
                searchProductInput.focus();
            }, 100);
        }
    }

    // Call focus function when page loads
    focusSearchInput();

    // Event Listeners - Only add if elements exist
    if (createOrderBtn) {
        createOrderBtn.addEventListener('click', function() {
            startNewOrder();
            // Focus search input after order is started
            setTimeout(focusSearchInput, 500);
        });
    }

    if (searchProductInput) {
        // Only listen for Enter key to search by barcode
        searchProductInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const barcode = this.value.trim();
                if (barcode) {
                    selectProduct(barcode);
                }
            }
        });
        
        // Auto-focus when clicked anywhere in the search container
        const searchContainer = searchProductInput.closest('.relative');
        if (searchContainer) {
            searchContainer.addEventListener('click', function() {
                searchProductInput.focus();
            });
        }
    }

    if (amountPaidInput) {
        amountPaidInput.addEventListener('input', updateChangeDue);
    }

    if (accountSearchQueryInput) {
        accountSearchQueryInput.addEventListener('input', handleAccountSearchInput);
        accountSearchQueryInput.addEventListener('keydown', handleAccountSearchKeydown);
    }

    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', completeOrder);
    }

    // Initialize product card click events
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseFloat(this.getAttribute('data-product-price'));
            const productStock = parseInt(this.getAttribute('data-product-stock'));

            addProductToOrderFromCard({
                id: productId,
                name: productName,
                price: productPrice,
                stock: productStock
            });
        });
    });

    // Expose functions to global scope for inline event handlers
    window.selectProduct = selectProduct;
    window.addProductToOrder = addProductToOrder;
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.selectAccount = selectAccount;
    window.removeItemFromOrder = removeItemFromOrder;

    // Function to search for product by barcode and add it to order
    function selectProduct(barcode) {
        console.log("Searching for product with barcode:", barcode);

        // Clear the search field
        searchProductInput.value = '';
        
        // Show loading indicator
        const searchContainer = searchProductInput.closest('.relative');
        let loadingIndicator = null;
        
        if (searchContainer) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'absolute inset-y-0 right-10 flex items-center';
            loadingIndicator.innerHTML = `
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'absolute inset-y-0 right-10 flex items-center';
        loadingIndicator.innerHTML = `
            <svg class="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
        searchContainer.appendChild(loadingIndicator);

        // Find the product by barcode
        fetch(`{{ route("customer.market-order.search-products") }}?query=${encodeURIComponent(barcode)}`)
            .then(response => response.json())
            .then(data => {
                // Remove loading indicator
                loadingIndicator.remove();
                
                if (data && data.length > 0) {
                    // Add the first matching product to order
                    const product = data[0];

                    // Check if product already exists in order
                    const existingItemIndex = state.orderItems.findIndex(item => item.product_id === product.id);

                    if (existingItemIndex !== -1) {
                        // Check if there's enough stock
                        if (state.orderItems[existingItemIndex].quantity >= product.stock) {
                            showError('No more stock available for this product');
                            focusSearchInput();
                            return;
                        }

                        // Increment quantity
                        state.orderItems[existingItemIndex].quantity++;
                        state.orderItems[existingItemIndex].total =
                            state.orderItems[existingItemIndex].quantity * state.orderItems[existingItemIndex].price;
                        
                        showSuccess(`${product.name} quantity updated (${state.orderItems[existingItemIndex].quantity})`);
                    } else {
                        // Add new product to order
                        state.orderItems.push({
                            product_id: product.id,
                            name: product.name,
                            price: parseFloat(product.retail_price || product.price),
                            quantity: 1,
                            total: parseFloat(product.retail_price || product.price),
                            max_stock: product.stock
                        });
                        
                        showSuccess(`${product.name} added to order`);
                    }

                    // Update global items array
                    globalOrderItems = [...state.orderItems];

                    // Update UI
                    renderOrderItems();
                    calculateTotal();
                    updateCreateOrderButtonState();
                    
                    // Make sure order summary is visible
                    if (orderSummarySection) orderSummarySection.classList.remove('hidden');
                    if (emptyOrderState) emptyOrderState.style.display = 'none';
                    
                    // Play success sound if available
                    playSound('success');
                } else {
                    showError('Product not found. Please check the barcode and try again.');
                    // Play error sound if available
                    playSound('error');
                }
                
                // Always focus back on input for continuous scanning
                focusSearchInput();
            })
            .catch(error => {
                // Remove loading indicator
                loadingIndicator.remove();
                console.error('Error searching for product:', error);
                showError('Error searching for product');
                playSound('error');
                focusSearchInput();
            });
    }

    // Function to play sound feedback for barcode scanning
    function playSound(type) {
        try {
            let sound;
            if (type === 'success') {
                sound = new Audio("data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAKAAAGhgCFhYWFhYWFhYWFhYWFhYWFhYWFvb29vb29vb29vb29vb29vb29vb3T09PT09PT09PT09PT09PT09PT0+np6enp6enp6enp6enp6enp6enp//////////////////////////8AAAAKQkFNQQAAAQIARAAABoAEM4A4AABAAABoAAAAEQV5+K4AAAAAAAAAAAAAAAAA//uwxAAABS4TrjEGAAFKQrx9cY24I4LBJCY0AIAgaPWCA0bI3CCjggjgwQhMgxMDBv8oCAYB//8uOAiBAEQx+XnExMg0DMD//8IMRMgwGAhCJBQMWGXl//yYmQUGf/5cMLjMBgIQYCAYA2QKBADCQ//4wKECwaDQHf/8iJg3FYXv/+RwQiYP4rC9/zI4Dg4GA8MBAxMG/7IFBmAjIAw+EwY//+MFhcMLi4X//y4SEBDLgwCCQMCf/+CYCEQEKkHAWh3//wTBMbG4iIRxoUKFwahYCBf//FwiFwsNBgCh///5cEPAqOgYF4HAwIC8XheTEFNRTMuOTkuMqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQxE4D1HYdZ+wwbcKOQ2z9hg25qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xDE0APVFh1h7DBtwmjDbX2GDbmqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==");
            } else {
                sound = new Audio("data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAJAAAJTgBpaWlpaWlpaWlpaWlpaWlpaWlpdXV1dXV1dXV1dXV1dXV1dXV1dXWAgICAgICAgICAgICAgICAgICAi4uLi4uLi4uLi4uLi4uLi4uLi4uWlpaWlpaWlpaWlpaWlpaWlpaW//////////////////////////8AAAAKQKFNZQAAAACAAAAAAA8cAAAAAP/7oMQAAAdWKYO0EQAg+EdsdoIgBGpBFNLAgQhVSQQnHLJMLjTZMRIjDFqFxyQyJISKaFGHEpCYOPMOVaxUuMwkjOeRpnBGlTBEhCdUUySjExWM1JbTQSQTLzY2aUDTqjESI3DHlVyp7AQmQvgscbizygiGZSzqjShZR5tjq664/J21zrVtfWvJWvK3rRHJAh61/Wta8NP0f//9akNP0f/o0/Ro0aE+j/o/R+tSGhsb9bX61vWtsESFv/pfffY9aIREhL3v330aNH6NCXvvXrQl7wIgQCKVB4VAqkUCKcqJy50TD9RQWvvUNQiIpx0EByUBaFhCKoVnCUCl4S4pGJiMkgkpIJIQkhmtyp0TVpq00jMPLEgkhoR0IUFT/+2DEFAAJMhtXvYWAKR9Dau+wsAX1nkpgHmASMBkoCYyeSiRwcIKAJFBC4kBggcFhwtUHFgVJiUhFElQchE5kIiVDaEkJIbUQlEFbpRBWwgrbQogoQhsQVvoEQV9ZEE/o//1oT+jWpDf/7r/6/RoC42NjY2NjfWHhsbGxsfGxQcUjQjgrRIRcPCxEWImGBoSIiLTDaEsRUK0QiJB4aGiIuHiQiLDQ8LEhVDw0NEheJFVBAGDQ4cOCAgICBAGBgYDAwEAYGAwMNAGDg4cOHDgiLA4cOHDY4LQhogMTIqIuIQgMQmJUNDBAkSJsP/7YMQXgAk2G1X9hYApMcNqf7CwBOnJycnJzk5OT9Pz/P/P4/XYqGh4iIiQiIaPk5cJERFrqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpGkaj/3/9pGhGhsf/X/+tfWkkhCXOqf/f7Iy653Tt0JrndO3LndO3AyRn7x9v12RkZGRkYHQHBwcHCD4BwcHBwg+CDg4ODhEdIjIyLOlF26dyLt07kZIyMjpUi5GRbpRkZFupF2UXP/+1DEJwAI+htR/YWAKSJDaj+wsAXbv//f/9XO61dP//9aqv6urq6urq6uZmZmZmIHYHBwcHCD4BwcHBwg+A4ODg4OCqz///V1dXV1dWpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxFeDzloRS+0ZW0AAAkMAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=");
            }
            sound.volume = 0.3;
            sound.play();
        } catch (e) {
            console.log('Sound play failed: ', e);
        }
    }

    // Functions
    function startNewOrder() {
        fetch('{{ route("customer.market-order.start") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                state.currentOrderId = data.order_id;
                orderSection.classList.remove('hidden');
                createOrderBtn.classList.add('hidden');
                updateCreateOrderButtonState();
            } else {
                showError(data.message);
            }
        })
        .catch(error => {
            showError('Error starting order: ' + error.message);
        });
    }

    function addProductToOrder(index) {
        if (!state.searchResults[index]) return;

        const product = state.searchResults[index];

        const existingItemIndex = state.orderItems.findIndex(item => item.product_id === product.id);

        if (existingItemIndex !== -1) {
            // Check if there's enough stock
            if (state.orderItems[existingItemIndex].quantity >= product.stock) {
                showError('No more stock available for this product');
                return;
            }

            state.orderItems[existingItemIndex].quantity++;
            state.orderItems[existingItemIndex].total = state.orderItems[existingItemIndex].quantity * state.orderItems[existingItemIndex].price;
        } else {
            state.orderItems.push({
                product_id: product.id,
                name: product.name,
                price: parseFloat(product.retail_price),
                quantity: 1,
                total: parseFloat(product.retail_price),
                max_stock: product.stock
            });
        }

        renderOrderItems();
        calculateTotal();
        updateCreateOrderButtonState();
    }

    function renderOrderItems() {
        const orderItemsContainer = document.getElementById('orderItemsContainer');
        const emptyOrderState = document.getElementById('emptyOrderState');
        const orderSummarySection = document.getElementById('orderSummarySection');

        if (state.orderItems.length === 0) {
            if (emptyOrderState) emptyOrderState.style.display = 'flex';
            if (orderSummarySection) orderSummarySection.classList.add('hidden');
            return;
        }

        if (emptyOrderState) emptyOrderState.style.display = 'none';
        if (orderSummarySection) orderSummarySection.classList.remove('hidden');

        // Clear previous items
        if (orderItemsContainer) orderItemsContainer.innerHTML = '';
        else return; // Exit if container doesn't exist

        // Add each order item with animation
        state.orderItems.forEach((item, index) => {
            const orderItemEl = document.createElement('div');
            orderItemEl.className = 'mb-3 bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100 hover:border-green-100 transition-all duration-300 opacity-0';
            orderItemEl.style.animation = `fadeIn 0.5s ${index * 0.1}s forwards`;

            const totalPrice = (item.quantity * item.price).toFixed(2);

            orderItemEl.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-grow overflow-hidden mr-2">
                        <h4 class="font-medium text-gray-800 truncate">${item.name}</h4>
                        <div class="text-sm text-gray-500 flex items-center mt-1">
                            <span class="inline-block">$${item.price.toFixed(2)} × ${item.quantity}</span>
                            <span class="mx-2">|</span>
                            <span class="font-medium text-gray-700">$${totalPrice}</span>
                        </div>
                    </div>
                    <button class="remove-item p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                <div class="flex items-center mt-2 justify-between">
                    <div class="flex items-center">
                        <button class="decrease-qty p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <span class="mx-2 w-8 text-center font-medium">${item.quantity}</span>
                        <button class="increase-qty p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                    <div class="text-xs text-gray-500">
                        @lang('In stock'): <span class="font-medium">${item.max_stock ? (item.max_stock - item.quantity) : 'N/A'}</span>
                    </div>
                </div>
            `;

            orderItemsContainer.appendChild(orderItemEl);
        });

        // Add event listeners for buttons
        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (state.orderItems[index].quantity > 1) {
                    state.orderItems[index].quantity--;
                    updateOrder();
                }
            });
        });

        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const item = state.orderItems[index];
                const maxStock = item.max_stock || item.stock;
                if (item.quantity < maxStock) {
                    item.quantity++;
                    updateOrder();
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeItem(index);
            });
        });

        // Add these styles to the head of the document if not already present
        if (!document.getElementById('fadeInAnimation')) {
            const style = document.createElement('style');
            style.id = 'fadeInAnimation';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(10px); }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                .animation-delay-1000 {
                    animation-delay: 1s;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .animate-button:hover {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }

                .scrollbar-thin::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e0;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function updateQuantity(index, change) {
        if (!state.orderItems[index]) return;

        const newQuantity = state.orderItems[index].quantity + change;

        if (newQuantity > state.orderItems[index].max_stock) {
            showError('No more stock available for this product');
            return;
        }

        if (newQuantity > 0) {
            state.orderItems[index].quantity = newQuantity;
            state.orderItems[index].total = newQuantity * state.orderItems[index].price;
        } else {
            removeItem(index);
            return;
        }

        renderOrderItems();
        calculateTotal();
        updateCreateOrderButtonState();
    }

    function removeItem(index) {
        console.log("Removing item at index:", index);
        console.log("Before removal, items:", JSON.stringify(state.orderItems));

        if (!state.orderItems[index]) {
            console.error("Item at index " + index + " does not exist");
            return;
        }

        // Remove the item from the array
        state.orderItems = state.orderItems.filter((_, i) => i !== index);
        console.log("After removal, items:", JSON.stringify(state.orderItems));

        // Update the view
        renderOrderItems();
        calculateTotal();
        updateCreateOrderButtonState();

        console.log("Remove operation completed");
    }

    function calculateTotal() {
        state.subtotal = state.orderItems.reduce((sum, item) => sum + item.total, 0);
        state.total = state.subtotal;

        subtotalElement.textContent = '$' + parseFloat(state.subtotal).toFixed(2);
        totalElement.textContent = '$' + parseFloat(state.total).toFixed(2);

        updateChangeDue();
    }

    function updateChangeDue() {
        state.amountPaid = parseFloat(amountPaidInput.value) || 0;
        state.changeDue = Math.max(0, state.amountPaid - state.total);

        if (state.changeDue > 0) {
            changeDueContainer.classList.remove('hidden');
            changeDueElement.textContent = '$' + parseFloat(state.changeDue).toFixed(2);
        } else {
            changeDueContainer.classList.add('hidden');
        }

        if (state.amountPaid < state.total) {
            accountSection.classList.remove('hidden');
        } else {
            accountSection.classList.add('hidden');
        }

        updateCreateOrderButtonState();
    }

    function handleAccountSearchInput() {
        state.accountSearchQuery = accountSearchQueryInput.value.trim();

        if (state.accountSearchQuery.length < 2) {
            accountDropdown.classList.add('hidden');
            state.showAccountDropdown = false;
            return;
        }

        fetch(`{{ route("customer.market-order.search-accounts") }}?query=${encodeURIComponent(state.accountSearchQuery)}`)
            .then(response => response.json())
            .then(data => {
                state.accountSearchResults = data;
                renderAccountSearchResults();
                accountDropdown.classList.remove('hidden');
                state.showAccountDropdown = true;
                state.accountHighlightIndex = 0;
            })
            .catch(error => {
                console.error('Error searching accounts:', error);
            });
    }

    function renderAccountSearchResults() {
        if (state.accountSearchResults.length === 0) {
            accountDropdown.innerHTML = `
                <div class="px-4 py-3 text-center">
                    <p class="text-gray-500">@lang('No accounts found')</p>
                </div>
            `;
            return;
        }

        let html = '';
        state.accountSearchResults.forEach((account, index) => {
            html += `
                <button onclick="selectAccount(${index})" class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${state.accountHighlightIndex === index ? 'bg-green-50' : ''}">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-medium text-gray-900">${account.name}</div>
                            <div class="text-sm text-gray-500">
                                @lang('Account')<span dir="ltr"> #${account.account_number}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-medium text-gray-900">$${parseFloat(account.balance).toFixed(2)}</div>
                            <div class="text-sm text-gray-500">
                                @lang('Balance')
                            </div>
                        </div>
                    </div>
                </button>
            `;
        });

        accountDropdown.innerHTML = html;
    }

    function handleAccountSearchKeydown(e) {
        if (!state.showAccountDropdown) return;

        // Arrow down
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            incrementAccountHighlight();
        }

        // Arrow up
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            decrementAccountHighlight();
        }

        // Enter
        if (e.key === 'Enter') {
            e.preventDefault();
            selectAccount(state.accountHighlightIndex);
        }

        // Escape
        if (e.key === 'Escape') {
            e.preventDefault();
            closeAccountDropdown();
        }
    }

    function incrementAccountHighlight() {
        if (state.accountHighlightIndex === state.accountSearchResults.length - 1) {
            state.accountHighlightIndex = 0;
        } else {
            state.accountHighlightIndex++;
        }
        renderAccountSearchResults();
    }

    function decrementAccountHighlight() {
        if (state.accountHighlightIndex === 0) {
            state.accountHighlightIndex = state.accountSearchResults.length - 1;
        } else {
            state.accountHighlightIndex--;
        }
        renderAccountSearchResults();
    }

    function closeAccountDropdown() {
        accountDropdown.classList.add('hidden');
        state.showAccountDropdown = false;
    }

    function selectAccount(index) {
        if (!state.accountSearchResults[index]) return;

        state.selectedAccount = state.accountSearchResults[index];
        accountSearchQueryInput.value = state.selectedAccount.name;
        closeAccountDropdown();

        selectedAccountContainer.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-medium text-green-800">${state.selectedAccount.name}</div>
                    <div class="text-sm text-green-600">
                        @lang('Account') #${state.selectedAccount.account_number}
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-medium text-green-800">$${parseFloat(state.selectedAccount.balance).toFixed(2)}</div>
                    <div class="text-sm text-green-600">
                        @lang('Current Balance')
                    </div>
                </div>
            </div>
        `;
        selectedAccountContainer.classList.remove('hidden');

        updateCreateOrderButtonState();
    }

    function updateCreateOrderButtonState() {
        if (state.orderItems.length === 0) {
            completeOrderBtn.disabled = true;
            completeOrderBtn.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            completeOrderBtn.classList.remove('bg-gradient-to-r', 'from-green-500', 'to-emerald-600', 'text-white', 'hover:from-green-600', 'hover:to-emerald-700');
            completeOrderBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                @lang('Enter Full Payment')
            `;
            return;
        }

        completeOrderBtn.disabled = false;
        completeOrderBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
        completeOrderBtn.classList.add('bg-gradient-to-r', 'from-green-500', 'to-emerald-600', 'text-white', 'hover:from-green-600', 'hover:to-emerald-700');
        completeOrderBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            @lang('Complete Order')
        `;
    }

    function completeOrder() {
        if (state.orderItems.length === 0) {
            showError('Please add items to the order before completing.');
            return;
        }

        if (state.amountPaid < state.total && !state.selectedAccount) {
            showError('Please enter full payment or select an account for the remaining balance.');
            return;
        }

        const orderData = {
            order_id: state.currentOrderId,
            items: state.orderItems,
            subtotal: state.subtotal,
            total: state.total,
            payment_method: state.paymentMethod,
            amount_paid: state.amountPaid,
            account_id: state.selectedAccount ? state.selectedAccount.id : null,
            notes: state.notes
        };

        fetch('{{ route("customer.market-order.complete") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess(data.message);
                resetOrder();
            } else {
                showError(data.message);
            }
        })
        .catch(error => {
            showError('Error completing order: ' + error.message);
        });
    }

    function resetOrder() {
        state.currentOrderId = null;
        state.orderItems = [];
        state.subtotal = 0;
        state.total = 0;
        state.amountPaid = 0;
        state.changeDue = 0;
        state.paymentMethod = 'cash';
        state.notes = '';
        state.searchQuery = '';
        state.searchResults = [];
        state.showDropdown = false;
        state.highlightIndex = 0;
        state.accountSearchQuery = '';
        state.accountSearchResults = [];
        state.showAccountDropdown = false;
        state.selectedAccount = null;
        state.accountHighlightIndex = 0;

        // Reset UI
        searchProductInput.value = '';
        amountPaidInput.value = '';
        paymentMethodSelect.value = 'cash';
        orderNotesTextarea.value = '';
        accountSearchQueryInput.value = '';

        orderSection.classList.add('hidden');
        createOrderBtn.classList.remove('hidden');
        emptyOrderState.classList.remove('hidden');
        orderSummarySection.classList.add('hidden');
        accountSection.classList.add('hidden');
        selectedAccountContainer.classList.add('hidden');
        changeDueContainer.classList.add('hidden');
    }

    function showError(message) {
        // Create notification container if it doesn't exist
        let notificationContainer = document.getElementById('notificationContainer');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notificationContainer';
            notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-4 max-w-md';
            document.body.appendChild(notificationContainer);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'bg-white rounded-xl shadow-lg border-l-4 border-red-500 p-4 transform translate-x-full opacity-0 transition-all duration-500 flex items-start';
        notification.style.minWidth = '300px';
        notification.style.maxWidth = '100%';

        // Add content
        notification.innerHTML = `
            <div class="mr-3 bg-red-100 rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div class="flex-grow pr-6">
                <h5 class="font-medium text-gray-900 mb-1">@lang('Error')</h5>
                <p class="text-gray-600 text-sm">${message}</p>
            </div>
            <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        // Add the notification to the container
        notificationContainer.appendChild(notification);

        // Animate the notification in
        setTimeout(() => {
            notification.classList.add('translate-x-0', 'opacity-100');
        }, 10);

        // Add click event to close button
        const closeButton = notification.querySelector('button');
        closeButton.addEventListener('click', () => {
            removeNotification(notification);
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
    }

    function showSuccess(message) {
        // Create notification container if it doesn't exist
        let notificationContainer = document.getElementById('notificationContainer');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notificationContainer';
            notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-4 max-w-md';
            document.body.appendChild(notificationContainer);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'bg-white rounded-xl shadow-lg border-l-4 border-green-500 p-4 transform translate-x-full opacity-0 transition-all duration-500 flex items-start';
        notification.style.minWidth = '300px';
        notification.style.maxWidth = '100%';

        // Add content
        notification.innerHTML = `
            <div class="mr-3 bg-green-100 rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div class="flex-grow pr-6">
                <h5 class="font-medium text-gray-900 mb-1">@lang('Success')</h5>
                <p class="text-gray-600 text-sm">${message}</p>
            </div>
            <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        // Add the notification to the container
        notificationContainer.appendChild(notification);

        // Animate the notification in
        setTimeout(() => {
            notification.classList.add('translate-x-0', 'opacity-100');
        }, 10);

        // Add click event to close button
        const closeButton = notification.querySelector('button');
        closeButton.addEventListener('click', () => {
            removeNotification(notification);
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
    }

    function removeNotification(notification) {
        // Animate out
        notification.classList.remove('translate-x-0', 'opacity-100');
        notification.classList.add('translate-x-full', 'opacity-0');

        // Remove from DOM after animation completes
        setTimeout(() => {
            notification.remove();
        }, 500);
    }

    function addProductToOrderFromCard(product) {
        const existingItemIndex = state.orderItems.findIndex(item => item.product_id === product.id);

        if (existingItemIndex !== -1) {
            // Check if there's enough stock
            if (state.orderItems[existingItemIndex].quantity >= product.stock) {
                showError('No more stock available for this product');
                return;
            }

            state.orderItems[existingItemIndex].quantity++;
            state.orderItems[existingItemIndex].total = state.orderItems[existingItemIndex].quantity * state.orderItems[existingItemIndex].price;
        } else {
            state.orderItems.push({
                product_id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                quantity: 1,
                total: parseFloat(product.price),
                stock: product.stock
            });
        }

        // Update global items array for direct access
        globalOrderItems = [...state.orderItems];

        renderOrderItems();
        calculateTotal();
        updateCreateOrderButtonState();
    }

    // Add style for scale animation
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .scale-animation {
            animation: scaleIn 0.3s ease-out;
        }

        @keyframes scaleIn {
            0% { transform: scale(0.95); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(styleEl);

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'ripple';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple style
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Add ripple to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    function updateOrder() {
        // Update global items array for direct access
        globalOrderItems = [...state.orderItems];

        // Refresh the UI
        renderOrderItems();
        calculateTotal();
        updateCreateOrderButtonState();
    }
});
</script>

</x-customer-layout>