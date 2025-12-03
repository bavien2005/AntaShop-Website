import axios from 'axios';

const cloudApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  // DON'T set Content-Type here; let browser set the multipart boundary
  // headers: { 'Content-Type': 'multipart/form-data' }
});

export const uploadMultipleToCloud = async (files, uploaderId = 1) => {
  const fd = new FormData();
  files.forEach(f => fd.append('files', f));
  fd.append('uploaderId', uploaderId);
  // leave axios to set headers automatically
  const res = await cloudApi.post('/api/cloud/upload-multiple', fd);
  return res.data; // expect array of { id, url, ... }
};