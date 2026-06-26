import api from './axiosInstance';

// Users
export const getAllUsers = () => api.get('/api/admin/users');
export const searchUsers = (data: object) => api.post('/api/admin/users/search', data);
export const createUser = (data: object) => api.post('/api/admin/users', data);
export const updateUser = (userId: number, data: object) => api.put(`/api/admin/users/${userId}`, data);

// Charges
export const getAllCharges = () => api.get('/api/admin/charges');
export const searchCharges = (data: object) => api.post('/api/admin/charges/search', data);
export const createCharge = (data: object) => api.post('/api/admin/charges', data);
export const updateCharge = (id: number, data: object) => api.put(`/api/admin/charges/${id}`, data);
export const deleteCharge = (id: number) => api.delete(`/api/admin/charges/${id}`);

// Claims
export const getAllClaims = () => api.get('/api/admin/claims');
export const searchClaims = (data: object) => api.post('/api/admin/claims/search', data);
export const createClaim = (data: object) => api.post('/api/admin/claims', data);
export const updateClaim = (id: number, data: object) => api.put(`/api/admin/claims/${id}`, data);
export const deleteClaim = (id: number) => api.delete(`/api/admin/claims/${id}`);
export const getPayers = () => api.get('/api/admin/claims/payers');

// Notifications
export const getAllNotifications = () => api.get('/api/admin/notifications');
export const getNotificationsForUser = (userId: number) => api.get(`/api/admin/notifications/user/${userId}`);
export const sendNotification = (data: object) => api.post('/api/admin/notifications/send', data);
export const deleteNotification = (id: number) => api.delete(`/api/admin/notifications/${id}`);

// Payments
export const getAllPayments = () => api.get('/api/admin/payments');
export const searchPayments = (data: object) => api.post('/api/admin/payments/search', data);
export const createPayment = (data: object) => api.post('/api/admin/payments', data);
export const updatePayment = (id: number, data: object) => api.put(`/api/admin/payments/${id}`, data);
export const deletePayment = (id: number) => api.delete(`/api/admin/payments/${id}`);

// Rules
export const getAllRules = () => api.get('/api/admin/rules');
export const searchRules = (data: object) => api.post('/api/admin/rules/search', data);
export const createRule = (data: object) => api.post('/api/admin/rules', data);
export const updateRule = (id: number, data: object) => api.put(`/api/admin/rules/${id}`, data);
export const deleteRule = (id: number) => api.delete(`/api/admin/rules/${id}`);
