import React from 'react';
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

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <Head title="Warehouse Login" />

            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Warehouse Portal</h1>
                </div>

                <div className="bg-white px-8 py-10 shadow-md rounded-lg">
                    <h2 className="text-2xl font-medium text-gray-800 mb-6 text-center">Sign In</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your.email@example.com"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-700">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>Warehouse Management System</p>
                </div>
            </div>
        </div>
    );
}
