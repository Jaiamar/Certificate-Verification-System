# Certificate Verification System - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [System Requirements](#system-requirements)
5. [Database Design](#database-design)
6. [API Design](#api-design)
7. [Frontend Design](#frontend-design)
8. [Security Implementation](#security-implementation)
9. [Development Setup](#development-setup)
10. [Implementation Guide](#implementation-guide)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Guide](#deployment-guide)
13. [User Manual](#user-manual)

---

## 1. Project Overview

### 1.1 Purpose
The Certificate Verification System streamlines the process of issuing and verifying internship certificates by providing a digital platform where administrators can manage bulk certificate data and students can search, verify, and download their certificates.

### 1.2 Key Features
- **Admin Panel**: Upload and manage student data via Excel files
- **User Portal**: Search and download certificates using unique IDs
- **Authentication System**: Secure login for both admins and users
- **Certificate Generation**: Automated certificate creation with student details
- **Data Validation**: Ensures data integrity during import
- **PDF Download**: Professional certificate download capability

### 1.3 User Roles

#### Administrator
- Upload bulk student data via Excel
- Manage student records
- View all certificates
- Generate reports
- Manage user accounts

#### Student/User
- Search certificate by ID
- View certificate details
- Download certificate as PDF
- Verify certificate authenticity

---

## 2. System Architecture

### 2.1 Architecture Pattern
**Three-Tier Architecture (MERN Stack)**

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│         (React.js Frontend)             │
│   - User Interface                      │
│   - Certificate Display                 │
│   - Admin Dashboard                     │
└─────────────────┬───────────────────────┘
                  │
                  │ REST API / HTTP
                  │
┌─────────────────▼───────────────────────┐
│         APPLICATION LAYER               │
│         (Node.js + Express.js)          │
│   - Business Logic                      │
│   - Authentication & Authorization      │
│   - File Processing (Excel)             │
│   - Certificate Generation              │
└─────────────────┬───────────────────────┘
                  │
                  │ MongoDB Drivers
                  │
┌─────────────────▼───────────────────────┐
│         DATA LAYER                      │
│         (MongoDB Database)              │
│   - User Collection                     │
│   - Certificate Collection              │
│   - Admin Collection                    │
└─────────────────────────────────────────┘
```

### 2.2 System Components

#### Frontend (React.js)
- **Pages**:
  - Landing Page
  - Login/Register Pages
  - Admin Dashboard
  - Student Dashboard
  - Certificate Search Page
  - Certificate Display Page
  
#### Backend (Node.js + Express.js)
- **Modules**:
  - Authentication Module
  - User Management Module
  - Certificate Management Module
  - Excel Processing Module
  - PDF Generation Module
  
#### Database (MongoDB)
- Collections for Users, Admins, and Certificates

---

## 3. Technology Stack

### 3.1 Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.x | UI Framework |
| React Router | 6.x | Routing |
| Axios | 1.x | HTTP Client |
| Tailwind CSS | 3.x | Styling |
| React PDF | Latest | PDF Rendering |
| jsPDF | Latest | PDF Generation |
| React Icons | Latest | Icons |
| React Toastify | Latest | Notifications |

### 3.2 Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x+ | Runtime Environment |
| Express.js | 4.x | Web Framework |
| MongoDB | 6.x | Database |
| Mongoose | 7.x | ODM Library |
| bcrypt | 5.x | Password Hashing |
| jsonwebtoken | 9.x | JWT Authentication |
| multer | 1.x | File Upload |
| xlsx | Latest | Excel Processing |
| pdfkit | Latest | PDF Generation |
| cors | Latest | Cross-Origin Support |
| dotenv | Latest | Environment Variables |
| express-validator | Latest | Input Validation |

### 3.3 Development Tools
- **Version Control**: Git & GitHub
- **Code Editor**: VS Code
- **API Testing**: Postman
- **Database GUI**: MongoDB Compass
- **Package Manager**: npm/yarn

---

## 4. System Requirements

### 4.1 Hardware Requirements
**Development Environment:**
- Processor: Intel Core i5 or equivalent
- RAM: 8GB minimum (16GB recommended)
- Storage: 10GB free space
- Internet Connection: Required

**Production Server:**
- CPU: 2+ cores
- RAM: 4GB minimum
- Storage: 20GB+ SSD
- Bandwidth: 100Mbps+

### 4.2 Software Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher
- **Web Browser**: Chrome, Firefox, Safari (latest versions)
- **Git**: v2.30 or higher

---

## 5. Database Design

### 5.1 Database Schema

#### 5.1.1 Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,           // Required
  email: String,              // Required, Unique
  password: String,           // Hashed, Required
  role: String,               // 'admin' or 'user'
  createdAt: Date,            // Auto-generated
  updatedAt: Date,            // Auto-generated
  lastLogin: Date,
  isActive: Boolean           // Default: true
}
```

**Indexes:**
- `email`: Unique index
- `role`: Non-unique index

**Validation Rules:**
- Email must be valid format
- Password minimum 8 characters
- Role must be 'admin' or 'user'

#### 5.1.2 Certificates Collection
```javascript
{
  _id: ObjectId,
  certificateId: String,      // Unique, Required (e.g., "CERT2024001")
  studentName: String,        // Required
  email: String,              // Optional
  phoneNumber: String,        // Optional
  internshipDomain: String,   // Required (e.g., "Web Development")
  startDate: Date,            // Required
  endDate: Date,              // Required
  duration: String,           // Calculated (e.g., "3 months")
  performanceRating: String,  // Optional (e.g., "Excellent")
  skills: [String],           // Optional array
  projectsCompleted: [String],// Optional array
  mentorName: String,         // Optional
  issueDate: Date,            // Auto-generated
  status: String,             // 'active', 'revoked'
  uploadedBy: ObjectId,       // Reference to admin user
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

**Indexes:**
- `certificateId`: Unique index
- `studentName`: Non-unique index
- `email`: Non-unique index
- `status`: Non-unique index

**Validation Rules:**
- Certificate ID must be unique
- Start date must be before end date
- Duration automatically calculated
- Status must be 'active' or 'revoked'

#### 5.1.3 Admin Logs Collection (Optional but Recommended)
```javascript
{
  _id: ObjectId,
  adminId: ObjectId,          // Reference to user
  action: String,             // 'upload', 'delete', 'update'
  targetCollection: String,   // 'certificates', 'users'
  details: Object,            // Action-specific details
  ipAddress: String,
  timestamp: Date,            // Auto-generated
  status: String              // 'success', 'failed'
}
```

### 5.2 Database Relationships

```
Users (1) ───────── (M) Certificates
  │                      (uploadedBy reference)
  │
  └─── (1) ───────── (M) AdminLogs
         (adminId reference)
```

### 5.3 Sample Data

#### Sample User (Admin)
```json
{
  "fullName": "John Admin",
  "email": "admin@example.com",
  "password": "$2b$10$hashedpassword...",
  "role": "admin",
  "isActive": true
}
```

#### Sample Certificate
```json
{
  "certificateId": "CERT2024001",
  "studentName": "Jane Doe",
  "email": "jane.doe@email.com",
  "phoneNumber": "+91-9876543210",
  "internshipDomain": "Full Stack Web Development",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-04-15T00:00:00.000Z",
  "duration": "3 months",
  "performanceRating": "Excellent",
  "skills": ["React", "Node.js", "MongoDB", "REST APIs"],
  "projectsCompleted": ["E-commerce Website", "Blog Platform"],
  "mentorName": "Dr. Smith",
  "status": "active"
}
```

---

## 6. API Design

### 6.1 API Endpoints

#### 6.1.1 Authentication APIs

**POST /api/auth/register**
- **Description**: Register new user
- **Access**: Public
- **Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "648f7b9c9d7e8f1a2b3c4d5e",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**POST /api/auth/login**
- **Description**: User login
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "648f7b9c9d7e8f1a2b3c4d5e",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**POST /api/auth/logout**
- **Description**: User logout
- **Access**: Private (Authenticated users)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**GET /api/auth/me**
- **Description**: Get current user profile
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "648f7b9c9d7e8f1a2b3c4d5e",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "lastLogin": "2024-04-11T10:30:00.000Z"
  }
}
```

#### 6.1.2 Certificate APIs

**POST /api/certificates/upload**
- **Description**: Upload certificates via Excel file (Admin only)
- **Access**: Private (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Request**: `multipart/form-data`
  - `file`: Excel file (.xlsx, .xls)
- **Response** (201):
```json
{
  "success": true,
  "message": "Certificates uploaded successfully",
  "data": {
    "totalRecords": 50,
    "successfulUploads": 48,
    "failedUploads": 2,
    "errors": [
      {
        "row": 15,
        "certificateId": "CERT2024015",
        "error": "Duplicate certificate ID"
      }
    ]
  }
}
```

**GET /api/certificates/search/:certificateId**
- **Description**: Search certificate by ID
- **Access**: Public
- **Parameters**: `certificateId` (URL parameter)
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "certificateId": "CERT2024001",
    "studentName": "Jane Doe",
    "internshipDomain": "Full Stack Web Development",
    "startDate": "2024-01-15",
    "endDate": "2024-04-15",
    "duration": "3 months",
    "issueDate": "2024-04-15",
    "status": "active"
  }
}
```

**GET /api/certificates/:certificateId/download**
- **Description**: Download certificate as PDF
- **Access**: Public
- **Parameters**: `certificateId` (URL parameter)
- **Response**: PDF file stream

**GET /api/certificates**
- **Description**: Get all certificates (Admin only, with pagination)
- **Access**: Private (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Records per page (default: 10)
  - `search`: Search term
  - `domain`: Filter by domain
  - `status`: Filter by status
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "certificates": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 48,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**GET /api/certificates/:id**
- **Description**: Get single certificate details (Admin only)
- **Access**: Private (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `id` (MongoDB ObjectId)
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "648f7b9c9d7e8f1a2b3c4d5e",
    "certificateId": "CERT2024001",
    "studentName": "Jane Doe",
    ...
  }
}
```

**PUT /api/certificates/:id**
- **Description**: Update certificate (Admin only)
- **Access**: Private (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `id` (MongoDB ObjectId)
- **Request Body**:
```json
{
  "studentName": "Jane Smith",
  "performanceRating": "Outstanding"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Certificate updated successfully",
  "data": {...}
}
```

**DELETE /api/certificates/:id**
- **Description**: Delete certificate (Admin only)
- **Access**: Private (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `id` (MongoDB ObjectId)
- **Response** (200):
```json
{
  "success": true,
  "message": "Certificate deleted successfully"
}
```

**GET /api/certificates/stats/dashboard**
- **Description**: Get certificate statistics (Admin only)
- **Access**: Private (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "totalCertificates": 150,
    "activeCertificates": 145,
    "revokedCertificates": 5,
    "certificatesByDomain": {
      "Web Development": 45,
      "Data Science": 30,
      "Mobile Development": 25
    },
    "recentUploads": [...]
  }
}
```

#### 6.1.3 User Management APIs (Admin)

**GET /api/users**
- **Description**: Get all users (Admin only)
- **Access**: Private (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `page`, `limit`, `role`
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {...}
  }
}
```

**PUT /api/users/:id/status**
- **Description**: Activate/Deactivate user (Admin only)
- **Access**: Private (Admin)
- **Request Body**:
```json
{
  "isActive": false
}
```

### 6.2 Error Responses

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Email is required"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Duplicate resource
- `SERVER_ERROR` (500): Internal server error

### 6.3 API Authentication

**JWT Token Structure:**
```json
{
  "userId": "648f7b9c9d7e8f1a2b3c4d5e",
  "email": "user@example.com",
  "role": "user",
  "iat": 1681234567,
  "exp": 1681320967
}
```

**Token Expiration:** 24 hours

**Usage in Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 7. Frontend Design

### 7.1 Application Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Home | Public | Landing page |
| `/login` | Login | Public | User login |
| `/register` | Register | Public | User registration |
| `/search` | CertificateSearch | Public | Search certificates |
| `/certificate/:id` | CertificateView | Public | View certificate |
| `/admin/dashboard` | AdminDashboard | Private (Admin) | Admin overview |
| `/admin/upload` | UploadCertificates | Private (Admin) | Upload Excel |
| `/admin/certificates` | ManageCertificates | Private (Admin) | Manage all certificates |
| `/admin/users` | ManageUsers | Private (Admin) | Manage users |
| `/user/dashboard` | UserDashboard | Private (User) | User overview |
| `/profile` | Profile | Private | User profile |

### 7.2 Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── ProtectedRoute.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── AuthGuard.jsx
│   ├── certificate/
│   │   ├── CertificateCard.jsx
│   │   ├── CertificateTemplate.jsx
│   │   ├── CertificatePreview.jsx
│   │   ├── SearchBar.jsx
│   │   └── DownloadButton.jsx
│   ├── admin/
│   │   ├── FileUploader.jsx
│   │   ├── DataTable.jsx
│   │   ├── StatsCard.jsx
│   │   ├── CertificateForm.jsx
│   │   └── UserManagementTable.jsx
│   └── layout/
│       ├── AdminLayout.jsx
│       ├── UserLayout.jsx
│       └── PublicLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── CertificateSearch.jsx
│   ├── CertificateView.jsx
│   ├── AdminDashboard.jsx
│   ├── UploadCertificates.jsx
│   ├── ManageCertificates.jsx
│   ├── ManageUsers.jsx
│   ├── UserDashboard.jsx
│   └── Profile.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── certificateService.js
│   └── userService.js
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   ├── pdfGenerator.js
│   └── constants.js
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useDebounce.js
│   └── usePagination.js
├── App.jsx
└── main.jsx
```

### 7.3 Key UI Components

#### 7.3.1 Certificate Template Design
```
┌─────────────────────────────────────────────┐
│              COMPANY LOGO                   │
│                                             │
│        CERTIFICATE OF COMPLETION            │
│                                             │
│          This is to certify that            │
│                                             │
│            [STUDENT NAME]                   │
│                                             │
│   has successfully completed the internship │
│   in [DOMAIN] from [START] to [END]        │
│                                             │
│   Duration: [DURATION]                      │
│   Certificate ID: [CERT_ID]                 │
│                                             │
│   _____________        _____________        │
│   Signature             Date                │
│                                             │
│   QR Code for verification                  │
└─────────────────────────────────────────────┘
```

#### 7.3.2 Admin Dashboard Layout
```
┌─────────────────────────────────────────────┐
│  NAVBAR (Logo, Search, Notifications, User) │
├──────┬──────────────────────────────────────┤
│      │  Statistics Cards                    │
│      │  ┌───────┐ ┌───────┐ ┌───────┐      │
│ SIDE │  │ Total │ │Active │ │Domains│      │
│ BAR  │  └───────┘ └───────┘ └───────┘      │
│      │                                      │
│ -Home│  Recent Uploads Table                │
│ -Cert│  ┌────────────────────────────────┐  │
│ -User│  │ ID │ Name │ Domain │ Date    │  │
│ -Upload  ├────────────────────────────────┤  │
│      │  │... │ ...  │  ...   │  ...    │  │
│      │  └────────────────────────────────┘  │
└──────┴──────────────────────────────────────┘
```

### 7.4 State Management

#### Using React Context API

**AuthContext** - Global authentication state:
```javascript
{
  user: {
    id: String,
    email: String,
    fullName: String,
    role: String
  },
  token: String,
  isAuthenticated: Boolean,
  login: Function,
  logout: Function,
  loading: Boolean
}
```

**Alternative**: Redux Toolkit (for larger applications)

### 7.5 Form Validation

**Client-side validation using**:
- React Hook Form
- Yup schema validation

**Example validation schema**:
```javascript
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Minimum 8 characters').required('Password is required')
});
```

---

## 8. Security Implementation

### 8.1 Authentication & Authorization

#### 8.1.1 Password Security
- **Hashing Algorithm**: bcrypt with salt rounds = 10
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (recommended)

#### 8.1.2 JWT Token Security
- **Token Storage**: HTTP-only cookies (recommended) or localStorage
- **Token Expiration**: 24 hours
- **Refresh Token**: Optional implementation for extended sessions
- **Secret Key**: Strong, random string stored in environment variables

#### 8.1.3 Role-Based Access Control (RBAC)

**Middleware implementation**:
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }
    next();
  };
};
```

### 8.2 Data Security

#### 8.2.1 Input Validation
- **Server-side validation** for all inputs using express-validator
- **Sanitization** to prevent XSS attacks
- **File upload validation**:
  - File type checking (.xlsx, .xls only)
  - File size limits (max 10MB)
  - Virus scanning (optional)

#### 8.2.2 SQL/NoSQL Injection Prevention
- Use Mongoose parameterized queries
- Never concatenate user input directly into queries
- Sanitize all database inputs

#### 8.2.3 Data Encryption
- **At Rest**: MongoDB encryption at rest (if available)
- **In Transit**: HTTPS/TLS for all API communications
- **Sensitive Fields**: Additional encryption for sensitive data

### 8.3 API Security

#### 8.3.1 Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'Too many requests, please try again later'
});
```

#### 8.3.2 CORS Configuration
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
```

#### 8.3.3 Security Headers
Using Helmet.js:
```javascript
app.use(helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}));
```

### 8.4 File Upload Security

#### 8.4.1 File Validation
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel files allowed.'), false);
  }
};
```

#### 8.4.2 File Size Limits
```javascript
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});
```

### 8.5 Certificate Verification Security

#### 8.5.1 Certificate ID Format
- Unique, unpredictable format: `CERT-YYYY-XXXXXX`
- Generated using secure random methods
- Validated against database before issuance

#### 8.5.2 Digital Signatures (Optional Enhancement)
- Add digital signatures to PDFs
- QR codes with embedded verification URLs
- Blockchain-based verification (advanced)

### 8.6 Audit Logging

**Log important actions**:
- User login/logout
- Certificate uploads
- Certificate modifications
- Failed authentication attempts
- Suspicious activities

**Log format**:
```javascript
{
  timestamp: Date,
  userId: String,
  action: String,
  resource: String,
  ipAddress: String,
  userAgent: String,
  status: String
}
```

### 8.7 Environment Variables Security

**.env file structure**:
```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certdb
DB_NAME=certificate_system

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=24h

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760

