import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Edit,
    Trash2,
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Badge,
    Calendar,
    Users,
    Contact,
    Fingerprint,
    Eye,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge as UIBadge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";

export default function Show({ auth, employee, fingerprints = [], biometric = null }) {
    const { t } = useLaravelReactI18n();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleDelete = () => {
        if (confirm(t("Are you sure you want to delete this employee?"))) {
            router.delete(route("admin.employees.destroy", employee.id));
        }
    };

    return (
        <>
            <Head title={`${employee.first_name} ${employee.last_name} - ${t("Employee Details")}`} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
                <Navigation auth={auth} currentRoute="admin.employees" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route("admin.employees.index")}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {employee.first_name} {employee.last_name}
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {employee.department} • {employee.employee_id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {biometric ? (
                                        <Link href={route("admin.employees.biometric.edit", employee.id)}>
                                            <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20">
                                                <Fingerprint className="h-4 w-4 mr-2" />
                                                {t("Edit Biometric")}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href={route("admin.employees.biometric.create", employee.id)}>
                                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20">
                                                <Fingerprint className="h-4 w-4 mr-2" />
                                                {t("Add Biometric")}
                                            </Button>
                                        </Link>
                                    )}
                                    <Link href={route("admin.employees.edit", employee.id)}>
                                        <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <Edit className="h-4 w-4 mr-2" />
                                            {t("Edit")}
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t("Delete")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* Employee Overview */}
                            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200 dark:border-slate-700">
                                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        {t("Employee Overview")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-6">
                                        <div className="flex-shrink-0">
                                            {employee.photo ? (
                                                <img
                                                    className="h-24 w-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600"
                                                    src={`/storage/${employee.photo}`}
                                                    alt={`${employee.first_name} ${employee.last_name}`}
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center border-4 border-slate-200 dark:border-slate-600">
                                                    <User className="h-12 w-12 text-slate-500 dark:text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Full Name")}
                                                </p>
                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {employee.first_name} {employee.last_name}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <Badge className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Employee ID")}
                                                </p>
                                                <UIBadge variant="secondary" className="text-sm">
                                                    {employee.employee_id}
                                                </UIBadge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <Badge className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Taskra ID")}
                                                </p>
                                                <UIBadge variant="outline" className="text-sm">
                                                    {employee.taskra_id || "N/A"}
                                                </UIBadge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <Building className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Department")}
                                                </p>
                                                <UIBadge variant="default" className="text-sm">
                                                    {employee.department}
                                                </UIBadge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Email")}
                                                </p>
                                                <p className="text-slate-900 dark:text-white">
                                                    {employee.email || "N/A"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Created")}
                                                </p>
                                                <p className="text-slate-900 dark:text-white text-sm">
                                                    {formatDate(employee.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Contact Information */}
                                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                                            <Contact className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            {t("Contact Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {t("Phone")}
                                                    </p>
                                                    <p className="text-slate-900 dark:text-white">
                                                        {employee.contact_info?.phone || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {t("Mobile")}
                                                    </p>
                                                    <p className="text-slate-900 dark:text-white">
                                                        {employee.contact_info?.mobile || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {t("Address")}
                                                    </p>
                                                    <p className="text-slate-900 dark:text-white">
                                                        {employee.contact_info?.address || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Emergency Contact */}
                                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                                            <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                            {t("Emergency Contact")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {t("Name")}
                                                    </p>
                                                    <p className="text-slate-900 dark:text-white">
                                                        {employee.contact_info?.emergency_contact?.name || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {t("Phone")}
                                                    </p>
                                                    <p className="text-slate-900 dark:text-white">
                                                        {employee.contact_info?.emergency_contact?.phone || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {t("Relationship")}
                                                    </p>
                                                    <UIBadge variant="outline" className="text-sm">
                                                        {employee.contact_info?.emergency_contact?.relationship || "N/A"}
                                                    </UIBadge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Fingerprints */}
                            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-slate-200 dark:border-slate-700">
                                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                                        <Fingerprint className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        {t("Fingerprints")} ({fingerprints.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {fingerprints.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {fingerprints.map((fingerprint) => (
                                                <div
                                                    key={fingerprint.id}
                                                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <UIBadge variant="secondary" className="text-xs">
                                                            {fingerprint.finger_position}
                                                        </UIBadge>
                                                        <UIBadge 
                                                            variant={fingerprint.quality_score >= 80 ? "default" : fingerprint.quality_score >= 60 ? "secondary" : "destructive"}
                                                            className="text-xs"
                                                        >
                                                            {fingerprint.quality_score}%
                                                        </UIBadge>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500 dark:text-slate-400">{t("Template Size")}:</span>
                                                            <span className="text-slate-900 dark:text-white">{fingerprint.template_size} bytes</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500 dark:text-slate-400">{t("Created")}:</span>
                                                            <span className="text-slate-900 dark:text-white">
                                                                {new Date(fingerprint.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Fingerprint className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                                {t("No fingerprints registered")}
                                            </p>
                                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                                                {t("Fingerprints will appear here once they are registered for this employee.")}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Activity Log */}
                            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-b border-slate-200 dark:border-slate-700">
                                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                                        <Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                        {t("Record Information")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    {t("Created At")}
                                                </p>
                                                <p className="text-slate-900 dark:text-white">
                                                    {formatDate(employee.created_at)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    {t("Last Updated")}
                                                </p>
                                                <p className="text-slate-900 dark:text-white">
                                                    {formatDate(employee.updated_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    {t("Record ID")}
                                                </p>
                                                <UIBadge variant="outline" className="text-sm">
                                                    #{employee.id}
                                                </UIBadge>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    {t("Total Fingerprints")}
                                                </p>
                                                <UIBadge variant="secondary" className="text-sm">
                                                    {fingerprints.length} {t("registered")}
                                                </UIBadge>
                                            </div>
                                        </div>
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