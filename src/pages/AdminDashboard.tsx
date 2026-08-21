import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users, LogOut, Trash2, RefreshCw, Menu, Building2,
  LayoutDashboard, Shield, TrendingUp, Edit, X, Video, CreditCard, Key, Wrench,
  GraduationCap, ChevronDown, ChevronUp, Download, School, FileSpreadsheet,
  CheckCircle2, ArrowRight
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { AdminCourses } from '@/components/AdminCourses'
import { AdminPlans } from '@/components/AdminPlans'
import { AdminSubscriptions } from '@/components/AdminSubscriptions'
import { AdminTools } from '@/components/AdminTools'
import { AdminEducationControl } from '@/components/admin/AdminEducationControl'
import { AdminCompanyControl } from '@/components/admin/AdminCompanyControl'
import { companyService } from '@/services/companyService'

interface Stats { totalUsers: number; totalClients: number; totalAdmins: number }
interface User  { 
  id: number; email: string; recoveryEmail?: string; role: string; createdAt: string;
  fullName?: string; whatsapp?: string; documentType?: string; documentNumber?: string; companyName?: string; companyAddress?: string;
  password?: string;
  copsoqUnlocked?: boolean;
  hseUnlocked?: boolean;
  clinicalUnlocked?: boolean;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [isSaving, setIsSaving] = useState(false)
  
  // Tabs: 'dashboard' | 'education' | 'companies' | 'users' | 'courses' | 'plans' | 'subscriptions' | 'tools'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'education' | 'companies' | 'users' | 'courses' | 'plans' | 'subscriptions' | 'tools'>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Controle das listas retráteis no Dashboard
  const [isEducationExpanded, setIsEducationExpanded] = useState(true)
  const [isCompanyExpanded, setIsCompanyExpanded] = useState(true)

  // Contadores Institucionais
  const [totalSchools, setTotalSchools] = useState(0)
  const [totalCompanies, setTotalCompanies] = useState(0)

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

      // Carregar totais de empresas e escolas
      try {
        const [schoolsList, companiesList] = await Promise.all([
          companyService.listCompaniesByProduct('SINAPSE_360_EDUCACAO'),
          companyService.listCompaniesByProduct('SINAPSE_360_EMPRESAS'),
        ])
        setTotalSchools(schoolsList.length)
        setTotalCompanies(companiesList.length)
      } catch (e) {
        console.warn('Erro ao listar instituições:', e)
      }

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
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 text-white flex flex-col z-50 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" variant="white" />
            <div>
              <p className="font-bold text-sm">Bibi Martins</p>
              <p className="text-xs text-purple-300">Admin Geral</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button onClick={() => selectTab('dashboard')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-white/20 text-white shadow-sm' : 'hover:bg-white/10 text-purple-200'}`}>
            <LayoutDashboard className="w-4 h-4" /> Visão Geral
          </button>

          {/* Seção Sinapse 360 */}
          <div className="pt-3 pb-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-400">Pilares Sinapse 360°</p>
          </div>

          <button onClick={() => selectTab('education')} className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-sm font-medium transition-colors ${activeTab === 'education' ? 'bg-orange-500 text-white shadow-sm' : 'hover:bg-white/10 text-orange-300'}`}>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4" /> Sinapse Educação
            </div>
            {totalSchools > 0 && (
              <Badge className="bg-orange-600 text-white text-[10px] px-1.5 py-0">{totalSchools}</Badge>
            )}
          </button>

          <button onClick={() => selectTab('companies')} className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-sm font-medium transition-colors ${activeTab === 'companies' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-white/10 text-purple-200'}`}>
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4" /> Sinapse Empresas
            </div>
            {totalCompanies > 0 && (
              <Badge className="bg-purple-700 text-white text-[10px] px-1.5 py-0">{totalCompanies}</Badge>
            )}
          </button>

          {/* Gestão do Sistema */}
          <div className="pt-3 pb-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-400">Gestão Geral</p>
          </div>

