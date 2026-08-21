import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, AlertCircle, Building2, GraduationCap } from 'lucide-react'
import { Logo } from '@/components/Logo'


function isValidCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let split = cpf.split('');
  let rest, count;
  for (let type = 9; type < 11; type++) {
    for (count = 0, rest = 0; rest < type; rest++) {
      count += parseInt(split[rest]) * ((type + 1) - rest);
    }
    count = ((count * 10) % 11) % 10;
    if (count !== parseInt(split[type])) return false;
  }
  return true;
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Plataforma selecionada: 'EMPRESAS' ou 'EDUCACAO'
  const initialPlatform = searchParams.get('tipo') === 'educacao' ? 'EDUCACAO' : 'EMPRESAS'
  const [platform, setPlatform] = useState<'EMPRESAS' | 'EDUCACAO'>(initialPlatform)

  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF')
  const [documentNumber, setDocumentNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyAddress] = useState('')
  const [email, setEmail] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (documentType === 'CPF' && !isValidCPF(documentNumber)) {
      setError('O CPF informado é inválido. Verifique os números digitados.')
      return
    }

    setLoading(true)
    try {
      const userData = {
        email, 
        recoveryEmail, 
        password, 
        fullName, 
        whatsapp, 
        documentType, 
        documentNumber, 
        companyName, 
        companyAddress, 
        termsAccepted,
        platformInterest: platform
      };
      await register(userData)
      navigate('/cliente', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden fixed h-screen">
        <div className={`absolute inset-0 transition-all duration-500 bg-gradient-to-br ${
          platform === 'EDUCACAO'
            ? 'from-orange-600 via-purple-900 to-amber-700'
            : 'from-purple-950 via-purple-850 to-orange-600'
        }`} />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white h-full">
          <div className="flex items-center gap-3 mb-10">
            <Logo size="lg" variant="white" />
            <span className="font-bold text-2xl">Bibi Martins</span>
          </div>

          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 py-1 text-xs w-fit mb-4">
            {platform === 'EDUCACAO' ? '🎓 Sinapse 360° Educação' : '🏢 Sinapse 360° Empresas'}
          </Badge>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">
            Crie sua conta institucional ✨
          </h1>
          <p className="text-white/85 text-base leading-relaxed max-w-md mb-8">
            {platform === 'EDUCACAO'
              ? 'Ambiente dedicado a escolas, coordenadores, educadores e inclusão neurodivergente.'
              : 'Ambiente dedicado a empresas, lideranças, diagnósticos NR-1 e clima organizacional.'}
          </p>
          
          <div className="space-y-3 text-sm">
            {[
              '✅ Avaliação e diagnósticos personalizados',
              '✅ Liberação de ferramentas para equipe/docentes',
              '✅ Suporte e metodologia Sinapse 360°'
            ].map((item) => (
              <p key={item} className="text-white/90 font-medium">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel (Scrollable) */}
      <div className="w-full lg:w-7/12 flex items-start justify-center p-4 md:p-8 bg-slate-50 overflow-y-auto lg:ml-auto min-h-screen">
        <div className="w-full max-w-xl my-auto">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <Logo size="md" />
            <span className="font-bold text-xl text-gray-900">Bibi Martins</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
            
            {/* Seletor de Plataforma */}
            <div className="mb-6">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Qual produto você deseja acessar?
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
                  Sinapse Empresas
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
                  Sinapse Educação
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Criar sua conta</h2>
              <p className="text-gray-500 text-xs mt-1">
                Já tem conta?{' '}
                <Link to={`/login?tipo=${platform.toLowerCase()}`} className="text-purple-600 font-semibold hover:underline">
                  Entrar
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" name="debug_mode" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold text-gray-700">Nome Completo *</Label>
                  <Input id="fullName" placeholder="Ex: Maria Silva" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp" className="text-xs font-semibold text-gray-700">WhatsApp *</Label>
                  <Input id="whatsapp" placeholder="(11) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="space-y-3 border border-gray-100 bg-gray-50/50 p-4 rounded-2xl">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="docType" checked={documentType === 'CPF'} onChange={() => setDocumentType('CPF')} className="text-purple-600 focus:ring-purple-500 w-4 h-4" />
                    <span className="text-xs font-medium text-gray-700">Pessoa Física (CPF)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="docType" checked={documentType === 'CNPJ'} onChange={() => setDocumentType('CNPJ')} className="text-purple-600 focus:ring-purple-500 w-4 h-4" />
                    <span className="text-xs font-medium text-gray-700">
                      {platform === 'EDUCACAO' ? 'Escola / CNPJ' : 'Empresa / CNPJ'}
                    </span>
                  </label>
                </div>

                {documentType === 'CPF' ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="cpf" className="text-xs font-semibold text-gray-700">CPF *</Label>
                    <Input id="cpf" placeholder="000.000.000-00" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required className="h-11 rounded-xl bg-white" />
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="space-y-1.5">
                      <Label htmlFor="cnpj" className="text-xs font-semibold text-gray-700">CNPJ *</Label>
                      <Input id="cnpj" placeholder="00.000.000/0000-00" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required className="h-11 rounded-xl bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="compName" className="text-xs font-semibold text-gray-700">
                        {platform === 'EDUCACAO' ? 'Nome da Escola / Instituição *' : 'Razão Social / Nome da Empresa *'}
                      </Label>
                      <Input id="compName" placeholder={platform === 'EDUCACAO' ? 'Ex: Colégio Futuro' : 'Ex: Inova Tech Ltda'} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="h-11 rounded-xl bg-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-700">E-mail Principal *</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="recoveryEmail" className="text-xs font-semibold text-gray-700">E-mail de Recuperação</Label>
                  <Input id="recoveryEmail" type="email" placeholder="backup@email.com" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Criar Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
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

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="mt-1 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <Label htmlFor="terms" className="text-xs text-gray-500 font-normal leading-relaxed cursor-pointer">
                  Li e concordo com os Termos de Uso e Política de Privacidade da Metodologia Sinapse 360°.
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-11 rounded-xl text-white font-semibold text-sm shadow-md transition-all ${
                  platform === 'EDUCACAO'
                    ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                }`}
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <Link to="/sinapse-360" className="text-xs text-purple-700 font-semibold hover:underline">
                Quer cadastrar sua instituição e subir planilha de colaboradores? Clique aqui →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
