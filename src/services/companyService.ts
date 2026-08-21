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
   * Localiza a linha de cabeçalho (Nome, email...) e converte perfeitamente para envio.
   */
  async uploadEmployeesCsv(companyId: number, file: File): Promise<EmployeeUploadResponse> {
    let fileToSend: File = file

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    if (isExcel) {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Converter para matriz de dados
      const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      // Localizar em qual linha está o cabeçalho (que contém 'Nome' e 'email')
      let headerRowIndex = 0
      for (let i = 0; i < rawData.length; i++) {
        const rowStr = (rawData[i] || []).map((c) => String(c).toLowerCase().trim()).join(',')
        if (rowStr.includes('nome') && rowStr.includes('email')) {
          headerRowIndex = i
          break
        }
      }

      // Extrair os dados a partir do cabeçalho
      const cleanRows = rawData.slice(headerRowIndex).filter((row) => {
        // Ignora linhas totalmente vazias
        return row && row.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== '')
      })

      const newWorksheet = XLSX.utils.aoa_to_sheet(cleanRows)
      const csvOutput = XLSX.utils.sheet_to_csv(newWorksheet)
      
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
   * Baixa a planilha modelo oficial com a Logomarca / Marca Bibi Martins Sinapse 360°,
   * sem dados fictícios (pronta para preenchimento direto).
   */
  downloadSampleExcel(type?: ProductInterest) {
    const productTitle = type === 'SINAPSE_360_EDUCACAO' 
      ? 'BIBI MARTINS • METODOLOGIA SINAPSE 360° EDUCAÇÃO'
      : type === 'SINAPSE_360_EMPRESAS'
      ? 'BIBI MARTINS • METODOLOGIA SINAPSE 360° EMPRESAS'
      : 'BIBI MARTINS • METODOLOGIA SINAPSE 360°'

    const rows = [
      // Linha 1: Marca Bibi Martins
      [productTitle],
      // Linha 2: Subtítulo e orientação
      ['Planilha Oficial de Cadastro de Colaboradores e Docentes • Preencha os campos a partir da Linha 4'],
      // Linha 3: Linha de separação visual
      [],
      // Linha 4: Cabeçalhos oficiais
      ['Nome', 'email', 'cargo', 'setor', 'escola', 'empresa', 'cidade', 'estado', 'cep']
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(rows)

    // Ajustar larguras das colunas
    worksheet['!cols'] = [
      { wch: 25 }, // Nome
      { wch: 32 }, // email
      { wch: 26 }, // cargo
      { wch: 22 }, // setor
      { wch: 22 }, // escola
      { wch: 22 }, // empresa
      { wch: 18 }, // cidade
      { wch: 10 }, // estado
      { wch: 14 }  // cep
    ]

    // Mesclar linhas de título no topo para destaque visual elegante
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Mescla título da marca
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Mescla subtítulo
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bibi Martins - Sinapse 360')

    // Propriedades do documento
    workbook.Props = {
      Title: productTitle,
      Subject: 'Importação de Colaboradores Sinapse 360',
      Author: 'Bibi Martins',
      Company: 'Bibi Martins Desenvolvimento Humano',
      CreatedDate: new Date()
    }

    const filename = type === 'SINAPSE_360_EDUCACAO'
      ? 'modelo_oficial_sinapse_educacao_bibimartins.xlsx'
      : type === 'SINAPSE_360_EMPRESAS'
      ? 'modelo_oficial_sinapse_empresas_bibimartins.xlsx'
      : 'modelo_oficial_sinapse_360_bibimartins.xlsx'

    XLSX.writeFile(workbook, filename)
  },

  downloadSampleCsv(type?: ProductInterest) {
    this.downloadSampleExcel(type)
  },
}