          <button onClick={() => selectTab('users')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <Users className="w-4 h-4" /> Usuários
          </button>
          <button onClick={() => selectTab('courses')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'courses' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <Video className="w-4 h-4" /> Cursos e Aulas
          </button>
          <button onClick={() => selectTab('plans')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'plans' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <CreditCard className="w-4 h-4" /> Planos e Vendas
          </button>
          <button onClick={() => selectTab('subscriptions')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'subscriptions' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <Key className="w-4 h-4" /> Assinaturas
          </button>
          <button onClick={() => selectTab('tools')} className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'tools' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-purple-200'}`}>
            <Wrench className="w-4 h-4" /> Ferramentas
          </button>
        </nav>

        <div className="p-4 border-t border-purple-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.email}</p>
              <Badge className="text-[10px] bg-orange-500/20 text-orange-300 border-orange-500/30 mt-0.5">ADMIN TOTAL</Badge>
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Painel de Controle Bibi Martins'}
                {activeTab === 'education' && 'Controle Sinapse 360° Educação'}
                {activeTab === 'companies' && 'Controle Sinapse 360° Empresas'}
                {activeTab === 'users' && 'Gestão de Usuários'}
                {activeTab === 'courses' && 'Cursos e Módulos'}
                {activeTab === 'plans' && 'Planos e Vendas'}
                {activeTab === 'subscriptions' && 'Assinaturas'}
                {activeTab === 'tools' && 'Ferramentas do Método'}
              </h1>
              <p className="text-gray-500 text-xs md:text-sm">
                Gestão centralizada de todas as operações, ferramentas e equipes.
              </p>
            </div>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 shrink-0 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
        </div>

        {/* Error Banner */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-3">
            <span className="font-bold">⚠️ Erro:</span> {apiError}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA: DASHBOARD COM AS DUAS LISTAS RETRÁTEIS EM DESTAQUE */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Cards de Métricas Rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Total Usuários', value: stats?.totalUsers ?? '—', icon: Users, bg: 'from-purple-600 to-indigo-600' },
                { label: 'Clientes Ativos', value: stats?.totalClients ?? '—', icon: TrendingUp, bg: 'from-orange-500 to-amber-500' },
                { label: 'Escolas Cadastradas', value: totalSchools, icon: School, bg: 'from-amber-500 to-orange-600' },
                { label: 'Empresas Cadastradas', value: totalCompanies, icon: Building2, bg: 'from-indigo-600 to-purple-800' },
              ].map((card) => (
                <Card key={card.label} className="border-0 shadow-md rounded-3xl overflow-hidden bg-white">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.bg} flex items-center justify-center shadow-md text-white shrink-0`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
                      <p className="text-gray-500 text-xs font-medium">{card.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* =================================================================== */}
            {/* LISTA RETRÁTIL 1: SINAPSE 360° EDUCAÇÃO */}
            {/* =================================================================== */}
            <div className="border border-orange-200/80 bg-white rounded-3xl shadow-lg overflow-hidden transition-all">
              <button
                onClick={() => setIsEducationExpanded(!isEducationExpanded)}
                className="w-full p-6 sm:p-7 flex items-center justify-between bg-gradient-to-r from-orange-50/80 via-white to-amber-50/50 hover:bg-orange-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">🎓 Sinapse 360° Educação</h3>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                        {totalSchools} Escola(s)
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      Operações e ferramentas de controle para instituições de ensino, educadores e inclusão neurodivergente.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-orange-600 hidden sm:inline">
                    {isEducationExpanded ? 'Recolher Opções' : 'Expandir Opções'}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                    {isEducationExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </button>

              {isEducationExpanded && (
                <div className="p-6 sm:p-8 border-t border-orange-100 bg-orange-50/20 space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Item 1 */}
                    <div 
                      onClick={() => selectTab('education')}
                      className="p-5 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <School className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                        Gestão de Escolas & Docentes
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Visualize as instituições de ensino, controle o corpo docente e os acessos liberados.
                      </p>
                    </div>

                    {/* Item 2 */}
                    <div 
                      onClick={() => selectTab('education')}
                      className="p-5 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                        Upload de Planilhas Escolares
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Suba listas em lote de professores, psicopedagogos e coordenadores via CSV.
                      </p>
                    </div>

                    {/* Item 3 */}
                    <div 
                      onClick={() => selectTab('tools')}
                      className="p-5 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                        Inclusão & Clima Educacional
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Acesse as ferramentas diagnósticas de adaptação escolar e bem-estar do educador.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => companyService.downloadSampleCsv('SINAPSE_360_EDUCACAO')}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Baixar Planilha Modelo da Educação (.CSV)
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => selectTab('education')}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold px-4 flex items-center gap-1.5 shadow-sm"
                    >
                      Abrir Painel Completo da Educação
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================================== */}
            {/* LISTA RETRÁTIL 2: SINAPSE 360° EMPRESAS */}
            {/* =================================================================== */}
            <div className="border border-purple-200/80 bg-white rounded-3xl shadow-lg overflow-hidden transition-all">
              <button
                onClick={() => setIsCompanyExpanded(!isCompanyExpanded)}
                className="w-full p-6 sm:p-7 flex items-center justify-between bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/50 hover:bg-purple-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">🏢 Sinapse 360° Empresas</h3>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                        {totalCompanies} Empresa(s)
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      Opções e ferramentas corporativas para gestão de liderança, NR-1, atestados e diagnósticos B2B.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-purple-700 hidden sm:inline">
                    {isCompanyExpanded ? 'Recolher Opções' : 'Expandir Opções'}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                    {isCompanyExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </button>

              {isCompanyExpanded && (
                <div className="p-6 sm:p-8 border-t border-purple-100 bg-purple-50/20 space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Item 1 */}
                    <div 
                      onClick={() => selectTab('companies')}
                      className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-purple-700 transition-colors">
                        Gestão de Empresas & Colaboradores
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Acompanhe empresas clientes e gerencie as permissões e colaboradores de cada setor.
                      </p>
                    </div>

                    {/* Item 2 */}
                    <div 
                      onClick={() => selectTab('companies')}
                      className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-purple-700 transition-colors">
                        Upload de Planilhas B2B
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Suba planilhas corporativas com notificação em tempo real de importação de funcionários.
                      </p>
                    </div>

                    {/* Item 3 */}
                    <div 
                      onClick={() => selectTab('tools')}
                      className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-purple-700 transition-colors">
                        Diagnósticos NR-1 & Atestados
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Controle COPSOQ, HSE, risco psicossocial e atestados médicos de cada cliente.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => companyService.downloadSampleCsv('SINAPSE_360_EMPRESAS')}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Baixar Planilha Modelo Empresas (.CSV)
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => selectTab('companies')}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold px-4 flex items-center gap-1.5 shadow-sm"
                    >
                      Abrir Painel Completo de Empresas
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA: CONTROLE DA EDUCAÇÃO */}
        {activeTab === 'education' && <AdminEducationControl />}

        {/* ABA: CONTROLE DAS EMPRESAS */}
        {activeTab === 'companies' && <AdminCompanyControl />}

        {/* ABA: USUÁRIOS */}
        {activeTab === 'users' && (
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Usuários Cadastrados no Sistema</h2>
                  <p className="text-sm text-gray-500">{users.length} usuário(s) no total</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Usuário</th>
                      <th className="px-6 py-3">Contato</th>
                      <th className="px-6 py-3">Doc/Empresa</th>
                      <th className="px-6 py-3">Perfil</th>
                      <th className="px-6 py-3">Cadastro</th>
                      <th className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                    {loading ? (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Carregando...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Nenhum usuário ainda</td></tr>
                    ) : users.map((u) => (
                      <tr key={u.id} className="hover:bg-purple-50/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-400">#{u.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{u.fullName || 'Sem nome'}</p>
                          <p className="text-gray-500">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p>{u.whatsapp || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{u.companyName || '-'}</p>
                          <p className="text-gray-400 text-[11px]">{u.documentNumber ? `${u.documentType}: ${u.documentNumber}` : '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-700'}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(u)} className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50">
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            {u.email !== user?.email && (
                              <Button size="sm" variant="ghost" onClick={() => handleDelete(u.id)} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ABA: CURSOS */}
        {activeTab === 'courses' && <AdminCourses />}

        {/* ABA: PLANOS */}
        {activeTab === 'plans' && <AdminPlans />}

        {/* ABA: ASSINATURAS */}
        {activeTab === 'subscriptions' && <AdminSubscriptions />}

        {/* ABA: FERRAMENTAS */}
        {activeTab === 'tools' && <AdminTools />}

      </main>

      {/* Modal de Edição de Usuário */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Editar Usuário #{editingUser.id}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Nome</label>
                <Input value={editForm.fullName || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, fullName: e.target.value})} className="h-9 rounded-xl mt-1" />
              </div>
              <div>
                <label className="font-semibold text-gray-700">E-mail</label>
                <Input value={editForm.email || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, email: e.target.value})} className="h-9 rounded-xl mt-1" />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Perfil (ADMIN / CLIENT)</label>
                <Input value={editForm.role || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, role: e.target.value})} className="h-9 rounded-xl mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} className="rounded-xl">Cancelar</Button>
              <Button size="sm" onClick={handleSaveEdit} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
