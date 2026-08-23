import api from './api';

export const availabilityService = {
  async getAvailability(doctorId, date) {
    const response = await api.get('/availability', {
      params: { doctorId, date },
    });
    return response.data;
  },

  async addAvailability(availabilityData) {
    const response = await api.post('/availability', availabilityData);
    return response.data;
  },
};