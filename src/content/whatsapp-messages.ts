/** Mensagens pré-preenchidas de WhatsApp por página (docs/07). */
export const whatsappMessages = {
  geral: "Olá! Vim pelo site da Prumo e quero um orçamento de jardim vertical. Moro em ___.",
  jardimVertical: "Olá! Vi a página de jardim vertical da Prumo e quero um orçamento. Moro em ___.",
  irrigacao: "Olá! Quero saber mais sobre irrigação automatizada para o meu jardim. Moro em ___.",
  manutencao: "Olá! Quero saber sobre o plano de manutenção de jardim vertical. Moro em ___.",
  arquitetos: "Olá! Sou arquiteto(a) e quero conversar sobre um projeto com jardim vertical.",
} as const;

export type WhatsappMessageKey = keyof typeof whatsappMessages;
