<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Warehouse Management System') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased">
    <!-- Three.js Background Container -->
    <div id="three-background" class="fixed inset-0 -z-10"></div>

    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md shadow-lg fixed w-full z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <span class="text-2xl font-bold text-blue-600 animate-logo">WMS</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="{{ route('login') }}" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 animate-button">Sign In</a>
                    <a href="{{ route('register') }}" class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 animate-button">Get Started</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative bg-gray-900/90 h-screen">
        <div class="absolute inset-0">
            <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Warehouse">
            <div class="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-900/80"></div>
        </div>
        <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div class="hero-content">
                <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Optimize Your Inventory with Ease</h1>
                <p class="mt-6 text-xl text-gray-300 max-w-3xl">Streamline your warehouse operations with our comprehensive management system. Track inventory, manage orders, and gain valuable insights all in one place.</p>
                <div class="mt-10 flex space-x-4">
                    <a href="{{ route('register') }}" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 animate-button">
                        Get Started
                    </a>
                    <a href="#features" class="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-200 animate-button">
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center feature-title">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Powerful Features for Modern Warehouses</h2>
                <p class="mt-4 text-lg text-gray-500">Everything you need to manage your warehouse efficiently</p>
            </div>
            <div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Feature 1 -->
                <div class="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card">
                    <div class="text-blue-600 mb-4">
                        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">Real-time Inventory Tracking</h3>
                    <p class="mt-2 text-gray-500">Monitor stock levels, track movements, and get instant updates on inventory status.</p>
                </div>

                <!-- Feature 2 -->
                <div class="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card">
                    <div class="text-blue-600 mb-4">
                        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">Order Management</h3>
                    <p class="mt-2 text-gray-500">Efficiently process orders, track shipments, and manage customer relationships.</p>
                </div>

                <!-- Feature 3 -->
                <div class="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card">
                    <div class="text-blue-600 mb-4">
                        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">Analytics & Reporting</h3>
                    <p class="mt-2 text-gray-500">Get detailed insights with customizable reports and analytics dashboards.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Dashboard Preview Section -->
    <div class="py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16 dashboard-title">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Intuitive Dashboard Interface</h2>
                <p class="mt-4 text-lg text-gray-500">Get a glimpse of our powerful dashboard</p>
            </div>
            <div class="relative dashboard-preview">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform rotate-1"></div>
                <div class="relative bg-white rounded-lg shadow-2xl overflow-hidden">
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Dashboard Stats -->
                            <div class="bg-blue-50 p-4 rounded-lg stat-card">
                                <h3 class="text-lg font-semibold text-blue-900">Total Inventory</h3>
                                <p class="text-3xl font-bold text-blue-600">1,234</p>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg stat-card">
                                <h3 class="text-lg font-semibold text-green-900">Pending Orders</h3>
                                <p class="text-3xl font-bold text-green-600">45</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg stat-card">
                                <h3 class="text-lg font-semibold text-purple-900">Low Stock Items</h3>
                                <p class="text-3xl font-bold text-purple-600">12</p>
                            </div>
                        </div>
                        <!-- Chart Placeholder -->
                        <div class="mt-8 h-64 bg-gray-100 rounded-lg flex items-center justify-center chart-placeholder">
                            <span class="text-gray-500">Interactive Analytics Chart</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-blue-600">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <div class="cta-content">
                <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    <span class="block">Ready to get started?</span>
                    <span class="block text-blue-200">Start your free trial today.</span>
                </h2>
            </div>
            <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div class="inline-flex rounded-md shadow">
                    <a href="{{ route('register') }}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200 animate-button">
                        Get started
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="footer-section">
                    <h3 class="text-white text-lg font-semibold mb-4">About Us</h3>
                    <p class="text-gray-400">We provide cutting-edge warehouse management solutions to help businesses optimize their operations.</p>
                </div>
                <div class="footer-section">
                    <h3 class="text-white text-lg font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="#features" class="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3 class="text-white text-lg font-semibold mb-4">Contact</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li>Email: support@wms.com</li>
                        <li>Phone: (555) 123-4567</li>
                        <li>Address: 123 Warehouse St, Business City</li>
                    </ul>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-8">
                <p class="text-gray-400 text-center">&copy; {{ date('Y') }} Warehouse Management System. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.classList.add('bg-white');
                nav.classList.remove('bg-white/80');
            } else {
                nav.classList.remove('bg-white');
                nav.classList.add('bg-white/80');
            }
        });

        // Enhanced landing page animations
        document.addEventListener('DOMContentLoaded', () => {
            // Logo animation
            anime({
                targets: '.animate-logo',
                scale: [1, 1.1, 1],
                duration: 2000,
                easing: 'easeInOutQuad',
                loop: true
            });

            // Hero content animation
            anime({
                targets: '.hero-content',
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutExpo'
            });

            // Feature cards animation
            anime({
                targets: '.feature-card',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(200),
                easing: 'easeOutExpo'
            });

            // Dashboard preview animation
            anime({
                targets: '.dashboard-preview',
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutExpo'
            });

            // Stats cards animation
            anime({
                targets: '.stat-card',
                scale: [0.9, 1],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(200),
                easing: 'easeOutExpo'
            });

            // CTA section animation
            anime({
                targets: '.cta-content',
                translateX: [-50, 0],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutExpo'
            });

            // Footer sections animation
            anime({
                targets: '.footer-section',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(200),
                easing: 'easeOutExpo'
            });

            // Button hover animations
            document.querySelectorAll('.animate-button').forEach(button => {
                button.addEventListener('mouseenter', () => {
                    anime({
                        targets: button,
                        scale: 1.05,
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                });

                button.addEventListener('mouseleave', () => {
                    anime({
                        targets: button,
                        scale: 1,
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                });
            });
        });
    </script>
</body>
</html>
