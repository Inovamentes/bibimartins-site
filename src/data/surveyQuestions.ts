export interface Question {
  id: number;
  text: string;
  dimension?: string;
}

export interface SurveyScale {
  title: string;
  description: string;
  questions: Question[];
}

export const copsoqQuestions: Question[] = [
  { id: 1, text: "Tem de trabalhar muito rápido?", dimension: "Exigências Quantitativas" },
  { id: 2, text: "O seu trabalho está distribuído de forma desigual, de modo que se acumula?", dimension: "Exigências Quantitativas" },
  { id: 3, text: "Tem tempo suficiente para realizar todas as suas tarefas?", dimension: "Exigências Quantitativas" },
  { id: 4, text: "Precisa de trabalhar horas extraordinárias frequentemente?", dimension: "Exigências Quantitativas" },
  { id: 5, text: "Tem de tomar decisões difíceis no seu trabalho?", dimension: "Exigências Cognitivas" },
  { id: 6, text: "O seu trabalho exige que tome decisões rápidas?", dimension: "Exigências Cognitivas" },
  { id: 7, text: "O seu trabalho exige um grande esforço de memória?", dimension: "Exigências Cognitivas" },
  { id: 8, text: "O seu trabalho exige que apresente ideias novas?", dimension: "Exigências Cognitivas" },
  { id: 9, text: "O seu trabalho é emocionalmente exigente?", dimension: "Exigências Emocionais" },
  { id: 10, text: "É confrontado com situações emocionalmente difíceis no trabalho?", dimension: "Exigências Emocionais" },
  { id: 11, text: "Envolve-se emocionalmente de forma intensa no seu trabalho?", dimension: "Exigências Emocionais" },
  { id: 12, text: "Tem influência sobre as decisões relativas ao seu trabalho?", dimension: "Influência e Desenvolvimento" },
  { id: 13, text: "Tem voz ativa na escolha de quem trabalha consigo ou na divisão de tarefas?", dimension: "Influência e Desenvolvimento" },
  { id: 14, text: "Pode decidir quando faz as suas pausas durante o dia?", dimension: "Influência e Desenvolvimento" },
  { id: 15, text: "Pode decidir o seu método de trabalho?", dimension: "Influência e Desenvolvimento" },
  { id: 16, text: "O seu trabalho permite-lhe aprender coisas novas?", dimension: "Influência e Desenvolvimento" },
  { id: 17, text: "Tem oportunidade de utilizar as suas capacidades e conhecimentos no dia a dia?", dimension: "Influência e Desenvolvimento" },
  { id: 18, text: "O seu trabalho tem significado e propósito para si?", dimension: "Significado e Compromisso" },
  { id: 19, text: "Sente-se motivado e empenhado no sucesso da sua empresa?", dimension: "Significado e Compromisso" },
  { id: 20, text: "Sente orgulho em dizer onde trabalha e o que faz?", dimension: "Significado e Compromisso" },
  { id: 21, text: "Sente-se seguro em relação à estabilidade do seu emprego?", dimension: "Insegurança no Trabalho" },
  { id: 22, text: "Preocupa-se em ser transferido de função ou local contra a sua vontade?", dimension: "Insegurança no Trabalho" },
  { id: 23, text: "Preocupa-se em ficar desempregado?", dimension: "Insegurança no Trabalho" },
  { id: 24, text: "Preocupa-se com a evolução tecnológica tornar as suas competências obsoletas?", dimension: "Insegurança no Trabalho" },
  { id: 25, text: "Sabe exatamente quais são as suas responsabilidades e limites?", dimension: "Clareza e Conflito de Papel" },
  { id: 26, text: "Sabe exatamente o que é esperado de si no trabalho?", dimension: "Clareza e Conflito de Papel" },
  { id: 27, text: "Recebe orientações contraditórias ou incompatíveis de pessoas diferentes?", dimension: "Clareza e Conflito de Papel" },
  { id: 28, text: "Sente que o seu trabalho é devidamente reconhecido e valorizado pela chefia?", dimension: "Liderança e Justiça" },
  { id: 29, text: "A sua chefia apoia o seu desenvolvimento profissional e pessoal?", dimension: "Liderança e Justiça" },
  { id: 30, text: "A sua chefia é boa a planear, coordenar e distribuir o trabalho da equipe?", dimension: "Liderança e Justiça" },
  { id: 31, text: "Existe um bom espírito de equipa e colaboração entre os seus colegas?", dimension: "Suporte Social e Relações" },
  { id: 32, text: "Há cooperação e respeito mútuo entre os diferentes departamentos?", dimension: "Suporte Social e Relações" },
  { id: 33, text: "Os seus colegas de trabalho apoiam-no e ajudam-no quando precisa?", dimension: "Suporte Social e Relações" },
  { id: 34, text: "A chefia apoia-o e ouve os seus problemas quando precisa?", dimension: "Suporte Social e Relações" },
  { id: 35, text: "As informações importantes são partilhadas atempadamente na empresa?", dimension: "Comunicação e Confiança" },
  { id: 36, text: "As decisões da empresa são tomadas de forma justa, transparente e ética?", dimension: "Comunicação e Confiança" },
  { id: 37, text: "Os conflitos ou exigências de trabalho afetam negativamente a sua vida familiar/pessoal?", dimension: "Interface Trabalho-Família" },
  { id: 38, text: "Sente-se exausto ou sem energia após o expediente de trabalho?", dimension: "Saúde Mental e Stress" },
  { id: 39, text: "Tem dificuldades em adormecer ou relaxar à noite devido a pensamentos sobre o trabalho?", dimension: "Saúde Mental e Stress" },
  { id: 40, text: "Sente stress, irritabilidade ou ansiedade constante relacionada às cobranças?", dimension: "Saúde Mental e Stress" },
  { id: 41, text: "Sente-se esgotado ou próximo do seu limite físico e mental (sintomas de Burnout)?", dimension: "Saúde Mental e Stress" }
];

