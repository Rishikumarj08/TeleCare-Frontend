import axiosInstance from '../../../utils/axiosInstance';

// Patient
export const getPatient = (id: number) => axiosInstance.get(`/api/patient/${id}`);
export const createPatient = (data: object) => axiosInstance.post('/api/patient', data);
export const updatePatient = (id: number, data: object) => axiosInstance.put(`/api/patient/${id}`, data);
export const filterPatients = (params: object) => axiosInstance.get('/api/patient/filter', { params });

// Appointments
export const getAllAppointments = () => axiosInstance.get('/api/appointment');
export const getAppointment = (id: number) => axiosInstance.get(`/api/appointment/${id}`);
export const filterAppointments = (params: object) => axiosInstance.get('/api/appointment/filter', { params });

// Adherence
export const createAdherence = (data: object) => axiosInstance.post('/api/adherence', data);
export const getAdherence = (id: number) => axiosInstance.get(`/api/adherence/${id}`);
export const updateAdherence = (id: number, data: object) => axiosInstance.put(`/api/adherence/${id}`, data);
export const filterAdherence = (params: object) => axiosInstance.get('/api/adherence/filter', { params });

// Enrollment
export const createEnrollment = (data: object) => axiosInstance.post('/api/enrollment', data);
export const getEnrollment = (id: number) => axiosInstance.get(`/api/enrollment/${id}`);
export const updateEnrollment = (id: number, data: object) => axiosInstance.put(`/api/enrollment/${id}`, data);
export const filterEnrollments = (params: object) => axiosInstance.get('/api/enrollment/filter', { params });

// Telemetry
export const createTelemetry = (data: object) => axiosInstance.post('/api/telemetry', data);
export const getTelemetry = (id: number) => axiosInstance.get(`/api/telemetry/${id}`);
export const filterTelemetry = (params: object) => axiosInstance.get('/api/telemetry/filter', { params });

// Medications
export const getAllMedications = (params?: object) => axiosInstance.get('/api/medications', { params });
export const getMedication = (id: number) => axiosInstance.get(`/api/medications/${id}`);

// Programs
export const getAllPrograms = (params?: object) => axiosInstance.get('/api/program', { params });
export const getProgram = (id: number) => axiosInstance.get(`/api/program/${id}`);

// Care Plans
export const getAllCarePlans = (params?: object) => axiosInstance.get('/api/careplans', { params });
export const getCarePlan = (id: number) => axiosInstance.get(`/api/careplans/${id}`);

// Notifications (user)
export const getUserNotifications = (userId: number) => axiosInstance.get(`/api/user/notifications/${userId}`);
export const markNotificationRead = (id: number) => axiosInstance.patch(`/api/user/notifications/${id}/read`);
