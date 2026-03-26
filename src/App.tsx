import { useEffect, useState, useRef } from 'react'
import './App.css'
import { 
  Menu, Phone, Mail, Instagram, Facebook, Youtube, 
  ChevronRight, Star, Quote, Brain, Users, MessageCircle, 
  Target, Zap, Award, TrendingUp, ArrowRight, Play,
  Sparkles, Lightbulb, Heart, CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = ['home', 'sobre', 'metodo', 'palestras', 'depoimentos', 'contato']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'metodo', label: 'Método' },
    { id: 'palestras', label: 'Palestras' },
    { id: 'depoimentos', label: 'Depoimentos' },
    { id: 'contato', label: 'Contato' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" onClick={() => scrollToSection('home')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">BM</span>
              </div>
              <div className="hidden sm:block">
                <span className={`font-bold text-xl transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  Bibi Martins
                </span>
                <p className={`text-xs transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
                  Palestrante & Mentora
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-purple-600 text-white'
                      : isScrolled
                        ? 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button 
                onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6"
              >
                <Phone className="w-4 h-4 mr-2" />
                Fale Comigo
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className={isScrolled ? 'text-gray-900' : 'text-white'}>
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">BM</span>
                    </div>
                    <div>
                      <span className="font-bold text-lg text-gray-900">Bibi Martins</span>
                      <p className="text-xs text-gray-600">Palestrante & Mentora</p>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          scrollToSection(item.id)
                          document.querySelector('[data-state="open"]')?.dispatchEvent(new Event('close'))
                        }}
                        className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${
                          activeSection === item.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                  <Button 
                    onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Fale Comigo
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/2F944E58-9815-40C7-B5F2-30BC9C5EA73B.jpeg" 
            alt="Bibi Martins" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-white/20 text-white backdrop-blur-sm border-white/30 hover:bg-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Transformando Liderança
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Liderança{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
                Neurodiversa
              </span>{' '}
              para o Mundo Real
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              Palestras e mentoria que desafiam os paradigmas tradicionais. 
              Descubra como líderes neurodivergentes estão transformando o 
              cenário corporativo e por que as novas gerações estão 
              redefinindo o conceito de liderança.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg"
                onClick={() => scrollToSection('palestras')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8"
              >
                Conheça Minhas Palestras
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                className="border-white/50 text-white hover:bg-white/10 px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                Solicitar Orçamento
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '15+', label: 'Anos de Experiência' },
                { value: '5', label: 'Pilares do Método' },
                { value: '∞', label: 'Possibilidades' },
              ].map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/80 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BM</span>
                </div>
                <div>
                  <span className="font-bold text-xl">Bibi Martins</span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Transformando lideranças e organizações através da neurodiversidade 
                e relações de poder saudáveis.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: 'https://instagram.com/bibimartinsoficial' },
                  { icon: Facebook, href: 'https://facebook.com/bibimartinsoficial' },
                  { icon: Youtube, href: 'https://youtube.com/@bibimartinsoficial' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-purple-600 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Bibi Martins. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
