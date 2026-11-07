import { createContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

interface Usuario {
  id: string
  nome: string
  email: string
  fimDoTrial: string
}

interface AuthContextType {
  usuario: Usuario | null
  token: string | null
  login: (dados: { email: string; senha: string }) => Promise<void>
  cadastrar: (dados: { nome: string; email: string; senha: string }) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('@PlanyBarber:token'))

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@PlanyBarber:usuario')
    if (usuarioSalvo && token) {
      setUsuario(JSON.parse(usuarioSalvo))
    }
  }, [token])

  async function login({ email, senha }: { email: string; senha: string }) {
    const response = await api.post('/auth/login', { email, senha })
    const { token, usuario } = response.data

    localStorage.setItem('@PlanyBarber:token', token)
    localStorage.setItem('@PlanyBarber:usuario', JSON.stringify(usuario))

    setToken(token)
    setUsuario(usuario)
  }

  async function cadastrar({ nome, email, senha }: { nome: string; email: string; senha: string }) {
    const response = await api.post('/auth/cadastrar', { nome, email, senha })
    const { token, usuario } = response.data

    localStorage.setItem('@PlanyBarber:token', token)
    localStorage.setItem('@PlanyBarber:usuario', JSON.stringify(usuario))

    setToken(token)
    setUsuario(usuario)
  }

  function logout() {
    localStorage.removeItem('@PlanyBarber:token')
    localStorage.removeItem('@PlanyBarber:usuario')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  )
}