import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Video, Link as LinkIcon, Loader2 } from 'lucide-react'

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

  const fetchCourses = async () => {
    try {
      const res = await api.get('/api/admin/courses')
      setCourses(res.data)
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
      setLessons(res.data)
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar aulas")
    } finally {
      setLoadingLessons(false)
    }
  }

  useEffect(() => { fetchCourses() }, [])

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

  if (selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="text-gray-500">
            ← Voltar para Cursos
          </Button>
          <h2 className="text-xl font-bold text-gray-900">Aulas: {selectedCourse.title}</h2>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Gerencie as aulas deste módulo</p>
          <Button onClick={() => setEditingLesson({ title: '', description: '', videoUrl: '', attachmentUrl: '', orderIndex: lessons.length })} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" /> Nova Aula
          </Button>
        </div>

        {loadingLessons ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
        ) : lessons.length === 0 ? (
          <Card className="border-dashed shadow-none bg-gray-50">
            <CardContent className="flex flex-col items-center justify-center p-12 text-gray-400">
              <Video className="w-12 h-12 mb-4 opacity-50" />
              <p>Nenhuma aula cadastrada para este curso.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {lessons.map(l => (
              <Card key={l.id} className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                      {l.orderIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{l.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{l.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingLesson(l)} className="text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(l.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Lesson Modal */}
        {editingLesson && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold mb-4">{editingLesson.id ? 'Editar Aula' : 'Nova Aula'}</h2>
                
                <div className="space-y-2">
                  <Label>Título da Aula</Label>
                  <Input value={editingLesson.title || ''} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} placeholder="Ex: Aula 1 - Introdução" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input value={editingLesson.description || ''} onChange={e => setEditingLesson({...editingLesson, description: e.target.value})} placeholder="Do que se trata esta aula?" />
                </div>
                <div className="space-y-2">
                  <Label>ID do Vídeo (Panda/Vimeo/Youtube)</Label>
                  <div className="relative">
                    <Video className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input className="pl-9" value={editingLesson.videoUrl || ''} onChange={e => setEditingLesson({...editingLesson, videoUrl: e.target.value})} placeholder="Ex: panda_id ou youtube_url" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Material de Apoio (Link PDF/Drive)</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input className="pl-9" value={editingLesson.attachmentUrl || ''} onChange={e => setEditingLesson({...editingLesson, attachmentUrl: e.target.value})} placeholder="https://drive.google.com/..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ordem (0 para primeira)</Label>
                  <Input type="number" value={editingLesson.orderIndex ?? 0} onChange={e => setEditingLesson({...editingLesson, orderIndex: parseInt(e.target.value)})} />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setEditingLesson(null)}>Cancelar</Button>
                  <Button onClick={handleSaveLesson} className="bg-purple-600 hover:bg-purple-700">Salvar Aula</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gerenciar Cursos e Módulos</h2>
          <p className="text-sm text-gray-500">Crie os módulos que ficarão disponíveis na vitrine (Cadeado)</p>
        </div>
        <Button onClick={() => setEditingCourse({ title: '', description: '', thumbnailUrl: '', previewVideoUrl: '' })} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Curso
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
      ) : courses.length === 0 ? (
        <Card className="border-dashed shadow-none bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-gray-400">
            <Video className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum curso cadastrado ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <Card key={c.id} className="overflow-hidden shadow-lg border-0 cursor-pointer group hover:ring-2 hover:ring-purple-500 transition-all" onClick={() => setSelectedCourse(c)}>
              {c.thumbnailUrl ? (
                <div className="h-32 bg-cover bg-center" style={{backgroundImage: `url(${c.thumbnailUrl})`}} />
              ) : (
                <div className="h-32 bg-purple-100 flex items-center justify-center text-purple-300">
                  <Video className="w-8 h-8" />
                </div>
              )}
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-1 group-hover:text-purple-600 transition-colors">{c.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{c.description}</p>
                <div className="flex justify-end gap-2">
                   <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditingCourse(c); }} className="text-blue-600">
                     <Edit className="w-4 h-4 mr-1" /> Editar
                   </Button>
                   <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteCourse(c.id); }} className="text-red-600">
                     <Trash2 className="w-4 h-4 mr-1" /> Apagar
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">{editingCourse.id ? 'Editar Curso' : 'Novo Curso'}</h2>
              
              <div className="space-y-2">
                <Label>Título do Curso/Módulo</Label>
                <Input value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} placeholder="Ex: Módulo 1 - Mentalidade" />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input value={editingCourse.description || ''} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} placeholder="Breve resumo sobre o curso..." />
              </div>
              <div className="space-y-2">
                <Label>Link da Imagem de Capa (Opcional)</Label>
                <Input value={editingCourse.thumbnailUrl || ''} onChange={e => setEditingCourse({...editingCourse, thumbnailUrl: e.target.value})} placeholder="https://exemplo.com/imagem.jpg" />
              </div>
              <div className="space-y-2">
                <Label>Vídeo de Prévia (Link Não-Listado do YouTube)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input className="pl-9" value={editingCourse.previewVideoUrl || ''} onChange={e => setEditingCourse({...editingCourse, previewVideoUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                </div>
                <p className="text-xs text-gray-500">Este é o vídeo que o cliente poderá assistir antes de comprar, ao clicar no botão "Prévia".</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditingCourse(null)}>Cancelar</Button>
                <Button onClick={handleSaveCourse} className="bg-purple-600 hover:bg-purple-700">Salvar Curso</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
