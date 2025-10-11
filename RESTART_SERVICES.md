# How to Restart All Services

## The Problem

Your screenshot shows "Minor Scratch", "Major Dent", "No Damage" instead of "Damaged" and "Not Damaged". This means the Flask API is running an old version.

## Solution: Restart Everything

### Step 1: Stop All Running Services

Press `Ctrl+C` in each terminal to stop:
1. Backend (Node.js)
2. Flask API (Python)
3. Frontend (Vite)

### Step 2: Start Flask API First

```bash
cd C:\Users\harsh\OneDrive\Desktop\major\ml-api

# Activate virtual environment
venv\Scripts\activate

# Start Flask API
python app.py
```

**Verify output shows:**
```
✅ Model loaded successfully...
OR
⚠️  Using mock predictions until model is available

DAMAGE_CLASSES = ['Damaged', 'Not Damaged']  # Should show these 2 classes
```

### Step 3: Test Flask API

Open new terminal:
```bash
cd C:\Users\harsh\OneDrive\Desktop\major\ml-api
venv\Scripts\activate
python test_prediction.py
```

**Expected output:**
```
✅ Correct binary classification!
Damage Status: Damaged (or Not Damaged)
All Predictions: {'Damaged': 87.5, 'Not Damaged': 12.5}
```

### Step 4: Start Backend

```bash
cd C:\Users\harsh\OneDrive\Desktop\major\backend
npm start
```

**Verify output shows:**
```
🚀 T2D Insulin Prediction API running on port 5000
🍃 MongoDB Connected
```

### Step 5: Start Frontend

```bash
cd C:\Users\harsh\OneDrive\Desktop\major\frontend
npm run dev
```

**Verify output shows:**
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### Step 6: Test the Complete Flow

1. Open browser: `http://localhost:5173`
2. Sign in
3. Upload a car image
4. Click "Upload & Predict"

**Expected result:**
```
┌─────────────────────────────┐
│  ⚠️  DAMAGED                │
│  Confidence: 87.5%          │
└─────────────────────────────┘

Detailed Analysis:
Damaged:     ████████░░ 87.5%
Not Damaged: ██░░░░░░░░ 12.5%
```

## Quick Check: Is Flask API Updated?

Visit: `http://localhost:5001/classes`

**Should return:**
```json
{
  "classes": ["Damaged", "Not Damaged"],
  "count": 2
}
```

**If it returns other classes like "Minor Scratch", the Flask API is NOT updated!**

## Common Issues

### Issue: Still showing old classes

**Solution:**
1. Make sure you stopped the old Flask process (Ctrl+C)
2. Check if another Flask process is running:
   ```bash
   netstat -ano | findstr :5001
   ```
3. Kill any old processes
4. Start Flask API again

### Issue: "ML API unavailable" message

**Solution:**
1. Flask API is not running
2. Start Flask API first (Step 2)
3. Wait for it to fully start
4. Then restart backend

### Issue: Browser shows cached results

**Solution:**
1. Hard refresh: `Ctrl+Shift+R`
2. Or clear browser cache
3. Or use incognito mode

## Verification Checklist

Before testing, verify:

- [ ] Flask API running on port 5001
- [ ] Flask API shows binary classification (2 classes)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] You're signed in
- [ ] Browser cache cleared

## Still Not Working?

1. **Check Flask API terminal** - Look for the DAMAGE_CLASSES output
2. **Check backend terminal** - Look for "ML API Error" messages
3. **Check browser console** (F12) - Look for errors
4. **Test Flask API directly**:
   ```bash
   curl http://localhost:5001/classes
   ```

Should return: `{"classes": ["Damaged", "Not Damaged"], "count": 2}`
