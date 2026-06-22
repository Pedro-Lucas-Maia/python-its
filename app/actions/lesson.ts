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

export async function getOrGenerateLesson(moduleId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

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
    return { interactionId: pending.id, content: pending.generated_content };
  }

  // Pegar o módulo do banco para entender o contexto.
  // (Lembre-se: mock no banco se ele ainda não estiver populado para testes)
  const { data: moduleData } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .single();
  const moduleTitle = moduleData?.title || "Python (Conceito Desconhecido)";
  const moduleDesc = moduleData?.description || "Aprenda os fundamentos";

  // Pegar o histórico recente do aluno neste módulo
  const { data: history } = await supabase
    .from("interactions")
    .select("generated_content, user_answer, is_correct")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .not("user_answer", "is", null)
    .order("created_at", { ascending: true })
    .limit(10); // Últimas 10 interações para manter o contexto sem estourar tokens

  let prompt = `Você é o tutor inteligente da IMD UFRN, ensinando Python para iniciantes de forma clean e gamificada. Crie o próximo desafio do módulo: "${moduleTitle}" (${moduleDesc}).\n\n`;

  if (history && history.length > 0) {
    const lastInteraction = history[history.length - 1];
    
    prompt += `Abaixo está o histórico do que o aluno já respondeu neste módulo até agora:\n`;
    history.forEach((h, i) => {
      // Ignorar dados corrompidos caso o JSON tenha faltado a propriedade pergunta
      const p = (h.generated_content as any)?.pergunta || "Pergunta desconhecida";
      prompt += `[Questão ${i + 1}]: ${p}\n- Resposta do aluno: "${h.user_answer}" (${h.is_correct ? 'ACERTOU' : 'ERROU'})\n\n`;
    });
    
    if (lastInteraction.is_correct) {
      prompt += `O aluno ACERTOU a última pergunta! Evolua o nível. NÃO repita as perguntas acima. Crie uma nova pergunta cobrindo o próximo passo lógico dentro de "${moduleTitle}". Aumente levemente a dificuldade ou traga uma situação prática nova.`;
    } else {
      prompt += `ATENÇÃO: O aluno ERROU a última pergunta! Seja extremamente gentil na "introducao". Explique rapidamente por que a resposta "${lastInteraction.user_answer}" está errada e ensine o jeito certo. Depois, crie uma NOVA pergunta (diferente da anterior) para testar o mesmo conceito de um ângulo mais simples para garantir o aprendizado.`;
    }
  } else {
    prompt += `Esta é a PRIMEIRA pergunta do módulo. Introduza o conceito do zero (usando uma analogia da vida real ou algo muito tangível). Seja direto. Em seguida, crie uma pergunta prática básica para começar.`;
  }

  const { object } = await generateObject({
    model: google("gemini-2.5-flash-lite"),
    schema: LessonContentSchema,
    prompt: prompt,
  });

  // Salvar a nova interação no DB
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

  return { interactionId: newInteraction.id, content: object };
}

export async function submitAnswer(interactionId: string, answerIndex: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: interaction } = await supabase
    .from("interactions")
    .select("*")
    .eq("id", interactionId)
    .single();
  if (!interaction || interaction.user_id !== user.id)
    throw new Error("Invalid interaction");

  const isCorrect =
    answerIndex === interaction.generated_content.respostaCorretaIndex;
  const userAnswerText =
    interaction.generated_content.alternativas[answerIndex];

  await supabase
    .from("interactions")
    .update({ user_answer: userAnswerText, is_correct: isCorrect })
    .eq("id", interactionId);

  // Regra de progresso simples: acertos somam % até chegar em 100
  if (isCorrect) {
    let { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("module_id", interaction.module_id)
      .single();

    if (!progress) {
      const { data: newProg } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          module_id: interaction.module_id,
          understanding_percentage: 25,
          is_completed: false,
        })
        .select()
        .single();
      progress = newProg;
    } else {
      const newPct = Math.min(progress.understanding_percentage + 25, 100);
      await supabase
        .from("user_progress")
        .update({
          understanding_percentage: newPct,
          is_completed: newPct === 100,
        })
        .eq("id", progress.id);
      progress.understanding_percentage = newPct;
      progress.is_completed = newPct === 100;
    }

    return {
      isCorrect: true,
      progress: progress.understanding_percentage,
      isCompleted: progress.is_completed,
    };
  } else {
    return { isCorrect: false, progress: 0, isCompleted: false };
  }
}
