import { z } from "zod";

const isProd = process.env.VERCEL_ENV === "production";

const optional = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() !== "" ? v.trim() : undefined));

const serverSchema = z
  .object({
    TURNSTILE_SECRET_KEY: optional,
    RESEND_API_KEY: optional,
    QUOTE_TO_EMAIL: optional,
    QUOTE_FROM_EMAIL: optional,
    BLOB_READ_WRITE_TOKEN: optional,
    BLOB_STORE_ID: optional,
    INDEXNOW_KEY: optional,
    QUOTE_WEBHOOK_URL: optional,
    QUOTE_WEBHOOK_SECRET: optional,
  })
  .superRefine((env, ctx) => {
    if (env.QUOTE_WEBHOOK_URL && !env.QUOTE_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: "custom",
        message: "QUOTE_WEBHOOK_SECRET é obrigatório quando há QUOTE_WEBHOOK_URL",
      });
    }
    if (isProd) {
      // QUOTE_FROM_EMAIL é opcional: sem ele, o remetente é onboarding@resend.dev (lib/mail.ts).
      for (const key of ["TURNSTILE_SECRET_KEY", "RESEND_API_KEY", "QUOTE_TO_EMAIL"] as const) {
        if (!env[key])
          ctx.addIssue({ code: "custom", message: `${key} é obrigatório em produção` });
      }
      // Blob: token de leitura/escrita (stores antigos) ou BLOB_STORE_ID com OIDC (stores novos).
      if (!env.BLOB_READ_WRITE_TOKEN && !env.BLOB_STORE_ID) {
        ctx.addIssue({
          code: "custom",
          message: "BLOB_STORE_ID ou BLOB_READ_WRITE_TOKEN é obrigatório em produção",
        });
      }
    }
  });

/** Variáveis só de servidor. Chame apenas em código de servidor. */
export function serverEnv() {
  return serverSchema.parse(process.env);
}

/** Variáveis públicas (inlined no build pelo Next). */
export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  email: process.env.NEXT_PUBLIC_EMAIL,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP,
  phone: process.env.NEXT_PUBLIC_PHONE,
  socialLive: process.env.NEXT_PUBLIC_SOCIAL_LIVE,
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME,
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  webmcpOtToken: process.env.NEXT_PUBLIC_WEBMCP_OT_TOKEN,
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  bingVerification: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  gbpUrl: process.env.NEXT_PUBLIC_GBP_URL,
} as const;

/** Produção real: deploy de produção da Vercel com o domínio final configurado. */
export const isProductionSite =
  isProd &&
  (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://www.prumopaisagismo.com.br");
