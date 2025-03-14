<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POS Dashboard</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
    <!-- Main Container -->
    <div class="container mx-auto p-4 lg:p-6">
        <!-- Header Section -->
        <header class="mb-8 flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-800">POS Dashboard</h1>
            <button id="openScannerBtn" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h4m-4-8v1m-6 0a9 9 0 1018 0 9 9 0 00-18 0z" />
                </svg>
                Scan Barcode
            </button>
        </header>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Table Layout Section (3 columns) -->
            <div class="lg:col-span-3">
                <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">Table Layout</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <!-- Table Cards -->
                        @for ($i = 1; $i <= 12; $i++)
                            <div class="relative group">
                                <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl transition-all duration-300 group-hover:scale-105 -z-10"></div>
                                <div class="bg-white/90 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-lg font-medium">Table {{ $i }}</span>
                                        <!-- Status Indicator -->
                                        <span class="px-2 py-1 rounded-full text-xs {{ $i % 3 == 0 ? 'bg-green-100 text-green-700' : ($i % 3 == 1 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700') }}">
                                            {{ $i % 3 == 0 ? 'Available' : ($i % 3 == 1 ? 'Occupied' : 'Reserved') }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600">Capacity: 4</p>
                                </div>
                            </div>
                        @endfor
                    </div>
                </div>
            </div>

            <!-- Cart Sidebar (1 column) -->
            <div class="lg:col-span-1">
                <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg sticky top-4">
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">Cart</h2>
                    <div id="cartItems" class="space-y-4">
                        <!-- Cart Items will go here -->
                        <div id="emptyCart" class="text-gray-500 text-center py-8">No items in cart</div>
                    </div>
                    <!-- Checkout Button -->
                    <button class="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
                        Checkout
                    </button>
                </div>
            </div>
        </div>

        <!-- Barcode Scanner Modal -->
        <div id="scannerModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
                <div class="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl mx-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-semibold">Scan Barcode</h3>
                        <button id="closeScannerBtn" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <div id="scanner-placeholder" class="text-center p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h4m-4-8v1m-6 0a9 9 0 1018 0 9 9 0 00-18 0z" />
                            </svg>
                            <p class="text-gray-600">Place barcode in front of the scanner</p>
                            <input type="text" id="barcodeInput" class="sr-only" autofocus>
                        </div>
                    </div>
                    <div id="scannedResult" class="hidden mb-4 p-4 bg-green-50 rounded-lg">
                        <div class="flex items-center gap-3 text-green-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Product scanned successfully!</span>
                        </div>
                    </div>
                    <button id="cancelScanBtn" class="w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const scannerModal = document.getElementById('scannerModal');
            const openScannerBtn = document.getElementById('openScannerBtn');
            const closeScannerBtn = document.getElementById('closeScannerBtn');
            const cancelScanBtn = document.getElementById('cancelScanBtn');
            const barcodeInput = document.getElementById('barcodeInput');
            const scannedResult = document.getElementById('scannedResult');
            const cartItems = document.getElementById('cartItems');
            const emptyCart = document.getElementById('emptyCart');

            function openModal() {
                scannerModal.classList.remove('hidden');
                barcodeInput.focus();
            }

            function closeModal() {
                scannerModal.classList.add('hidden');
                scannedResult.classList.add('hidden');
                barcodeInput.value = '';
            }

            function addToCart(barcode) {
                // Mock product data - In real application, this would come from a database
                const product = {
                    name: `Product ${barcode}`,
                    price: Math.floor(Math.random() * 100) + 10,
                    quantity: 1
                };

                emptyCart.classList.add('hidden');

                const itemElement = document.createElement('div');
                itemElement.className = 'bg-white/90 p-4 rounded-xl shadow-sm';
                itemElement.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-medium">${product.name}</h3>
                            <p class="text-sm text-gray-600">$${product.price}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="text-gray-500 hover:text-gray-700">-</button>
                            <span class="text-sm">${product.quantity}</span>
                            <button class="text-gray-500 hover:text-gray-700">+</button>
                        </div>
                    </div>
                `;

                cartItems.insertBefore(itemElement, cartItems.firstChild);

                // Show success message
                scannedResult.classList.remove('hidden');
                setTimeout(() => {
                    closeModal();
                }, 1000);
            }

            // Event Listeners
            openScannerBtn.addEventListener('click', openModal);
            closeScannerBtn.addEventListener('click', closeModal);
            cancelScanBtn.addEventListener('click', closeModal);

            barcodeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const barcode = this.value;
                    if (barcode) {
                        addToCart(barcode);
                    }
                }
            });

            // Keep focus on barcode input while modal is open
            scannerModal.addEventListener('click', function(e) {
                if (e.target === scannerModal) {
                    barcodeInput.focus();
                }
            });
        });
    </script>
</body>
</html>