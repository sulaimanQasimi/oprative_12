import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('warehouse.login'));
    };

    // Animation effect on mount
    useEffect(() => {
        const form = document.querySelector('.login-form');
        form.classList.add('form-appear');

        // Parallax effect for warehouse image
        const warehouseImage = document.querySelector('.warehouse-image');
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            warehouseImage.style.transform = `translateX(${x * -20}px) translateY(${y * -20}px)`;
        });
    }, []);

    return (
        <div className="min-h-screen flex overflow-hidden relative">
            <Head title="Warehouse Login" />

            {/* Left panel with warehouse image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <div className="warehouse-image absolute inset-0 bg-cover bg-center transition-transform duration-200 ease-out" style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
                    filter: 'brightness(0.7) saturate(1.2)',
                    backgroundSize: '110% 110%',
                }}></div>

                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 to-navy-900/30"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white z-10">
                    <div className="w-24 h-24 mb-8 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 001 4.5v4A1.5 1.5 0 002.5 10h6A1.5 1.5 0 0010 8.5v-4A1.5 1.5 0 008.5 3h-6zm11 2A1.5 1.5 0 0012 6.5v7a1.5 1.5 0 001.5 1.5h4a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0017.5 5h-4zm-10 7A1.5 1.5 0 002 13.5v2A1.5 1.5 0 003.5 17h6a1.5 1.5 0 001.5-1.5v-2A1.5 1.5 0 009.5 12h-6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Warehouse Management</h1>
                    <p className="text-xl text-blue-100 opacity-80 max-w-md text-center">Streamlined inventory control and logistics management for your business</p>

                    <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-md">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                            <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <span className="text-sm mt-2">Shipping</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                            <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm mt-2">Inventory</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                            <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm mt-2">Analytics</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel with login form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gradient-to-b from-navy-800 to-navy-950 p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo - Only visible on small screens */}
                    <div className="flex justify-center mb-8 lg:hidden">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl shadow-xl mb-3">
                                <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 001 4.5v4A1.5 1.5 0 002.5 10h6A1.5 1.5 0 0010 8.5v-4A1.5 1.5 0 008.5 3h-6zm11 2A1.5 1.5 0 0012 6.5v7a1.5 1.5 0 001.5 1.5h4a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0017.5 5h-4zm-10 7A1.5 1.5 0 002 13.5v2A1.5 1.5 0 003.5 17h6a1.5 1.5 0 001.5-1.5v-2A1.5 1.5 0 009.5 12h-6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white">Warehouse Portal</h1>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="login-form opacity-0 transition-all duration-700 ease-out translate-y-4">
                        <div className="bg-navy-800/40 backdrop-blur-xl px-8 py-10 shadow-2xl rounded-xl border border-white/10 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>

                            <h2 className="text-2xl font-medium text-white mb-2 text-center">Welcome Back</h2>
                            <p className="text-center text-gray-400 mb-8">Sign in to your warehouse account</p>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-blue-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-navy-600 bg-navy-700/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                        <div className="absolute inset-0 rounded-lg border border-blue-400/0 group-focus-within:border-blue-400/20 pointer-events-none"></div>
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-blue-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-navy-600 bg-navy-700/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <div className="absolute inset-0 rounded-lg border border-blue-400/0 group-focus-within:border-blue-400/20 pointer-events-none"></div>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-sm mt-2">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                            />
                                            <div className={`w-10 h-5 bg-navy-700 rounded-full shadow-inner ${data.remember ? 'bg-blue-600' : ''}`}></div>
                                            <div className={`absolute w-3 h-3 bg-white rounded-full transition top-1 ${data.remember ? 'left-6' : 'left-1'}`}></div>
                                        </div>
                                        <span className="ml-3 text-sm text-gray-300">Remember me</span>
                                    </label>
                                    <div className="text-sm">
                                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
                                >
                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 ease-out transform translate-y-0 group-hover:translate-y-full">
                                        {processing ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        {processing ? 'Signing in...' : 'Sign in to Dashboard'}
                                    </span>
                                </button>
                            </form>
                        </div>

                        <div className="text-center mt-6 text-sm text-gray-400">
                            <p>Secure Warehouse Management System</p>
                            <p className="mt-1">© {new Date().getFullYear()} All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                .bg-navy-800 {
                    background-color: #1a365d;
                }
                .bg-navy-700 {
                    background-color: #2a4365;
                }
                .bg-navy-900 {
                    background-color: #1a202c;
                }
                .bg-navy-950 {
                    background-color: #0f172a;
                }
                .border-navy-600 {
                    border-color: #2c5282;
                }

                .form-appear {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
}
