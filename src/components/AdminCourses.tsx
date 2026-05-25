import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Video, 
  Link as LinkIcon, 
  Loader2, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  BookOpen, 
  GraduationCap, 
  BarChart2 
} from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  previewVideoUrl: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  attachmentUrl: string;
  orderIndex: number;
}

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null)
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null)

  // Search queries
  const [searchCourse, setSearchCourse] = useState('')
  const [searchLesson, setSearchLesson] = useState('')

  // Lessons count mapping
  const [lessonsCountMap, setLessonsCountMap] = useState<Record<number, number>>({})

  const fetchCourses = async () => {
    try {
      const res = await api.get('/api/admin/courses')
      const coursesData = res.data as Course[]
      setCourses(coursesData)

      // Fetch lessons count for all courses in parallel
      const counts: Record<number, number> = {}
      await Promise.all(
        coursesData.map(async (c) => {
          try {
            const lessonsRes = await api.get(`/api/admin/courses/${c.id}/lessons`)
            counts[c.id] = (lessonsRes.data as Lesson[]).length
          } catch (e) {
            counts[c.id] = 0
          }
        })
      )
      setLessonsCountMap(counts)
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar cursos")
    } finally {
      setLoading(false)
    }
  }

  const fetchLessons = async (courseId: number) => {
    setLoadingLessons(true)
    try {
      const res = await api.get(`/api/admin/courses/${courseId}/lessons`)
      // Ensure sorted by orderIndex
      const sortedLessons = (res.data as Lesson[]).sort((a, b) => a.orderIndex - b.orderIndex)
      setLessons(sortedLessons)
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar aulas")
    } finally {
      setLoadingLessons(false)
    }
  }

  useEffect(() => { 
    fetchCourses() 
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse.id)
    }
  }, [selectedCourse])

  const handleSaveCourse = async () => {
    try {
      if (editingCourse?.id) {
        await api.put(`/api/admin/courses/${editingCourse.id}`, editingCourse)
      } else {
        await api.post('/api/admin/courses', editingCourse)
      }
      setEditingCourse(null)
      fetchCourses()
    } catch (err) {
      alert("Erro ao salvar curso")
    }
  }

  const handleDeleteCourse = async (id: number) => {
    if(!confirm("Tem certeza que deseja apagar este curso e todas as suas aulas?")) return;
    try {
      await api.delete(`/api/admin/courses/${id}`)
      fetchCourses()
      if (selectedCourse?.id === id) setSelectedCourse(null)
    } catch (err) {
      alert("Erro ao deletar curso")
    }
  }

  const handleSaveLesson = async () => {
    if (!selectedCourse) return
    try {
      if (editingLesson?.id) {
        await api.put(`/api/admin/courses/lessons/${editingLesson.id}`, editingLesson)
      } else {
        await api.post(`/api/admin/courses/${selectedCourse.id}/lessons`, editingLesson)
      }
      setEditingLesson(null)
      fetchLessons(selectedCourse.id)
    } catch (err) {
      alert("Erro ao salvar aula")
    }
  }

  const handleDeleteLesson = async (lessonId: number) => {
    if(!confirm("Tem certeza que deseja apagar esta aula?")) return;
    try {
      await api.delete(`/api/admin/courses/lessons/${lessonId}`)
      if (selectedCourse) fetchLessons(selectedCourse.id)
    } catch (err) {
      alert("Erro ao deletar aula")
    }
  }

  // Dynamic lesson reordering with optimistic updates
  const handleMoveLesson = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    const currentLesson = lessons[index];
    const targetLesson = lessons[targetIndex];

    // Swap orderIndex
    const newCurrentOrder = targetLesson.orderIndex;
    const newTargetOrder = currentLesson.orderIndex;

    // Optimistically update local state
    const updatedLessons = [...lessons];
    updatedLessons[index] = { ...currentLesson, orderIndex: newCurrentOrder };
    updatedLessons[targetIndex] = { ...targetLesson, orderIndex: newTargetOrder };
    
    // Sort them
    updatedLessons.sort((a, b) => a.orderIndex - b.orderIndex);
    setLessons(updatedLessons);

    try {
      // Send updates to backend
      await Promise.all([
        api.put(`/api/admin/courses/lessons/${currentLesson.id}`, {
          ...currentLesson,
          orderIndex: newCurrentOrder
        }),
        api.put(`/api/admin/courses/lessons/${targetLesson.id}`, {
          ...targetLesson,
          orderIndex: newTargetOrder
        })
      ]);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar nova ordenação. Recarregando as aulas...");
      if (selectedCourse) fetchLessons(selectedCourse.id);
    }
  }

  // Stats calculation
  const totalCourses = courses.length
  const totalLessons = Object.values(lessonsCountMap).reduce((a, b) => a + b, 0)
  const averageLessons = totalCourses ? (totalLessons / totalCourses).toFixed(1) : '0'

  // Filters
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchCourse.toLowerCase()) || 
    c.description.toLowerCase().includes(searchCourse.toLowerCase())
  )

  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(searchLesson.toLowerCase()) || 
    l.description.toLowerCase().includes(searchLesson.toLowerCase())
  )

  if (selectedCourse) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setSelectedCourse(null)} className="h-10 rounded-xl hover:bg-gray-100 border-gray-200">
              ← Voltar
            </Button>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">Módulo: {selectedCourse.title}</h2>
              <p className="text-xs text-gray-500">Gerencie as aulas deste módulo</p>
            </div>
          </div>

          <Button 
            onClick={() => setEditingLesson({ title: '', description: '', videoUrl: '', attachmentUrl: '', orderIndex: lessons.length })} 
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 px-5 shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Aula
          </Button>
        </div>

        {/* Filter & Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input 
            className="pl-9 h-10 rounded-xl border-gray-200 focus-visible:ring-purple-500 bg-white" 
            placeholder="Pesquisar aulas..." 
            value={searchLesson}
            onChange={e => setSearchLesson(e.target.value)}
          />
        </div>

        {/* Lessons List */}
        {loadingLessons ? (
          <div className="flex justify-center p-16">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : filteredLessons.length === 0 ? (
          <Card className="border-dashed border-2 shadow-none bg-gray-50/50 rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center p-16 text-gray-400">
              <Video className="w-16 h-16 mb-4 opacity-30 text-purple-600" />
              <p className="text-base font-semibold text-gray-600">Nenhuma aula encontrada.</p>
              <p className="text-sm text-gray-400">Adicione uma aula ou ajuste sua pesquisa.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredLessons.map((l, index) => (
              <Card key={l.id} className="shadow-sm border border-gray-100 bg-white hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-extrabold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 truncate">{l.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{l.description || 'Sem descrição'}</p>
                    </div>
                  </div>

                  {/* Ordering & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Sort buttons */}
                    <div className="flex gap-1 border-r border-gray-100 pr-2 mr-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => handleMoveLesson(index, 'up')}
                        className="h-8 w-8 text-gray-400 hover:text-purple-600 disabled:opacity-30 rounded-lg"
                        title="Mover para Cima"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={index === filteredLessons.length - 1}
                        onClick={() => handleMoveLesson(index, 'down')}
                        className="h-8 w-8 text-gray-400 hover:text-purple-600 disabled:opacity-30 rounded-lg"
                        title="Mover para Baixo"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => setEditingLesson(l)} className="h-9 w-9 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLesson(l.id)} className="h-9 w-9 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Lesson Editor Modal */}
        {editingLesson && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-0 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              <CardContent className="p-6 space-y-4 overflow-y-auto flex-1">
                <h2 className="text-xl font-black text-gray-950">{editingLesson.id ? 'Editar Aula' : 'Nova Aula'}</h2>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Título da Aula</Label>
                  <Input 
                    className="h-11 rounded-xl focus-visible:ring-purple-500" 
                    value={editingLesson.title || ''} 
                    onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} 
                    placeholder="Ex: Aula 1 - Introdução" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Descrição</Label>
                  <Input 
                    className="h-11 rounded-xl focus-visible:ring-purple-500" 
                    value={editingLesson.description || ''} 
                    onChange={e => setEditingLesson({...editingLesson, description: e.target.value})} 
                    placeholder="Do que se trata esta aula?" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Link ou ID do Vídeo (YouTube, Vimeo, Panda, MP4)</Label>
                  <div className="relative">
                    <Video className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                      className="pl-9 h-11 rounded-xl focus-visible:ring-purple-500" 
                      value={editingLesson.videoUrl || ''} 
                      onChange={e => setEditingLesson({...editingLesson, videoUrl: e.target.value})} 
                      placeholder="Ex: youtube.com/watch?v=..., vimeo_id, panda_id" 
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    Suporta URLs de compartilhamento ou IDs de vídeo.
                  </p>
                  {editingLesson.videoUrl && (
                    <div className="mt-2 aspect-video bg-black rounded-2xl overflow-hidden border border-gray-150 shadow-inner">
                      <VideoPlayer videoUrl={editingLesson.videoUrl} title="Live Preview da Aula" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Material de Apoio (Link PDF/Drive)</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                      className="pl-9 h-11 rounded-xl focus-visible:ring-purple-500" 
                      value={editingLesson.attachmentUrl || ''} 
                      onChange={e => setEditingLesson({...editingLesson, attachmentUrl: e.target.value})} 
                      placeholder="https://drive.google.com/..." 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Ordem (Índice numérico)</Label>
                  <Input 
                    type="number" 
                    className="h-11 rounded-xl focus-visible:ring-purple-500" 
                    value={editingLesson.orderIndex ?? 0} 
                    onChange={e => setEditingLesson({...editingLesson, orderIndex: parseInt(e.target.value) || 0})} 
                  />
                </div>
              </CardContent>

              <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-100">
                <Button variant="outline" onClick={() => setEditingLesson(null)} className="h-11 rounded-xl px-5 border-gray-200">
                  Cancelar
                </Button>
                <Button onClick={handleSaveLesson} className="bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl px-5">
                  Salvar Aula
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg shadow-purple-500/10 rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-100 uppercase tracking-wider">Módulos Ativos</p>
              <h3 className="text-3xl font-black mt-1">{totalCourses}</h3>
            </div>
            <div className="bg-white/10 p-3 rounded-xl">
              <GraduationCap className="w-8 h-8 text-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/10 rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Aulas Cadastradas</p>
              <h3 className="text-3xl font-black mt-1">{totalLessons}</h3>
            </div>
            <div className="bg-white/10 p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/10 rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Aulas por Módulo</p>
              <h3 className="text-3xl font-black mt-1">{averageLessons}</h3>
            </div>
            <div className="bg-white/10 p-3 rounded-xl">
              <BarChart2 className="w-8 h-8 text-emerald-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header & New Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-950 tracking-tight">Gerenciar Cursos & Módulos</h2>
          <p className="text-sm text-gray-500">Crie os módulos que ficarão disponíveis na vitrine do cliente.</p>
        </div>
        <Button 
          onClick={() => setEditingCourse({ title: '', description: '', thumbnailUrl: '', previewVideoUrl: '' })} 
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-purple-600/20 shrink-0 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Curso
        </Button>
      </div>

      {/* Filter bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        <Input 
          className="pl-9 h-11 rounded-xl border-gray-200 focus-visible:ring-purple-500 bg-white" 
          placeholder="Pesquisar cursos..." 
          value={searchCourse}
          onChange={e => setSearchCourse(e.target.value)}
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none bg-gray-50/50 rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center p-16 text-gray-400">
            <Video className="w-16 h-16 mb-4 opacity-30 text-purple-600" />
            <p className="text-base font-semibold text-gray-600">Nenhum curso encontrado.</p>
            <p className="text-sm text-gray-400">Crie um curso ou mude seu termo de busca.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(c => (
            <Card 
              key={c.id} 
              className="overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group rounded-3xl flex flex-col bg-white" 
              onClick={() => setSelectedCourse(c)}
            >
              {c.thumbnailUrl ? (
                <div 
                  className="h-44 bg-cover bg-center relative" 
                  style={{backgroundImage: `url(${c.thumbnailUrl})`}}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
              ) : (
                <div className="h-44 bg-purple-50 flex items-center justify-center text-purple-300">
                  <Video className="w-12 h-12" />
                </div>
              )}
              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-extrabold uppercase px-2 py-1 rounded-md tracking-wider">
                      {lessonsCountMap[c.id] ?? 0} { (lessonsCountMap[c.id] === 1) ? 'Aula' : 'Aulas' }
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{c.description}</p>
                </div>
                <div className="flex justify-end gap-2 border-t border-gray-50 pt-3 mt-auto" onClick={e => e.stopPropagation()}>
                   <Button variant="ghost" size="sm" onClick={() => setEditingCourse(c)} className="text-blue-600 hover:bg-blue-50 rounded-lg">
                     <Edit className="w-4 h-4 mr-1" /> Editar
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(c.id)} className="text-red-600 hover:bg-red-50 rounded-lg">
                     <Trash2 className="w-4 h-4 mr-1" /> Apagar
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Editor Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-0 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <CardContent className="p-6 space-y-4 overflow-y-auto flex-1">
              <h2 className="text-xl font-black text-gray-950">{editingCourse.id ? 'Editar Curso' : 'Novo Curso'}</h2>
              
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Título do Curso/Módulo</Label>
                <Input 
                  className="h-11 rounded-xl focus-visible:ring-purple-500" 
                  value={editingCourse.title || ''} 
                  onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} 
                  placeholder="Ex: Módulo 1 - Mentalidade" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Descrição</Label>
                <Input 
                  className="h-11 rounded-xl focus-visible:ring-purple-500" 
                  value={editingCourse.description || ''} 
                  onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} 
                  placeholder="Breve resumo sobre o curso..." 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Link da Imagem de Capa (Opcional)</Label>
                <Input 
                  className="h-11 rounded-xl focus-visible:ring-purple-500" 
                  value={editingCourse.thumbnailUrl || ''} 
                  onChange={e => setEditingCourse({...editingCourse, thumbnailUrl: e.target.value})} 
                  placeholder="https://exemplo.com/imagem.jpg" 
                />
                {editingCourse.thumbnailUrl && (
                  <div className="mt-2 h-28 w-full rounded-2xl overflow-hidden border border-gray-150 bg-gray-50 flex items-center justify-center shadow-inner">
                    <img 
                      src={editingCourse.thumbnailUrl} 
                      alt="Preview Capa" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400/f3f4f6/6b7280?text=Imagem+Invalida';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Vídeo de Prévia (Link do YouTube/Vimeo/Panda/MP4)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    className="pl-9 h-11 rounded-xl focus-visible:ring-purple-500" 
                    value={editingCourse.previewVideoUrl || ''} 
                    onChange={e => setEditingCourse({...editingCourse, previewVideoUrl: e.target.value})} 
                    placeholder="https://youtube.com/watch?v=..." 
                  />
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Este vídeo será exibido na prévia gratuita do catálogo de cursos.
                </p>
                {editingCourse.previewVideoUrl && (
                  <div className="mt-2 aspect-video bg-black rounded-2xl overflow-hidden border border-gray-150 shadow-inner">
                    <VideoPlayer videoUrl={editingCourse.previewVideoUrl} title="Live Preview do Curso" />
                  </div>
                )}
              </div>
            </CardContent>

            <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setEditingCourse(null)} className="h-11 rounded-xl px-5 border-gray-200">
                Cancelar
              </Button>
              <Button onClick={handleSaveCourse} className="bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl px-5">
                Salvar Curso
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