export const hseQuestions: Question[] = [
  { id: 1, text: "Tenho clareza sobre o que é esperado de mim no meu cargo.", dimension: "Papel (Role)" },
  { id: 2, text: "Posso decidir a velocidade ou o ritmo em que realizo meu trabalho.", dimension: "Controle (Control)" },
  { id: 3, text: "Recebo o apoio de que preciso por parte dos meus colegas de equipe.", dimension: "Suporte dos Colegas (Peer Support)" },
  { id: 4, text: "Sou submetido a cobranças e prazos irreais ou inatingíveis.", dimension: "Demanda (Demands)" },
  { id: 5, text: "Minha chefia me ouve e apoia quando surgem dificuldades.", dimension: "Suporte da Chefia (Manager Support)" },
  { id: 6, text: "Existe hostilidade, fofoca ou comportamentos de exclusão no meu setor.", dimension: "Relacionamentos (Relationships)" },
  { id: 7, text: "Quando ocorrem mudanças na empresa, sou consultado ou informado a tempo.", dimension: "Mudança (Change)" },
  { id: 8, text: "Tenho flexibilidade para organizar meu próprio horário e pausas.", dimension: "Controle (Control)" },
  { id: 9, text: "Preciso negligenciar algumas tarefas para dar conta de outras mais urgentes.", dimension: "Demanda (Demands)" },
  { id: 10, text: "Sei como encaminhar reclamações ou resolver atritos de forma justa na empresa.", dimension: "Relacionamentos (Relationships)" }
];

export const clinicalQuestions: Question[] = [
  { id: 1, text: "O ambiente de trabalho causa sobrecarga sensorial (excesso de ruídos, luzes fortes ou interrupções constantes)?", dimension: "Sobrecarga Sensorial" },
  { id: 2, text: "A empresa oferece adaptações razoáveis ou flexibilidade física/cognitiva para colaboradores neurodivergentes?", dimension: "Suporte à Neurodiversidade" },
  { id: 3, text: "Sinto necessidade de mascarar ('masking') intensamente meus traços ou comportamentos para ser aceito na equipe?", dimension: "Segurança Psicológica" },
  { id: 4, text: "Percebo flutuações severas de humor, taquicardia ou crises de pânico motivadas pela rotina corporativa.", dimension: "Sintomatologia Clínica" },
  { id: 5, text: "Sinto fadiga social extrema a ponto de evitar interações básicas de trabalho para preservar meu emocional.", dimension: "Exaustão Relacional" },
  { id: 6, text: "A liderança direta demonstra conhecimento básico sobre saúde mental e acolhimento de crises.", dimension: "Liderança Inclusiva" },
  { id: 7, text: "O ritmo de demandas impede a prática de rotinas mínimas de autorregulação e pausas terapêuticas.", dimension: "Autorregulação" }
];
