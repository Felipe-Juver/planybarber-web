import { useState, useContext, FormEvent } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Scissors } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setErro('')
    
    try {
      await login({ email, senha })
      navigate('/dashboard')
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Falha ao fazer login. Verifique suas credenciais.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <div className="flex flex-col items-center mb-6">
          <Scissors className="w-12 h-12 text-emerald-400 mb-2" />
          <h1 className="text-2xl font-bold text-white">PlanyBarber</h1>
          <p className="text-slate-400 text-sm">Entre com sua conta de barbeiro</p>
        </div>

        {erro && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">{erro}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">E-mail</label>
            <input 
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-400"
              placeholder="barbearia@teste.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Senha</label>
            <input 
              type="password"
              required
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-400"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold p-3 rounded transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Ainda não tem conta?{' '}
          <Link to="/cadastrar" className="text-emerald-400 hover:underline">
            Criar conta grátis (30 dias)
          </Link>
        </p>
      </div>
    </div>
  )
}