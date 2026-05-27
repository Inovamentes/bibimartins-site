import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const questions = [
  { id: 1, dim: 0, text: "Com que frequência você tem dificuldade para finalizar detalhes de um projeto quando as partes criativas já foram feitas?" },
  { id: 2, dim: 0, text: "Sente dificuldade em organizar tarefas em ordem de prioridade real, achando que 'tudo é urgente'?" },
  { id: 3, dim: 0, text: "Frequentemente adia ou evita começar tarefas que exigem muita atenção aos detalhes?" },
  { id: 4, dim: 0, text: "Precisa de prazos extremamente curtos (adrenalina) para conseguir produzir com eficiência?" },
  { id: 5, dim: 0, text: "Costuma perder o fio da meada em reuniões longas se não estiver ativamente falando/anotando?" },
  { id: 6, dim: 1, text: "Luzes fortes, barulhos de escritório (conversas, telefones) ou texturas drenam sua energia rapidamente?" },
  { id: 7, dim: 1, text: "Necessita de isolamento total e silêncio após um dia intenso de interações para 'recarregar'?" },
  { id: 8, dim: 1, text: "Sente um 'apagão' mental ou travamento físico quando há muitos estímulos ao mesmo tempo?" },
  { id: 9, dim: 1, text: "Você repara em pequenos sons ou detalhes visuais no ambiente que outras pessoas não percebem?" },
  { id: 10, dim: 1, text: "Ambientes desorganizados visualmente afetam drasticamente sua capacidade de trabalhar?" },
  { id: 11, dim: 2, text: "Frequentemente percebe que foi 'grosso' ou ríspido sem ter tido essa intenção?" },
  { id: 12, dim: 2, text: "Acha exaustivo e confuso decifrar o que os líderes querem dizer 'nas entrelinhas'?" },
  { id: 13, dim: 2, text: "Faz um grande esforço consciente ('masking') para fazer contato visual ou parecer interessado na fala de outros?" },
  { id: 14, dim: 2, text: "Prefere orientações escritas e precisas do que reuniões de alinhamento abertas?" },
  { id: 15, dim: 2, text: "Sente dificuldade de entender a 'política do escritório' e por que regras lógicas não são seguidas?" },
  { id: 16, dim: 3, text: "Mudanças súbitas de planos ou de processos causam profunda irritação ou ansiedade severa?" },
  { id: 17, dim: 3, text: "Sente necessidade de criar 'scripts' mentais antes de fazer ligações ou entrar em reuniões?" },
  { id: 18, dim: 3, text: "Tem um forte senso de justiça e não consegue 'deixar passar' regras sendo quebradas pela equipe?" },
  { id: 19, dim: 3, text: "Costuma ficar focado intensamente (hiperfoco) em um assunto a ponto de esquecer de comer ou pausar?" },
  { id: 20, dim: 3, text: "Projetos sem escopo claro e sem passos definidos causam paralisia inicial?" },
  { id: 21, dim: 4, text: "Sente uma inquietação interna constante, como se estivesse movido por um motor não desligável?" },
  { id: 22, dim: 4, text: "Costuma interromper os outros durante reuniões para terminar as frases deles?" },
  { id: 23, dim: 4, text: "Toma decisões impulsivas e depois se arrepende, especialmente sob estresse?" },
  { id: 24, dim: 4, text: "Oscila entre dias de hiperprodutividade insana e dias de exaustão e procrastinação profunda?" },
  { id: 25, dim: 4, text: "Tem dificuldade crônica em relaxar a mente ou 'desligar' durante finais de semana?" },
  { id: 26, dim: 5, text: "[NR-1] Sente que o volume de trabalho exigido pela empresa ultrapassa sua capacidade mental saudável?" },
  { id: 27, dim: 5, text: "[NR-1] As metas e expectativas sobre sua função são confusas, gerando insegurança constante?" },
  { id: 28, dim: 5, text: "[NR-1] Sente falta de apoio psicológico ou estrutural por parte das lideranças imediatas?" },
  { id: 29, dim: 5, text: "[NR-1] O clima da equipe envolve fofocas, hostilidade ou exclusão que prejudicam seu emocional?" },
  { id: 30, dim: 5, text: "[NR-1] Percebe sintomas físicos (taquicardia, insônia, dores) relacionados exclusivamente ao ambiente de trabalho?" }
];

const dims = [
  "Déficit Executivo e Foco",
  "Sobrecarga Sensorial",
  "Fadiga de Interação Social",
  "Rigidez e Hiperfoco",
  "Impulsividade e Inquietação",
  "Risco Psicossocial (NR-1)"
];

