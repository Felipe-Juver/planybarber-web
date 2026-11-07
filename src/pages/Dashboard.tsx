import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { api } from '../services/api'
import { LogOut, Calendar, Scissors, Plus, Clock } from 'lucide-react'
import { NovoServicoModal } from '../components/NovoServicoModal'

interface Servico {
  id: string
  nome: string
  preco: number
  duracaoMinutos: number
}

export function Dashboard() {
  const { usuario, logout } = useContext(AuthContext)
  const [servicos, setServicos] = useState<Servico[]>([])
  const [isModalServicoOpen, setIsModalServicoOpen] = useState(false)
  const [carregando, setCarregando] = useState(true)

  async function carregarDados() {
    try {
      const response = await api.get('/servicos')
      setServicos(response.data)
    } catch (err) {
      console.error('Erro ao carregar serviços', err)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="w-7 h-7 text-emerald-400" />
          <span className="font-bold text-xl tracking-wide">PlanyBarber</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">
            Olá, <strong className="text-emerald-400">{usuario?.nome}</strong>
          </span>
          <button 
            onClick={logout}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm px-3 py-1.5 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Painel Geral</h1>
            <p className="text-slate-400 text-sm">Gerencie a sua agenda e tabela de preços.</p>
          </div>

          <button 
            onClick={() => setIsModalServicoOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2.5 rounded transition-colors"
          >
            <Plus className="w-5 h-5" /> Novo Serviço
          </button>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Agendamentos</span>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <Scissors className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Serviços Cadastrados</span>
              <p className="text-2xl font-bold">{servicos.length}</p>
            </div>
          </div>
        </div>

        {/* Tabela / Grid de Serviços */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-emerald-400" /> Seus Serviços
          </h2>

          {carregando ? (
            <p className="text-slate-400 text-sm">A carregar serviços...</p>
          ) : servicos.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-700 rounded-lg">
              <p className="text-slate-400 mb-2">Nenhum serviço cadastrado ainda.</p>
              <button 
                onClick={() => setIsModalServicoOpen(true)}
                className="text-emerald-400 hover:underline text-sm font-medium"
              >
                Clique aqui para cadastrar o primeiro serviço
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {servicos.map(servico => (
                <div key={servico.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-white mb-1">{servico.nome}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-emerald-400" /> {servico.duracaoMinutos} min
                    </span>
                    <span className="font-bold text-emerald-400 text-base">
                      R$ {Number(servico.preco).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <NovoServicoModal 
        isOpen={isModalServicoOpen}
        onClose={() => setIsModalServicoOpen(false)}
        onSuccess={carregarDados}
      />
    </div>
  )
}