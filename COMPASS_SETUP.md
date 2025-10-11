# MongoDB Compass Setup Guide

## Step 1: Open MongoDB Compass

Launch MongoDB Compass application on your computer.

## Step 2: Create New Connection

### Connection String:
```
mongodb://localhost:27017
```

### Or use the form:
- **Host**: `localhost`
- **Port**: `27017`
- **Authentication**: None (for local development)

## Step 3: Connect

1. Click "Connect" button
2. You should see the MongoDB server interface

## Step 4: Create Database

1. Click "Create Database" button (or the + icon)
2. **Database Name**: `insulin-predictor`
3. **Collection Name**: `users`
4. Click "Create Database"

## Step 5: Verify Connection

You should now see:
- Database: `insulin-predictor`
- Collection: `users` (will be empty initially)

---

## If Connection Fails

### Error: "connect ECONNREFUSED 127.0.0.1:27017"

This means MongoDB server is not running. You need to start it:

### Option A: Start MongoDB as Windows Service
```powershell
# Run as Administrator
net start MongoDB
```

### Option B: Start MongoDB Manually
```powershell
# Navigate to MongoDB bin folder (adjust version if needed)
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB server
mongod --dbpath "C:\data\db"
```

**Note**: You may need to create the data directory first:
```powershell
mkdir C:\data\db
```

### Option C: Check if MongoDB is Installed

```powershell
# Check MongoDB version
mongod --version

# If not found, MongoDB is not installed
```

---

## After MongoDB is Running

### 1. Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
🍃 MongoDB Connected: localhost
🚀 T2D Insulin Prediction API running on port 5000
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Test Sign Up

1. Go to `http://localhost:5173/signup`
2. Create a new account
3. Check MongoDB Compass - refresh the `users` collection
4. You should see your new user with hashed password!

---

## MongoDB Compass Features

### View Users
1. Click on `insulin-predictor` database
2. Click on `users` collection
3. See all registered users

### Query Users
```javascript
// Find user by username
{ username: "uppal" }

// Find all users
{}

// Find users created today
{ createdAt: { $gte: new Date("2025-01-10") } }
```

### Delete Users (for testing)
1. Select a user document
2. Click the trash icon
3. Confirm deletion

---

## Troubleshooting

### MongoDB Not Installed?

If you get "mongod not found", you need to install MongoDB:

**Download**: https://www.mongodb.com/try/download/community

**Or use winget**:
```powershell
winget install MongoDB.Server
```

### Port Already in Use?

Check what's using port 27017:
```powershell
netstat -ano | findstr :27017
```

### Permission Issues?

Run PowerShell as Administrator when starting MongoDB service.

---

## Quick Reference

### Connection Details:
- **Host**: localhost
- **Port**: 27017
- **Database**: insulin-predictor
- **Collection**: users

### Backend .env File:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/insulin-predictor
JWT_SECRET=insulin-predictor-secret-key-2024-change-in-production
```

---

## Next Steps

1. ✅ Open MongoDB Compass
2. ✅ Connect to `mongodb://localhost:27017`
3. ✅ Create `insulin-predictor` database
4. ✅ Start backend server (`npm start`)
5. ✅ Test sign up from frontend
6. ✅ Verify user in Compass

---

## Success Indicators

✅ MongoDB Compass shows "Connected" status
✅ Backend logs: "🍃 MongoDB Connected: localhost"
✅ Sign up creates user visible in Compass
✅ Password is hashed (starts with $2a$ or $2b$)
