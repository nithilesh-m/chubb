"""
Test script to verify Flask API returns correct binary classification
"""
import requests
import json

def test_prediction():
    """Test the prediction endpoint"""
    url = 'http://localhost:5001/predict'
    
    # Test with a dummy image file
    # You can replace this with an actual image path
    test_image_path = 'test_car.jpg'
    
    try:
        # Try with multipart form data
        with open(test_image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(url, files=files, timeout=10)
    except FileNotFoundError:
        print("⚠️  No test image found, testing with base64...")
        # Create a small test image in base64
        import base64
        from PIL import Image
        import io
        
        # Create a small test image
        img = Image.new('RGB', (100, 100), color='red')
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        response = requests.post(
            url,
            json={'image': img_base64},
            timeout=10
        )
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    print(f"Status Code: {response.status_code}")
    print(f"\nResponse:")
    print(json.dumps(response.json(), indent=2))
    
    # Verify response format
    data = response.json()
    if data.get('success'):
        print("\n✅ API is working!")
        print(f"Damage Status: {data.get('damage_status')}")
        print(f"Confidence: {data.get('confidence')}%")
        print(f"All Predictions: {data.get('all_predictions')}")
        
        # Check if it's binary classification
        predictions = data.get('all_predictions', {})
        if set(predictions.keys()) == {'Damaged', 'Not Damaged'}:
            print("\n✅ Correct binary classification!")
        else:
            print(f"\n❌ Wrong classes: {list(predictions.keys())}")
            print("Expected: ['Damaged', 'Not Damaged']")
    else:
        print(f"\n❌ API returned error: {data.get('error')}")

if __name__ == '__main__':
    print("🧪 Testing Flask ML API...\n")
    test_prediction()
