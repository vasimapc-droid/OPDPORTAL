import api from './api';

export const appointmentService = {
  async getAppointments(filters = {}) {
    try {
      const response = await api.get('/appointments', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  async bookAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  async updateAppointmentStatus(id, status, consultationNotes = '') {
    try {
      const response = await api.patch(`/appointments/${id}`, {
        status,
        consultationNotes,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },
};
