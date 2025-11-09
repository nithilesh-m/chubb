from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
import os
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the models
MODEL_PATH = "car_damage_classification_model.h5"
PART_MODEL_PATH = "effcientnet_car_damage.h5"
model = None
part_model = None

# Define damage classes - Binary classification
# If your model outputs: [damaged, not_damaged] or similar
# Update these based on your actual model's output
DAMAGE_CLASSES = [
    'Damaged',
    'Not Damaged'
]

# Define car part classes for EfficientNet model
# Update these based on your EfficientNet model's output
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
# Set this to True if your model is binary classification
# Set to False if you have multiple damage types
IS_BINARY_CLASSIFICATION = True

def load_model():
    """Load the Keras models"""
    global model, part_model
    try:
        # Load damage detection model
        if os.path.exists(MODEL_PATH):
            model = keras.models.load_model(MODEL_PATH)
            print(f"Damage model loaded successfully from {MODEL_PATH}")
            print(f"Model input shape: {model.input_shape}")
            print(f"Model output shape: {model.output_shape}")
        else:
            print(f"Damage model file not found: {MODEL_PATH}")
            print("Using mock predictions for damage detection")
        
        # Load part detection model (EfficientNet)
        if os.path.exists(PART_MODEL_PATH):
            part_model = keras.models.load_model(PART_MODEL_PATH)
            print(f"Part model loaded successfully from {PART_MODEL_PATH}")
            print(f"Part model input shape: {part_model.input_shape}")
            print(f"Part model output shape: {part_model.output_shape}")
        else:
            print(f"Part model file not found: {PART_MODEL_PATH}")
            print("Using mock predictions for part detection")
    except Exception as e:
        print(f"Error loading models: {str(e)}")
        print("Using mock predictions")

def preprocess_image(image_bytes, target_size=(224, 224)):
    """
    Preprocess image for model prediction
        image_bytes: Raw image bytes
        target_size: Target size for the model (default: 224x224)
    Returns:
        Preprocessed numpy array
    """
    try:
        # Open image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to target size
        image = image.resize(target_size)
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Normalize pixel values to [0, 1]
        img_array = img_array.astype('float32') / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

def mock_prediction():
    """Generate mock prediction when model is not available"""
    # Random prediction for testing
    if IS_BINARY_CLASSIFICATION:
        # Binary: Damaged or Not Damaged
        # Generate random probabilities that sum to 100
        damaged_prob = np.random.random() * 100
        not_damaged_prob = 100 - damaged_prob
        
        # Determine which is higher
        is_damaged = damaged_prob > not_damaged_prob
        confidence = max(damaged_prob, not_damaged_prob)
        
        return {
            'is_damaged': is_damaged,
            'damage_status': 'Damaged' if is_damaged else 'Not Damaged',
            'confidence': round(confidence, 2),
            'all_predictions': {
                'Damaged': round(damaged_prob, 2),
                'Not Damaged': round(not_damaged_prob, 2)
            }
        }
    else:
        # Multi-class prediction
        predictions = np.random.dirichlet(np.ones(len(DAMAGE_CLASSES)), size=1)[0]
        predicted_class_idx = np.argmax(predictions)
        confidence = float(predictions[predicted_class_idx]) * 100
        
        return {
            'damage_type': DAMAGE_CLASSES[predicted_class_idx],
            'confidence': round(confidence, 2),
            'all_predictions': {
                DAMAGE_CLASSES[i]: round(float(predictions[i]) * 100, 2)
                for i in range(len(DAMAGE_CLASSES))
            }
        }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH,
        'model_exists': os.path.exists(MODEL_PATH),
        'classes_count': len(DAMAGE_CLASSES)
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict car damage from uploaded image
    Accepts: multipart/form-data with 'image' file
    OR JSON with base64 encoded image
    """
    try:
        image_bytes = None
        
        # Check if image is sent as file
        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            image_bytes = file.read()
        
        # Check if image is sent as base64 in JSON
        elif request.is_json and 'image' in request.json:
            try:
                base64_data = request.json['image']
                # Remove data URL prefix if present
                if ',' in base64_data:
                    base64_data = base64_data.split(',')[1]
                image_bytes = base64.b64decode(base64_data)
            except Exception as e:
                return jsonify({'error': f'Invalid base64 image: {str(e)}'}), 400
        
        else:
            return jsonify({'error': 'No image provided'}), 400
        
        # Preprocess image
        processed_image = preprocess_image(image_bytes)
        
        # Make prediction
        if model is not None:
            # Real model prediction
            predictions = model.predict(processed_image, verbose=0)[0]
            predicted_class_idx = np.argmax(predictions)
            confidence = float(predictions[predicted_class_idx]) * 100
            
            if IS_BINARY_CLASSIFICATION:
                # Binary classification result
                is_damaged = bool(predicted_class_idx == 0)  # Convert to Python bool
                result = {
                    'success': True,
                    'is_damaged': is_damaged,
                    'damage_status': 'Damaged' if is_damaged else 'Not Damaged',
                    'confidence': round(float(confidence), 2),
                    'all_predictions': {
                        DAMAGE_CLASSES[i] if i < len(DAMAGE_CLASSES) else f'Class {i}': round(float(predictions[i]) * 100, 2)
                        for i in range(len(predictions))
                    }
                }
            else:
                # Multi-class classification result
                result = {
                    'success': True,
                    'damage_type': DAMAGE_CLASSES[predicted_class_idx] if predicted_class_idx < len(DAMAGE_CLASSES) else f'Class {predicted_class_idx}',
                    'confidence': round(confidence, 2),
                    'all_predictions': {
                        DAMAGE_CLASSES[i] if i < len(DAMAGE_CLASSES) else f'Class {i}': round(float(predictions[i]) * 100, 2)
                        for i in range(len(predictions))
                    }
                }
        else:
            # Mock prediction
            mock_result = mock_prediction()
            result = {
                'success': True,
                **mock_result,
                'note': 'Using mock prediction - model not loaded'
            }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get list of damage classes"""
    return jsonify({
        'classes': DAMAGE_CLASSES,
        'count': len(DAMAGE_CLASSES)
    })

