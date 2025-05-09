<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl" class="rtl">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }} - @lang('Customer Portal')</title>

       
        <!-- Jalali Date Picker -->
        <script>
            // Global jalaliDatepicker object
            window.jalaliDatepicker = {
                startWatch: function() {
                    if (typeof window.JalaliDatepicker !== 'undefined') {
                        window.JalaliDatepicker.init();
                    }
                }
            };
        </script>
        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <!-- Styles -->
        @livewireStyles
        @stack('styles')
    </head>
    <body class="font-sans antialiased bg-gray-100" dir="rtl">
        <div class="min-h-screen">
            <x-customer-navbar />

            <!-- Page Heading -->
            @if (isset($header))
                <header class="bg-white shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endif

            <!-- Page Content -->
            <main>
                {{ $slot }}
            </main>

            <!-- Footer -->
            <footer class="bg-white shadow mt-8 py-4">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center">
                        <div class="text-gray-500 text-sm">
                            &copy; {{ date('Y') }} {{ config('app.name') }}. @lang('All rights reserved.')
                        </div>
                        <div class="text-gray-500 text-sm">
                            <a href="#" class="text-gray-600 hover:text-gray-900">@lang('Terms of Service')</a>
                            <span class="mx-2">|</span>
                            <a href="#" class="text-gray-600 hover:text-gray-900">@lang('Privacy Policy')</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        @livewireScripts
        @stack('scripts')
    </body>
</html>
