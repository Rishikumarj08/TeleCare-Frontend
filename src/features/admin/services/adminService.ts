import axiosInstance from '../../../utils/axiosInstance';

// --- Users ---
export const getAllUsers = () => axiosInstance.get('/api/admin/users');
export const searchUsers = (data: object) => axiosInstance.post('/api/admin/users/search', data);
export const createUser = (data: object) => axiosInstance.post('/api/admin/users', data);
export const updateUser = (id: number, data: object) => axiosInstance.put(`/api/admin/users/${id}`, data);

// --- Charges ---
export const getAllCharges = () => axiosInstance.get('/api/admin/charges');
export const searchCharges = (data: object) => axiosInstance.post('/api/admin/charges/search', data);
export const createCharge = (data: object) => axiosInstance.post('/api/admin/charges', data);
export const updateCharge = (id: number, data: object) => axiosInstance.put(`/api/admin/charges/${id}`, data);
export const deleteCharge = (id: number) => axiosInstance.delete(`/api/admin/charges/${id}`);

// --- Claims ---
export const getAllClaims = () => axiosInstance.get('/api/admin/claims');
export const searchClaims = (data: object) => axiosInstance.post('/api/admin/claims/search', data);
export const createClaim = (data: object) => axiosInstance.post('/api/admin/claims', data);
export const updateClaim = (id: number, data: object) => axiosInstance.put(`/api/admin/claims/${id}`, data);
export const deleteClaim = (id: number) => axiosInstance.delete(`/api/admin/claims/${id}`);
export const getPayers = () => axiosInstance.get('/api/admin/claims/payers');

// --- Payments ---
export const getAllPayments = () => axiosInstance.get('/api/admin/payments');
export const searchPayments = (data: object) => axiosInstance.post('/api/admin/payments/search', data);
export const createPayment = (data: object) => axiosInstance.post('/api/admin/payments', data);
export const updatePayment = (id: number, data: object) => axiosInstance.put(`/api/admin/payments/${id}`, data);
export const deletePayment = (id: number) => axiosInstance.delete(`/api/admin/payments/${id}`);

// --- Rules ---
export const getAllRules = () => axiosInstance.get('/api/admin/rules');
export const searchRules = (data: object) => axiosInstance.post('/api/admin/rules/search', data);
export const createRule = (data: object) => axiosInstance.post('/api/admin/rules', data);
export const updateRule = (id: number, data: object) => axiosInstance.put(`/api/admin/rules/${id}`, data);
export const deleteRule = (id: number) => axiosInstance.delete(`/api/admin/rules/${id}`);

// --- Notifications ---
export const getAllNotifications = () => axiosInstance.get('/api/admin/notifications');
export const getNotificationsForUser = (userId: number) => axiosInstance.get(`/api/admin/notifications/user/${userId}`);
export const sendNotification = (data: object) => axiosInstance.post('/api/admin/notifications/send', data);
export const deleteNotification = (id: number) => axiosInstance.delete(`/api/admin/notifications/${id}`);
