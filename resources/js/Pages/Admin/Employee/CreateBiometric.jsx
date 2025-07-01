import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
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
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import Navigation from "@/Components/Admin/Navigation";

export default function CreateBiometric({ auth, employee, permissions }) {
    const { t } = useLaravelReactI18n();
    const [fingerprintImage, setFingerprintImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [captureStatus, setCaptureStatus] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        serial_number: "",
        image_width: "",
        image_height: "",
        image_dpi: "",
        image_quality: "",
        nfiq: "",
        bmp_base64: "",
        template_base64: "",
        manufacturer: "SecuGen",
        model: "FDU04",
    });

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
                serial_number: result.SerialNumber || "Unknown",
                image_width: result.ImageWidth || 320,
                image_height: result.ImageHeight || 240,
                image_dpi: result.ImageDPI || 500,
                image_quality: result.ImageQuality || 80,
                nfiq: result.NFIQ || 4,
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
        post(route("admin.employees.biometric.store", employee.id));
    };

    return (
        <>
            <Head title={`${t("Create Biometric")} - ${employee.first_name} ${employee.last_name}`} />

            <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
                <Navigation auth={auth} currentRoute="admin.employees" />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {t("Create Biometric")}
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {employee.first_name} {employee.last_name} • {employee.employee_id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Badge variant="outline" className="flex items-center gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                                        <Shield className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                        {t("New Registration")}
                                    </Badge>
                                    <Link
                                        href={route("admin.employees.show", employee.id)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Employee Info Card */}
                            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200 dark:border-slate-700">
                                    <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        {t("Employee Information")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {t("Name")}
                                            </Label>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {employee.first_name} {employee.last_name}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {t("Employee ID")}
                                            </Label>
                                            <Badge className="dark:text-white" variant="secondary">{employee.employee_id}</Badge>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {t("Department")}
                                            </Label>
                                            <Badge variant="outline">{employee.department}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Fingerprint Capture Card */}
                                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
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
                                                            {t("Capture Fingerprint")}
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
                                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("Fingerprint Preview")}</Label>
                                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center bg-slate-50 dark:bg-slate-800">
                                                    {fingerprintImage ? (
                                                        <img
                                                            id="FPImage1"
                                                            src={fingerprintImage}
                                                            alt="Captured Fingerprint"
                                                            className="mx-auto max-w-full h-auto border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="py-12">
                                                            <Fingerprint className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                                                            <p className="text-slate-500 dark:text-slate-400">
                                                                {t("No fingerprint captured yet")}
                                                            </p>
                                                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                                                                {t("Click the capture button to scan fingerprint")}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Biometric Data Card */}
                                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                                            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            {t("Biometric Data")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        {/* Device Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="manufacturer" className="text-slate-700 dark:text-slate-300">{t("Manufacturer")}</Label>
                                                <Input
                                                    id="manufacturer"
                                                    value={data.manufacturer}
                                                    onChange={(e) => setData("manufacturer", e.target.value)}
                                                    className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors.manufacturer && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.manufacturer}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="model" className="text-slate-700 dark:text-slate-300">{t("Model")}</Label>
                                                <Input
                                                    id="model"
                                                    value={data.model}
                                                    onChange={(e) => setData("model", e.target.value)}
                                                    className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                />
                                                {errors.model && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.model}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Capture Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="image_width" className="text-slate-700 dark:text-slate-300">{t("Image Width")}</Label>
                                                <Input
                                                    id="image_width"
                                                    type="number"
                                                    value={data.image_width}
                                                    onChange={(e) => setData("image_width", e.target.value)}
                                                    className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                    readOnly
                                                />
                                                {errors.image_width && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.image_width}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="image_height" className="text-slate-700 dark:text-slate-300">{t("Image Height")}</Label>
                                                <Input
                                                    id="image_height"
                                                    type="number"
                                                    value={data.image_height}
                                                    onChange={(e) => setData("image_height", e.target.value)}
                                                    className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                    readOnly
                                                />
                                                {errors.image_height && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.image_height}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="image_dpi" className="text-slate-700 dark:text-slate-300">{t("Image DPI")}</Label>
                                                <Input
                                                    id="image_dpi"
                                                    type="number"
                                                    value={data.image_dpi}
                                                    onChange={(e) => setData("image_dpi", e.target.value)}
                                                    className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                    readOnly
                                                />
                                                {errors.image_dpi && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.image_dpi}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="image_quality" className="text-slate-700 dark:text-slate-300">{t("Image Quality")}</Label>
                                                <Input
                                                    id="image_quality"
                                                    type="number"
                                                    value={data.image_quality}
                                                    onChange={(e) => setData("image_quality", e.target.value)}
                                                    className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                    readOnly
                                                />
                                                {errors.image_quality && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.image_quality}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="nfiq" className="text-slate-700 dark:text-slate-300">{t("NFIQ Score")}</Label>
                                                <Input
                                                    id="nfiq"
                                                    type="number"
                                                    value={data.nfiq}
                                                    onChange={(e) => setData("nfiq", e.target.value)}
                                                    className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                    readOnly
                                                />
                                                {errors.nfiq && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.nfiq}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="serial_number" className="text-slate-700 dark:text-slate-300">{t("Serial Number")}</Label>
                                                <Input
                                                    id="serial_number"
                                                    value={data.serial_number}
                                                    onChange={(e) => setData("serial_number", e.target.value)}
                                                    className="mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                    readOnly
                                                />
                                                {errors.serial_number && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.serial_number}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Template Data */}
                                        <div>
                                            <Label htmlFor="template" className="text-slate-700 dark:text-slate-300">{t("Fingerprint Template")}</Label>
                                            <Textarea
                                                id="template"
                                                value={data.template_base64}
                                                onChange={(e) => setData("template_base64", e.target.value)}
                                                rows={6}
                                                className="mt-1 font-mono text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                                placeholder={t("Fingerprint template data will appear here after capture...")}
                                                readOnly
                                            />
                                            {errors.template_base64 && (
                                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.template_base64}</p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                                            <Link href={route("admin.employees.show", employee.id)}>
                                                <Button type="button" variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                    {t("Cancel")}
                                                </Button>
                                            </Link>
                                            <Button
                                                type="submit"
                                                disabled={processing || !data.template_base64}
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {processing ? t("Saving...") : t("Save Biometric")}
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