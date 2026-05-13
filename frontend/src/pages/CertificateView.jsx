import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { certificateService } from '../services/certificateService';
import { FiDownload, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CertificateView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(location.state?.certificate || null);
  const [loading, setLoading] = useState(!certificate);

  useEffect(() => {
    if (!certificate) {
      const fetchCert = async () => {
        try {
          const res = await certificateService.searchCertificate(id);
          if (res.success) setCertificate(res.data);
        } catch (error) {
          toast.error('Certificate not found.');
          navigate('/search');
        } finally {
          setLoading(false);
        }
      };
      fetchCert();
    }
  }, [id, certificate, navigate]);

  if (loading) return <div className="flex justify-center items-center h-[calc(100vh-64px)]">Loading...</div>;
  if (!certificate) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 px-6 py-8 sm:p-10 sm:pb-6 text-center">
            <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-indigo-200">
              <FiCheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Verified Certificate</h2>
            <p className="mt-2 text-indigo-100">This certificate is officially verified in our system.</p>
          </div>

          <div className="px-6 py-8 sm:p-10 bg-gray-50 border-b border-gray-200">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                <dd className="mt-1 text-base text-gray-900 font-mono font-bold bg-gray-200 inline-block px-2 py-1 rounded">{certificate.certificateId}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-base text-gray-900">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {certificate.status.toUpperCase()}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Student Name</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{certificate.studentName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Internship Domain</dt>
                <dd className="mt-1 text-base text-gray-900">{certificate.internshipDomain}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-base text-gray-900">
                  {new Date(certificate.startDate).toLocaleDateString()} - {new Date(certificate.endDate).toLocaleDateString()}
                  <span className="block text-sm text-gray-500 mt-1">({certificate.duration})</span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Performance</dt>
                <dd className="mt-1 text-base text-gray-900">{certificate.performanceRating || 'N/A'}</dd>
              </div>
              {certificate.skills?.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Skills Acquired</dt>
                  <dd className="mt-2 text-base text-gray-900 flex flex-wrap gap-2">
                    {certificate.skills.map((skill, i) => (
                      <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="px-6 py-6 sm:px-10 bg-white flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => certificateService.downloadCertificate(certificate.certificateId)}
              className="flex-1 max-w-xs justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FiDownload className="mr-2 h-5 w-5" />
              Download PDF
            </button>
            <button
              onClick={() => navigate('/search')}
              className="flex-1 max-w-xs justify-center inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Verify Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
