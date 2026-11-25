import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export const getGenres = () => api.get('/genres').then((r) => r.data);
export const createGenre = (data) => api.post('/genres', data).then((r) => r.data);

export const getTitles = (params = {}) => api.get('/titles', { params }).then((r) => r.data);
export const getTitle = (id) => api.get(`/titles/${id}`).then((r) => r.data);
export const createTitle = (data) => api.post('/titles', data).then((r) => r.data);
export const updateTitle = (id, data) => api.put(`/titles/${id}`, data).then((r) => r.data);
export const deleteTitle = (id) => api.delete(`/titles/${id}`);