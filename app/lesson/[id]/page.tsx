import LessonClient from "./LessonClient";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col transition-colors duration-300">
      <header className="w-full flex items-center justify-end p-6 max-w-4xl mx-auto">
        <ThemeToggle />
      </header>
      <main className="flex-1 w-full px-4">
        <LessonClient moduleId={resolvedParams.id} />
      </main>
    </div>
  );
}
