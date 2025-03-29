<x-customer-layout>


<div class="container" dir="rtl">
<!-- Single root element wrapper -->
<div class="relative">
    <!-- Three.js background container -->
    <div id="three-background" class="fixed inset-0 -z-10 bg-gradient-to-br from-gray-100 via-white to-gray-100"></div>

    <div class="relative min-h-screen p-4">
        <!-- Main container with enhanced styling -->
        <div class="relative bg-white/80 backdrop-blur-3xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40 transition-all duration-500 hover:shadow-green-500/30 overflow-hidden">
            <!-- Decorative elements -->
            <div
                class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/20 rounded-full blur-3xl translate-x-20 -translate-y-20 animate-pulse-slow">
            </div>
            <div
                class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-full blur-3xl -translate-x-20 translate-y-20 animate-pulse-slow animation-delay-1000">
            </div>

            <!-- Content -->
            <div class="relative">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
                                    @lang('Point of Sale')</h2>
                                <p class="text-sm text-gray-500">@lang('Manage sales transactions efficiently')</p>
                            </div>
                        </div>
                    </div>
                    <button id="createOrderBtn" class="w-full md:w-auto animate-button px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        @lang('Start New Sale')
                    </button>
                </div>

                <div id="orderSection" class="hidden">
                    <!-- POS-style layout: Two-column grid for large screens -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <!-- Left column - Products and Barcode Scanner -->
                        <div class="lg:col-span-8">
                            <!-- Product Search and Barcode Scanner -->
                            <div class="bg-white rounded-2xl shadow-md p-5 mb-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold text-gray-800 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        @lang('Barcode Scanner')
                                    </h3>
                                    <button id="newOrderBtn" class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-transparent rounded-lg text-sm font-medium text-green-700 hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 focus:outline-none transition-colors shadow-sm hover:shadow">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        @lang('New Sale')
                                    </button>
                                </div>

                                <div class="relative mb-2 group" id="searchInputContainer">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input type="text" id="searchQueryInput" class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 rounded-xl group-hover:border-green-300 transition-colors duration-300" placeholder="@lang('Enter barcode and press Enter to add product')">
                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <div id="barcodeLoadingIndicator" class="hidden">
                                            <svg class="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 ml-2 group-hover:text-green-500 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM13 12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2v1h1v-1h-1zM6 17h8a1 1 0 001-1v-1a1 1 0 00-1-1H6a1 1 0 00-1 1v1a1 1 0 001 1z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <p class="text-xs text-gray-500 mb-4">@lang('Scan a barcode or type a product name and press Enter')</p>

                                {{-- Loading & Success/Error Messages --}}
                                <div id="searchResultMessage" class="hidden rounded-lg px-4 py-2 text-sm mb-4"></div>
                            </div>

                            <!-- Order Items Section (replacing Product Categories and Product List) -->
                            <div class="bg-white rounded-2xl shadow-md p-5 mb-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold text-gray-800 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        @lang('Order Items')
                                    </h3>
                                    
                                    <div class="flex space-x-2">
                                        <button id="clearOrderBtn" class="inline-flex items-center px-3 py-1.5 bg-red-50 border border-transparent rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none transition-colors shadow-sm hover:shadow">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            @lang('Clear Order')
                                        </button>
                                        <button id="quickCheckoutBtn" class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 border border-transparent rounded-lg text-sm font-medium text-white hover:from-green-600 hover:to-emerald-700 focus:outline-none transition-colors shadow-sm hover:shadow">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            @lang('Quick Checkout')
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Quick Stats Cards -->
                                <div class="grid grid-cols-3 gap-4 mb-6">
                                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 shadow-sm border border-green-100">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="text-green-700 text-sm font-medium">@lang('Items')</p>
                                                <h4 id="totalItemsCount" class="text-2xl font-bold text-green-800">0</h4>
                                            </div>
                                            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-blue-100">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="text-blue-700 text-sm font-medium">@lang('Quantity')</p>
                                                <h4 id="totalQuantityCount" class="text-2xl font-bold text-blue-800">0</h4>
                                            </div>
                                            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm border border-purple-100">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="text-purple-700 text-sm font-medium">@lang('Total')</p>
                                                <h4 id="cartTotalDisplay" class="text-2xl font-bold text-purple-800">{{ $defaultCurrency->symbol }}0.00</h4>
                                            </div>
                                            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Order Items List - Larger View -->
                                <div class="bg-gray-50 rounded-xl p-4 max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin">
                                    <div id="orderItemsLargeView" class="space-y-3">
                                        <!-- Items will be added dynamically here -->
                                        <div id="emptyOrderStateLarge" class="text-center py-10">
                                            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <h3 class="text-lg font-medium text-gray-500 mb-1">@lang('Your cart is empty')</h3>
                                            <p class="text-gray-400 text-sm">@lang('Scan products with the barcode scanner to add them')</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Quick Frequent Products Section -->
                                <div class="mt-6">
                                    <h4 class="font-medium text-gray-700 mb-3 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        @lang('Frequent Items')
                                    </h4>
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <button class="text-left bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:border-green-200 hover:shadow-md transition-all flex items-center">
                                            <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                                                <span class="text-green-600 font-bold">A</span>
                                            </div>
                                            <div class="flex-1 overflow-hidden">
                                                <h5 class="font-medium text-gray-800 text-sm truncate">Apple</h5>
                                                <p class="text-xs text-green-600 font-bold">{{ $defaultCurrency->symbol }}1.99</p>
                                            </div>
                                        </button>
                                        <button class="text-left bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:border-green-200 hover:shadow-md transition-all flex items-center">
                                            <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
                                                <span class="text-yellow-600 font-bold">B</span>
                                            </div>
                                            <div class="flex-1 overflow-hidden">
                                                <h5 class="font-medium text-gray-800 text-sm truncate">Banana</h5>
                                                <p class="text-xs text-green-600 font-bold">{{ $defaultCurrency->symbol }}0.79</p>
                                            </div>
                                        </button>
                                        <button class="text-left bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:border-green-200 hover:shadow-md transition-all flex items-center">
                                            <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                                                <span class="text-orange-600 font-bold">O</span>
                                            </div>
                                            <div class="flex-1 overflow-hidden">
                                                <h5 class="font-medium text-gray-800 text-sm truncate">Orange Juice</h5>
                                                <p class="text-xs text-green-600 font-bold">{{ $defaultCurrency->symbol }}3.49</p>
                                            </div>
                                        </button>
                                        <button class="text-left bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:border-green-200 hover:shadow-md transition-all flex items-center">
                                            <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
                                                <span class="text-amber-600 font-bold">B</span>
                                            </div>
                                            <div class="flex-1 overflow-hidden">
                                                <h5 class="font-medium text-gray-800 text-sm truncate">Bread</h5>
                                                <p class="text-xs text-green-600 font-bold">{{ $defaultCurrency->symbol }}2.99</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right column - Payment and Checkout -->
                        <div class="lg:col-span-4">
                            <div class="bg-white rounded-2xl shadow-xl p-5 mb-6 sticky top-24">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold text-gray-800 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        @lang('Payment & Checkout')
                                    </h3>
                                    <span id="cart-mini-total" class="text-green-600 text-lg font-bold">{{ $defaultCurrency->symbol }}0.00</span>
                                </div>

                                <!-- Order Summary Section -->
                                <div class="mb-4">
                                    <h4 class="text-sm font-semibold text-gray-700 mb-3">@lang('Order Summary')</h4>
                                    <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-2">
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 text-sm">@lang('Subtotal')</span>
                                            <span id="cart-mini-subtotal" class="font-medium">{{ $defaultCurrency->symbol }}0.00</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 text-sm">@lang('Tax') ({{ $tax_percentage }}%)</span>
                                            <span id="cart-mini-tax" class="font-medium">{{ $defaultCurrency->symbol }}0.00</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 text-sm">@lang('Shipping')</span>
                                            <span id="cart-mini-shipping" class="font-medium">{{ $defaultCurrency->symbol }}0.00</span>
                                        </div>
                                        <div class="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span class="text-gray-800 font-medium">@lang('Total')</span>
                                            <span id="cart-mini-grandtotal" class="text-green-600 font-bold">{{ $defaultCurrency->symbol }}0.00</span>
                                        </div>
                                        <div class="flex justify-between text-gray-600">
                                            <span>@lang('Tax') ({{ $tax_percentage }}%)</span>
                                            <span id="tax">{{ $defaultCurrency->symbol }}0.00</span>
                                        </div>
                                        <div class="flex justify-between font-bold text-gray-800 text-lg">
                                            <span>@lang('Total')</span>
                                            <span id="total" class="text-green-600">{{ $defaultCurrency->symbol }}0.00</span>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <h4 class="font-medium text-gray-700 mb-2">@lang('Payment Method')</h4>
                                        <div class="grid grid-cols-2 gap-2">
                                            <label class="flex items-center bg-gradient-to-r from-white to-gray-50 p-2 rounded-lg shadow-sm border border-gray-200 hover:border-green-200 transition-all cursor-pointer">
                                                <input type="radio" name="payment_method" value="cash" class="text-green-600 focus:ring-green-500 h-4 w-4" checked>
                                                <div class="ml-2">
                                                    <div class="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <span class="font-medium text-sm text-gray-800">@lang('Cash')</span>
                                                    </div>
                                                </div>
                                            </label>
                                            
                                            <label class="flex items-center bg-gradient-to-r from-white to-gray-50 p-2 rounded-lg shadow-sm border border-gray-200 hover:border-green-200 transition-all cursor-pointer">
                                                <input type="radio" name="payment_method" value="card" class="text-green-600 focus:ring-green-500 h-4 w-4">
                                                <div class="ml-2">
                                                    <div class="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        <span class="font-medium text-sm text-gray-800">@lang('Card')</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div id="cashPaymentSection" class="mb-4">
                                        <label for="amountPaid" class="block text-sm font-medium text-gray-700 mb-1">@lang('Amount Received')</label>
                                        <div class="relative rounded-md shadow-sm">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span class="text-gray-500 sm:text-sm" id="currency-symbol">{{ $defaultCurrency->symbol }}</span>
                                            </div>
                                            <input type="number" name="amount_paid" id="amountPaid" class="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-lg" placeholder="0.00" step="0.01">
                                        </div>
                                        <div class="mt-2 flex justify-between text-gray-600">
                                            <span>@lang('Change')</span>
                                            <span id="change" class="font-medium">{{ $defaultCurrency->symbol }}0.00</span>
                                        </div>
                                    </div>
                                    
                                    <button id="completeOrderBtn" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        @lang('Complete Order')
                                    </button>
                                </div>
                            </div>
                        </div>
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
    const searchProductInput = document.getElementById('searchQueryInput');

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
                            playSound('error');
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

                    // Play success sound
                    playSound('success');
                    
                    // Update global items array
                    globalOrderItems = [...state.orderItems];

                    // Update UI
                    renderOrderItems();
                    calculateTotal();
                    updateCreateOrderButtonState();
                    
                    // Make sure order summary is visible
                    if (orderSummarySection) orderSummarySection.classList.remove('hidden');
                    if (emptyOrderState) emptyOrderState.style.display = 'none';
                } else {
                    showError('Product not found. Please check the barcode and try again.');
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
                // Base64 encoded short beep sound
                sound = new Audio("data:audio/wav;base64,UklGRjoAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRYAAAAAAAAAAP//AQD//wIA//8BAP//AgD+/wMA//8AAAAA");
            } else {
                // Base64 encoded error sound
                sound = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAAACAAgAZGF0YQAAAAA=");
            }
            sound.volume = 0.3;
            sound.play();
        } catch (e) {
            console.error("Error playing sound:", e);
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
        if (orderItemsContainer) {
            // Only clear the actual order items, not the empty state
            Array.from(orderItemsContainer.children).forEach(child => {
                if (child.id !== 'emptyOrderState') {
                    child.remove();
                }
            });
        } else {
            return; // Exit if container doesn't exist
        }

        // Add each order item with animation
        state.orderItems.forEach((item, index) => {
            const orderItemEl = document.createElement('div');
            orderItemEl.className = 'mb-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100/80 hover:border-green-300 transition-all duration-300 opacity-0 hover:shadow-green-500/10 transform hover:scale-[1.02] hover:-translate-y-1';
            orderItemEl.style.animation = `fadeIn 0.5s ${index * 0.1}s forwards`;

            const totalPrice = (item.quantity * item.price).toFixed(2);

            orderItemEl.innerHTML = `
                <div class="flex justify-between items-start gap-3 relative overflow-hidden">
                    <!-- Decorative circle in the background -->
                    <div class="absolute -left-6 -top-6 w-16 h-16 bg-gradient-to-br from-green-100/30 to-emerald-100/30 rounded-full blur-md"></div>
                    
                    <div class="flex-grow overflow-hidden relative z-10">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-green-500/20 animate-pulse-slow">
                                <span class="font-bold text-white text-lg">${index + 1}</span>
                            </div>
                            <h4 class="font-bold text-gray-800 truncate text-base">${item.name}</h4>
                        </div>
                        <div class="ml-13 text-sm text-gray-600 flex items-center mt-2">
                            <span class="inline-block font-medium bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$${item.price.toFixed(2)} × ${item.quantity}</span>
                        </div>
                    </div>
                    <div class="text-right flex flex-col items-end relative z-10">
                        <div class="font-bold text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${CURRENCY_SYMBOL + totalPrice}</div>
                        <button class="remove-item p-2 mt-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="mt-3 flex items-center">
                    <div class="flex items-center shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-green-500/10 transition-all">
                        <button class="decrease-qty p-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <span class="w-14 text-center font-bold bg-white px-2 py-2 text-lg border-x border-gray-100">${item.quantity}</span>
                        <button class="increase-qty p-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                    <div class="ml-auto text-sm px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-green-700 font-medium border border-green-100 shadow-sm">
                        @lang('In stock'): <span class="font-bold text-green-700">${item.max_stock ? (item.max_stock - item.quantity) : 'N/A'}</span>
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
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
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

        if (subtotalElement) subtotalElement.textContent = CURRENCY_SYMBOL + parseFloat(state.subtotal).toFixed(2);
        if (totalElement) totalElement.textContent = CURRENCY_SYMBOL + parseFloat(state.total).toFixed(2);

        updateChangeDue();
    }

    function updateChangeDue() {
        state.amountPaid = parseFloat(amountPaidInput && amountPaidInput.value) || 0;
        state.changeDue = Math.max(0, state.amountPaid - state.total);

        if (changeDueContainer && state.changeDue > 0) {
            changeDueContainer.classList.remove('hidden');
            if (changeDueElement) changeDueElement.textContent = CURRENCY_SYMBOL + parseFloat(state.changeDue).toFixed(2);
        } else if (changeDueContainer) {
            changeDueContainer.classList.add('hidden');
        }

        if (accountSection && state.amountPaid < state.total) {
            accountSection.classList.remove('hidden');
        } else if (accountSection) {
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
        if (!completeOrderBtn) return;
        
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

    // Add style for enhanced order summary
    const enhancedStyles = document.createElement('style');
    enhancedStyles.textContent = `
        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem;
            border-radius: 0.75rem;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, rgba(249, 250, 251, 0.8), rgba(255, 255, 255, 0.8));
            border: 1px solid rgba(229, 231, 235, 0.5);
            transition: all 0.3s ease;
        }
        
        .summary-item:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transform: translateY(-2px);
        }
        
        .summary-item.total {
            background: linear-gradient(to right, rgba(5, 150, 105, 0.05), rgba(16, 185, 129, 0.05));
            border: 1px solid rgba(5, 150, 105, 0.2);
        }
        
        .summary-label {
            font-weight: 500;
            color: #374151;
        }
        
        .summary-value {
            font-weight: 600;
        }
        
        .summary-value.total {
            font-weight: 700;
            background: linear-gradient(to right, #059669, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    `;
    document.head.appendChild(enhancedStyles);
    
    // Function to enhance the order summary section
    function enhanceOrderSummary() {
        const orderSummarySection = document.getElementById('orderSummarySection');
        if (!orderSummarySection) return;
        
        // Apply enhanced styling to order summary items
        const summaryItems = orderSummarySection.querySelectorAll('.flex.justify-between');
        summaryItems.forEach((item, index) => {
            if (!item.classList.contains('summary-item')) {
                item.classList.add('summary-item');
                if (index === summaryItems.length - 1) {
                    item.classList.add('total');
                }
                
                const label = item.firstElementChild;
                const value = item.lastElementChild;
                
                if (label) label.classList.add('summary-label');
                if (value) {
                    value.classList.add('summary-value');
                    if (index === summaryItems.length - 1) {
                        value.classList.add('total');
                    }
                }
            }
        });
    }
    
    // Call this function whenever the order summary is updated
    const originalCalculateTotal = calculateTotal;
    calculateTotal = function() {
        originalCalculateTotal.apply(this, arguments);
        enhanceOrderSummary();
    };
    
    // Initial enhancement
    enhanceOrderSummary();

    // Initialize the larger order items view
    function updateOrderItemsLargeView() {
        const orderItemsLargeView = document.getElementById('orderItemsLargeView');
        const emptyOrderStateLarge = document.getElementById('emptyOrderStateLarge');
        
        if (!orderItemsLargeView || !emptyOrderStateLarge) return;
        
        // Define currency symbol for use in templates
        const currencySymbol = "{{ $defaultCurrency->symbol }}";
        
        if (state.orderItems.length === 0) {
            emptyOrderStateLarge.style.display = 'block';
            orderItemsLargeView.innerHTML = '';
            return;
        }
        
        emptyOrderStateLarge.style.display = 'none';
        orderItemsLargeView.innerHTML = '';
        
        state.orderItems.forEach((item, index) => {
            // Generate a consistent color for each product
            const itemColor = getItemColor(item.product_id || index);
            const secondColor = getSecondaryColor(itemColor);
            
            const totalPrice = (item.price * item.quantity).toFixed(2);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'p-4 bg-white rounded-xl shadow-xl hover:shadow-green-500/10 transform hover:scale-[1.01] transition-all border border-gray-100 relative overflow-hidden';
            itemElement.style.opacity = '0';
            itemElement.style.animation = `fadeIn 0.5s ${index * 0.1}s forwards`;
            
            itemElement.innerHTML = `
                <!-- Decorative background element -->
                <div class="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-${itemColor}-100/30 to-${secondColor}-100/30 rounded-full blur-xl"></div>
                
                <!-- Item number badge -->
                <div class="absolute top-0.5 left-0.5 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-sm">
                    <span class="text-gray-700 font-bold text-sm">#${index + 1}</span>
                </div>
                
                <!-- Total price badge -->
                <div class="absolute top-3 right-3 bg-gradient-to-r from-${itemColor}-50 to-${secondColor}-50 px-3 py-1.5 rounded-full text-sm font-bold text-${itemColor}-700 border border-${itemColor}-100 shadow-sm">
                    $${totalPrice}
                </div>
                
                <!-- Product title and primary details section -->
                <div class="mt-2 flex items-start gap-3 pb-4 mb-4 border-b border-gray-100">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-${itemColor}-100 to-${secondColor}-200 flex items-center justify-center shadow-sm">
                        <span class="font-bold text-${itemColor}-600 text-lg">${item.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div class="flex-1 pt-1">
                        <h4 class="font-bold text-gray-800 text-lg">${item.name}</h4>
                        <div class="flex items-center mt-1 gap-2">
                            <span class="inline-block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-medium">$${item.price.toFixed(2)}</span>
                            <span class="text-gray-400">×</span>
                            <span class="font-medium text-gray-600">${item.quantity}</span>
                            <span class="text-gray-400">=</span>
                            <span class="font-bold bg-gradient-to-r from-${itemColor}-600 to-${secondColor}-600 bg-clip-text text-transparent">$${totalPrice}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Item details grid -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <span class="text-xs text-gray-500 block">@lang('Product ID')</span>
                        <span class="font-medium text-gray-700">${item.product_id || 'N/A'}</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <span class="text-xs text-gray-500 block">@lang('Unit Price')</span>
                        <span class="font-medium text-green-600">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <span class="text-xs text-gray-500 block">@lang('Quantity')</span>
                        <span class="font-medium text-gray-700">${item.quantity}</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <span class="text-xs text-gray-500 block">@lang('Available Stock')</span>
                        <span class="font-medium text-${item.max_stock > 5 ? 'green' : 'orange'}-600">${item.max_stock ? (item.max_stock - item.quantity) : 'N/A'}</span>
                    </div>
                </div>
                
                <!-- Action controls -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <button class="decrease-qty-large p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 active:bg-gray-200 transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <span class="w-12 text-center font-bold py-2 px-2 bg-white">${item.quantity}</span>
                        <button class="increase-qty-large p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 active:bg-gray-200 transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center gap-2">
                        <!-- Edit button -->
                        <button class="flex items-center justify-center p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <!-- Remove button -->
                        <button class="remove-item-large flex items-center justify-center p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            orderItemsLargeView.appendChild(itemElement);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.decrease-qty-large').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (state.orderItems[index].quantity > 1) {
                    state.orderItems[index].quantity--;
                    updateOrder();
                }
            });
        });
        
        document.querySelectorAll('.increase-qty-large').forEach(button => {
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
        
        document.querySelectorAll('.remove-item-large').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeItem(index);
            });
        });
    }
    
    // Function to get a random color for the product icons
    function getRandomColor() {
        const colors = ['green', 'blue', 'red', 'yellow', 'purple', 'pink', 'indigo', 'teal', 'orange', 'amber'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Update quick stat counters
    function updateOrderStats() {
        const totalItemsCount = document.getElementById('totalItemsCount');
        const totalQuantityCount = document.getElementById('totalQuantityCount');
        const cartTotalDisplay = document.getElementById('cartTotalDisplay');
        
        if (totalItemsCount) {
            totalItemsCount.textContent = state.orderItems.length;
        }
        
        if (totalQuantityCount) {
            const totalQuantity = state.orderItems.reduce((sum, item) => sum + item.quantity, 0);
            totalQuantityCount.textContent = totalQuantity;
        }
        
        if (cartTotalDisplay) {
            cartTotalDisplay.textContent = CURRENCY_SYMBOL + state.subtotal.toFixed(2);
        }
    }
    
    // Wire up the clear order button
    const clearOrderBtn = document.getElementById('clearOrderBtn');
    if (clearOrderBtn) {
        clearOrderBtn.addEventListener('click', function() {
            if (state.orderItems.length > 0) {
                if (confirm('@lang("Are you sure you want to clear the current order?")')) {
                    state.orderItems = [];
                    globalOrderItems = [];
                    updateOrder();
                }
            }
        });
    }
    
    // Wire up the quick checkout button
    const quickCheckoutBtn = document.getElementById('quickCheckoutBtn');
    if (quickCheckoutBtn) {
        quickCheckoutBtn.addEventListener('click', function() {
            if (state.orderItems.length > 0) {
                // Simulate payment with cash
                if (amountPaidInput) {
                    amountPaidInput.value = state.total.toFixed(2);
                    updateChangeDue();
                }
                
                // Scroll to the checkout section
                const orderSummarySection = document.getElementById('orderSummarySection');
                if (orderSummarySection) {
                    orderSummarySection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    // Extend the updateOrder function to update the large view
    const originalUpdateOrder = updateOrder;
    updateOrder = function() {
        originalUpdateOrder.apply(this, arguments);
        updateOrderItemsLargeView();
        updateOrderStats();
    };
    
    // Call initially to set up
    updateOrderItemsLargeView();
    updateOrderStats();
});

// ... existing code ...
    <script>
        $(document).ready(function() {
            // Get currency symbol from PHP
            const currencySymbol = "{{ $defaultCurrency->symbol }}";
            
            // Format money with the currency symbol
            function formatMoney(amount) {
                return currencySymbol + parseFloat(amount).toFixed(2);
            }
            
            // ... existing code ...
        });
    </script>
// ... existing code ...
</script>

<!-- Load jQuery first if it's not already loaded -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

<!-- Currency and formatting utilities -->
<script>
    // Adding this at the top level so it's available globally
    const CURRENCY_SYMBOL = "{{ $defaultCurrency->symbol }}";
    
    // Global formatMoney function
    function formatMoney(amount) {
        return CURRENCY_SYMBOL + parseFloat(amount).toFixed(2);
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        // If jQuery is available, update currency displays
        if (typeof jQuery !== 'undefined') {
            jQuery(document).ready(function($) {
                // Update all currency displays with proper symbol
                function updateCurrencyDisplays() {
                    // Cart totals
                    $('#cart-mini-total').text(formatMoney(0));
                    $('#cart-mini-subtotal').text(formatMoney(0));
                    $('#cart-mini-tax').text(formatMoney(0));
                    $('#cart-mini-shipping').text(formatMoney(0));
                    $('#cart-mini-grandtotal').text(formatMoney(0));
                    $('#tax').text(formatMoney(0));
                    $('#total').text(formatMoney(0));
                    $('#change').text(formatMoney(0));
                    
                    // Replace any dollar sign in the cartTotalDisplay
                    const cartTotalDisplay = document.getElementById('cartTotalDisplay');
                    if (cartTotalDisplay) {
                        const value = cartTotalDisplay.textContent.replace(/\$/, CURRENCY_SYMBOL);
                        cartTotalDisplay.textContent = value;
                    }
                }
                
                // Initial update when page loads
                updateCurrencyDisplays();
            });
        }
    });
</script>

</x-customer-layout>