# Email (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Security practices**:
- Never commit .env to version control
- Use strong, random secrets
- Different .env files for development/production
- Regular rotation of secrets

---

## 9. Development Setup

### 9.1 Prerequisites Installation

#### 9.1.1 Install Node.js
1. Visit https://nodejs.org/
2. Download LTS version (18.x or higher)
3. Run installer
4. Verify installation:
```bash
node --version
npm --version
```

#### 9.1.2 Install MongoDB

**Option 1: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string

**Option 2: Local MongoDB**
1. Visit https://www.mongodb.com/try/download/community
2. Download and install
3. Start MongoDB service:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### 9.1.3 Install Git
1. Visit https://git-scm.com/
2. Download and install
3. Verify:
```bash
git --version
```

### 9.2 Project Setup

#### 9.2.1 Create Project Structure
```bash
# Create main project folder
mkdir certificate-verification-system
cd certificate-verification-system

# Create backend and frontend folders
mkdir backend frontend
```

#### 9.2.2 Backend Setup

**Step 1: Initialize Node.js project**
```bash
cd backend
npm init -y
```

**Step 2: Install dependencies**
```bash
# Core dependencies
npm install express mongoose dotenv cors bcrypt jsonwebtoken

# Utility dependencies
npm install multer xlsx express-validator

# PDF generation
npm install pdfkit

# Development dependencies
npm install --save-dev nodemon
```

