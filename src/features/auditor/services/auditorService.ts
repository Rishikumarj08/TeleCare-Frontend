import axiosInstance from '../../../utils/axiosInstance';

// Audit Logs
export const getAllAuditLogs = () => axiosInstance.get('/api/auditor/auditlogs');
export const searchAuditLogs = (data: object) => axiosInstance.post('/api/auditor/auditlogs/search', data);

// KPIs
export const getAllKpis = () => axiosInstance.get('/api/auditor/kpis');
export const searchKpis = (data: object) => axiosInstance.post('/api/auditor/kpis/search', data);
export const createKpi = (data: object) => axiosInstance.post('/api/auditor/kpis', data);
export const updateKpi = (id: number, data: object) => axiosInstance.put(`/api/auditor/kpis/${id}`, data);
export const deleteKpi = (id: number) => axiosInstance.delete(`/api/auditor/kpis/${id}`);

// Patient Visits
export const getAllPatientVisits = () => axiosInstance.get('/api/auditor/patientvisits');
export const searchPatientVisits = (data: object) => axiosInstance.post('/api/auditor/patientvisits/search', data);
