/*
 * MINUTA — o jurídico revisa antes do go-live.
 * {{CONTROLADOR}} = razão social e CNPJ do titular do site, preenchido por NEXT_PUBLIC_LEGAL_NAME.
 * Se vazio, a página mostra "Prumo Paisagismo" e `pnpm check:placeholders --strict` falha.
 */
import { siteConfig } from "../site";

export const CONTROLADOR_PLACEHOLDER = "{{CONTROLADOR}}";

export function controlador() {
  return siteConfig.legalName || siteConfig.name;
}

export const privacidade = {
  path: "/privacidade",
  label: "Privacidade",
  title: "Política de Privacidade e Cookies | Prumo",
  description: "Como a Prumo trata seus dados e cookies.",
  h1: "Política de Privacidade e Cookies",
  updatedLabel: "Atualizada em:",
  updatedAt: "27 de novembro de 2026",
  updatedAtIso: "2026-11-27",
  sections: [
    {
      title: "Quem somos.",
      text: `O site www.prumopaisagismo.com.br é operado por ${CONTROLADOR_PLACEHOLDER}, sob o nome fantasia Prumo Paisagismo. Contato para assuntos de privacidade: contato@prumopaisagismo.com.br.`,
    },
    {
      title: "Quais dados coletamos.",
      text: "(a) Ao pedir um orçamento: nome, WhatsApp, e-mail (opcional), cidade e bairro, informações da parede, mensagem e as fotos ou vídeos enviados. (b) Ao navegar: dados de uso do site e de origem do acesso (páginas, dispositivo, parâmetros de campanha), de forma agregada pela análise sem cookies e, se você aceitar, por ferramentas de medição de marketing.",
    },
    {
      title: "Para que usamos.",
      text: "Responder ao seu pedido, preparar a faixa de investimento e a proposta, agendar visita técnica e entrar em contato; medir o desempenho do site e dos anúncios; cumprir obrigações legais.",
    },
    {
      title: "Base legal.",
      text: "Execução de procedimentos preliminares a contrato, a seu pedido (orçamento); consentimento (cookies de medição e marketing); legítimo interesse (segurança e prevenção a spam); cumprimento de obrigação legal.",
    },
    {
      title: "Com quem compartilhamos.",
      text: "Prestadores que operam o site e o atendimento (hospedagem, e-mail, armazenamento de arquivos, antispam, mensagens) e, para executar a obra, o parceiro de execução, apenas quando você avança. Não vendemos seus dados.",
    },
    {
      title: "Cookies.",
      text: 'Essenciais (sempre ativos): lembrar sua escolha de cookies e proteger o formulário. Medição e marketing (só com seu consentimento): Google Analytics e Meta Pixel. Você pode recusar ou mudar a escolha a qualquer momento pelo link "Preferências de cookies" no rodapé.',
    },
    {
      title: "Por quanto tempo guardamos.",
      // REVISAR-JURÍDICO: prazo de retenção
      text: "Pedidos de orçamento e arquivos enviados: pelo tempo necessário para o atendimento e por até 12 meses após o último contato, salvo obrigação legal de guardar por mais tempo.",
    },
    {
      title: "Seus direitos (LGPD, art. 18).",
      text: "Confirmação e acesso, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre compartilhamento e revogação do consentimento. Peça pelo e-mail acima.",
    },
    {
      title: "Segurança.",
      text: "Usamos conexão segura (HTTPS) e controle de acesso aos dados. Nenhum sistema é totalmente imune; se houver incidente relevante, comunicaremos conforme a lei.",
    },
    {
      title: "Alterações.",
      text: "Esta política pode mudar; a data de atualização fica no topo.",
    },
  ],
} as const;

/** Texto com o controlador preenchido. */
export function privacidadeSections() {
  return privacidade.sections.map((s) => ({
    ...s,
    text: s.text.replace(CONTROLADOR_PLACEHOLDER, controlador()),
  }));
}
