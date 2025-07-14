import React, { useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import { useLaravelReactI18n } from "laravel-react-i18n";
import * as faceapi from "face-api.js";
import { Button } from "@/Components/ui/button";
import Navigation from "@/Components/Admin/Navigation";

export default function Face({ auth }) {
    const { t } = useLaravelReactI18n();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [status, setStatus] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [result, setResult] = useState(null);
    const [authToken, setAuthToken] = useState("");
    const [processing, setProcessing] = useState(false);

    // Load face-api.js models
    const loadModels = async () => {
        setStatus(t("Loading face-api.js models..."));
        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
        setStatus(t("Models loaded!"));
    };

    // Start webcam
    const startVideo = async () => {
        if (!modelsLoaded) await loadModels();
        setStatus(t("Starting video..."));
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStatus(t("Video started!"));
    };

    // Stop webcam
    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            setStatus(t("Video stopped."));
        }
    };

    // Detect face and get descriptor
    const detectFace = async () => {
        setStatus(t("Detecting face..."));
        const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
        if (!detection) {
            setStatus(t("No face detected!"));
            return null;
        }
        setStatus(t("Face detected!"));
        // Draw box
        const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
        faceapi.draw.drawDetections(canvasRef.current, faceapi.resizeResults(detection, dims));
        return detection.descriptor;
    };

    // Register face
    const registerFace = async () => {
        setProcessing(true);
        setResult(null);
        const descriptor = await detectFace();
        if (!descriptor) {
            setProcessing(false);
            return;
        }
        // Capture image
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
        // Prepare form data
        const formData = new FormData();
        formData.append("employee_id", employeeId);
        formData.append("face_descriptor", JSON.stringify(Array.from(descriptor)));
        formData.append("encoding_model", "ssd_mobilenetv1");
        formData.append("image", blob, "face.jpg");
        setStatus(t("Registering face..."));
        const response = await fetch("/api/face/register", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: formData,
        });
        const data = await response.json();
        setResult(data);
        setStatus(data.message || t("Registration complete!"));
        setProcessing(false);
    };

    // Verify face
    const verifyFace = async () => {
        setProcessing(true);
        setResult(null);
        const descriptor = await detectFace();
        if (!descriptor) {
            setProcessing(false);
            return;
        }
        setStatus(t("Verifying face..."));
        const response = await fetch("/api/face/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                employee_id: employeeId,
                face_descriptor: Array.from(descriptor),
            }),
        });
        const data = await response.json();
        setResult(data);
        setStatus(data.message || t("Verification complete!"));
        setProcessing(false);
    };

    // Search face
    const searchFace = async () => {
        setProcessing(true);
        setResult(null);
        const descriptor = await detectFace();
        if (!descriptor) {
            setProcessing(false);
            return;
        }
        setStatus(t("Searching face..."));
        const response = await fetch("/api/face/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                face_descriptor: Array.from(descriptor),
            }),
        });
        const data = await response.json();
        setResult(data);
        setStatus(data.message || t("Search complete!"));
        setProcessing(false);
    };

    return (
        <>
            <Head title={t("Employee Face Recognition")} />
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation auth={auth} currentRoute="admin.employees.face" />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {t("Employee Face Recognition")}
                            </h1>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="mb-4 flex gap-4">
                                    <input
                                        type="text"
                                        placeholder={t("Auth Token")}
                                        value={authToken}
                                        onChange={e => setAuthToken(e.target.value)}
                                        className="border px-3 py-2 rounded w-1/2"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t("Employee ID")}
                                        value={employeeId}
                                        onChange={e => setEmployeeId(e.target.value)}
                                        className="border px-3 py-2 rounded w-1/2"
                                    />
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <Button onClick={startVideo} disabled={processing}>{t("Start Video")}</Button>
                                    <Button onClick={stopVideo} disabled={processing}>{t("Stop Video")}</Button>
                                    <Button onClick={registerFace} disabled={processing || !employeeId}>{t("Register Face")}</Button>
                                    <Button onClick={verifyFace} disabled={processing || !employeeId}>{t("Verify Face")}</Button>
                                    <Button onClick={searchFace} disabled={processing}>{t("Search Face")}</Button>
                                </div>
                                <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        width={640}
                                        height={480}
                                        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        width={640}
                                        height={480}
                                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">{status}</div>
                                    {result && (
                                        <pre className="mt-2 bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                                            {JSON.stringify(result, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 