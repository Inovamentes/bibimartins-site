import api from '@/lib/api'

export type ProductInterest = 'SINAPSE_360_EMPRESAS' | 'SINAPSE_360_EDUCACAO'

export interface CompanyCreateRequest {
  name: string
  contactEmail: string
  phone?: string
  cnpj?: string
  productInterest: ProductInterest
}

export interface CompanyResponse {
  id: number
  name: string
  contactEmail: string
  phone: string
  cnpj: string
  productInterest: ProductInterest
  createdAt: string
  totalEmployees: number
}

export interface EmployeeUploadResponse {
  success: boolean
  message: string
  totalProcessed: number
  totalImported: number
  totalErrors: number
  errorDetails: string[]
  successDetails: string[]
}

export interface Employee {
  id: number
  name: string
  email: string
  role?: string
  department?: string
  school?: string
  companyName?: string
  city?: string
  state?: string
  zipCode?: string
  createdAt: string
}

export const companyService = {
  async registerCompany(data: CompanyCreateRequest): Promise<CompanyResponse> {
    const res = await api.post<CompanyResponse>('/api/companies', data)
    return res.data
  },

  async getCompany(id: number): Promise<CompanyResponse> {
    const res = await api.get<CompanyResponse>(`/api/companies/${id}`)
    return res.data
  },

  async listCompanies(): Promise<CompanyResponse[]> {
    const res = await api.get<CompanyResponse[]>('/api/companies')
    return res.data
  },

  async uploadEmployeesCsv(companyId: number, file: File): Promise<EmployeeUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await api.post<EmployeeUploadResponse>(
      `/api/companies/${companyId}/employees/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return res.data
  },

  async listEmployees(companyId: number): Promise<Employee[]> {
    const res = await api.get<Employee[]>(`/api/companies/${companyId}/employees`)
    return res.data
  },

  downloadSampleCsv(type: ProductInterest) {
    const headers = 'Nome,email,cargo,setor,escola,empresa,cidade,estado,cep'
    let sampleRows = ''

    if (type === 'SINAPSE_360_EDUCACAO') {
      sampleRows = [
        'Maria Souza,maria.souza@escola.com.br,Coordenadora Pedagogica,Ensino Fundamental,Colegio Futuro,,Sao Paulo,SP,01310-100',
        'Carlos Alberto,carlos.alberto@escola.com.br,Professor de Matematica,Corpo Docente,Colegio Futuro,,Sao Paulo,SP,01310-100',
        'Fernanda Lima,fernanda.lima@escola.com.br,Psicopedagoga,Apoio ao Aluno,Colegio Futuro,,Sao Paulo,SP,01310-100'
      ].join('\n')
    } else {
      sampleRows = [
        'Joao Silva,joao.silva@empresa.com.br,Gerente de Operacoes,Operacoes,,Inova Tech Ltda,Sao Paulo,SP,04543-011',
        'Ana Paula,ana.paula@empresa.com.br,Analista de RH,Recursos Humanos,,Inova Tech Ltda,Sao Paulo,SP,04543-011',
        'Roberto Santos,roberto.santos@empresa.com.br,Lider Tecnico,Engenharia,,Inova Tech Ltda,Sao Paulo,SP,04543-011'
      ].join('\n')
    }

    const csvContent = `${headers}\n${sampleRows}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `modelo_colaboradores_${type === 'SINAPSE_360_EDUCACAO' ? 'educacao' : 'empresas'}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },
}
