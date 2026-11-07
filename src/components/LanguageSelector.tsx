import { Globe2 } from 'lucide-react'
import type { Language } from '@/i18n/useLanguage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const options: { value: Language; label: string; short: string }[] = [
  { value: 'pt-BR', label: 'Português (Brasil)', short: 'PT-BR' },
  { value: 'pt-PT', label: 'Português (Portugal)', short: 'PT-PT' },
  { value: 'es', label: 'Español', short: 'ES' },
  { value: 'en', label: 'English', short: 'EN' },
]
const labels = { 'pt-BR': 'Escolher idioma', 'pt-PT': 'Escolher idioma', es: 'Elegir idioma', en: 'Choose language' }
export function LanguageSelector({ language, onChange }: { language: Language; onChange: (value: Language) => void }) {
  return (
    <div className="language-selector">
      <Select value={language} onValueChange={value => onChange(value as Language)}>
        <SelectTrigger aria-label={labels[language]} className="h-9 w-[112px] rounded-full border-purple-200 bg-white/95 px-3 text-xs font-semibold text-purple-800 shadow-md backdrop-blur-md focus:ring-purple-500">
          <Globe2 className="mr-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <SelectValue>{options.find(option => option.value === language)?.short}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" align="end" className="z-[70] rounded-xl border-purple-100 bg-white text-gray-800">
          {options.map(option => <SelectItem key={option.value} value={option.value}><span lang={option.value}>{option.label}</span></SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}
