import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, GraduationCap, Upload, Download, CheckCircle2, 
  AlertCircle, ArrowRight, ArrowLeft, Users, 
  FileSpreadsheet, RefreshCw, Check, Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { companyService } from '@/services/companyService'
import type { 
  ProductInterest, 
  CompanyResponse, 
  EmployeeUploadResponse, 
  Employee 
} from '@/services/companyService'

export default function Sinapse360PortalPage() {
  // Step State: 1 = Seleção de Produto, 2 = Cadastro Empresa, 3 = Upload Planilha, 4 = Concluído / Gestão
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  
  // Product Selection
  const [selectedProduct, setSelectedProduct] = useState<ProductInterest | null>(null)

  // Company Form
  const [companyName, setCompanyName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false)
  const [companyError, setCompanyError] = useState('')
  const [createdCompany, setCreatedCompany] = useState<CompanyResponse | null>(null)

  // CSV Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<EmployeeUploadResponse | null>(null)
  const [employeesList, setEmployeesList] = useState<Employee[]>([])

  // Step 1 -> Step 2
  const handleSelectProduct = (product: ProductInterest) => {
    setSelectedProduct(product)
    setCompanyError('')
    setStep(2)
  }

  // Step 2 -> Submit Company
  const handleRegisterCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setCompanyError('')
    setIsSubmittingCompany(true)

    try {
      const response = await companyService.registerCompany({
        name: companyName,
        contactEmail,
        phone,
        cnpj,
        productInterest: selectedProduct,
      })
      setCreatedCompany(response)
      setStep(3)
    } catch (err: any) {
      setCompanyError(
        err?.response?.data?.message || 
        err?.response?.data?.error || 
        'Erro ao cadastrar instituição. Verifique os dados e tente novamente.'
      )
    } finally {
      setIsSubmittingCompany(false)
    }
  }

  // Step 3 -> Handle CSV Selection & Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadResult(null)
    }
  }

  const handleUploadCsv = async () => {
    if (!selectedFile || !createdCompany) return
    setIsUploading(true)
    setUploadResult(null)

    try {
      const result = await companyService.uploadEmployeesCsv(createdCompany.id, selectedFile)
      setUploadResult(result)

      if (result.totalImported > 0) {
        // Carrega a lista atualizada de colaboradores
        const list = await companyService.listEmployees(createdCompany.id)
        setEmployeesList(list)
      }
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: err?.response?.data?.message || 'Falha ao enviar arquivo.',
        totalProcessed: 0,
        totalImported: 0,
        totalErrors: 1,
        errorDetails: [err?.message || 'Erro de conexão com o servidor.'],
        successDetails: []
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50/30 text-gray-900">
      {/* Header Topo */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">BM</span>
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 tracking-tight flex items-center gap-2">
                Bibi Martins
                <Badge variant="outline" className="text-[10px] font-semibold text-purple-700 bg-purple-50 border-purple-200">
                  Sinapse 360°
                </Badge>
              </span>
              <p className="text-xs text-gray-500">Portal Corporativo & Educacional</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                Já tem acesso? Entrar
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden sm:flex border-gray-200">
                Voltar ao Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Stepper / Indicador de Progresso */}
      <div className="bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 w-full z-0" />
            
            {[
              { num: 1, title: 'Produto' },
              { num: 2, title: 'Instituição' },
              { num: 3, title: 'Colaboradores' },
              { num: 4, title: 'Pronto' },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center bg-white px-2">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step > s.num
                      ? 'bg-emerald-600 text-white'
                      : step === s.num
                      ? 'bg-purple-600 text-white ring-4 ring-purple-100 shadow-md'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${step >= s.num ? 'text-purple-900 font-semibold' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl">

        {/* ========================================================================= */}
        {/* PASSO 1: SELEÇÃO DE PRODUTO (Sinapse 360 Empresas vs Educação) */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-3 py-1 text-xs">
                Metodologia Sinapse 360°
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Selecione o seu objetivo institucional
              </h1>
              <p className="text-gray-600 text-base">
                Desenvolvemos trilhas e ferramentas customizadas para atender as necessidades específicas do ambiente corporativo e da comunidade escolar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
              {/* Opção: Sinapse 360 Empresas */}
              <Card 
                onClick={() => handleSelectProduct('SINAPSE_360_EMPRESAS')}
                className="group relative cursor-pointer border-2 hover:border-purple-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-3xl overflow-hidden bg-white"
              >
                <div className="h-3 bg-gradient-to-r from-purple-600 to-indigo-600" />
                <CardHeader className="p-8 pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-5 group-hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                      Sinapse 360° Empresas
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-500 text-sm mt-2">
                    Focado em Liderança Adaptativa, Clima Organizacional, Diagnósticos NR-1 e Saúde Mental Corporativa.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0 space-y-6">
                  <ul className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-5">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Diagnóstico psicossocial em conformidade com a <strong>NR-1</strong></span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Mapeamento de clima e prevenção de Burnout</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Liberação de ferramentas por setor e departamento</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Upload em massa de colaboradores via planilha</span>
                    </li>
                  </ul>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 text-base font-semibold group-hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    Continuar como Empresa
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Opção: Sinapse 360 Educação */}
              <Card 
                onClick={() => handleSelectProduct('SINAPSE_360_EDUCACAO')}
                className="group relative cursor-pointer border-2 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-3xl overflow-hidden bg-white"
              >
                <div className="h-3 bg-gradient-to-r from-orange-500 to-amber-500" />
                <CardHeader className="p-8 pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-5 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      Sinapse 360° Educação
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-500 text-sm mt-2">
                    Focado em Gestão Escolar Humanizada, Inclusão Neurodivergente e Saúde do Corpo Docente.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0 space-y-6">
                  <ul className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-5">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>Estratégias para acolhimento de alunos neurodivergentes</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>Capacitação e bem-estar para professores e educadores</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>Acompanhamento pedagógico e clima escolar</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>Upload de equipe escolar e professores via planilha</span>
                    </li>
                  </ul>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 text-base font-semibold group-hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    Continuar como Educação
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASSO 2: CADASTRO DA INSTITUIÇÃO / EMPRESA */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para escolha de produto
            </button>

            <Card className="rounded-3xl shadow-xl border-gray-100 bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={selectedProduct === 'SINAPSE_360_EDUCACAO' ? 'bg-orange-500 text-white' : 'bg-purple-600 text-white'}>
                    {selectedProduct === 'SINAPSE_360_EDUCACAO' ? 'Sinapse 360° Educação' : 'Sinapse 360° Empresas'}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {selectedProduct === 'SINAPSE_360_EDUCACAO' ? 'Cadastro da Instituição de Ensino' : 'Cadastro da Empresa'}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Informe os dados institucionais para criarmos o ambiente da sua organização.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-4">
                {companyError && (
                  <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Erro no cadastro</p>
                      <p>{companyError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRegisterCompany} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="font-medium text-gray-700">
                      {selectedProduct === 'SINAPSE_360_EDUCACAO' ? 'Nome da Escola / Instituição *' : 'Razão Social ou Nome da Empresa *'}
                    </Label>
                    <Input 
                      id="companyName" 
                      placeholder={selectedProduct === 'SINAPSE_360_EDUCACAO' ? 'Ex: Colégio Futuro' : 'Ex: Inova Tech Soluções'}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="font-medium text-gray-700">
                        E-mail Corporativo de Contato *
                      </Label>
                      <Input 
                        id="contactEmail" 
                        type="email"
                        placeholder="contato@organizacao.com.br"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-medium text-gray-700">
                        Telefone / WhatsApp
                      </Label>
                      <Input 
                        id="phone" 
                        placeholder="(11) 99999-8888"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="font-medium text-gray-700">
                      CNPJ (Opcional)
                    </Label>
                    <Input 
                      id="cnpj" 
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmittingCompany}
                    className={`w-full h-12 rounded-xl text-base font-semibold text-white shadow-lg transition-all ${
                      selectedProduct === 'SINAPSE_360_EDUCACAO'
                        ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                        : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                    }`}
                  >
                    {isSubmittingCompany ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Cadastrando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Salvar e Prosseguir para Upload de Colaboradores
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASSO 3: UPLOAD DA PLANILHA CSV DE COLABORADORES */}
        {/* ========================================================================= */}
        {step === 3 && createdCompany && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Banner de Sucesso do Cadastro da Empresa */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{createdCompany.name}</h3>
                  <p className="text-xs text-gray-500">
                    ID #{createdCompany.id} • {createdCompany.contactEmail} • Produto: <strong>{createdCompany.productInterest}</strong>
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-600 text-white">Empresa Ativa</Badge>
            </div>

            {/* Card de Importação de Planilha */}
            <Card className="rounded-3xl shadow-xl border-gray-100 bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Importar Colaboradores via Planilha
                    </CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                      Faça o upload do arquivo CSV para liberar o acesso da sua equipe às ferramentas da metodologia.
                    </CardDescription>
                  </div>
                  
                  {/* Botão de Download do Modelo de Planilha */}
                  <Button 
                    variant="outline" 
                    onClick={() => companyService.downloadSampleCsv(createdCompany.productInterest)}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl h-11 shrink-0 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar Planilha Modelo (.CSV)
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-4 space-y-6">
                {/* Instruções das Colunas */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-gray-600 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
                    <Info className="w-4 h-4 text-purple-600" />
                    Colunas suportadas no arquivo CSV:
                  </div>
                  <p className="font-mono text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 overflow-x-auto">
                    Nome, email, cargo, setor, escola, empresa, cidade, estado, cep
                  </p>
                  <p className="text-gray-500">
                    * Os campos <strong>Nome</strong> e <strong>email</strong> são obrigatórios em todas as linhas.
                  </p>
                </div>

                {/* Área Drag & Drop / Seleção de Arquivo */}
                <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/20 rounded-3xl p-8 text-center transition-colors">
                  <input 
                    type="file" 
                    id="csvUploadInput" 
                    accept=".csv,text/csv" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <label htmlFor="csvUploadInput" className="cursor-pointer block space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
                      <FileSpreadsheet className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        {selectedFile ? selectedFile.name : 'Clique para selecionar ou arraste o arquivo CSV aqui'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedFile 
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB pronto para envio` 
                          : 'Formatos aceitos: CSV (.csv) com codificação UTF-8'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Botão de Envio */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button 
                    onClick={handleUploadCsv}
                    disabled={!selectedFile || isUploading}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 px-8 font-semibold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processando Planilha...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Processar e Cadastrar Colaboradores
                      </>
                    )}
                  </Button>

                  {uploadResult?.success && (
                    <Button
                      variant="outline"
                      onClick={() => setStep(4)}
                      className="w-full sm:w-auto rounded-xl h-12 px-6 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold"
                    >
                      Ver Resumo Completo →
                    </Button>
                  )}
                </div>

                {/* ============================================================= */}
                {/* PAINEL DE NOTIFICAÇÕES INTELIGENTES (Resultado do Upload) */}
                {/* ============================================================= */}
                {uploadResult && (
                  <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in duration-300">
                    {/* Alerta Geral */}
                    <div 
                      className={`p-5 rounded-2xl border flex items-start gap-4 ${
                        uploadResult.success 
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}
                    >
                      {uploadResult.success ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <h4 className="font-bold text-base">{uploadResult.message}</h4>
                        <p className="text-xs opacity-90">
                          Total processado: <strong>{uploadResult.totalProcessed}</strong> | 
                          Importados: <strong>{uploadResult.totalImported}</strong> | 
                          Erros/Alertas: <strong>{uploadResult.totalErrors}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Detalhamento de Erros por Linha */}
                    {uploadResult.errorDetails && uploadResult.errorDetails.length > 0 && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-2">
                        <h5 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          Ressalvas identificadas na planilha ({uploadResult.errorDetails.length}):
                        </h5>
                        <ul className="space-y-1.5 text-xs text-amber-800 list-disc list-inside">
                          {uploadResult.errorDetails.map((err, idx) => (
                            <li key={idx} className="font-medium">{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Detalhamento de Sucessos */}
                    {uploadResult.successDetails && uploadResult.successDetails.length > 0 && (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-2 max-h-60 overflow-y-auto">
                        <h5 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Colaboradores adicionados com sucesso ({uploadResult.successDetails.length}):
                        </h5>
                        <ul className="space-y-1 text-xs text-emerald-800">
                          {uploadResult.successDetails.map((succ, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {succ}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASSO 4: PAINEL DE GESTÃO / RESUMO DA INSTITUIÇÃO E COLABORADORES */}
        {/* ========================================================================= */}
        {step === 4 && createdCompany && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 text-white flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{createdCompany.name}</h2>
                    <Badge className="bg-purple-600 text-white">{createdCompany.productInterest}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {createdCompany.contactEmail} • {createdCompany.phone || 'Sem telefone'} • CNPJ: {createdCompany.cnpj || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(3)}
                  className="rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Nova Planilha
                </Button>
                <Link to="/login">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-500/20">
                    Acessar Ferramentas
                  </Button>
                </Link>
              </div>
            </div>

            {/* Lista dos Colaboradores */}
            <Card className="rounded-3xl shadow-xl border-gray-100 bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Colaboradores Cadastrados ({employeesList.length})
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm">
                      Estes colaboradores já possuem liberação de acesso de acordo com o método contratado.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-4">
                {employeesList.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 space-y-3">
                    <Users className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="font-medium text-gray-600">Nenhum colaborador listado ainda.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
                        <tr>
                          <th className="py-3.5 px-4">Nome</th>
                          <th className="py-3.5 px-4">E-mail</th>
                          <th className="py-3.5 px-4">Cargo</th>
                          <th className="py-3.5 px-4">Setor / Escola</th>
                          <th className="py-3.5 px-4">Localização</th>
                          <th className="py-3.5 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {employeesList.map((emp) => (
                          <tr key={emp.id} className="hover:bg-purple-50/30 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-900">{emp.name}</td>
                            <td className="py-3.5 px-4 text-gray-600">{emp.email}</td>
                            <td className="py-3.5 px-4">{emp.role || '-'}</td>
                            <td className="py-3.5 px-4">{emp.department || emp.school || emp.companyName || '-'}</td>
                            <td className="py-3.5 px-4">
                              {emp.city && emp.state ? `${emp.city}/${emp.state}` : '-'}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                                Liberado
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

      </main>
    </div>
  )
}
