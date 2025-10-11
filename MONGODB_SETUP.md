# MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Windows)

### Method A: Using winget (Recommended)
```powershell
winget install MongoDB.Server
```

### Method B: Manual Installation
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Choose "Complete" installation
4. Install MongoDB as a Service (check the box)
5. Install MongoDB Compass (optional GUI tool)

### After Installation:
1. Add MongoDB to PATH (if not automatic):
   - Default location: `C:\Program Files\MongoDB\Server\7.0\bin`
   - Add to System Environment Variables

2. Start MongoDB Service:
   ```powershell
   net start MongoDB
   ```

3. Verify installation:
   ```powershell
   mongod --version
   mongo --version
   ```

4. Connect to MongoDB:
   ```powershell
   mongosh
   ```

---

## Option 2: MongoDB Atlas (Cloud - Free Tier)

### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose "Free" tier (M0)

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "Free" (M0) tier
3. Select a cloud provider and region (closest to you)
4. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `admin` (or your choice)
5. Password: Generate or create a strong password
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - IP: `0.0.0.0/0`
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

Example connection string:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update Backend Configuration

Create or update `.env` file in `backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/insulin-predictor?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
```

**Replace:**
- `YOUR_PASSWORD` with your database user password
- `cluster0.xxxxx` with your actual cluster URL

---

## Option 3: Use Docker (If you have Docker installed)

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo

# Check if running
docker ps

# Stop MongoDB
docker stop mongodb

# Start MongoDB
docker start mongodb
```

---

## Verify Connection

### Test Backend Connection:

1. Start your backend:
   ```bash
   cd backend
   npm start
   ```

2. Look for this message:
   ```
   🍃 MongoDB Connected: cluster0.xxxxx.mongodb.net (for Atlas)
   OR
   🍃 MongoDB Connected: localhost (for local)
   ```

3. Test health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```

---

## Troubleshooting

### Local MongoDB Issues:

1. **Service not starting:**
   ```powershell
   # Check service status
   Get-Service MongoDB
   
   # Start service manually
   net start MongoDB
   ```

2. **Port already in use:**
   ```powershell
   # Check what's using port 27017
   netstat -ano | findstr :27017
   ```

3. **Permission issues:**
   - Run PowerShell as Administrator
   - Check MongoDB data directory permissions

### MongoDB Atlas Issues:

1. **Connection timeout:**
   - Check Network Access whitelist
   - Verify firewall/antivirus isn't blocking

2. **Authentication failed:**
   - Verify username and password
   - Check if user has correct permissions

3. **Database not found:**
   - MongoDB Atlas creates database on first write
   - Try signing up a user first

---

## Recommended: MongoDB Compass (GUI Tool)

Download from: https://www.mongodb.com/try/download/compass

**Connect to:**
- Local: `mongodb://localhost:27017`
- Atlas: Use the connection string from Atlas

**Features:**
- View collections and documents
- Run queries visually
- Monitor performance
- Import/export data

---

## Quick Start Commands

### After MongoDB is Running:

```bash
# Connect to MongoDB shell
mongosh

# Use your database
use insulin-predictor

# View all collections
show collections

# View users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user
db.users.findOne({ username: "uppal" })

# Delete all users (careful!)
db.users.deleteMany({})
```

---

## Next Steps

1. ✅ Install/Setup MongoDB (choose one option above)
2. ✅ Update `.env` file with connection string
3. ✅ Start backend server
4. ✅ Test sign up/sign in from frontend
5. ✅ Verify users are stored in MongoDB

---

## Status Check

Run this command to verify everything:

```bash
# In backend folder
npm start
```

Look for:
- ✅ `🍃 MongoDB Connected`
- ✅ `🚀 T2D Insulin Prediction API running on port 5000`

Then test signup at: `http://localhost:5173/signup`
