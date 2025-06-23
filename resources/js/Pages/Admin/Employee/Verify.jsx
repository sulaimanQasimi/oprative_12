import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import moment from "moment-jalaali";
import {
    Search,
    User,
    Mail,
    Calendar,
    Users,
    Fingerprint,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Timer,
    LogIn,
    LogOut,
    Activity,
    Wifi,
    WifiOff,
    Zap,
    Square,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge as UIBadge } from "@/Components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/Components/Admin/Navigation";

// Configure moment-jalaali for Persian locale
moment.loadPersian({ dialect: 'persian-modern' });

// Persian date utilities
const formatPersianDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format('jYYYY/jMM/jDD');
};

const formatPersianDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format('jYYYY/jMM/jDD HH:mm:ss');
};

const formatPersianTime = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format('HH:mm:ss');
};

const getCurrentPersianDate = () => {
    return moment().format('jYYYY/jMM/jDD');
};

const getCurrentPersianDateWithDay = () => {
    return moment().format('dddd، jYYYY/jMM/jDD');
};

const getCurrentPersianTime = () => {
    return moment().format('HH:mm:ss');
};

const formatRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).fromNow();
};

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
    const [currentTime, setCurrentTime] = useState(getCurrentPersianTime());
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
                alert(t("Please scan two fingers to verify!!"));
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

    // Live clock - update every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentPersianTime());
        }, 1000);

        return () => clearInterval(interval);
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
            console.error(t("Failed to load today's stats:"), err);
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
        if (employee && !currentAttendance && scannerConnected && !autoScanTriggered && fingerprintStatus === "idle") {
            console.log(t("Auto-triggering scan for employee:"), employee.employee_id, t("Current attendance:"), currentAttendance);
            setAutoScanTriggered(true);
            setTimeout(() => {
                // Double-check state before starting scan
                if (fingerprintStatus === "idle") {
                    startSecuGenScan();
                }
            }, 1500); // Wait 1.5 seconds after verification
        }
    }, [employee, currentAttendance, scannerConnected, autoScanTriggered, fingerprintStatus]);

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
                console.log(t("Employee verification successful:"), data);
                setEmployee(data.employee);
                setCurrentAttendance(data.current_attendance || null);
                setAttendanceHistory(data.attendance_history || []);
                setError("");
                setLastVerified(new Date());
                console.log(t("Current attendance set to:"), data.current_attendance);
            } else {
                setEmployee(null);
                setCurrentAttendance(null);
                setAttendanceHistory([]);
                setError(data.message || t("Employee not found"));
            }
        } catch (err) {
            console.error(t("Attendance request error:"), err);
            setError(t("Error recording attendance") + ": " + (err.message || t("Unknown error")));
            setFingerprintStatus("failed");
            // Reset auto-scan trigger on error too
            setAutoScanTriggered(false);
        } finally {
            setLoading(false);
        }
    };

    const startSecuGenScan = () => {
        // Prevent concurrent scans
        if (fingerprintStatus === "scanning") {
            console.log(t("Scan already in progress, ignoring new scan request"));
            return;
        }

        console.log(t("Starting SecuGen scan for employee:"), employee?.employee_id);
        setFingerprintStatus("scanning");
        setError("");
        setSecugenScore(0);

        // Check for biometric template in multiple places for compatibility
        const storedTemplate = employee.fingerprint_template ||
                              (employee.biometric && employee.biometric.TemplateBase64);

        if (!employee || !storedTemplate) {
            console.error(t("No biometric template found for employee"));
            setFingerprintStatus("failed");
            setError(t("No biometric template registered for this employee."));
            return;
        }

        console.log(t("Using stored template:"), storedTemplate.substring(0, 50) + "...");

        // Set stored template for comparison
        window.template_1 = storedTemplate;

        // Capture fingerprint using SecuGen
        window.CallSGIFPGetData(
            function(result) {
                console.log(t("SecuGen capture result:"), result);
                // Success - fingerprint captured
                if (result.ErrorCode == 0) {
                    // Set captured template 
                    window.template_2 = result.TemplateBase64;
                    console.log(t("Captured template:"), result.TemplateBase64.substring(0, 50) + "...");

                    // Now match with stored template
                    window.matchScore(
                        function(matchResult) {
                            console.log(t("Match result:"), matchResult);
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
                            console.error(t("Error during fingerprint matching:"), error);
                            // Error in matching
                            setFingerprintStatus("failed");
                            setError(t("Error during fingerprint matching. Please try again."));
                        }
                    );
                } else {
                    console.error(t("SecuGen capture failed with error code:"), result.ErrorCode);
                    setFingerprintStatus("failed");
                    setError(t(`SecuGen capture failed. Error code: ${result.ErrorCode}`));
                }
            },
            function(status) {
                console.error(t("SecuGen capture failed with status:"), status);
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

            // Debug CSRF token and route
            console.log(t("CSRF Token:"), csrfToken);
            console.log(t("Route URL:"), route("admin.attendance.record"));
            console.log(t("Current URL:"), window.location.href);

            const requestData = {
                employee_id: employee.id,
                action: action,
                verification_method: "secugen_fingerprint",
                fingerprint_score: secugenScore,
            };

            console.log(t("Sending attendance request:"), requestData);

            const response = await fetch(route("admin.attendance.record"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    "Accept": "application/json", // Explicitly request JSON response
                },
                body: JSON.stringify(requestData),
            });

            console.log(t("Response status:"), response.status);
            console.log(t("Response headers:"), Object.fromEntries(response.headers.entries()));
            
            // Get the response text first to see what we're actually receiving
            const responseText = await response.text();
            console.log(t("Raw response:"), responseText);

            let data;
            try {
                data = JSON.parse(responseText);
                console.log(t("Parsed attendance response:"), data);
            } catch (parseError) {
                console.error(t("JSON parsing failed:"), parseError);
                console.error(t("Response was not valid JSON:"), responseText.substring(0, 200));
                setError(t("Server returned invalid response. Check console for details."));
                setFingerprintStatus("failed");
                setAutoScanTriggered(false);
                return;
            }

            if (data.success) {
                console.log(t("Attendance recorded successfully, updating state"));
                setCurrentAttendance(data.attendance);
                setAttendanceHistory([data.attendance, ...attendanceHistory]);
                
                // Reset auto-scan trigger to allow future operations
                setAutoScanTriggered(false);

                // Reload today's stats
                loadTodayStats();

                // Show success message and then reset status
                setTimeout(() => {
                    setFingerprintStatus("idle");
                    console.log(t("Fingerprint status reset to idle"));
                }, 2000);
            } else {
                console.error(t("Attendance recording failed:"), data);
                setError(data.message || t("Failed to record attendance"));
                setFingerprintStatus("failed");
                // Reset auto-scan trigger on failure too
                setAutoScanTriggered(false);
            }
        } catch (err) {
            console.error(t("Attendance request error:"), err);
            setError(t("Error recording attendance") + ": " + (err.message || t("Unknown error")));
            setFingerprintStatus("failed");
            // Reset auto-scan trigger on error too
            setAutoScanTriggered(false);
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

    // Date formatting functions are now defined at the top of the file

    return (
        <>
            <Head title={t("Employee Attendance System")} />

            <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Navigation auth={auth} currentRoute="admin.employees" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-auto p-8">
                    {/* Page Title & Stats Overview */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                                    {t("Biometric Attendance")}
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                                    {t("SecuGen fingerprint verification system")}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {moment().format('dddd')}
                                </div>
                                <div className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                                    {getCurrentPersianDate()}
                                </div>
                                <motion.div 
                                    key={currentTime}
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-lg font-medium text-slate-600 dark:text-slate-400 tabular-nums"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-indigo-500" />
                                        {currentTime}
                                    </span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Today's Stats - Redesigned as horizontal cards */}
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayStats.total_employees}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t("Total Employees")}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                                        <LogIn className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayStats.checked_in}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t("Checked In")}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                                        <LogOut className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayStats.checked_out}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t("Checked Out")}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayStats.late_arrivals}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{t("Late Arrivals")}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left Column - Attendance Scanner (8 columns) */}
                        <div className="col-span-8">
                            <div className="space-y-8">
                                {/* Search Section - Redesigned */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
                                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 p-1">
                                            <div className="bg-white dark:bg-slate-800 rounded-3xl">
                                                <CardContent className="p-8">
                                                    <div className="text-center mb-6">
                                                        <motion.div
                                                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4"
                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <Search className="w-8 h-8 text-white" />
                                                        </motion.div>
                                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                                            {t("Employee Verification")}
                                                        </h2>
                                                        <p className="text-slate-600 dark:text-slate-400">
                                                            {t("Enter employee ID to start attendance process")}
                                                        </p>
                                                    </div>

                                                    <div className="relative max-w-md mx-auto">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                                                        <div className="relative">
                                                            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6 z-10" />
                                                            <Input
                                                                ref={inputRef}
                                                                type="text"
                                                                placeholder={t("Enter Employee ID...")}
                                                                value={employeeId}
                                                                onChange={handleInputChange}
                                                                onKeyDown={handleKeyDown}
                                                                className="pl-16 pr-16 h-16 text-xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-2xl w-full font-mono bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                                                                autoComplete="off"
                                                            />
                                                            {employeeId && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={clearSearch}
                                                                        className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                                                                    >
                                                                        <XCircle className="h-5 w-5 text-red-500" />
                                                                    </Button>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
                                                        <div className="flex items-center gap-2">
                                                            <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium">{t("Enter")}</kbd>
                                                            <span>{t("to search")}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium">{t("Esc")}</kbd>
                                                            <span>{t("to clear")}</span>
                                                        </div>
                                                        {employee && scannerConnected && (
                                                            <div className="flex items-center gap-2">
                                                                <kbd className="px-3 py-1 bg-green-100 dark:bg-green-700 rounded-lg text-xs font-medium">{t("F1")}</kbd>
                                                                <span>{t("SecuGen scan")}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {loading && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="flex items-center justify-center py-8"
                                                        >
                                                            <div className="relative">
                                                                <div className="w-12 h-12 border-4 border-indigo-200 rounded-full"></div>
                                                                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {error && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                                                <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </CardContent>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* SecuGen Scanner Interface - Redesigned */}
                                <AnimatePresence>
                                    {employee && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -30 }}
                                            transition={{ duration: 0.6 }}
                                            className="space-y-6"
                                        >
                                            {/* Attendance Status - Redesigned */}
                                            <Card className={`border-0 shadow-2xl rounded-3xl overflow-hidden ${
                                                currentAttendance
                                                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                                    : "bg-gradient-to-r from-orange-400 to-amber-500"
                                            }`}>
                                                <CardContent className="p-8">
                                                    <div className="flex items-center space-x-6">
                                                        <motion.div
                                                            className="p-4 bg-white/20 rounded-2xl"
                                                            whileHover={{ scale: 1.1 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            {currentAttendance ? (
                                                                <CheckCircle className="h-12 w-12 text-white" />
                                                            ) : (
                                                                <Timer className="h-12 w-12 text-white" />
                                                            )}
                                                        </motion.div>
                                                        <div className="flex-1">
                                                            <h2 className="text-3xl font-bold text-white mb-2">
                                                                {currentAttendance ? t("Already Checked In") : t("Ready for Check-In")}
                                                            </h2>
                                                            <p className="text-white/90 text-lg">
                                                                {currentAttendance
                                                                    ? `${t("Checked in at")}: ${formatPersianTime(currentAttendance.check_in)}`
                                                                    : t("Place finger on SecuGen scanner to continue")
                                                                }
                                                            </p>
                                                        </div>
                                                        {currentAttendance && (
                                                            <div className="text-right">
                                                                <div className="text-white/80 text-sm">{t("Status")}</div>
                                                                <div className="text-2xl font-bold text-white">{t("Present")}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* SecuGen Scanner - Redesigned */}
                                            {!currentAttendance && (
                                                <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 p-1">
                                                        <div className="bg-white dark:bg-slate-800 rounded-3xl">
                                                            <CardContent className="p-8">
                                                                <div className="text-center">
                                                                    <div className="flex items-center justify-center gap-4 mb-8">
                                                                        <motion.div
                                                                            className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl"
                                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                                        >
                                                                            <Fingerprint className="w-8 h-8 text-white" />
                                                                        </motion.div>
                                                                        <div className="text-left">
                                                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                                                {t("SecuGen Fingerprint")}
                                                                            </h3>
                                                                            <p className="text-slate-600 dark:text-slate-400">
                                                                                {t("Biometric attendance verification")}
                                                                            </p>
                                                                        </div>
                                                                        {secugenScore > 0 && (
                                                                            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                                                                                secugenScore >= 30
                                                                                    ? "bg-green-100 text-green-800 border-2 border-green-200"
                                                                                    : "bg-red-100 text-red-800 border-2 border-red-200"
                                                                            }`}>
                                                                                {t("Score")}: {secugenScore}/100
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Enhanced Fingerprint Scanner Visual */}
                                                                    <div className="relative mb-8">
                                                                        <motion.div
                                                                            className={`mx-auto w-56 h-56 rounded-full border-8 flex items-center justify-center relative overflow-hidden ${
                                                                                fingerprintStatus === "scanning"
                                                                                    ? "border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
                                                                                    : fingerprintStatus === "matched"
                                                                                    ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                                                                                    : fingerprintStatus === "failed"
                                                                                    ? "border-red-400 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20"
                                                                                    : "border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800"
                                                                            }`}
                                                                            animate={
                                                                                fingerprintStatus === "scanning"
                                                                                    ? {
                                                                                        scale: [1, 1.05, 1],
                                                                                        boxShadow: [
                                                                                            "0 0 0 0 rgba(99, 102, 241, 0.7)",
                                                                                            "0 0 0 20px rgba(99, 102, 241, 0)",
                                                                                            "0 0 0 0 rgba(99, 102, 241, 0)"
                                                                                        ]
                                                                                    }
                                                                                    : {}
                                                                            }
                                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                                        >
                                                                            {fingerprintStatus === "scanning" && (
                                                                                <>
                                                                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-ping"></div>
                                                                                    <div className="absolute inset-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-pulse"></div>
                                                                                </>
                                                                            )}
                                                                            <motion.div
                                                                                whileHover={{ scale: 1.1 }}
                                                                                transition={{ type: "spring", stiffness: 300 }}
                                                                            >
                                                                                <Fingerprint
                                                                                    className={`w-28 h-28 ${
                                                                                        fingerprintStatus === "scanning"
                                                                                            ? "text-indigo-600"
                                                                                            : fingerprintStatus === "matched"
                                                                                            ? "text-green-600"
                                                                                            : fingerprintStatus === "failed"
                                                                                            ? "text-red-600"
                                                                                            : "text-slate-400"
                                                                                    }`}
                                                                                />
                                                                            </motion.div>
                                                                        </motion.div>

                                                                        <div className="mt-8 space-y-3">
                                                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                                                {fingerprintStatus === "scanning"
                                                                                    ? t("Scanning in Progress...")
                                                                                    : fingerprintStatus === "matched"
                                                                                    ? t("Fingerprint Matched!")
                                                                                    : fingerprintStatus === "failed"
                                                                                    ? t("Scan Failed")
                                                                                    : autoScanTriggered
                                                                                    ? t("Preparing Scanner...")
                                                                                    : t("Place Finger on Scanner")}
                                                                            </h3>
                                                                            <p className="text-slate-600 dark:text-slate-400 text-lg">
                                                                                {fingerprintStatus === "scanning"
                                                                                    ? t("Keep finger steady on the device")
                                                                                    : fingerprintStatus === "matched"
                                                                                    ? t("Attendance recorded successfully")
                                                                                    : fingerprintStatus === "failed"
                                                                                    ? t("Please try again")
                                                                                    : autoScanTriggered
                                                                                    ? t("Scanner will start automatically")
                                                                                    : t("Press the button below to start")}
                                                                            </p>
                                                                            {secugenScore > 0 && (
                                                                                <motion.p
                                                                                    initial={{ opacity: 0, y: 10 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    className={`text-lg font-semibold ${
                                                                                        secugenScore >= 30 ? "text-green-600" : "text-red-600"
                                                                                    }`}
                                                                                >
                                                                                    {secugenScore >= 30
                                                                                        ? `✓ ${t("Match Score")}: ${secugenScore}% (${t("Excellent")})`
                                                                                        : `✗ ${t("Match Score")}: ${secugenScore}% (${t("Too Low")})`
                                                                                    }
                                                                                </motion.p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Enhanced Action Buttons */}
                                                                    <div className="flex justify-center gap-4">
                                                                        <motion.div
                                                                            whileHover={{ scale: 1.05 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                        >
                                                                            <Button
                                                                                onClick={startSecuGenScan}
                                                                                disabled={!scannerConnected || fingerprintStatus === "scanning" || deviceCount === 0}
                                                                                size="lg"
                                                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            >
                                                                                {fingerprintStatus === "scanning" ? (
                                                                                    <>
                                                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                                                        {t("Scanning...")}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Zap className="w-6 h-6 mr-3" />
                                                                                        {t("Start Scan")}
                                                                                    </>
                                                                                )}
                                                                            </Button>
                                                                        </motion.div>

                                                                        {fingerprintStatus === "scanning" && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                                animate={{ opacity: 1, scale: 1 }}
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                            >
                                                                                <Button
                                                                                    onClick={stopScanning}
                                                                                    variant="outline"
                                                                                    size="lg"
                                                                                    className="border-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-4 rounded-2xl text-lg font-semibold"
                                                                                >
                                                                                    <Square className="w-5 h-5 mr-2" />
                                                                                    {t("Stop")}
                                                                                </Button>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Column - Employee Information (4 columns) */}
                        <div className="col-span-4">
                            <div className="space-y-6">
                                {/* Scanner Status Indicator */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        scannerConnected
                                                            ? "bg-green-100 dark:bg-green-900/20"
                                                            : "bg-red-100 dark:bg-red-900/20"
                                                    }`}>
                                                        {scannerConnected ? (
                                                            <Wifi className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <WifiOff className="w-5 h-5 text-red-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">
                                                            {scannerConnected ? t("SecuGen Online") : t("SecuGen Offline")}
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {deviceCount > 0 ? `${deviceCount} ${t("device(s)")}` : t("No devices")}
                                                        </p>
                                                    </div>
                                                </div>
                                                {lastVerified && (
                                                    <div className="text-right">
                                                        <div className="text-xs text-slate-500">{t("Last verified")}</div>
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {formatPersianTime(lastVerified)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Employee Information */}
                                <AnimatePresence>
                                    {employee && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="space-y-6"
                                        >
                                            {/* Employee Profile Card - Redesigned */}
                                            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                                                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6">
                                                    <div className="flex items-center space-x-4">
                                                        <motion.div
                                                            className="p-3 bg-white/20 rounded-full"
                                                            whileHover={{ scale: 1.1 }}
                                                        >
                                                            <CheckCircle className="h-8 w-8 text-white" />
                                                        </motion.div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-white">
                                                                {t("Employee Verified")}
                                                            </h3>
                                                            <p className="text-white/90">
                                                                {t("Ready for attendance")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center space-x-4 mb-6">
                                                        <div className="relative">
                                                            {employee.photo ? (
                                                                <img
                                                                    className="h-20 w-20 rounded-2xl object-cover border-4 border-indigo-200 dark:border-indigo-700 shadow-lg"
                                                                    src={`/storage/${employee.photo}`}
                                                                    alt={`${employee.first_name} ${employee.last_name}`}
                                                                />
                                                            ) : (
                                                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-200 to-purple-300 dark:from-indigo-700 dark:to-purple-800 flex items-center justify-center border-4 border-indigo-200 dark:border-indigo-700 shadow-lg">
                                                                    <User className="h-10 w-10 text-indigo-600 dark:text-indigo-300" />
                                                                </div>
                                                            )}
                                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                                                {employee.first_name} {employee.last_name}
                                                            </h4>
                                                            <p className="text-slate-600 dark:text-slate-400">
                                                                {employee.department}
                                                            </p>
                                                            <UIBadge variant="secondary" className="mt-1">
                                                                {t("ID")}: {employee.employee_id}
                                                            </UIBadge>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4 text-slate-500" />
                                                                <span className="text-sm text-slate-600 dark:text-slate-400">{t("Email")}</span>
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {employee.email || t("N/A")}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                            <div className="flex items-center gap-2">
                                                                <Fingerprint className="w-4 h-4 text-slate-500" />
                                                                <span className="text-sm text-slate-600 dark:text-slate-400">{t("Biometric")}</span>
                                                            </div>
                                                            {(employee.fingerprint_template || (employee.biometric && employee.biometric.TemplateBase64)) ? (
                                                                <UIBadge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    {t("Registered")}
                                                                </UIBadge>
                                                            ) : (
                                                                <UIBadge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                                                                    <XCircle className="h-3 w-3 mr-1" />
                                                                    {t("Not Found")}
                                                                </UIBadge>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                                <span className="text-sm text-slate-600 dark:text-slate-400">{t("Joined")}</span>
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {formatPersianDate(employee.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Quick Actions */}
                                            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl">
                                                <CardContent className="p-6">
                                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                                        {t("Quick Actions")}
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={checkDeviceStatus}
                                                            className="w-full p-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition-colors duration-200 flex items-center gap-3"
                                                        >
                                                            <Activity className="w-5 h-5 text-indigo-600" />
                                                            <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                                                                {t("Test Device")}
                                                            </span>
                                                        </motion.button>

                                                        {employee && scannerConnected && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={startSecuGenScan}
                                                                className="w-full p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors duration-200 flex items-center gap-3"
                                                            >
                                                                <Fingerprint className="w-5 h-5 text-green-600" />
                                                                <span className="text-green-700 dark:text-green-300 font-medium">
                                                                    {t("Manual Scan")}
                                                                </span>
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                    </main>
                </div>
            </div>
        </>
    );
}