import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Brain, LogOut, LayoutDashboard, User, BookOpen, Sparkles, Calendar, Mail, Loader2, Save, CheckCircle2 } from 'lucide-react'

interface Profile { 
  id: number; email: string; role: string; createdAt: string;
  fullName?: string; whatsapp?: string; documentType?: string; documentNumber?: string; companyName?: string; companyAddress?: string;
}

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeTab, setActiveTab] = useState<'inicio' | 'perfil'>('inicio')
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Profile>>({})

  useEffect(() => {
    api.get('/api/client/profile').then(res => {
      setProfile(res.data)
      setEditForm(res.data)
    }).catch(() => {})
  }, [])

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaveSuccess(false)
    try {
      await api.put('/api/client/profile', editForm)
      setProfile({ ...profile, ...editForm } as Profile)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resources = [
    { icon: BookOpen, title: 'Método Sinapse 360°',  desc: 'Guia completo do método exclusivo', tag: 'PDF', color: 'purple' },
    { icon: Brain,    title: 'Auto-Consciência',      desc: 'Workshop em vídeo - Pilar 01',      tag: 'Vídeo', color: 'orange' },
    { icon: Calendar, title: 'Próximas Palestras',    desc: 'Agenda de eventos abertos',         tag: 'Agenda', color: 'teal' },
    { icon: Sparkles, title: 'Liderança Neurodiversa',desc: 'E-book exclusivo para membros',     tag: 'E-book', color: 'purple' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-orange-600 to-orange-700 text-white flex flex-col z-40 shadow-2xl">
        <div className="p-6 border-b border-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Bibi Martins</p>
              <p className="text-xs text-orange-200">Área do Cliente</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('inicio')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'inicio' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-orange-100'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Início
          </button>
          <button 
            onClick={() => setActiveTab('perfil')}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeTab === 'perfil' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-orange-100'}`}
          >
            <User className="w-4 h-4" /> Meu Perfil
          </button>
        </nav>

        <div className="p-4 border-t border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {((profile?.fullName ? profile?.fullName?.charAt(0) : user?.email?.charAt(0)) || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{profile?.fullName || user?.email}</p>
              <Badge className="text-[10px] bg-white/20 text-white border-white/20 mt-0.5">CLIENTE</Badge>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost"
            className="w-full text-orange-200 hover:text-white hover:bg-white/10 justify-start gap-2 h-9">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 flex-1">
        {activeTab === 'inicio' ? (
          <>
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Olá, {profile?.fullName ? profile?.fullName?.split(' ')?.[0] : (user?.email ? user?.email?.split('@')?.[0] : 'Cliente')}! 👋
                </h1>
              </div>
              <p className="text-gray-500">Bem-vindo à sua área exclusiva de desenvolvimento em liderança.</p>
            </div>

            {/* Profile Card Summary */}
            <Card className="border-0 shadow-lg mb-8 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {((profile?.fullName ? profile?.fullName?.charAt(0) : user?.email?.charAt(0)) || 'U').toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{profile?.fullName || 'Nome não informado'}</h2>
                    <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200">✓ Ativo</Badge>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        {profile?.documentType === 'CNPJ' ? 'Empresa' : 'Pessoa Física'}
                      </Badge>
                      {profile?.companyName && (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">{profile.companyName}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button onClick={() => setActiveTab('perfil')} variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 shrink-0">
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Exclusive Content Grid */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Conteúdo Exclusivo</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {resources.map((r) => (
                <Card key={r.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      r.color === 'purple' ? 'bg-purple-100' : r.color === 'orange' ? 'bg-orange-100' : 'bg-teal-100'
                    }`}>
                      <r.icon className={`w-6 h-6 ${
                        r.color === 'purple' ? 'text-purple-600' : r.color === 'orange' ? 'text-orange-600' : 'text-teal-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{r.title}</h3>
                        <Badge className="text-[10px] bg-gray-100 text-gray-600">{r.tag}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{r.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Banner */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-6 text-white flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6" />
                  <div>
                    <p className="font-bold">Precisa de ajuda?</p>
                    <p className="text-white/80 text-sm">Entre em contato com a Bibi diretamente</p>
                  </div>
                </div>
                <Button onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                  className="bg-white text-purple-700 hover:bg-white/90 font-semibold">
                  Falar com a Bibi
                </Button>
              </div>
            </Card>

            <p className="mt-6 text-center text-sm text-gray-400">
              <Link to="/" className="hover:text-orange-600 transition-colors">← Ver site público</Link>
            </p>
          </>
        ) : (
          <div className="max-w-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-500">Atualize suas informações pessoais e dados da empresa.</p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <CardTitle className="text-lg">Informações Cadastrais</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {saveSuccess && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5" /> Perfil atualizado com sucesso!
                  </div>
                )}
                
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input value={editForm.fullName || ''} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp</Label>
                      <Input value={editForm.whatsapp || ''} onChange={e => setEditForm({...editForm, whatsapp: e.target.value})} className="h-11 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>E-mail (Login)</Label>
                    <Input value={profile?.email || ''} disabled className="h-11 rounded-xl bg-gray-50 text-gray-500" />
                    <p className="text-xs text-gray-400">O e-mail de acesso não pode ser alterado por aqui.</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={editForm.documentType === 'CPF'} onChange={() => setEditForm({...editForm, documentType: 'CPF'})} className="text-orange-500 focus:ring-orange-500" />
                        <span className="text-sm font-medium">Pessoa Física (CPF)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={editForm.documentType === 'CNPJ'} onChange={() => setEditForm({...editForm, documentType: 'CNPJ'})} className="text-orange-500 focus:ring-orange-500" />
                        <span className="text-sm font-medium">Empresa (CNPJ)</span>
                      </label>
                    </div>

                    {editForm.documentType === 'CPF' ? (
                      <div className="space-y-2">
                        <Label>CPF</Label>
                        <Input value={editForm.documentNumber || ''} onChange={e => setEditForm({...editForm, documentNumber: e.target.value})} className="h-11 rounded-xl" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>CNPJ</Label>
                            <Input value={editForm.documentNumber || ''} onChange={e => setEditForm({...editForm, documentNumber: e.target.value})} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <Label>Razão Social / Nome Fantasia</Label>
                            <Input value={editForm.companyName || ''} onChange={e => setEditForm({...editForm, companyName: e.target.value})} className="h-11 rounded-xl" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Endereço da Empresa</Label>
                          <Input value={editForm.companyAddress || ''} onChange={e => setEditForm({...editForm, companyAddress: e.target.value})} className="h-11 rounded-xl" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-8">
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
