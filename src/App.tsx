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
            className="w-full h-full object-cover object-top" style={{objectPosition: '0% 20%'}}
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
              Descubra como mudar de líder padrão para um líder inclusivo, identificando potenciais 
              neurodivergentes no novo cenário corporativo e por que as novas gerações estão 
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

      {/* About Section */}
      <section id="sobre" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/3BFD633B-9979-478F-B846-28C3DD19BCF4.jpeg" 
                  alt="Bibi Martins - Palestrante" 
                  className="w-full h-[500px] object-contain"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">15+ Anos</div>
                    <div className="text-sm text-gray-600">de Experiência</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Transformando líderes e liderados a reconhecer que precisam mudar o mindset neurotípico.
                </p>
              </div>
              {/* Decorative */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-100 rounded-full -z-10" />
              <div className="absolute -bottom-4 left-1/4 w-16 h-16 bg-orange-100 rounded-full -z-10" />
            </div>

            {/* Content */}
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
                Sobre Mim
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Quem é{' '}
                <span className="text-gradient">Bibi Martins?</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Sou palestrante, mentora corporativa e especialista em liderança neurodiversa. 
                  Minha missão é transformar a forma como as organizações entendem e praticam 
                  a liderança no mundo contemporâneo.
                </p>
                <p>
                  Ao longo de mais de 15 anos, de atuação em grandes empresas, vivenciei de perto desafios enfrentados
                  <strong> por profissionais neurodivergentes. Sendo também uma pessoa neurodivergente, compreendo por </strong>
                  que tantos talentos ainda são negligenciados — e, muitas vezes, marginalizados ou até desligados.
                </p>
                <p>
                  Esse cenário não é pontual: ele reflete a ausência de uma liderança preparada, com inteligência neurodiversa
                  e flexibilidade cognitiva, para reconhecer, desenvolver e reter profissionais em toda a sua diversidade. 
                  O resultado é a perda de talentos, redução de performance e ambientes menos inovadores.
                </p>
                <p>
                  Neste meu projeto <strong>trouxe também o porque das gerações mais novas estarem rejeitando 
                  cargos de liderança</strong>. A resposta primária está nas relações de poder tóxicas, 
                  está também na falta de propósito e na ausência de modelos de liderança que realmente inspirem.
                </p>
              </div>

              {/* Topics */}
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Brain, text: 'Liderança Neurodiversa' },
                  { icon: Users, text: 'Relações de Poder' },
                  { icon: Heart, text: 'Empoderamento' },
                  { icon: TrendingUp, text: 'Gestão de Pessoas' },
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
              Metodologia Exclusiva
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Método <span className="text-gradient">Sinapse 360°</span>
            </h2>
            <p className="text-lg text-gray-600">
              A metodologia BMAcademy de Liderança para o Neurodiverso e pelo Neurodiverso. 
              Uma abordagem completa que transforma líderes e organizações.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                number: '01',
                title: 'Auto-Consciência Cognitiva',
                description: 'O líder entende seu próprio padrão mental, forças e limites. Desenvolve autoconhecimento profundo sobre seu funcionamento mental e estilo de processamento.',
                objective: 'Desenvolver autoconsciência para liderança adaptativa.',
                color: 'purple',
                icon: Brain,
              },
              {
                number: '02',
                title: 'Leitura de Perfis',
                description: 'Capacidade de identificar estilos cognitivos e comportamentais sem rotular ou "patologizar". Aqui nasce a liderança inclusiva estratégica.',
                objective: 'Identificar padrões cognitivos sem julgamentos.',
                color: 'orange',
                icon: Users,
              },
              {
                number: '03',
                title: 'Comunicação Sináptica',
                description: 'Ajuste intencional da linguagem, estrutura e expectativas conforme o perfil da equipe. O coração do método - tradução entre mentes diferentes.',
                objective: 'Estruturar mensagens com clareza cognitiva.',
                color: 'teal',
                icon: MessageCircle,
              },
              {
                number: '04',
                title: 'Arquitetura de Ambiente',
                description: 'Criação de previsibilidade, clareza e segurança psicológica para diferentes funcionamentos mentais. O método sai do indivíduo e entra no sistema.',
                objective: 'Criar ambientes previsíveis para cérebros diversos.',
                color: 'purple',
                icon: Target,
              },
              {
                number: '05',
                title: 'Performance Adaptativa',
                description: 'Transformar diversidade cognitiva em vantagem competitiva. O líder deixa de "acomodar diferenças" e passa a usá-las estrategicamente.',
                objective: 'Transformar diferenças em inovação e resultado.',
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

          {/* BM Academy CTA */}
          <div className="mt-16">
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
                      <p className="text-orange-600 font-medium">Se não te cabe, inove</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    A BM Academy é uma escola corporativa diferenciada que oferece programas de desenvolvimento
                    desde a base de Jovens aprendizes,passando também pelo operacional, identificando potenciais para o 
                    desenvolvimento de futuras lideranças, sendo todos os treinamentos baseados no Método Sinapse 360°. 
                    Preparamos líderes para o futuro do trabalho sendo hard e softskill. Venha saber Mais!
                  </p>
                  <Button 
                    onClick={() => window.open('https://wa.me/5511932143117', '_blank')}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  >
                    Saiba Mais
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="relative hidden lg:block">
                  <img 
                    src="/images/Gemini_Generated_Image_pvaxsjpvaxsjpvax.png" 
                    alt="BM Academy" 
                    className="absolute inset-0 w-full h-full object-cover"
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
              Palestras
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Temas que <span className="text-gradient">Transformam</span>
            </h2>
            <p className="text-lg text-gray-600">
              Palestras impactantes que desafiam paradigmas e inspiram mudanças 
              reais nas organizações.
            </p>
          </div>

          {/* Talks Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Neurodiversidade no Poder',
                subtitle: 'Por que os neurodivergentes estão sendo negligenciados',
                description: 'Uma análise profunda sobre como líderes despreparados estão marginalizando talentos neurodivergentes e o que fazer para reverter esse cenário.',
                duration: '60-90 min',
                audience: 'Liderança e RH',
                color: 'purple',
              },
              {
                title: 'A Crise da Liderança',
                subtitle: 'Por que as novas gerações não querem ser líderes',
                description: 'Descubra as razões profundas pelas quais millennials e gen Z estão rejeitando cargos de liderança e como criar modelos que realmente inspiram.',
                duration: '60-90 min',
                audience: 'Executivos e Gestores',
                color: 'orange',
              },
              {
                title: 'Relações de Poder Saudáveis',
                subtitle: 'Empoderamento no ambiente corporativo',
                description: 'Como construir relações de poder equilibradas que promovam crescimento, autonomia e resultados sem sacrificar o bem-estar das pessoas e a diversidade.',
                duration: '60-90 min',
                audience: 'Todas as hierarquias',
                color: 'teal',
              },
              {
                title: 'Se tornando um(a) Líder Neurodiverso',
                subtitle: 'O Método Sinapse 360° na prática',
                description: 'Uma imersão prática na metodologia que está transformando líderes tradicionais em líderes adaptativos capazes de conduzir equipes diversas.',
                duration: '2 - 4 horas',
                audience: 'Liderança',
                color: 'purple',
              },
              {
                title: 'Inclusão que Gera Resultado',
                subtitle: 'Da teoria à prática estratégica',
                description: 'Como implementar programas de inclusão neurodiversa que realmente funcionam e geram vantagem competitiva mensurável.',
                duration: '60-120 min',
                audience: 'RH e Liderança',
                color: 'orange',
              },
              {
                title: 'Mentoria para Líderes',
                subtitle: 'Programa personalizado de desenvolvimento',
                description: 'Programa de mentoria individual ou em grupo para líderes que querem se desenvolver na condução de equipes diversas e de alta performance.',
                duration: 'Personalizado',
                audience: 'Líderes',
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
                    Solicitar Orçamento
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
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
              Depoimentos
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              O que dizem sobre <span className="text-gradient">meu trabalho</span>
            </h2>
            <p className="text-lg text-gray-600">
              Histórias reais de transformação e impacto nas organizações.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                text: 'A palestra da Bibi foi um divisor de águas para nossa liderança. Ela conseguiu traduzir conceitos complexos de neurodiversidade em ações práticas que nossos gestores puderam aplicar imediatamente.',
                author: 'Ana Paula Mendes',
                role: 'Diretora de RH',
                // ... 
              };
              {
                text: 'Nunca tinha visto uma abordagem tão honesta sobre as falhas da liderança tradicional. Bibi não tem medo de falar o que ninguém quer ouvir, e é exatamente isso que as empresas precisam.',
                author: 'Carlos Eduardo Lima',
                role: 'CEO',
               // ... 
              };
              {
                text: 'O Método Sinapse 360° transformou nossa cultura organizacional. Em 6 meses, reduzimos em 40% o turnover de talentos neurodivergentes e aumentamos a satisfação da equipe.',
                author: 'Mariana Souza',
                role: 'Head de D&I',
               // ... 
              };
              {
                text: 'A mentoria com a Bibi me ajudou a reconhecer meus próprios vieses como líder. Hoje consigo conduzir reuniões de forma mais inclusiva e obter melhores resultados da minha equipe.',
                author: 'Ricardo Almeida',
                role: 'Gerente de Operações',
               // ... 
              };
              {
                text: 'Contratamos a Bibi para falar sobre "A Crise da Liderança" e o impacto foi imediato. Nossos jovens talentos finalmente se sentiram ouvidos e entendidos.',
                author: 'Fernanda Costa',
                role: 'Gerente de Talentos',
               // ... 
              };
              {
                text: 'Bibi tem um dom: ela consegue fazer líderes tradicionais enxergarem a necessidade de mudança sem que se sintam atacados. É uma habilidade rara e valiosa.',
                author: 'João Pedro Silva',
                role: 'Consultor de Gestão',
               // ... 
              };
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
                      <p className="text-xs text-purple-600">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                Contato
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Vamos <span className="text-gradient">conversar?</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Estou pronta para ajudar sua organização a transformar sua liderança 
                e criar ambientes mais inclusivos e produtivos. Entre em contato 
                e vamos discutir como posso contribuir com seu evento ou projeto.
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
                    <p className="text-sm text-gray-600">Redes Sociais</p>
                    <p className="text-lg font-semibold text-gray-900">@bibimartinsoficial</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-4">Siga nas redes:</p>
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
                    Pronto para transformar sua liderança?
                  </h3>
                  <p className="text-white/90 mb-8 leading-relaxed">
                    Não espere mais para criar uma cultura organizacional verdadeiramente 
                    inclusiva. Cada dia de atraso é um talento perdido.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      'Palestras personalizadas para seu evento',
                      'Programas de mentoria para líderes',
                      'Consultoria em Diversidade & Inclusão',
                      'Implementação do Método Sinapse 360°',
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
                    Falar no WhatsApp
                  </Button>

                  <p className="text-center text-white/70 text-sm mt-4">
                    Resposta em até 24 horas
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

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', href: '#home' },
                  { label: 'Sobre', href: '#sobre' },
                  { label: 'Método Sinapse 360°', href: '#metodo' },
                  { label: 'Palestras', href: '#palestras' },
                  { label: 'Depoimentos', href: '#depoimentos' },
                  { label: 'Contato', href: '#contato' },
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
              <h4 className="font-bold text-lg mb-6">Palestras</h4>
              <ul className="space-y-3">
                {[
                  'Neurodiversidade no Poder',
                  'A Crise da Liderança',
                  'Relações de Poder Saudáveis',
                  'Se Tornando um(a) Líder Neurodiverso',
                  'Inclusão que Gera Resultado',
                  'Mentoria para Líderes',
                ].map((talk, index) => (
                  <li key={index}>
                    <span className="text-gray-400">{talk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6">Contato</h4>
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
                  <span className="text-gray-400">@bibimartinsoficial</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Bibi Martins. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Uma iniciativa</span>
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
