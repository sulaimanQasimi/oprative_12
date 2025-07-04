import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import {
    ArrowLeft,
    Save,
    Fingerprint,
    Camera,
    AlertCircle,
    CheckCircle,
    User,
    Shield,
    Activity,
    Trash2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";

export default function EditBiometric({ auth, employee, biometric, permissions }) {
    const { t } = useLaravelReactI18n();
    const [fingerprintImage, setFingerprintImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [captureStatus, setCaptureStatus] = useState(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        serial_number: biometric.SerialNumber || "",
        image_width: biometric.ImageWidth || "",
        image_height: biometric.ImageHeight || "",
        image_dpi: biometric.ImageDPI || "",
        image_quality: biometric.ImageQuality || "",
        nfiq: biometric.NFIQ || "",
        bmp_base64: biometric.BMPBase64 || "",
        template_base64: biometric.TemplateBase64 || "",
        manufacturer: biometric.Manufacturer || "SecuGen",
        model: biometric.Model || "FDU04",
    });

    // Initialize fingerprint image if available
    useEffect(() => {
        if (biometric.BMPBase64) {
            setFingerprintImage("data:image/bmp;base64," + biometric.BMPBase64);
        }
    }, [biometric]);

    // SecuGen WebAPI JavaScript functions
    const captureFP = () => {
        setIsCapturing(true);
        setCaptureStatus("Capturing fingerprint...");
        CallSGIFPGetData(SuccessFunc, ErrorFunc);
    };

    const SuccessFunc = (result) => {
        setIsCapturing(false);
        if (result.ErrorCode == 0) {
            const imageData = "data:image/bmp;base64," + result.BMPBase64;
            setFingerprintImage(imageData);
            setCaptureStatus("Fingerprint captured successfully!");
            
            // Update form data
            setData({
                ...data,
                bmp_base64: result.BMPBase64,
                template_base64: result.TemplateBase64,
                serial_number: result.SerialNumber || data.serial_number,
                image_width: result.ImageWidth || data.image_width,
                image_height: result.ImageHeight || data.image_height,
                image_dpi: result.ImageDPI || data.image_dpi,
                image_quality: result.ImageQuality || data.image_quality,
                nfiq: result.NFIQ || data.nfiq,
            });
        } else {
            setCaptureStatus(`Fingerprint capture failed. Error code: ${result.ErrorCode}`);
        }
    };

    const ErrorFunc = (status) => {
        setIsCapturing(false);
        setCaptureStatus("Check if SGIBIOSRV is running. Unable to connect to fingerprint device.");
    };

    const CallSGIFPGetData = (successCall, failCall) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.template_base64) {
            setCaptureStatus("Please capture a fingerprint before saving.");
            return;
        }
        put(route("admin.employees.biometric.update", employee.id));
    };

    const handleDelete = () => {
        if (confirm(t("Are you sure you want to delete this biometric data? This action cannot be undone."))) {
            router.delete(route("admin.employees.biometric.destroy", employee.id));
        }
    };

    return (
        <>
            <Head title={`${t("Edit Biometric")} - ${employee.first_name} ${employee.last_name}`} />

            <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
                <Navigation auth={auth} currentRoute="admin.employees" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route("admin.employees.show", employee.id)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {t("Edit Biometric")}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {employee.first_name} {employee.last_name} • {employee.employee_id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="default" className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        {t("Registered")}
                                    </Badge>
                                    {permissions.delete_biometric && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDelete}
                                            className="gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            {t("Delete")}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Employee Info Card */}
                            <Card>
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                    <CardTitle className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        {t("Employee Information")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t("Name")}
                                            </Label>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {employee.first_name} {employee.last_name}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t("Employee ID")}
                                            </Label>
                                            <Badge variant="secondary">{employee.employee_id}</Badge>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t("Department")}
                                            </Label>
                                            <Badge variant="outline">{employee.department}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Fingerprint Capture Card */}
                                <Card>
                                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                        <CardTitle className="flex items-center gap-3">
                                            <Fingerprint className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            {t("Fingerprint Capture")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Capture Section */}
                                            <div className="space-y-4">
                                                <Button
                                                    type="button"
                                                    onClick={captureFP}
                                                    disabled={isCapturing}
                                                    className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg"
                                                >
                                                    {isCapturing ? (
                                                        <>
                                                            <Activity className="h-6 w-6 mr-3 animate-pulse" />
                                                            {t("Capturing...")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Camera className="h-6 w-6 mr-3" />
                                                            {t("Re-capture Fingerprint")}
                                                        </>
                                                    )}
                                                </Button>

                                                {captureStatus && (
                                                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                                                        captureStatus.includes("successfully") 
                                                            ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
                                                            : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                                    }`}>
                                                        {captureStatus.includes("successfully") ? (
                                                            <CheckCircle className="h-5 w-5" />
                                                        ) : (
                                                            <AlertCircle className="h-5 w-5" />
                                                        )}
                                                        <span className="text-sm font-medium">{captureStatus}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Preview Section */}
                                            <div className="space-y-4">
                                                <Label className="text-sm font-medium">{t("Fingerprint Preview")}</Label>
                                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800">
                                                    {fingerprintImage ? (
                                                        <img
                                                            id="FPImage1"
                                                            src={fingerprintImage}
                                                            alt="Captured Fingerprint"
                                                            className="mx-auto max-w-full h-auto border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="py-12">
                                                            <Fingerprint className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                            <p className="text-gray-500 dark:text-gray-400">
                                                                {t("No fingerprint image available")}
                                                            </p>
                                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                                                {t("Capture a new fingerprint to see preview")}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Biometric Data Card */}
                                <Card>
                                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                                        <CardTitle className="flex items-center gap-3">
                                            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            {t("Biometric Data")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        {/* Device Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="manufacturer">{t("Manufacturer")}</Label>
                                                <Input
                                                    id="manufacturer"
                                                    value={data.manufacturer}
                                                    onChange={(e) => setData("manufacturer", e.target.value)}
                                                    className="mt-1"
                                                />
                                                {errors.manufacturer && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.manufacturer}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="model">{t("Model")}</Label>
                                                <Input
                                                    id="model"
                                                    value={data.model}
                                                    onChange={(e) => setData("model", e.target.value)}
                                                    className="mt-1"
                                                />
                                                {errors.model && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.model}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Capture Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="image_width">{t("Image Width")}</Label>
                                                <Input
                                                    id="image_width"
                                                    type="number"
                                                    value={data.image_width}
                                                    onChange={(e) => setData("image_width", e.target.value)}
                                                    className="mt-1"
                                                    readOnly
                                                />
                                                {errors.image_width && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.image_width}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="image_height">{t("Image Height")}</Label>
                                                <Input
                                                    id="image_height"
                                                    type="number"
                                                    value={data.image_height}
                                                    onChange={(e) => setData("image_height", e.target.value)}
                                                    className="mt-1"
                                                    readOnly
                                                />
                                                {errors.image_height && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.image_height}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="image_dpi">{t("Image DPI")}</Label>
                                                <Input
                                                    id="image_dpi"
                                                    type="number"
                                                    value={data.image_dpi}
                                                    onChange={(e) => setData("image_dpi", e.target.value)}
                                                    className="mt-1"
                                                    readOnly
                                                />
                                                {errors.image_dpi && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.image_dpi}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="image_quality">{t("Image Quality")}</Label>
                                                <Input
                                                    id="image_quality"
                                                    type="number"
                                                    value={data.image_quality}
                                                    onChange={(e) => setData("image_quality", e.target.value)}
                                                    className="mt-1"
                                                    readOnly
                                                />
                                                {errors.image_quality && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.image_quality}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="nfiq">{t("NFIQ Score")}</Label>
                                                <Input
                                                    id="nfiq"
                                                    type="number"
                                                    value={data.nfiq}
                                                    onChange={(e) => setData("nfiq", e.target.value)}
                                                    className="mt-1"
                                                    readOnly
                                                />
                                                {errors.nfiq && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.nfiq}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="serial_number">{t("Serial Number")}</Label>
                                                <Input
                                                    id="serial_number"
                                                    value={data.serial_number}
                                                    onChange={(e) => setData("serial_number", e.target.value)}
                                                    className="mt-1"
                                                    readOnly
                                                />
                                                {errors.serial_number && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.serial_number}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Template Data */}
                                        <div>
                                            <Label htmlFor="template">{t("Fingerprint Template")}</Label>
                                            <Textarea
                                                id="template"
                                                value={data.template_base64}
                                                onChange={(e) => setData("template_base64", e.target.value)}
                                                rows={6}
                                                className="mt-1 font-mono text-xs"
                                                placeholder={t("Fingerprint template data...")}
                                                readOnly
                                            />
                                            {errors.template_base64 && (
                                                <p className="text-red-600 text-sm mt-1">{errors.template_base64}</p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <Link href={route("admin.employees.show", employee.id)}>
                                                <Button type="button" variant="outline">
                                                    {t("Cancel")}
                                                </Button>
                                            </Link>
                                            <Button
                                                type="submit"
                                                disabled={processing || !data.template_base64}
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {processing ? t("Updating...") : t("Update Biometric")}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 