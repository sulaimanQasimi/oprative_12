<x-app-layout>
<div dir="rtl" x-data="{ activeTab: 'profile', showPasswordForm: false }" class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <x-customer-navbar />

    <!-- Main Container -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div class="absolute inset-0 bg-grid-white/10 animate-pulse"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div class="relative z-10">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-4xl font-bold text-white mb-2">@lang('Profile')</h2>
                            <p class="text-indigo-100 text-lg">@lang('Manage your account settings and preferences')</p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4">
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex-1 min-w-[180px] hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="bg-white/20 rounded-lg p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span class="text-white/80">@lang('Total Orders')</span>
                            </div>
                            <span class="block text-3xl font-bold text-white">{{ auth()->user()->sales->count() }}</span>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex-1 min-w-[180px] hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="bg-white/20 rounded-lg p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="text-white/80">@lang('Total Spent')</span>
                            </div>
                            <span class="block text-3xl font-bold text-white">${{ number_format(auth()->user()->sales->sum('total_amount') ?? 0, 2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="lg:grid lg:grid-cols-12 lg:gap-12">
            <!-- Left Column - Profile Navigation -->
            <div class="lg:col-span-4">
                <!-- Profile Navigation -->
                <div class="bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20 mb-8">
                    <div class="flex flex-col gap-3">
                        <button @click="activeTab = 'profile'"
                                :class="{ 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg scale-[1.02]': activeTab === 'profile', 'hover:bg-gray-50': activeTab !== 'profile' }"
                                class="flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02]">
                            <div class="bg-gradient-to-br from-violet-100 to-indigo-100 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            @lang('Profile Information')
                        </button>
                        <button @click="activeTab = 'security'"
                                :class="{ 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg scale-[1.02]': activeTab === 'security', 'hover:bg-gray-50': activeTab !== 'security' }"
                                class="flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02]">
                            <div class="bg-gradient-to-br from-violet-100 to-indigo-100 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            @lang('Security')
                        </button>
                        <button @click="activeTab = 'notifications'"
                                :class="{ 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg scale-[1.02]': activeTab === 'notifications', 'hover:bg-gray-50': activeTab !== 'notifications' }"
                                class="flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02]">
                            <div class="bg-gradient-to-br from-violet-100 to-indigo-100 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            @lang('Notifications')
                        </button>
                    </div>
                </div>

                <!-- Profile Summary -->
                <div class="bg-white rounded-2xl shadow-lg border border-white/20 p-8">
                    <div class="flex flex-col items-center text-center">
                        <div class="relative mb-8">
                            <div class="w-40 h-40 rounded-full bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center shadow-lg">
                                <span class="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</span>
                            </div>
                            <button class="absolute bottom-0 left-0 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ auth()->user()->name }}</h3>
                        <p class="text-gray-500 mb-6">{{ auth()->user()->email }}</p>
                        <div class="flex flex-wrap gap-3 justify-center">
                            <span class="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-100">
                                @lang('Member since') {{ auth()->user()->created_at->format('M Y') }}
                            </span>
                            <span class="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
                                {{ auth()->user()->sales->count() }} @lang('Orders')
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column - Profile Content -->
            <div class="lg:col-span-8 space-y-8">
                <!-- Profile Information Form -->
                <div x-show="activeTab === 'profile'"
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 transform translate-y-4"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="bg-white rounded-2xl shadow-lg border border-white/20 p-8">
                    <div class="space-y-8">
                        <div class="flex items-center justify-between border-b border-gray-100 pb-6">
                            <div class="space-y-2">
                                <h3 class="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-right">
                                    @lang('Profile Information')
                                </h3>
                                <p class="text-gray-500 text-right text-lg">@lang('Update your account\'s profile information and email address.')</p>
                            </div>
                        </div>
                        @include('customer.profile.partials.update-profile-information-form')
                    </div>
                </div>

                <!-- Security Settings -->
                <div x-show="activeTab === 'security'"
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 transform translate-y-4"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="bg-white rounded-2xl shadow-lg border border-white/20 p-8">
                    <div class="space-y-8">
                        <div class="flex items-center justify-between border-b border-gray-100 pb-6">
                            <div class="space-y-2">
                                <h3 class="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-right">
                                    @lang('Security Settings')
                                </h3>
                                <p class="text-gray-500 text-right text-lg">@lang('Manage your account\'s security settings and password.')</p>
                            </div>
                        </div>
                        @include('customer.profile.partials.update-password-form')
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</x-app-layout>