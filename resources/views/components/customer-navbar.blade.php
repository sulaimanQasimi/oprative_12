<!-- Enhanced Navbar with Modern Gradient Background -->
<nav x-data="{ isOpen: false }"
     @click.away="isOpen = false"
     class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg mb-6 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <!-- Logo/Brand -->
                <div class="flex-shrink-0 flex items-center">
                    <div class="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                        <div class="p-2.5 bg-white/10 backdrop-blur-sm shadow-lg transform transition-all duration-300 hover:shadow-xl hover:rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white transform transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span class="text-base font-semibold text-white hover:text-white/90 transition-all duration-500">@lang('Customer Portal')</span>
                    </div>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden md:ml-8 md:flex md:space-x-4">
                    @can('customer.view_dashboard')
                    <a href="{{ route('customer.dashboard') }}"
                       class="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out {{ request()->routeIs('customer.dashboard') ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span class="font-medium">@lang('Dashboard')</span>
                    </a>
                    @endcan

                    @can('customer.view_stock')
                    <a href="{{ route('customer.stock-products') }}"
                       class="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out {{ request()->routeIs('customer.stock-products') ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span class="font-medium">@lang('Stock Products')</span>
                    </a>
                    @endcan

                    @can('customer.view_orders')
                    <a href="{{ route('customer.orders') }}"
                       class="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out {{ request()->routeIs('customer.orders') ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span class="font-medium">@lang('Orders')</span>
                    </a>
                    @endcan

                    @can('customer.create_orders')
                    <a href="{{ route('customer.create_orders') }}"
                       class="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out {{ request()->routeIs('customer.create_orders') ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span class="font-medium">@lang('Create Order')</span>
                    </a>
                    @endcan

                    @can('customer.view_sales')
                    <a href="{{ route('customer.sales.index') }}"
                       class="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out {{ request()->routeIs('customer.sales.index') ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span class="font-medium">@lang('Move form Warehouse to Store')</span>
                    </a>
                    @endcan

                    @can('customer.view_accounts')
                    <a href="{{ route('customer.accounts') }}"
                       class="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out {{ request()->routeIs('customer.accounts') ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span class="font-medium">@lang('Bank Accounts')</span>
                    </a>
                    @endcan

                    @can('customer.view_reports')
                    <a href="{{ route('customer.reports') }}"
                       class="inline-flex items-center px-3 py-2 text-sm transition-all duration-200 ease-in-out {{ request()->routeIs('customer.reports') ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span class="font-medium">@lang('Reports')</span>
                    </a>
                    @endcan
                </div>
            </div>

            <!-- Right side -->
            <div class="flex items-center gap-4">
                <!-- Profile Link -->
                <div class="relative group">
                    <a href="{{ route('customer.profile.show') }}"
                       class="flex items-center gap-3 p-2 text-sm transition-all duration-200 hover:bg-white/10 focus:outline-none {{ request()->routeIs('customer.profile.show') ? 'bg-white/20 shadow-lg' : '' }}">
                        <div class="relative">
                            <div class="h-10 w-10 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-3">
                                <span class="text-white font-semibold text-lg">{{ substr(auth()->guard('customer_user')->user()->name, 0, 1) }}</span>
                            </div>
                            <div class="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div class="hidden md:block">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-white">{{ auth()->guard('customer_user')->user()->name }}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/60 transform transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <div class="flex items-center gap-1 text-white/80">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span class="text-xs">{{ auth()->guard('customer_user')->user()->email }}</span>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- Logout Button -->
                <form method="POST" action="{{ route('customer.logout') }}" class="hidden md:flex items-center">
                    @csrf
                    <button type="submit"
                            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>@lang('Logout')</span>
                    </button>
                </form>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <button @click="isOpen = !isOpen"
                            class="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200">
                        <span class="sr-only">@lang('Open main menu')</span>
                        <!-- Icon when menu is closed -->
                        <svg x-show="!isOpen"
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0 transform rotate-180"
                             x-transition:enter-end="opacity-100 transform rotate-0"
                             x-transition:leave="transition ease-in duration-150"
                             x-transition:leave-start="opacity-100 transform rotate-0"
                             x-transition:leave-end="opacity-0 transform rotate-180"
                             class="block h-6 w-6"
                             xmlns="http://www.w3.org/2000/svg"
                             fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <!-- Icon when menu is open -->
                        <svg x-show="isOpen"
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0 transform rotate-180"
                             x-transition:enter-end="opacity-100 transform rotate-0"
                             x-transition:leave="transition ease-in duration-150"
                             x-transition:leave-start="opacity-100 transform rotate-0"
                             x-transition:leave-end="opacity-0 transform rotate-180"
                             class="block h-6 w-6"
                             xmlns="http://www.w3.org/2000/svg"
                             fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    <div x-show="isOpen"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 transform -translate-y-4"
         x-transition:enter-end="opacity-100 transform translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100 transform translate-y-0"
         x-transition:leave-end="opacity-0 transform -translate-y-4"
         class="md:hidden bg-white/10 backdrop-blur-lg absolute w-full z-50">
        <div class="px-2 pt-2 pb-3 space-y-1">
            @can('customer.view_dashboard')
            <a href="{{ route('customer.dashboard') }}"
               class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>@lang('Dashboard')</span>
            </a>
            @endcan

            @can('customer.view_stock')
            <a href="{{ route('customer.stock-products') }}"
               class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>@lang('Stock Products')</span>
            </a>
            @endcan

            @can('customer.view_orders')
            <a href="{{ route('customer.orders') }}"
               class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>@lang('Orders')</span>
            </a>
            @endcan

            @can('customer.create_orders')
            <a href="{{ route('customer.create_orders') }}"
               class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>@lang('Create Order')</span>
            </a>
            @endcan

            @can('customer.view_sales')
            <a href="{{ route('customer.sales.index') }}"
               class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>@lang('Sales')</span>
            </a>
            @endcan

            @can('customer.view_accounts')
            <a href="{{ route('customer.accounts') }}"
               class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>@lang('Bank Accounts')</span>
            </a>
            @endcan

            @can('customer.view_reports')
            <a href="{{ route('customer.reports') }}"
               class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>@lang('Reports')</span>
            </a>
            @endcan

            <form method="POST" action="{{ route('customer.logout') }}" class="block">
                @csrf
                <button type="submit"
                        class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition duration-150 ease-in-out flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>@lang('Logout')</span>
                </button>
            </form>
        </div>
    </div>
</nav>
