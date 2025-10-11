# Car Damage Classification Model Guide

## Model Configuration

The Flask API is configured for **binary classification** (Damaged vs Not Damaged).

### Current Settings

In `app.py`:

```python
# Binary classification mode
IS_BINARY_CLASSIFICATION = True

DAMAGE_CLASSES = [
    'Damaged',      # Index 0
    'Not Damaged'   # Index 1
]
```

## Model Output Format

Your `.h5` model should output predictions in one of these formats:

### Option 1: Binary Classification (Recommended)
```python
# Model output shape: (1, 2)
# Example: [0.85, 0.15]
# Means: 85% Damaged, 15% Not Damaged
```

### Option 2: Single Output (Binary)
```python
# Model output shape: (1, 1)
# Example: [0.85]
# Means: 85% probability of being damaged
```

## How Predictions Work

### 1. **Image Upload**
User uploads a car image through the web interface

### 2. **Preprocessing**
```python
# Image is resized to 224x224 (default)
# Normalized to [0, 1] range
# Batch dimension added
```

### 3. **Model Prediction**
```python
predictions = model.predict(processed_image)
# Returns: array([0.85, 0.15]) for binary classification
```

### 4. **Result Interpretation**
```python
predicted_class_idx = np.argmax(predictions)  # 0 or 1
confidence = predictions[predicted_class_idx] * 100  # 85%

if predicted_class_idx == 0:
    result = "Damaged"
else:
    result = "Not Damaged"
```

### 5. **Display to User**
Results shown directly on the Prediction page with:
- ✅ Green banner: "Not Damaged"
- ⚠️ Red banner: "Damaged"
- Confidence percentage
- Detailed probability breakdown

## Customizing for Your Model

### If your model has different input size:

Edit `app.py` line ~55:

```python
def preprocess_image(image_bytes, target_size=(224, 224)):
    # Change to your model's input size
    # Example: target_size=(299, 299) for InceptionV3
```

### If your model outputs different classes:

**Option A: Keep binary but swap order**

If your model outputs [Not Damaged, Damaged]:

```python
DAMAGE_CLASSES = [
    'Not Damaged',  # Index 0
    'Damaged'       # Index 1
]

# Update line 165 in app.py:
is_damaged = predicted_class_idx == 1  # Now index 1 is "Damaged"
```

**Option B: Multi-class classification**

If you have multiple damage types:

```python
IS_BINARY_CLASSIFICATION = False

DAMAGE_CLASSES = [
    'Minor Scratch',
    'Major Dent',
    'Broken Glass',
    'Bumper Damage',
    'No Damage'
]
```

## Testing Your Model

### 1. Place model file
```bash
cp your_model.h5 car_damage_classification_model.h5
```

### 2. Start Flask API
```bash
python app.py
```

**Expected output:**
```
✅ Model loaded successfully from car_damage_classification_model.h5
📊 Model input shape: (None, 224, 224, 3)
📊 Model output shape: (None, 2)
```

### 3. Test with curl
```bash
curl -X POST -F "image=@test_car.jpg" http://localhost:5001/predict
```

**Expected response:**
```json
{
  "success": true,
  "is_damaged": true,
  "damage_status": "Damaged",
  "confidence": 87.5,
  "all_predictions": {
    "Damaged": 87.5,
    "Not Damaged": 12.5
  }
}
```

## Model Training Tips

If you're training a new model, ensure:

1. **Input shape**: (224, 224, 3) or update `target_size`
2. **Output**: 2 neurons with softmax activation for binary
3. **Classes**: [Damaged, Not Damaged] in that order
4. **Save format**: `.h5` or `.keras`

### Example Keras Model

```python
from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Conv2D(32, 3, activation='relu', input_shape=(224, 224, 3)),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(2, activation='softmax')  # 2 classes: Damaged, Not Damaged
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train your model...
model.save('car_damage_classification_model.h5')
```

## Troubleshooting

### Model loads but predictions are wrong

1. Check if classes are in correct order
2. Verify preprocessing matches training
3. Check if model expects different normalization

### Model won't load

```
Error: Unable to load model
```

**Solutions:**
- Check TensorFlow version compatibility
- Try: `pip install tensorflow==2.14.0`
- Ensure model file is not corrupted

### Predictions are always the same

- Model might not be properly trained
- Check if image preprocessing is correct
- Verify model is actually being used (check for "mock prediction" in response)

## Current Flow

```
User uploads image
       ↓
Frontend sends to Node.js backend
       ↓
Backend forwards to Flask ML API
       ↓
Flask preprocesses image
       ↓
Model predicts: Damaged or Not Damaged
       ↓
Results sent back to backend
       ↓
Stored in MongoDB
       ↓
Displayed on Prediction page
```

No redirect to fraud page - everything shows on the same page!
