import API from './api';

export const certificateService = {
  searchCertificate: async (certificateId) => {
    const response = await API.get(`/certificates/search/${certificateId}`);
    return response.data;
  },

  downloadCertificate: (certificateId) => {
    window.open(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/certificates/${certificateId}/download`,
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
