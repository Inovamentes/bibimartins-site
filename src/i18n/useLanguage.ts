import { useEffect, useState } from 'react'
import source from './source.json'
import { en, es, pt } from './translations'

export type Language = 'pt-BR' | 'pt-PT' | 'es' | 'en'
const storageKey = 'bibi-martins-language'
const languages: Language[] = ['pt-BR', 'pt-PT', 'es', 'en']
export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return languages.includes(saved as Language) ? saved as Language : 'pt-BR'
    } catch { return 'pt-BR' }
  })
  useEffect(() => {
    document.documentElement.lang = language
    try { localStorage.setItem(storageKey, language) } catch { /* Storage may be disabled. */ }
  }, [language])
  const dictionary = language === 'en' ? en : language === 'es' ? es : language === 'pt-PT' ? pt : {}
  const t = (id: number) => dictionary[id] ?? source[id]
  return { language, setLanguage, t }
}
