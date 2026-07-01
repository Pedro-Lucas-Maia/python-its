import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { SeedModulesButton } from "./SeedModulesButton";
import { DashboardStats } from "./DashboardStats";

export const dynamic = "force-dynamic";

// Conta dias-calendário consecutivos com atividade, terminando em hoje.
// Se o aluno ainda não praticou hoje mas praticou ontem, a sequência
// continua válida (só quebra depois de um dia inteiro sem atividade).
function computeStreak(timestamps: (string | null)[]): number {
  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const activeDays = new Set(
    timestamps
      .filter((t): t is string => !!t)
      .map((t) => dayKey(new Date(t)))
  );
  if (activeDays.size === 0) return 0;

  const cursor = new Date();
  // Tolera o dia de hoje ainda "em branco" começando a contagem por ontem.
  if (!activeDays.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!activeDays.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (activeDays.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: dbModules } = await supabase
    .from("modules")
    .select("*")
    .order("order_index", { ascending: true });

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id);

  // Respostas registradas (para os KPIs de taxa de acertos e sistema de níveis)
  const { data: interactions } = await supabase
    .from("interactions")
    .select("is_correct, created_at")
    .eq("user_id", user.id)
    .not("user_answer", "is", null);

  const answeredCount = interactions?.length ?? 0;
  const correctAnswers = interactions?.filter((i) => i.is_correct).length ?? 0;
  const completedModules = progress?.filter((p) => p.is_completed).length ?? 0;

  // Sequência de dias consecutivos com atividade (o "foguinho")
  const streakDays = computeStreak(interactions?.map((i) => i.created_at) ?? []);

  const metaName = user?.user_metadata?.full_name;
  const dbName = profile?.full_name;
  const fullName = dbName || metaName;
  const firstName = fullName ? fullName.split(" ")[0] : "Estudante";

  // Sem módulos: mostrar aviso com botão de configuração
  if (!dbModules || dbModules.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Olá, {firstName}.
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Continue sua jornada de aprendizado em Python.
          </p>
        </header>

        <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-500 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex flex-col gap-4">
          <div>
            <p className="font-semibold mb-1">Nenhum módulo encontrado</p>
            <p className="text-sm opacity-90">
              O banco de dados ainda não tem os módulos do currículo. Clique abaixo para configurar os{" "}
              <strong>13 módulos</strong> do pré-projeto (Lógica de Programação + Sintaxe Python).
            </p>
            <p className="text-xs mt-2 opacity-70">
              Se preferir configurar manualmente, use o arquivo <code>supabase/seed.sql</code> no Supabase SQL Editor.
            </p>
          </div>
          <SeedModulesButton />
        </div>
      </div>
    );
  }

  // Monta o roadmap com lógica de pré-requisito baseada em order_index
  // Um módulo está desbloqueado quando o módulo de order_index - 1 está completed.
  const roadmap = dbModules.map((mod) => {
    const userProg = progress?.find((p) => p.module_id === mod.id) ?? {
      understanding_percentage: 0,
      is_completed: false,
    };

    const prerequisite = dbModules.find((m) => m.order_index === mod.order_index - 1);
    const prereqCompleted = prerequisite
      ? !!(progress?.find((p) => p.module_id === prerequisite.id)?.is_completed)
      : true;

    let status: "completed" | "current" | "locked";
    if (userProg.is_completed) {
      status = "completed";
    } else if (prereqCompleted) {
      status = "current";
    } else {
      status = "locked";
    }

    return { ...mod, progress: userProg, status };
  });

  // Domínio médio no currículo (módulos sem progresso contam como 0%)
  const totalMasteryPct = dbModules.reduce((sum, mod) => {
    const p = progress?.find((pr) => pr.module_id === mod.id);
    return sum + (p?.understanding_percentage ?? 0);
  }, 0);
  const averageMastery = dbModules.length > 0 ? Math.round(totalMasteryPct / dbModules.length) : 0;

  return (
    <div className="flex flex-col gap-12 animate-fade-in">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Olá, {firstName}.
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Continue sua jornada de aprendizado em Python.
        </p>
      </header>

      <DashboardStats
        correctAnswers={correctAnswers}
        answeredCount={answeredCount}
        completedModules={completedModules}
        totalModules={dbModules.length}
        averageMastery={averageMastery}
        streakDays={streakDays}
      />

      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 -mb-6">
        Seu roadmap
      </h2>

      <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-4 md:ml-8 flex flex-col gap-8 pb-12">
        {roadmap.map((item, index) => {
          const isClusterBoundary = item.order_index === 5;
          return (
            <div key={item.id}>
              {/* Separador de cluster entre módulo 4 e 5 */}
              {isClusterBoundary && (
                <div className="relative pl-10 md:pl-12 mb-6">
                  <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-700 border-4 border-neutral-50 dark:border-neutral-950" />
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                      Sintaxe Python
                    </span>
                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                </div>
              )}

              {index === 0 && (
                <div className="relative pl-10 md:pl-12 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                      Lógica de Programação
                    </span>
                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                </div>
              )}

              <div className="relative pl-10 md:pl-12 group">
                {/* Node da timeline */}
                <div
                  className={`absolute left-[-17px] top-4 h-8 w-8 rounded-full border-4 border-neutral-50 dark:border-neutral-950 flex items-center justify-center transition-colors duration-300
                    ${item.status === "completed"
                      ? "bg-emerald-500 text-white"
                      : item.status === "current"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 ring-4 ring-neutral-900/10 dark:ring-white/10"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
                    }`}
                >
                  {item.status === "completed" && <Check className="w-4 h-4" />}
                  {item.status === "current" && <Play className="w-3 h-3 ml-0.5" />}
                  {item.status === "locked" && <Lock className="w-3 h-3" />}
                </div>

                {/* Cartão do módulo */}
                <Link
                  href={item.status === "locked" ? "#" : `/lesson/${item.id}`}
                  className={`block p-6 rounded-2xl border transition-all duration-300
                    ${item.status === "current"
                      ? "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 shadow-xl shadow-neutral-200/50 dark:shadow-none hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1"
                      : item.status === "completed"
                      ? "bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-900"
                      : "bg-transparent border-transparent opacity-50 cursor-not-allowed"
                    }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <h3
                        className={`font-semibold text-lg ${
                          item.status === "locked"
                            ? "text-neutral-500 dark:text-neutral-500"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {item.order_index}. {item.title}
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-lg">
                        {item.description}
                      </p>
                    </div>

                    {item.status !== "locked" && (
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            {item.progress.understanding_percentage}% dominado
                          </span>
                          <div className="h-1.5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                item.status === "completed"
                                  ? "bg-emerald-500"
                                  : item.progress.understanding_percentage >= 75
                                  ? "bg-amber-500"
                                  : "bg-neutral-900 dark:bg-white"
                              }`}
                              style={{ width: `${item.progress.understanding_percentage}%` }}
                            />
                          </div>
                          {item.progress.understanding_percentage >= 75 && item.status !== "completed" && (
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                              🏆 Desafio Final disponível
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
