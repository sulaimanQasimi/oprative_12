import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import CustomerNavbar from "@/Components/CustomerNavbar";

export default function CustomerDashboard({ auth, stats = {} }) {
    const { t } = useLaravelReactI18n();
    
    // Make sure stats is an object
    const safeStats = typeof stats === "object" && stats !== null ? stats : {};

    // Default stats if not provided
    const defaultStats = {
        total_income: 0,
        total_outcome: 0, 
        total_income_quantity: 0,
        total_outcome_quantity: 0,
        net_quantity: 0,
        net_value: 0,
        top_products: [],
        monthly_stock_data: [],
        stock_distribution: [],
        recent_movements: [],
        filters: {
            date_from: null,
            date_to: null
        }
    };

    // Merge provided stats with defaults
    const mergedStats = {
        ...defaultStats,
        ...safeStats,
    };

    // Format currency values
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(value);
    };

    return (
        <>
            <Head title={t("Customer Dashboard")} />
            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.dashboard"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Dashboard Overview")}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-7xl mx-auto">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-lg font-medium mb-4">{t("Total Stock In")}</h2>
                                    <p className="text-3xl font-bold mb-2">{mergedStats.total_income_quantity}</p>
                                    <p>{formatCurrency(mergedStats.total_income)}</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-lg font-medium mb-4">{t("Total Stock Out")}</h2>
                                    <p className="text-3xl font-bold mb-2">{mergedStats.total_outcome_quantity}</p>
                                    <p>{formatCurrency(mergedStats.total_outcome)}</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-lg font-medium mb-4">{t("Net Stock")}</h2>
                                    <p className="text-3xl font-bold mb-2">{mergedStats.net_quantity}</p>
                                    <p>{t("Current stock level")}</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-lg font-medium mb-4">{t("Net Value")}</h2>
                                    <p className="text-3xl font-bold mb-2">{formatCurrency(mergedStats.net_value)}</p>
                                    <p>{t("Total inventory value")}</p>
                                </div>
                            </div>
                            
                            {/* Top Products */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 mb-8">
                                <h2 className="text-xl font-bold mb-4">{t("Top Products")}</h2>
                                {mergedStats.top_products && mergedStats.top_products.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-2">{t("Product")}</th>
                                                    <th className="text-right p-2">{t("Stock In")}</th>
                                                    <th className="text-right p-2">{t("Stock Out")}</th>
                                                    <th className="text-right p-2">{t("Net")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mergedStats.top_products.map((product) => (
                                                    <tr key={product.id} className="border-b hover:bg-slate-50">
                                                        <td className="p-2">{product.name}</td>
                                                        <td className="text-right p-2">{product.income_quantity}</td>
                                                        <td className="text-right p-2">{product.outcome_quantity}</td>
                                                        <td className="text-right p-2 font-medium">{product.net_quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">{t("No products data available")}</p>
                                )}
                            </div>
                            
                            {/* Recent Movements */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">{t("Recent Stock Movements")}</h2>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route("customer.stock-incomes.index")}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                        >
                                            {t("View All Incoming")}
                                        </Link>
                                        <Link
                                            href={route("customer.stock-outcomes.index")}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                        >
                                            {t("View All Outgoing")}
                                        </Link>
                                    </div>
                                </div>
                                
                                {mergedStats.recent_movements && mergedStats.recent_movements.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-2">{t("Type")}</th>
                                                    <th className="text-left p-2">{t("Product")}</th>
                                                    <th className="text-center p-2">{t("Quantity")}</th>
                                                    <th className="text-right p-2">{t("Total")}</th>
                                                    <th className="text-right p-2">{t("Date")}</th>
                                                    <th className="text-right p-2">{t("Reference")}</th>
                                                    <th className="text-right p-2">{t("Actions")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mergedStats.recent_movements.map((movement) => (
                                                    <tr key={`${movement.type}-${movement.id}`} className="border-b hover:bg-slate-50">
                                                        <td className="p-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                movement.type === 'income' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {movement.type === 'income' ? t('In') : t('Out')}
                                                            </span>
                                                        </td>
                                                        <td className="p-2">{movement.product}</td>
                                                        <td className="text-center p-2">{movement.quantity}</td>
                                                        <td className="text-right p-2">{formatCurrency(movement.total)}</td>
                                                        <td className="text-right p-2">{movement.date}</td>
                                                        <td className="text-right p-2">{movement.reference}</td>
                                                        <td className="text-right p-2">
                                                            <Link
                                                                href={route(
                                                                    movement.type === 'income' 
                                                                        ? 'customer.stock-incomes.show' 
                                                                        : 'customer.stock-outcomes.show',
                                                                    movement.id
                                                                )}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {t("View")}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">{t("No recent stock movements")}</p>
                                        <Link
                                            href={route("customer.stock-incomes.create")}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                        >
                                            {t("Add Stock")}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 