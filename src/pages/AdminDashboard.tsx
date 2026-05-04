import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain, Users, LogOut, Trash2, RefreshCw,
  LayoutDashboard, Shield, TrendingUp, Mail
} from 'lucide-react'

interface Stats { totalUsers: number; totalClients: number; totalAdmins: number }
interface User  { id: number; email: string; role: string; createdAt: string }

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats]   = useState<Stats | null>(null)
  const [users, setUsers]   = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch {
      // handled by interceptor
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex flex-col z-40 shadow-2xl">
        <div className="p-6 border-b border-purple-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Bibi Martins</p>
              <p className="text-xs text-purple-300">Painel Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 rounded-xl bg-white/10 flex items-center gap-3 text-sm font-medium">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </div>
          <div className="px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-sm text-purple-200 cursor-pointer">
            <Users className="w-4 h-4" /> Usuários
          </div>
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
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Visão geral da plataforma</p>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm" className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
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

        {/* Users Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Carregando...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhum usuário ainda</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">#{u.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            {u.email[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : 'bg-green-100 text-green-700 border-green-200'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4">
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

        <p className="mt-6 text-center text-sm text-gray-400">
          <Link to="/" className="hover:text-purple-600 transition-colors">← Ver site público</Link>
        </p>
      </main>
    </div>
  )
}
