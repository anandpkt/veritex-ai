import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardStats = async () => {
  const res = await api.get('/dashboard/stats');
  return res.data;
};

export const getPresets = async () => {
  const res = await api.get('/documents/presets');
  return res.data;
};

export const analyzePreset = async (caseId) => {
  const res = await api.post(`/screening/analyze-preset/${caseId}`);
  return res.data;
};

export const uploadAndScreen = async (file, docType = 'PASSPORT', livePhoto = null, claimedDetails = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', docType);
  if (claimedDetails.name) formData.append('name', claimedDetails.name);
  if (claimedDetails.dob) formData.append('dob', claimedDetails.dob);
  if (claimedDetails.document_number) formData.append('document_number', claimedDetails.document_number);
  if (claimedDetails.expiry_date) formData.append('expiry_date', claimedDetails.expiry_date);
  if (claimedDetails.nationality) formData.append('nationality', claimedDetails.nationality);
  if (livePhoto) {
    formData.append('live_photo', livePhoto);
  }
  const res = await api.post('/screening/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getScreening = async (screeningId) => {
  const res = await api.get(`/screening/${screeningId}`);
  return res.data;
};

export const getEvidence = async (screeningId) => {
  const res = await api.get(`/screening/${screeningId}/evidence`);
  return res.data;
};

export const getReport = async (screeningId) => {
  const res = await api.get(`/screening/${screeningId}/report`);
  return res.data;
};

export const getScreeningsList = async (limit = 50, riskFilter = null) => {
  const params = { limit };
  if (riskFilter && riskFilter !== 'ALL') {
    params.risk_filter = riskFilter;
  }
  const res = await api.get('/screening/list/all', { params });
  return res.data;
};

export const generateSynthetic = async (params) => {
  const res = await api.post('/documents/synthetic/generate', params);
  return res.data;
};

export const calculateSimulation = async (simulationParams) => {
  const res = await api.post('/simulation/calculate', simulationParams);
  return res.data;
};

export const getSystemStatus = async () => {
  const res = await api.get('/system/status');
  return res.data;
};

export const deleteScreening = async (screeningId) => {
  const res = await api.delete(`/screening/${screeningId}`);
  return res.data;
};

export const purgeAllScreenings = async () => {
  const res = await api.delete('/screening/purge/all');
  return res.data;
};

export default api;

