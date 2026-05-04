import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, LogOut, LayoutDashboard, User, BookOpen, Sparkles, Calendar, Mail } from 'lucide-react'

interface Profile { id: number; email: string; role: string; createdAt: string }

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    api.get('/api/client/profile').then(res => setProfile(res.data)).catch(() => {})
  }, [])

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const resources = [
    { icon: BookOpen, title: 'Método Sinapse 360°',  desc: 'Guia completo do método exclusivo', tag: 'PDF', color: 'purple' },
    { icon: Brain,    title: 'Auto-Consciência',      desc: 'Workshop em vídeo - Pilar 01',      tag: 'Vídeo', color: 'orange' },
    { icon: Calendar, title: 'Próximas Palestras',    desc: 'Agenda de eventos abertos',         tag: 'Agenda', color: 'teal' },
    { icon: Sparkles, title: 'Liderança Neurodiversa',desc: 'E-book exclusivo para membros',     tag: 'E-book', color: 'purple' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="px-3 py-2 rounded-xl bg-white/15 flex items-center gap-3 text-sm font-medium">
            <LayoutDashboard className="w-4 h-4" /> Início
          </div>
          <div className="px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-sm text-orange-100 cursor-pointer">
            <User className="w-4 h-4" /> Meu Perfil
          </div>
          <div className="px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-3 text-sm text-orange-100 cursor-pointer">
            <BookOpen className="w-4 h-4" /> Conteúdo
          </div>
        </nav>

        <div className="p-4 border-t border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.email}</p>
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
      <main className="ml-64 p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Olá, {user?.email?.split('@')[0]}! 👋
            </h1>
          </div>
          <p className="text-gray-500">Bem-vindo à sua área exclusiva de desenvolvimento em liderança.</p>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-lg mb-8 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{user?.email}</h2>
              <p className="text-gray-500 text-sm">
                Membro desde {profile ? new Date(profile.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">✓ Ativo</Badge>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">Cliente</Badge>
            </div>
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
      </main>
    </div>
  )
}
