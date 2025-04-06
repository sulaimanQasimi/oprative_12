import React from 'react';
import { Link } from '@inertiajs/react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white/90 backdrop-blur-sm shadow-md fixed w-full z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-xl font-bold text-white">YB</span>
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">YourBrand</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link>
                            <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</Link>
                            <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</Link>
                            <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">Login</Link>
                            <Link href="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10"></div>
                <div className="absolute -right-80 -top-80 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-3xl -z-10"></div>
                <div className="absolute -left-80 top-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-indigo-100/40 to-blue-100/40 blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                            <span className="block">Transform Your Business</span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">With Our Solutions</span>
                        </h1>
                        <p className="mt-6 max-w-md mx-auto text-xl text-gray-600 sm:max-w-3xl">
                            Streamline your operations, boost productivity, and drive growth with our innovative platform.
                        </p>
                        <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
                            <div className="rounded-md shadow">
                                <Link href="/register" className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 md:text-lg md:px-10">
                                    Get Started
                                </Link>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                <Link href="/contact" className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors md:text-lg md:px-10">
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                            Everything you need to succeed
                        </h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            Comprehensive solutions for your business needs
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-gray-900">Lightning Fast</h3>
                            <p className="mt-3 text-gray-600 leading-relaxed">
                                Experience blazing fast performance with our optimized platform designed for speed and efficiency.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-gray-900">Secure & Reliable</h3>
                            <p className="mt-3 text-gray-600 leading-relaxed">
                                Your data is protected with enterprise-grade security measures and our reliable infrastructure.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-gray-900">Analytics & Insights</h3>
                            <p className="mt-3 text-gray-600 leading-relaxed">
                                Make data-driven decisions with powerful analytics tools that provide actionable insights.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-700 -z-10"></div>
                <div className="absolute -right-40 -bottom-40 w-80 h-80 rounded-full bg-indigo-500 opacity-20 blur-3xl -z-10"></div>
                <div className="absolute -left-40 top-10 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            <span className="block mb-1">Ready to get started?</span>
                            <span className="block text-indigo-200">Start your free trial today.</span>
                        </h2>
                        <p className="mt-4 text-lg text-indigo-100 max-w-lg">
                            Join thousands of businesses that trust our platform to drive their growth and efficiency.
                        </p>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0 space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="inline-flex rounded-md shadow">
                            <Link href="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-colors">
                                Get started
                            </Link>
                        </div>
                        <div className="inline-flex">
                            <Link href="/demo" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-800/30 hover:bg-indigo-800/40 transition-colors">
                                Request a demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">YB</span>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">YourBrand</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-2 mb-4">
                                Empowering businesses with innovative solutions since 2020.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-3">
                                <li><Link href="/about" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">About</Link></li>
                                <li><Link href="/careers" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Careers</Link></li>
                                <li><Link href="/contact" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
                            <ul className="mt-4 space-y-3">
                                <li><Link href="/blog" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Blog</Link></li>
                                <li><Link href="/documentation" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Documentation</Link></li>
                                <li><Link href="/support" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Support</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-3">
                                <li><Link href="/privacy" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Terms</Link></li>
                                <li><Link href="/security" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Security</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-100 pt-8">
                        <p className="text-sm text-gray-400 text-center">
                            © 2024 YourBrand. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
