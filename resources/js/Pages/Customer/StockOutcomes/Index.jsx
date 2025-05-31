import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import CustomerNavbar from "@/Components/CustomerNavbar";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Package,
    Search,
    RefreshCw,
    Eye,
    Calendar,
    DollarSign,
    Filter,
    Receipt,
    CircleDollarSign,
    PackageX,
} from "lucide-react";

export default function StockOutcomesIndex({
    auth,
    stockOutcomes = { data: [], links: [], total: 0 },
    filters = {},
    products = [],
    statistics = {},
}) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        product: filters.product || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route("customer.stock-outcomes.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: "",
            product: "",
            date_from: "",
            date_to: "",
        });
        get(route("customer.stock-outcomes.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={t("Stock Outcomes")} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden max-w-full">
                {/* Sidebar */}
                <CustomerNavbar
                    auth={auth || { user: { name: "Customer" } }}
                    currentRoute="customer.stock-outcomes.index"
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden max-w-full">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-0.5">
                                    {t("Customer Portal")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <PackageX className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    {t("Stock Outcomes")}
                                </h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Hero Section */}
                                <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-red-500 rounded-2xl shadow-xl p-10 mb-10 overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                                {t("Stock Outcomes Management")}
                                            </h1>
                                            <p className="text-red-100 text-lg max-w-2xl">
                                                {t(
                                                    "Track all product removals from your inventory in one secure place."
                                                )}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 shadow-lg">
                                            <PackageX className="h-16 w-16 text-white opacity-80" />
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-300">
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                                        <Filter className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
                                        {t("Quick Filters")}
                                    </h3>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="grid gap-4 md:grid-cols-3 items-end"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {t("Reference")}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Search className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="search"
                                                    value={data.search}
                                                    onChange={(e) =>
                                                        setData(
                                                            "search",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 h-9"
                                                    placeholder={t(
                                                        "Search by reference"
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex space-x-3 md:justify-start">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-3 py-0 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-xs font-medium rounded-md border border-red-400/20 shadow-sm hover:shadow hover:translate-y-[-1px] transition-all duration-200 flex items-center justify-center min-w-[70px] h-9 focus:ring-2 focus:ring-red-500/40 focus:outline-none disabled:opacity-70"
                                            >
                                                <Search className="h-3 w-3 mr-1.5 rtl:ml-1.5 rtl:mr-0 flex-shrink-0" />
                                                <span>{t("Search")}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="px-3 py-0 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white text-xs font-medium rounded-md border border-slate-400/20 shadow-sm hover:shadow hover:translate-y-[-1px] transition-all duration-200 flex items-center justify-center min-w-[70px] h-9 focus:ring-2 focus:ring-slate-500/40 focus:outline-none"
                                            >
                                                <RefreshCw className="h-3 w-3 mr-1.5 rtl:ml-1.5 rtl:mr-0 flex-shrink-0 animate-pulse" />
                                                <span>{t("Reset")}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Stock Outcomes Table */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-8">
                                    <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                            <Package className="h-6 w-6 mr-2 text-red-600 dark:text-red-400" />
                                            {t("Stock Outcome Records")}
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
                                                    <th
                                                        scope="col"
                                                        className="px-8 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                                                    >
                                                        {t("Reference")}
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                                                    >
                                                        {t("Product")}
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                                                    >
                                                        {t("Quantity")}
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                                                    >
                                                        {t("Date")}
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider pr-8"
                                                    >
                                                        {t("Actions")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800">
                                                {stockOutcomes?.data?.length ===
                                                0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan="5"
                                                            className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                                        >
                                                            <div className="flex flex-col items-center justify-center">
                                                                <PackageX className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                                                                <p className="text-lg font-medium">
                                                                    {t(
                                                                        "No stock outcomes found"
                                                                    )}
                                                                </p>
                                                                <p className="text-sm mt-1">
                                                                    {t(
                                                                        "Try adjusting your search or filter to find what you are looking for."
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    stockOutcomes.data.map(
                                                        (outcome) => (
                                                            <tr
                                                                key={outcome.id}
                                                                className="hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-all duration-300"
                                                            >
                                                                <td className="px-8 py-5 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        {
                                                                            outcome.reference_number
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-5 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        {outcome
                                                                            .product
                                                                            ?.name ||
                                                                            "N/A"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        {
                                                                            outcome.quantity
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        {new Date(
                                                                            outcome.created_at
                                                                        ).toLocaleDateString()}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                                                    <Link
                                                                        href={route(
                                                                            "customer.stock-outcomes.show",
                                                                            outcome.id
                                                                        )}
                                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md text-white bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-1.5" />
                                                                        {t(
                                                                            "View"
                                                                        )}
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
