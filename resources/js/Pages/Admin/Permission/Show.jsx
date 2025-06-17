// Show Permission Component

import React from "react";
import { Head, Link } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Shield, ArrowLeft, Edit, Calendar, Key, Crown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";

export default function ShowPermission({ auth, permission }) {
    const { t } = useLaravelReactI18n();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head title={`${t("Permission")}: ${permission.name}`} />
            
            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                <Navigation auth={auth} currentRoute="admin.permissions" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/30 dark:border-slate-700/50 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                                        {t("Permission Details")}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {t("View permission information")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Link href={route("admin.permissions.index")}>
                                    <Button variant="outline" className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t("Back to Permissions")}
                                    </Button>
                                </Link>
                                <Link href={route("admin.permissions.edit", permission.id)}>
                                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                        <Edit className="h-4 w-4" />
                                        {t("Edit Permission")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-8">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Permission Overview */}
                            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                            <Shield className="h-5 w-5 text-white" />
                                        </div>
                                        {t("Permission Overview")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                                                {t("Permission Name")}
                                            </label>
                                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                        {permission.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {t("Permission identifier")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                                                {t("Guard Name")}
                                            </label>
                                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                <div className={`p-2 rounded-lg ${permission.guard_name === 'web' 
                                                    ? 'bg-green-100 dark:bg-green-900/30' 
                                                    : 'bg-purple-100 dark:bg-purple-900/30'
                                                }`}>
                                                    {permission.guard_name === 'web' ? (
                                                        <Key className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-sm ${
                                                            permission.guard_name === 'web'
                                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                                                : "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                                                        }`}
                                                    >
                                                        {permission.guard_name}
                                                    </Badge>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {permission.guard_name === 'web' ? t("Web application guard") : t("API guard")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Permission Metadata */}
                            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        {t("Metadata")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                                                {t("Permission ID")}
                                            </label>
                                            <p className="text-lg font-semibold text-slate-800 dark:text-white">
                                                #{permission.id}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                                                {t("Created At")}
                                            </label>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                {formatDate(permission.created_at)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                                                {t("Updated At")}
                                            </label>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                {formatDate(permission.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                        {t("Actions")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <Link href={route("admin.permissions.edit", permission.id)}>
                                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                                <Edit className="h-4 w-4" />
                                                {t("Edit Permission")}
                                            </Button>
                                        </Link>
                                        <Link href={route("admin.permissions.index")}>
                                            <Button variant="outline" className="gap-2">
                                                <ArrowLeft className="h-4 w-4" />
                                                {t("Back to List")}
                                            </Button>
                                        </Link>
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
