import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, Quote, ZoomIn, X, CheckCircle2, 
  ChevronDown, ChevronUp, MessageCircle, Heart, Award, ArrowUpRight
} from 'lucide-react'

interface TestimonialItem {
  id: string
  author: string
  role: string
  company: string
  category: 'DHL' | 'Mills' | 'Rappi' | 'Geral'
  excerpt: string
  fullText?: string
  image?: string
  aspect?: 'horizontal' | 'compact' | 'featured'
  verified?: boolean
  highlight?: string
}

export function TestimonialsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; author: string } | null>(null)
  const [expandedTalita, setExpandedTalita] = useState(false)

  const testimonials: TestimonialItem[] = [
    {
      id: 'francisca',
      author: 'Francisca Nacht',
      role: 'Presidenta do Conselho / Liderança Executiva',
      company: 'Mills',
      category: 'Mills',
      excerpt: 'Foi um prazer enorme! Ouvi depois sobre o seu engajamento em incentivar a volta aos estudos do pessoal. Parabéns, amei ouvir 👏👏👏 Tudo de bom, até a próxima!',
      image: '/depoimentos/francisca-natch-mills.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Incentivo à educação e desenvolvimento de equipes',
    },
    {
      id: 'gusmao',
      author: 'Gusmão',
      role: 'Diretor',
      company: 'Mills',
      category: 'Mills',
      excerpt: 'Certamente neste tempo que ficou conosco vc realizou iniciativas muito ricas para nosso time. Fez mudanças importantes e muito necessárias. Contribuiu de forma consistente para continuidade das melhorias que estamos tendo e ainda ocorrerão.',
      image: '/depoimentos/gusmao-diretor-mills.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Mudanças importantes e iniciativas transformadoras',
    },
    {
      id: 'samira',
      author: 'Samira',
      role: 'Assistente / Qualidade',
      company: 'Rappi',
      category: 'Rappi',
      excerpt: 'Ja terminei a faculdade com chave de ouro, tendo a oportunidade de concluir meu TCC com resultados promissores para a saúde, e também conquistei minha efetivação de maneira muito positiva... O que me passou naquela época serviu para muitas áreas da minha vida, serei eternamente grata 🙏',
      image: '/depoimentos/samira-rappi-completo.png',
      aspect: 'compact',
      verified: true,
      highlight: 'Mentoria para efetivação e crescimento acadêmico',
    },
    {
      id: 'renato',
      author: 'Renato',
      role: 'Engenheiro',
      company: 'Mills',
      category: 'Mills',
      excerpt: 'Uma profissional de extrema competência, que aprendi observando com vc que as vezes temos que esperar mais um "pouquinho", que algumas situações se resolvem. Agreguei mais um pouco de experiência quando falava com você quanto a negociar prazos e demanda.',
      image: '/depoimentos/renato-engenheiro-mills.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Negociação estratégica e maturidade profissional',
    },
    {
      id: 'roberto',
      author: 'Roberto Mariano',
      role: 'Engenheiro',
      company: 'Mills',
      category: 'Mills',
      excerpt: 'Olha foi um prazer enorme trabalhar com vc, sua energia é contagiante, você me trouxe um olhar diferente em diversos aspectos e agregou positivamente.',
      image: '/depoimentos/roberto-mariano-mills.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Energia contagiante e novas perspectivas',
    },
    {
      id: 'samuel',
      author: 'Samuel Grillo',
      role: 'Setor de Inovação',
      company: 'Mills',
      category: 'Mills',
      excerpt: 'Rosi, todo sucesso para você querida!!!! Você é fera demais. Mudou muita a unidade de negócio. Foi muito bom trabalhar contigo. Onde quer que vá sei que vai fazer diferença!',
      image: '/depoimentos/samuel-grillo-mills.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Transformação expressiva da unidade de negócio',
    },
    {
      id: 'ludmila',
      author: 'Ludmila',
      role: 'Setor de Inovação',
      company: 'Mills',
      category: 'Mills',
      excerpt: 'Sua entrega era vista, super explícita dentro da Mills. Mas voa ainda mais alto, você é super competente e foi de mais poder ter trabalhado com você! Conte comigo!',
      image: '/depoimentos/ludmila-inovacao-mills.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Entrega nítida e reconhecida pela liderança',
    },
    {
      id: 'ana-clara',
      author: 'Ana Clara',
      role: 'Assistente',
      company: 'Rappi',
      category: 'Rappi',
      excerpt: 'Oie Rose, verdade, verdade nunca vou esquecer, e fico aqui de longe torcendo pelo seu crescimento também.',
      image: '/depoimentos/ana-clara-rappi.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Marca pessoal e impacto duradouro',
    },
    {
      id: 'rappi-colab',
      author: 'Colaborador',
      role: 'Equipe de Operações',
      company: 'Rappi',
      category: 'Rappi',
      excerpt: 'Lembrei das nossas conversas na época de Rappi, e ver que seguir todos os conselhos que você me deu aquela época me trouxe onde estou hoje, eu só tenho a agradecer a você pela disponibilidade e a paciência de ensinar a ser um colaborador muito f*da!',
      image: '/depoimentos/rappi.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Conselhos práticos que alavancam carreiras',
    },
    {
      id: 'maria-lima',
      author: 'Maria Lima',
      role: 'Profissional / Candidata',
      company: 'DHL',
      category: 'DHL',
      excerpt: 'Obrigada de coração pelo carinho e estou muito feliz pela trajetória brilhante que você tem trilhado.',
      image: '/depoimentos/maria-lima-dhl.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Reconhecimento caloroso e humano',
    },
    {
      id: 'larissa',
      author: 'Larissa Oliveira de Otero',
      role: 'M.e. Administração',
      company: 'Mills',
      category: 'Mills',
      excerpt: 'Rosi... Sem palavras pela ajuda!!! 🙏👊',
      image: '/depoimentos/linkedin-help.jpg',
      aspect: 'compact',
      verified: true,
      highlight: 'Apoio estratégico e mentoria',
    },
  ]

  const filtered = selectedCategory === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === selectedCategory)

  return (
    <section id="depoimentos" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-purple-100/40 via-orange-100/30 to-purple-100/40 blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 px-3 py-1 font-semibold">
            <Star className="w-3.5 h-3.5 mr-1 fill-orange-500 text-orange-500" />
            Depoimentos & Reconhecimento Real
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            O Impacto da Transformação <span className="text-gradient">na Prática</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Mensagens espontâneas, feedbacks e histórias reais de executivos, líderes e liderados que vivenciaram a liderança e a metodologia de Bibi Martins em gigantes como <strong>DHL</strong>, <strong>Mills</strong> e <strong>Rappi</strong>.
          </p>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'Todos os Depoimentos' },
              { id: 'DHL', label: 'DHL Supply Chain' },
              { id: 'Mills', label: 'Mills Estruturas' },
              { id: 'Rappi', label: 'Rappi Brasil' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200 scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. DEPOIMENTO EM EXTENSÃO HORIZONTAL (DOUGLAS OLIVEIRA - DHL) */}
        {(selectedCategory === 'all' || selectedCategory === 'DHL') && (
          <div className="mb-14">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden border border-purple-500/20">
              {/* Background badge watermark */}
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                <Quote className="w-96 h-96 text-white" />
              </div>

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left: Text & Content (Extensão Horizontal) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-orange-400" /> Destaque de Transformação
                    </span>
                    <span className="bg-white/10 text-white/90 text-xs px-3 py-1 rounded-full font-medium">
                      DHL Supply Chain
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mensagem Real Verificada
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    "Você foi a primeira gestora que se importou com o meu jeito de ser..."
                  </h3>

                  <div className="relative pl-6 border-l-2 border-orange-400/60 text-purple-100/90 text-base sm:text-lg leading-relaxed italic space-y-3">
                    <p>
                      "Eu quero agradecer muito pelas nossas conversas difíceis, sei que foram para o meu crescimento... <strong>você foi a primeira gestora que eu tive que se importou com o meu jeito de ser</strong> e graças a isso hoje posso falar que tenho uma convivência melhor em casa, melhorou muito, estou me abrindo bem mais."
                    </p>
                    <p>
                      "Estou mudando minhas atitudes dentro da empresa para um melhor ambiente e relacionamento com meus pares e superiores... Pode contar comigo para tudo, estou à disposição para ajudar você e ao time a qualquer momento... quem sabe no futuro eu muito mais maduro possa refazer essa dupla para <strong>ambos crescermos, um puxando o outro para o topo da cadeia profissional.</strong>"
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-900/50">
                        DO
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                          Douglas Oliveira
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </h4>
                        <p className="text-purple-200 text-sm">
                          Assistente de Operações & Monitoramento • <span className="text-orange-300">DHL</span>
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => setLightboxImage({
                        src: '/depoimentos/douglas-oliveira-completo.png',
                        title: 'Depoimento Completo no WhatsApp - Douglas Oliveira (DHL)',
                        author: 'Douglas Oliveira - DHL Supply Chain'
                      })}
                      className="bg-white/15 hover:bg-white/25 text-white border border-white/20 gap-2 shrink-0 backdrop-blur-sm self-start sm:self-auto"
                    >
                      <ZoomIn className="w-4 h-4 text-orange-300" />
                      Ver Print Original Completo
                    </Button>
                  </div>
                </div>

                {/* Right: Authentic WhatsApp Image Card */}
                <div className="lg:col-span-5 flex justify-center">
                  <div 
                    onClick={() => setLightboxImage({
                      src: '/depoimentos/douglas-oliveira-completo.png',
                      title: 'Depoimento Completo no WhatsApp - Douglas Oliveira (DHL)',
                      author: 'Douglas Oliveira - DHL Supply Chain'
                    })}
                    className="group relative cursor-pointer rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/40 hover:border-orange-400/80 transition-all duration-300 max-h-[500px] w-full max-w-sm"
                  >
                    <img 
                      src="/depoimentos/douglas-oliveira-completo.png" 
                      alt="Depoimento Douglas Oliveira WhatsApp" 
                      className="w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1.5 text-orange-300 font-semibold">
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Original
                        </span>
                        <span className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5" /> Clique para ampliar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DEPOIMENTO EM EXTENSÃO HORIZONTAL (TALITA LEANDRO - MILLS) */}
        {(selectedCategory === 'all' || selectedCategory === 'Mills') && (
          <div className="mb-14">
            <Card className="border border-purple-100 shadow-xl bg-gradient-to-br from-purple-50/60 via-white to-orange-50/40 rounded-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
                        História de Mentoria & Sucesso
                      </Badge>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Mills Estruturas de Engenharia
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                      "A Rosi foi a líder que me enxergou e me deu a oportunidade de evoluir para a vida toda."
                    </h3>

                    <div className="text-gray-700 text-base sm:text-lg leading-relaxed space-y-3">
                      <p>
                        "Trabalhei em uma Empresa por 9 anos e tive 2 promoções, onde a 2ª foi a Rosi que me enxergou e me deu a oportunidade. Quando ela chegou e foi conhecer o setor, tratou logo de conhecer cada um de seus líderes. Eu era rebelde devido a uma gestão anterior sem liderança..."
                      </p>
                      
                      {expandedTalita && (
                        <div className="space-y-3 pt-2 text-gray-700 animate-fadeIn">
                          <p>
                            "Com o tempo a Rosi foi me direcionando e sinalizando coisas que eu não enxergava e nunca ninguém havia me sinalizado. Foram feedbacks 180 e 360, conversas de líder com liderado e ensinamentos que perpetuam até os dias atuais. <strong>Aprendi a ouvir, aprendi a me posicionar e o mais importante, aprendi que Eu seria o espelho para toda a melhoria que eu buscava.</strong>"
                          </p>
                          <p>
                            "A liderança da Rosi me ensinou, me amadureceu e me direcionou como nenhum gestor havia feito, pois criticar e só querer resultados não é postura de quem lidera lado a lado. Rosi, obrigada pelo que representou na minha vida profissional e pessoal, pois as mudanças e a evolução que tive, coloquei em prática, tomei pra mim e levei para a minha Vida além dos portões da Empresa."
                          </p>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="ghost" 
                      onClick={() => setExpandedTalita(!expandedTalita)}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-auto font-semibold gap-1 text-sm"
                    >
                      {expandedTalita ? (
                        <>Ver menos <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Ler depoimento completo de Talita <ChevronDown className="w-4 h-4" /></>
                      )}
                    </Button>
                  </div>

                  {/* Author Card Info */}
                  <div className="lg:w-80 w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-md shrink-0 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-orange-500 text-white flex items-center justify-center font-bold text-lg">
                        TL
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">Talita S. Leandro</h4>
                        <p className="text-xs text-gray-500">Ex-Liderada & Mentorada</p>
                        <p className="text-xs text-purple-600 font-semibold">Mills Estruturas</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1.5 border-t border-gray-100 pt-3">
                      <div className="flex justify-between">
                        <span>Tempo de Empresa:</span>
                        <span className="font-semibold text-gray-700">9 Anos</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Local:</span>
                        <span className="font-semibold text-gray-700">Osasco/SP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Metodologia:</span>
                        <span className="font-semibold text-purple-700">Feedback 360°</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 3. GRADE DE PROVAS SOCIAIS E PRINTS REAIS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card 
              key={item.id} 
              className="border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group bg-white"
            >
              <CardContent className="p-6 flex flex-col justify-between flex-1">
                <div>
                  {/* Top Bar with Badge and Company */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/50">
                      {item.company}
                    </span>
                    {item.verified && (
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                      </span>
                    )}
                  </div>

                  {/* Highlight pill */}
                  {item.highlight && (
                    <p className="text-xs font-semibold text-orange-600 mb-2">
                      ★ {item.highlight}
                    </p>
                  )}

                  {/* Quote text */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                    "{item.excerpt}"
                  </p>
                </div>

                {/* Image Proof Preview (if exists) */}
                {item.image && (
                  <div className="mt-2 mb-4">
                    <div 
                      onClick={() => setLightboxImage({
                        src: item.image!,
                        title: `Depoimento de ${item.author} (${item.company})`,
                        author: item.author
                      })}
                      className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group/img"
                    >
                      <img 
                        src={item.image} 
                        alt={`Print Depoimento ${item.author}`} 
                        className="w-full h-32 object-cover object-top group-hover/img:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[1px]">
                        <ZoomIn className="w-4 h-4" /> Ver print original
                      </div>
                    </div>
                  </div>
                )}

                {/* Author Info */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-orange-400 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {item.author.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{item.author}</h4>
                      <p className="text-xs text-gray-500">{item.role}</p>
                    </div>
                  </div>

                  {item.image && (
                    <button 
                      onClick={() => setLightboxImage({
                        src: item.image!,
                        title: `Depoimento de ${item.author} (${item.company})`,
                        author: item.author
                      })}
                      className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                      title="Ver print ampliado"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA for Testimonials */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-50 via-white to-orange-50 border border-purple-100 p-8 rounded-3xl max-w-3xl mx-auto shadow-sm">
          <Heart className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Quer transformar a liderança e a cultura da sua empresa?
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto">
            Leve palestras, workshops e a metodologia Sinapse 360° para desenvolver líderes conscientes e equipes de alta performance.
          </p>
          <a
            href="https://wa.me/5511999999999?text=Ol%C3%A1%20Bibi,%20gostaria%20de%20conversar%20sobre%20palestras%20e%20treinamentos%20para%20minha%20empresa!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-purple-200 transition-all hover:scale-105"
          >
            Falar com Bibi Martins
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* LIGHTBOX MODAL PARA VER O PRINT ORIGINAL EM ALTA RESOLUÇÃO */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-950/80 text-white">
              <div>
                <h4 className="font-semibold text-base text-white">{lightboxImage.title}</h4>
                <p className="text-xs text-gray-400">Print autêntico de mensagem original</p>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] flex items-center justify-center bg-black/60">
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.title} 
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
