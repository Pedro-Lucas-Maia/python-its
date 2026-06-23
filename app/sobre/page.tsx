import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "Como Funciona — ITS IMD UFRN",
  description:
    "Entenda a arquitetura, os modelos e os fundamentos teóricos do Sistema de Tutoria Inteligente do IMD/UFRN para aprendizado de Python.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function NodeBadge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "root" | "leaf" }) {
  const styles = {
    default: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700",
    root: "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border border-neutral-900 dark:border-white font-semibold",
    leaf: "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${styles[variant]}`}>
      {children}
    </span>
  );
}

function RuleRow({ condition, action }: { condition: string; action: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 shrink-0">SE</span>
        <span className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
          {condition}
        </span>
      </div>
      <span className="text-neutral-400 text-xs hidden sm:block">→</span>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 shrink-0">ENTÃO</span>
        <span className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
          {action}
        </span>
      </div>
    </div>
  );
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800 flex flex-col transition-colors duration-300">
      {/* Nav */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto w-full">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ITS IMD UFRN
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all"
          >
            Cadastrar
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 sm:py-24 w-full flex flex-col gap-24">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <span className="flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
            Documentação Técnica
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
            Como funciona<br />
            <span className="text-neutral-400 dark:text-neutral-500">o ITS IMD UFRN</span>
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Uma visão completa da arquitetura, dos modelos e dos fundamentos teóricos que tornam
            este sistema adaptativo ao aprendizado de cada aluno.
          </p>
        </section>

        {/* ── O que é um ITS ── */}
        <section>
          <SectionLabel>Conceito</SectionLabel>
          <SectionTitle>O que é um Sistema de Tutoria Inteligente?</SectionTitle>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
            Um ITS (<em>Intelligent Tutoring System</em>) é um agente inteligente que possui conhecimento sobre
            o <strong className="text-neutral-800 dark:text-neutral-200">conteúdo</strong>, sobre o{" "}
            <strong className="text-neutral-800 dark:text-neutral-200">estado cognitivo dos estudantes</strong> e sobre
            as <strong className="text-neutral-800 dark:text-neutral-200">estratégias pedagógicas</strong> de intervenção.
            Diferente de um curso estático, ele ajusta dinamicamente a ordem do material, o nível de dificuldade
            e o feedback — de forma personalizada para cada aluno.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-lg mb-4">
                🗺️
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Modelo do Domínio</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Representa o conhecimento do conteúdo: conceitos, hierarquias e relações de pré-requisito
                entre os tópicos de Python.
              </p>
            </Card>
            <Card>
              <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-lg mb-4">
                🧠
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Modelo do Aluno</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Abstração do estado cognitivo do aluno: o que ele já domina, onde errou, e qual
                a sua probabilidade de compreensão em cada tópico.
              </p>
            </Card>
            <Card>
              <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-lg mb-4">
                🎯
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Modelo Pedagógico</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                A estratégia de intervenção: quais tarefas apresentar, que feedback fornecer e como
                ajustar a dificuldade com base no progresso.
              </p>
            </Card>
          </div>
        </section>

        {/* ── Modelo do Domínio ── */}
        <section>
          <SectionLabel>Modelo do Domínio</SectionLabel>
          <SectionTitle>O mapa de conhecimento de Python</SectionTitle>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
            O domínio é representado como uma <strong className="text-neutral-800 dark:text-neutral-200">rede semântica</strong> —
            um grafo de conceitos conectados por relações de dependência. Um tópico só pode ser aprendido
            depois que seus pré-requisitos forem dominados. O currículo está dividido em dois grandes clusters:
          </p>

          <div className="flex flex-col gap-4">
            {/* Cluster 1: Lógica de Programação */}
            <Card>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400">Cluster 1</span>
                <span className="font-semibold text-neutral-900 dark:text-white">Lógica de Programação</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start gap-3">
                  <NodeBadge variant="root">Algoritmos</NodeBadge>
                  <div className="flex items-center gap-1.5 text-neutral-300 dark:text-neutral-600 text-lg mt-1">→</div>
                  <div className="flex flex-wrap gap-2">
                    <NodeBadge>Fluxogramas</NodeBadge>
                    <NodeBadge>Variáveis</NodeBadge>
                    <NodeBadge>Repetição</NodeBadge>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  Pré-requisito para todo o cluster de Sintaxe Python.
                </p>
              </div>
            </Card>

            {/* Seta entre clusters */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                pré-requisito
              </span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* Cluster 2: Sintaxe Python */}
            <Card>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Cluster 2</span>
                <span className="font-semibold text-neutral-900 dark:text-white">Sintaxe Python</span>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                {/* Level 0 */}
                <div className="flex flex-wrap items-center gap-2">
                  <NodeBadge variant="root">Ambiente Python</NodeBadge>
                </div>
                {/* Level 1 */}
                <div className="ml-6 flex flex-wrap items-center gap-2">
                  <span className="text-neutral-300 dark:text-neutral-600">└</span>
                  <NodeBadge>print()</NodeBadge>
                  <NodeBadge>Variáveis em Python</NodeBadge>
                  <NodeBadge>input()</NodeBadge>
                </div>
                {/* Level 2 */}
                <div className="ml-12 flex flex-wrap items-center gap-2">
                  <span className="text-neutral-300 dark:text-neutral-600">└</span>
                  <NodeBadge>Operadores</NodeBadge>
                </div>
                {/* Level 3 */}
                <div className="ml-16 flex flex-wrap items-center gap-2">
                  <span className="text-neutral-300 dark:text-neutral-600">└</span>
                  <NodeBadge>Condicionais</NodeBadge>
                  <NodeBadge>Laços</NodeBadge>
                  <NodeBadge>Listas</NodeBadge>
                </div>
                {/* Level 4 */}
                <div className="ml-24 flex flex-wrap items-center gap-2">
                  <span className="text-neutral-300 dark:text-neutral-600">└</span>
                  <NodeBadge variant="leaf">Funções</NodeBadge>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ── Modelo do Aluno ── */}
        <section>
          <SectionLabel>Modelo do Aluno</SectionLabel>
          <SectionTitle>Rastreamento de Conhecimento</SectionTitle>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
            O modelo do aluno rastreia o estado cognitivo de cada estudante usando{" "}
            <strong className="text-neutral-800 dark:text-neutral-200">Lógica Booleana</strong>: regras
            do tipo <em>"SE X, ENTÃO Y"</em> que atualizam o percentual de domínio em cada módulo com base
            nas interações registradas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-base">
                  ✓
                </div>
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">Acerto</span>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-500 leading-relaxed">
                Questão normal: <strong>+25%</strong> (até 75%). Ao atingir 75%, o próximo passo é o
                <strong> Desafio Final</strong>. Acertando-o, vai a 100% e o módulo é concluído.
              </p>
            </Card>
            <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 text-base">
                  ✗
                </div>
                <span className="font-semibold text-amber-800 dark:text-amber-400">Erro</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-500 leading-relaxed">
                Questão normal: <strong>−25%</strong> (mínimo 0%). Desafio Final: volta a 50%.
                Em ambos os casos, a IA explica o erro e gera uma nova pergunta de ângulo mais simples.
              </p>
            </Card>
          </div>

          <Card>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Regras do modelo (Lógica Booleana)
            </h3>
            <div className="flex flex-col">
              <RuleRow
                condition="aluno acerta questão normal (domínio < 75%)"
                action="domínio de X += 25% (máximo 75% via questão normal)"
              />
              <RuleRow
                condition="domínio de X atinge 75%"
                action="próxima pergunta é o Desafio Final (síntese do módulo)"
              />
              <RuleRow
                condition="aluno acerta o Desafio Final (domínio = 75%)"
                action="domínio = 100%, módulo concluído, próximo desbloqueado"
              />
              <RuleRow
                condition="aluno erra o Desafio Final"
                action="domínio volta para 50% — revisão obrigatória antes de nova tentativa"
              />
              <RuleRow
                condition="aluno erra questão normal (domínio < 75%)"
                action="domínio -= 25% (mínimo 0%) + IA explica o erro"
              />
              <RuleRow
                condition="existe interação pendente (sem resposta) em X"
                action="retomar a pergunta existente (não gerar nova)"
              />
            </div>
          </Card>
        </section>

        {/* ── Modelo Pedagógico ── */}
        <section>
          <SectionLabel>Modelo Pedagógico</SectionLabel>
          <SectionTitle>Estratégia de Intervenção Adaptativa</SectionTitle>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
            O modelo pedagógico usa <strong className="text-neutral-800 dark:text-neutral-200">ajuste dinâmico de dificuldade</strong>.
            A cada interação, o sistema decide qual conteúdo apresentar e como, com base no histórico
            completo do aluno no módulo — alimentado pelo Google Gemini 2.5 Flash.
          </p>

          <div className="flex flex-col gap-3">
            {/* Passo a passo de uma sessão */}
            {[
              {
                step: "01",
                title: "Primeira pergunta do módulo",
                desc: "O Gemini recebe o título e descrição do módulo. O prompt instrui a IA a introduzir o conceito do zero com uma analogia da vida real, depois gerar uma pergunta básica.",
              },
              {
                step: "02",
                title: "Aluno acerta",
                desc: "O sistema registra o acerto, atualiza o domínio (+25%) e solicita ao Gemini que avance o nível — cobrindo o próximo passo lógico do módulo com dificuldade levemente maior.",
              },
              {
                step: "03",
                title: "Aluno erra",
                desc: "O Gemini recebe a resposta errada e o histórico completo. O prompt instrui a IA a ser gentil, explicar por que aquela resposta está incorreta, e criar uma nova pergunta sobre o mesmo conceito de ângulo mais simples.",
              },
              {
                step: "04",
                title: "Módulo concluído (100%)",
                desc: "Ao dominar completamente um módulo, o aluno é direcionado de volta ao roadmap. O próximo módulo na sequência da rede semântica é desbloqueado.",
              },
            ].map((item) => (
              <Card key={item.step} className="flex flex-col sm:flex-row gap-4 sm:items-start">
                <span className="text-3xl font-bold text-neutral-200 dark:text-neutral-700 shrink-0 tabular-nums">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Fundamentos Teóricos ── */}
        <section>
          <SectionLabel>Fundamentos Teóricos</SectionLabel>
          <SectionTitle>Inspirações do Pré-Projeto</SectionTitle>
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
            As escolhas de design deste ITS são fundamentadas em três conceitos estudados na disciplina
            IAED (Inteligência Artificial na Educação) do IMD/UFRN.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-2xl mb-3">🕸️</div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Rede Semântica</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Usada no <strong className="text-neutral-700 dark:text-neutral-300">Modelo do Domínio</strong> para
                conectar os conceitos Python por relações de dependência. Permite inferências mais flexíveis
                do que ontologias hierárquicas puras.
              </p>
            </Card>
            <Card>
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Lógica Booleana</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Usada no <strong className="text-neutral-700 dark:text-neutral-300">Modelo do Aluno</strong> e no
                Modelo Pedagógico. Regras <em>"SE/ENTÃO"</em> simples e interpretáveis para rastrear
                o progresso e decidir intervenções.
              </p>
            </Card>
            <Card>
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Ajuste Dinâmico</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Estratégia do <strong className="text-neutral-700 dark:text-neutral-300">Modelo Pedagógico</strong>.
                A dificuldade sobe após acertos e volta ao básico após erros, garantindo que o aluno
                consolide antes de avançar.
              </p>
            </Card>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="flex flex-col items-center text-center gap-6 py-8 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Pronto para experimentar?
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            Crie sua conta e comece sua jornada de aprendizado adaptativo em Python agora mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex justify-center items-center px-6 py-3 text-sm font-medium text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-[0.98] transition-all"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center items-center px-6 py-3 text-sm font-medium text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all"
            >
              Voltar ao início
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 text-center text-sm text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950">
        &copy; {new Date().getFullYear()} ITS IMD UFRN. Todos os direitos reservados.
      </footer>
    </div>
  );
}
