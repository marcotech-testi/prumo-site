import { siteConfig } from "../site";

/** `/orcamento` (docs/07 e docs/05). */
export const orcamento = {
  path: "/orcamento",
  label: "Orçamento",
  title: "Orçamento de jardim vertical | Prumo Paisagismo",
  description:
    "Envie fotos e medidas da parede e receba uma faixa de investimento em até um dia útil. Curitiba e região metropolitana.",
  h1: "Orçamento de jardim vertical",
  intro:
    "Envie fotos ou um vídeo da parede e as medidas aproximadas. Retornamos com uma faixa de investimento em até um dia útil. A visita técnica só é agendada se você quiser avançar.",
  aside: {
    heading: "O que acontece depois",
    steps: [
      "Recebemos seu pedido e analisamos as fotos.",
      "Retornamos pelo WhatsApp ou e-mail, em horário comercial, com uma faixa por m².",
      "Se fizer sentido, agendamos a visita técnica.",
      "A proposta segue por escrito.",
    ],
  },
  submit: "Enviar pedido de orçamento",
  submitting: "Enviando…",
  success: {
    heading: "Pedido recebido.",
    text: "Recebemos as fotos e as medidas da sua parede. Retornamos em até um dia útil, em horário comercial, e quem responder se apresenta pelo nome.",
  },
  error: (email = siteConfig.email) =>
    `Não foi possível enviar agora. Seus dados continuam no formulário. Tente de novo ou escreva para ${email}.`,
  fixErrors: "Revise os campos destacados.",
  draftLoaded:
    "Preenchemos o formulário com os dados informados. Anexe as fotos, revise e confirme o envio.",
} as const;

/** Rótulos e opções do formulário (docs/05). */
export const quoteForm = {
  fieldsetParede: "A parede",
  fieldsetContato: "Contato",
  required: "obrigatório",
  perfil: {
    label: "Você é",
    options: [
      { value: "cliente", label: "Proprietário(a)" },
      { value: "arquiteto", label: "Arquiteto(a) ou designer" },
      { value: "construtora", label: "Construtora ou incorporadora" },
    ],
  },
  tipo: {
    label: "Onde será o jardim",
    placeholder: "Escolha",
    options: [
      { value: "fachada_externa", label: "Fachada ou muro externo" },
      { value: "parede_interna", label: "Parede interna" },
      { value: "varanda", label: "Varanda" },
      { value: "area_gourmet", label: "Área gourmet" },
      { value: "empreendimento", label: "Área comum de empreendimento" },
      { value: "outro", label: "Outro" },
    ],
  },
  larguraM: { label: "Largura (m)" },
  alturaM: { label: "Altura (m)" },
  naoSeiMedidas: { label: "Não sei as medidas" },
  sol: {
    label: "Luz na parede",
    placeholder: "Escolha",
    options: [
      { value: "sol_pleno", label: "Sol direto boa parte do dia" },
      { value: "meia_sombra", label: "Meia-sombra" },
      { value: "sombra", label: "Pouca luz" },
      { value: "nao_sei", label: "Não sei" },
    ],
  },
  pontoAgua: {
    label: "Ponto de água por perto",
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
      { value: "nao_sei", label: "Não sei" },
    ],
  },
  fotos: {
    label: "Fotos ou vídeo da parede",
    hint: "Recomendamos 3 fotos: a parede inteira, de perto e o entorno. Até 6 arquivos; fotos até 10 MB e 1 vídeo até 100 MB.",
    remove: "Remover",
    choose: "Escolher arquivos",
  },
  prazo: {
    label: "Quando pretende fazer",
    placeholder: "Escolha (opcional)",
    options: [
      { value: "o_quanto_antes", label: "O quanto antes" },
      { value: "1_3_meses", label: "Em 1 a 3 meses" },
      { value: "planejando", label: "Estou planejando" },
      { value: "sem_pressa", label: "Sem pressa" },
    ],
  },
  mensagem: { label: "Quer contar mais?" },
  nome: { label: "Nome" },
  whatsapp: { label: "WhatsApp", placeholder: "(41) 90000-0000" },
  email: { label: "E-mail (opcional)" },
  cidade: { label: "Cidade", other: "Outra" },
  bairro: { label: "Bairro" },
  consentimento: {
    before: "Concordo com o uso destes dados para receber o orçamento, conforme a ",
    link: "Política de Privacidade",
    after: ".",
  },
  honeypot: "Deixe este campo em branco",
} as const;

/** Rótulo legível de uma opção (usado nos e-mails). */
export function optionLabel(
  field: "perfil" | "tipo" | "sol" | "pontoAgua" | "prazo",
  value: string | undefined,
) {
  if (!value) return "—";
  return (
    (quoteForm[field].options as readonly { value: string; label: string }[]).find(
      (o) => o.value === value,
    )?.label ?? value
  );
}
