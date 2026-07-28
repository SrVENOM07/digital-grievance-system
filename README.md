[project_documentation.md](https://github.com/user-attachments/files/30442025/project_documentation.md)
# PROJECT_DOCUMENTATION.md

# 1. Project Overview
**NIVARAN – Digital Grievance Redressal System** is a comprehensive, full-stack web application designed to bridge the gap between citizens and government administration. Its primary purpose is to provide a seamless, transparent, and efficient platform for citizens to lodge complaints and for nodal officers to track, manage, and resolve them. 

**Problems Solved:**
- Eliminates physical paperwork and long queues for grievance submission.
- Provides real-time transparency into complaint status.
- Prevents misplacement of complaints through a centralized digital database.
- Equips administrators with a unified dashboard to filter and resolve issues efficiently.

**Target Audience:**
- **Citizens:** Any individual seeking to report local, municipal, or state-level grievances.
- **Nodal Officers/Administrators:** Government officials assigned to resolve issues within their jurisdiction.

---

# 2. Features

### For Citizens / Users
- **Secure Registration & Login:** Create an account using email and secure password hashing.
- **File Complaint (Grievance):** Submit detailed complaints including category selection, description, and image evidence attachments.
- **Track Complaint Status:** View real-time updates (Pending, In Progress, Resolved).
- **Complaint History:** Access a full dashboard of previously submitted grievances.
- **Secure Password Recovery:** Automated "Forgot Password" email workflow with cryptographic tokens.

### For Administrators / Nodal Officers
- **Admin Dashboard:** A high-level overview of all grievances submitted across the platform.
- **Manage Complaints:** Update the status of any grievance.
- **Assign Remarks:** Leave official resolution notes or action remarks that instantly sync to the citizen's dashboard.
- **View Evidence:** Built-in lightbox to inspect citizen-uploaded image attachments.
- **Applicant Details Access:** Securely view contact information (email, phone) of the citizen for follow-ups.

---

# 3. Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js (v18), Vite, Tailwind CSS, Lucide React (Icons), React Router DOM |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose), MongoDB Memory Server (for dev/testing) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js (Password Hashing) |
| **Email Service** | Nodemailer (SMTP integration via Gmail) |
| **File Storage** | Multer (Local static serving via Express) |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **Package Managers**| NPM |
| **Build Tools** | Vite |

---

# 4. Project Architecture
The project follows a standard decoupled **Client-Server (MERN)** architecture.
- **Frontend (Client):** A React Single Page Application (SPA) that manages UI state and routing. It communicates with the backend via RESTful HTTP requests using `axios`.
- **Backend (Server):** An Express.js REST API that handles business logic, database transactions, and authentication. It serves as the middleware between the React frontend and the MongoDB database.
- **Communication:** The frontend sends JSON payloads (and `multipart/form-data` for images) to the backend API endpoints. The backend responds with standard JSON payloads and HTTP status codes. Authentication is maintained via stateless JWT Bearer tokens passed in the `Authorization` header.

---

# 5. Folder Structure
```text
digital-grievance-system/
├── client/                     # React Frontend
│   ├── index.html              # HTML Entry Point
│   ├── package.json            # Frontend Dependencies
│   ├── postcss.config.js       # Tailwind PostCSS Config
│   ├── tailwind.config.js      # Tailwind Theme Config
│   ├── vercel.json             # Vercel Proxy/Deployment Config
│   ├── vite.config.js          # Vite Build Config
│   └── src/
│       ├── App.jsx             # Main React Component & Routing
│       ├── index.css           # Global CSS (Government Theme variables)
│       ├── main.jsx            # React DOM Render Entry
│       ├── components/         # Reusable UI Components
│       │   ├── AdminModal.jsx      # Status Update Modal
│       │   ├── GrievanceCard.jsx   # Complaint Display Card
│       │   ├── Navbar.jsx          # Top Navigation Bar
│       │   ├── ProtectedRoute.jsx  # JWT Route Guard
│       │   └── StatusBadge.jsx     # Visual Status Indicator
│       ├── context/            # React Context API
│       │   └── AuthContext.jsx     # Global User State Management
│       ├── pages/              # Route Views
│       │   ├── AdminDashboard.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── Login.jsx
│       │   ├── ResetPassword.jsx
│       │   ├── Signup.jsx
│       │   └── UserDashboard.jsx
│       └── services/           # API Configuration
│           └── api.js          # Axios Instance with Interceptors
└── server/                     # Node.js Backend
    ├── package.json            # Backend Dependencies
    ├── server.js               # Express Server Entry Point
    ├── config/                 
    │   └── db.js               # MongoDB Connection Logic
    ├── controllers/            # Business Logic
    │   ├── authController.js       # Login/Signup/Reset Logic
    │   └── grievanceController.js  # Complaint CRUD Logic
    ├── middleware/             # Express Middlewares
    │   ├── authMiddleware.js       # JWT Verification Guard
    │   └── uploadMiddleware.js     # Multer File Upload Config
    ├── models/                 # Mongoose Database Schemas
    │   ├── Grievance.js
    │   └── User.js
    ├── routes/                 # API Route Definitions
    │   ├── authRoutes.js
    │   └── grievanceRoutes.js
    ├── uploads/                # Static Image Storage Directory
    └── utils/                  
        └── sendEmail.js        # Nodemailer SMTP Configuration
```

---

# 6. Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)
- Git

### Step-by-Step Installation
1. **Clone repository:**
   ```bash
   git clone https://github.com/SrVENOM07/digital-grievance-system.git
   cd digital-grievance-system
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `server` folder (see Section 7).*
   
   *Start Backend:*
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   ```
   *Start Frontend:*
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`.*

4. **Production Build:**
   ```bash
   # Inside client folder
   npm run build
   ```

---

# 7. Environment Variables

Create a `.env` file in the `server` directory.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | The port the backend server runs on | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb://localhost:27017/nivaran` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your_super_secret_key` |
| `EMAIL_USER` | SMTP Email Address for Nodemailer | `your-email@gmail.com` |
| `EMAIL_PASS` | SMTP App Password | `abcd efgh ijkl mnop` |
| `FRONTEND_URL` | URL of the deployed frontend for email links | `http://localhost:5173` |

---

# 8. API Documentation

| Method | Endpoint | Purpose | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user or admin | No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes |
| `POST` | `/api/auth/forgotpassword` | Send password reset email token | No |
| `PUT` | `/api/auth/resetpassword/:token` | Reset password using emailed token | No |
| `GET` | `/api/grievances` | Fetch grievances (Users see own, Admins see all) | Yes |
| `POST` | `/api/grievances` | File a new grievance (multipart/form-data) | Yes |
| `PUT` | `/api/grievances/:id` | Update grievance status & remarks | Yes (Admin) |
| `GET` | `/api/health` | System health check endpoint | No |

---

# 9. Authentication Flow
1. **Registration:** User submits details. Backend hashes the password using `bcryptjs` and saves to MongoDB.
2. **Login:** User submits credentials. Backend compares the hashed password. If valid, generates a signed `JWT` payload containing the User ID and Role.
3. **Session:** The frontend stores the JWT in `localStorage` and attaches it as a `Bearer Token` in the headers of all subsequent `axios` requests via an interceptor.
4. **Protected Routes:** The `ProtectedRoute.jsx` component wraps React routes, checking for a valid user state. The backend `authMiddleware.js` intercepts API calls, verifies the JWT signature, and attaches the user object to the request.
5. **Authorization:** Specific actions (like updating statuses) check `req.user.role === 'ADMIN'`.

---

# 10. Database Schema

### `User` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `name` | String | Full Name |
| `email` | String | Unique Email |
| `phone` | String | 10-digit Contact Number |
| `password` | String | Bcrypt Hashed Password |
| `role` | String | `USER` or `ADMIN` |
| `resetPasswordToken` | String | Hashed token for email recovery |
| `resetPasswordExpire` | Date | Token expiration timestamp |

### `Grievance` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `title` | String | Short subject of complaint |
| `description` | String | Detailed explanation |
| `category` | String | E.g., Infrastructure, Water, Electricity |
| `imageUrl` | String | Path to uploaded evidence |
| `status` | String | `Pending`, `In Progress`, or `Resolved` |
| `adminRemarks`| String | Official resolution notes |
| `userId` | ObjectId | Ref: `User` |
| `createdAt` | Date | Auto-generated timestamp |

---

# 11. User Module
- **Registration & Login:** Standard authentication forms with strict validation.
- **Dashboard:** Clean interface to view current status of all personal complaints.
- **File Complaint:** A form allowing users to select a category, write a description, and upload an image (evidence).
- **Track Complaint:** Visual `StatusBadge` indicators (Pending/In Progress/Resolved).

---

# 12. Admin Module
- **Dashboard:** A comprehensive grid view of all citizens' complaints.
- **Manage Complaints:** Clickable interface to open the `AdminModal`.
- **Assign Actions:** Admins can transition the status and write official `adminRemarks` explaining the resolution or next steps.
- **Citizen Lookup:** Admins can view the name, phone, and email of the applicant directly on the grievance card for offline follow-up.

---

# 13. UI Pages
> [!NOTE]
> All pages have been strictly styled to mirror an official Indian Government Digital Portal using Government Blue (`#0F4C81`), India Green (`#138808`), and Saffron (`#FF9933`).

1. **/login** - `Login.jsx`: User authentication portal.
2. **/signup** - `Signup.jsx`: Citizen registration portal.
3. **/forgot-password** - `ForgotPassword.jsx`: Email input for account recovery.
4. **/reset-password/:token** - `ResetPassword.jsx`: Secure new password entry.
5. **/dashboard** - `UserDashboard.jsx`: The primary citizen workspace.
6. **/admin/dashboard** - `AdminDashboard.jsx`: The nodal officer command center.

---

# 14. Security Features
- **Password Hashing:** `bcryptjs` ensures passwords are never stored in plaintext.
- **Stateless Auth:** JWT prevents session hijacking and scaling issues.
- **Authorization:** Backend explicitly prevents standard Users from accessing `PUT /api/grievances/:id`.
- **CORS:** Cross-Origin Resource Sharing is configured to prevent unauthorized domains from hitting the API.
- **Input Validation:** Backend enforces regex checks for emails, phone numbers, and strong passwords before database insertion.

---

# 15. Deployment Guide

**Frontend (Vercel):**
1. Push the `client` directory to GitHub.
2. Import the repository in Vercel.
3. The `vercel.json` file automatically configures proxy rewrites to route `/api/*` to the backend.

**Backend (Render):**
1. Push the `server` directory to GitHub.
2. Create a new "Web Service" on Render.
3. Add all Environment Variables (`MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, etc.) in the Render dashboard.
4. Set Build Command: `npm install` and Start Command: `node server.js`.

---

# 16. Troubleshooting

| Error | Cause | Solution |
| :--- | :--- | :--- |
| `ENETUNREACH` / Email Hangs | Render IPv6 network block on SMTP ports. | Resolved in code via `dns.setDefaultResultOrder('ipv4first')` in `server.js`. |
| `401 Unauthorized` | Expired or missing JWT token. | Clear `localStorage` and log in again. |
| Vercel `504 Gateway Timeout` | Render backend cold start took >10s. | Refresh the page. Render spins down free tiers after 15 mins of inactivity. |

---

# 17. Future Enhancements
- **SMS Notifications:** Integrate Twilio to send SMS updates on status changes.
- **AI Complaint Categorization:** Auto-tag grievances to specific departments based on the text description.
- **Regional Languages:** Add i18n support for Hindi and regional languages to improve accessibility.
- **Advanced Analytics:** Generate graphical PDF reports for admins to track departmental efficiency.

---

# 18. Links Section
* **Repository URL:** [https://github.com/SrVENOM07/digital-grievance-system](https://github.com/SrVENOM07/digital-grievance-system)
* **Frontend URL:** [https://digital-grievance-system.vercel.app](https://digital-grievance-system.vercel.app)
* **Backend URL:** [https://digital-grievance-system.onrender.com](https://digital-grievance-system.onrender.com)
* **Vercel (Frontend Hosting):** [https://vercel.com](https://vercel.com)
* **Render (Backend Hosting):** [https://render.com](https://render.com)
* **MongoDB:** [https://www.mongodb.com](https://www.mongodb.com)

---

# 19. Dependencies

### Frontend (`client/package.json`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `axios` | ^1.7.2 | Promise-based HTTP client for API requests |
| `lucide-react` | ^0.400.0 | Professional vector icon library |
| `react` / `react-dom` | ^18.3.1 | Core UI library |
| `react-router-dom` | ^6.24.1 | Client-side routing and navigation |
| `tailwindcss` | ^3.4.4 | Utility-first CSS framework |

### Backend (`server/package.json`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `bcryptjs` | ^2.4.3 | Cryptographic password hashing |
| `cors` | ^2.8.5 | Express middleware to enable CORS |
| `dotenv` | ^16.4.5 | Loads environment variables from `.env` |
| `express` | ^4.19.2 | Fast, unopinionated web framework |
| `jsonwebtoken` | ^9.0.2 | Generates and verifies JWTs |
| `mongoose` | ^8.5.1 | MongoDB object modeling tool |
| `multer` | ^1.4.5-lts.1 | Middleware for handling `multipart/form-data` |
| `nodemailer` | ^9.0.3 | Module to send emails |

---

# 20. Scripts

### Frontend Scripts
- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and minifies the React application for production deployment.
- `npm run preview`: Bootstraps a local static web server to preview the production build.

### Backend Scripts
- `npm run start`: Starts the Node.js production server.
- `npm run dev`: Starts the server in watch mode (auto-restarts on file changes using Node's native `--watch` flag).

---

# 21. License
This project is for educational and major project submission purposes. All rights reserved.

# 22. Contributors
- **SrVENOM07** (Frontend & Backend Implementation)
