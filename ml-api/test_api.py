"""
Simple test script to verify Flask API is working
"""
import requests
import sys

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get('http://localhost:5001/health', timeout=5)
        print(f"✅ Health check: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask API on port 5001")
        print("Make sure Flask API is running: python app.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_classes():
    """Test classes endpoint"""
    try:
        response = requests.get('http://localhost:5001/classes', timeout=5)
        print(f"\n✅ Classes endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    print("🧪 Testing Flask ML API...\n")
    
    health_ok = test_health()
    if health_ok:
        test_classes()
        print("\n✅ Flask API is running correctly!")
    else:
        print("\n❌ Flask API is not running. Start it with: python app.py")
        sys.exit(1)
