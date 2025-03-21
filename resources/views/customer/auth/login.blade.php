<x-app-layout>
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div class="bg-white/10 backdrop-blur-lg rounded-full p-4 mb-8">
            <a href="/">
                <x-application-logo class="w-24 h-24 fill-current text-white" />
            </a>
        </div>

        <div class="w-full sm:max-w-md mt-6 px-8 py-8 bg-white/90 backdrop-blur-lg shadow-2xl overflow-hidden sm:rounded-2xl border border-white/20">
            <h2 class="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome Back!</h2>

            <!-- Session Status -->
            <x-auth-session-status class="mb-4" :status="session('status')" />

            <form method="POST" action="{{ route('customer.login') }}">
                @csrf

                <!-- Email Address -->
                <div>
                    <x-input-label for="email" :value="__('Email')" class="text-gray-700 font-medium" />
                    <div class="relative mt-1">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <x-text-input id="email" class="block w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" placeholder="Enter your email" />
                    </div>
                    <x-input-error class="mt-2" :messages="$errors->get('email')" />
                </div>

                <!-- Password -->
                <div class="mt-6">
                    <x-input-label for="password" :value="__('Password')" class="text-gray-700 font-medium" />
                    <div class="relative mt-1">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <x-text-input id="password" class="block w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 ease-in-out bg-white/50 backdrop-blur-sm" type="password" name="password" required autocomplete="current-password" placeholder="Enter your password" />
                    </div>
                    <x-input-error class="mt-2" :messages="$errors->get('password')" />
                </div>

                <!-- Remember Me -->
                <div class="block mt-6">
                    <label for="remember_me" class="inline-flex items-center cursor-pointer">
                        <div class="relative">
                            <input id="remember_me" type="checkbox" class="sr-only peer" name="remember">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                        </div>
                        <span class="ml-3 text-sm font-medium text-gray-700">{{ __('Remember me') }}</span>
                    </label>
                </div>

                <div class="flex items-center justify-between mt-8">
                    <div class="flex space-x-4">
                        @if (Route::has('customer.password.request'))
                            <a class="text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out" href="{{ route('customer.password.request') }}">
                                {{ __('Forgot password?') }}
                            </a>
                        @endif

                        @if (Route::has('customer.register'))
                            <a class="text-sm text-purple-600 hover:text-purple-800 transition duration-150 ease-in-out" href="{{ route('customer.register') }}">
                                {{ __('Create account') }}
                            </a>
                        @endif
                    </div>

                    <x-primary-button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition duration-150 ease-in-out transform hover:scale-105">
                        {{ __('Sign in') }}
                    </x-primary-button>
                </div>
            </form>
        </div>
    </div>
</x-app-layout>
