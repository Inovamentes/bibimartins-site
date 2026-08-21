import api from '@/lib/api'
import * as XLSX from 'xlsx'

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

  /**
   * Faz upload de arquivo Excel (.xlsx, .xls) ou .csv
   * Se for .xlsx/.xls, converte para CSV UTF-8 automaticamente antes de enviar.
   */
  async uploadEmployeesCsv(companyId: number, file: File): Promise<EmployeeUploadResponse> {
    let fileToSend: File = file

    // Se for arquivo Excel (.xlsx ou .xls), converte para CSV UTF-8 nativo
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    if (isExcel) {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet)
      
      const blob = new Blob(['\uFEFF' + csvOutput], { type: 'text/csv;charset=utf-8;' })
      fileToSend = new File([blob], file.name.replace(/\.[^/.]+$/, '.csv'), { type: 'text/csv' })
    }

    const formData = new FormData()
    formData.append('file', fileToSend)

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
   * Baixa a planilha modelo no formato Excel (.xlsx) nativo com ícone oficial e colunas ajustadas.
   */
  downloadSampleExcel(type?: ProductInterest) {
    const sampleData = [
      {
        Nome: 'Maria Souza',
        email: 'maria.souza@escola.com.br',
        cargo: 'Coordenadora Pedagogica',
        setor: 'Ensino Fundamental',
        escola: 'Colegio Futuro',
        empresa: '',
        cidade: 'Sao Paulo',
        estado: 'SP',
        cep: '01310-100'
      },
      {
        Nome: 'Carlos Alberto',
        email: 'carlos.alberto@escola.com.br',
        cargo: 'Professor de Matematica',
        setor: 'Corpo Docente',
        escola: 'Colegio Futuro',
        empresa: '',
        cidade: 'Sao Paulo',
        estado: 'SP',
        cep: '01310-100'
      },
      {
        Nome: 'Fernanda Lima',
        email: 'fernanda.lima@escola.com.br',
        cargo: 'Psicopedagoga',
        setor: 'Apoio ao Aluno',
        escola: 'Colegio Futuro',
        empresa: '',
        cidade: 'Sao Paulo',
        estado: 'SP',
        cep: '01310-100'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(sampleData, {
      header: ['Nome', 'email', 'cargo', 'setor', 'escola', 'empresa', 'cidade', 'estado', 'cep']
    })

    // Ajustar largura das colunas
    worksheet['!cols'] = [
      { wch: 22 }, // Nome
      { wch: 32 }, // email
      { wch: 26 }, // cargo
      { wch: 22 }, // setor
      { wch: 20 }, // escola
      { wch: 20 }, // empresa
      { wch: 16 }, // cidade
      { wch: 8 },  // estado
      { wch: 12 }  // cep
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Colaboradores')

    const filename = type === 'SINAPSE_360_EDUCACAO'
      ? 'modelo_colaboradores_sinapse_educacao.xlsx'
      : type === 'SINAPSE_360_EMPRESAS'
      ? 'modelo_colaboradores_sinapse_empresas.xlsx'
      : 'modelo_colaboradores_sinapse_360.xlsx'

    XLSX.writeFile(workbook, filename)
  },

  /**
   * Baixa a planilha modelo no formato CSV com BOM UTF-8.
   */
  downloadSampleCsv(type?: ProductInterest) {
    this.downloadSampleExcel(type)
  },
}
