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

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null)
  
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

  useEffect(() => { fetchCourses() }, [])

  const handleSaveCourse = async () => {
    try {
      if (editingCourse?.id) {
        // await api.put(`/api/admin/courses/${editingCourse.id}`, editingCourse) // Backend doesn't have PUT yet, let's just use POST
        await api.post('/api/admin/courses', editingCourse)
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
    } catch (err) {
      alert("Erro ao deletar curso")
    }
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
            <Card key={c.id} className="overflow-hidden shadow-lg border-0">
              {c.thumbnailUrl ? (
                <div className="h-32 bg-cover bg-center" style={{backgroundImage: `url(${c.thumbnailUrl})`}} />
              ) : (
                <div className="h-32 bg-purple-100 flex items-center justify-center text-purple-300">
                  <Video className="w-8 h-8" />
                </div>
              )}
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{c.description}</p>
                <div className="flex justify-end gap-2">
                   <Button variant="ghost" size="sm" onClick={() => setEditingCourse(c)} className="text-blue-600">
                     <Edit className="w-4 h-4 mr-1" /> Editar
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(c.id)} className="text-red-600">
                     <Trash2 className="w-4 h-4 mr-1" /> Apagar
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Modal */}
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
