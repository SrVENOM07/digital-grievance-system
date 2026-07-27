# Digital Grievance Redressal System ⚖️

A full-stack, production-level **Digital Grievance Redressal System** built with **React.js (Tailwind CSS)**, **Node.js + Express.js**, **MongoDB (Mongoose)**, **JWT Authentication**, and **Multer File Uploads**.

---

## 🌟 Key Features

### 1. User Authentication & Strict Validations
- **Role-Based Signup & Login**: Toggle between **USER** and **ADMIN (HOST)** roles.
- **Regex Format Enforcement**:
  - **Email**: Strict RFC regex format validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Rejects invalid strings like `"123"` or `"abc"`.
  - **Phone Number**: Mandatory 10 numeric digits (`/^[0-9]{10}$/`).
  - **Password**: Minimum 6 characters.
- **Security**: Password hashing via `bcryptjs` and session persistence via signed JWT tokens.

### 2. User Portal Features
- **Submit Grievances**:
  - Form fields: Title, Category, Detailed Description.
  - Category options: Infrastructure, Academic, Administrative, Hostel, Sanitation, Other.
  - **Device File Upload**: Upload evidence photos (`.jpg`, `.png`, `.webp`) stored locally under `/uploads` via Express Multer storage with live image preview.
- **Track Status**: Real-time status cards showing **Pending**, **In Progress**, or **Resolved** with color badges and official Admin Action Remarks.

### 3. Admin Portal Features
- **Overview Dashboard**: Stat counters for Total Grievances, Pending Action, In Progress, and Resolved.
- **Real-Time Data Table & Filters**: Filter grievances by Category, Status, or search by submittor email/name/title.
- **Status & Remarks Updater**: Modal to change status and append official resolution remarks, reflecting instantly on the User panel.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6.
- **Backend**: Node.js, Express.js, JWT, BcryptJS, Multer.
- **Database**: MongoDB (Mongoose) with automatic `MongoMemoryServer` fallback for instant zero-configuration local execution.

---

## 🚀 Quick Setup Instructions

### 1. Install Dependencies
```bash
# In backend server directory
cd server
npm install

# In frontend client directory
cd ../client
npm install
```

### 2. (Optional) Seed Default Accounts
```bash
cd server
node seed.js
```

#### Pre-seeded Credentials:
- **Admin Account**: `admin@grievance.com` / Password: `admin123`
- **User Account**: `user@example.com` / Password: `user123`

### 3. Run Application

#### Terminal 1: Backend Server (Port 5000)
```bash
cd server
npm run dev
```

#### Terminal 2: Frontend Client (Port 3000)
```bash
cd client
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 📁 Project Structure

```
digital-grievance-system/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & MongoMemoryServer fallback
│   ├── controllers/
│   │   ├── authController.js     # Signup/Login logic with strict regex & JWT
│   │   └── grievanceController.js# Submit, user grievances, admin all, status update
│   ├── middleware/
│   │   ├── authMiddleware.js     # Protect & AdminOnly verification
│   │   └── uploadMiddleware.js   # Multer file storage
│   ├── models/
│   │   ├── User.js               # Mongoose schema for Users & Admins
│   │   └── Grievance.js          # Mongoose schema for Grievance records
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   └── grievanceRoutes.js    # /api/grievances
│   ├── uploads/                  # Uploaded evidence image files
│   ├── seed.js                   # Database seed script
│   └── server.js                 # Express server entry point
├── client/
│   ├── src/
│   │   ├── components/           # StatusBadge, GrievanceCard, AdminModal, Navbar, ProtectedRoute
│   │   ├── context/              # AuthContext for session management
│   │   ├── pages/                # Login, Signup, UserDashboard, AdminDashboard
│   │   ├── services/             # Axios API instance
│   │   ├── App.jsx               # React Router configuration
│   │   └── index.css             # Tailwind CSS & glassmorphism theme
│   ├── index.html
│   └── vite.config.js            # Proxy config for port 5000
```
