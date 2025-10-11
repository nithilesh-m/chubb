# Troubleshooting Guide

## ML API Error: "❌ ML API Error: Error"

This error means the Node.js backend cannot connect to the Flask ML API. Follow these steps:

### Step 1: Check if Flask API is Running

Open a new terminal and run:

```bash
cd ml-api
python test_api.py
```

**Expected output:**
```
✅ Health check: 200
Response: {'status': 'healthy', 'model_loaded': False, ...}
```

**If you see "Cannot connect":**
- Flask API is not running
- Go to Step 2

### Step 2: Start Flask API

**Option A: Use the start script (Recommended)**
```bash
cd ml-api
start.bat
```

**Option B: Manual start**
```bash
cd ml-api

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start Flask API
python app.py
```

**You should see:**
```
🚀 Starting Flask ML API...
📍 Model path: car_damage_classification_model.h5
📍 Model exists: False
⚠️  Using mock predictions until model is available
🌐 Starting server on http://localhost:5001
 * Running on http://0.0.0.0:5001
```

### Step 3: Verify Flask API is Accessible

Open browser and go to: `http://localhost:5001/health`

**Expected response:**
```json
{
  "status": "healthy",
  "model_loaded": false,
  "model_path": "car_damage_classification_model.h5",
  "model_exists": false,
  "classes_count": 6
}
```

### Step 4: Place Your Model File

1. Copy `car_damage_classification_model.h5` to the `ml-api` folder
2. Restart Flask API (Ctrl+C, then `python app.py`)
3. You should see: `✅ Model loaded successfully`

### Step 5: Restart Backend

```bash
cd backend
npm start
```

### Step 6: Test Upload

1. Go to `http://localhost:5173`
2. Sign in
3. Upload a car image
4. Check backend terminal for logs

**Expected logs:**
```
🔬 Calling ML API for prediction...
✅ Prediction result: { damageType: 'Minor Scratch', confidence: 87.5, ... }
```

---

## Common Issues

### Issue: Port 5001 Already in Use

**Error:** `Address already in use`

**Solution:**

1. Find what's using port 5001:
```bash
netstat -ano | findstr :5001
```

2. Kill the process or change Flask port in `app.py`:
```python
app.run(host='0.0.0.0', port=5002, debug=True)
```

3. Update backend `.env`:
```env
ML_API_URL=http://localhost:5002
```

### Issue: Python Dependencies Not Installed

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
cd ml-api
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: TensorFlow Installation Failed

**Error:** `Could not find a version that satisfies the requirement tensorflow`

**Solution:**
```bash
# Use CPU-only version
pip install tensorflow-cpu==2.15.0

# OR use a different version
pip install tensorflow==2.14.0
```

### Issue: Model File Not Found

**Symptom:** API works but uses mock predictions

**Solution:**
1. Ensure `car_damage_classification_model.h5` is in `ml-api/` folder
2. Check file name matches exactly (case-sensitive)
3. Restart Flask API

### Issue: CORS Error in Browser

**Error:** `Access to fetch at 'http://localhost:5001' has been blocked by CORS`

**Solution:**
- Flask CORS is already configured
- Make sure Flask API is running
- Check browser console for actual error

### Issue: Model Loading Error

**Error:** `Error loading model: ...`

**Possible causes:**
1. Model file is corrupted
2. TensorFlow version mismatch
3. Model was saved with different Keras version

**Solution:**
```bash
# Try different TensorFlow versions
pip uninstall tensorflow
pip install tensorflow==2.14.0

# OR
pip install tensorflow==2.13.0
```

### Issue: Prediction Takes Too Long

**Symptom:** Request times out after 30 seconds

**Solution:**

1. Increase timeout in `backend/routes/images.js`:
```javascript
timeout: 60000 // 60 seconds
```

2. Optimize model or use smaller input size

---

## Verification Checklist

Before uploading an image, verify:

- [ ] MongoDB Atlas is accessible (IP whitelisted)
- [ ] Backend is running on port 5000
- [ ] Flask API is running on port 5001
- [ ] Frontend is running on port 5173
- [ ] You're signed in to the app
- [ ] Flask API health check returns 200

## Testing Commands

**Test MongoDB connection:**
```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.log('❌', e.message))"
```

**Test Flask API:**
```bash
cd ml-api
python test_api.py
```

**Test Backend API:**
```bash
curl http://localhost:5000/api/health
```

**Test Frontend:**
Open browser: `http://localhost:5173`

---

## Getting Detailed Error Logs

### Backend Logs
Check the terminal where you ran `npm start` in the backend folder

### Flask API Logs
Check the terminal where you ran `python app.py` in the ml-api folder

### Frontend Logs
Open browser DevTools (F12) → Console tab

### MongoDB Logs
Check MongoDB Atlas → Database → Monitoring

---

## Still Having Issues?

1. **Restart everything:**
   - Stop all terminals (Ctrl+C)
   - Start Flask API first
   - Start Backend second
   - Start Frontend last

2. **Check all ports:**
   ```bash
   netstat -ano | findstr :5000
   netstat -ano | findstr :5001
   netstat -ano | findstr :5173
   ```

3. **Clear browser cache:**
   - F12 → Application → Clear storage
   - Or use incognito mode

4. **Check firewall:**
   - Windows Firewall might block ports
   - Allow Python and Node.js through firewall
