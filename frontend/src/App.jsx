import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CertificateSearch from './pages/CertificateSearch';
import CertificateView from './pages/CertificateView';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UploadCertificates from './pages/UploadCertificates';
import ManageCertificates from './pages/ManageCertificates';

// User Pages
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
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
          </main>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
