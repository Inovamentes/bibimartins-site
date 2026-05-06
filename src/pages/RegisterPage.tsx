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
  
  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF')
  const [documentNumber, setDocumentNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const userData = {
        email, password, fullName, whatsapp, documentType, documentNumber, companyName, companyAddress, termsAccepted
      };
      await register(userData)
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
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden fixed h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-purple-800" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl">Bibi Martins</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Crie sua conta<br />gratuitamente ✨
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md mb-8">
            Para personalizar nossos serviços e propostas para você, preencha seus dados abaixo.
          </p>
          <div className="space-y-3">
            {['✅ Avaliação personalizada', '✅ Faturamento simplificado', '✅ Suporte prioritário'].map((item) => (
              <p key={item} className="text-white/90 font-medium">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel (Scrollable) */}
      <div className="w-full lg:w-7/12 flex items-start justify-center p-8 bg-gray-50 overflow-y-auto lg:ml-auto min-h-screen">
        <div className="w-full max-w-xl my-auto">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold">BM</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Bibi Martins</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="debug_mode" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">Nome Completo</Label>
                  <Input id="fullName" placeholder="Ex: Maria Silva" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-gray-700 font-medium">WhatsApp</Label>
                  <Input id="whatsapp" placeholder="(11) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="space-y-4 border border-gray-100 bg-gray-50/50 p-5 rounded-2xl">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="docType" checked={documentType === 'CPF'} onChange={() => setDocumentType('CPF')} className="text-orange-500 focus:ring-orange-500 w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Pessoa Física (CPF)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="docType" checked={documentType === 'CNPJ'} onChange={() => setDocumentType('CNPJ')} className="text-orange-500 focus:ring-orange-500 w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Empresa (CNPJ)</span>
                  </label>
                </div>

                {documentType === 'CPF' ? (
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-gray-700 font-medium">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} className="h-11 rounded-xl bg-white" />
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-gray-700 font-medium">CNPJ</Label>
                      <Input id="cnpj" placeholder="00.000.000/0000-00" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} className="h-11 rounded-xl bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-gray-700 font-medium">Razão Social / Nome Fantasia</Label>
                      <Input id="companyName" placeholder="Nome da sua empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="h-11 rounded-xl bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyAddress" className="text-gray-700 font-medium">Endereço da Empresa</Label>
                      <Input id="companyAddress" placeholder="Rua, Número, Cidade - Estado" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className="h-11 rounded-xl bg-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">E-mail de Acesso</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                  <div className="relative">
                    <Input id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 pr-10 rounded-xl" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {password && (
                <div className="space-y-1 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {rules.map((r) => (
                    <div key={r.label} className={`flex items-center gap-2 text-xs ${r.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${r.test(password) ? 'text-green-500' : 'text-gray-300'}`} />
                      {r.label}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={termsAccepted} 
                  onChange={(e) => setTermsAccepted(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  required 
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-snug cursor-pointer">
                  Li e concordo com os <a href="#" className="text-purple-600 hover:underline">Termos de Uso</a> e a <a href="#" className="text-purple-600 hover:underline">Política de Privacidade</a>, e autorizo o tratamento dos meus dados conforme a LGPD.
                </Label>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-base mt-2">
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Criando conta...</> : 'Criar conta e acessar'}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6 mb-8">
            <Link to="/" className="hover:text-purple-600 transition-colors">← Voltar ao site</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
