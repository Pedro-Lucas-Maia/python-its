"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const LessonContentSchema = z.object({
  introducao: z.string().describe("Texto explicando o conceito. Max 2 parágrafos. Se o aluno errou antes, foque em explicar por que ele errou de forma amigável e didática."),
  pergunta: z.string().describe("Uma pergunta prática de múltipla escolha para validar o entendimento do que acabou de ser ensinado. Deve ser contextualizada."),
  alternativas: z.array(z.string()).min(2).max(4).describe("Forneça de 2 a 4 opções de resposta curtas e objetivas."),
  respostaCorretaIndex: z.number().describe("Índice (0, 1, 2 ou 3) da opção correta dentro do array de alternativas.")
});

const FINAL_CHALLENGE_THRESHOLD = 75;
const PROGRESS_INCREMENT = 25;

export async function getOrGenerateLesson(moduleId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Fetch current progress to determine if this is a final challenge
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("understanding_percentage")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .single();

  const currentPct = progressData?.understanding_percentage ?? 0;
  const isFinalChallenge = currentPct >= FINAL_CHALLENGE_THRESHOLD;

  // Verificar se já existe uma interação pendente (gerada mas não respondida)
  const { data: pending } = await supabase
    .from("interactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .is("user_answer", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (pending) {
    return { interactionId: pending.id, content: pending.generated_content, isFinalChallenge };
  }

  const { data: moduleData } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .single();
  const moduleTitle = moduleData?.title || "Python (Conceito Desconhecido)";
  const moduleDesc = moduleData?.description || "Aprenda os fundamentos";

  const { data: history } = await supabase
    .from("interactions")
    .select("generated_content, user_answer, is_correct")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .not("user_answer", "is", null)
    .order("created_at", { ascending: true })
    .limit(10);

  let prompt = `Você é o tutor inteligente da IMD UFRN, ensinando Python para iniciantes de forma clean e gamificada. Crie o próximo desafio do módulo: "${moduleTitle}" (${moduleDesc}).\n\n`;

  if (isFinalChallenge) {
    prompt += `🏆 DESAFIO FINAL: O aluno atingiu ${currentPct}% de domínio e está na etapa final do módulo "${moduleTitle}". Esta é a questão de avaliação definitiva. A "introducao" deve apresentar um cenário ou problema prático que engloba o conteúdo completo do módulo. A questão deve ser de síntese — mais elaborada e desafiadora que as anteriores, exigindo que o aluno conecte os conceitos aprendidos.\n\n`;
  }

  if (history && history.length > 0) {
    const lastInteraction = history[history.length - 1];

    prompt += `Histórico do aluno neste módulo:\n`;
    history.forEach((h, i) => {
      const p = (h.generated_content as any)?.pergunta || "Pergunta desconhecida";
      prompt += `[Questão ${i + 1}]: ${p}\n- Resposta do aluno: "${h.user_answer}" (${h.is_correct ? 'ACERTOU' : 'ERROU'})\n\n`;
    });

    if (lastInteraction.is_correct) {
      if (isFinalChallenge) {
        prompt += `O aluno demonstrou domínio consistente. Crie a questão de síntese do DESAFIO FINAL. NÃO repita questões anteriores.`;
      } else {
        prompt += `O aluno ACERTOU a última pergunta! Evolua o nível. NÃO repita as perguntas acima. Crie uma nova pergunta cobrindo o próximo passo lógico dentro de "${moduleTitle}". Aumente levemente a dificuldade ou traga uma situação prática nova.`;
      }
    } else {
      prompt += `ATENÇÃO: O aluno ERROU a última pergunta! Seja extremamente gentil na "introducao". Explique rapidamente por que a resposta "${lastInteraction.user_answer}" está errada e ensine o jeito certo. Depois, crie uma NOVA pergunta (diferente da anterior) para testar o mesmo conceito de um ângulo mais simples para garantir o aprendizado.`;
    }
  } else {
    prompt += `Esta é a PRIMEIRA pergunta do módulo. Introduza o conceito do zero (usando uma analogia da vida real ou algo muito tangível). Seja direto. Em seguida, crie uma pergunta prática básica para começar.`;
  }

  const { object } = await generateObject({
    model: google("gemini-2.5-flash-lite"),
    schema: LessonContentSchema,
    prompt,
  });

  const { data: newInteraction, error: insertError } = await supabase
    .from("interactions")
    .insert({
      user_id: user.id,
      module_id: moduleId,
      generated_content: object,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Supabase Insert Error:", insertError);
    throw new Error(`Failed to save interaction: ${insertError.message} (Code: ${insertError.code})`);
  }

  return { interactionId: newInteraction.id, content: object, isFinalChallenge };
}

export async function submitAnswer(interactionId: string, answerIndex: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: interaction } = await supabase
    .from("interactions")
    .select("*")
    .eq("id", interactionId)
    .single();
  if (!interaction || interaction.user_id !== user.id)
    throw new Error("Invalid interaction");

  const isCorrect = answerIndex === interaction.generated_content.respostaCorretaIndex;
  const userAnswerText = interaction.generated_content.alternativas[answerIndex];

  await supabase
    .from("interactions")
    .update({ user_answer: userAnswerText, is_correct: isCorrect })
    .eq("id", interactionId);

  let { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("module_id", interaction.module_id)
    .single();

  // Primeira interação com este módulo: criar registro de progresso
  if (!progress) {
    const initialPct = isCorrect ? PROGRESS_INCREMENT : 0;
    const { data: newProg } = await supabase
      .from("user_progress")
      .insert({
        user_id: user.id,
        module_id: interaction.module_id,
        understanding_percentage: initialPct,
        is_completed: false,
      })
      .select()
      .single();
    progress = newProg;

    return {
      isCorrect,
      progress: initialPct,
      isCompleted: false,
      isFinalChallenge: false,
    };
  }

  const currentPct = progress.understanding_percentage;
  const isFinalChallenge = currentPct >= FINAL_CHALLENGE_THRESHOLD;

  let newPct: number;
  let isCompleted = false;

  if (isCorrect) {
    if (isFinalChallenge) {
      // Passou no desafio final: módulo concluído
      newPct = 100;
      isCompleted = true;
    } else {
      // Progresso normal: +25%, mas não ultrapassa o threshold sem o desafio final
      newPct = Math.min(currentPct + PROGRESS_INCREMENT, FINAL_CHALLENGE_THRESHOLD);
    }
  } else {
    if (isFinalChallenge) {
      // Falhou no desafio final: volta abaixo do threshold para forçar revisão
      newPct = FINAL_CHALLENGE_THRESHOLD - PROGRESS_INCREMENT;
    } else {
      // Erro normal: decrementa (mínimo 0%)
      newPct = Math.max(currentPct - PROGRESS_INCREMENT, 0);
    }
  }

  await supabase
    .from("user_progress")
    .update({ understanding_percentage: newPct, is_completed: isCompleted })
    .eq("id", progress.id);

  return { isCorrect, progress: newPct, isCompleted, isFinalChallenge };
}
