import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Lock, ShieldAlert, BarChart3, Settings, 
  Calendar, Download, PlusCircle, Trash2, Eye, 
  Sparkles, TrendingUp, TrendingDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as ChartTooltip, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { copsoqQuestions, hseQuestions, clinicalQuestions } from '@/data/surveyQuestions';

// Initial Mock Atestados (Medical Certificates)
const initialAtestados = [
  { id: '1', employeeName: "João Silva", cid: "F43", date: "2026-01-10", days: 10 },
  { id: '2', employeeName: "João Silva", cid: "F43", date: "2026-03-20", days: 6 }, // João has 16 days of F43 within 1 year
  { id: '3', employeeName: "Maria Santos", cid: "F32", date: "2026-02-12", days: 8 }
];

// Initial Mock Sectors
const initialSectors = [
  "Administrativo",
  "Financeiro",
  "RH",
  "Gerência",
  "Liderança",
  "Expedição",
  "Outros"
];

// Initial Mock Campaigns
const initialCampaigns = [
  { id: 'c1', name: "Mapeamento Anual de Clima 2025", startDate: "2025-06-01", endDate: "2025-06-15", status: "Fechada", score: 62 },
  { id: 'c2', name: "Campanha de Saúde Mental Q4 2025", startDate: "2025-11-01", endDate: "2025-11-15", status: "Fechada", score: 50 }, // -19.3% risk reduction
  { id: 'c3', name: "Avaliação Preventiva Q1 2026", startDate: "2026-05-01", endDate: "2026-05-15", status: "Aberta", score: 45 }
];

