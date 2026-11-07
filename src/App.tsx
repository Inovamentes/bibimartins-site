import { useLanguage } from './i18n/useLanguage'
import { LanguageSelector } from './components/LanguageSelector'
import { useEffect, useState, useRef } from 'react'
import './App.css'
import { 
  Menu, Phone, Mail, Instagram, Facebook, Youtube, 
  ChevronRight, Star, Quote, Brain, Users, MessageCircle, 
  Target, Zap, Award, TrendingUp, ArrowRight, Play, Building2,
  Sparkles, Lightbulb, Heart, CheckCircle2, User, ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

function App() {
  const { language, setLanguage, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = ['home', 'sobre', 'metodo', 'palestras', 'depoimentos', 'faq', 'contato']
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
    { id: 'home', label: t(7) },
    { id: 'sobre', label: t(8) },
    { id: 'metodo', label: t(9) },
    { id: 'palestras', label: t(10) },
    { id: 'depoimentos', label: t(11) },
    { id: 'faq', label: t(12) },
    { id: 'contato', label: t(13) },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-gray-100' 
            : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo & Marca Bibi Martins */}
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} 
              className="flex items-center gap-3.5 group shrink-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 flex items-center justify-center shadow-md shadow-purple-900/30 group-hover:scale-105 transition-transform duration-300 border border-white/20">
                <span className="text-white font-extrabold text-base sm:text-lg tracking-wider font-mono">BM</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-xl sm:text-2xl tracking-tight leading-none transition-colors ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Bibi Martins
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-[0.25em] mt-1 transition-colors ${
                  isScrolled ? 'text-purple-700' : 'text-orange-300'
                }`}>
                  {t(16)}
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-black/5 dark:bg-white/5 backdrop-blur-sm px-2.5 py-1 rounded-full border border-black/5 dark:border-white/10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    activeSection === item.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : isScrolled
                        ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons (100% visíveis, sem cortes) */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Button 
                onClick={() => window.location.href = '/sinapse-360'}
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 rounded-full px-3.5 h-9 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Sinapse 360°</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.open('https://wa.me/5511932143117?text=Olá Bibi, gostaria de saber mais sobre a Plataforma NR-1 COPSOQ para minha empresa.', '_blank')}
                className={`h-9 px-3 text-xs font-semibold rounded-full border transition-all ${
                  isScrolled 
                    ? 'border-orange-200 text-orange-700 hover:bg-orange-50' 
                    : 'border-white/30 text-white bg-white/5 hover:bg-white/15'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>NR-1</span>
              </Button>

              <Button 
                onClick={() => window.location.href = '/login'}
                className={`h-9 px-3.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                  isScrolled
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                    : 'bg-white text-purple-950 hover:bg-purple-50 shadow-md shadow-black/15'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t(19)}</span>
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button 
                size="sm"
                onClick={() => window.location.href = '/login'}
                className="bg-gradient-to-r from-purple-600 to-orange-500 text-white text-xs font-bold rounded-full h-8 px-3"
              >
                <User className="w-3 h-3 mr-1" />
                {t(20)}
              </Button>

              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={`rounded-xl ${isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[310px] bg-white p-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Logo Mobile */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-lg">
                        BM
                      </div>
                      <div>
                        <span className="font-extrabold text-xl text-gray-900 block leading-tight">Bibi Martins</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700">{t(16)}</span>
                      </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col gap-1 border-t border-gray-100 pt-4">
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setTimeout(() => scrollToSection(item.id), 300);
                          }}
                          className={`px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                            activeSection === item.id
                              ? 'bg-purple-100 text-purple-800 font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Mobile Actions */}
                  <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    <Button 
                      onClick={() => { setIsMenuOpen(false); window.location.href = '/sinapse-360'; }}
                      className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold text-xs h-10 rounded-xl shadow-md"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      {t(21)}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => { setIsMenuOpen(false); window.location.href = '/login'; }}
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-xs h-10 rounded-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t(22)}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                      className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold text-xs h-10 rounded-xl"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {t(23)}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </header>

      <LanguageSelector language={language} onChange={setLanguage} />

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
            className="w-full h-full object-cover object-top" style={{objectPosition: '0% 10%'}}
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-36 sm:pt-44 pb-12">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-white/20 text-white backdrop-blur-sm border-white/30 hover:bg-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              {t(24)}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t(25)}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
                {t(26)}
              </span>{' '}
              {t(27)}
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              {t(28)}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg"
                onClick={() => scrollToSection('palestras')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8"
              >
                {t(29)}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                className="bg-transparent border-white/50 text-white hover:bg-white/10 px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t(30)}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '15+', label: t(32) },
                { value: '5', label: t(34) },
                { value: '∞', label: t(36) },
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

      {/* About Section */}
      <section id="sobre" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/3BFD633B-9979-478F-B846-28C3DD19BCF4.jpeg" 
                  alt={t(37)}
                  className="w-full h-[500px] object-contain"
                  loading="lazy"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t(38)}</div>
                    <div className="text-sm text-gray-600">{t(39)}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {t(40)}
                </p>
              </div>
              {/* Decorative */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-100 rounded-full -z-10" />
              <div className="absolute -bottom-4 left-1/4 w-16 h-16 bg-orange-100 rounded-full -z-10" />
            </div>

            {/* Content */}
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
                {t(41)}
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t(42)}{' '}
                <span className="text-gradient">Bibi Martins?</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {t(44)}
                </p>
                <p>
                  {t(45)}{' '}
                  <strong>{t(46)} </strong>
                  {t(47)}
                </p>
                <p>
                  {t(48)}  <strong>{t(49)} </strong>
                  {t(50)}
                </p>
                <p>
                  {t(51)} <strong>{t(52)}</strong>{t(53)} <strong>{t(54)}</strong>
                </p>
              </div>

              {/* Topics */}
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Brain, text: t(55) },
                  { icon: Users, text: t(56) },
                  { icon: Heart, text: t(57) },
                  { icon: TrendingUp, text: t(58) },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Método Sinapse 360 Section */}
      <section id="metodo" className="py-20 lg:py-32 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
              <Lightbulb className="w-3 h-3 mr-1" />
              {t(59)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t(9)} <span className="text-gradient">Sinapse 360°</span>
            </h2>
            <p className="text-lg text-gray-600">
              {t(60)}
            </p>
          </div>

          {/* Pillars */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                number: '01',
                title: t(61),
                description: t(62),
                objective: t(63),
                color: 'purple',
                icon: Brain,
              },
              {
                number: '02',
                title: t(64),
                description: t(65),
                objective: t(66),
                color: 'orange',
                icon: Users,
              },
              {
                number: '03',
                title: t(67),
                description: t(68),
                objective: t(69),
                color: 'teal',
                icon: MessageCircle,
              },
              {
                number: '04',
                title: t(70),
                description: t(71),
                objective: t(72),
                color: 'purple',
                icon: Target,
              },
              {
                number: '05',
                title: t(73),
                description: t(74),
                objective: t(75),
                color: 'orange',
                icon: Zap,
              },
            ].map((pillar, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                  pillar.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  pillar.color === 'orange' ? 'from-orange-500 to-orange-600' :
                  'from-teal-500 to-teal-600'
                }`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      pillar.color === 'purple' ? 'bg-purple-100' :
                      pillar.color === 'orange' ? 'bg-orange-100' :
                      'bg-teal-100'
                    }`}>
                      <pillar.icon className={`w-7 h-7 ${
                        pillar.color === 'purple' ? 'text-purple-600' :
                        pillar.color === 'orange' ? 'text-orange-600' :
                        'text-teal-600'
                      }`} />
                    </div>
                    <span className={`text-4xl font-bold ${
                      pillar.color === 'purple' ? 'text-purple-200' :
                      pillar.color === 'orange' ? 'text-orange-200' :
                      'text-teal-200'
                    }`}>{pillar.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{pillar.description}</p>
                  <div className={`p-3 rounded-lg ${
                    pillar.color === 'purple' ? 'bg-purple-50' :
                    pillar.color === 'orange' ? 'bg-orange-50' :
                    'bg-teal-50'
                  }`}>
                    <p className={`text-sm font-medium ${
                      pillar.color === 'purple' ? 'text-purple-700' :
                      pillar.color === 'orange' ? 'text-orange-700' :
                      'text-teal-700'
                    }`}>
                      <Target className="w-4 h-4 inline mr-1" />
                      {pillar.objective}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Banner Portal Sinapse 360 Empresas & Educacao */}
          <div className="mt-12 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center lg:text-left max-w-2xl">
                <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 px-3 py-1">
                  {t(76)}
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {t(77)}
                </h3>
                <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                  {t(78)}
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/sinapse-360'}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-orange-500/30 text-base shrink-0 group transition-all"
              >
                {t(79)}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* BMAcademy CTA */}
          <div className="mt-12">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src="/images/Gemini_Generated_Image_pvaxsjpvaxsjpvax.png" 
                      alt="BM Academy" 
                      className="w-16 h-16 rounded-xl object-contain"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">BM Academy</h3>
                      <p className="text-orange-600 font-medium">{t(81)}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t(82)}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => window.open('https://wa.me/5511932143117?text=Olá Bibi, gostaria de saber mais sobre a formação de líderes na BM Academy.', '_blank')}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                    >
                      {t(83)}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button 
                      onClick={() => window.open('https://wa.me/5511932143117?text=Olá Bibi, gostaria de implantar a Plataforma NR-1 COPSOQ na minha empresa.', '_blank')}
                      variant="outline"
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      {t(84)}
                    </Button>
                  </div>
                </div>
                <div className="relative hidden lg:block">
                  <img 
                    src="/images/Gemini_Generated_Image_pvaxsjpvaxsjpvax.png" 
                    alt="BMAcademy" 
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Palestras Section */}
      <section id="palestras" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Play className="w-3 h-3 mr-1" />
              {t(10)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t(86)} <span className="text-gradient">{t(87)}</span>
            </h2>
            <p className="text-lg text-gray-600">
              {t(88)}
            </p>
          </div>

          {/* Talks Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t(89),
                subtitle: t(90),
                description: t(91),
                duration: '60-90 min',
                audience: t(93),
                color: 'purple',
              },
              {
                title: t(94),
                subtitle: t(95),
                description: t(96),
                duration: '60-90 min',
                audience: t(97),
                color: 'orange',
              },
              {
                title: t(98),
                subtitle: t(99),
                description: t(100),
                duration: '60-90 min',
                audience: t(101),
                color: 'teal',
              },
              {
                title: t(102),
                subtitle: t(103),
                description: t(104),
                duration: t(105),
                audience: t(25),
                color: 'purple',
              },
              {
                title: t(106),
                subtitle: t(107),
                description: t(108),
                duration: '60-120 min',
                audience: t(110),
                color: 'orange',
              },
              {
                title: t(111),
                subtitle: t(112),
                description: t(113),
                duration: t(114),
                audience: t(115),
                color: 'teal',
              },
            ].map((talk, index) => (
              <Card 
                key={index} 
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${
                  talk.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  talk.color === 'orange' ? 'from-orange-500 to-orange-600' :
                  'from-teal-500 to-teal-600'
                }`} />
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {talk.duration}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {talk.audience}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {talk.title}
                  </h3>
                  <p className={`text-sm font-medium mb-4 ${
                    talk.color === 'purple' ? 'text-purple-600' :
                    talk.color === 'orange' ? 'text-orange-600' :
                    'text-teal-600'
                  }`}>
                    {talk.subtitle}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {talk.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                    className={`w-full group-hover:bg-gradient-to-r ${
                      talk.color === 'purple' ? 'group-hover:from-purple-600 group-hover:to-purple-700' :
                      talk.color === 'orange' ? 'group-hover:from-orange-500 group-hover:to-orange-600' :
                      'group-hover:from-teal-500 group-hover:to-teal-600'
                    } group-hover:text-white group-hover:border-transparent transition-all`}
                  >
                    {t(30)}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: t(116), label: t(117), icon: Award },
              { value: t(118), label: t(119), icon: Brain },
              { value: t(120), label: t(121), icon: Target },
            ].map((item, index) => (
              <div key={index} className="rounded-2xl bg-white border border-gray-100 p-5 text-center">
                <div className="mx-auto mb-2 w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
              <Star className="w-3 h-3 mr-1" />
              {t(11)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t(122)} <span className="text-gradient">{t(123)}</span>
            </h2>
            <p className="text-lg text-gray-600">
              {t(124)}
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                text: t(125),
                author: 'Ana Paula Mendes',
                role: t(126),
                company: 'TechCorp Brasil',
              },
              {
                text: t(127),
                author: 'Carlos Eduardo Lima',
                role: 'CEO',
                company: 'Inovação Group',
              },
              {
                text: t(129),
                author: 'Mariana Souza',
                role: t(130),
                company: 'Global Industries',
              },
              {
                text: t(131),
                author: 'Ricardo Almeida',
                role: t(132),
                company: 'Finance Solutions',
              },
              {
                text: t(133),
                author: 'Fernanda Costa',
                role: t(134),
                company: 'StartUp Hub',
              },
              {
                text: t(135),
                author: 'João Pedro Silva',
                role: t(136),
                company: 'Business Partners',
              },
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <Quote className="w-10 h-10 text-purple-200 mb-4" />
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white font-bold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Building2 className="w-3 h-3 mr-1" />
              {t(137)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t(138)} <span className="text-gradient">{t(139)}</span>
            </h2>
            <p className="text-lg text-gray-600">
              {t(140)}
            </p>
          </div>

          <Card className="border-0 shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-3 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: t(141),
                    answer: t(142),
                  },
                  {
                    question: t(143),
                    answer: t(144),
                  },
                  {
                    question: t(145),
                    answer: t(146),
                  },
                  {
                    question: t(147),
                    answer: t(148),
                  },
                  {
                    question: t(149),
                    answer: t(150),
                  },
                ].map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
                <Phone className="w-3 h-3 mr-1" />
                {t(13)}
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t(151)} <span className="text-gradient">{t(152)}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t(153)}
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <a 
                      href="https://wa.me/5511932143117" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                    >
                      +55 11 93214-3117
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">E-mail</p>
                    <a 
                      href="mailto:falacomigo@bibimartins.com"
                      className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                    >
                      falacomigo@bibimartins.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-teal-600" />
                  </div>
	                  <div>
	                    <p className="text-sm text-gray-600">{t(157)}</p>
	                    <a 
	                      href="https://instagram.com/bibimartinsoficial" 
	                      target="_blank" 
	                      rel="noopener noreferrer"
	                      className="text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors"
	                    >
	                      @bibimartinsoficial
	                    </a>
	                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-4">{t(159)}</p>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: 'https://instagram.com/bibimartinsoficial', color: 'bg-pink-100 text-pink-600' },
                    { icon: Facebook, href: 'https://facebook.com/bibimartinsoficial', color: 'bg-blue-100 text-blue-600' },
                    { icon: Youtube, href: 'https://youtube.com/@bibimartinsoficial', color: 'bg-red-100 text-red-600' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center hover:scale-110 transition-transform`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="relative">
              <Card className="border-0 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-orange-600" />
                <div className="relative p-8 lg:p-12 text-white">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                    {t(160)}
                  </h3>
                  <p className="text-white/90 mb-8 leading-relaxed">
                    {t(161)}
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      t(162),
                      t(163),
                      t(164),
                      t(165),
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-orange-300 flex-shrink-0" />
                        <span className="text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    size="lg"
                    onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                    className="w-full bg-white text-purple-700 hover:bg-gray-100 font-semibold"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {t(166)}
                  </Button>

                  <p className="text-center text-white/70 text-sm mt-4">
                    {t(167)}
                  </p>
                </div>
              </Card>

              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/30 rounded-full blur-2xl" />
            </div>
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
                {t(168)}
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

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">{t(169)}</h4>
              <ul className="space-y-3">
                {[
                  { label: t(7), href: '#home' },
                  { label: t(8), href: '#sobre' },
                  { label: t(118), href: '#metodo' },
                  { label: t(10), href: '#palestras' },
                  { label: t(11), href: '#depoimentos' },
                  { label: t(12), href: '#faq' },
                  { label: t(13), href: '#contato' },
                ].map((link, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => scrollToSection(link.href.replace('#', ''))}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Palestras */}
            <div>
              <h4 className="font-bold text-lg mb-6">{t(10)}</h4>
              <ul className="space-y-3">
	                {[
	                  t(89),
	                  t(94),
	                  t(98),
	                  t(102),
	                  t(106),
	                  t(111),
	                ].map((talk, index) => (
	                  <li key={index}>
	                    <button 
	                      onClick={() => scrollToSection('palestras')}
	                      className="text-gray-400 hover:text-white transition-colors text-left"
	                    >
	                      {talk}
	                    </button>
	                  </li>
	                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6">{t(13)}</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <a href="https://wa.me/5511932143117" className="text-gray-400 hover:text-white transition-colors">
                    +55 11 93214-3117
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <a href="mailto:falacomigo@bibimartins.com" className="text-gray-400 hover:text-white transition-colors">
                    falacomigo@bibimartins.com
                  </a>
                </li>
	                <li className="flex items-center gap-3">
	                  <Instagram className="w-5 h-5 text-pink-400" />
	                  <a 
	                    href="https://instagram.com/bibimartinsoficial" 
	                    target="_blank" 
	                    rel="noopener noreferrer"
	                    className="text-gray-400 hover:text-white transition-colors"
	                  >
	                    @bibimartinsoficial
	                  </a>
	                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {t(170)}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">{t(171)}</span>
              <img 
                src="/images/Gemini_Generated_Image_pvaxsjpvaxsjpvax.png" 
                alt="BM Academy" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
