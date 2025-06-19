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
    Timer,
    LogIn,
    LogOut,
    Activity,
    UserCheck,
    Wifi,
    WifiOff,
    Zap,
    Square,
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
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [currentAttendance, setCurrentAttendance] = useState(null);
    const [fingerprintStatus, setFingerprintStatus] = useState("idle"); // idle, scanning, matched, failed
    const [scannerConnected, setScannerConnected] = useState(false);
    const [secugenScore, setSecugenScore] = useState(0);
    const [autoScanTriggered, setAutoScanTriggered] = useState(false);
    const [todayStats, setTodayStats] = useState({
        total_employees: 0,
        checked_in: 0,
        checked_out: 0,
        late_arrivals: 0,
    });
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [deviceCount, setDeviceCount] = useState(0);
    const [captureStatus, setCaptureStatus] = useState("idle");
    const [ledStatus, setLedStatus] = useState(false);
    const [webApiVersion, setWebApiVersion] = useState("");
    const inputRef = useRef(null);

    // Initialize SecuGen functions for fingerprint capture
    useEffect(() => {
        // SecuGen WebAPI capture function from EditBiometric.jsx
        window.CallSGIFPGetData = function(successCall, failCall) {
            const uri = "https://localhost:8000/SGIFPCapture";
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    const fpobject = JSON.parse(xmlhttp.responseText);
                    successCall(fpobject);
                } else if (xmlhttp.readyState == 4) {
                    failCall(xmlhttp.status);
                }
            };
            xmlhttp.open("POST", uri, true);
            xmlhttp.send();
        };

        // Simple SecuGen matchScore function without license
        window.matchScore = function(succFunction, failFunction) {
            if (window.template_1 == "" || window.template_2 == "") {
                alert("Please scan two fingers to verify!!");
                return;
            }
            var uri = "https://localhost:8443/SGIMatchScore";

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var fpobject = JSON.parse(xmlhttp.responseText);
                    succFunction(fpobject);
                }
                else if (xmlhttp.status == 404) {
                    failFunction(xmlhttp.status);
                }
            }

            var params = "template1=" + encodeURIComponent(window.template_1) +
                        "&template2=" + encodeURIComponent(window.template_2) +
                        "&templateFormat=ISO";
            xmlhttp.open("POST", uri, false);
            xmlhttp.send(params);
        };

        // Set basic device status
        setScannerConnected(true);
        setDeviceCount(1);
        setWebApiVersion("SecuGen");

        return () => {
            // Cleanup if needed
        };
    }, []);

    // Auto-focus input on mount and refocus after any action
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [employee, error]);

    // Load today's attendance stats
    useEffect(() => {
        loadTodayStats();
    }, []);

    const loadTodayStats = async () => {
        try {
            const response = await fetch(route("admin.attendance.today-stats"), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTodayStats(data);
            }
        } catch (err) {
            console.error("Failed to load today's stats:", err);
        }
    };

    // Refocus input every 100ms to ensure it's always focused
    useEffect(() => {
        const interval = setInterval(() => {
            if (inputRef.current && document.activeElement !== inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Auto-trigger SecuGen scan when employee verified and no attendance for today
    useEffect(() => {
        if (employee && !currentAttendance && scannerConnected && !autoScanTriggered) {
            setAutoScanTriggered(true);
            setTimeout(() => {
                startSecuGenScan();
            }, 1000); // Wait 1 second after verification
        }
    }, [employee, currentAttendance, scannerConnected, autoScanTriggered]);

    // Search for employee when input changes
    useEffect(() => {
        if (employeeId.trim()) {
            const timeoutId = setTimeout(() => {
                verifyEmployee();
            }, 500); // 500ms debounce

            return () => clearTimeout(timeoutId);
        } else {
            setEmployee(null);
            setCurrentAttendance(null);
            setAttendanceHistory([]);
            setError("");
            setAutoScanTriggered(false);
        }
    }, [employeeId]);

    const verifyEmployee = async () => {
        if (!employeeId.trim()) return;

        setLoading(true);
        setError("");
        setFingerprintStatus("idle");
        setAutoScanTriggered(false);

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
                setCurrentAttendance(data.current_attendance || null);
                setAttendanceHistory(data.attendance_history || []);
                setError("");
                setLastVerified(new Date());
            } else {
                setEmployee(null);
                setCurrentAttendance(null);
                setAttendanceHistory([]);
                setError(data.message || t("Employee not found"));
            }
        } catch (err) {
            setEmployee(null);
            setCurrentAttendance(null);
            setAttendanceHistory([]);
            setError(t("Error verifying employee"));
        } finally {
            setLoading(false);
        }
    };

    const startSecuGenScan = () => {
        setFingerprintStatus("scanning");
        setError("");
        setSecugenScore(0);

        // Check for biometric template in multiple places for compatibility
        const storedTemplate = employee.fingerprint_template ||
                              (employee.biometric && employee.biometric.TemplateBase64);

        if (!employee || !storedTemplate) {
            setFingerprintStatus("failed");
            setError(t("No biometric template registered for this employee."));
            return;
        }

        // Set stored template for comparison
        window.template_1 = storedTemplate;

        // Capture fingerprint using SecuGen
        window.CallSGIFPGetData(
            function(result) {
                // Success - fingerprint captured
                if (result.ErrorCode == 0) {
                    // Set captured template
                    window.template_2 = result.TemplateBase64;

                    // Now match with stored template
                    window.matchScore(
                        function(matchResult) {
                            // Success - matching completed
                            const score = matchResult.MatchingScore;
                            setSecugenScore(score);

                            if (score >= 30) {
                                setFingerprintStatus("matched");
                                handleAttendanceAction();
                            } else {
                                setFingerprintStatus("failed");
                                setError(t(`Fingerprint match failed. Score: ${score}/100. Minimum required: 30`));
                            }
                        },
                        function(error) {
                            // Error in matching
                            setFingerprintStatus("failed");
                            setError(t("Error during fingerprint matching. Please try again."));
                        }
                    );
                } else {
                    setFingerprintStatus("failed");
                    setError(t(`SecuGen capture failed. Error code: ${result.ErrorCode}`));
                }
            },
            function(status) {
                // Error in capture
                setFingerprintStatus("failed");
                setError(t("Check if SGIBIOSRV is running. Unable to connect to fingerprint device."));
            }
        );
    };

    // Function to stop scanning if needed
    const stopScanning = () => {
        setFingerprintStatus("idle");
    };

    // Manual device check function
    const checkDeviceStatus = () => {
        setScannerConnected(true);
        setDeviceCount(1);
        setError("");
    };

    const handleAttendanceAction = async () => {
        if (!employee) return;

        try {
            const action = currentAttendance ? "check_out" : "check_in";
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

            const requestData = {
                employee_id: employee.id,
                action: action,
                verification_method: "secugen_fingerprint",
                fingerprint_score: secugenScore,
            };

            const response = await fetch(route("admin.attendance.record"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (data.success) {
                setCurrentAttendance(data.attendance);
                setAttendanceHistory([data.attendance, ...attendanceHistory]);

                // Show success message
                setTimeout(() => {
                    setFingerprintStatus("idle");
                }, 2000);
            } else {
                setError(data.message || t("Failed to record attendance"));
                setFingerprintStatus("failed");
            }
        } catch (err) {
            setError(t("Error recording attendance"));
            setFingerprintStatus("failed");
        }
    };

    const handleInputChange = (e) => {
        setEmployeeId(e.target.value);
        setFingerprintStatus("idle");
        setAutoScanTriggered(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            verifyEmployee();
        } else if (e.key === "Escape") {
            clearSearch();
        } else if (e.key === "F1") {
            e.preventDefault();
            if (employee && scannerConnected) {
                startSecuGenScan();
            }
        }
    };

    const clearSearch = () => {
        setEmployeeId("");
        setEmployee(null);
        setCurrentAttendance(null);
        setAttendanceHistory([]);
        setError("");
        setFingerprintStatus("idle");
        setAutoScanTriggered(false);
        setSecugenScore(0);
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

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <>
            <Head title={t("Employee Attendance System")} />

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
                                            <Fingerprint className="w-8 h-8 text-white" />
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
                                            {t("Attendance System")}
                                        </motion.h1>
                                        <motion.p
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
                                            className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                        >
                                            <Activity className="w-4 h-4" />
                                            {t("SecuGen Biometric Verification & Attendance Tracking")}
                                        </motion.p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* SecuGen Scanner Status */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${
                                            scannerConnected
                                                ? "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                                : "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                        }`}
                                    >
                                        {scannerConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                                        <div className="flex flex-col">
                                            <span>{scannerConnected ? t("SecuGen Online") : t("SecuGen Offline")}</span>
                                            <span className="text-xs opacity-75">
                                                {deviceCount > 0 ? `${deviceCount} device(s)` : "No devices"}
                                                {webApiVersion && ` • v${webApiVersion}`}
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* LED Status */}
                                    {scannerConnected && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${
                                                ledStatus
                                                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                                    : "text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"
                                            }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${ledStatus ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                            {ledStatus ? t("LED On") : t("LED Off")}
                                        </motion.div>
                                    )}

                                    {/* Device Info */}
                                    {deviceInfo && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Fingerprint className="w-4 h-4" />
                                                <span>{deviceInfo.model || "SecuGen Device"}</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Manual Device Check Button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Button
                                            onClick={checkDeviceStatus}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs px-3 py-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Activity className="w-3 h-3 mr-1" />
                                            {t("Simple Mode")}
                                        </Button>
                                    </motion.div>
                                    {lastVerified && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            {t("Last verified")}: {lastVerified.toLocaleTimeString()}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Today's Stats */}
                    <div className="px-6 py-4 bg-white/50 dark:bg-slate-800/50 border-b border-white/20 dark:border-slate-700/50">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todayStats.total_employees}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{t("Total Employees")}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{todayStats.checked_in}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{t("Checked In")}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{todayStats.checked_out}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{t("Checked Out")}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{todayStats.late_arrivals}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{t("Late Arrivals")}</div>
                            </div>
                        </div>
                    </div>

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
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">Enter</kbd>
                                                        {t("to search")}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">Esc</kbd>
                                                        {t("to clear")}
                                                    </div>
                                                    {employee && scannerConnected && (
                                                        <div className="flex items-center gap-2">
                                                            <kbd className="px-2 py-1 bg-green-100 dark:bg-green-700 rounded text-xs">F1</kbd>
                                                            {t("for SecuGen scan")}
                                                        </div>
                                                    )}
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

                            {/* SecuGen Attendance Scanner */}
                            <AnimatePresence>
                                {employee && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-6"
                                    >
                                        {/* Attendance Status Card */}
                                        <Card className={`border-0 shadow-2xl backdrop-blur-xl ${
                                            currentAttendance
                                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                                : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                                        }`}>
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-full ${
                                                        currentAttendance ? "bg-green-500" : "bg-orange-500"
                                                    }`}>
                                                        {currentAttendance ? (
                                                            <UserCheck className="h-8 w-8 text-white" />
                                                        ) : (
                                                            <Timer className="h-8 w-8 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className={`text-2xl font-bold ${
                                                            currentAttendance
                                                                ? "text-green-800 dark:text-green-200"
                                                                : "text-orange-800 dark:text-orange-200"
                                                        }`}>
                                                            {currentAttendance ? t("Employee Already Checked In") : t("No Attendance Today - SecuGen Scan Required")}
                                                        </h2>
                                                        <p className={currentAttendance ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}>
                                                            {currentAttendance
                                                                ? `${t("Checked in at")}: ${formatTime(currentAttendance.check_in)}`
                                                                : t("Automatic SecuGen fingerprint verification will start")
                                                            }
                                                        </p>
                                                    </div>
                                                    {currentAttendance && (
                                                        <div className="text-right">
                                                            <div className="text-sm text-green-600 dark:text-green-400">{t("Status")}</div>
                                                            <div className="text-lg font-semibold text-green-800 dark:text-green-200">{t("Present")}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* SecuGen Scanner Interface */}
                                        {!currentAttendance && (
                                            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                                                <CardHeader className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 border-b border-white/30 dark:border-slate-700/50">
                                                    <CardTitle className="flex items-center gap-3 text-xl">
                                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                                            <Fingerprint className="h-6 w-6 text-white" />
                                                        </div>
                                                        {t("SecuGen Fingerprint Attendance")}
                                                        {secugenScore > 0 && (
                                                            <div className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                                                                secugenScore >= 30
                                                                    ? "bg-green-100 text-green-800 border border-green-200"
                                                                    : "bg-red-100 text-red-800 border border-red-200"
                                                            }`}>
                                                                {t("Score")}: {secugenScore}/100
                                                            </div>
                                                        )}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-8">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                        {/* Fingerprint Scanner Visual */}
                                                        <div className="space-y-6">
                                                            <div className="text-center">
                                                                <motion.div
                                                                    className={`mx-auto w-48 h-48 rounded-full border-8 flex items-center justify-center relative ${
                                                                        fingerprintStatus === "scanning"
                                                                            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                                                            : fingerprintStatus === "matched"
                                                                            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                                                                            : fingerprintStatus === "failed"
                                                                            ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                                                                            : "border-slate-300 bg-slate-50 dark:bg-slate-700"
                                                                    }`}
                                                                    animate={
                                                                        fingerprintStatus === "scanning"
                                                                            ? { scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }
                                                                            : {}
                                                                    }
                                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                                >
                                                                    {fingerprintStatus === "scanning" && (
                                                                        <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping"></div>
                                                                    )}
                                                                    <Fingerprint
                                                                        className={`w-24 h-24 ${
                                                                            fingerprintStatus === "scanning"
                                                                                ? "text-blue-600"
                                                                                : fingerprintStatus === "matched"
                                                                                ? "text-green-600"
                                                                                : fingerprintStatus === "failed"
                                                                                ? "text-red-600"
                                                                                : "text-slate-400"
                                                                        }`}
                                                                    />
                                                                </motion.div>
                                                                <div className="mt-6 space-y-2">
                                                                    <h3 className="text-xl font-semibold">
                                                                        {fingerprintStatus === "scanning"
                                                                            ? t("SecuGen Capturing...")
                                                                            : fingerprintStatus === "matched"
                                                                            ? t("Fingerprint Matched!")
                                                                            : fingerprintStatus === "failed"
                                                                            ? t("Capture Failed")
                                                                            : autoScanTriggered
                                                                            ? t("Auto-capture will start soon...")
                                                                            : t("Place Finger on SecuGen Scanner")}
                                                                    </h3>
                                                                    <p className="text-slate-600 dark:text-slate-400">
                                                                        {fingerprintStatus === "scanning"
                                                                            ? t("Please keep finger steady on SecuGen device...")
                                                                            : fingerprintStatus === "matched"
                                                                            ? t("Attendance recorded successfully")
                                                                            : fingerprintStatus === "failed"
                                                                            ? t("Please try again or contact admin")
                                                                            : autoScanTriggered
                                                                            ? t("SecuGen will automatically capture for attendance")
                                                                            : t("Manual capture available via F1 key")}
                                                                    </p>
                                                                    {secugenScore > 0 && (
                                                                        <p className={`text-sm font-medium ${
                                                                            secugenScore >= 30 ? "text-green-600" : "text-red-600"
                                                                        }`}>
                                                                            {secugenScore >= 30
                                                                                ? t("✓ Score meets minimum requirement (30+)")
                                                                                : t("✗ Score below minimum requirement (30+)")
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="text-center space-y-4">
                                                                <div className="flex gap-3 justify-center">
                                                                    <Button
                                                                        onClick={startSecuGenScan}
                                                                        disabled={!scannerConnected || fingerprintStatus === "scanning" || deviceCount === 0}
                                                                        size="lg"
                                                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                                                                    >
                                                                        {fingerprintStatus === "scanning" ? (
                                                                            <>
                                                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                                                {t("SecuGen Scanning...")}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Zap className="w-5 h-5 mr-2" />
                                                                                {t("Start SecuGen Scan")}
                                                                            </>
                                                                        )}
                                                                    </Button>

                                                                    {fingerprintStatus === "scanning" && (
                                                                        <Button
                                                                            onClick={stopScanning}
                                                                            variant="outline"
                                                                            size="lg"
                                                                            className="border-red-300 text-red-600 hover:bg-red-50 px-6 py-3"
                                                                        >
                                                                            <Square className="w-5 h-5 mr-2" />
                                                                            {t("Stop Scan")}
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                {/* Device Status Information */}
                                                                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                                                    {captureStatus !== "idle" && (
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <Activity className="w-4 h-4" />
                                                                            <span>{t("Capture Status")}: {captureStatus}</span>
                                                                        </div>
                                                                    )}
                                                                    {deviceInfo && (
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <span>{t("Device")}: {deviceInfo.model}</span>
                                                                            {deviceInfo.serialNumber && (
                                                                                <span className="text-xs opacity-75">({deviceInfo.serialNumber})</span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Employee Info & Instructions */}
                                                        <div className="space-y-6">
                                                            <div className="space-y-4">
                                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                                    <UserCheck className="w-5 h-5" />
                                                                    {t("Employee Details")}
                                                                </h3>
                                                                <div className="grid grid-cols-1 gap-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <User className="w-5 h-5 text-slate-500" />
                                                                        <div>
                                                                            <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                                                                            <p className="text-sm text-slate-600 dark:text-slate-400">{employee.employee_id}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <Building className="w-5 h-5 text-slate-500" />
                                                                        <div>
                                                                            <p className="font-medium">{employee.department}</p>
                                                                            <p className="text-sm text-slate-600 dark:text-slate-400">{t("Department")}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <Shield className="w-5 h-5 text-slate-500" />
                                                                        <div>
                                                                            <UIBadge variant={employee.biometric ? "default" : "secondary"}>
                                                                                {employee.biometric ? t("Biometric Registered") : t("No Biometric")}
                                                                            </UIBadge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                                    <Activity className="w-5 h-5" />
                                                                    {t("SecuGen Instructions")}
                                                                </h3>
                                                                <div className="space-y-3 text-sm">
                                                                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                                                        <div>
                                                                            <p className="font-medium text-blue-800 dark:text-blue-200">{t("Automatic Scan")}</p>
                                                                            <p className="text-blue-600 dark:text-blue-400">{t("SecuGen will auto-scan when no attendance found")}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                                                        <div>
                                                                            <p className="font-medium text-green-800 dark:text-green-200">{t("Score Requirement")}</p>
                                                                            <p className="text-green-600 dark:text-green-400">{t("Minimum score of 30/100 required for attendance")}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                                                        <div>
                                                                            <p className="font-medium text-purple-800 dark:text-purple-200">{t("Device Management")}</p>
                                                                            <p className="text-purple-600 dark:text-purple-400">{t("LED indicators show device status and capture progress")}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                                                                        <div>
                                                                            <p className="font-medium text-orange-800 dark:text-orange-200">{t("Manual Controls")}</p>
                                                                            <p className="text-orange-600 dark:text-orange-400">{t("Press F1 for manual scan or use stop button during capture")}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Device Technical Info */}
                                                                {deviceInfo && (
                                                                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">{t("Device Information")}</h4>
                                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                                            <div>
                                                                                <span className="text-slate-500">{t("Model")}:</span>
                                                                                <span className="ml-1 font-medium">{deviceInfo.model || "N/A"}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-slate-500">{t("Serial")}:</span>
                                                                                <span className="ml-1 font-medium">{deviceInfo.serialNumber || "N/A"}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-slate-500">{t("DPI")}:</span>
                                                                                <span className="ml-1 font-medium">{deviceInfo.dpi || "N/A"}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-slate-500">{t("Version")}:</span>
                                                                                <span className="ml-1 font-medium">{webApiVersion || "N/A"}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                                                            {(employee.fingerprint_template || (employee.biometric && employee.biometric.TemplateBase64)) ? (
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