export function B2bDashboard() {
  // Demo Mode state
  const [isDemoActive, setIsDemoActive] = useState<boolean>(() => {
    return localStorage.getItem('bm_demo_active') === 'true';
  });

  const [activeSubTab, setActiveSubTab] = useState<'instrumentos' | 'graficos' | 'atestados' | 'campanhas' | 'setores'>('instrumentos');

  // Sector state
  const [sectors, setSectors] = useState<string[]>(() => {
    const saved = localStorage.getItem('bm_sectors');
    return saved ? JSON.parse(saved) : initialSectors;
  });
  const [newSector, setNewSector] = useState('');

  // Atestados state
  const [atestados, setAtestados] = useState<any[]>(() => {
    const saved = localStorage.getItem('bm_atestados');
    return saved ? JSON.parse(saved) : initialAtestados;
  });
  const [employeeName, setEmployeeName] = useState('');
  const [cidCode, setCidCode] = useState('');
  const [atestadoDate, setAtestadoDate] = useState('');
  const [atestadoDays, setAtestadoDays] = useState('');

  // Campaigns state
  const [campaigns, setCampaigns] = useState<any[]>(() => {
    const saved = localStorage.getItem('bm_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignStart, setNewCampaignStart] = useState('');
  const [newCampaignEnd, setNewCampaignEnd] = useState('');

  // Modal questions state
  const [selectedScale, setSelectedScale] = useState<'copsoq' | 'hse' | 'clinical'>('copsoq');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Survey responses count for stats
  const [surveyResponses, setSurveyResponses] = useState<any[]>([]);

  // Toast / notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto trigger save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('bm_sectors', JSON.stringify(sectors));
  }, [sectors]);

  useEffect(() => {
    localStorage.setItem('bm_atestados', JSON.stringify(atestados));
  }, [atestados]);

  useEffect(() => {
    localStorage.setItem('bm_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('bm_demo_active', isDemoActive.toString());
  }, [isDemoActive]);

  // Load collaborator survey responses
  const loadResponses = () => {
    const responsesStr = localStorage.getItem('bm_survey_responses');
    if (responsesStr) {
      try {
        setSurveyResponses(JSON.parse(responsesStr));
      } catch (e) {
        setSurveyResponses([]);
      }
    }
  };

  useEffect(() => {
    loadResponses();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Demo Mode
  const handleToggleDemo = () => {
    if (isDemoActive) {
      setIsDemoActive(false);
      localStorage.setItem('bm_demo_submitted', 'false'); // Reset single-use submission
      triggerToast("Modo Demonstração desativado. Tela inicial travada.");
    } else {
      setIsDemoActive(true);
      triggerToast("Modo Demonstração ATIVADO. Algumas funcionalidades foram liberadas em modo somente-leitura.");
    }
  };

  // Sector operations
  const handleAddSector = () => {
    if (isDemoActive) {
      triggerToast("🚫 Não é possível alterar setores no Modo Demonstração. Adquira a licença completa.");
      return;
    }
    if (!newSector.trim()) return;
    if (sectors.includes(newSector.trim())) {
      alert("Este setor já existe.");
      return;
    }
    setSectors([...sectors, newSector.trim()]);
    setNewSector('');
    triggerToast("Setor adicionado com sucesso!");
  };

  const handleRemoveSector = (sec: string) => {
    if (isDemoActive) {
      triggerToast("🚫 Não é possível remover setores no Modo Demonstração. Adquira a licença completa.");
      return;
    }
    if (confirm(`Remover o setor "${sec}"?`)) {
      setSectors(sectors.filter(s => s !== sec));
      triggerToast("Setor removido com sucesso!");
    }
  };

  // Atestados operations
  const handleAddAtestado = () => {
    if (isDemoActive) {
      triggerToast("🚫 Não é possível cadastrar atestados no Modo Demonstração. Adquira a licença completa.");
      return;
    }
    if (!employeeName || !cidCode || !atestadoDate || !atestadoDays) {
      alert("Preencha todos os campos do atestado.");
      return;
    }
    const newAtestado = {
      id: Math.random().toString(36).substr(2, 9),
      employeeName: employeeName.trim(),
      cid: cidCode.toUpperCase().trim(),
      date: atestadoDate,
      days: parseInt(atestadoDays)
    };
    setAtestados([newAtestado, ...atestados]);
    setEmployeeName('');
    setCidCode('');
    setAtestadoDate('');
    setAtestadoDays('');
    triggerToast("Atestado registrado com sucesso!");
  };

  const handleRemoveAtestado = (id: string) => {
    if (isDemoActive) {
      triggerToast("🚫 Não é possível remover atestados no Modo Demonstração.");
      return;
    }
    if (confirm("Remover este registro de atestado?")) {
      setAtestados(atestados.filter(a => a.id !== id));
      triggerToast("Registro removido.");
    }
  };

  // Rolling 1-year analysis to show warnings if any employee has >= 15 days with the same CID
  const calculateCidAlerts = () => {
    const alerts: { employeeName: string; cid: string; totalDays: number; rangeText: string }[] = [];
    
    // Group by employee and CID
    const grouped: Record<string, typeof atestados> = {};
    atestados.forEach(a => {
      const key = `${a.employeeName.toLowerCase().trim()}::${a.cid.toUpperCase().trim()}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });
    
    // Check rolling 365 days window for each group
    Object.entries(grouped).forEach(([key, items]) => {
      const [, cid] = key.split('::');
      
      // Sort items by date ascending
      const sorted = [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      for (let i = 0; i < sorted.length; i++) {
        const start = new Date(sorted[i].date);
        const end = new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
        
        let sumDays = 0;
        const matchedItems: typeof atestados = [];
        
        for (let j = i; j < sorted.length; j++) {
          const d = new Date(sorted[j].date);
          if (d >= start && d <= end) {
            sumDays += sorted[j].days;
            matchedItems.push(sorted[j]);
          }
        }
        
        if (sumDays >= 15) {
          // Find employee formal name capitalization
          const formalName = items[0].employeeName;
          alerts.push({
            employeeName: formalName,
            cid: cid.toUpperCase(),
            totalDays: sumDays,
            rangeText: `entre ${start.toLocaleDateString('pt-BR')} e ${new Date(Math.max(...matchedItems.map(item => new Date(item.date).getTime()))).toLocaleDateString('pt-BR')}`
          });
          break; // alert once per employee-cid group
        }
      }
    });
    
    return alerts;
  };

  const cidAlerts = calculateCidAlerts();

  // Campaigns operations
  const handleAddCampaign = () => {
    if (isDemoActive) {
      triggerToast("🚫 Não é possível criar campanhas no Modo Demonstração. Adquira a licença completa.");
      return;
    }
    if (!newCampaignName || !newCampaignStart || !newCampaignEnd) {
      alert("Preencha todos os campos da campanha.");
      return;
    }
    const newCamp = {
      id: 'c' + (campaigns.length + 1),
      name: newCampaignName,
      startDate: newCampaignStart,
      endDate: newCampaignEnd,
      status: "Aberta",
      score: 0
    };
    setCampaigns([...campaigns, newCamp]);
    setNewCampaignName('');
    setNewCampaignStart('');
    setNewCampaignEnd('');
    triggerToast("Nova campanha de pesquisa criada!");
  };

  const handleCloseCampaign = (id: string) => {
    if (isDemoActive) {
      triggerToast("🚫 Não é possível fechar campanhas no Modo Demonstração. Compre para salvar histórico.");
      return;
    }
    
    // For mock evaluation when closing, calculate an average score from responses or assign a random/mock logic
    const responsesForCamp = surveyResponses.filter(r => r.campaignId === id);
    let scoreCalculated = 45; // default fallback
    
    if (responsesForCamp.length > 0) {
      const allScores: number[] = [];
      responsesForCamp.forEach(resp => {
        const qAnswers = Object.values(resp.answers) as number[];
        if (qAnswers.length > 0) {
          const avg = qAnswers.reduce((a, b) => a + b, 0) / qAnswers.length;
          allScores.push(avg);
        }
      });
      if (allScores.length > 0) {
        scoreCalculated = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
      }
    } else {
      // simulate score between 40 and 65
      scoreCalculated = Math.floor(Math.random() * 25) + 40;
    }

    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        return { ...c, status: "Fechada", score: scoreCalculated };
      }
      return c;
    }));

    triggerToast(`Campanha fechada! Score consolidado em: ${scoreCalculated}% de risco.`);
  };

  // Compare closed campaigns for delta metric
  const getComparativeReport = () => {
    const closedCampaigns = campaigns.filter(c => c.status === 'Fechada');
    if (closedCampaigns.length < 2) return null;

    // Get the two most recent closed campaigns
    // Sort closed campaigns by end date
    const sorted = [...closedCampaigns].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    const prevCamp = sorted[sorted.length - 2];
    const latestCamp = sorted[sorted.length - 1];

    const prevScore = prevCamp.score;
    const latestScore = latestCamp.score;
    
    // Note: lower score is better (reduction in psychosocial risk)
    const diff = latestScore - prevScore;
    const percentChange = ((latestScore - prevScore) / prevScore) * 100;
    
    const isImprovement = diff < 0; // Negative change in risk is good!

    return {
      prevName: prevCamp.name,
      prevScore,
      latestName: latestCamp.name,
      latestScore,
      percentChange: Math.abs(Math.round(percentChange * 10) / 10),
      isImprovement,
      changeText: isImprovement 
        ? `Melhora de ${Math.abs(Math.round(percentChange * 10) / 10)}% nos índices de risco (Redução de ${prevScore}% para ${latestScore}%)`
        : `Piora de ${Math.abs(Math.round(percentChange * 10) / 10)}% nos índices de risco (Aumento de ${prevScore}% para ${latestScore}%)`
    };
  };

  const comparison = getComparativeReport();

  // Fictitious report download
  const handleDownloadReport = () => {
    const textReport = `
========================================================================
             RELATÓRIO CORPORATIVO DE RISCO PSICOSSOCIAL (NR-1)
                         BIBI MARTINS ACADEMY B2B
========================================================================
Gerado em: ${new Date().toLocaleDateString('pt-BR')} (MODO DEMONSTRAÇÃO)
Empresa: Mapeamento de Teste Ltda
Total de Respostas: ${surveyResponses.length + 42} colaboradores (dados simulados + testes)

------------------------------------------------------------------------
I. DIAGNÓSTICO POR SETORES (RISCO CONSOLIDADO)
------------------------------------------------------------------------
- Financeiro: 78% (Alerta de Risco Grave)
- Operações: 68% (Risco Médio-Alto)
- Expedição: 58% (Risco Médio)
- Administrativo: 48% (Risco Moderado)
- Recursos Humanos: 35% (Risco Baixo - Seguro)
- Gerência e Liderança: 30% (Risco Baixo)

------------------------------------------------------------------------
II. FATORES ORGANIZACIONAIS AVALIADOS (MÉDIA GLOBAL)
------------------------------------------------------------------------
1. Exigências de Tempo e Volume: 72/100 (Excesso quantitativo)
2. Apoio Social de Colegas: 60/100 (Moderado)
3. Apoio da Liderança Direta: 42/100 (Necessidade de Capacitação Sinapse 360)
4. Clareza e Confito de Papel: 54/100 (Falta de fluxos organizados)
5. Índice Geral de Burnout/Stress: 61/100 (Alerta preventivo acionado)

------------------------------------------------------------------------
III. RECOMENDAÇÕES DA PLATAFORMA (BIBI MARTINS)
------------------------------------------------------------------------
1. Capacitação de Lideranças Neurodiversas (Módulo 1 e 2 do Método Sinapse 360).
2. Criação de Canas de Feedback Adaptativos e Redução de Ruídos de Processo.
3. Implantação de políticas claras de segurança psicológica para reduzir o masking.

========================================================================
ESTE É UM RELATÓRIO DE DEMONSTRAÇÃO. PARA ACESSAR A PLATAFORMA INTEGRADA, 
ADQUIRA A SUA LICENÇA NO HOTMART: https://pay.hotmart.com/mock-nr1
========================================================================
`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio_nr1_demonstracao.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("📥 Relatório de demonstração baixado com sucesso!");
  };

  // Recharts Chart Data (Aggregated Mock Data + Dynamic Responder Answers)
  const getSectorChartData = () => {
    // Basic Simulated Values
    const data = [
      { name: 'Financeiro', Risco: 78, Burnout: 82, Suporte: 30 },
      { name: 'RH', Risco: 35, Burnout: 28, Suporte: 85 },
      { name: 'Gerência', Risco: 30, Burnout: 25, Suporte: 90 },
      { name: 'Liderança', Risco: 32, Burnout: 28, Suporte: 88 },
      { name: 'Expedição', Risco: 58, Burnout: 62, Suporte: 48 },
      { name: 'Administrativo', Risco: 48, Burnout: 50, Suporte: 65 }
    ];

    // If there are actual responses in the system, we can adapt the chart to incorporate them
    if (surveyResponses.length > 0) {
      surveyResponses.forEach(r => {
        const existingSector = data.find(d => d.name === r.sector);
        // Calculate average response score (0 - 100)
        const qAnswers = Object.values(r.answers) as number[];
        if (qAnswers.length > 0) {
          const avgRisk = Math.round(qAnswers.reduce((a, b) => a + b, 0) / qAnswers.length);
          if (existingSector) {
            existingSector.Risco = Math.round((existingSector.Risco + avgRisk) / 2);
            existingSector.Burnout = Math.round((existingSector.Burnout + avgRisk + 5) / 2);
          } else {
            // Add custom sector
            data.push({
              name: r.sector,
              Risco: avgRisk,
              Burnout: Math.round(avgRisk * 1.05),
              Suporte: 60
            });
          }
        }
      });
    }
    return data;
  };

  const sectorChartData = getSectorChartData();

  // Factors Radar Data
  const factorsRadarData = [
    { subject: 'Exigências de Tempo', A: 72, B: 65, fullMark: 100 },
    { subject: 'Exigências Cognitivas', A: 68, B: 75, fullMark: 100 },
    { subject: 'Exigências Emocionais', A: 75, B: 55, fullMark: 100 },
    { subject: 'Influência Decisória', A: 40, B: 60, fullMark: 100 },
    { subject: 'Suporte Liderança', A: 42, B: 70, fullMark: 100 },
    { subject: 'Segurança e Clima', A: 58, B: 80, fullMark: 100 }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-4 md:p-8 shadow-2xl relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-purple-900 border border-purple-500 rounded-2xl shadow-2xl text-white text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Demo Watermark Banner */}
      {isDemoActive && (
        <div className="mb-6 p-4 bg-purple-950/40 border border-purple-800/80 rounded-2xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-600 text-white animate-pulse">MODO DEMO</Badge>
            <div>
              <p className="text-xs font-bold text-slate-200">Demonstração Corporativa Ativa</p>
              <p className="text-[11px] text-slate-400">Você pode ler gráficos e atestados de simulação. Use os links de teste na aba de links.</p>
            </div>
          </div>
          <Button onClick={handleToggleDemo} size="sm" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-900/40">
            Sair do Modo Demo
          </Button>
        </div>
      )}

      {/* Header and Sub-Navigation */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between border-b border-slate-800 pb-6 mb-6 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            Plataforma NR-1 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">Mapeamento B2B</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Gestão de riscos psicossociais, saúde ocupacional e conformidade legal da sua empresa.
          </p>
        </div>

        {/* Sub tabs navigation */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 max-w-max">
          {[
            { id: 'instrumentos', label: 'Instrumentos', icon: Lock },
            { id: 'graficos', label: 'Resultados e Gráficos', icon: BarChart3 },
            { id: 'campanhas', label: 'Ações e Campanhas', icon: Calendar },
            { id: 'atestados', label: 'Controle de Atestados', icon: ShieldAlert },
            { id: 'setores', label: 'Setores', icon: Settings },
          ].map(t => {
            const isTabActive = activeSubTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                  isTabActive 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================= TAB: INSTRUMENTOS ======================= */}
      {activeSubTab === 'instrumentos' && (
        <div className="space-y-8 animate-in fade-in-50">
          <div className="text-center max-w-2xl mx-auto py-6">
            <h2 className="text-xl font-bold mb-2">Instrumentos de Diagnóstico</h2>
            <p className="text-slate-400 text-xs">
              Mapeamentos de saúde mental corporativa desenvolvidos cientificamente para diagnosticar e atuar em problemas de estresse e burnout na equipe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: 'copsoq',
                title: 'COPSOQ II (41 Questões)',
                desc: 'Avaliação de riscos psicossociais baseado no questionário dinamarquês. Mede estresse, burnout e assédio de forma anônima.',
                hotmart: 'https://pay.hotmart.com/mock-nr1',
                badge: 'Saúde Mental & Clima'
              },
              {
                id: 'hse',
                title: 'HSE Stress Indicator Tool',
                desc: 'Desenvolvido pelo órgão britânico de segurança do trabalho para identificar e intervir nas 6 dimensões de estresse ocupacional.',
                hotmart: 'https://pay.hotmart.com/mock-nr1',
                badge: 'Estresse Ocupacional'
              },
              {
                id: 'clinical',
                title: 'Diagnóstico Clínico BMA',
                desc: 'Avaliação personalizada para mapear adaptações razoáveis e necessidades sensoriais de profissionais neurodivergentes na empresa.',
                hotmart: 'https://pay.hotmart.com/mock-nr1',
                badge: 'Inclusão & Neurodiversidade'
              }
            ].map(tool => (
              <Card key={tool.id} className="bg-slate-950 border-slate-800 relative overflow-hidden group shadow-lg flex flex-col justify-between">
                
                {/* Locked Mask (Locked unless full license bought, which we mock as locked unless user is admin or isDemoActive handles dashboard. BUT the actual instrument questionnaires remain locked for purchase redirects) */}
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center transition-all group-hover:bg-slate-950/90">
                  <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mb-4 text-orange-400 shadow-lg shadow-orange-500/10">
                    <Lock className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{tool.title}</h4>
                  <p className="text-slate-400 text-[11px] mb-4 max-w-[200px] leading-relaxed">Instrumento bloqueado. Adquira a licença comercial ou ative o modo demonstração.</p>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <Button 
                      onClick={() => window.open(tool.hotmart, '_blank')}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold h-9 rounded-lg"
                    >
                      Liberar no Hotmart
                    </Button>
                    
                    {isDemoActive && (
                      <Button 
                        onClick={() => {
                          setSelectedScale(tool.id as any);
                          setIsQuestionModalOpen(true);
                        }}
                        variant="secondary"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs h-9 rounded-lg border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Visualizar Escalas
                      </Button>
                    )}
                  </div>
                </div>

                <CardContent className="p-5">
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700 mb-3">{tool.badge}</Badge>
                  <h3 className="font-bold text-white mb-2 text-sm">{tool.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{tool.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo Activation Banner in instruments */}
          {!isDemoActive && (
            <div className="bg-gradient-to-br from-purple-950/30 to-slate-900 border border-purple-500/30 p-6 rounded-3xl text-center shadow-lg">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 border border-purple-500 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Quer experimentar a plataforma antes de assinar?</h3>
              <p className="text-slate-400 text-xs max-w-xl mx-auto mb-5 leading-relaxed">
                Ative o modo de demonstração gratuito para visualizar gráficos interativos com dados consolidados fictícios, testar a geração de link de preenchimento e gerenciar atestados e campanhas simuladas.
              </p>
              <Button onClick={handleToggleDemo} className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-8 rounded-xl font-bold h-10 shadow-lg">
                Ativar Modo Demonstração (Grátis)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB: GRÁFICOS E RESULTADOS ======================= */}
      {activeSubTab === 'graficos' && (
        <div className="space-y-6 animate-in fade-in-50">
          {!isDemoActive && (
            <div className="text-center py-12 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-6">
              <Lock className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold">Gráficos de Resultados Bloqueados</h3>
              <p className="text-slate-400 text-xs max-w-md mt-2 mb-6">
                Assine a licença corporativa ou ative o modo demonstração na aba de Instrumentos para navegar no painel analítico com dados reais ou simulados.
              </p>
              <Button onClick={() => setActiveSubTab('instrumentos')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl">
                Ativar Demonstração / Assinar
              </Button>
            </div>
          )}

          {isDemoActive && (
            <>
              {/* Top Banner Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Colaboradores Ativos", value: "84", desc: "Base de dados ativa" },
                  { label: "Mapeamentos Concluídos", value: `${surveyResponses.length + 42}`, desc: `Última resposta: ${surveyResponses.length > 0 ? "Agora mesmo" : "Fictícia"}` },
                  { label: "Índice de Risco Global", value: "48%", desc: "Status: Risco Moderado" },
                  { label: "Alertas de Atestados (CID)", value: `${cidAlerts.length}`, desc: "Recorrências detectadas" },
                ].map((s, idx) => (
                  <Card key={idx} className="bg-slate-950 border-slate-800/80">
                    <CardContent className="p-4">
                      <p className="text-3xl font-black text-white">{s.value}</p>
                      <p className="text-xs text-slate-300 font-bold mt-1">{s.label}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{s.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Chart 1: Risco por Setor */}
                <Card className="bg-slate-950 border-slate-800">
                  <CardHeader className="p-5 border-b border-slate-800 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Mapeamento de Risco por Setores</CardTitle>
                      <p className="text-[10px] text-slate-500">Média ponderada do nível de estresse e cansaço (%)</p>
                    </div>
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/20">COPSOQ II</Badge>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sectorChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 100]} />
                          <ChartTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#a78bfa' }}
                          />
                          <Bar dataKey="Risco" name="Índice de Risco" fill="#d97706" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Burnout" name="Propensão Burnout" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Chart 2: Fatores Psicossociais */}
                <Card className="bg-slate-950 border-slate-800">
                  <CardHeader className="p-5 border-b border-slate-800 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Dimensões Psicossociais</CardTitle>
                      <p className="text-[10px] text-slate-500">Comparativo de suporte vs cobranças organizacionais</p>
                    </div>
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/20">Radar 360°</Badge>
                  </CardHeader>
                  <CardContent className="p-5 flex items-center justify-center">
                    <div className="h-80 w-full max-w-sm">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={factorsRadarData}>
                          <PolarGrid stroke="#1e293b" />
                          <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                          <Radar name="Meta Empresa" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                          <Radar name="Índice Atual" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
                          <ChartTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Fictitious Report Download Section */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Relatório Consolidado de Saúde Mental</h3>
                  <p className="text-xs text-slate-400">Baixe o relatório estatístico consolidado com o sumário de riscos de todas as escalas.</p>
                </div>
                <Button onClick={handleDownloadReport} className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl gap-2 h-10 shadow-lg">
                  <Download className="w-4 h-4" />
                  Baixar Relatório Fictício (.txt)
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================= TAB: CAMPANHAS ======================= */}
      {activeSubTab === 'campanhas' && (
        <div className="space-y-6 animate-in fade-in-50">
          {!isDemoActive && (
            <div className="text-center py-12 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-6">
              <Lock className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold">Gestão de Campanhas Bloqueada</h3>
              <p className="text-slate-400 text-xs max-w-md mt-2 mb-6">
                Cadastre e feche eventos de coleta, gerencie links de envio e gere deltas comparativos na licença completa.
              </p>
              <Button onClick={() => setActiveSubTab('instrumentos')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl">
                Ativar Demonstração / Assinar
              </Button>
            </div>
          )}

          {isDemoActive && (
            <>
              {/* Comparative Delta Report */}
              {comparison && (
                <div className="p-5 bg-gradient-to-r from-teal-950/40 via-slate-900 to-teal-950/20 border border-teal-500/30 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                    {comparison.isImprovement ? (
                      <TrendingDown className="w-6 h-6 text-teal-400" /> // Risk down = good!
                    ) : (
                      <TrendingUp className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Comparativo de Melhora / Piora do Clima</h3>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      Comparação entre <span className="text-purple-400 font-bold">{comparison.prevName}</span> e o evento mais recente <span className="text-teal-400 font-bold">{comparison.latestName}</span>.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">{comparison.changeText}.</p>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Form to Create (Read-only in demo) */}
                <Card className="bg-slate-950 border-slate-800">
                  <CardHeader className="p-5 border-b border-slate-800">
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Criar Novo Evento</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-300">Nome da Campanha</Label>
                      <Input 
                        placeholder="Ex: Clima Organizacional Q2" 
                        value={newCampaignName}
                        onChange={e => setNewCampaignName(e.target.value)}
                        className="bg-slate-900 border-slate-800 h-10 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">Início</Label>
                        <Input 
                          type="date" 
                          value={newCampaignStart}
                          onChange={e => setNewCampaignStart(e.target.value)}
                          className="bg-slate-900 border-slate-800 h-10 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">Término</Label>
                        <Input 
                          type="date" 
                          value={newCampaignEnd}
                          onChange={e => setNewCampaignEnd(e.target.value)}
                          className="bg-slate-900 border-slate-800 h-10 text-xs text-white"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddCampaign} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-10 rounded-xl mt-2">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Agendar Campanha
                    </Button>
                    <p className="text-[10px] text-slate-500 italic text-center">Nota: Apenas licenças ativas podem salvar novos agendamentos.</p>
                  </CardContent>
                </Card>

                {/* Campaigns List & Distribution Links */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Campanhas Registradas</h3>
                  {campaigns.map(c => {
                    const isOpen = c.status === 'Aberta';
                    const responsesForCamp = surveyResponses.filter(r => r.campaignId === c.id);
                    const campaignLink = `${window.location.origin}/pesquisa/${c.id}`;
                    
                    return (
                      <Card key={c.id} className="bg-slate-950 border-slate-800 p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{c.name}</h4>
                              <Badge className={isOpen ? "bg-green-600/20 text-green-400 border-green-500/20" : "bg-slate-800 text-slate-400"}>
                                {c.status}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">Período: {new Date(c.startDate).toLocaleDateString('pt-BR')} até {new Date(c.endDate).toLocaleDateString('pt-BR')}</p>
                            <p className="text-xs text-slate-300 font-medium mt-2">
                              Respostas recebidas: <span className="text-purple-400 font-bold">{isOpen ? responsesForCamp.length : '—'}</span> {isOpen && `(Mapeamento de Teste)`}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            {isOpen ? (
                              <>
                                <Button 
                                  onClick={() => handleCloseCampaign(c.id)}
                                  size="sm"
                                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
                                >
                                  Fechar Evento e Gerar Relatório
                                </Button>
                              </>
                            ) : (
                              <div className="text-left sm:text-right">
                                <span className="text-xs text-slate-400">Score de Risco Psicossocial:</span>
                                <p className="text-lg font-black text-orange-400">{c.score}%</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Distribution Link Section if open */}
                        {isOpen && (
                          <div className="mt-4 pt-4 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/30 p-3 rounded-2xl border border-slate-950">
                            <div className="flex-1 w-full min-w-0">
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Link de Envio aos Colaboradores</p>
                              <p className="text-xs text-purple-300 truncate font-semibold mt-0.5">{campaignLink}</p>
                            </div>
                            <Button 
                              onClick={() => {
                                navigator.clipboard.writeText(campaignLink);
                                triggerToast("📋 Link da pesquisa copiado para a área de transferência!");
                              }}
                              size="sm"
                              variant="outline"
                              className="border-slate-800 text-slate-300 hover:bg-slate-800 text-[10px] h-8 font-bold"
                            >
                              Copiar Link de Pesquisa (41 Questões)
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================= TAB: ATESTADOS ======================= */}
      {activeSubTab === 'atestados' && (
        <div className="space-y-6 animate-in fade-in-50">
          {!isDemoActive && (
            <div className="text-center py-12 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-6">
              <Lock className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold">Gestão de Atestados Bloqueada</h3>
              <p className="text-slate-400 text-xs max-w-md mt-2 mb-6">
                Registre os afastamentos de colaboradores por CID e receba alertas automáticos de estafa mental na licença comercial.
              </p>
              <Button onClick={() => setActiveSubTab('instrumentos')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl">
                Ativar Demonstração / Assinar
              </Button>
            </div>
          )}

          {isDemoActive && (
            <>
              {/* CID Alert warnings if active */}
              {cidAlerts.length > 0 && (
                <div className="space-y-3">
                  {cidAlerts.map((alert, idx) => (
                    <div key={idx} className="p-4 bg-red-950/40 border border-red-800/80 rounded-2xl flex items-start gap-3 text-red-200">
                      <ShieldAlert className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Alerta de Riscos Psicossociais Acumulados</h4>
                        <p className="text-[11px] mt-1 text-slate-200 font-medium">
                          O colaborador <span className="text-red-400 font-bold">{alert.employeeName}</span> acumulou <span className="text-red-400 font-black">{alert.totalDays} dias</span> de atestado pelo <span className="text-red-400 font-black">CID {alert.cid}</span> dentro do período de 1 ano ({alert.rangeText}).
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 italic">
                          Ação recomendada pela NR-1: Reorganização das metas e oferecimento de suporte terapêutico/médico preventivo.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Form to Register */}
                <Card className="bg-slate-950 border-slate-800 h-max">
                  <CardHeader className="p-5 border-b border-slate-800">
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Lançar Atestado</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-300">Colaborador</Label>
                      <Input 
                        placeholder="Ex: João Silva" 
                        value={employeeName}
                        onChange={e => setEmployeeName(e.target.value)}
                        className="bg-slate-900 border-slate-800 h-10 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-300">Código CID (CID-10)</Label>
                      <Input 
                        placeholder="Ex: F43 ou F32" 
                        value={cidCode}
                        onChange={e => setCidCode(e.target.value)}
                        className="bg-slate-900 border-slate-800 h-10 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">Data do Atestado</Label>
                        <Input 
                          type="date" 
                          value={atestadoDate}
                          onChange={e => setAtestadoDate(e.target.value)}
                          className="bg-slate-900 border-slate-800 h-10 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">Dias Afastados</Label>
                        <Input 
                          type="number" 
                          placeholder="Dias" 
                          value={atestadoDays}
                          onChange={e => setAtestadoDays(e.target.value)}
                          className="bg-slate-900 border-slate-800 h-10 text-xs text-white"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddAtestado} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-10 rounded-xl mt-2">
                      Registrar Atestado
                    </Button>
                  </CardContent>
                </Card>

                {/* Atestados List */}
                <Card className="lg:col-span-2 bg-slate-950 border-slate-800">
                  <CardHeader className="p-5 border-b border-slate-800">
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Histórico de Afastamentos</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                            <th className="p-4">Colaborador</th>
                            <th className="p-4">CID</th>
                            <th className="p-4">Data Registro</th>
                            <th className="p-4">Afastamento</th>
                            <th className="p-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {atestados.map((a) => (
                            <tr key={a.id} className="hover:bg-slate-900/30">
                              <td className="p-4 font-semibold text-white">{a.employeeName}</td>
                              <td className="p-4">
                                <Badge className="bg-slate-800 text-purple-300 border-slate-700 font-mono text-[10px]">
                                  {a.cid}
                                </Badge>
                              </td>
                              <td className="p-4 text-slate-400">{new Date(a.date).toLocaleDateString('pt-BR')}</td>
                              <td className="p-4 text-slate-200 font-bold">{a.days} dias</td>
                              <td className="p-4 text-center">
                                <Button 
                                  onClick={() => handleRemoveAtestado(a.id)}
                                  size="icon" 
                                  variant="ghost" 
                                  className="w-8 h-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                >
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
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================= TAB: SETORES ======================= */}
      {activeSubTab === 'setores' && (
        <div className="space-y-6 animate-in fade-in-50">
          {!isDemoActive && (
            <div className="text-center py-12 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-6">
              <Lock className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold">Configuração de Setores Bloqueada</h3>
              <p className="text-slate-400 text-xs max-w-md mt-2 mb-6">
                Personalize os departamentos da sua empresa para mapear e cruzar os índices de estresse e burnout na licença comercial.
              </p>
              <Button onClick={() => setActiveSubTab('instrumentos')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl">
                Ativar Demonstração / Assinar
              </Button>
            </div>
          )}

          {isDemoActive && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form Add Sector */}
              <Card className="bg-slate-950 border-slate-800 h-max">
                <CardHeader className="p-5 border-b border-slate-800">
                  <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Adicionar Setor</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-300">Nome do Setor / Departamento</Label>
                    <Input 
                      placeholder="Ex: Logística, Tecnologia..." 
                      value={newSector}
                      onChange={e => setNewSector(e.target.value)}
                      className="bg-slate-900 border-slate-800 h-10 text-xs text-white"
                    />
                  </div>
                  <Button onClick={handleAddSector} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-10 rounded-xl mt-2">
                    Incluir Novo Setor
                  </Button>
                </CardContent>
              </Card>

              {/* Sectors List */}
              <Card className="lg:col-span-2 bg-slate-950 border-slate-800">
                <CardHeader className="p-5 border-b border-slate-800">
                  <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Setores Configurados</CardTitle>
                  <p className="text-[10px] text-slate-500">Estes setores serão carregados automaticamente no dropdown do formulário de resposta do colaborador.</p>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="flex flex-wrap gap-2.5">
                    {sectors.map(sec => (
                      <div 
                        key={sec} 
                        className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold hover:border-slate-700 transition"
                      >
                        <span className="text-white">{sec}</span>
                        <button 
                          onClick={() => handleRemoveSector(sec)}
                          className="text-slate-500 hover:text-red-400 p-0.5 rounded transition"
                          title="Remover Setor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* ======================= MODAL: QUESTION BROWSER ======================= */}
      <Dialog open={isQuestionModalOpen} onOpenChange={(open) => !open && setIsQuestionModalOpen(false)}>
        <DialogContent className="max-w-3xl bg-slate-950 text-white border-slate-800 p-6 rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-800 pb-4 mb-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              Navegador de Escalas e Questões
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Conheça as perguntas aplicadas em cada questionário disponível.
            </DialogDescription>
          </DialogHeader>

          {/* Selector scales tabs */}
          <div className="flex border-b border-slate-800 mb-6 gap-2">
            {[
              { id: 'copsoq', label: 'COPSOQ II (41q)' },
              { id: 'hse', label: 'HSE Stress Indicator (10q)' },
              { id: 'clinical', label: 'Diagnóstico Clínico BMA (7q)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedScale(tab.id as any)}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition ${
                  selectedScale === tab.id 
                    ? 'border-purple-500 text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List of Questions */}
          <div className="space-y-3">
            {selectedScale === 'copsoq' && copsoqQuestions.map(q => (
              <div key={q.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-900 flex gap-3 items-start">
                <span className="w-6 h-6 rounded bg-slate-950 flex items-center justify-center text-[10px] font-bold text-purple-400 shrink-0 mt-0.5">#{q.id}</span>
                <div>
                  <p className="text-xs text-white leading-relaxed font-semibold">{q.text}</p>
                  {q.dimension && (
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 block">{q.dimension}</span>
                  )}
                </div>
              </div>
            ))}

            {selectedScale === 'hse' && hseQuestions.map(q => (
              <div key={q.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-900 flex gap-3 items-start">
                <span className="w-6 h-6 rounded bg-slate-950 flex items-center justify-center text-[10px] font-bold text-purple-400 shrink-0 mt-0.5">#{q.id}</span>
                <div>
                  <p className="text-xs text-white leading-relaxed font-semibold">{q.text}</p>
                  {q.dimension && (
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 block">{q.dimension}</span>
                  )}
                </div>
              </div>
            ))}

            {selectedScale === 'clinical' && clinicalQuestions.map(q => (
              <div key={q.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-900 flex gap-3 items-start">
                <span className="w-6 h-6 rounded bg-slate-950 flex items-center justify-center text-[10px] font-bold text-purple-400 shrink-0 mt-0.5">#{q.id}</span>
                <div>
                  <p className="text-xs text-white leading-relaxed font-semibold">{q.text}</p>
                  {q.dimension && (
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 block">{q.dimension}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-slate-800">
            <Button onClick={() => setIsQuestionModalOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
              Fechar Visualização
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
