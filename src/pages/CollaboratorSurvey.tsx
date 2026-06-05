import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ChevronLeft, ChevronRight, Send, HelpCircle, Brain } from 'lucide-react';
import { copsoqQuestions } from '@/data/surveyQuestions';

const defaultSectors = [
  "Administrativo",
  "Financeiro",
  "RH",
  "Gerência",
  "Liderança",
  "Expedição",
  "Outros"
];

const answerOptions = [
  { label: "Sempre / Muito", value: 100 },
  { label: "Frequentemente / Um Pouco", value: 75 },
  { label: "Às vezes", value: 50 },
  { label: "Raramente / Quase Nunca", value: 25 },
  { label: "Nunca / Nada", value: 0 }
];

export default function CollaboratorSurvey() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [searchParams] = useSearchParams();
  
  const isDemo = campaignId === 'demo' || searchParams.get('demo') === 'true';
  const finalCampaignId = campaignId || 'demo';

  const [sectors, setSectors] = useState<string[]>(defaultSectors);
  const [selectedSector, setSelectedSector] = useState('');
  const [step, setStep] = useState<'sector' | 'questions' | 'success'>('sector');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState('');

  // Enforce single use for demo mode
  const [demoAlreadySubmitted, setDemoAlreadySubmitted] = useState(false);

  useEffect(() => {
    // Load sectors
    const savedSectors = localStorage.getItem('bm_sectors');
    if (savedSectors) {
      try {
        setSectors(JSON.parse(savedSectors));
      } catch (e) {
        console.error("Erro ao carregar setores no formulário:", e);
      }
    }

    // Check if demo already submitted
    if (isDemo) {
      const demoSubmitted = localStorage.getItem('bm_demo_submitted') === 'true';
      if (demoSubmitted) {
        setDemoAlreadySubmitted(true);
      }
    }
  }, [isDemo]);

  const handleStartSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSector) {
      setError('Por favor, selecione o setor onde você trabalha.');
      return;
    }
    setError('');
    
    if (isDemo && demoAlreadySubmitted) {
      setError('Esta pesquisa de demonstração já foi respondida e é limitada a uma única utilização.');
      return;
    }

    setStep('questions');
  };

  const handleAnswerSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const currentQuestion = copsoqQuestions[currentQuestionIndex];
    if (answers[currentQuestion.id] === undefined) {
      setError('Por favor, responda à pergunta atual antes de prosseguir.');
      return;
    }
    setError('');

    if (currentQuestionIndex < copsoqQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setStep('sector');
    }
  };

  const handleSubmit = () => {
    const currentQuestion = copsoqQuestions[currentQuestionIndex];
    if (answers[currentQuestion.id] === undefined) {
      setError('Por favor, responda à pergunta atual antes de enviar.');
      return;
    }
    setError('');

    // Save response
    const newResponse = {
      id: Math.random().toString(36).substr(2, 9),
      campaignId: finalCampaignId,
      sector: selectedSector,
      answers,
      createdAt: new Date().toISOString()
    };

    const existingResponsesStr = localStorage.getItem('bm_survey_responses');
    let existingResponses = [];
    if (existingResponsesStr) {
      try {
        existingResponses = JSON.parse(existingResponsesStr);
      } catch (e) {
        existingResponses = [];
      }
    }

    existingResponses.push(newResponse);
    localStorage.setItem('bm_survey_responses', JSON.stringify(existingResponses));

    if (isDemo) {
      localStorage.setItem('bm_demo_submitted', 'true');
      setDemoAlreadySubmitted(true);
    }

    setStep('success');
  };

  const progressPercentage = Math.round(((currentQuestionIndex + 1) / copsoqQuestions.length) * 100);

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-center shadow-2xl p-8 rounded-3xl animate-in zoom-in-95">
          <div className="mx-auto w-16 h-16 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Mapeamento Enviado!</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Muito obrigado por participar. Suas respostas foram computadas de forma 100% anônima e ajudarão a construir um ambiente corporativo mais saudável e seguro para todos.
          </p>
          {isDemo ? (
            <div className="p-4 bg-purple-900/20 border border-purple-800 rounded-2xl mb-6 text-left">
              <p className="text-xs text-purple-300 font-semibold mb-1">💡 Modo Demonstração Ativo</p>
              <p className="text-[11px] text-slate-400">
                Os dados desta pesquisa simulada foram salvos no seu navegador. Você pode voltar à aba da Área do Cliente para conferir os resultados consolidados nos gráficos.
              </p>
            </div>
          ) : null}
          <Button 
            onClick={() => window.close()} 
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl"
          >
            Fechar Janela
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">BM</span>
            </div>
            <div>
              <span className="font-bold text-sm text-white block">Mapeamento Psicossocial</span>
              <span className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">NR-1 & COPSOQ II</span>
            </div>
          </div>
          {isDemo && (
            <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
              Demonstração
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl">
          {step === 'sector' ? (
            <Card className="bg-slate-900 border-slate-800 shadow-2xl p-6 md:p-8 rounded-3xl animate-in fade-in-50">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-8 h-8 text-purple-500 shrink-0" />
                <h1 className="text-xl md:text-2xl font-bold">Mapeamento de Clima e Saúde Mental</h1>
              </div>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Bem-vindo ao canal de avaliação de bem-estar corporativo. Suas respostas são estritamente confidenciais e consolidadas de maneira estatística. Nenhuma identificação pessoal é registrada.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-800 text-red-400 rounded-xl text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleStartSurvey} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sector" className="text-slate-300 font-semibold text-sm">Qual é o seu setor de trabalho?</Label>
                  <select
                    id="sector"
                    value={selectedSector}
                    onChange={e => setSelectedSector(e.target.value)}
                    className="w-full h-12 rounded-xl bg-slate-950 border border-slate-800 text-white px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="" disabled>Selecione seu setor...</option>
                    {sectors.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="submit" 
                  disabled={isDemo && demoAlreadySubmitted}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl text-base transition-all"
                >
                  {isDemo && demoAlreadySubmitted ? 'Demonstração Concluída' : 'Iniciar Avaliação'}
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="bg-slate-900 border-slate-800 shadow-2xl p-6 md:p-8 rounded-3xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              {/* Progress Tracker */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 font-bold mb-2">
                  <span className="uppercase tracking-widest text-purple-400">Questão {currentQuestionIndex + 1} de {copsoqQuestions.length}</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-1.5 bg-slate-800" />
              </div>

              {/* Question */}
              <div className="min-h-[140px] mb-8 flex flex-col justify-center">
                {copsoqQuestions[currentQuestionIndex].dimension && (
                  <span className="inline-block px-2.5 py-0.5 rounded bg-purple-900/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-3 w-max">
                    {copsoqQuestions[currentQuestionIndex].dimension}
                  </span>
                )}
                <h2 className="text-lg md:text-xl font-bold leading-snug">
                  {copsoqQuestions[currentQuestionIndex].text}
                </h2>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-xl text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {/* Answers */}
              <RadioGroup 
                value={answers[copsoqQuestions[currentQuestionIndex].id]?.toString() || ''}
                onValueChange={(val) => handleAnswerSelect(copsoqQuestions[currentQuestionIndex].id, parseInt(val))}
                className="space-y-3 mb-8"
              >
                {answerOptions.map(opt => {
                  const qId = copsoqQuestions[currentQuestionIndex].id;
                  const isChecked = answers[qId] === opt.value;
                  return (
                    <div 
                      key={opt.value} 
                      onClick={() => handleAnswerSelect(qId, opt.value)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-purple-900/30 border-purple-500 text-white' 
                          : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="text-sm font-semibold">{opt.label}</span>
                      <RadioGroupItem value={opt.value.toString()} id={`opt-${opt.value}`} className="sr-only" />
                    </div>
                  );
                })}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex gap-4">
                <Button 
                  onClick={handleBack} 
                  variant="outline" 
                  className="flex-1 h-11 border-slate-800 hover:bg-slate-800 text-white rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>

                {currentQuestionIndex < copsoqQuestions.length - 1 ? (
                  <Button 
                    onClick={handleNext} 
                    className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1 h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg"
                  >
                    Enviar Mapeamento
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 BM Academy. Canal Seguro LGPD.</span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Respostas 100% confidenciais
          </span>
        </div>
      </footer>
    </div>
  );
}
