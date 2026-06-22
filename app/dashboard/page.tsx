import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";

export const dynamic = "force-dynamic";

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

  // MOCK DATA: Se a tabela modules estiver vazia, usaremos dados fictícios para visualização.
  let modules = dbModules && dbModules.length > 0 ? dbModules : [
    { id: "1", title: "Introdução ao Python", description: "O básico da sintaxe e como o Python pensa.", order_index: 1 },
    { id: "2", title: "Variáveis e Tipos de Dados", description: "Como guardar informações na memória.", order_index: 2 },
    { id: "3", title: "Estruturas Condicionais", description: "Ensinando o seu código a tomar decisões (if/else).", order_index: 3 },
    { id: "4", title: "Laços de Repetição", description: "Repetindo ações com for e while.", order_index: 4 },
  ];

  let foundCurrent = false;

  const roadmap = modules.map((mod, index) => {
    const userProg = progress?.find((p) => p.module_id === mod.id) || {
      understanding_percentage: 0,
      is_completed: false,
    };

    let status: "completed" | "current" | "locked" = "locked";

    if (userProg.is_completed) {
      status = "completed";
    } else if (!foundCurrent) {
      status = "current";
      foundCurrent = true;
    }

    return {
      ...mod,
      progress: userProg,
      status,
    };
  });

  const metaName = user?.user_metadata?.full_name;
  const dbName = profile?.full_name;
  const fullName = dbName || metaName;
  const firstName = fullName ? fullName.split(" ")[0] : "Estudante";

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

      {dbModules?.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-500 p-4 rounded-xl text-sm border border-amber-200 dark:border-amber-900/50">
          <strong>Aviso:</strong> Nenhum módulo foi encontrado no banco de dados. Exibindo dados de exemplo. Adicione módulos na tabela <code>modules</code> para usá-los de verdade.
        </div>
      )}

      <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-4 md:ml-8 flex flex-col gap-12 pb-12">
        {roadmap.map((item, index) => {
          return (
            <div key={item.id} className="relative pl-10 md:pl-12 group">
              {/* Node/Ícone da Timeline */}
              <div 
                className={`absolute left-[-17px] top-1 h-8 w-8 rounded-full border-4 border-neutral-50 dark:border-neutral-950 flex items-center justify-center transition-colors duration-300
                  ${item.status === "completed" ? "bg-emerald-500 text-white" : 
                    item.status === "current" ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 ring-4 ring-neutral-900/10 dark:ring-white/10" : 
                    "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"}`}
              >
                {item.status === "completed" && <Check className="w-4 h-4" />}
                {item.status === "current" && <Play className="w-3 h-3 ml-0.5" />}
                {item.status === "locked" && <Lock className="w-3 h-3" />}
              </div>

              {/* Cartão do Módulo */}
              <Link 
                href={item.status === "locked" ? "#" : `/lesson/${item.id}`}
                className={`block p-6 rounded-2xl border transition-all duration-300
                  ${item.status === "current" 
                    ? "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 shadow-xl shadow-neutral-200/50 dark:shadow-none hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1" 
                    : item.status === "completed"
                    ? "bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-900"
                    : "bg-transparent border-transparent opacity-60 cursor-not-allowed"
                  }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h3 className={`font-semibold text-lg ${item.status === "locked" ? "text-neutral-500 dark:text-neutral-500" : "text-neutral-900 dark:text-white"}`}>
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
                            className={`h-full rounded-full transition-all duration-1000 ${item.status === "completed" ? "bg-emerald-500" : "bg-neutral-900 dark:bg-white"}`} 
                            style={{ width: `${item.progress.understanding_percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
