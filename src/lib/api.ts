import axios from 'axios'

// Em produção: defina VITE_API_URL no painel do Netlify (ex: https://bibimartins-backend.onrender.com)
// Em desenvolvimento: usa localhost:8080 automaticamente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Inject JWT token automatically on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bm_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('bm_token')
      localStorage.removeItem('bm_role')
      localStorage.removeItem('bm_email')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
