-- =============================================================
-- ITS IMD UFRN — Seed dos módulos do currículo
-- Execute este arquivo no Supabase SQL Editor caso prefira
-- configurar os módulos manualmente.
-- =============================================================

-- Limpar dados existentes (cuidado: remove progresso e interações relacionadas)
-- DELETE FROM user_progress;
-- DELETE FROM interactions;
-- DELETE FROM modules;

-- ── Cluster 1: Lógica de Programação ──
INSERT INTO modules (title, description, order_index) VALUES
  ('Algoritmos',              'O que são algoritmos e como o computador executa instruções passo a passo.',               1),
  ('Fluxogramas',             'Representando soluções de forma visual com diagramas de fluxo antes de codar.',            2),
  ('Variáveis e Memória',     'Como o computador armazena e gerencia informações durante a execução de um programa.',     3),
  ('Repetição e Laços Lógicos','Automatizando tarefas repetitivas com o conceito de iteração antes do código.',          4),
-- ── Cluster 2: Sintaxe Python ──
  ('Ambiente Python',         'Instalando Python e executando seu primeiro programa na máquina.',                         5),
  ('print() — Saída de Dados','Fazendo seu programa exibir mensagens e resultados na tela com print().',                  6),
  ('input() — Entrada de Dados','Recebendo informações do usuário em tempo real com a função input().',                  7),
  ('Variáveis em Python',     'Tipos de dados em Python: strings, inteiros, floats e booleanos na prática.',             8),
  ('Operadores',              'Aritméticos, de comparação e lógicos: as ferramentas essenciais do código Python.',       9),
  ('Condicionais (if/else)',  'Ensinando o código a tomar decisões com base em condições — o if, elif e else.',          10),
  ('Laços (for/while)',       'Repetindo ações automaticamente com os laços for e while em Python.',                     11),
  ('Listas',                  'Armazenando coleções ordenadas de dados em uma única variável.',                          12),
  ('Funções',                 'Organizando o código em blocos reutilizáveis e independentes com def.',                   13);
