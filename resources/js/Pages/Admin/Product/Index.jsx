import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import anime from "animejs";
import {
    Search,
    Plus,
    Package,
    ChevronRight,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Star,
    AlertCircle,
    Filter,
    ArrowUpDown,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";

export default function Index({ auth, products = [] }) {
    const { t } = useLaravelReactI18n();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    // Refs for animation targets
    const headerRef = useRef(null);
    const tableRef = useRef(null);
    const rowRefs = useRef([]);

    // Filter products based on search term
    const filteredProducts = products
        ? products.filter(
              (product) =>
                  (product?.name || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (product?.barcode || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (product?.type || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
          )
        : [];

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

        if (aValue < bValue) {
            return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
    });

    // Sort handler
    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Initialize animations
    useEffect(() => {
        if (!isAnimated) {
            // Animate header
            anime({
                targets: headerRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600,
                easing: "easeOutExpo",
            });

            // Animate table
            anime({
                targets: tableRef.current,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 700,
                easing: "easeOutExpo",
                delay: 200,
            });

            // Animate rows with stagger
            anime({
                targets: rowRefs.current,
                opacity: [0, 1],
                translateX: [-20, 0],
                delay: anime.stagger(50),
                duration: 500,
                easing: "easeOutExpo",
                begin: () => setIsAnimated(true),
            });
        }
    }, [isAnimated, filteredProducts.length]);

    // Reset animation state when search or sort changes
    useEffect(() => {
        setIsAnimated(false);
        // Clear refs
        rowRefs.current = [];
    }, [searchTerm, sortField, sortDirection]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={t("Product Management")}>
                <style>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }

                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
                        background-size: 14px 14px;
                    }

                    .dark .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    }
                `}</style>
            </Head>

            <PageLoader isVisible={loading} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Sidebar */}
                <Navigation auth={auth} currentRoute="admin.products" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header
                        ref={headerRef}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {t("Admin Panel")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Product Management")}
                                    <Badge
                                        variant="outline"
                                        className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 rounded-full"
                                    >
                                        {products?.length || 0}
                                    </Badge>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.products.create")}>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("Add Product")}
                                </Button>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full md:w-96 relative"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t("Search products...")}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    {searchTerm && (
                                        <button
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 6 6 18"></path>
                                                <path d="m6 6 12 12"></path>
                                            </svg>
                                        </button>
                                    )}
                                </motion.div>
                            </div>

                            {/* Products Table */}
                            <div
                                ref={tableRef}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort("name")
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>{t("Name")}</span>
                                                        <ArrowUpDown className="h-4 w-4" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort("type")
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>{t("Type")}</span>
                                                        <ArrowUpDown className="h-4 w-4" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort("barcode")
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>{t("Barcode")}</span>
                                                        <ArrowUpDown className="h-4 w-4" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort("purchase_price")
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>{t("Purchase Price")}</span>
                                                        <ArrowUpDown className="h-4 w-4" />
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort("retail_price")
                                                    }
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>{t("Retail Price")}</span>
                                                        <ArrowUpDown className="h-4 w-4" />
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    {t("Status")}
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    {t("Actions")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                            {sortedProducts.map((product, index) => (
                                                <tr
                                                    key={product.id}
                                                    ref={(el) =>
                                                        (rowRefs.current[index] = el)
                                                    }
                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                                                <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                    {product.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-900 dark:text-white">
                                                            {product.type}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-900 dark:text-white">
                                                            {product.barcode}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-900 dark:text-white">
                                                            ${product.purchase_price}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-900 dark:text-white">
                                                            ${product.retail_price}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {product.is_activated && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                                >
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    {t("Active")}
                                                                </Badge>
                                                            )}
                                                            {product.is_in_stock && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                                                                >
                                                                    <Package className="h-3 w-3 mr-1" />
                                                                    {t("In Stock")}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "admin.products.edit",
                                                                    product.id
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "admin.products.destroy",
                                                                    product.id
                                                                )}
                                                                method="delete"
                                                                as="button"
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
