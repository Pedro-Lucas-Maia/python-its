import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800 flex flex-col transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto w-full">
        <div className="text-xl font-bold tracking-tight">ITS IMD UFRN</div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Link href="/sobre" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors hidden sm:block">
            Como Funciona
          </Link>
          <Link href="/login" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            Entrar
          </Link>
          <Link href="/register" className="text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all">
            Cadastrar
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          Sistema Tutor Inteligente (ITS)
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl text-neutral-900 dark:text-white leading-[1.1] mb-8">
          Aprenda Python de forma <span className="text-neutral-400 dark:text-neutral-500">adaptativa</span> e <span className="text-neutral-400 dark:text-neutral-500">inteligente</span>.
        </h1>
        
        {/* Description */}
        <p className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mb-12 leading-relaxed">
          Uma plataforma de microlearning que não assume conhecimento prévio. Nossa Inteligência Artificial atua como seu tutor particular, explicando conceitos e se adaptando aos seus erros específicos em tempo real.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className="inline-flex justify-center items-center px-8 py-4 text-base font-medium text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-[0.98] transition-all shadow-lg shadow-neutral-200/50 dark:shadow-none">
            Comece sua jornada na programação agora
          </Link>
          <Link href="/login" className="inline-flex justify-center items-center px-8 py-4 text-base font-medium text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 active:scale-[0.98] transition-all">
            Já tenho uma conta
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto text-left w-full border-t border-neutral-200 dark:border-neutral-800 pt-16">
          <div className="flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-xl">
              ⚡
            </div>
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Microlearning</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">Conteúdos diretos e curtos. Cada tópico se inicia com uma introdução breve gerada pela IA, seguida de uma pergunta prática.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-xl">
              🧠
            </div>
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Intervenção Adaptativa</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">Em caso de erro, a IA analisa o motivo, explica o conceito com base na sua dúvida e gera uma nova pergunta.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-xl">
              📈
            </div>
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Evolução Contínua</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">Acompanhe seu rastreamento de conhecimento. O progresso aumenta apenas quando você realmente entende o conceito.</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950">
        &copy; {new Date().getFullYear()} ITS IMD UFRN. Todos os direitos reservados.
      </footer>
    </div>
  );
}
