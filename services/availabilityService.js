import api from './api';

export const availabilityService = {
  async getAvailability(doctorId, date) {
    try {
      const response = await api.get('/availability', {
        params: { doctorId, date },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  async addAvailability(availabilityData) {
    try {
      const response = await api.post('/availability', availabilityData);
      return response.data;
    } catch (error) {
      console.error('Error adding availability:', error);
      throw error;
    }
  },
};
