import axios from 'axios';

// Create an Axios instance with a base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update with your backend URL
});

// Add an interceptor to include the Authorization token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Example API functions (optional, can be used in components)
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const fetchEvents = () => API.get('/events');
export const createEvent = (eventData) => API.post('/events', eventData);
export const fetchEventById = (eventId) => API.get(`/events/${eventId}`);
export const fetchTasks = (eventId) => API.get(`/events/${eventId}/tasks`);
export const createTask = (eventId, taskData) =>
  API.post(`/events/${eventId}/tasks`, taskData);

export default API;
