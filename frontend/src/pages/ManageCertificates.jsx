import React, { useEffect, useState, useCallback } from 'react';
import { certificateService } from '../services/certificateService';
import { FiSearch, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ManageCertificates = () => {
  const [data, setData] = useState({ certificates: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCertificates = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await certificateService.getAllCertificates({ page, limit: 10, search });
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates(currentPage, searchTerm);
  }, [fetchCertificates, currentPage]); // wait, search is triggered manually or debated?

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 on new search
    fetchCertificates(1, searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        const response = await certificateService.deleteCertificate(id);
        if (response.success) {
          toast.success(response.message);
          fetchCertificates(currentPage, searchTerm);
        }
      } catch (error) {
        toast.error('Failed to delete certificate');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Manage Certificates</h1>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:text-indigo-900 font-medium">Back to Dashboard</Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 sm:flex sm:items-center sm:justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                placeholder="Search by ID, Name, Domain, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="hidden">Submit</button>
            </div>
          </form>
          <div className="mt-4 sm:mt-0 sm:ml-4 flex gap-2">
            <button onClick={handleSearchSubmit} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Search
            </button>
            {searchTerm && (
              <button 
                onClick={() => { setSearchTerm(''); setCurrentPage(1); fetchCertificates(1, ''); }} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading certificates...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cert ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Info</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.certificates.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No certificates found</td></tr>
                ) : (
                  data.certificates.map((cert) => (
                    <tr key={cert._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-l-4 border-transparent hover:border-indigo-500">
                        {cert.certificateId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{cert.studentName}</div>
                        <div className="text-sm text-gray-500">{cert.email || 'No email provided'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.internshipDomain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <Link to={`/certificate/${cert.certificateId}`} className="text-indigo-600 hover:text-indigo-900 inline-block p-1 bg-indigo-50 rounded" title="View Certificate">
                          <FiExternalLink />
                        </Link>
                        {/* Note: Edit feature could be a modal or dedicated page, keeping it simple for now */}
                        <button onClick={() => handleDelete(cert._id)} className="text-red-600 hover:text-red-900 inline-block p-1 bg-red-50 rounded" title="Delete">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && data.pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((data.pagination.currentPage - 1) * 10) + 1}</span> to <span className="font-medium">{Math.min(data.pagination.currentPage * 10, data.pagination.totalRecords)}</span> of <span className="font-medium">{data.pagination.totalRecords}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={!data.pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Previous
                  </button>
                  {[...Array(data.pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(data.pagination.totalPages, p + 1))}
                    disabled={!data.pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCertificates;