**Step 3: Create folder structure**
```bash
mkdir config controllers models routes middleware utils uploads
touch server.js .env .gitignore
```

**Step 4: Update package.json scripts**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Step 5: Create .gitignore**
```
node_modules/
.env
uploads/
*.log
.DS_Store
```

#### 9.2.3 Frontend Setup

**Step 1: Create React app**
```bash
cd ../frontend
npx create-react-app .
```

**Step 2: Install dependencies**
```bash
# Core dependencies
npm install react-router-dom axios

# UI and styling
npm install tailwindcss postcss autoprefixer
npm install react-icons react-toastify

# PDF handling
npm install jspdf react-pdf

# Form handling
npm install react-hook-form yup @hookform/resolvers

# State management (optional)
npm install @reduxjs/toolkit react-redux
```

**Step 3: Initialize Tailwind CSS**
```bash
npx tailwindcss init -p
```

**Step 4: Configure Tailwind (tailwind.config.js)**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 5: Update src/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 9.3 Database Configuration

#### 9.3.1 Create config/database.js
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 9.4 Environment Setup

#### Backend .env
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate_system
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
```

#### Frontend .env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 9.5 Running the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

**Application URLs**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Base: http://localhost:5000/api

---

## 10. Implementation Guide

### 10.1 Backend Implementation

#### 10.1.1 Server Setup (server.js)

```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Server Error',
      code: err.code || 'SERVER_ERROR'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

