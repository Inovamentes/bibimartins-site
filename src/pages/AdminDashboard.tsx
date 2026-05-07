import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users, LogOut, Trash2, RefreshCw, Menu,
  LayoutDashboard, Shield, TrendingUp, Edit, X, Video, CreditCard, Key
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { AdminCourses } from '@/components/AdminCourses'
import { AdminPlans } from '@/components/AdminPlans'
import { AdminSubscriptions } from '@/components/AdminSubscriptions'

interface Stats { totalUsers: number; totalClients: number; totalAdmins: number }
interface User  { 
  id: number; email: string; role: string; createdAt: string;
  fullName?: string; whatsapp?: string; documentType?: string; documentNumber?: string; companyName?: string; companyAddress?: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats]     = useState<Stats | null>(null)
  const [users, setUsers]     = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'courses' | 'plans' | 'subscriptions'>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (err: any) {
      console.error('Erro ao carregar dados admin:', err)
      setApiError(err?.response?.data?.error || err?.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      fetchData()
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Erro ao remover usuário')
    }
  }

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setEditForm({ ...u });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await api.put(`/api/admin/users/${editingUser.id}`, editForm);
      setEditingUser(null);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Erro ao atualizar usuário');
    } finally {
      setIsSaving(false);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);
  const selectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex flex-col z-50 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-purple-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" variant="white" />
            <div>
              <p className="font-bold text-sm">Bibi Martins</p>
              <p className="text-xs text-purple-300">Painel Admin</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => selectTab('dashboard')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => selectTab('users')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <Users className="w-4 h-4" /> Usuários
          </button>
          <button onClick={() => selectTab('courses')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'courses' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <Video className="w-4 h-4" /> Cursos e Módulos
          </button>
          <button onClick={() => selectTab('plans')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'plans' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <CreditCard className="w-4 h-4" /> Planos e Vendas
          </button>
          <button onClick={() => selectTab('subscriptions')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'subscriptions' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <Key className="w-4 h-4" /> Assinaturas
          </button>
        </nav>

        <div className="p-4 border-t border-purple-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.email}</p>
              <Badge className="text-[10px] bg-orange-500/20 text-orange-300 border-orange-500/30 mt-0.5">ADMIN</Badge>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost"
            className="w-full text-purple-300 hover:text-white hover:bg-white/10 justify-start gap-2 h-9">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'} p-4 md:p-8`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-xs md:text-sm">Visão geral da plataforma</p>
            </div>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 shrink-0">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
        </div>

        {/* Error Banner */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
            <span className="font-bold">⚠️ Erro:</span> {apiError}
          </div>
        )}


        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Usuários', value: stats?.totalUsers ?? '—', icon: Users, color: 'purple', bg: 'from-purple-500 to-purple-600' },
              { label: 'Clientes',       value: stats?.totalClients ?? '—', icon: TrendingUp, color: 'orange', bg: 'from-orange-400 to-orange-500' },
              { label: 'Admins',         value: stats?.totalAdmins ?? '—', icon: Shield, color: 'teal', bg: 'from-teal-500 to-teal-600' },
            ].map((card) => (
              <Card key={card.label} className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.bg} flex items-center justify-center shadow-lg`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-gray-500 text-sm">{card.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Usuários Cadastrados</h2>
              <p className="text-sm text-gray-500">{users.length} usuário(s) no total</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doc/Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Carregando...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Nenhum usuário ainda</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">#{u.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(u.fullName ? u.fullName[0] : u.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 block">{u.fullName || 'Sem nome'}</span>
                            <span className="text-xs text-gray-500">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 block">{u.whatsapp || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {u.documentType ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{u.documentType}: {u.documentNumber}</span>
                            {u.companyName && <span className="text-xs text-gray-500">{u.companyName}</span>}
                          </div>
                        ) : <span className="text-sm text-gray-500">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : 'bg-green-100 text-green-700 border-green-200'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <Button onClick={() => handleEdit(u)} variant="ghost" size="sm"
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 gap-1">
                          <Edit className="w-4 h-4" /> Editar
                        </Button>
                        {u.email !== user?.email && (
                          <Button onClick={() => handleDelete(u.id)} variant="ghost" size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1">
                            <Trash2 className="w-4 h-4" /> Remover
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        )}

        {activeTab === 'courses' && (
          <AdminCourses />
        )}

        {activeTab === 'plans' && (
          <AdminPlans />
        )}

        {activeTab === 'subscriptions' && (
          <AdminSubscriptions />
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          <Link to="/" className="hover:text-purple-600 transition-colors">← Ver site público</Link>
        </p>
      </main>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Editar Cliente: {editingUser.email}</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditingUser(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                  <input type="text" className="w-full p-2 border rounded-md" value={editForm.fullName || ''} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-700">WhatsApp</label>
                  <input type="text" className="w-full p-2 border rounded-md" value={editForm.whatsapp || ''} onChange={(e) => setEditForm({...editForm, whatsapp: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Tipo (CPF/CNPJ)</label>
                  <select className="w-full p-2 border rounded-md" value={editForm.documentType || ''} onChange={(e) => setEditForm({...editForm, documentType: e.target.value})}>
                    <option value="">Selecione...</option>
                    <option value="CPF">Pessoa Física (CPF)</option>
                    <option value="CNPJ">Empresa (CNPJ)</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Número do Documento</label>
                  <input type="text" className="w-full p-2 border rounded-md" value={editForm.documentNumber || ''} onChange={(e) => setEditForm({...editForm, documentNumber: e.target.value})} />
                </div>
                {editForm.documentType === 'CNPJ' && (
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Razão Social</label>
                    <input type="text" className="w-full p-2 border rounded-md" value={editForm.companyName || ''} onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} />
                  </div>
                )}
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Nível de Acesso</label>
                  <select className="w-full p-2 border rounded-md" value={editForm.role || 'CLIENT'} onChange={(e) => setEditForm({...editForm, role: e.target.value})}>
                    <option value="CLIENT">Cliente (Comum)</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
                <Button onClick={handleSaveEdit} disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
