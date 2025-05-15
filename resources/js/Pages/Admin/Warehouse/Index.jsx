import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { motion } from "framer-motion";
import {
    Building2,
    Plus,
    Search,
    ArrowUpDown,
    Edit,
    Trash2,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import Navigation from "@/Components/Admin/Navigation";
import PageLoader from "@/Components/Admin/PageLoader";
import anime from "animejs";

export default function Index({ auth, warehouses }) {
    const { t } = useLaravelReactI18n();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    // Filter warehouses based on search term
    const filteredWarehouses = warehouses.filter((warehouse) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            warehouse.name.toLowerCase().includes(searchLower) ||
            warehouse.code.toLowerCase().includes(searchLower) ||
            (warehouse.description && warehouse.description.toLowerCase().includes(searchLower))
        );
    });

    // Sort warehouses
    const sortedWarehouses = [...filteredWarehouses].sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        if (sortField === "name") {
            return direction * a.name.localeCompare(b.name);
        }
        if (sortField === "code") {
            return direction * a.code.localeCompare(b.code);
        }
        if (sortField === "status") {
            return direction * (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1);
        }
        return 0;
    });

    // Animation effects
    useEffect(() => {
        const headerAnimation = anime({
            targets: ".header-content",
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 800,
            easing: "easeOutExpo",
        });

        const tableAnimation = anime({
            targets: ".table-content",
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 800,
            delay: 200,
            easing: "easeOutExpo",
        });

        return () => {
            headerAnimation.pause();
            tableAnimation.pause();
        };
    }, []);

    // Reset animations when search or sort changes
    useEffect(() => {
        const rowAnimation = anime({
            targets: ".warehouse-row",
            translateX: [-20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: "easeOutExpo",
        });

        return () => rowAnimation.pause();
    }, [searchTerm, sortField, sortDirection]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleDelete = (id) => {
        if (confirm(t("Are you sure you want to delete this warehouse?"))) {
            router.delete(route("admin.warehouses.destroy", id));
        }
    };

    return (
        <>
            <Head title={t("Warehouses")}>
                <style>{`
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
                <Navigation auth={auth} currentRoute="admin.warehouses" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                    {t("Admin Panel")}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {t("Warehouses")}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link href={route("admin.warehouses.create")}>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("Add Warehouse")}
                                </Button>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content Container */}
                    <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="p-6">
                            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-indigo-500" />
                                        {t("Warehouse List")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {/* Search and Sort */}
                                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="text"
                                                placeholder={t("Search warehouses...")}
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(e.target.value)
                                                }
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSortField("name");
                                                    setSortDirection(
                                                        sortDirection === "asc"
                                                            ? "desc"
                                                            : "asc"
                                                    );
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowUpDown className="h-4 w-4" />
                                                {t("Name")}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSortField("code");
                                                    setSortDirection(
                                                        sortDirection === "asc"
                                                            ? "desc"
                                                            : "asc"
                                                    );
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowUpDown className="h-4 w-4" />
                                                {t("Code")}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSortField("status");
                                                    setSortDirection(
                                                        sortDirection === "asc"
                                                            ? "desc"
                                                            : "asc"
                                                    );
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowUpDown className="h-4 w-4" />
                                                {t("Status")}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                                                        {t("Name")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                                                        {t("Code")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                                                        {t("Description")}
                                                    </th>
                                                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                                                        {t("Status")}
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                                                        {t("Actions")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedWarehouses.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan="5"
                                                            className="text-center py-8 text-slate-500 dark:text-slate-400"
                                                        >
                                                            {t(
                                                                "No warehouses found."
                                                            )}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    sortedWarehouses.map(
                                                        (warehouse) => (
                                                            <tr
                                                                key={warehouse.id}
                                                                className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 warehouse-row"
                                                            >
                                                                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                                                                    {warehouse.name}
                                                                </td>
                                                                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                                                                    {warehouse.code}
                                                                </td>
                                                                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                                                                    {warehouse.description ||
                                                                        "-"}
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <Badge
                                                                        variant={
                                                                            warehouse.is_active
                                                                                ? "success"
                                                                                : "destructive"
                                                                        }
                                                                    >
                                                                        {warehouse.is_active
                                                                            ? t(
                                                                                  "Active"
                                                                              )
                                                                            : t(
                                                                                  "Inactive"
                                                                              )}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    <div className="flex justify-end space-x-2">
                                                                        <Link href={route("admin.warehouses.show", warehouse.id)}>
                                                                            <Button variant="ghost" size="sm" className="h-8 px-2">
                                                                                {t("View")}
                                                                            </Button>
                                                                        </Link>
                                                                        <Link href={route("admin.warehouses.edit", warehouse.id)}>
                                                                            <Button variant="ghost" size="sm" className="h-8 px-2">
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                            onClick={() => handleDelete(warehouse.id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
