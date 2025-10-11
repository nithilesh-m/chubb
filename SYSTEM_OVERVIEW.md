# CHUBB Claims - Car Damage Detection System

## Overview

A complete car damage detection system that uses AI/ML to determine if a car is damaged or not damaged.

## System Architecture

```
┌──────────────┐
│   Frontend   │  React + Vite (Port 5173)
│  Prediction  │  - Upload car images
│     Page     │  - View results inline
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   Backend    │  Node.js + Express (Port 5000)
│   REST API   │  - User authentication (JWT)
│              │  - Image storage (MongoDB)
└──────┬───────┘  - Forwards to ML API
       │
       ↓
┌──────────────┐
│   ML API     │  Flask + TensorFlow (Port 5001)
│    Flask     │  - Binary classification
│              │  - Damaged vs Not Damaged
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  ML Model    │  car_damage_classification_model.h5
│   (.h5)      │  - Input: 224x224x3 image
│              │  - Output: [Damaged, Not Damaged]
└──────────────┘
```

## Features

### ✅ User Authentication
- Sign up with username, email, password
- Sign in with JWT tokens
- Secure session management

### ✅ Image Upload
- Drag & drop or click to upload
- Image preview before upload
- Supports JPG, PNG, etc.
- Max 10MB file size

### ✅ Damage Detection
- **Binary classification**: Damaged or Not Damaged
- Real-time prediction using ML model
- Confidence percentage display
- Detailed probability breakdown

### ✅ Results Display
- **Green banner**: Not Damaged ✓
- **Red banner**: Damaged ⚠️
- Confidence score
- Visual progress bars
- All predictions shown

### ✅ Image History
- View previously uploaded images
- See past predictions
- User-specific storage in MongoDB

## User Flow

```
1. Sign Up/Sign In
   ↓
2. Upload Car Image
   ↓
3. Click "Upload & Predict"
   ↓
4. Results Display on Same Page:
   ┌─────────────────────────────┐
   │  ✓  NOT DAMAGED             │
   │  Confidence: 92.3%          │
   └─────────────────────────────┘
   
   Detailed Analysis:
   Not Damaged: ████████░░ 92.3%
   Damaged:     ██░░░░░░░░ 7.7%
   ↓
5. View Image History Below
```

## Technology Stack

### Frontend
- **React** 18.x - UI framework
- **React Router** - Navigation
- **Vite** - Build tool
- **CSS3** - Styling with animations

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database (Atlas)
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Axios** - HTTP client

### ML API
- **Flask** - Web framework
- **TensorFlow/Keras** - ML framework
- **Pillow** - Image processing
- **NumPy** - Numerical operations

## API Endpoints

### Backend (Port 5000)

#### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user

#### Images
- `POST /api/images/upload` - Upload image & get prediction
- `GET /api/images/my-images` - Get user's images
- `GET /api/images/:imageId` - Get specific image
- `DELETE /api/images/:imageId` - Delete image

### ML API (Port 5001)

- `GET /health` - Health check
- `POST /predict` - Predict damage from image
- `GET /classes` - Get damage classes

## Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date
}
```

### Images Collection
```javascript
{
  userId: ObjectId (ref: User),
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  imageData: String (base64),
  predictionResult: {
    isDamaged: Boolean,
    damageStatus: String,
    confidence: Number,
    allPredictions: Object,
    timestamp: Date,
    note: String
  },
  uploadedAt: Date
}
```

## ML Model Specifications

### Input
- **Shape**: (224, 224, 3)
- **Format**: RGB image
- **Normalization**: [0, 1] range

### Output
- **Shape**: (2,)
- **Classes**: 
  - Index 0: Damaged
  - Index 1: Not Damaged
- **Activation**: Softmax

### Preprocessing
1. Resize to 224x224
2. Convert to RGB
3. Normalize to [0, 1]
4. Add batch dimension

## Setup Instructions

### 1. MongoDB Atlas
```bash
1. Create cluster
2. Whitelist IP: 0.0.0.0/0
3. Get connection string
4. Update backend/.env
```

### 2. Backend
```bash
cd backend
npm install
# Update .env with MongoDB URI
npm start
```

### 3. ML API
```bash
cd ml-api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Place model file: car_damage_classification_model.h5
python app.py
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
ML_API_URL=http://localhost:5001
```

## Key Features

### 🎯 Single Page Results
- No redirects or page changes
- Results appear instantly on upload page
- Smooth animations

### 🔒 Secure
- JWT authentication
- Password hashing (bcrypt)
- User-specific data isolation

### 🚀 Fast
- Optimized image processing
- Efficient ML inference
- Responsive UI

### 📱 Responsive
- Works on desktop, tablet, mobile
- Adaptive layouts
- Touch-friendly

### 🎨 Modern UI
- Dark theme
- Animated particles background
- Gradient effects
- Smooth transitions

## No Fraud Detection

This system **ONLY** predicts:
- ✅ **Damaged** - Car has visible damage
- ✅ **Not Damaged** - Car appears undamaged

**No fraud analysis** is performed. The system focuses purely on damage detection using the ML model.

## Testing

### Without Model (Mock Mode)
The system works immediately with mock predictions:
```bash
cd ml-api
python app.py
# Uses random predictions for testing
```

### With Real Model
```bash
# Place your model file
cp your_model.h5 ml-api/car_damage_classification_model.h5
cd ml-api
python app.py
# Uses real ML predictions
```

## Production Deployment

### Recommended Services
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, AWS
- **ML API**: AWS Lambda, Google Cloud Run
- **Database**: MongoDB Atlas

### Checklist
- [ ] Update CORS origins
- [ ] Set production environment variables
- [ ] Enable HTTPS
- [ ] Restrict MongoDB IP whitelist
- [ ] Use production JWT secret
- [ ] Enable rate limiting
- [ ] Add monitoring/logging

## Support

For issues:
1. Check browser console (F12)
2. Check backend terminal logs
3. Check Flask API terminal logs
4. Review TROUBLESHOOTING.md

## License

MIT License - Free to use and modify
