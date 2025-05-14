import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import anime from "animejs";
import {
    Search,
    Plus,
    Truck,
    ChevronRight,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Eye,
    AlertCircle,
    Filter,
    ArrowUpDown,
    Phone,
    Mail,
    CreditCard,
    FileText,
    ShoppingBag,
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

export default function Index({ auth, suppliers = [] }) {
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

    // Filter suppliers based on search term
    const filteredSuppliers = suppliers
        ? suppliers.filter(
              (supplier) =>
                  (supplier?.name || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (supplier?.email || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (supplier?.phone || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (supplier?.tax_number || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
          )
        : [];

    // Sort suppliers
    const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
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
    }, [isAnimated, filteredSuppliers.length]);

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
            <Head title={t("Supplier Management")}>
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
                <Navigation auth={auth} currentRoute="admin.suppliers" />

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
                                    {t("Supplier Management")}
                                    <Badge
                                        variant="outline"
                                        className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 rounded-full"
                                    >
                                        {suppliers?.length || 0}
                                    </Badge>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.suppliers.create")}>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("Add Supplier")}
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
                                        placeholder={t("Search suppliers...")}
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

                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-1.5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                                        >
                                            <Filter className="h-3.5 w-3.5" />
                                            <span>{t("Filter")}</span>
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>

                            {searchTerm && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4 animate-pulse">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                    <p>
                                        {t("Showing results for:")}{" "}
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {searchTerm}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {/* Supplier Table */}
                            <Card
                                ref={tableRef}
                                className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden"
                            >
                                <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-5 py-3 grid grid-cols-12 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <div
                                        className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => handleSort("name")}
                                    >
                                        <span>{t("Supplier Name")}</span>
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                    <div
                                        className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => handleSort("email")}
                                    >
                                        <span>{t("Email")}</span>
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                    <div
                                        className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => handleSort("phone")}
                                    >
                                        <span>{t("Phone")}</span>
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                    <div
                                        className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => handleSort("tax_number")}
                                    >
                                        <span>{t("Tax Number")}</span>
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span>{t("Actions")}</span>
                                    </div>
                                </div>

                                {sortedSuppliers.length > 0 ? (
                                    <div>
                                        {sortedSuppliers.map(
                                            (supplier, index) => (
                                                <div
                                                    key={supplier?.id || index}
                                                    ref={(el) =>
                                                        (rowRefs.current[
                                                            index
                                                        ] = el)
                                                    }
                                                    className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 grid grid-cols-12 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                                                >
                                                    <div className="col-span-3 flex items-center gap-3">
                                                        <div className="h-9 w-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                                            <Truck className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-medium text-slate-900 dark:text-white truncate">
                                                                {supplier?.name || t("Unnamed Supplier")}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        {supplier?.email ? (
                                                            <>
                                                                <Mail className="h-4 w-4 text-slate-400" />
                                                                <span className="truncate">{supplier.email}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-400">---</span>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        {supplier?.phone ? (
                                                            <>
                                                                <Phone className="h-4 w-4 text-slate-400" />
                                                                <span className="truncate">{supplier.phone}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-400">---</span>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        {supplier?.tax_number ? (
                                                            <>
                                                                <FileText className="h-4 w-4 text-slate-400" />
                                                                <span className="truncate">{supplier.tax_number}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-400">---</span>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 flex justify-end gap-1">
                                                        <Link
                                                            href={route(
                                                                "admin.suppliers.show",
                                                                supplier?.id
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin.suppliers.edit",
                                                                supplier?.id
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin.suppliers.destroy",
                                                                supplier?.id
                                                            )}
                                                            method="delete"
                                                            as="button"
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-5">
                                            <Truck className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                            {t("No suppliers found")}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                            {searchTerm
                                                ? t(
                                                      "Try adjusting your search criteria or check for typos."
                                                  )
                                                : t(
                                                      "No suppliers have been added yet. Add your first supplier to get started."
                                                  )}
                                        </p>
                                        <Link
                                            href={route(
                                                "admin.suppliers.create"
                                            )}
                                        >
                                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                <Plus className="h-4 w-4 mr-2" />
                                                {t("Add First Supplier")}
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
