<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Theme Initialization Script -->
        <script>
            (function() {
                // Only run on client side
                if (typeof window === 'undefined') return;
                
                const theme = localStorage.getItem('theme') || 'dark';
                const root = document.documentElement;
                const body = document.body;
                
                if (root && body) {
                    if (theme === 'dark') {
                        root.classList.add('dark');
                        body.classList.add('dark');
                    } else {
                        root.classList.remove('dark');
                        body.classList.remove('dark');
                    }
                }
            })();
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased" dir="rtl">
        @inertia
    </body>
</html>
