import React, { useState } from 'react';
import { certificateService } from '../services/certificateService';
import { FiUploadCloud, FiFile, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UploadCertificates = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')
      ) {
        setFile(selectedFile);
        setResult(null);
      } else {
        toast.error('Please upload a valid Excel file (.xlsx or .xls)');
        e.target.value = null;
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const response = await certificateService.uploadCertificates(file);
      if (response.success) {
        setResult(response.data);
        if (response.data.failedUploads === 0) {
          toast.success('All certificates uploaded successfully!');
        } else {
          toast.warning(`Uploaded with some errors. Please check the results.`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setFile(null); // Clear file input
      document.getElementById('file-upload').value = null; // Reset input field visually
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Upload Certificates</h1>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:text-indigo-900 font-medium pb-1 border-b border-transparent hover:border-indigo-600">Back to Dashboard</Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Instructions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload an Excel file containing the certificate data. Required columns: <code className="bg-gray-100 px-1 rounded">certificateId</code>, <code className="bg-gray-100 px-1 rounded">studentName</code>, <code className="bg-gray-100 px-1 rounded">internshipDomain</code>, <code className="bg-gray-100 px-1 rounded">startDate</code>, <code className="bg-gray-100 px-1 rounded">endDate</code>.
          </p>
        </div>

        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="space-y-1 text-center">
            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 justify-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2 py-1 shadow-sm"
              >
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .xls" />
              </label>
            </div>
            <p className="text-xs text-gray-500">Excel files (.xlsx, .xls) up to 10MB</p>
          </div>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between p-4 bg-indigo-50 rounded-md border border-indigo-100">
            <div className="flex items-center">
              <FiFile className="h-6 w-6 text-indigo-500 mr-3" />
              <span className="text-sm font-medium text-gray-900">{file.name}</span>
              <span className="ml-2 text-sm text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Processing...' : 'Upload Data'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Results</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Processed</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{result.totalRecords}</dd>
              </div>
              <div className="px-4 py-5 bg-green-50 shadow rounded-lg overflow-hidden border border-green-200">
                <dt className="text-sm font-medium text-green-800 truncate">Successful</dt>
                <dd className="mt-1 text-3xl font-semibold text-green-900 flex items-center">
                  <FiCheckCircle className="mr-2 h-6 w-6 text-green-500" />
                  {result.successfulUploads}
                </dd>
              </div>
              <div className="px-4 py-5 bg-red-50 shadow rounded-lg overflow-hidden border border-red-200">
                <dt className="text-sm font-medium text-red-800 truncate">Failed</dt>
                <dd className="mt-1 text-3xl font-semibold text-red-900 flex items-center">
                  <FiAlertCircle className="mr-2 h-6 w-6 text-red-500" />
                  {result.failedUploads}
                </dd>
              </div>
            </dl>

            {result.errors && result.errors.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-medium text-red-800 mb-4">Error Details</h4>
                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cert ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Note</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {result.errors.map((error, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.row}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.certificateId || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{error.error}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCertificates;
