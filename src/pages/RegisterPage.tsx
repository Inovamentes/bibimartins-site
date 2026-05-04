import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Brain, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

const rules = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Uma letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Um número',           test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password)
      navigate('/cliente', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-purple-800" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl">Bibi Martins</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Crie sua conta<br />gratuitamente ✨
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Acesse conteúdo exclusivo, acompanhe palestras e desenvolva sua liderança neurodiversa.
          </p>
          <div className="mt-12 space-y-3">
            {['✅ Conteúdo exclusivo', '✅ Acesso a materiais', '✅ Comunidade de líderes'].map((item) => (
              <p key={item} className="text-white/90 font-medium">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold">BM</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Bibi Martins</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Criar sua conta</h2>
            <p className="text-gray-500 text-sm mb-8">
              Já tem conta?{' '}
              <Link to="/login" className="text-purple-600 font-medium hover:underline">
                Entrar
              </Link>
            </p>

            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" name="debug_mode" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
                <Input
                  id="email" type="email" placeholder="seu@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                <div className="relative">
                  <Input
                    id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="h-12 pr-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Rules */}
                {password && (
                  <div className="space-y-1 mt-2">
                    {rules.map((r) => (
                      <div key={r.label} className={`flex items-center gap-2 text-xs ${r.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${r.test(password) ? 'text-green-500' : 'text-gray-300'}`} />
                        {r.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit" disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-base"
              >
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Criando conta...</> : 'Criar conta grátis'}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/" className="hover:text-purple-600 transition-colors">← Voltar ao site</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
