import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificateService } from '../services/certificateService';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';

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
        navigate(`/certificate/${certificateId}`, { state: { certificate: response.data } });
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <FiSearch className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Certificate
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the unique Certificate ID to verify its authenticity
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSearch}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="certificate-id" className="sr-only">Certificate ID</label>
              <input
                id="certificate-id"
                name="certificateId"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-lg text-center font-mono uppercase"
                placeholder="e.g. CERT2024001"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {loading ? 'Verifying...' : 'Verify Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateSearch;
