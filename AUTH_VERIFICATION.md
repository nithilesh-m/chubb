# Authentication Flow Verification

## ✅ Backend Setup (MongoDB Storage)

### 1. **Database Connection** (`backend/config/database.js`)
- ✅ MongoDB connection configured
- ✅ Database: `insulin-predictor`
- ✅ Connection string: `mongodb://localhost:27017/insulin-predictor`

### 2. **User Model** (`backend/models/User.js`)
- ✅ **Schema Fields:**
  - `username` (unique, required, 3-30 chars)
  - `email` (unique, required, validated)
  - `password` (required, min 6 chars, **hashed with bcrypt**)
  - `createdAt` (timestamp)
  - `lastLogin` (timestamp)

- ✅ **Security Features:**
  - Password hashing with bcrypt (salt rounds: 10)
  - Password comparison method
  - Password excluded from JSON responses

### 3. **Auth Routes** (`backend/routes/auth.js`)

#### **Sign Up** (`POST /api/auth/signup`)
- ✅ Checks for existing username/email
- ✅ Creates new user in MongoDB
- ✅ Hashes password automatically (pre-save hook)
- ✅ Generates JWT token (7-day expiry)
- ✅ Returns: token + user data

#### **Sign In** (`POST /api/auth/signin`)
- ✅ Finds user by username or email
- ✅ Compares password with bcrypt
- ✅ Updates `lastLogin` timestamp
- ✅ Generates JWT token
- ✅ Returns: token + user data

### 4. **Auth Middleware** (`backend/middleware/auth.js`)
- ✅ Verifies JWT token
- ✅ Fetches user from MongoDB
- ✅ Attaches user to request object

---

## ✅ Frontend Setup

### 1. **Sign Up Component** (`frontend/src/components/SignUp.jsx`)
- ✅ Sends: `username`, `email`, `password` to `/api/auth/signup`
- ✅ Stores: `token`, `username`, `isAuthenticated` in localStorage
- ✅ Redirects to `/prediction` on success

### 2. **Sign In Component** (`frontend/src/components/SignIn.jsx`)
- ✅ Sends: `username`, `password` to `/api/auth/signin`
- ✅ Stores: `token`, `username`, `isAuthenticated` in localStorage
- ✅ Redirects to `/prediction` on success

### 3. **Protected Routes** (`frontend/src/App.jsx`)
- ✅ Checks `isAuthenticated` and `token` in localStorage
- ✅ Redirects to sign-in if not authenticated

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt (10 rounds)
2. **JWT Tokens**: Signed with secret key, 7-day expiry
3. **Token Verification**: Middleware validates all protected routes
4. **Unique Constraints**: Username and email must be unique
5. **Input Validation**: Email format, password length, username length

---

## 📊 Data Flow

### Sign Up:
```
User Input → Frontend (SignUp.jsx)
    ↓
POST /api/auth/signup
    ↓
Backend validates & checks duplicates
    ↓
Password hashed with bcrypt
    ↓
User saved to MongoDB
    ↓
JWT token generated
    ↓
Response: { token, user }
    ↓
Frontend stores token & redirects
```

### Sign In:
```
User Input → Frontend (SignIn.jsx)
    ↓
POST /api/auth/signin
    ↓
Backend finds user in MongoDB
    ↓
Password compared with bcrypt
    ↓
lastLogin updated
    ↓
JWT token generated
    ↓
Response: { token, user }
    ↓
Frontend stores token & redirects
```

---

## 🧪 Testing Steps

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend
```bash
cd backend
npm start
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Test Sign Up
1. Go to `http://localhost:5173/signup`
2. Enter username, email, password
3. Click "Sign Up"
4. Check MongoDB: `db.users.find()` should show new user
5. Password should be hashed (starts with `$2a$` or `$2b$`)

### 5. Test Sign In
1. Go to `http://localhost:5173/signin`
2. Enter username/email and password
3. Click "Sign In"
4. Should redirect to `/prediction`
5. Check localStorage for token

### 6. Verify MongoDB Storage
```bash
# Connect to MongoDB
mongosh

# Use database
use insulin-predictor

# Check users collection
db.users.find().pretty()

# Verify password is hashed
db.users.findOne({}, { password: 1 })
```

---

## ✅ Verification Checklist

- [x] MongoDB connection established
- [x] User model with proper schema
- [x] Password hashing on save
- [x] Sign up route creates user in DB
- [x] Sign in route validates credentials
- [x] JWT tokens generated and returned
- [x] Frontend stores tokens properly
- [x] Protected routes check authentication
- [x] Unique constraints on username/email
- [x] Password comparison with bcrypt

---

## 🔧 Environment Variables

Create `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/insulin-predictor
JWT_SECRET=your-secret-key-change-this-in-production
```

---

## ✅ Status: FULLY CONFIGURED

All authentication flows are properly set up and credentials are being stored securely in MongoDB with hashed passwords.