#### 10.1.2 Models

**models/User.js**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**models/Certificate.js**
```javascript
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  phoneNumber: String,
  internshipDomain: {
    type: String,
    required: [true, 'Internship domain is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  duration: String,
  performanceRating: String,
  skills: [String],
  projectsCompleted: [String],
  mentorName: String,
  issueDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'revoked'],
    default: 'active'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate duration before saving
certificateSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    
    if (months > 0) {
      this.duration = days > 0 ? `${months} months ${days} days` : `${months} months`;
    } else {
      this.duration = `${days} days`;
    }
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
```

#### 10.1.3 Middleware

**middleware/auth.js**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Not authorized to access this route', code: 'UNAUTHORIZED' }
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not found or inactive', code: 'UNAUTHORIZED' }
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Not authorized to access this route', code: 'UNAUTHORIZED' }
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied', code: 'FORBIDDEN' }
      });
    }
    next();
  };
};
```

**middleware/validation.js**
```javascript
const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array()
      }
    });
  }
  
  next();
};
```

#### 10.1.4 Controllers

**controllers/authController.js**
```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(409).json({
        success: false,
        error: { message: 'User already exists', code: 'CONFLICT' }
      });
    }
    
    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      role: role || 'user'
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, code: 'SERVER_ERROR' }
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials', code: 'UNAUTHORIZED' }
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: { message: 'Account is deactivated', code: 'FORBIDDEN' }
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials', code: 'UNAUTHORIZED' }
      });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, code: 'SERVER_ERROR' }
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, code: 'SERVER_ERROR' }
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};
```

**controllers/certificateController.js** (Partial - Key methods)
```javascript
const Certificate = require('../models/Certificate');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Upload certificates via Excel
// @route   POST /api/certificates/upload
// @access  Private (Admin)
exports.uploadCertificates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please upload a file', code: 'VALIDATION_ERROR' }
      });
    }
    
    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    let successCount = 0;
    let failedCount = 0;
    const errors = [];
    
    // Process each row
    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        // Validate required fields
        if (!row.certificateId || !row.studentName || !row.internshipDomain || 
            !row.startDate || !row.endDate) {
          errors.push({
            row: i + 2, // Excel row number (header is row 1)
            error: 'Missing required fields'
          });
          failedCount++;
          continue;
        }
        
        // Check for duplicate certificate ID
        const existingCert = await Certificate.findOne({ 
          certificateId: row.certificateId 
        });
        
        if (existingCert) {
          errors.push({
            row: i + 2,
            certificateId: row.certificateId,
            error: 'Duplicate certificate ID'
          });
          failedCount++;
          continue;
        }
        
        // Create certificate
        await Certificate.create({
          certificateId: row.certificateId,
          studentName: row.studentName,
          email: row.email,
          phoneNumber: row.phoneNumber,
          internshipDomain: row.internshipDomain,
          startDate: new Date(row.startDate),
          endDate: new Date(row.endDate),
          performanceRating: row.performanceRating,
          skills: row.skills ? row.skills.split(',').map(s => s.trim()) : [],
          projectsCompleted: row.projectsCompleted ? 
            row.projectsCompleted.split(',').map(p => p.trim()) : [],
          mentorName: row.mentorName,
          uploadedBy: req.user.id
        });
        
        successCount++;
      } catch (error) {
        errors.push({
          row: i + 2,
          error: error.message
        });
        failedCount++;
      }
    }
    
    // Delete uploaded file
    fs.unlinkSync(req.file.path);
    
    res.status(201).json({
      success: true,
      message: 'Upload processed',
      data: {
        totalRecords: data.length,
        successfulUploads: successCount,
        failedUploads: failedCount,
        errors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, code: 'SERVER_ERROR' }
    });
  }
};

