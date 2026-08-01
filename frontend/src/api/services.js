import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const userApi = {
  updateProfile: (data) => api.put('/users/profile', data),
  uploadResume: (formData) =>
    api.post('/users/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  dashboard: () => api.get('/users/dashboard'),
  importLinkedIn: (data) => api.post('/users/import-linkedin', data),
  suggestions: () => api.get('/users/suggestions'),
};

export const companyApi = {
  mine: () => api.get('/companies/mine'),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  bySlug: (slug) => api.get(`/companies/${slug}`),
};

export const jobApi = {
  list: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  remove: (id) => api.delete(`/jobs/${id}`),
  mine: () => api.get('/jobs/recruiter/mine'),
  categories: () => api.get('/jobs/meta/categories'),
};

export const applicationApi = {
  apply: (jobId, data) => api.post(`/applications/${jobId}`, data),
  mine: () => api.get('/applications/mine'),
  withdraw: (id) => api.delete(`/applications/${id}`),
  forJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

export const publicProfileApi = {
  get: (id) => api.get(`/users/${id}`),
};

export const postApi = {
  feed: (params) => api.get('/posts/feed', { params }),
  byUser: (userId) => api.get(`/posts/user/${userId}`),
  uploadImage: (formData) =>
    api.post('/posts/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  create: (data) => api.post('/posts', data),
  remove: (id) => api.delete(`/posts/${id}`),
  toggleLike: (id) => api.put(`/posts/${id}/like`),
  addComment: (id, data) => api.post(`/posts/${id}/comments`, data),
};

export const connectionApi = {
  mine: () => api.get('/connections/mine'),
  pending: () => api.get('/connections/pending'),
  status: (userId) => api.get(`/connections/status/${userId}`),
  send: (userId) => api.post(`/connections/${userId}`),
  respond: (id, data) => api.put(`/connections/${id}/respond`, data),
  remove: (userId) => api.delete(`/connections/${userId}`),
};

export const notificationApi = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const messageApi = {
  conversations: () => api.get('/messages/conversations'),
  start: (userId) => api.post(`/messages/conversations/${userId}`),
  messages: (conversationId) => api.get(`/messages/conversations/${conversationId}/messages`),
  send: (conversationId, data) => api.post(`/messages/conversations/${conversationId}/messages`, data),
};

export const searchApi = {
  global: (q, type = 'all') => api.get('/search', { params: { q, type } }),
};
