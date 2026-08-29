import api from './api';

export const doctorService = {
  async getDoctors(params = {}) {
    try {
      const response = await api.get('/doctors', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  async getDoctorById(id) {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  },
};
