# Face-API.js Models

This folder should contain the face-api.js model files for face detection and recognition.

## Required Models

Download the following models from the face-api.js repository:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

1. **tiny_face_detector_model-weights_manifest.json** + shard files
2. **face_landmark_68_model-weights_manifest.json** + shard files  
3. **face_recognition_model-weights_manifest.json** + shard files

## Setup Instructions

1. Download the model files from the link above
2. Place all files in this `/public/models/` directory
3. The application will automatically load the models

## Note

For the hackathon demo, the application includes a simulation mode that works without the actual models. Face detection simulation is used when models are not available.

## File Structure Expected

```
/public/models/
├── tiny_face_detector_model-weights_manifest.json
├── tiny_face_detector_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── face_landmark_68_model-shard1
├── face_recognition_model-weights_manifest.json
└── face_recognition_model-shard1
```
