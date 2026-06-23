import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-300 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold tracking-tight text-lg">ITS IMD UFRN</div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/sobre" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors hidden sm:block">
              Como Funciona
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
