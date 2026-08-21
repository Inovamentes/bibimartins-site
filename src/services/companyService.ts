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

  async listCompaniesByProduct(product: ProductInterest): Promise<CompanyResponse[]> {
    const all = await this.listCompanies()
    return all.filter((c) => c.productInterest === product)
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

  /**
   * Modelo oficial base para importação de colaboradores (Sinapse 360 Empresas e Educação)
   * Configurado com BOM UTF-8 para abertura nativa e perfeita no Microsoft Excel e LibreOffice.
   */
  downloadSampleCsv(type?: ProductInterest) {
    const headers = 'Nome,email,cargo,setor,escola,empresa,cidade,estado,cep'
    const sampleRows = [
      'Maria Souza,maria.souza@escola.com.br,Coordenadora Pedagogica,Ensino Fundamental,Colegio Futuro,,Sao Paulo,SP,01310-100',
      'Carlos Alberto,carlos.alberto@escola.com.br,Professor de Matematica,Corpo Docente,Colegio Futuro,,Sao Paulo,SP,01310-100',
      'Fernanda Lima,fernanda.lima@escola.com.br,Psicopedagoga,Apoio ao Aluno,Colegio Futuro,,Sao Paulo,SP,01310-100',
    ].join('\r\n')

    // Inclusão do BOM UTF-8 (\uFEFF) para garantir que o Microsoft Excel abra com acentos e colunas corretas
    const csvContent = '\uFEFF' + `${headers}\r\n${sampleRows}\r\n`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)

    const filename = type === 'SINAPSE_360_EDUCACAO'
      ? 'modelo_colaboradores_sinapse_educacao.csv'
      : type === 'SINAPSE_360_EMPRESAS'
      ? 'modelo_colaboradores_sinapse_empresas.csv'
      : 'modelo_colaboradores_sinapse_360.csv'

    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
}
