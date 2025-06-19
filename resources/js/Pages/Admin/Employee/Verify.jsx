import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    Search,
    User,
    Badge,
    Building,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Users,
    Contact,
    Fingerprint,
    Shield,
    CheckCircle,
    XCircle,
    AlertCircle,
    Scan,
    Eye,
    Clock,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge as UIBadge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";

export default function Verify({ auth }) {
    const { t } = useLaravelReactI18n();
    const [employeeId, setEmployeeId] = useState("");
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastVerified, setLastVerified] = useState(null);
    const inputRef = useRef(null);

    // Auto-focus input on mount and refocus after any action
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [employee, error]);

    // Refocus input every 100ms to ensure it's always focused
    useEffect(() => {
        const interval = setInterval(() => {
            if (inputRef.current && document.activeElement !== inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Search for employee when input changes
    useEffect(() => {
        if (employeeId.trim()) {
            const timeoutId = setTimeout(() => {
                verifyEmployee();
            }, 500); // 500ms debounce

            return () => clearTimeout(timeoutId);
        } else {
            setEmployee(null);
            setError("");
        }
    }, [employeeId]);

    const verifyEmployee = async () => {
        if (!employeeId.trim()) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(route("admin.employees.verify-employee"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
                body: JSON.stringify({ employee_id: employeeId.trim() }),
            });

            const data = await response.json();

            if (data.success) {
                setEmployee(data.employee);
                setError("");
                setLastVerified(new Date());
            } else {
                setEmployee(null);
                setError(data.message || t("Employee not found"));
            }
        } catch (err) {
            setEmployee(null);
            setError(t("Error verifying employee"));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setEmployeeId(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            verifyEmployee();
        } else if (e.key === "Escape") {
            setEmployeeId("");
            setEmployee(null);
            setError("");
        }
    };

    const clearSearch = () => {
        setEmployeeId("");
        setEmployee(null);
        setError("");
        inputRef.current?.focus();
    };

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

    return (
        <>
            <Head title={t("Employee Verification")} />

            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Navigation auth={auth} currentRoute="admin.employees" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-lg">
                        <div className="px-6 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                                        className="relative"
                                    >
                                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                                        <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                            <Scan className="w-8 h-8 text-white" />
                                            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
                                        </div>
                                    </motion.div>
                                    <div>
                                        <motion.h1
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent"
                                        >
                                            {t("Employee Verification")}
                                        </motion.h1>
                                        <motion.p
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
                                            className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            {t("Enter Employee ID to verify identity")}
                                        </motion.p>
                                    </div>
                                </div>
                                {lastVerified && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {t("Last verified")}: {lastVerified.toLocaleTimeString()}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-5xl mx-auto space-y-8">
                            {/* Search Section */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                    <CardHeader className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                                <Search className="h-6 w-6 text-white" />
                                            </div>
                                            {t("Employee ID Verification")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
                                                <Input
                                                    ref={inputRef}
                                                    type="text"
                                                    placeholder={t("Enter Employee ID...")}
                                                    value={employeeId}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    className="pl-14 h-16 text-xl border-2 border-blue-200 focus:border-blue-500 rounded-xl w-full font-mono"
                                                    autoComplete="off"
                                                />
                                                {employeeId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={clearSearch}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                    >
                                                        <XCircle className="h-5 w-5" />
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">Enter</kbd>
                                                    {t("to search")}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">Esc</kbd>
                                                    {t("to clear")}
                                                </div>
                                            </div>

                                            {loading && (
                                                <div className="flex items-center justify-center py-4">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                </div>
                                            )}

                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                                                >
                                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                    <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
                                                </motion.div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Employee Details */}
                            <AnimatePresence>
                                {employee && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-6"
                                    >
                                        {/* Success Header */}
                                        <Card className="border shadow-2xl bg-green-50 dark:bg-green-900/20  border-green-200 dark:border-green-800">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-green-500 rounded-full">
                                                        <CheckCircle className="h-8 w-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
                                                            {t("Employee Verified Successfully")}
                                                        </h2>
                                                        <p className="text-green-600 dark:text-green-400">
                                                            {t("Employee found in the system")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Employee Overview */}
                                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                <CardTitle className="flex items-center gap-3 text-xl">
                                                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                    {t("Employee Information")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-6">
                                                    <div className="flex-shrink-0">
                                                        {employee.photo ? (
                                                            <img
                                                                className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700 shadow-lg"
                                                                src={`/storage/${employee.photo}`}
                                                                alt={`${employee.first_name} ${employee.last_name}`}
                                                            />
                                                        ) : (
                                                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-700 dark:to-indigo-800 flex items-center justify-center border-4 border-blue-200 dark:border-blue-700 shadow-lg">
                                                                <User className="h-16 w-16 text-blue-600 dark:text-blue-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                                <User className="h-4 w-4" />
                                                                {t("Full Name")}
                                                            </p>
                                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                                {employee.first_name} {employee.last_name}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                                <Badge className="h-4 w-4" />
                                                                {t("Employee ID")}
                                                            </p>
                                                            <UIBadge variant="secondary" className="text-lg px-3 py-1">
                                                                {employee.employee_id}
                                                            </UIBadge>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                                <Badge className="h-4 w-4" />
                                                                {t("Taskra ID")}
                                                            </p>
                                                            <UIBadge variant="outline" className="text-lg px-3 py-1">
                                                                {employee.taskra_id || "N/A"}
                                                            </UIBadge>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                                <Building className="h-4 w-4" />
                                                                {t("Department")}
                                                            </p>
                                                            <UIBadge variant="default" className="text-lg px-3 py-1">
                                                                {employee.department}
                                                            </UIBadge>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                                <Mail className="h-4 w-4" />
                                                                {t("Email")}
                                                            </p>
                                                            <p className="text-lg text-slate-900 dark:text-white">
                                                                {employee.email || "N/A"}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                                <Calendar className="h-4 w-4" />
                                                                {t("Joined")}
                                                            </p>
                                                            <p className="text-lg text-slate-900 dark:text-white">
                                                                {formatDate(employee.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Contact Information */}
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                                                    <CardTitle className="flex items-center gap-3">
                                                        <Contact className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                        {t("Contact Information")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-6 space-y-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <Phone className="h-5 w-5 text-slate-500" />
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Phone")}
                                                                </p>
                                                                <p className="text-lg text-slate-900 dark:text-white">
                                                                    {employee.contact_info?.phone || "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Phone className="h-5 w-5 text-slate-500" />
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Mobile")}
                                                                </p>
                                                                <p className="text-lg text-slate-900 dark:text-white">
                                                                    {employee.contact_info?.mobile || "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <MapPin className="h-5 w-5 text-slate-500 mt-1" />
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Address")}
                                                                </p>
                                                                <p className="text-lg text-slate-900 dark:text-white">
                                                                    {employee.contact_info?.address || "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Security Information */}
                                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                                    <CardTitle className="flex items-center gap-3">
                                                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                        {t("Security Information")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-6 space-y-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Fingerprint className="h-5 w-5 text-slate-500" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                        {t("Biometric Status")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {employee.biometric ? (
                                                                <UIBadge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    {t("Registered")}
                                                                </UIBadge>
                                                            ) : (
                                                                <UIBadge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                                    {t("Not Registered")}
                                                                </UIBadge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Users className="h-5 w-5 text-slate-500" />
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Access Gate")}
                                                                </p>
                                                                <p className="text-lg text-slate-900 dark:text-white">
                                                                    {employee.gate?.name || "No gate assigned"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Clock className="h-5 w-5 text-slate-500" />
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                    {t("Last Verified")}
                                                                </p>
                                                                <p className="text-lg text-slate-900 dark:text-white">
                                                                    {lastVerified ? lastVerified.toLocaleString() : t("Just now")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 