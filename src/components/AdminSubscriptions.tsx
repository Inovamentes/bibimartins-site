import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Key, Loader2, UserPlus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Subscription {
  id: number;
  userId: number;
  userEmail: string;
  planId: number;
  planName: string;
  active: boolean;
  createdAt: string;
}

interface User {
  id: number;
  email: string;
}

interface Plan {
  id: number;
  name: string;
}

export function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [newSub, setNewSub] = useState({ userId: 0, planId: 0 })

  const fetchData = async () => {
    try {
      const [subsRes, usersRes, plansRes] = await Promise.all([
        api.get('/api/admin/subscriptions'),
        api.get('/api/admin/users'),
        api.get('/api/admin/courses/plans')
      ])
      setSubscriptions(subsRes.data)
      setUsers(usersRes.data)
      setPlans(plansRes.data)
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar assinaturas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleCreateSub = async () => {
    if (!newSub.userId || !newSub.planId) return alert("Selecione usuário e plano")
    try {
      await api.post('/api/admin/subscriptions', newSub)
      setIsAdding(false)
      fetchData()
    } catch (err) {
      alert("Erro ao criar assinatura")
    }
  }

  const handleDeleteSub = async (id: number) => {
    if (!confirm("Remover acesso deste usuário?")) return
    try {
      await api.delete(`/api/admin/subscriptions/${id}`)
      fetchData()
    } catch (err) {
      alert("Erro ao remover assinatura")
    }
  }

  const filteredSubs = subscriptions.filter(s => 
    s.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.planName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gerenciar Acessos (Assinaturas)</h2>
          <p className="text-sm text-gray-500">Controle quem tem acesso a quais planos</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="w-4 h-4 mr-2" /> Liberar Acesso Manual
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input 
          className="pl-10" 
          placeholder="Buscar por e-mail ou plano..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano Liberado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Liberação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Carregando...</td></tr>
                ) : filteredSubs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhuma assinatura encontrada</td></tr>
                ) : filteredSubs.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{s.userEmail}</p>
                      <p className="text-xs text-gray-500">ID: #{s.userId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-3 h-3 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700">{s.planName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-100 text-green-700 border-green-200">ATIVO</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteSub(s.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Subscription Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">Liberar Acesso Manual</h2>
              
              <div className="space-y-2">
                <Label>Selecionar Usuário</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newSub.userId}
                  onChange={e => setNewSub({...newSub, userId: parseInt(e.target.value)})}
                >
                  <option value={0}>Selecione um usuário...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.email}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Selecionar Plano</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newSub.planId}
                  onChange={e => setNewSub({...newSub, planId: parseInt(e.target.value)})}
                >
                  <option value={0}>Selecione um plano...</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
                <Button onClick={handleCreateSub} className="bg-purple-600 hover:bg-purple-700">Confirmar Acesso</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
