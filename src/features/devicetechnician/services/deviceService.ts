import axiosInstance from '../../../utils/axiosInstance';

export const getDevice = (id: number) => axiosInstance.get(`/api/devices/${id}`);
export const createDevice = (data: object) => axiosInstance.post('/api/devices', data);
export const updateDevice = (id: number, data: object) => axiosInstance.put(`/api/devices/${id}`, data);
export const deleteDevice = (id: number) => axiosInstance.delete(`/api/devices/${id}`);
export const filterDevices = (params: object) => axiosInstance.get('/api/devices/filter', { params });
