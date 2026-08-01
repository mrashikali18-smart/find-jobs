import axios from 'axios';

// In dev, Vite proxies '/api' to the local backend (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend's URL
// (e.g. https://find-jobs-api.onrender.com/api) if frontend and backend
// are hosted separately. Leave it unset for a single-server deployment
// where Express serves the built frontend itself.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // send httpOnly JWT cookie
});

// Attach bearer token as a fallback for environments where cookies are blocked
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('findjobs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to construct full resume URL
export const getResumeUrl = (resumePath) => {
  if (!resumePath) return '';
  
  // If it's already a full URL, return it as is
  if (resumePath.startsWith('http://') || resumePath.startsWith('https://')) {
    return resumePath;
  }
  
  // If VITE_API_URL is set (production with separate backend)
  if (import.meta.env.VITE_API_URL) {
    // Remove '/api' from the end to get the backend origin
    const backendOrigin = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    return `${backendOrigin}${resumePath}`;
  }
  
  // In development with Vite proxy, relative path works fine
  return resumePath;
};

export default api;
