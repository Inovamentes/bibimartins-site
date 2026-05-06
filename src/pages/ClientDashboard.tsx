import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Brain, LogOut, LayoutDashboard, User, Mail, Loader2, Save, CheckCircle2, Lock, Unlock, PlayCircle } from 'lucide-react'

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
  const [catalog, setCatalog] = useState<any[]>([])
  const [loadingCatalog, setLoadingCatalog] = useState(true)

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Profile>>({})

  useEffect(() => {
    api.get('/api/client/profile').then(res => {
      setProfile(res.data)
      setEditForm(res.data)
    }).catch(() => {})

    api.get('/api/client/courses/catalog').then(res => {
      setCatalog(res.data)
      setLoadingCatalog(false)
    }).catch(() => {
      setLoadingCatalog(false)
    })
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



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:fixed md:top-0 md:left-0 md:h-full md:w-64 bg-gradient-to-b from-orange-600 to-orange-700 text-white flex flex-col md:z-40 shadow-xl shrink-0">
        <div className="p-4 md:p-6 border-b border-orange-500 flex justify-between items-center md:block">
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

        <nav className="flex md:flex-col md:flex-1 p-2 md:p-4 gap-2 overflow-x-auto whitespace-nowrap">
          <button 
            onClick={() => setActiveTab('inicio')}
            className={`flex-1 md:w-full px-3 py-2 rounded-xl flex items-center justify-center md:justify-start gap-2 text-sm font-medium transition-colors ${activeTab === 'inicio' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-orange-100'}`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" /> Início
          </button>
          <button 
            onClick={() => setActiveTab('perfil')}
            className={`flex-1 md:w-full px-3 py-2 rounded-xl flex items-center justify-center md:justify-start gap-2 text-sm font-medium transition-colors ${activeTab === 'perfil' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-orange-100'}`}
          >
            <User className="w-4 h-4 shrink-0" /> Meu Perfil
          </button>
        </nav>

        <div className="hidden md:block p-4 border-t border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {((profile?.fullName ? profile?.fullName?.charAt(0) : user?.email?.charAt(0)) || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{profile?.fullName || user?.email}</p>
              <Badge className="text-[10px] bg-white/20 text-white border-white/20 mt-0.5">CLIENTE</Badge>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {/* Mobile Header elements (Logout button on top for mobile) */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Meus Cursos e Módulos</h2>
            {loadingCatalog ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : catalog.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-xl border border-gray-100 mb-8">
                <p className="text-gray-500">Nenhum curso disponível no momento.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {catalog.map((c) => (
                  <Card key={c.id} className={`border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 ${c.isUnlocked ? 'ring-2 ring-orange-500/50' : 'opacity-90'}`}>
                    {c.thumbnailUrl && (
                      <div className="h-32 w-full bg-cover bg-center rounded-t-xl" style={{ backgroundImage: `url(${c.thumbnailUrl})` }} />
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.isUnlocked ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                          {c.isUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                        </div>
                        {c.isUnlocked ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer">Acessar</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600">Bloqueado</Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{c.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{c.description || 'Sem descrição'}</p>
                      
                      <div className="flex gap-2">
                        {c.isUnlocked ? (
                            <Button 
                              onClick={() => navigate(`/curso/${c.id}`)}
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                            >
                              Assistir Aulas
                            </Button>
                        ) : (
                           <>
                             {c.previewVideoUrl && (
                               <Button variant="outline" onClick={() => window.open(c.previewVideoUrl, '_blank')} className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50">
                                 <PlayCircle className="w-4 h-4 mr-2" /> Prévia
                               </Button>
                             )}
                             <Button onClick={() => alert('Em breve: Integração de Pagamento Checkout Hotmart/Stripe para comprar de forma avulsa')} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
                               Comprar
                             </Button>
                           </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

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
