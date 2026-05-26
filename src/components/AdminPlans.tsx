import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, CreditCard, Loader2, CheckCircle2 } from 'lucide-react'

interface Course {
  id: number;
  title: string;
}

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  courses: Course[];
}

export function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null)

  const fetchData = async () => {
    try {
      const [plansRes, coursesRes] = await Promise.all([
        api.get('/api/admin/courses/plans'),
        api.get('/api/admin/courses')
      ])
      setPlans(plansRes.data)
      setCourses(coursesRes.data)
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar planos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSavePlan = async () => {
    try {
      if (editingPlan?.id) {
        await api.put(`/api/admin/courses/plans/${editingPlan.id}`, editingPlan)
      } else {
        await api.post('/api/admin/courses/plans', editingPlan)
      }
      setEditingPlan(null)
      fetchData()
    } catch (err) {
      alert("Erro ao salvar plano")
    }
  }

  const handleDeletePlan = async (id: number) => {
    if(!confirm("Tem certeza que deseja apagar este plano?")) return;
    try {
      await api.delete(`/api/admin/courses/plans/${id}`)
      fetchData()
    } catch (err) {
      alert("Erro ao deletar plano")
    }
  }

  const toggleCourseInPlan = (course: Course) => {
    if (!editingPlan) return;
    const currentCourses = editingPlan.courses || [];
    const exists = currentCourses.find(c => c.id === course.id);
    
    let newCourses;
    if (exists) {
      newCourses = currentCourses.filter(c => c.id !== course.id);
    } else {
      newCourses = [...currentCourses, course];
    }
    
    setEditingPlan({ ...editingPlan, courses: newCourses });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gerenciar Planos de Assinatura</h2>
          <p className="text-sm text-gray-500">Crie os pacotes que os clientes poderão comprar</p>
        </div>
        <Button onClick={() => setEditingPlan({ name: '', description: '', price: 0, durationMonths: 0, courses: [] })} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Plano
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
      ) : plans.length === 0 ? (
        <Card className="border-dashed shadow-none bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-gray-400">
            <CreditCard className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum plano cadastrado ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(p => (
            <Card key={p.id} className="overflow-hidden shadow-lg border-0 bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">R$ {p.price.toFixed(2)}</p>
                </div>
                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                <p className="text-xs font-semibold text-purple-600 mb-2">
                  {p.durationMonths ? `Acesso por ${p.durationMonths} meses` : 'Acesso Vitalício'}
                </p>
                <p className="text-sm text-gray-500 mb-4">{p.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Cursos Inclusos:</p>
                  <div className="flex flex-wrap gap-1">
                    {p.courses.map(c => (
                      <span key={c.id} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                        {c.title}
                      </span>
                    ))}
                    {p.courses.length === 0 && <span className="text-xs text-gray-400">Nenhum curso</span>}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                   <Button variant="ghost" size="sm" onClick={() => setEditingPlan(p)} className="text-blue-600">
                     <Edit className="w-4 h-4 mr-1" /> Editar
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(p.id)} className="text-red-600">
                     <Trash2 className="w-4 h-4 mr-1" /> Apagar
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">{editingPlan.id ? 'Editar Plano' : 'Novo Plano'}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>Nome do Plano</Label>
                  <Input value={editingPlan.name || ''} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} placeholder="Ex: Acesso Vitalício" />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>Preço (R$)</Label>
                  <Input type="number" value={editingPlan.price || 0} onChange={e => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})} placeholder="0.00" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Duração do Acesso (Meses)</Label>
                  <Input type="number" value={editingPlan.durationMonths || 0} onChange={e => setEditingPlan({...editingPlan, durationMonths: parseInt(e.target.value)})} placeholder="0" />
                  <p className="text-xs text-gray-500">Deixe 0 para acesso vitalício (sem expiração).</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Descrição</Label>
                  <Input value={editingPlan.description || ''} onChange={e => setEditingPlan({...editingPlan, description: e.target.value})} placeholder="O que este plano oferece?" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cursos Inclusos neste Plano</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 border rounded-xl p-4 bg-gray-50">
                  {courses.map(c => {
                    const isSelected = editingPlan.courses?.some(pc => pc.id === c.id);
                    return (
                      <div 
                        key={c.id} 
                        onClick={() => toggleCourseInPlan(c)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-purple-100 border-purple-200 border' : 'bg-white border-transparent border hover:bg-gray-100'}`}
                      >
                        {isSelected ? <CheckCircle2 className="w-4 h-4 text-purple-600" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                        <span className={`text-sm ${isSelected ? 'font-medium text-purple-900' : 'text-gray-600'}`}>{c.title}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancelar</Button>
                <Button onClick={handleSavePlan} className="bg-purple-600 hover:bg-purple-700">Salvar Plano</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
