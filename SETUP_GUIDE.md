# CHUBB Claims - Car Damage Detection Setup Guide

Complete setup guide for the car damage detection and fraud analysis system.

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   React     │─────▶│   Node.js    │─────▶│   Flask     │─────▶│  TensorFlow  │
│  Frontend   │      │   Backend    │      │   ML API    │      │    Model     │
│ (Port 5173) │      │ (Port 5000)  │      │ (Port 5001) │      │    (.h5)     │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
       │                     │
       │                     │
       │                     ▼
       │              ┌──────────────┐
       │              │   MongoDB    │
       │              │    Atlas     │
       └──────────────┴──────────────┘
```

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB Atlas account
- Your trained model: `car_damage_classification_model.h5`

## Step 1: MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Sign in and select your cluster
3. **Network Access**: Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
4. **Database Access**: Create a user with read/write permissions
5. Get your connection string

## Step 2: Backend Setup (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Update .env file with your MongoDB credentials
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insulin-predictor?retryWrites=true&w=majority

# Start the backend
npm start
```

Backend will run on `http://localhost:5000`

## Step 3: ML API Setup (Flask)

```bash
cd ml-api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# IMPORTANT: Copy your model file
# Place car_damage_classification_model.h5 in the ml-api folder

# Start Flask API
python app.py
```

Flask API will run on `http://localhost:5001`

### Update Model Classes

Edit `ml-api/app.py` and update the `DAMAGE_CLASSES` list to match your model's output:

```python
DAMAGE_CLASSES = [
    'Minor Scratch',
    'Major Dent',
    'Broken Glass',
    'Flat Tire',
    'Bumper Damage',
    'No Damage'
]
```

## Step 4: Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Step 5: Test the Complete Flow

1. **Sign Up**: Create a new account at `http://localhost:5173/signup`
2. **Sign In**: Login with your credentials
3. **Upload Image**: Select a car damage image
4. **View Prediction**: 
   - Image uploads to MongoDB
   - Node.js backend calls Flask ML API
   - ML model predicts damage type
   - Automatically redirects to fraud detection page
5. **Fraud Analysis**: View ML predictions and fraud analysis

## API Endpoints

### Node.js Backend (Port 5000)

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/images/upload` - Upload image and get prediction
- `GET /api/images/my-images` - Get user's uploaded images
- `GET /api/health` - Health check

### Flask ML API (Port 5001)

- `GET /health` - Health check
- `POST /predict` - Predict car damage from image
- `GET /classes` - Get damage classes

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseError: Operation buffering timed out`

**Solution**: 
1. Check Network Access in MongoDB Atlas
2. Whitelist your IP address (0.0.0.0/0 for development)
3. Verify connection string in `.env`

### Token Not Valid

**Solution**: 
1. Clear browser localStorage (F12 → Application → Local Storage → Clear)
2. Sign out and sign in again

### ML API Not Responding

**Solution**:
1. Ensure Flask API is running on port 5001
2. Check if model file exists in `ml-api/` folder
3. Check Flask console for errors
4. Verify Python dependencies are installed

### Model Not Loading

**Solution**:
1. Ensure `car_damage_classification_model.h5` is in `ml-api/` folder
2. Check TensorFlow/Keras version compatibility
3. Flask will use mock predictions if model fails to load

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insulin-predictor?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
ML_API_URL=http://localhost:5001
```

## Running All Services

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - ML API:**
```bash
cd ml-api
venv\Scripts\activate  # Windows
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## Production Deployment

1. **Backend**: Deploy to Heroku, Railway, or AWS
2. **ML API**: Deploy to Heroku, AWS Lambda, or Google Cloud Run
3. **Frontend**: Deploy to Vercel, Netlify, or AWS S3
4. Update environment variables with production URLs
5. Enable HTTPS for all services
6. Restrict MongoDB network access to production IPs

## Features

✅ User authentication with JWT
✅ Image upload and storage in MongoDB
✅ ML model integration for damage classification
✅ Fraud detection analysis
✅ User-specific image history
✅ Responsive UI with modern design
✅ Real-time predictions with confidence scores

## Tech Stack

- **Frontend**: React, React Router, TailwindCSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **ML API**: Flask, TensorFlow/Keras
- **Database**: MongoDB Atlas
- **Authentication**: JWT

## Support

For issues or questions, check the console logs in:
- Browser DevTools (F12)
- Backend terminal
- Flask API terminal