export function MapaCognitivo() {
  const [responses, setResponses] = useState<number[]>(Array(30).fill(-1));

  const handleScore = (qId: number, value: number) => {
    const newResponses = [...responses];
    newResponses[qId - 1] = value;
    setResponses(newResponses);
  };

  const getScores = () => {
    const scores = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; i++) {
      const dimQuestions = questions.filter(q => q.dim === i);
      const dimResponses = dimQuestions.map(q => responses[q.id - 1]).filter(v => v !== -1);
      if (dimResponses.length > 0) {
        scores[i] = dimResponses.reduce((a, b) => a + b, 0) / dimQuestions.length;
      }
    }
    return scores;
  };

  const scores = getScores();

  const chartData = dims.map((d, i) => {
    let name = d;
    // split label for better radar display
    if(name.length > 15) {
      const parts = name.split(' ');
      name = parts.slice(0, 2).join(' ') + '\n' + parts.slice(2).join(' ');
    }
    return {
      subject: name,
      A: scores[i] || 0,
      fullMark: 100,
    };
  });

  const totalResponded = responses.filter(v => v !== -1).length;
  const isHighRiskNR1 = scores[5] >= 70;
  const radarColor = isHighRiskNR1 ? "#ef4444" : "#06b6d4";

  const getInsight = () => {
    if (totalResponded < 15) {
      return {
        text: "Continue respondendo para análise probabilística...",
        flags: [{ type: 'info', msg: 'Aguardando dados...' }]
      };
    }

    const adhdProb = (scores[0] + scores[4]) / 2;
    const asdProb = (scores[1] + scores[2] + scores[3]) / 3;
    const nr1Risk = scores[5];

    const flags = [];
    if (adhdProb >= 70) flags.push({ type: 'danger', msg: 'Probabilidade TDAH: Padrão de déficit executivo e hiperatividade elevado. Recomenda-se orientação para avaliação neuropsicológica e estruturação de rotinas.' });
    if (asdProb >= 70) flags.push({ type: 'danger', msg: 'Probabilidade TEA / Sensorial: Alta correlação com sobrecarga sensorial e rigidez. O ambiente de trabalho pode precisar de adaptações.' });
    if (nr1Risk >= 70) flags.push({ type: 'warning', msg: 'Alerta NR-1 (Clima/Burnout): O ambiente organizacional atual apresenta altíssimo risco psicossocial. Intervenção sistêmica recomendada.' });

    if (flags.length === 0) {
      return {
        text: "Seu perfil apresenta funcionamento majoritariamente neurotípico e resiliência ao ambiente atual.",
        flags: [{ type: 'success', msg: 'Nenhum alerta severo ativado.' }]
      };
    }

    return {
      text: "ATENÇÃO: Este instrumento não é diagnóstico. Os resultados indicam alta probabilidade (Valor Preditivo Positivo) sugerindo necessidade de suporte.",
      flags
    };
  };

  const insight = getInsight();

  const handleCopyReport = () => {
    const report = `RELATÓRIO DE MAPEAMENTO - MÉTODO SINAPSE 360\nCONFIDENCIAL - NÃO É DIAGNÓSTICO CLÍNICO\n\n` +
      dims.map((d, i) => `${d}: ${Math.round(scores[i])}%`).join('\n') +
      `\n\nResultados Preditivos:\nTDAH (Função Executiva): ${Math.round((scores[0] + scores[4]) / 2)}%\n` +
      `TEA (Sensorial/Social): ${Math.round((scores[1] + scores[2] + scores[3]) / 3)}%\n` +
      `Risco NR-1 (Clima Org): ${Math.round(scores[5])}%\n`;
    navigator.clipboard.writeText(report);
    alert('Relatório Copiado com Sucesso!');
  };

  return (
    <div className="bg-slate-900 text-slate-50 p-4 md:p-8 rounded-xl h-[80vh] overflow-y-auto">
      <header className="mb-8 text-center md:text-left">
        <div className="inline-block px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
          Pilar 1: Autoconsciência Cognitiva & Clima (NR-1)
        </div>
        <h1 className="text-3xl font-extrabold mb-4">Mapa de <span className="text-cyan-500">Funcionamento</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {dims.map((dimName, dIndex) => {
            const isNR1 = dIndex === 5;
            const borderClass = isNR1 ? "border-purple-500" : "border-cyan-500";
            const textClass = isNR1 ? "text-purple-400" : "text-cyan-400";
            const bgClass = isNR1 ? "bg-purple-900/10" : "bg-slate-800/30";

            return (
              <div key={dIndex} className={`p-6 rounded-2xl border-l-4 ${borderClass} ${bgClass}`}>
                <h3 className={`text-lg font-bold ${textClass} mb-6 flex items-center uppercase tracking-tight`}>
                  <span className="mr-2 text-2xl">0{dIndex + 1}</span> {dimName}
                </h3>
                {questions.filter(q => q.dim === dIndex).map(q => (
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
                            className="w-4 h-4 text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500" 
                          />
                          <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition">{opt.l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="relative">
          <div className="sticky top-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-center text-white italic">Seu Mapa Sinapse 360</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar
                    name="Probabilidade"
                    dataKey="A"
                    stroke={radarColor}
                    fill={radarColor}
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-cyan-400 uppercase mb-2">Insight Analítico Preditivo</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-4">{insight.text}</p>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-700 pt-3">
                  {insight.flags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`mt-0.5 ${f.type === 'danger' ? 'text-red-500' : f.type === 'warning' ? 'text-purple-500' : 'text-green-500'}`}>
                        {f.type === 'danger' ? '▶' : f.type === 'warning' ? '⚠️' : '●'}
                      </span>
                      <div>{f.msg}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <Button onClick={handleCopyReport} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                Copiar Relatório
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