// @desc    Search certificate by ID
// @route   GET /api/certificates/search/:certificateId
// @access  Public
exports.searchCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId.toUpperCase(),
      status: 'active'
    });
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Certificate not found', code: 'NOT_FOUND' }
      });
    }
    
    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, code: 'SERVER_ERROR' }
    });
  }
};

// @desc    Download certificate as PDF
// @route   GET /api/certificates/:certificateId/download
// @access  Public
exports.downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId.toUpperCase(),
      status: 'active'
    });
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Certificate not found', code: 'NOT_FOUND' }
      });
    }
    
    // Create PDF
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 
      `attachment; filename=certificate_${certificate.certificateId}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(25).text(certificate.studentName, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(16).text(
      `has successfully completed the internship in ${certificate.internshipDomain}`,
      { align: 'center' }
    );
    doc.moveDown();
    doc.fontSize(14).text(
      `from ${certificate.startDate.toLocaleDateString()} to ${certificate.endDate.toLocaleDateString()}`,
      { align: 'center' }
    );
    doc.moveDown();
    doc.fontSize(12).text(`Duration: ${certificate.duration}`, { align: 'center' });
    doc.text(`Certificate ID: ${certificate.certificateId}`, { align: 'center' });
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message, code: 'SERVER_ERROR' }
    });
  }
};

// Additional methods: getAllCertificates, getCertificate, 
// updateCertificate, deleteCertificate, getDashboardStats
```

