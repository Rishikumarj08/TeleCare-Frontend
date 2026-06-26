import axiosInstance from '../../../utils/axiosInstance';

// Patients (read)
export const getPatient = (id: number) => axiosInstance.get(`/api/patient/${id}`);
export const filterPatients = (params: object) => axiosInstance.get('/api/patient/filter', { params });

// Care Plans
export const getAllCarePlans = (params?: object) => axiosInstance.get('/api/careplans', { params });
export const getCarePlan = (id: number) => axiosInstance.get(`/api/careplans/${id}`);
export const createCarePlan = (data: object) => axiosInstance.post('/api/careplans', data);
export const updateCarePlan = (id: number, data: object) => axiosInstance.put(`/api/careplans/${id}`, data);

// Medications
export const getAllMedications = (params?: object) => axiosInstance.get('/api/medications', { params });
export const getMedication = (id: number) => axiosInstance.get(`/api/medications/${id}`);
export const createMedication = (patientId: number, data: object) =>
  axiosInstance.post(`/api/medications?patientId=${patientId}`, data);
export const updateMedication = (id: number, data: object) => axiosInstance.put(`/api/medications/${id}`, data);

// Programs
export const getAllPrograms = (params?: object) => axiosInstance.get('/api/program', { params });
export const getProgram = (id: number) => axiosInstance.get(`/api/program/${id}`);
export const createProgram = (data: object) => axiosInstance.post('/api/program', data);
export const updateProgram = (id: number, data: object) => axiosInstance.put(`/api/program/${id}`, data);
export const deleteProgram = (id: number) => axiosInstance.delete(`/api/program/${id}`);

// Adherence (read)
export const getAdherence = (id: number) => axiosInstance.get(`/api/adherence/${id}`);
export const filterAdherence = (params: object) => axiosInstance.get('/api/adherence/filter', { params });

// Enrollment (read)
export const getEnrollment = (id: number) => axiosInstance.get(`/api/enrollment/${id}`);
export const filterEnrollments = (params: object) => axiosInstance.get('/api/enrollment/filter', { params });
