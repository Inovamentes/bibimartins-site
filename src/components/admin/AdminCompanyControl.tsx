import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Building2, Users, Upload, Download, Search, 
  RefreshCw, Briefcase
} from 'lucide-react'
import { companyService } from '@/services/companyService'
import type { CompanyResponse, Employee, EmployeeUploadResponse } from '@/services/companyService'

export function AdminCompanyControl() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([])
  const [selectedCompany, setSelectedCompany] = useState<CompanyResponse | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<EmployeeUploadResponse | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await companyService.listCompaniesByProduct('SINAPSE_360_EMPRESAS')
      setCompanies(data)
      if (data.length > 0 && !selectedCompany) {
        setSelectedCompany(data[0])
        const emp = await companyService.listEmployees(data[0].id)
        setEmployees(emp)
      }
    } catch (err) {
      console.error('Erro ao carregar empresas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSelectCompany = async (company: CompanyResponse) => {
    setSelectedCompany(company)
    setUploadResult(null)
    setSelectedFile(null)
    try {
      const emp = await companyService.listEmployees(company.id)
      setEmployees(emp)
    } catch (err) {
      console.error('Erro ao carregar colaboradores da empresa:', err)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedCompany) return
    setIsUploading(true)
    setUploadResult(null)
    try {
      const res = await companyService.uploadEmployeesCsv(selectedCompany.id, selectedFile)
      setUploadResult(res)
      if (res.totalImported > 0) {
        const emp = await companyService.listEmployees(selectedCompany.id)
        setEmployees(emp)
        loadData()
      }
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: err?.response?.data?.message || 'Erro no upload.',
        totalProcessed: 0,
        totalImported: 0,
        totalErrors: 1,
        errorDetails: [err?.message || 'Erro de conexão.'],
        successDetails: []
      })
    } finally {
      setIsUploading(false)
    }
  }

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.role && e.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (e.department && e.department.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Sinapse 360° Empresas</h2>
              <Badge className="bg-purple-500 text-white text-xs">Módulo B2B</Badge>
            </div>
            <p className="text-purple-200 text-sm mt-1">
              Gestão de clientes corporativos, colaboradores, diagnósticos NR-1 / COPSOQ e liderança.
            </p>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => companyService.downloadSampleCsv('SINAPSE_360_EMPRESAS')}
          className="bg-white text-purple-900 hover:bg-purple-50 border-0 font-semibold rounded-xl h-11 shrink-0 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Baixar Planilha Modelo Empresas
        </Button>
      </div>

      {/* Grid: Lista de Empresas + Painel de Gestão da Empresa Selecionada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1: Lista de Empresas */}
        <Card className="rounded-3xl border-gray-100 shadow-sm bg-white">
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                Empresas Cadastradas ({companies.length})
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={loadData} className="h-8 w-8 p-0">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-2 max-h-[500px] overflow-y-auto">
            {companies.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">Nenhuma empresa cadastrada.</p>
            ) : (
              companies.map(c => (
                <div 
                  key={c.id}
                  onClick={() => handleSelectCompany(c)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedCompany?.id === c.id
                      ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <p className="font-bold text-sm text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{c.contactEmail}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                    <span>{c.cnpj ? `CNPJ: ${c.cnpj}` : c.phone || 'Ativa'}</span>
                    <Badge variant="outline" className="text-[10px] text-purple-700 bg-purple-50 border-purple-200">
                      {c.totalEmployees} colaboradores
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Coluna 2 e 3: Gestão dos Colaboradores da Empresa */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCompany ? (
            <>
              {/* Card de Upload Rápido para a Empresa Selecionada */}
              <Card className="rounded-3xl border-gray-100 shadow-sm bg-white">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-600" />
                    Subir Planilha de Colaboradores • {selectedCompany.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Importe colaboradores para liberar ferramentas do plano corporativo.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-3 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Input 
                      type="file" 
                      accept=".csv,text/csv"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0])
                        }
                      }}
                      className="rounded-xl text-xs h-10 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700"
                    />
                    <Button 
                      onClick={handleUpload}
                      disabled={!selectedFile || isUploading}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold h-10 px-5 shrink-0"
                    >
                      {isUploading ? 'Processando...' : 'Importar Planilha'}
                    </Button>
                  </div>

                  {uploadResult && (
                    <div className={`p-4 rounded-2xl text-xs ${uploadResult.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
                      <p className="font-bold">{uploadResult.message}</p>
                      {uploadResult.errorDetails && uploadResult.errorDetails.length > 0 && (
                        <ul className="mt-1 list-disc list-inside space-y-0.5 text-amber-800">
                          {uploadResult.errorDetails.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabela de Colaboradores */}
              <Card className="rounded-3xl border-gray-100 shadow-sm bg-white">
                <CardHeader className="p-6 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        Colaboradores Cadastrados ({employees.length})
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Equipe com acesso às ferramentas Sinapse 360° Empresas.
                      </CardDescription>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input 
                        placeholder="Buscar por nome, cargo..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9 pl-9 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  {filteredEmployees.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8">Nenhum colaborador cadastrado para esta empresa.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-gray-100">
                      <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-50 uppercase text-[10px] text-gray-400 font-semibold border-b border-gray-100">
                          <tr>
                            <th className="py-2.5 px-3">Nome</th>
                            <th className="py-2.5 px-3">E-mail</th>
                            <th className="py-2.5 px-3">Cargo</th>
                            <th className="py-2.5 px-3">Setor/Empresa</th>
                            <th className="py-2.5 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredEmployees.map(emp => (
                            <tr key={emp.id} className="hover:bg-purple-50/30 transition-colors">
                              <td className="py-2.5 px-3 font-semibold text-gray-900">{emp.name}</td>
                              <td className="py-2.5 px-3">{emp.email}</td>
                              <td className="py-2.5 px-3">{emp.role || '-'}</td>
                              <td className="py-2.5 px-3">{emp.department || emp.companyName || '-'}</td>
                              <td className="py-2.5 px-3 text-right">
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
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
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-400">
              <Building2 className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-medium">Selecione uma empresa ao lado para gerenciar seus colaboradores.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
