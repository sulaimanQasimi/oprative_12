import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import { Shield, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import Navigation from "@/Components/Admin/Navigation";
import BackButton from "@/Components/BackButton";

export default function CreatePermission({ auth }) {
    const { t } = useLaravelReactI18n();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        guard_name: 'web',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.permissions.store'));
    };

    return (
        <>
            <Head title={t("Create Permission")} />
            
            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                <Navigation auth={auth} currentRoute="admin.permissions" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/60 px-8 py-6 shadow-sm dark:shadow-slate-900/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                                        {t("Create Permission")}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {t("Add a new permission to the system")}
                                    </p>
                                </div>
                            </div>

                         <BackButton className="text-slate-700 dark:text-slate-200" link={route("admin.permissions.index")}/>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-8">
                        <Card className="max-w-2xl mx-auto border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    {t("Permission Details")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">{t("Permission Name")}</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t("Enter permission name (e.g., view_users, edit_posts)")}
                                            className="h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guard_name" className="text-slate-700 dark:text-slate-300">{t("Guard Name")}</Label>
                                        <Select value={data.guard_name} onValueChange={(value) => setData('guard_name', value)}>
                                            <SelectTrigger className="h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20">
                                                <SelectValue placeholder={t("Select guard")} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <SelectItem value="web" className="hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white">{t("Web")}</SelectItem>
                                                <SelectItem value="api" className="hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white">{t("API")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.guard_name && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.guard_name}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end space-x-4 pt-6">
                                        <Link className="text-slate-700 dark:text-slate-200" href={route("admin.permissions.index")}> 
                                            <Button type="button" variant="outline" className="border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 dark:text-white">
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <Save className="h-4 w-4" />
                                            {processing ? t("Creating...") : t("Create Permission")}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </>
    );
} 