<x-app-layout>
<div dir="rtl"
     x-data="{
         activeTab: 'profile',
         showPasswordForm: false,
         animateHeader: true,
         animateProfile: true,
         animateForm: true
     }"
     x-init="
         setTimeout(() => animateHeader = false, 1000);
         setTimeout(() => animateProfile = false, 1500);
         setTimeout(() => animateForm = false, 2000);
     "
     class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <x-customer-navbar />

    <!-- Main Container -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header Section -->
        <div x-show="animateHeader"
             x-transition:enter="transition ease-out duration-1000"
             x-transition:enter-start="opacity-0 transform -translate-y-12"
             x-transition:enter-end="opacity-100 transform translate-y-0"
             class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 mb-12 relative overflow-hidden">
            <div class="absolute inset-0 bg-grid-white/10"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div class="relative z-10">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <div class="bg-white/10 rounded-2xl p-4">
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
                        <div class="bg-white/10 rounded-2xl p-6 flex-1 min-w-[180px]">
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
                        <div class="bg-white/10 rounded-2xl p-6 flex-1 min-w-[180px]">
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
                <!-- Profile Summary -->
                <div x-show="animateProfile"
                     x-transition:enter="transition ease-out duration-1000"
                     x-transition:enter-start="opacity-0 transform -translate-x-12"
                     x-transition:enter-end="opacity-100 transform translate-x-0"
                     class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div class="flex flex-col items-center text-center">
                        <div class="relative mb-8">
                            <div class="w-40 h-40 rounded-full bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center shadow-lg">
                                <span class="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</span>
                            </div>
                            <button class="absolute bottom-0 left-0 bg-white rounded-full p-3 shadow-lg">
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
                <div x-show="activeTab === 'profile' && animateForm"
                     x-transition:enter="transition ease-out duration-1000"
                     x-transition:enter-start="opacity-0 transform translate-x-12"
                     x-transition:enter-end="opacity-100 transform translate-x-0"
                     class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div class="space-y-8">
                        <div class="flex items-center justify-between border-b border-gray-100 pb-6">
                            <div class="space-y-2">
                                <h3 class="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-right">
                                    @lang('Profile Information')
                                </h3>
                                <p class="text-gray-500 text-right text-lg">@lang('Update your account\'s profile information and email address.')</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Name Field -->
                            <div class="space-y-2">
                                <label for="name" class="block text-sm font-medium text-gray-700">@lang('Name')</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input type="text" name="name" id="name" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="@lang('Enter your name')">
                                </div>
                            </div>

                            <!-- Email Field -->
                            <div class="space-y-2">
                                <label for="email" class="block text-sm font-medium text-gray-700">@lang('Email')</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input type="email" name="email" id="email" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="@lang('Enter your email')">
                                </div>
                            </div>

                            <!-- Phone Field -->
                            <div class="space-y-2">
                                <label for="phone" class="block text-sm font-medium text-gray-700">@lang('Phone')</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input type="tel" name="phone" id="phone" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="@lang('Enter your phone number')">
                                </div>
                            </div>

                            <!-- Address Field -->
                            <div class="space-y-2">
                                <label for="address" class="block text-sm font-medium text-gray-700">@lang('Address')</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input type="text" name="address" id="address" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="@lang('Enter your address')">
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end">
                            <button type="submit" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                @lang('Save Changes')
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Security Settings -->
                <div x-show="activeTab === 'security' && animateForm"
                     x-transition:enter="transition ease-out duration-1000"
                     x-transition:enter-start="opacity-0 transform translate-x-12"
                     x-transition:enter-end="opacity-100 transform translate-x-0"
                     class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div class="space-y-8">
                        <div class="flex items-center justify-between border-b border-gray-100 pb-6">
                            <div class="space-y-2">
                                <h3 class="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-right">
                                    @lang('Security Settings')
                                </h3>
                                <p class="text-gray-500 text-right text-lg">@lang('Manage your account\'s security settings and password.')</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Current Password Field -->
                            <div class="space-y-2">
                                <label for="current_password" class="block text-sm font-medium text-gray-700">@lang('Current Password')</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input type="password" name="current_password" id="current_password" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="@lang('Enter current password')">
                                </div>
                            </div>

                            <!-- New Password Field -->
                            <div class="space-y-2">
                                <label for="password" class="block text-sm font-medium text-gray-700">@lang('New Password')</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                    <input type="password" name="password" id="password" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="@lang('Enter new password')">
                                </div>
                            </div>

                            <!-- Confirm Password Field -->
                            <div class="space-y-2">
                                <label for="password_confirmation" class="block text-sm font-medium text-gray-700">@lang('Confirm Password')</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <input type="password" name="password_confirmation" id="password_confirmation" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="@lang('Confirm new password')">
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end">
                            <button type="submit" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                @lang('Update Password')
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Add Animate.js animations to elements
    document.addEventListener('DOMContentLoaded', function() {
        // Animate form fields on focus
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.closest('.space-y-2').classList.add('animate__animated', 'animate__pulse');
            });
            input.addEventListener('blur', function() {
                this.closest('.space-y-2').classList.remove('animate__animated', 'animate__pulse');
            });
        });

        // Animate buttons on hover
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.classList.add('animate__animated', 'animate__rubberBand');
            });
            button.addEventListener('mouseleave', function() {
                this.classList.remove('animate__animated', 'animate__rubberBand');
            });
        });

        // Animate profile avatar on hover
        const avatar = document.querySelector('.w-40');
        if (avatar) {
            avatar.addEventListener('mouseenter', function() {
                this.classList.add('animate__animated', 'animate__bounceIn');
            });
            avatar.addEventListener('mouseleave', function() {
                this.classList.remove('animate__animated', 'animate__bounceIn');
            });
        }

        // Animate stats cards on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        });

        document.querySelectorAll('.bg-white\\/10').forEach(card => {
            observer.observe(card);
        });
    });
</script>
</x-app-layout>