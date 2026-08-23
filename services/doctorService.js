import api from './api';

export const doctorService = {
  async getDoctors(params = {}) {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  async getDoctorById(id) {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  async searchDoctors(query, department) {
    const params = {};
    if (query) params.search = query;
    if (department) params.department = department;
    const response = await api.get('/doctors', { params });
    return response.data;
  },
};