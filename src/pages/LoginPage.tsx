import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, AlertCircle, Building2, GraduationCap, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Plataforma selecionada: 'EMPRESAS' ou 'EDUCACAO'
  const initialPlatform = searchParams.get('tipo') === 'educacao' ? 'EDUCACAO' : 'EMPRESAS'
  const [platform, setPlatform] = useState<'EMPRESAS' | 'EDUCACAO'>(initialPlatform)

  useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/cliente', { replace: true })
    }
  }, [user, navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      const role = localStorage.getItem('bm_role')
      navigate(role === 'ADMIN' ? '/admin' : '/cliente', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Painel Esquerdo Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-500 bg-gradient-to-br ${
          platform === 'EDUCACAO'
            ? 'from-orange-700 via-purple-900 to-amber-800'
            : 'from-purple-950 via-purple-900 to-orange-700'
        }`} />
        <div 
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-10">
            <Logo size="lg" variant="white" />
            <span className="font-bold text-2xl">Bibi Martins</span>
          </div>

          <div className="space-y-4 max-w-lg">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 py-1 text-xs">
              {platform === 'EDUCACAO' ? '🎓 Sinapse 360° Educação' : '🏢 Sinapse 360° Empresas'}
            </Badge>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              {platform === 'EDUCACAO' 
                ? 'Plataforma para Escolas & Educadores 📚' 
                : 'Plataforma para Lideranças & Empresas 🚀'}
            </h1>

            <p className="text-white/85 text-base leading-relaxed">
              {platform === 'EDUCACAO'
                ? 'Acesse ferramentas de apoio psicopedagógico, clima escolar, saúde do corpo docente e metodologias de inclusão neurodivergente.'
                : 'Acesse ferramentas de diagnóstico psicossocial NR-1, clima organizacional, gestão de equipes e liderança adaptativa.'}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {[
              platform === 'EDUCACAO' ? 'Inclusão Escolar' : 'Liderança Adaptativa',
              platform === 'EDUCACAO' ? 'Saúde do Docente' : 'Diagnóstico NR-1',
              'Método Sinapse 360°',
              'Segurança & Privacidade'
            ].map((tag) => (
              <span key={tag} className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs font-medium border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Painel Direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <Logo size="md" />
            <span className="font-bold text-xl text-gray-900">Bibi Martins</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
            
            {/* Seletor da Plataforma */}
            <div className="mb-6">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Selecione a plataforma de acesso:
              </Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPlatform('EMPRESAS')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    platform === 'EMPRESAS'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Empresas
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform('EDUCACAO')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    platform === 'EDUCACAO'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Educação
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Acessar {platform === 'EDUCACAO' ? 'Sinapse Educação' : 'Sinapse Empresas'}
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Ainda não tem conta institucional?{' '}
                <Link to="/sinapse-360" className="text-purple-600 font-semibold hover:underline">
                  Cadastrar agora
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Não foi possível entrar</p>
                  <p className="text-xs mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                name="debug_field" 
                value={honeypot} 
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }} 
                tabIndex={-1} 
                autoComplete="off" 
              />

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                  E-mail institucional ou usuário
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={platform === 'EDUCACAO' ? 'educador@escola.com.br' : 'gestor@empresa.com.br'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                    Senha
                  </Label>
                  <a 
                    href="https://wa.me/5511932143117?text=Olá, preciso de ajuda com minha senha de acesso." 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[11px] text-purple-600 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-11 rounded-xl text-white font-semibold text-sm shadow-md transition-all mt-2 ${
                  platform === 'EDUCACAO'
                    ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                }`}
              >
                {loading ? 'Validando acesso...' : 'Entrar na Plataforma'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
              <p className="text-xs text-gray-500">
                Quer liberar acesso para sua equipe ou escola?
              </p>
              <Link to="/sinapse-360">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold text-xs h-10 flex items-center justify-center gap-1.5"
                >
                  Cadastrar Empresa ou Escola & Subir Planilha
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
