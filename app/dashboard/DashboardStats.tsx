import { Target, TrendingUp, CheckCircle2, Zap } from "lucide-react";

// ── Sistema de níveis por usuário ──
// XP interpretável (Lógica Booleana / rastreamento de conhecimento):
//   +10 XP por resposta correta   +50 XP por módulo concluído
// Cada nível custa 100 XP.
const XP_PER_CORRECT = 10;
const XP_PER_COMPLETED_MODULE = 50;
const XP_PER_LEVEL = 100;

const LEVEL_TITLES = [
  "Novato",
  "Iniciante",
  "Aprendiz",
  "Praticante",
  "Codificador",
  "Programador Jr.",
  "Programador",
  "Programador Pleno",
  "Especialista",
  "Mestre Python",
];

export type DashboardStatsProps = {
  correctAnswers: number;
  answeredCount: number;
  completedModules: number;
  totalModules: number;
  averageMastery: number;
  streakDays: number;
};

// Frase motivacional contextual: reage ao estado do aluno e, na falta de um
// gatilho específico, rotaciona uma frase por dia para manter o dashboard vivo.
function getMotivationalPhrase({
  streakDays,
  accuracy,
  answeredCount,
  completedModules,
  totalModules,
}: {
  streakDays: number;
  accuracy: number;
  answeredCount: number;
  completedModules: number;
  totalModules: number;
}): string {
  if (answeredCount === 0)
    return "Todo especialista já foi iniciante. Responda seu primeiro desafio hoje! 🚀";
  if (completedModules === totalModules)
    return "Currículo dominado! Você transformou esforço em maestria. 🏆";
  if (streakDays >= 7)
    return `${streakDays} dias seguidos! Sua consistência já virou talento. 🔥`;
  if (streakDays >= 3)
    return `Sequência de ${streakDays} dias — não quebre a corrente agora! 💪`;
  if (accuracy >= 80)
    return "Sua taxa de acertos está afiada. Continue nesse ritmo! 🎯";

  const rotating = [
    "Um pequeno passo hoje vale mais que um grande amanhã. Bora praticar!",
    "Errar faz parte: cada erro corrigido é conhecimento que fica.",
    "Consistência vence intensidade. Um módulo de cada vez.",
    "O código não se aprende de uma vez, se aprende todo dia. Vamos lá!",
    "Foco no progresso, não na perfeição. Você está evoluindo.",
  ];
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return rotating[dayIndex % rotating.length];
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        <span className={`h-8 w-8 rounded-xl flex items-center justify-center ${accent}`}>
          {icon}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
          {value}
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">{hint}</span>
      </div>
    </div>
  );
}

export function DashboardStats({
  correctAnswers,
  answeredCount,
  completedModules,
  totalModules,
  averageMastery,
  streakDays,
}: DashboardStatsProps) {
  const accuracy = answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;

  const totalXp = correctAnswers * XP_PER_CORRECT + completedModules * XP_PER_COMPLETED_MODULE;
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  const hasStreak = streakDays > 0;
  const phrase = getMotivationalPhrase({
    streakDays,
    accuracy,
    answeredCount,
    completedModules,
    totalModules,
  });

  return (
    <section className="flex flex-col gap-4">
      {/* Foguinho de sequência + frase motivacional */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <div
          className={`flex items-center gap-3 rounded-xl px-4 py-3 shrink-0 ${
            hasStreak
              ? "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/50"
              : "bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
          }`}
        >
          <span className={`text-3xl leading-none ${hasStreak ? "animate-pulse" : "grayscale opacity-50"}`}>
            🔥
          </span>
          <div className="flex flex-col leading-tight">
            <span
              className={`text-2xl font-bold tabular-nums ${
                hasStreak ? "text-amber-700 dark:text-amber-400" : "text-neutral-400 dark:text-neutral-500"
              }`}
            >
              {streakDays}
            </span>
            <span
              className={`text-xs font-medium ${
                hasStreak ? "text-amber-600/80 dark:text-amber-500/80" : "text-neutral-400 dark:text-neutral-500"
              }`}
            >
              {streakDays === 1 ? "dia de sequência" : "dias de sequência"}
            </span>
          </div>
        </div>
        <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {phrase}
        </p>
      </div>

      {/* Cartão de nível (hero) */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex flex-col items-center justify-center leading-none">
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">Nível</span>
              <span className="text-2xl font-bold tabular-nums">{level}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Seu nível
              </span>
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {levelTitle}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">
                {totalXp} XP acumulado
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 sm:pl-6 sm:border-l border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-500 dark:text-neutral-400">
                Progresso para o nível {level + 1}
              </span>
              <span className="tabular-nums text-neutral-400 dark:text-neutral-500">
                {xpIntoLevel}/{XP_PER_LEVEL} XP
              </span>
            </div>
            <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-neutral-900 dark:bg-white transition-all duration-1000"
                style={{ width: `${xpIntoLevel}%` }}
              />
            </div>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              +{XP_PER_CORRECT} XP por acerto · +{XP_PER_COMPLETED_MODULE} XP por módulo concluído
            </span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          icon={<Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          accent="bg-emerald-100 dark:bg-emerald-900/40"
          label="Taxa de acertos"
          value={`${accuracy}%`}
          hint={answeredCount > 0 ? `${correctAnswers} de ${answeredCount} respostas` : "Sem respostas ainda"}
        />
        <KpiCard
          icon={<TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          accent="bg-blue-100 dark:bg-blue-900/40"
          label="Domínio médio"
          value={`${averageMastery}%`}
          hint="média no currículo"
        />
        <KpiCard
          icon={<CheckCircle2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />}
          accent="bg-neutral-100 dark:bg-neutral-800"
          label="Módulos concluídos"
          value={`${completedModules}/${totalModules}`}
          hint={`${totalModules - completedModules} restantes`}
        />
      </div>
    </section>
  );
}