@app.route('/predict-part', methods=['POST'])
def predict_part():
    """
    Predict which car part is damaged using EfficientNet model
    Accepts: multipart/form-data with 'image' file OR JSON with base64 encoded image
    """
    try:
        # Get image from request
        if 'image' in request.files:
            file = request.files['image']
            image_bytes = file.read()
        elif request.is_json and 'image' in request.json:
            image_base64 = request.json['image']
            image_bytes = base64.b64decode(image_base64)
        else:
            return jsonify({
                'success': False,
                'error': 'No image provided'
            }), 400
        
        # Preprocess image (EfficientNet typically uses 224x224 or 299x299)
        processed_image = preprocess_image(image_bytes, target_size=(224, 224))
        
        # Make prediction
        if part_model is not None:
            # Real model prediction
            predictions = part_model.predict(processed_image, verbose=0)[0]
            predicted_class_idx = np.argmax(predictions)
            confidence = float(predictions[predicted_class_idx]) * 100
            
            result = {
                'success': True,
                'damaged_part': CAR_PART_CLASSES[predicted_class_idx] if predicted_class_idx < len(CAR_PART_CLASSES) else f'Part {predicted_class_idx}',
                'confidence': round(float(confidence), 2),
                'all_predictions': {
                    CAR_PART_CLASSES[i] if i < len(CAR_PART_CLASSES) else f'Part {i}': round(float(predictions[i]) * 100, 2)
                    for i in range(len(predictions))
                }
            }
        else:
            # Mock prediction
            predictions = np.random.dirichlet(np.ones(len(CAR_PART_CLASSES)), size=1)[0]
            predicted_class_idx = np.argmax(predictions)
            confidence = float(predictions[predicted_class_idx]) * 100
            
            result = {
                'success': True,
                'damaged_part': CAR_PART_CLASSES[predicted_class_idx],
                'confidence': round(confidence, 2),
                'all_predictions': {
                    CAR_PART_CLASSES[i]: round(float(predictions[i]) * 100, 2)
                    for i in range(len(CAR_PART_CLASSES))
                },
                'note': 'Using mock prediction - part model not loaded'
            }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Part prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Flask ML API...")
    print(f"Damage model path: {MODEL_PATH}")
    print(f"Part model path: {PART_MODEL_PATH}")
    print(f"Damage model exists: {os.path.exists(MODEL_PATH)}")
    print(f"Part model exists: {os.path.exists(PART_MODEL_PATH)}")
    load_model()
    print("Starting server on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
