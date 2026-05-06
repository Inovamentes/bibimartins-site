import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, PlayCircle, FileText, CheckCircle, Loader2 } from 'lucide-react'

interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  attachmentUrl: string;
}

interface Course {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function CoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/client/courses/${id}`).then(res => {
      setCourse(res.data)
      if (res.data.lessons && res.data.lessons.length > 0) {
        setSelectedLesson(res.data.lessons[0])
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      navigate('/cliente')
    })
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!course) return null

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row text-gray-100">
      {/* Sidebar - Lesson List */}
      <aside className="w-full md:w-80 bg-gray-900 border-r border-gray-800 flex flex-col md:h-screen sticky top-0 overflow-y-auto z-10">
        <div className="p-6 border-b border-gray-800">
          <Link to="/cliente" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
          <h1 className="font-bold text-lg leading-tight">{course.title}</h1>
        </div>

        <div className="flex-1">
          {course.lessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={`w-full p-4 flex items-start gap-3 border-b border-gray-800/50 transition-all ${
                selectedLesson?.id === lesson.id 
                  ? 'bg-orange-500/10 border-l-4 border-l-orange-500' 
                  : 'hover:bg-gray-800/50 border-l-4 border-l-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                selectedLesson?.id === lesson.id ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-500'
              }`}>
                {idx + 1}
              </div>
              <div className="text-left">
                <p className={`text-sm font-medium ${selectedLesson?.id === lesson.id ? 'text-white' : 'text-gray-400'}`}>
                  {lesson.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                   <PlayCircle className="w-3 h-3 text-gray-600" />
                   <span className="text-[10px] text-gray-600 uppercase font-bold">Vídeo Aula</span>
                </div>
              </div>
            </button>
          ))}
          {course.lessons.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>Nenhuma aula disponível ainda.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Area - Video Player */}
      <main className="flex-1 flex flex-col min-h-screen">
        {selectedLesson ? (
          <>
            {/* Player Container */}
            <div className="aspect-video bg-black w-full shadow-2xl relative group">
              {selectedLesson.videoUrl ? (
                /* Simple iframe for YT/Vimeo/Panda */
                <iframe
                  className="w-full h-full"
                  src={selectedLesson.videoUrl.includes('youtube.com') 
                    ? selectedLesson.videoUrl.replace('watch?v=', 'embed/') 
                    : selectedLesson.videoUrl}
                  title={selectedLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-900">
                  <PlayCircle className="w-16 h-16 mb-4 opacity-20" />
                  <p>Vídeo não disponível para esta aula.</p>
                </div>
              )}
            </div>

            {/* Lesson Details */}
            <div className="p-8 max-w-4xl mx-auto w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedLesson.title}</h2>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Módulo Atual</Badge>
                    <span className="text-sm text-gray-500">Plataforma Bibi Martins</span>
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 px-6 shadow-lg shadow-green-900/20">
                  <CheckCircle className="w-5 h-5 mr-2" /> Concluir Aula
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-lg font-bold mb-4">Sobre esta aula</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {selectedLesson.description || 'Nenhuma descrição detalhada disponível para esta aula.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedLesson.attachmentUrl && (
                    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                      <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-4">Materiais</h3>
                      <a 
                        href={selectedLesson.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Material de Apoio</p>
                          <p className="text-[10px] text-gray-500">Download</p>
                        </div>
                      </a>
                    </div>
                  )}

                  <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20">
                    <h3 className="text-sm font-bold text-orange-400 mb-2">Dica da Bibi</h3>
                    <p className="text-xs text-orange-300/80 leading-relaxed">
                      Assista até o final para fixar os conceitos do Método Sinapse 360°.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <PlayCircle className="w-16 h-16 mb-4 opacity-10" />
            <p>Selecione uma aula para começar.</p>
          </div>
        )}
      </main>
    </div>
  )
}
