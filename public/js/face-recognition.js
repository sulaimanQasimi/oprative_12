/**
 * Face Recognition using face-api.js
 * This script demonstrates how to use face-api.js with the Laravel backend API
 */

class FaceRecognition {
    constructor() {
        this.isModelsLoaded = false;
        this.apiBaseUrl = '/api/face';
        this.authToken = null;
        this.video = null;
        this.canvas = null;
        this.faceDetectionOptions = null;
    }

    /**
     * Initialize face-api.js models
     */
    async loadModels() {
        try {
            console.log('Loading face-api.js models...');
            
            // Load required models
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            await faceapi.nets.ageGenderNet.loadFromUri('/models');
            
            this.isModelsLoaded = true;
            console.log('Face-api.js models loaded successfully');
            
            // Set face detection options
            this.faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ 
                minConfidence: 0.5 
            });
            
        } catch (error) {
            console.error('Error loading face-api.js models:', error);
            throw error;
        }
    }

    /**
     * Set authentication token
     */
    setAuthToken(token) {
        this.authToken = token;
    }

    /**
     * Start video stream
     */
    async startVideo(videoElement) {
        try {
            this.video = videoElement;
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            this.video.srcObject = stream;
            
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    resolve(this.video);
                };
            });
        } catch (error) {
            console.error('Error starting video:', error);
            throw error;
        }
    }

    /**
     * Stop video stream
     */
    stopVideo() {
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    /**
     * Create canvas for face detection overlay
     */
    createCanvas(containerElement) {
        this.canvas = faceapi.createCanvasFromMedia(this.video);
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        containerElement.appendChild(this.canvas);
        
        const displaySize = { width: this.video.width, height: this.video.height };
        faceapi.matchDimensions(this.canvas, displaySize);
        
        return this.canvas;
    }

    /**
     * Detect faces in the video stream
     */
    async detectFaces() {
        if (!this.isModelsLoaded || !this.video) {
            throw new Error('Models not loaded or video not started');
        }

        const detections = await faceapi
            .detectAllFaces(this.video, this.faceDetectionOptions)
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withFaceExpressions()
            .withAgeAndGender();

        return detections;
    }

    /**
     * Draw face detection results on canvas
     */
    drawDetections(detections) {
        if (!this.canvas) return;

        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const displaySize = { width: this.video.width, height: this.video.height };
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Draw face detection boxes
        faceapi.draw.drawDetections(this.canvas, resizedDetections);
        
        // Draw face landmarks
        faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);
        
        // Draw face expressions
        faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections);
        
        // Draw age and gender
        resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { 
                label: `${Math.round(detection.age)} years, ${detection.gender}` 
            });
            drawBox.draw(this.canvas);
        });
    }

    /**
     * Capture and register face for an employee
     */
    async registerFace(employeeId, notes = '') {
        try {
            if (!this.isModelsLoaded) {
                throw new Error('Models not loaded');
            }

            const detections = await this.detectFaces();
            
            if (detections.length === 0) {
                throw new Error('No face detected');
            }

            if (detections.length > 1) {
                throw new Error('Multiple faces detected. Please ensure only one face is visible.');
            }

            const detection = detections[0];
            const faceDescriptor = Array.from(detection.descriptor);
            
            // Capture image from video
            const canvas = document.createElement('canvas');
            canvas.width = this.video.videoWidth;
            canvas.height = this.video.videoHeight;
            canvas.getContext('2d').drawImage(this.video, 0, 0);
            
            // Convert canvas to blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
            
            // Prepare form data
            const formData = new FormData();
            formData.append('employee_id', employeeId);
            formData.append('face_descriptor', JSON.stringify(faceDescriptor));
            formData.append('encoding_model', 'ssd_mobilenetv1');
            formData.append('confidence_score', detection.detection.score);
            formData.append('image', blob, 'face-capture.jpg');
            formData.append('notes', notes);

            const response = await fetch(`${this.apiBaseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            return result;
        } catch (error) {
            console.error('Face registration error:', error);
            throw error;
        }
    }

    /**
     * Verify face against registered employee
     */
    async verifyFace(employeeId, threshold = 0.6) {
        try {
            if (!this.isModelsLoaded) {
                throw new Error('Models not loaded');
            }

            const detections = await this.detectFaces();
            
            if (detections.length === 0) {
                throw new Error('No face detected');
            }

            if (detections.length > 1) {
                throw new Error('Multiple faces detected. Please ensure only one face is visible.');
            }

            const detection = detections[0];
            const faceDescriptor = Array.from(detection.descriptor);

            const response = await fetch(`${this.apiBaseUrl}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    employee_id: employeeId,
                    face_descriptor: faceDescriptor,
                    threshold: threshold
                })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Verification failed');
            }

            return result;
        } catch (error) {
            console.error('Face verification error:', error);
            throw error;
        }
    }

    /**
     * Search for employee by face
     */
    async searchFace(threshold = 0.6, limit = 5) {
        try {
            if (!this.isModelsLoaded) {
                throw new Error('Models not loaded');
            }

            const detections = await this.detectFaces();
            
            if (detections.length === 0) {
                throw new Error('No face detected');
            }

            if (detections.length > 1) {
                throw new Error('Multiple faces detected. Please ensure only one face is visible.');
            }

            const detection = detections[0];
            const faceDescriptor = Array.from(detection.descriptor);

            const response = await fetch(`${this.apiBaseUrl}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    face_descriptor: faceDescriptor,
                    threshold: threshold,
                    limit: limit
                })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Search failed');
            }

            return result;
        } catch (error) {
            console.error('Face search error:', error);
            throw error;
        }
    }

    /**
     * Get employee face data
     */
    async getEmployeeFaceData(employeeId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/employee/${employeeId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to get employee face data');
            }

            return result;
        } catch (error) {
            console.error('Get employee face data error:', error);
            throw error;
        }
    }

    /**
     * Start real-time face recognition
     */
    async startRealTimeRecognition(onRecognition) {
        if (!this.isModelsLoaded || !this.video) {
            throw new Error('Models not loaded or video not started');
        }

        const recognitionLoop = async () => {
            try {
                const detections = await this.detectFaces();
                
                if (detections.length > 0) {
                    this.drawDetections(detections);
                    
                    // Perform face search for each detected face
                    for (const detection of detections) {
                        const faceDescriptor = Array.from(detection.descriptor);
                        
                        try {
                            const searchResult = await this.searchFace();
                            if (searchResult.data.best_match) {
                                onRecognition(searchResult.data.best_match, detection);
                            }
                        } catch (error) {
                            console.warn('Recognition error:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('Recognition loop error:', error);
            }
            
            requestAnimationFrame(recognitionLoop);
        };

        recognitionLoop();
    }
}

// Usage example
/*
const faceRecognition = new FaceRecognition();

// Initialize
async function init() {
    try {
        await faceRecognition.loadModels();
        faceRecognition.setAuthToken('your-auth-token');
        
        const video = document.getElementById('video');
        await faceRecognition.startVideo(video);
        
        const container = document.getElementById('video-container');
        faceRecognition.createCanvas(container);
        
        // Start real-time recognition
        faceRecognition.startRealTimeRecognition((employee, detection) => {
            console.log('Employee recognized:', employee);
        });
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Register face
async function registerFace(employeeId) {
    try {
        const result = await faceRecognition.registerFace(employeeId, 'Registered via webcam');
        console.log('Face registered successfully:', result);
    } catch (error) {
        console.error('Registration error:', error);
    }
}

// Verify face
async function verifyFace(employeeId) {
    try {
        const result = await faceRecognition.verifyFace(employeeId);
        console.log('Verification result:', result);
    } catch (error) {
        console.error('Verification error:', error);
    }
}

// Search face
async function searchFace() {
    try {
        const result = await faceRecognition.searchFace();
        console.log('Search result:', result);
    } catch (error) {
        console.error('Search error:', error);
    }
}
*/ 