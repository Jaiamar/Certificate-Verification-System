import React, { useEffect, useState } from 'react';
import { certificateService } from '../services/certificateService';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiXCircle, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await certificateService.getDashboardStats();
        if (response.success) setStats(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-[calc(100vh-64px)]">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="mb-8 flex space-x-4">
        <Link to="/admin/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Upload Certificates
        </Link>
        <Link to="/admin/certificates" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Manage Certificates
        </Link>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <FiFileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Certificates</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCertificates}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FiCheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeCertificates}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <FiXCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Revoked</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.revokedCertificates}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FiTrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Domains</p>
                <p className="text-2xl font-semibold text-gray-900">{Object.keys(stats.certificatesByDomain).length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Domains */}
            <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Top Domains</h2>
              <ul className="divide-y divide-gray-200">
                {Object.entries(stats.certificatesByDomain).map(([domain, count]) => (
                  <li key={domain} className="py-4 flex justify-between">
                    <span className="text-sm font-medium text-gray-900">{domain}</span>
                    <span className="text-sm text-gray-500">{count} certificates</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Uploads */}
            <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Uploads</h2>
              <ul className="divide-y divide-gray-200">
                {stats.recentUploads.map((cert) => (
                  <li key={cert._id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {cert.studentName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {cert.certificateId} &bull; {cert.internshipDomain}
                        </p>
                      </div>
                      <div>
                        <Link to={`/certificate/${cert.certificateId}`} className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-xs leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                          View
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
