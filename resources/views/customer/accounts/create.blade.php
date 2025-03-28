<x-customer-layout>

<div class="container px-6 mx-auto">
    <!-- Header with gradient background -->
    <div class="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
        <div class="absolute inset-0 bg-pattern opacity-10"></div>
        <div class="relative z-10 flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-bold text-white">
                    {{ __('Create New Account') }}
                </h2>
                <p class="mt-2 text-indigo-100 max-w-2xl">
                    {{ __('Set up a new account with all the necessary details.') }}
                </p>
            </div>
            <div class="hidden md:block animate-float">
                <lottie-player src="{{ asset('js/lottie/account-animation.json') }}" background="transparent" speed="1" style="width: 140px; height: 140px;" loop autoplay></lottie-player>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div class="md:col-span-2">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden account-form">
                <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50">
                    <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {{ __('Account Information') }}
                    </h3>
                </div>
                <div class="p-8">
                    <form method="POST" action="{{ route('customer.accounts.store') }}" class="space-y-6">
                        @csrf

                        <!-- Account Name Field -->
                        <div class="form-group">
                            <div class="flex items-center mb-1">
                                <div class="icon-wrapper flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 mr-2">
                                    <svg class="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <label for="name" class="block text-sm font-medium text-gray-700 transition-all duration-200">
                                    {{ __('Account Name') }} <span class="text-red-500">*</span>
                                </label>
                            </div>
                            <div class="mt-1 form-field-wrapper">
                                <div class="relative rounded-md shadow-sm">
                                    <input type="text" id="name" name="name" value="{{ old('name') }}" required
                                        class="block w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition-all duration-200 form-input"
                                        placeholder="{{ __('Enter your account name') }}">
                                </div>
                                @error('name')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

                        <!-- ID Number Field -->
                        <div class="form-group">
                            <div class="flex items-center mb-1">
                                <div class="icon-wrapper flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-violet-100 mr-2">
                                    <svg class="h-5 w-5 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                </div>
                                <label for="id_number" class="block text-sm font-medium text-gray-700 transition-all duration-200">
                                    {{ __('ID Number') }} <span class="text-red-500">*</span>
                                </label>
                            </div>
                            <div class="mt-1 form-field-wrapper">
                                <div class="relative rounded-md shadow-sm">
                                    <input type="text" id="id_number" name="id_number" value="{{ old('id_number') }}" required
                                        class="block w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition-all duration-200 form-input"
                                        placeholder="{{ __('Enter your ID number') }}">
                                </div>
                                @error('id_number')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

                        <!-- Address Field -->
                        <div class="form-group">
                            <div class="flex items-center mb-1">
                                <div class="icon-wrapper flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-pink-100 mr-2">
                                    <svg class="h-5 w-5 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <label for="address" class="block text-sm font-medium text-gray-700 transition-all duration-200">
                                    {{ __('Address') }} <span class="text-red-500">*</span>
                                </label>
                            </div>
                            <div class="mt-1 form-field-wrapper">
                                <div class="relative rounded-md shadow-sm">
                                    <textarea id="address" name="address" rows="3" required
                                        class="block w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition-all duration-200 form-textarea"
                                        placeholder="{{ __('Enter your address') }}">{{ old('address') }}</textarea>
                                </div>
                                @error('address')
                                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center justify-between pt-4">
                            <a href="{{ route('customer.accounts.index') }}" class="form-button-secondary inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                                <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                                {{ __('Back') }}
                            </a>
                            <button type="submit" class="form-button-primary inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {{ __('Create Account') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="md:col-span-1">
            <div class="bg-white rounded-xl shadow-md overflow-hidden sticky top-6 info-card">
                <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50">
                    <h3 class="text-lg font-medium text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ __('Information') }}
                    </h3>
                </div>
                <div class="p-6 bg-gradient-to-br from-white to-indigo-50/30">
                    <div class="space-y-5">
                        <div class="flex items-start info-item">
                            <div class="flex-shrink-0">
                                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-500">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-sm font-semibold text-gray-900">{{ __('Approval Required') }}</h4>
                                <p class="mt-1 text-sm text-gray-600">{{ __('All new accounts require approval by an administrator before they become active.') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start info-item">
                            <div class="flex-shrink-0">
                                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-500">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-sm font-semibold text-gray-900">{{ __('Account Number') }}</h4>
                                <p class="mt-1 text-sm text-gray-600">{{ __('A unique account number will be automatically generated for your account.') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start info-item">
                            <div class="flex-shrink-0">
                                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-500">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-sm font-semibold text-gray-900">{{ __('Privacy') }}</h4>
                                <p class="mt-1 text-sm text-gray-600">{{ __('Your account information is securely stored and only accessible by authorized personnel.') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="three-background" class="fixed inset-0 z-[-1] opacity-30"></div>

@push('scripts')
<script src="{{ asset('js/lottie/lottie-player.js') }}"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize animations for the account form
        anime({
            targets: '.account-form',
            opacity: [0, 1],
            translateY: [20, 0],
            easing: 'easeOutExpo',
            duration: 800
        });

        // Initialize animations for the info card
        anime({
            targets: '.info-card',
            opacity: [0, 1],
            translateX: [20, 0],
            easing: 'easeOutExpo',
            delay: 300,
            duration: 800
        });

        // Add hover effect to buttons
        document.querySelectorAll('.animate-button, .form-button-primary, .form-button-secondary').forEach(button => {
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

        // Info item animations
        anime({
            targets: '.info-item',
            opacity: [0, 1],
            translateY: [15, 0],
            delay: anime.stagger(150, {start: 500}),
            easing: 'easeOutCubic',
            duration: 800
        });

        // Enhanced icon particle effects
        const createParticleEffect = (element) => {
            // Create canvas for particles
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            canvas.style.position = 'absolute';
            canvas.style.top = '-10px';
            canvas.style.left = '-10px';
            canvas.style.zIndex = '5';
            canvas.style.pointerEvents = 'none';

            element.style.position = 'relative';
            element.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            const particles = [];

            // Particle class
            class Particle {
                constructor() {
                    this.x = 30 + (Math.random() * 20 - 10);
                    this.y = 30 + (Math.random() * 20 - 10);
                    this.vx = Math.random() * 0.5 - 0.25;
                    this.vy = Math.random() * 0.5 - 0.25;
                    this.size = Math.random() * 3 + 1;
                    this.color = getComputedStyle(element).backgroundColor;
                    this.alpha = 0;
                    this.alphaSpeed = Math.random() * 0.02 + 0.01;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.alpha < 0.5) {
                        this.alpha += this.alphaSpeed;
                    } else {
                        this.alpha -= this.alphaSpeed;
                    }

                    // Boundary check
                    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                        this.x = 30 + (Math.random() * 20 - 10);
                        this.y = 30 + (Math.random() * 20 - 10);
                        this.alpha = 0;
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${this.alpha})`);
                    ctx.fill();
                }
            }

            // Initialize particles
            for (let i = 0; i < 10; i++) {
                particles.push(new Particle());
            }

            // Animation loop
            let animationId;
            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });

                animationId = requestAnimationFrame(animate);
            };

            // Start/stop animation based on hover or focus
            element.closest('.form-group').addEventListener('mouseenter', () => {
                animate();
            });

            element.closest('.form-group').addEventListener('mouseleave', () => {
                if (!element.closest('.form-group').matches(':focus-within') && animationId) {
                    cancelAnimationFrame(animationId);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            });

            element.closest('.form-group').addEventListener('focusin', () => {
                animate();
            });

            element.closest('.form-group').addEventListener('focusout', () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            });
        };

        // Apply the effect to all icon wrappers
        document.querySelectorAll('.icon-wrapper').forEach(icon => {
            createParticleEffect(icon);
        });

        // Form input animations with improved interaction
        document.querySelectorAll('input, textarea').forEach(input => {
            const formGroup = input.closest('.form-group');

            input.addEventListener('focus', () => {
                anime({
                    targets: input,
                    scale: [1, 1.01],
                    boxShadow: ['0 1px 2px rgba(0, 0, 0, 0.05)', '0 4px 8px rgba(99, 102, 241, 0.15)'],
                    duration: 300,
                    easing: 'easeOutCubic'
                });

                if (formGroup) {
                    // Animate the icon wrapper
                    const iconWrapper = formGroup.querySelector('.icon-wrapper');
                    if (iconWrapper) {
                        anime({
                            targets: iconWrapper,
                            scale: [1, 1.2],
                            rotate: ['0deg', '8deg', '0deg'],
                            duration: 600,
                            easing: 'spring(1, 80, 10, 0)'
                        });
                    }

                    // Animate the label
                    const label = formGroup.querySelector('label');
                    if (label) {
                        anime({
                            targets: label,
                            translateY: [0, -2],
                            fontSize: ['0.875rem', '0.9rem'],
                            duration: 300,
                            easing: 'easeOutCubic'
                        });
                    }
                }
            });

            input.addEventListener('blur', () => {
                anime({
                    targets: input,
                    scale: [1.01, 1],
                    boxShadow: ['0 4px 8px rgba(99, 102, 241, 0.15)', '0 1px 2px rgba(0, 0, 0, 0.05)'],
                    duration: 300,
                    easing: 'easeOutCubic'
                });

                if (formGroup) {
                    // Reset the icon wrapper
                    const iconWrapper = formGroup.querySelector('.icon-wrapper');
                    if (iconWrapper) {
                        anime({
                            targets: iconWrapper,
                            scale: 1,
                            rotate: '0deg',
                            duration: 500,
                            easing: 'easeOutCubic'
                        });
                    }

                    // Reset the label
                    const label = formGroup.querySelector('label');
                    if (label && input.value === '') {
                        anime({
                            targets: label,
                            translateY: [-2, 0],
                            fontSize: ['0.9rem', '0.875rem'],
                            duration: 300,
                            easing: 'easeOutCubic'
                        });
                    }
                }
            });
        });

        // Enhance icon presence on page load with a subtle animation
        anime({
            targets: '.icon-wrapper',
            scale: [0.9, 1],
            opacity: [0.5, 1],
            rotate: ['-5deg', '0deg'],
            duration: 600,
            delay: anime.stagger(100, {start: 300}),
            easing: 'spring(1, 80, 10, 0)'
        });

        // Special animation for form groups
        document.querySelectorAll('.form-group').forEach(group => {
            const icon = group.querySelector('.icon-wrapper');
            const label = group.querySelector('label');

            group.addEventListener('mouseenter', () => {
                if (icon) {
                    anime({
                        targets: icon,
                        rotate: ['0deg', '5deg'],
                        scale: 1.05,
                        backgroundColor: [
                            getComputedStyle(icon).backgroundColor,
                            'rgba(99, 102, 241, 0.2)'
                        ],
                        boxShadow: [
                            '0 1px 5px rgba(0, 0, 0, 0.05)',
                            '0 0 15px rgba(99, 102, 241, 0.3)'
                        ],
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }

                if (label) {
                    anime({
                        targets: label,
                        translateX: [0, 3, 0],
                        duration: 600,
                        easing: 'easeOutElastic(1, .6)'
                    });
                }
            });

            group.addEventListener('mouseleave', () => {
                if (icon && !group.matches(':focus-within')) {
                    anime({
                        targets: icon,
                        rotate: '0deg',
                        scale: 1,
                        backgroundColor: getComputedStyle(icon).backgroundColor,
                        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            });
        });
    });
</script>

<style>
    /* Enhanced animations */
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    .form-input:focus, .form-textarea:focus {
        transition: all 0.3s ease;
        transform: scale(1.01);
    }

    .form-button-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
    }

    .form-button-secondary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    /* Improved background patterns */
    .bg-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    /* RTL support for Persian language */
    html[dir="rtl"] .ml-3, html[dir="rtl"] .ml-4 {
        margin-left: 0;
        margin-right: 0.75rem;
        margin-right: 1rem;
    }

    html[dir="rtl"] .mr-2 {
        margin-right: 0;
        margin-left: 0.5rem;
    }

    html[dir="rtl"] .space-x-4 > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 1;
    }

    html[dir="rtl"] .text-left {
        text-align: right;
    }

    html[dir="rtl"] .text-right {
        text-align: left;
    }

    /* Enhanced RTL support for icon positioning */
    html[dir="rtl"] .flex.items-center.mb-1 {
        flex-direction: row;
    }

    html[dir="rtl"] .icon-wrapper.mr-2 {
        margin-right: 0;
        margin-left: 0.5rem;
    }

    /* Field wrapper and focus effects */
    .form-field-wrapper {
        position: relative;
        transition: all 0.3s ease;
    }

    .form-field-wrapper:focus-within {
        transform: translateY(-1px);
    }

    .form-group {
        position: relative;
    }

    /* Enhanced icon styling */
    .icon-wrapper {
        position: relative;
        z-index: 10;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
        width: 2rem;
        height: 2rem;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
    }

    /* Animate the icon and label together */
    .form-group:focus-within .flex.items-center.mb-1 {
        transform: translateY(-2px);
    }

    .form-group:focus-within .icon-wrapper {
        transform: scale(1.1);
        box-shadow: 0 3px 10px rgba(99, 102, 241, 0.15);
    }

    /* Improved icon emphasis */
    .icon-wrapper svg {
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
        transition: all 0.3s ease;
    }

    .form-group:hover .icon-wrapper svg {
        filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
    }

    /* Icon animations */
    .form-group:focus-within .icon-wrapper svg {
        transform: scale(1.1);
    }

    /* Label animations */
    .form-group:focus-within label {
        color: theme('colors.indigo.600');
        transform: translateY(-1px);
        font-weight: 500;
    }

    /* Help text animations */
    .form-group:focus-within p {
        color: theme('colors.indigo.500');
    }

    /* Input animations */
    .form-input:focus, .form-textarea:focus {
        border-color: theme('colors.indigo.300');
        box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.08);
    }

    /* Floating labels effect */
    .form-input::placeholder, .form-textarea::placeholder {
        transition: opacity 0.3s ease;
    }

    .form-input:focus::placeholder, .form-textarea:focus::placeholder {
        opacity: 0.5;
    }

    /* Add pulse animation to icons for better visibility */
    @keyframes iconPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.2); }
        50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
    }

    .form-group:focus-within .icon-wrapper {
        animation: iconPulse 2s infinite;
    }

    /* Connected label and icon effect */
    .flex.items-center.mb-1:after {
        content: '';
        position: absolute;
        top: 1.75rem;
        left: 1rem;
        height: 0;
        width: 1px;
        background: linear-gradient(180deg, rgba(99, 102, 241, 0.3), transparent);
        transition: all 0.3s ease;
        opacity: 0;
    }

    .form-group:hover .flex.items-center.mb-1:after {
        height: 12px;
        opacity: 1;
    }

    html[dir="rtl"] .flex.items-center.mb-1:after {
        left: auto;
        right: 1rem;
        background: linear-gradient(180deg, rgba(99, 102, 241, 0.3), transparent);
    }
</style>
@endpush

</x-customer-layout>
