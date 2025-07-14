# Face Recognition Implementation Guide

This guide explains how to implement and use the face recognition system in your Laravel application using face-api.js.

## Overview

The face recognition system consists of:
- **Backend**: Laravel API endpoints for face data management
- **Frontend**: JavaScript class for face detection and recognition using face-api.js
- **Database**: Face data storage with descriptors and metadata

## Features

- **Face Registration**: Register employee faces with descriptors
- **Face Verification**: Verify if a face matches a specific employee
- **Face Search**: Search for employees by face
- **Real-time Recognition**: Live face recognition from video stream
- **Multiple Models**: Support for different face-api.js models

## Installation & Setup

### 1. Backend Setup

The backend components are already created and migrated:

- `FaceData` model with relationships
- `FaceRecognitionController` with API endpoints
- Database migration for `face_data` table
- API routes under `/api/face` prefix

### 2. Frontend Setup

#### Install face-api.js Models

1. Create a `models` directory in your `public` folder:
```bash
mkdir public/models
```

2. Download the required models from [face-api.js GitHub](https://github.com/justadudewhohacks/face-api.js/tree/master/weights):
   - `ssd_mobilenetv1_model-weights_manifest.json`
   - `ssd_mobilenetv1_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_expression_model-weights_manifest.json`
   - `face_expression_model-shard1`
   - `age_gender_model-weights_manifest.json`
   - `age_gender_model-shard1`

3. Place all model files in the `public/models/` directory

#### Include JavaScript Files

Add these scripts to your HTML:
```html
<!-- Load face-api.js from CDN -->
<script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>

<!-- Load our face recognition class -->
<script src="js/face-recognition.js"></script>
```

## API Endpoints

### Authentication
All endpoints require authentication via Laravel Sanctum. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Available Endpoints

#### 1. Register Face
```
POST /api/face/register
```

**Parameters:**
- `employee_id` (required): Employee ID
- `face_descriptor` (required): Face descriptor array
- `encoding_model` (optional): Model used for encoding
- `confidence_score` (optional): Detection confidence score
- `image` (optional): Face image file
- `notes` (optional): Additional notes

**Response:**
```json
{
    "success": true,
    "message": "Face data registered successfully",
    "data": {
        "id": 1,
        "employee_id": 123,
        "employee_name": "John Doe",
        "encoding_model": "ssd_mobilenetv1",
        "confidence_score": 0.95,
        "image_path": "face_images/abc123.jpg",
        "is_active": true
    }
}
```

#### 2. Verify Face
```
POST /api/face/verify
```

**Parameters:**
- `employee_id` (required): Employee ID to verify against
- `face_descriptor` (required): Face descriptor array
- `threshold` (optional): Verification threshold (default: 0.6)

**Response:**
```json
{
    "success": true,
    "message": "Face verified successfully",
    "data": {
        "employee_id": 123,
        "employee_name": "John Doe",
        "is_match": true,
        "threshold_used": 0.6,
        "match_details": [...]
    }
}
```

#### 3. Search Face
```
POST /api/face/search
```

**Parameters:**
- `face_descriptor` (required): Face descriptor array
- `threshold` (optional): Search threshold (default: 0.6)
- `limit` (optional): Maximum results (default: 5)

**Response:**
```json
{
    "success": true,
    "message": "Employee found",
    "data": {
        "best_match": {
            "employee_id": 123,
            "employee_name": "John Doe",
            "distance": 0.45
        },
        "all_matches": [...],
        "total_matches": 1
    }
}
```

#### 4. Get Employee Face Data
```
GET /api/face/employee/{employeeId}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "employee_id": 123,
        "employee_name": "John Doe",
        "has_face_data": true,
        "face_data": [...]
    }
}
```

#### 5. Deactivate Face Data
```
POST /api/face/deactivate/{faceDataId}
```

**Response:**
```json
{
    "success": true,
    "message": "Face data deactivated successfully"
}
```

## JavaScript Usage

### Initialize Face Recognition

```javascript
const faceRecognition = new FaceRecognition();

// Load models
await faceRecognition.loadModels();

// Set authentication token
faceRecognition.setAuthToken('your-auth-token');

// Start video stream
const video = document.getElementById('video');
await faceRecognition.startVideo(video);

// Create canvas for detection overlay
const container = document.getElementById('video-container');
faceRecognition.createCanvas(container);
```

### Register Face

```javascript
try {
    const result = await faceRecognition.registerFace(
        employeeId,
        'Registration notes'
    );
    console.log('Face registered:', result);
} catch (error) {
    console.error('Registration error:', error);
}
```

### Verify Face

```javascript
try {
    const result = await faceRecognition.verifyFace(
        employeeId,
        0.6 // threshold
    );
    console.log('Verification result:', result);
} catch (error) {
    console.error('Verification error:', error);
}
```

### Search Face

```javascript
try {
    const result = await faceRecognition.searchFace(
        0.6, // threshold
        5    // limit
    );
    console.log('Search result:', result);
} catch (error) {
    console.error('Search error:', error);
}
```

### Real-time Recognition

```javascript
await faceRecognition.startRealTimeRecognition((employee, detection) => {
    console.log('Employee recognized:', employee.employee_name);
    console.log('Detection confidence:', detection.detection.score);
});
```

## Demo Page

A complete demo page is available at `/face-recognition-demo.html` which demonstrates all features:

1. Model loading
2. Video stream initialization
3. Face registration
4. Face verification
5. Face search
6. Real-time recognition

## Database Structure

### face_data Table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| employee_id | bigint | Foreign key to employees table |
| face_descriptor | json | Face descriptor array from face-api.js |
| encoding_model | varchar | Model used for encoding |
| image_path | varchar | Path to reference image |
| confidence_score | decimal | Detection confidence score |
| is_active | boolean | Whether face data is active |
| notes | text | Additional notes |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

### Employee Model Relationships

The `Employee` model now includes:

```php
// Get all face data for this employee
public function faceData(): HasMany

// Get active face data for this employee
public function activeFaceData(): HasMany

// Check if employee has face data registered
public function hasFaceData(): bool

// Get the primary face data for this employee
public function primaryFaceData()

// Verify employee using face descriptor
public function verifyFace(array $inputDescriptor, float $threshold = 0.6): bool
```

## Configuration

### Face Detection Options

You can configure face detection options:

```javascript
const faceRecognition = new FaceRecognition();

// Custom detection options
await faceRecognition.loadModels();
faceRecognition.faceDetectionOptions = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
    maxResults: 100
});
```

### Recognition Thresholds

Different thresholds for different use cases:

- **High Security**: 0.4-0.5 (stricter matching)
- **Balanced**: 0.6 (default)
- **Relaxed**: 0.7-0.8 (more permissive)

## Security Considerations

1. **HTTPS Required**: Face recognition should only be used over HTTPS
2. **Token Security**: Store authentication tokens securely
3. **Data Privacy**: Face descriptors are sensitive biometric data
4. **Access Control**: Implement proper authorization for face data access
5. **Image Storage**: Consider encryption for stored face images

## Performance Tips

1. **Model Caching**: Models are cached after first load
2. **Batch Processing**: Process multiple faces in batches when possible
3. **Threshold Optimization**: Fine-tune thresholds based on your use case
4. **Database Indexing**: Face data table has proper indexes for performance

## Troubleshooting

### Common Issues

1. **Models Not Loading**: Check model files are in `/public/models/`
2. **Camera Access**: Ensure HTTPS and camera permissions
3. **No Face Detected**: Check lighting and face visibility
4. **Recognition Accuracy**: Adjust threshold values
5. **API Errors**: Verify authentication token and employee IDs

### Debug Mode

Enable debug logging in JavaScript:

```javascript
// Enable debug mode
faceRecognition.debugMode = true;
```

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11+)
- **Edge**: Full support

## License

This implementation uses face-api.js which is MIT licensed. 