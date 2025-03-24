<nav class="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl mb-6 transition-all duration-300 hover:shadow-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <!-- Logo/Brand -->
                <div class="flex-shrink-0 flex items-center">
                    <div class="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                        <div class="p-2.5 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white transform transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span class="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 transition-all duration-500">@lang('Customer Portal')</span>
                    </div>
                </div>

                <!-- Navigation Links -->
                <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
                    <a href="{{ route('customer.dashboard') }}"
                       class="inline-flex items-center px-3 pt-1 border-b-2 transition-all duration-200 ease-in-out {{ request()->routeIs('customer.dashboard') ? 'border-blue-500 text-gray-900 scale-105' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:scale-105' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span class="font-medium">@lang('Dashboard')</span>
                    </a>
                    <a href="{{ route('customer.stock-products') }}"
                       class="inline-flex items-center px-3 pt-1 border-b-2 transition-all duration-200 ease-in-out {{ request()->routeIs('customer.stock-products') ? 'border-blue-500 text-gray-900 scale-105' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:scale-105' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span class="font-medium">@lang('Stock Products')</span>
                    </a>
                    <a href="{{ route('customer.orders') }}"
                       class="inline-flex items-center px-3 pt-1 border-b-2 transition-all duration-200 ease-in-out {{ request()->routeIs('customer.orders') ? 'border-blue-500 text-gray-900 scale-105' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:scale-105' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span class="font-medium">@lang('Orders')</span>
                    </a>
                    <a href="{{ route('customer.accounts') }}"
                       class="inline-flex items-center px-3 pt-1 border-b-2 transition-all duration-200 ease-in-out {{ request()->routeIs('customer.accounts') ? 'border-blue-500 text-gray-900 scale-105' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:scale-105' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span class="font-medium">@lang('Bank Accounts')</span>
                    </a>
                </div>
            </div>

            <!-- Right side -->
            <div class="flex items-center gap-4">
                <!-- Profile Link -->
                <a href="{{ route('customer.profile.show') }}" 
                   class="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none {{ request()->routeIs('customer.profile.show') ? 'bg-gray-50 shadow-md' : '' }}">
                    <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-3">
                        <span class="text-white font-semibold">{{ substr(auth()->guard('customer')->user()->name, 0, 1) }}</span>
                    </div>
                    <div class="hidden md:block">
                        <div class="text-sm font-medium text-gray-700">{{ auth()->guard('customer')->user()->name }}</div>
                        <div class="text-xs text-gray-500">{{ auth()->guard('customer')->user()->email }}</div>
                    </div>
                </a>

                <!-- Logout Button -->
                <form method="POST" action="{{ route('customer.logout') }}" class="flex items-center">
                    @csrf
                    <button type="submit" 
                            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span class="hidden md:inline">@lang('Logout')</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</nav>
