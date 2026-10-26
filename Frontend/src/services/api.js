
import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
api.interceptors.response.use((r)=>r,(error)=>{const message=error.response?.data?.message||'Could not reach LibHub. Check that the API server is running.';return Promise.reject(new Error(message));});
