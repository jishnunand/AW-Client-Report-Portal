import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clients API
export const clientsAPI = {
  create: (data) => apiClient.post('/clients', data),
  list: (skip = 0, limit = 100) => apiClient.get('/clients', { params: { skip, limit } }),
  get: (id) => apiClient.get(`/clients/${id}`),
  update: (id, data) => apiClient.put(`/clients/${id}`, data),
  delete: (id) => apiClient.delete(`/clients/${id}`),
};

// Accounts API
export const accountsAPI = {
  create: (clientId, data) => apiClient.post(`/accounts/${clientId}`, data),
  list: (clientId) => apiClient.get(`/accounts/client/${clientId}`),
  get: (id) => apiClient.get(`/accounts/${id}`),
  delete: (id) => apiClient.delete(`/accounts/${id}`),
};

// Reports API
export const reportsAPI = {
  create: (clientId, data) => apiClient.post(`/reports/${clientId}`, data),
  list: (clientId) => apiClient.get(`/reports/client/${clientId}`),
  get: (id) => apiClient.get(`/reports/${id}`),
  delete: (id) => apiClient.delete(`/reports/${id}`),
  saveValue: (reportId, data) => apiClient.post(`/reports/${reportId}/values`, data),
  getValues: (reportId) => apiClient.get(`/reports/${reportId}/values`),
};

export default apiClient;
