"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const CURRICULUM_MODULES = [
  // ── Cluster 1: Lógica de Programação ──
  {
    title: "Algoritmos",
    description: "O que são algoritmos e como o computador executa instruções passo a passo.",
    order_index: 1,
  },
  {
    title: "Fluxogramas",
    description: "Representando soluções de forma visual com diagramas de fluxo antes de codar.",
    order_index: 2,
  },
  {
    title: "Variáveis e Memória",
    description: "Como o computador armazena e gerencia informações durante a execução de um programa.",
    order_index: 3,
  },
  {
    title: "Repetição e Laços Lógicos",
    description: "Automatizando tarefas repetitivas com o conceito de iteração antes do código.",
    order_index: 4,
  },
  // ── Cluster 2: Sintaxe Python ──
  {
    title: "Ambiente Python",
    description: "Instalando Python e executando seu primeiro programa na máquina.",
    order_index: 5,
  },
  {
    title: "print() — Saída de Dados",
    description: "Fazendo seu programa exibir mensagens e resultados na tela com print().",
    order_index: 6,
  },
  {
    title: "input() — Entrada de Dados",
    description: "Recebendo informações do usuário em tempo real com a função input().",
    order_index: 7,
  },
  {
    title: "Variáveis em Python",
    description: "Tipos de dados em Python: strings, inteiros, floats e booleanos na prática.",
    order_index: 8,
  },
  {
    title: "Operadores",
    description: "Aritméticos, de comparação e lógicos: as ferramentas essenciais do código Python.",
    order_index: 9,
  },
  {
    title: "Condicionais (if/else)",
    description: "Ensinando o código a tomar decisões com base em condições — o if, elif e else.",
    order_index: 10,
  },
  {
    title: "Laços (for/while)",
    description: "Repetindo ações automaticamente com os laços for e while em Python.",
    order_index: 11,
  },
  {
    title: "Listas",
    description: "Armazenando coleções ordenadas de dados em uma única variável.",
    order_index: 12,
  },
  {
    title: "Funções",
    description: "Organizando o código em blocos reutilizáveis e independentes com def.",
    order_index: 13,
  },
];

export async function seedModules() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado.");

  const { data: existing } = await supabase
    .from("modules")
    .select("id")
    .limit(1);

  if (existing && existing.length > 0) {
    throw new Error("Módulos já estão configurados. Limpe a tabela antes de reconfigurar.");
  }

  const { error } = await supabase
    .from("modules")
    .insert(CURRICULUM_MODULES);

  if (error) {
    throw new Error(`Falha ao inserir módulos: ${error.message}`);
  }

  revalidatePath("/dashboard");
}
