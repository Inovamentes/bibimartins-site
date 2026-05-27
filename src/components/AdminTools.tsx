
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Upload, FileText, Lock, PlusCircle, Link as LinkIcon, Brain, Target, MessageCircle, Zap, Shield, Play } from 'lucide-react';
import { useState } from 'react';
import { MapaCognitivo } from './tools/MapaCognitivo';

const pillars = [
  {
    id: 1,
    title: 'Pilar 1',
    description: 'Auto-Consciência Cognitiva',
    color: 'purple',
    icon: Brain,
    tools: [
      'Mapa de Func. Cognitivo',
      'Diário de Gatilhos / Roda de Autorregulação',
      'Teste de Estilo Decisório',
      'Radar de Julgamento Automático',
    ],
  },
  {
    id: 2,
    title: 'Pilar 2',
    description: 'Leitura de Perfis',
    color: 'orange',
    icon: Target,
    tools: [
      'Matriz de Perfis Cognitivos',
      'Checklist de Sobrecarga',
      'Teste das 3 Frases de Liderança',
    ],
  },
  {
    id: 3,
    title: 'Pilar 3',
    description: 'Comunicação Sináptica',
    color: 'teal',
    icon: MessageCircle,
    tools: [
      'Termômetro de Segurança Psicológica',
      'Roteiro Adaptativo / Feedback em 3 Camadas',
    ],
  },
  {
    id: 4,
    title: 'Pilar 4',
    description: 'Arquitetura de Ambiente',
    color: 'purple',
    icon: Target,
    tools: [
      'Canvas de Ambiente 360º',
      'Mapa de Fluxo Cognitivo',
      'Mapa de Previsibilidade Estratégica',
    ],
  },
  {
    id: 5,
    title: 'Pilar 5',
    description: 'Performance Adaptativa',
    color: 'orange',
    icon: Zap,
    tools: [
      'Mapa de Forças e Complementaridade',
    ],
  },
  {
    id: 'premium',
    title: 'PREMIUM',
    description: 'Ferramentas Avançadas',
    color: 'purple',
    icon: Shield,
    tools: [
      'Framework C.L.A.R.E.A.R.',
      'Plano P.A.S.S.O.',
    ],
  },
];

export function AdminTools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Dialog open={!!activeTool} onOpenChange={(open) => !open && setActiveTool(null)}>
        <DialogContent className="max-w-5xl bg-slate-900 border-slate-800 p-0 overflow-hidden" aria-describedby="tool-content">
          <DialogTitle className="sr-only">Ferramenta Sinapse</DialogTitle>
          {activeTool === 'Mapa de Func. Cognitivo' && <MapaCognitivo />}
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ferramentas Sinapse 360°</h2>
          <p className="text-sm text-gray-500">
            Gerencie os instrumentos práticos e materiais aplicáveis à equipe do líder.
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <PlusCircle className="w-4 h-4" />
          Nova Ferramenta Geral
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar) => {
          const isPremium = pillar.id === 'premium';
          const themeColor =
            pillar.color === 'purple'
              ? 'border-purple-200 bg-purple-50'
              : pillar.color === 'orange'
              ? 'border-orange-200 bg-orange-50'
              : 'border-teal-200 bg-teal-50';

          const textColor =
            pillar.color === 'purple'
              ? 'text-purple-700'
              : pillar.color === 'orange'
              ? 'text-orange-700'
              : 'text-teal-700';

          const bgHeader =
            pillar.color === 'purple'
              ? 'bg-purple-600'
              : pillar.color === 'orange'
              ? 'bg-orange-500'
              : 'bg-teal-600';

          return (
            <Card key={pillar.id} className={`overflow-hidden shadow-md hover:shadow-lg transition-shadow border-t-4 ${pillar.color === 'purple' ? 'border-t-purple-600' : pillar.color === 'orange' ? 'border-t-orange-500' : 'border-t-teal-600'}`}>
              <CardHeader className={`${bgHeader} text-white p-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold mb-1 flex items-center gap-2">
                      <pillar.icon className="w-5 h-5 opacity-80" />
                      {pillar.title}
                    </CardTitle>
                    <p className="text-sm opacity-90 font-medium">{pillar.description}</p>
                  </div>
                  {isPremium && (
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <Lock className="w-3 h-3 mr-1" /> Premium
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-gray-100">
                  {pillar.tools.map((tool, idx) => (
                    <li key={idx} className="p-4 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${themeColor}`}>
                            <FileText className={`w-4 h-4 ${textColor}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                              {tool}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-[10px] text-gray-500 bg-gray-50 uppercase">Pendente Upload</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {tool === 'Mapa de Func. Cognitivo' ? (
                            <Button size="icon" variant="outline" className="w-8 h-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 hover:border-cyan-200" title="Abrir Ferramenta Interativa" onClick={() => setActiveTool(tool)}>
                              <Play className="w-4 h-4" />
                            </Button>
                          ) : (
                            <>
                              <Button size="icon" variant="outline" className="w-8 h-8 text-gray-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200" title="Upload de Arquivo (PDF, Excel, etc)">
                                <Upload className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="outline" className="w-8 h-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200" title="Adicionar Link Externo">
                                <LinkIcon className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-gray-500 hover:text-purple-600">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Adicionar Ferramenta a este Pilar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
