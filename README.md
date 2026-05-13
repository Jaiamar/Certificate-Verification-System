# 🎓 Certificate Verification System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A full-stack MERN application that enables organizations to **issue**, **manage**, and **verify** internship certificates digitally — eliminating paperwork and enabling instant certificate validation.

[Live Demo](#) · [Report Bug](https://github.com/Jaiamar/Certificate-Verification-System/issues) · [Request Feature](https://github.com/Jaiamar/Certificate-Verification-System/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Sample Data & Seeding](#-sample-data--seeding)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 About the Project

The **Certificate Verification System** is a secure, full-stack web application built on the MERN stack. It streamlines the entire lifecycle of internship certificates:

- Administrators can **bulk-upload student data** via Excel files.
- Students can **search and download** their certificates using unique Certificate IDs.
- Anyone can **verify the authenticity** of a certificate in seconds.
- All data is protected by **JWT-based authentication** and **role-based access control**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📊 **Admin Dashboard** | Real-time statistics: total, active, and revoked certificates by domain |
| 📁 **Bulk Excel Upload** | Import hundreds of student records at once via `.xlsx` files |
| 🔍 **Certificate Search** | Public search by Certificate ID — no login required |
| 📄 **PDF Download** | Download a professionally formatted certificate as a PDF |
| 🔐 **Secure Authentication** | JWT tokens, bcrypt password hashing, and role-based guards |
| 🛡️ **Security Hardened** | Helmet.js headers, CORS policy, and rate limiting built-in |
| ✅ **Data Validation** | Server-side validation on all inputs via `express-validator` |
| 📱 **Responsive UI** | Mobile-friendly design with Tailwind CSS |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Axios | HTTP client |
| React Hook Form + Yup | Form management & validation |
| React Toastify | Notifications |
| jsPDF + React PDF | PDF generation & rendering |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 18+ | Runtime environment |
| Express.js 5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| bcrypt | Password hashing |
| JSON Web Token (JWT) | Authentication tokens |
| Multer | File upload handling |
| xlsx | Excel file parsing |
| PDFKit | Server-side PDF generation |
| Helmet + CORS | Security middleware |
| express-rate-limit | API rate limiting |
| express-validator | Input sanitization & validation |

---

## 📁 Project Structure

```
Certificate-Verification-System/
│
├── backend/                        # Node.js + Express API server
│   ├── config/
│   │   └── database.js             # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Logout, Me
│   │   ├── certificateController.js# CRUD + upload + stats
│   │   └── userController.js       # User management (admin)
│   ├── middleware/
│   │   ├── auth.js                 # JWT protect & role guard
│   │   └── validation.js           # express-validator error handler
│   ├── models/
│   │   ├── User.js                 # User schema (with bcrypt hook)
│   │   └── Certificate.js          # Certificate schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── certificateRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/                    # Temporary file storage
│   ├── .env                        # Environment variables (not committed)
│   ├── server.js                   # App entry point
│   ├── seed.js                     # Database seeder script
│   └── package.json
│
├── frontend/                       # React + Vite SPA
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state (React Context)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UploadCertificates.jsx
│   │   │   ├── ManageCertificates.jsx
│   │   │   ├── CertificateSearch.jsx
│   │   │   ├── CertificateView.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   └── certificateService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── sample_certificates.xlsx        # Sample Excel file for testing uploads
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) v6+ (running locally)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Jaiamar/Certificate-Verification-System.git
cd Certificate-Verification-System
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables) below).

Start the backend development server:
```bash
npm run dev
```
The API will be available at `http://localhost:5000`.

### 3. Setup the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Seed Sample Data (Optional)

To quickly populate the database with sample accounts and certificates for testing:

```bash
cd backend
node seed.js
```

This creates the following accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password123` |
| User | `user@example.com` | `password123` |

And inserts **7 sample certificates** across domains like Web Development, Data Science, Cloud Computing, and Cybersecurity.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate_system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
```

> ⚠️ **Never commit your `.env` file.** It is already excluded via `.gitignore`.

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/me` | Private | Get current user profile |
| `POST` | `/api/auth/logout` | Private | Logout |

### Certificates

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/certificates/search/:id` | Public | Search certificate by ID |
| `GET` | `/api/certificates/stats/dashboard` | Admin | Dashboard statistics |
| `GET` | `/api/certificates` | Admin | List all certificates (paginated) |
| `POST` | `/api/certificates/upload` | Admin | Bulk upload via Excel file |
| `GET` | `/api/certificates/:id` | Admin | Get a single certificate |
| `PUT` | `/api/certificates/:id` | Admin | Update a certificate |
| `DELETE` | `/api/certificates/:id` | Admin | Delete a certificate |
| `GET` | `/api/certificates/:id/download` | Public | Download certificate as PDF |

### Users (Admin Only)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin | List all users |
| `PUT` | `/api/users/:id/status` | Admin | Activate / deactivate a user |

All protected routes require the header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 👥 User Roles

### 🔴 Admin
- Login to the admin dashboard
- Upload bulk student certificate data via Excel (`.xlsx`)
- View dashboard statistics (total, active, revoked, domains)
- Manage (create, update, delete) individual certificates
- View and manage user accounts

### 🔵 User / Student
- Register and login
- Search for any certificate by its unique ID
- View full certificate details
- Download certificate as a PDF

### 🟢 Public (No Login Required)
- Search for certificates by ID
- View and verify certificate authenticity

---

## 🌱 Sample Data & Seeding

The repository includes a `seed.js` script and a `sample_certificates.xlsx` file for testing.

**To re-seed the database at any time:**
```bash
cd backend
node seed.js
```

**Sample Certificate IDs you can search for:**

| Certificate ID | Student | Domain |
|---|---|---|
| `CERT-2023-001` | Alice Smith | Web Development |
| `CERT-2023-002` | Bob Johnson | Data Science |
| `CERT-2023-003` | Charlie Brown | Cloud Computing |
| `CERT-2023-004` | Diana Prince | Cybersecurity |
| `CERT-2023-005` | Ethan Hunt | Web Development |
| `CERT-2023-006` | Fiona Gallagher | Data Science |
| `CERT-2023-007` | George Miller | UI/UX Design |

---

## 🔒 Security Highlights

- **Password Hashing**: All passwords are hashed using `bcrypt` with 10 salt rounds before storage.
- **JWT Authentication**: Stateless, expiring tokens (24h) for secure session management.
- **Role-Based Access Control (RBAC)**: Admin and User roles enforced on every protected route.
- **Rate Limiting**: API requests are limited to 200 per 15-minute window to prevent abuse.
- **HTTP Security Headers**: `helmet.js` sets secure response headers automatically.
- **Input Validation**: All user inputs are sanitized and validated server-side with `express-validator`.
- **CORS Policy**: Restricted to trusted frontend origins only.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by [Jaiamar](https://github.com/Jaiamar)

</div>