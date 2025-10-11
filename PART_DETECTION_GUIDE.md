# Part Detection Feature Guide

## Overview

The system now has a two-step damage detection process:
1. **Step 1**: Detect if car is damaged or not (binary classification)
2. **Step 2**: If damaged, detect which part is damaged (EfficientNet model)

## User Flow

```
1. Upload car image
   ↓
2. Click "Predict"
   ↓
3. View result: "Damaged" or "Not Damaged"
   ↓
4. If "Damaged" → "Next" button appears
   ↓
5. Click "Next: Detect Damaged Part"
   ↓
6. Navigate to Part Detection page
   ↓
7. Click "Detect Damaged Part"
   ↓
8. View which part is damaged (e.g., "Front Bumper")
```

## Models Required

### 1. Damage Detection Model
- **File**: `car_damage_classification_model.h5`
- **Location**: `ml-api/`
- **Purpose**: Binary classification (Damaged vs Not Damaged)
- **Output**: 2 classes

### 2. Part Detection Model (EfficientNet)
- **File**: `effcientnet_car_damage.h5`
- **Location**: `ml-api/`
- **Purpose**: Multi-class classification of car parts
- **Output**: 12 classes (default)

## Setup Instructions

### 1. Place Model Files

```bash
cd ml-api

# Place your models
cp /path/to/car_damage_classification_model.h5 .
cp /path/to/effcientnet_car_damage.h5 .
```

### 2. Update Car Part Classes

Edit `ml-api/app.py` lines 28-43 to match your EfficientNet model's output:

```python
CAR_PART_CLASSES = [
    'Front Bumper',
    'Rear Bumper',
    'Front Door',
    'Rear Door',
    'Hood',
    'Trunk',
    'Headlight',
    'Taillight',
    'Side Mirror',
    'Windshield',
    'Wheel/Tire',
    'Fender'
]
```

**Important**: The order must match your model's training labels!

### 3. Restart Flask API

```bash
cd ml-api
venv\Scripts\activate
python app.py
```

**Expected output:**
```
✅ Damage model loaded successfully from car_damage_classification_model.h5
✅ Part model loaded successfully from effcientnet_car_damage.h5
🌐 Starting server on http://localhost:5001
```

### 4. Restart Backend

```bash
cd backend
npm start
```

### 5. Test the Flow

1. Go to `http://localhost:5173`
2. Sign in
3. Upload a damaged car image
4. Click "Predict"
5. If result is "Damaged", click "Next: Detect Damaged Part"
6. Click "Detect Damaged Part"
7. View which part is damaged

## API Endpoints

### Flask ML API (Port 5001)

#### Damage Detection
```
POST /predict
Body: multipart/form-data with 'image' file
Response: {
  "success": true,
  "is_damaged": true,
  "damage_status": "Damaged",
  "confidence": 87.5,
  "all_predictions": {...}
}
```

#### Part Detection
```
POST /predict-part
Body: multipart/form-data with 'image' file
Response: {
  "success": true,
  "damaged_part": "Front Bumper",
  "confidence": 92.3,
  "all_predictions": {...}
}
```

### Backend API (Port 5000)

#### Upload & Detect Damage
```
POST /api/images/upload
Headers: Authorization: Bearer <token>
Body: multipart/form-data with 'image' file
```

#### Detect Part
```
POST /api/images/detect-part
Headers: Authorization: Bearer <token>
Body: multipart/form-data with 'image' file
```

## Frontend Routes

- `/prediction` - Upload image and detect damage
- `/part` - Detect which part is damaged

## Features

### Prediction Page
- ✅ Upload car image
- ✅ Binary damage detection
- ✅ "Next" button (only shows if damaged)
- ✅ Image stays visible after prediction

### Part Detection Page
- ✅ Shows previous damage result
- ✅ Displays uploaded image
- ✅ Detects specific car part
- ✅ Shows all part predictions with confidence
- ✅ Back button to return to upload
- ✅ Print report button

## Mock Predictions

The system works **without models** using mock predictions:

### Without Damage Model
- Returns random "Damaged" or "Not Damaged"
- 70-95% confidence

### Without Part Model
- Returns random car part
- Shows all 12 parts with random confidence

## Customizing Part Classes

If your EfficientNet model has different classes:

### Example: 6 Classes

```python
CAR_PART_CLASSES = [
    'Bumper',
    'Door',
    'Hood',
    'Trunk',
    'Light',
    'Mirror'
]
```

### Example: More Specific Classes

```python
CAR_PART_CLASSES = [
    'Front Bumper - Left',
    'Front Bumper - Center',
    'Front Bumper - Right',
    'Front Door - Driver',
    'Front Door - Passenger',
    'Rear Door - Driver',
    'Rear Door - Passenger',
    'Hood',
    'Trunk',
    'Headlight - Left',
    'Headlight - Right',
    'Taillight - Left',
    'Taillight - Right',
    'Side Mirror - Left',
    'Side Mirror - Right',
    'Windshield',
    'Rear Window',
    'Wheel - Front Left',
    'Wheel - Front Right',
    'Wheel - Rear Left',
    'Wheel - Rear Right'
]
```

## EfficientNet Input Size

If your EfficientNet model uses different input size:

Edit `ml-api/app.py` line 262:

```python
# For EfficientNet-B0: 224x224
processed_image = preprocess_image(image_bytes, target_size=(224, 224))

# For EfficientNet-B4: 380x380
processed_image = preprocess_image(image_bytes, target_size=(380, 380))

# For EfficientNet-B7: 600x600
processed_image = preprocess_image(image_bytes, target_size=(600, 600))
```

## Troubleshooting

### Issue: "Next" button doesn't appear

**Cause**: Result is "Not Damaged"

**Solution**: The button only appears when `isDamaged: true`

### Issue: Part detection shows wrong parts

**Cause**: CAR_PART_CLASSES doesn't match model output

**Solution**: 
1. Check your model's training labels
2. Update CAR_PART_CLASSES in exact same order
3. Restart Flask API

### Issue: Part model not loading

**Error**: `⚠️ Part model file not found`

**Solution**:
1. Check filename: `effcientnet_car_damage.h5` (note the spelling)
2. Place file in `ml-api/` folder
3. Restart Flask API

### Issue: Image doesn't pass to Part page

**Cause**: Image preview not available

**Solution**: Upload image again, ensure it shows preview before clicking "Next"

## Testing

### Test Damage Detection
```bash
curl -X POST -F "image=@test_car.jpg" http://localhost:5001/predict
```

### Test Part Detection
```bash
curl -X POST -F "image=@test_car.jpg" http://localhost:5001/predict-part
```

## Production Considerations

1. **Model Optimization**: Consider using TensorFlow Lite for faster inference
2. **Caching**: Cache predictions to avoid re-processing same images
3. **Batch Processing**: Process multiple images in parallel
4. **GPU Support**: Use TensorFlow-GPU for faster predictions
5. **Model Versioning**: Track model versions in database

## Next Steps

- Add severity detection (minor, moderate, severe)
- Add cost estimation based on damaged part
- Add repair recommendations
- Add multi-part damage detection
- Add damage visualization (bounding boxes)
