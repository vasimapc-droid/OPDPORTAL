import api from './api';

export const appointmentService = {
  async getAppointments(filters = {}) {
    const response = await api.get('/appointments', { params: filters });
    return response.data;
  },

  async bookAppointment(appointmentData) {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  async updateAppointmentStatus(id, status) {
    const response = await api.patch(`/appointments/${id}`, { status });
    return response.data;
  },

  async getAppointmentById(id) {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
};