import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Save,
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Badge,
    Camera,
    Users,
    Contact,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import Navigation from "@/Components/Admin/Navigation";

export default function Edit({ auth, employee }) {
    const { t } = useLaravelReactI18n();
    const [photoPreview, setPhotoPreview] = useState(
        employee.photo ? `/storage/${employee.photo}` : null
    );
    
    const { data, setData, put, processing, errors, reset } = useForm({
        photo: null,
        taskra_id: employee.taskra_id || "",
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        employee_id: employee.employee_id || "",
        department: employee.department || "",
        email: employee.email || "",
        contact_info: {
            phone: employee.contact_info?.phone || "",
            mobile: employee.contact_info?.mobile || "",
            address: employee.contact_info?.address || "",
            emergency_contact: {
                name: employee.contact_info?.emergency_contact?.name || "",
                phone: employee.contact_info?.emergency_contact?.phone || "",
                relationship: employee.contact_info?.emergency_contact?.relationship || "",
            },
        },
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("photo", file);
            const reader = new FileReader();
            reader.onload = (e) => setPhotoPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleContactInfoChange = (field, value) => {
        setData("contact_info", {
            ...data.contact_info,
            [field]: value,
        });
    };

    const handleEmergencyContactChange = (field, value) => {
        setData("contact_info", {
            ...data.contact_info,
            emergency_contact: {
                ...data.contact_info.emergency_contact,
                [field]: value,
            },
        });
    };

    function submit(e) {
        e.preventDefault();
        put(route("admin.employees.update", employee.id));
    }

    const departments = [
        "Human Resources",
        "Information Technology",
        "Finance",
        "Marketing",
        "Operations",
        "Sales",
        "Customer Service",
        "Research & Development",
        "Quality Assurance",
        "Administration"
    ];

    const relationships = [
        "Spouse",
        "Parent",
        "Sibling",
        "Child",
        "Friend",
        "Relative",
        "Other"
    ];

    return (
        <>
            <Head title={t("Edit Employee")} />

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
                                            {t("Edit Employee")}
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {t("Update employee information")} - {employee.first_name} {employee.last_name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-4xl mx-auto">
                            <form onSubmit={submit} className="space-y-8">
                                {/* Photo Upload */}
                                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                                            <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            {t("Employee Photo")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-6">
                                            <div className="flex-shrink-0">
                                                {photoPreview ? (
                                                    <img
                                                        className="h-20 w-20 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600"
                                                        src={photoPreview}
                                                        alt="Preview"
                                                    />
                                                ) : (
                                                    <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center border-4 border-slate-200 dark:border-slate-600">
                                                        <User className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor="photo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    {t("Upload New Photo")}
                                                </Label>
                                                <Input
                                                    id="photo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                />
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    {t("JPG, PNG, GIF up to 2MB. Leave empty to keep current photo.")}
                                                </p>
                                                {errors.photo && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.photo}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Basic Information */}
                                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                                            <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            {t("Basic Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="taskra_id" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <Badge className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Taskra ID")}
                                                </Label>
                                                <Input
                                                    id="taskra_id"
                                                    type="text"
                                                    value={data.taskra_id}
                                                    placeholder={t("Enter Taskra ID")}
                                                    onChange={(e) => setData("taskra_id", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors.taskra_id && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.taskra_id}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="employee_id" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <Badge className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Employee ID")}
                                                </Label>
                                                <Input
                                                    id="employee_id"
                                                    type="text"
                                                    value={data.employee_id}
                                                    placeholder={t("Enter Employee ID")}
                                                    onChange={(e) => setData("employee_id", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors.employee_id && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.employee_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="first_name" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("First Name")}
                                                </Label>
                                                <Input
                                                    id="first_name"
                                                    type="text"
                                                    value={data.first_name}
                                                    placeholder={t("Enter first name")}
                                                    onChange={(e) => setData("first_name", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors.first_name && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.first_name}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="last_name" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Last Name")}
                                                </Label>
                                                <Input
                                                    id="last_name"
                                                    type="text"
                                                    value={data.last_name}
                                                    placeholder={t("Enter last name")}
                                                    onChange={(e) => setData("last_name", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors.last_name && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.last_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="department" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <Building className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Department")}
                                                </Label>
                                                <select
                                                    id="department"
                                                    value={data.department}
                                                    onChange={(e) => setData("department", e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-transparent dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 transition-all duration-200"
                                                >
                                                    <option value="">{t("Select Department")}</option>
                                                    {departments.map((dept) => (
                                                        <option key={dept} value={dept}>
                                                            {dept}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.department && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.department}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Email Address")}
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    placeholder={t("Enter email address")}
                                                    onChange={(e) => setData("email", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors.email && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact Information */}
                                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                                            <Contact className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            {t("Contact Information")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Phone Number")}
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.contact_info.phone}
                                                    placeholder={t("Enter phone number")}
                                                    onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors["contact_info.phone"] && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors["contact_info.phone"]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Mobile Number")}
                                                </Label>
                                                <Input
                                                    id="mobile"
                                                    type="tel"
                                                    value={data.contact_info.mobile}
                                                    placeholder={t("Enter mobile number")}
                                                    onChange={(e) => handleContactInfoChange("mobile", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors["contact_info.mobile"] && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors["contact_info.mobile"]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                {t("Address")}
                                            </Label>
                                            <Textarea
                                                id="address"
                                                value={data.contact_info.address}
                                                placeholder={t("Enter full address")}
                                                onChange={(e) => handleContactInfoChange("address", e.target.value)}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                rows={3}
                                            />
                                            {errors["contact_info.address"] && (
                                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors["contact_info.address"]}
                                                </div>
                                            )}
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
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="emergency_name" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Contact Name")}
                                                </Label>
                                                <Input
                                                    id="emergency_name"
                                                    type="text"
                                                    value={data.contact_info.emergency_contact.name}
                                                    placeholder={t("Enter emergency contact name")}
                                                    onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors["contact_info.emergency_contact.name"] && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors["contact_info.emergency_contact.name"]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="emergency_phone" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    {t("Contact Phone")}
                                                </Label>
                                                <Input
                                                    id="emergency_phone"
                                                    type="tel"
                                                    value={data.contact_info.emergency_contact.phone}
                                                    placeholder={t("Enter emergency contact phone")}
                                                    onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors["contact_info.emergency_contact.phone"] && (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors["contact_info.emergency_contact.phone"]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="relationship" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                {t("Relationship")}
                                            </Label>
                                            <select
                                                id="relationship"
                                                value={data.contact_info.emergency_contact.relationship}
                                                onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-transparent dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 transition-all duration-200"
                                            >
                                                <option value="">{t("Select Relationship")}</option>
                                                {relationships.map((rel) => (
                                                    <option key={rel} value={rel}>
                                                        {rel}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors["contact_info.emergency_contact.relationship"] && (
                                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors["contact_info.emergency_contact.relationship"]}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link href={route("admin.employees.index")}>
                                        <Button variant="outline" type="button" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            {t("Cancel")}
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? t("Updating...") : t("Update Employee")}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 