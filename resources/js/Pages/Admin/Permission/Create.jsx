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
                    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/30 dark:border-slate-700/50 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                                        {t("Create Permission")}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {t("Add a new permission to the system")}
                                    </p>
                                </div>
                            </div>

                         <BackButton className="dark:text-white text-black" link={route("admin.permissions.index")}/>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-8">
                        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                    {t("Permission Details")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 dark:text-white">
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t("Permission Name")}</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t("Enter permission name (e.g., view_users, edit_posts)")}
                                            className="h-12"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guard_name">{t("Guard Name")}</Label>
                                        <Select value={data.guard_name} onValueChange={(value) => setData('guard_name', value)}>
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder={t("Select guard")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="web">{t("Web")}</SelectItem>
                                                <SelectItem value="api">{t("API")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.guard_name && (
                                            <p className="text-sm text-red-600">{errors.guard_name}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end space-x-4 pt-6">
                                        <Link className="dark:text-white" href={route("admin.permissions.index")}>
                                            <Button type="button" variant="outline">
                                                {t("Cancel")}
                                            </Button>
                                        </Link>
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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