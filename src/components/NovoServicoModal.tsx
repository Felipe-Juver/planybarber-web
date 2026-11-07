import { useState, FormEvent } from 'react'
import { api } from '../services/api'
import { X, Scissors } from 'lucide-react'

interface NovoServicoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// ATENÇÃO AQUI: precisa ter a palavra "export" antes de "function"
export function NovoServicoModal({ isOpen, onClose, onSuccess }: NovoServicoModalProps) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [duracaoMinutos, setDuracaoMinutos] = useState('30')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await api.post('/servicos', {
        nome,
        preco: Number(preco),
        duracaoMinutos: Number(duracaoMinutos),
      })

      setNome('')
      setPreco('')
      setDuracaoMinutos('30')
      onSuccess()
      onClose()
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao cadastrar serviço.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Scissors className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Novo Serviço</h2>
        </div>

        {erro && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Nome do Serviço</label>
            <input 
              type="text"
              required
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-400"
              placeholder="Ex: Corte + Barba"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">Preço (R$)</label>
              <input 
                type="number"
                step="0.01"
                required
                value={preco}
                onChange={e => setPreco(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-400"
                placeholder="45.00"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">Duração (minutos)</label>
              <select
                value={duracaoMinutos}
                onChange={e => setDuracaoMinutos(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min (1h)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={carregando}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold p-3 rounded transition-colors mt-2"
          >
            {carregando ? 'Guardando...' : 'Cadastrar Serviço'}
          </button>
        </form>
      </div>
    </div>
  )
}