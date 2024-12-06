import axios from 'axios'
// import { useAuthentication } from '../composables/useAuthentication';

const API = axios.create({
  baseURL: 'https://webrtc-videocall-p7ji.onrender.com/api',
  headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
  timeout: 10000,
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (
    //   (error.response.status === 401 || error.response.status === 402) &&
    //   useAuthentication().isAuthenticated.value
    // ) {
    //   useAuthentication().isAuthenticated.value = false;
    //   window.location.href = '/login';
    // }
    console.log(import.meta.env.VITE_API_URL)
    console.log(error.message, error.response)
  },
)
export default API
