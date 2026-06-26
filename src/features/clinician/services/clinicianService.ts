import axiosInstance from '../../../utils/axiosInstance';

// Appointments
export const getAllAppointments = () => axiosInstance.get('/api/appointment');
export const getAppointment = (id: number) => axiosInstance.get(`/api/appointment/${id}`);
export const createAppointment = (data: object) => axiosInstance.post('/api/appointment', data);
export const updateAppointment = (id: number, data: object) => axiosInstance.put(`/api/appointment/${id}`, data);
export const filterAppointments = (params: object) => axiosInstance.get('/api/appointment/filter', { params });
export const patchAppointmentStatus = (id: number, status: string) => axiosInstance.patch(`/api/appointment/${id}/status`, { Status: status });

// Alerts
export const getAllAlerts = () => axiosInstance.get('/api/alert');
export const getAlert = (id: number) => axiosInstance.get(`/api/alert/${id}`);
export const createAlert = (data: object) => axiosInstance.post('/api/alert', data);
export const updateAlert = (id: number, data: object) => axiosInstance.put(`/api/alert/${id}`, data);
export const filterAlerts = (params: object) => axiosInstance.get('/api/alert/filter', { params });
export const patchAlertStatus = (id: number, status: string) => axiosInstance.patch(`/api/alert/${id}/status`, { Status: status });

// Visit Notes
export const getAllVisitNotes = () => axiosInstance.get('/api/visitnote');
export const getVisitNote = (id: number) => axiosInstance.get(`/api/visitnote/${id}`);
export const createVisitNote = (data: object) => axiosInstance.post('/api/visitnote', data);
export const updateVisitNote = (id: number, data: object) => axiosInstance.put(`/api/visitnote/${id}`, data);
export const filterVisitNotes = (params: object) => axiosInstance.get('/api/visitnote/filter', { params });

// Patients (read-only for clinician)
export const getPatient = (id: number) => axiosInstance.get(`/api/patient/${id}`);
export const filterPatients = (params: object) => axiosInstance.get('/api/patient/filter', { params });

// Telemetry (read)
export const getTelemetry = (id: number) => axiosInstance.get(`/api/telemetry/${id}`);
export const filterTelemetry = (params: object) => axiosInstance.get('/api/telemetry/filter', { params });
