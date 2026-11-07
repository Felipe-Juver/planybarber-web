import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

// Injeta automaticamente o Token JWT em requisições autenticadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@PlanyBarber:token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})