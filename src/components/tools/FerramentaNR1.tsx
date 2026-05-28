import { useState } from 'react';
import { Button } from '@/components/ui/button';

const questions = [
  { id: 1, text: "Sente que o volume de trabalho exigido pela empresa ultrapassa sua capacidade mental saudável?" },
  { id: 2, text: "As metas e expectativas sobre sua função são confusas, gerando insegurança constante?" },
  { id: 3, text: "Sente falta de apoio psicológico ou estrutural por parte das lideranças imediatas?" },
  { id: 4, text: "O clima da equipe envolve fofocas, hostilidade ou exclusão que prejudicam seu emocional?" },
  { id: 5, text: "Percebe sintomas físicos (taquicardia, insônia, dores) relacionados exclusivamente ao ambiente de trabalho?" }
];

export function FerramentaNR1() {
  const [responses, setResponses] = useState<number[]>(Array(5).fill(-1));

  const handleScore = (qId: number, value: number) => {
    const newResponses = [...responses];
    newResponses[qId - 1] = value;
    setResponses(newResponses);
  };

  const getScore = () => {
    const answered = responses.filter(v => v !== -1);
    if (answered.length === 0) return 0;
    return answered.reduce((a, b) => a + b, 0) / 5;
  };

  const score = getScore();
  const totalResponded = responses.filter(v => v !== -1).length;
  
  const isHighRisk = score >= 70;
  const isMediumRisk = score >= 40 && score < 70;
  
  const progressColor = isHighRisk ? "bg-red-500" : isMediumRisk ? "bg-yellow-500" : "bg-green-500";
  const textColor = isHighRisk ? "text-red-500" : isMediumRisk ? "text-yellow-500" : "text-green-500";

  const getInsight = () => {
    if (totalResponded < 5) {
      return { text: "Responda todas as perguntas para ver a análise de risco.", type: "info" };
    }
    if (isHighRisk) {
      return { text: "Risco Psicossocial ALTO. O ambiente organizacional apresenta características tóxicas severas que podem levar a Burnout rápido e problemas físicos. Recomenda-se intervenção sistêmica na equipe e liderança.", type: "danger" };
    }
    if (isMediumRisk) {
      return { text: "Risco Psicossocial MÉDIO. Atenção a sinais de alerta. Há atritos na comunicação ou expectativas irreais que começam a afetar a saúde mental.", type: "warning" };
    }
    return { text: "Risco Psicossocial BAIXO. O ambiente atual parece ser psicologicamente seguro e com suporte adequado.", type: "success" };
  };

  const insight = getInsight();

  const handleCopyReport = () => {
    const report = `RELATÓRIO DE MAPEAMENTO NR-1 (RISCO PSICOSSOCIAL)\n\n` +
      `Risco Organizacional Médio: ${Math.round(score)}%\n\n` +
      `Análise: ${insight.text}`;
    navigator.clipboard.writeText(report);
    alert('Relatório Copiado com Sucesso!');
  };

  return (
    <div className="bg-slate-900 text-slate-50 p-4 md:p-8 rounded-xl h-[80vh] overflow-y-auto">
      <header className="mb-8 text-center md:text-left">
        <div className="inline-block px-3 py-1 rounded-full bg-purple-900/30 border border-purple-800 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
          Assessment NR-1
        </div>
        <h1 className="text-3xl font-extrabold mb-4">Risco <span className="text-purple-500">Psicossocial</span> no Trabalho</h1>
        <p className="text-slate-400 max-w-2xl text-sm">
          Este instrumento mede os níveis de risco psicossocial conforme as exigências da NR-1, avaliando fatores organizacionais que podem levar ao esgotamento profissional (Burnout) e como o ambiente impacta a neurodivergência.
        </p>
      </header>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="p-6 rounded-2xl border-l-4 border-purple-500 bg-purple-900/10">
            <h3 className="text-lg font-bold text-purple-400 mb-6 flex items-center uppercase tracking-tight">
              Análise Organizacional
            </h3>
            {questions.map(q => (
              <div key={q.id} className="mb-6 border-b border-slate-700/50 pb-4 last:border-0">
                <p className="text-sm text-slate-200 mb-3">{q.id}. {q.text}</p>
                <div className="flex gap-4">
                  {[
                    { l: 'Nunca/Raro', v: 0 },
                    { l: 'Às vezes', v: 50 },
                    { l: 'Frequente', v: 100 }
                  ].map(opt => (
                    <label key={opt.v} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name={`q${q.id}`} 
                        checked={responses[q.id - 1] === opt.v}
                        onChange={() => handleScore(q.id, opt.v)} 
                        className="w-4 h-4 text-purple-500 bg-slate-900 border-slate-700 focus:ring-purple-500" 
                      />
                      <span className="text-xs text-slate-400 group-hover:text-purple-300 transition">{opt.l}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="lg:sticky lg:top-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold mb-8 text-center text-white italic">Nível de Risco (NR-1)</h3>
            
            <div className="flex flex-col items-center justify-center mb-8">
              <span className={`text-6xl font-black ${textColor} mb-4`}>
                {Math.round(score)}%
              </span>
              <div className="w-full bg-slate-700 rounded-full h-4 mb-2 overflow-hidden">
                <div className={`h-4 transition-all duration-1000 ${progressColor}`} style={{ width: `${score}%` }}></div>
              </div>
              <div className="flex justify-between w-full text-[10px] text-slate-500 uppercase font-bold">
                <span>0% (Seguro)</span>
                <span>100% (Tóxico)</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-purple-400 uppercase mb-2">Diagnóstico Ambiental</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium mb-2">{insight.text}</p>
              </div>
              <Button onClick={handleCopyReport} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
                Copiar Relatório NR-1
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
