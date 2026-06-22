import { signup } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }> | { error?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 sm:p-10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-neutral-100 dark:border-neutral-800 transition-all">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold tracking-tight mb-2">ITS IMD UFRN</div>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm">Crie sua conta e comece a aprender</div>
        </div>

        {resolvedSearchParams?.error && (
          <div className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-900/50">
            {resolvedSearchParams.error}
          </div>
        )}

        <form className="flex flex-col gap-5" action={signup}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="fullName">
              Nome Completo
            </label>
            <input
              className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all"
              id="fullName"
              name="fullName"
              type="text"
              placeholder="João Silva"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all"
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="password">
              Senha
            </label>
            <input
              className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button className="mt-2 w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl py-3.5 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-[0.98] transition-all" type="submit">
            Criar conta
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-neutral-900 dark:text-neutral-100 font-medium hover:opacity-70 transition-opacity">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