#### 10.1.5 Routes

**routes/authRoutes.js**
```javascript
const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
```

**routes/certificateRoutes.js**
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  uploadCertificates,
  searchCertificate,
  downloadCertificate,
  getAllCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
  getDashboardStats
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Public routes
router.get('/search/:certificateId', searchCertificate);
router.get('/:certificateId/download', downloadCertificate);

// Admin routes
router.post('/upload', protect, authorize('admin'), upload.single('file'), uploadCertificates);
router.get('/', protect, authorize('admin'), getAllCertificates);
router.get('/stats/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/:id', protect, authorize('admin'), getCertificate);
router.put('/:id', protect, authorize('admin'), updateCertificate);
router.delete('/:id', protect, authorize('admin'), deleteCertificate);

module.exports = router;
```

### 10.2 Frontend Implementation

#### 10.2.1 API Service Setup

**services/api.js**
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
```

**services/authService.js**
```javascript
import API from './api';

export const authService = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
```

**services/certificateService.js**
```javascript
import API from './api';

export const certificateService = {
  searchCertificate: async (certificateId) => {
    const response = await API.get(`/certificates/search/${certificateId}`);
    return response.data;
  },

  downloadCertificate: (certificateId) => {
    window.open(
      `${process.env.REACT_APP_API_URL}/certificates/${certificateId}/download`,
      '_blank'
    );
  },

  uploadCertificates: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await API.post('/certificates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getAllCertificates: async (params) => {
    const response = await API.get('/certificates', { params });
    return response.data;
  },

  getCertificate: async (id) => {
    const response = await API.get(`/certificates/${id}`);
    return response.data;
  },

  updateCertificate: async (id, data) => {
    const response = await API.put(`/certificates/${id}`, data);
    return response.data;
  },

  deleteCertificate: async (id) => {
    const response = await API.delete(`/certificates/${id}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await API.get('/certificates/stats/dashboard');
    return response.data;
  }
};
```

#### 10.2.2 Context Setup

**context/AuthContext.jsx**
```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

#### 10.2.3 Key Components

**components/common/ProtectedRoute.jsx**
```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

**pages/Login.jsx**
```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);
      toast.success(response.message);
      
      // Redirect based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

**pages/CertificateSearch.jsx**
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificateService } from '../services/certificateService';
import { toast } from 'react-toastify';

