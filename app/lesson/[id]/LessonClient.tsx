"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrGenerateLesson, submitAnswer } from "@/app/actions/lesson";
import { useState } from "react";
import { Loader2, ArrowRight, XCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LessonClient({ moduleId }: { moduleId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    isCompleted: boolean;
    isFinalChallenge: boolean;
  } | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["lesson", moduleId],
    queryFn: () => getOrGenerateLesson(moduleId),
    refetchOnWindowFocus: false,
  });

  const submitMutation = useMutation({
    mutationFn: (answerIndex: number) => submitAnswer(data!.interactionId, answerIndex),
    onSuccess: (result) => {
      setFeedback(result);
    },
  });

  const handleNext = () => {
    if (feedback?.isCompleted) {
      router.push("/dashboard");
    } else {
      setFeedback(null);
      setSelectedOption(null);
      queryClient.invalidateQueries({ queryKey: ["lesson", moduleId] });
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        <p className="text-neutral-500 font-medium">
          {isLoading
            ? "Sua IA tutora está preparando o conteúdo..."
            : "Analisando sua resposta e gerando a próxima etapa..."}
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 p-6 rounded-xl border border-red-100 dark:border-red-900/50 text-center flex flex-col gap-4 max-w-lg mx-auto mt-12">
        <XCircle className="w-12 h-12 mx-auto opacity-50" />
        <div>
          <h3 className="font-bold text-lg mb-2">Erro ao gerar a lição</h3>
          <p className="text-sm opacity-90">
            Ocorreu um erro ao chamar a Inteligência Artificial. Verifique se você configurou a chave{" "}
            <code>GOOGLE_GENERATIVE_AI_API_KEY</code> corretamente no arquivo <code>.env.local</code>.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-6 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-full font-medium self-center mt-2 hover:opacity-80 transition-opacity"
        >
          Voltar
        </Link>
      </div>
    );
  }

  const { content, isFinalChallenge } = data;
  const hasAnswered = feedback !== null;

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-8 duration-500 pb-20">
      <Link
        href="/dashboard"
        className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-2 inline-flex items-center gap-2"
      >
        &larr; Voltar ao Roadmap
      </Link>

      {/* Badge de Desafio Final */}
      {isFinalChallenge && (
        <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
          <span className="text-xl">🏆</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Desafio Final</p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Questão de síntese — passe para concluir o módulo.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all">
        <h2 className="text-lg md:text-xl font-medium leading-relaxed text-neutral-800 dark:text-neutral-200 mb-8 whitespace-pre-wrap">
          {content.introducao}
        </h2>

        <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
          <p className="font-semibold text-neutral-900 dark:text-white mb-6">
            {content.pergunta}
          </p>

          <div className="flex flex-col gap-3">
            {content.alternativas.map((alt: string, index: number) => {
              const isSelected = selectedOption === index;
              const isSubmitting = submitMutation.isPending && isSelected;

              let buttonStyle =
                "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800";

              if (isSelected && !hasAnswered) {
                buttonStyle =
                  "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-900 ring-2 ring-neutral-900/20";
              } else if (hasAnswered && isSelected) {
                buttonStyle = feedback.isCorrect
                  ? "bg-emerald-500 border-emerald-600 text-white"
                  : "bg-red-500 border-red-600 text-white";
              }

              return (
                <button
                  key={index}
                  onClick={() => !hasAnswered && setSelectedOption(index)}
                  disabled={hasAnswered || submitMutation.isPending}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${buttonStyle} flex justify-between items-center`}
                >
                  <span>{alt}</span>
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin opacity-70" />}
                </button>
              );
            })}
          </div>
        </div>

        {selectedOption !== null && !hasAnswered && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => submitMutation.mutate(selectedOption)}
              disabled={submitMutation.isPending}
              className={`px-6 py-3 rounded-full font-medium hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 ${
                isFinalChallenge
                  ? "bg-amber-500 text-white"
                  : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
              }`}
            >
              {isFinalChallenge ? "Confirmar — Desafio Final" : "Confirmar resposta"}
            </button>
          </div>
        )}

        {feedback !== null && (
          <div
            className={`mt-8 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 justify-between ${
              feedback.isCorrect
                ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50"
                : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50"
            }`}
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              {feedback.isCorrect ? (
                <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full text-amber-600 dark:text-amber-400">
                  <XCircle className="w-6 h-6" />
                </div>
              )}

              <div>
                <h4
                  className={`font-bold ${
                    feedback.isCorrect
                      ? "text-emerald-800 dark:text-emerald-400"
                      : "text-amber-800 dark:text-amber-400"
                  }`}
                >
                  {feedback.isCorrect
                    ? feedback.isFinalChallenge
                      ? "🏆 Desafio Final superado!"
                      : "Excelente! Resposta correta."
                    : feedback.isFinalChallenge
                    ? "Quase lá! Desafio Final não superado."
                    : "Ops! Não foi dessa vez."}
                </h4>
                <p
                  className={`text-sm ${
                    feedback.isCorrect
                      ? "text-emerald-600 dark:text-emerald-500"
                      : "text-amber-600 dark:text-amber-500"
                  }`}
                >
                  {feedback.isCorrect
                    ? feedback.isCompleted
                      ? "Você dominou este módulo. Próximo módulo desbloqueado!"
                      : "Você ganhou experiência. Vamos para o próximo passo."
                    : feedback.isFinalChallenge
                    ? "Continue praticando. A IA vai te ajudar a revisar antes de tentar de novo."
                    : "A IA preparou uma explicação focada no seu erro para te ajudar."}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className={`shrink-0 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm ${
                feedback.isCorrect
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-600 text-white"
              }`}
            >
              {feedback.isCorrect && feedback.isCompleted ? "Voltar ao Roadmap" : "Continuar"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