const CertificateSearch = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setLoading(true);

    try {
      const response = await certificateService.searchCertificate(certificateId);
      
      if (response.success) {
        navigate(`/certificate/${certificateId}`, { 
          state: { certificate: response.data } 
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Certificate Verification System
          </h1>
          
          <p className="text-center text-gray-600 mb-8">
            Enter your certificate ID to view and download your certificate
          </p>

          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate ID
              </label>
              <input
                type="text"
                id="certificateId"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                placeholder="e.g., CERT2024001"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 text-lg font-semibold"
            >
              {loading ? 'Searching...' : 'Search Certificate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CertificateSearch;
```

#### 10.2.4 App Routing

**App.jsx**
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CertificateSearch from './pages/CertificateSearch';
import CertificateView from './pages/CertificateView';
import AdminDashboard from './pages/AdminDashboard';
import UploadCertificates from './pages/UploadCertificates';
import ManageCertificates from './pages/ManageCertificates';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<CertificateSearch />} />
            <Route path="/certificate/:id" element={<CertificateView />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/upload"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UploadCertificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageCertificates />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

## 11. Testing Strategy

### 11.1 Backend Testing

#### 11.1.1 Unit Testing (Jest & Supertest)

**Install testing dependencies**:
```bash
npm install --save-dev jest supertest
```

**Example test file: tests/auth.test.js**
```javascript
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'user'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('userId');
    });

    it('should not register user with existing email', async () => {
      // Create user first
      await User.create({
        fullName: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'New User',
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Register user first
      await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
```

### 11.2 Frontend Testing

#### 11.2.1 Component Testing (React Testing Library)

**Install testing dependencies**:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Example test: Login.test.jsx**
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';

const MockLogin = () => (
  <BrowserRouter>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  it('renders login form', () => {
    render(<MockLogin />);
    
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows user to type email and password', () => {
    render(<MockLogin />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
```

### 11.3 Manual Testing Checklist

#### Authentication
- [ ] User registration with valid data
- [ ] User registration with invalid email
- [ ] User registration with short password
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Token expiration handling

#### Certificate Management (Admin)
- [ ] Upload Excel file with valid data
- [ ] Upload Excel with invalid format
- [ ] Upload Excel with duplicate certificate IDs
- [ ] View all certificates with pagination
- [ ] Search certificates
- [ ] Update certificate details
- [ ] Delete certificate

#### Certificate Search (Public)
- [ ] Search with valid certificate ID
- [ ] Search with invalid certificate ID
- [ ] Search with non-existent certificate ID
- [ ] View certificate details
- [ ] Download certificate as PDF
- [ ] PDF formatting and content

#### Security
- [ ] Unauthorized access to admin routes
- [ ] Unauthorized access to protected endpoints
- [ ] SQL injection attempts
- [ ] XSS attack prevention
- [ ] CSRF protection

---

## 12. Deployment Guide

### 12.1 Production Environment Setup

#### 12.1.1 MongoDB Atlas Setup (Cloud Database)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free Shared" tier
   - Select cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set permissions to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

### 12.2 Backend Deployment (Render/Heroku/Railway)

#### 12.2.1 Deploy to Render

1. **Prepare Application**
   - Create `render.yaml`:
```yaml
services:
  - type: web
    name: certificate-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: FRONTEND_URL
        sync: false
```

2. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

3. **Deploy on Render**
   - Go to https://render.com
   - Sign up/Login
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - Name: certificate-backend
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variables
   - Click "Create Web Service"

#### 12.2.2 Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<strong-random-secret-key>
JWT_EXPIRE=24h
FRONTEND_URL=<your-frontend-url>
MAX_FILE_SIZE=10485760
```

### 12.3 Frontend Deployment (Vercel/Netlify)

#### 12.3.1 Deploy to Vercel

1. **Prepare Application**
   - Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

2. **Update Environment Variable**
   - Create `.env.production`:
```env
REACT_APP_API_URL=<your-backend-url>/api
```

3. **Deploy**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts to deploy
```

Or use Vercel Dashboard:
- Go to https://vercel.com
- Import GitHub repository
- Configure build settings:
  - Framework Preset: Create React App
  - Build Command: `npm run build`
  - Output Directory: `build`
- Add environment variables
- Click "Deploy"

#### 12.3.2 Deploy to Netlify

1. **Create `_redirects` file** in `public/`:
```
/*    /index.html   200
```

2. **Build for production**:
```bash
npm run build
```

3. **Deploy via Netlify CLI**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

Or drag and drop `build` folder to https://app.netlify.com/drop

### 12.4 Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend is accessible
- [ ] Database connection working
- [ ] Environment variables set correctly
- [ ] File upload working
- [ ] Certificate download working
- [ ] Authentication working
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Error logging set up
- [ ] Backup strategy in place

---

## 13. User Manual

### 13.1 Admin User Guide

#### 13.1.1 Admin Login
1. Navigate to the login page
2. Enter admin credentials
3. Click "Sign In"
4. You will be redirected to the Admin Dashboard

#### 13.1.2 Upload Certificates

**Excel File Format:**
The Excel file must contain the following columns:
- `certificateId` (Required): Unique ID (e.g., CERT2024001)
- `studentName` (Required): Full name of the student
- `email`: Student's email address
- `phoneNumber`: Contact number
- `internshipDomain` (Required): Area of internship
- `startDate` (Required): Start date (YYYY-MM-DD or DD/MM/YYYY)
- `endDate` (Required): End date (YYYY-MM-DD or DD/MM/YYYY)
- `performanceRating`: Performance assessment
- `skills`: Comma-separated list of skills
- `projectsCompleted`: Comma-separated list of projects
- `mentorName`: Name of the mentor

**Sample Excel Data:**
| certificateId | studentName | email | internshipDomain | startDate | endDate |
|---------------|-------------|-------|------------------|-----------|---------|
| CERT2024001 | John Doe | john@email.com | Web Development | 2024-01-15 | 2024-04-15 |

**Upload Steps:**
1. Go to "Upload Certificates" page
2. Click "Choose File"
3. Select your Excel file (.xlsx or .xls)
4. Click "Upload"
5. Wait for processing
6. Review upload results

#### 13.1.3 Manage Certificates
1. Navigate to "Manage Certificates"
2. View all uploaded certificates
3. Use search to find specific certificates
4. Click "View" to see details
5. Click "Edit" to modify certificate
6. Click "Delete" to remove certificate

#### 13.1.4 View Statistics
1. Go to Admin Dashboard
2. View:
   - Total certificates issued
   - Active certificates
   - Certificates by domain
   - Recent uploads

### 13.2 Student User Guide

#### 13.2.1 Search Certificate
1. Go to Certificate Search page
2. Enter your Certificate ID (e.g., CERT2024001)
3. Click "Search Certificate"
4. If found, you'll be redirected to the certificate page

#### 13.2.2 View Certificate
1. After searching, view your certificate details:
   - Student name
   - Internship domain
   - Duration
   - Dates
   - Performance rating
   - Skills gained

#### 13.2.3 Download Certificate
1. On the certificate page
2. Click "Download Certificate" button
3. PDF will download automatically
4. Open PDF to view/print your certificate

### 13.3 Troubleshooting

#### Common Issues

**Problem: Cannot login**
- Solution: Verify email and password are correct
- Ensure account is active
- Contact admin if issue persists

**Problem: Certificate not found**
- Solution: Double-check Certificate ID
- Ensure ID is entered in correct format
- Contact admin to verify certificate exists

**Problem: Cannot upload Excel file**
- Solution: Ensure file is .xlsx or .xls format
- Check file size (max 10MB)
- Verify all required columns are present
- Check for duplicate certificate IDs

**Problem: PDF download not working**
- Solution: Check internet connection
- Ensure pop-ups are not blocked
- Try different browser
- Clear browser cache

---

## Appendix

### A. Excel Template Download

**Certificate Upload Template.xlsx**

Download link: [Create this file manually]

### B. API Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |

### C. Glossary

- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **CRUD**: Create, Read, Update, Delete
- **CORS**: Cross-Origin Resource Sharing
- **REST**: Representational State Transfer
- **MVC**: Model-View-Controller
- **ODM**: Object Document Mapper

### D. Resources

**Official Documentation:**
- MongoDB: https://docs.mongodb.com
- Express.js: https://expressjs.com
- React: https://react.dev
- Node.js: https://nodejs.org

**Learning Resources:**
- MDN Web Docs: https://developer.mozilla.org
- Stack Overflow: https://stackoverflow.com
- freeCodeCamp: https://www.freecodecamp.org

### E. Support and Contact

For technical support or questions:
- Email: support@example.com
- Documentation: Link to online docs
- Issues: GitHub repository issues page

---

## Project Completion Checklist

### Backend
- [ ] Database models created
- [ ] API endpoints implemented
- [ ] Authentication middleware
- [ ] File upload handling
- [ ] PDF generation
- [ ] Input validation
- [ ] Error handling
- [ ] Environment configuration

### Frontend
- [ ] All pages created
- [ ] Routing configured
- [ ] API integration
- [ ] Authentication flow
- [ ] Admin dashboard
- [ ] Certificate search
- [ ] PDF download
- [ ] Responsive design

### Testing
- [ ] Unit tests written
- [ ] Integration tests
- [ ] Manual testing completed
- [ ] Security testing
- [ ] Performance testing

### Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database configured
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate installed

### Documentation
- [ ] API documentation
- [ ] User manual
- [ ] Admin manual
- [ ] Deployment guide
- [ ] README file

---

**Document Version:** 1.0  
**Last Updated:** April 2024  
**Prepared For:** Certificate Verification System Development

---

**End of Documentation**
