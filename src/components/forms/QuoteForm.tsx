"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { orcamento, quoteForm as L } from "@/content/pages/orcamento";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import {
  QUOTE_DRAFT_EVENT,
  QUOTE_FORM_KEY,
  sanitizeDraft,
  takeDraft,
  type QuoteDraft,
} from "@/lib/quote-draft";
import {
  allowedFileTypes,
  fieldErrors,
  perfis,
  quoteFieldsSchema,
  tiposEspaco,
  validateFiles,
  type Arquivo,
} from "@/lib/quote-schema";
import { readOrigem } from "@/lib/utm";
import { Turnstile } from "./Turnstile";

type Values = {
  perfil: string;
  tipo: string;
  larguraM: string;
  alturaM: string;
  naoSeiMedidas: boolean;
  sol: string;
  pontoAgua: string;
  prazo: string;
  mensagem: string;
  nome: string;
  whatsapp: string;
  email: string;
  cidade: string;
  bairro: string;
  consentimento: boolean;
};

const empty: Values = {
  perfil: "",
  tipo: "",
  larguraM: "",
  alturaM: "",
  naoSeiMedidas: false,
  sol: "",
  pontoAgua: "",
  prazo: "",
  mensagem: "",
  nome: "",
  whatsapp: "",
  email: "",
  cidade: "",
  bairro: "",
  consentimento: false,
};

type Picked = { id: string; file: File; preview?: string };
type Status = "idle" | "sending" | "success" | "error";

/** Máscara (41) 90000-0000. */
export function maskWhatsapp(v: string) {
  const d = v
    .replace(/\D/g, "")
    .replace(/^55(?=\d{11})/, "")
    .slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Aplica um rascunho (agente ou sessão) aos valores; ignora valores fora das opções. */
function applyDraft(prev: Values, draft: QuoteDraft): Values {
  const next = { ...prev };
  const opts = {
    perfil: L.perfil.options,
    tipo: L.tipo.options,
    sol: L.sol.options,
    pontoAgua: L.pontoAgua.options,
    prazo: L.prazo.options,
  } as const;
  for (const [k, raw] of Object.entries(draft)) {
    const key = k as keyof Values;
    if (key === "naoSeiMedidas") {
      if (typeof raw === "boolean") next.naoSeiMedidas = raw;
      continue;
    }
    if (typeof raw !== "string") continue;
    if (key in opts) {
      const list = opts[key as keyof typeof opts] as readonly { value: string }[];
      if (list.some((o) => o.value === raw)) (next[key] as string) = raw;
    } else if (key === "whatsapp") {
      next.whatsapp = maskWhatsapp(raw);
    } else if (key !== "consentimento") {
      (next[key] as string) = raw;
    }
  }
  return next;
}

function formatBytes(n: number) {
  return n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} MB`
    : `${Math.ceil(n / 1024)} KB`;
}

export function QuoteForm({ mode }: { mode: "blob" | "local" }) {
  const uid = useId();
  const [values, setValues] = useState<Values>(empty);
  const [files, setFiles] = useState<Picked[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [obra, setObra] = useState<string | undefined>();
  const [failures, setFailures] = useState(0);
  const renderedAt = useRef(0);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const hydrated = useRef(false);

  const id = (name: string) => `${uid}-${name}`;

  // Montagem: parâmetros da URL (não pessoais), rascunho da sessão e rascunho de agente.
  useEffect(() => {
    renderedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    let next = { ...empty };
    try {
      const saved = sessionStorage.getItem(QUOTE_FORM_KEY);
      if (saved) next = applyDraft(next, sanitizeDraft(JSON.parse(saved)));
    } catch {
      /* storage bloqueado */
    }
    const perfil = params.get("perfil");
    if (perfil && (perfis as readonly string[]).includes(perfil)) next.perfil = perfil;
    const tipo = params.get("tipo");
    if (tipo && (tiposEspaco as readonly string[]).includes(tipo)) next.tipo = tipo;
    const obraParam = params.get("obra");
    const agentDraft = takeDraft();
    if (agentDraft) next = applyDraft(next, agentDraft);
    hydrated.current = true;
    setValues(next);
    if (obraParam && /^[a-z0-9-]{1,100}$/.test(obraParam)) setObra(obraParam);
    if (agentDraft) setNotice(orcamento.draftLoaded);

    const onDraft = () => {
      const d = takeDraft();
      if (d) {
        setValues((prev) => applyDraft(prev, d));
        setNotice(orcamento.draftLoaded);
      }
    };
    window.addEventListener(QUOTE_DRAFT_EVENT, onDraft);
    return () => window.removeEventListener(QUOTE_DRAFT_EVENT, onDraft);
  }, []);

  // Rascunho da sessão (sem arquivos e sem consentimento).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      const { consentimento: _c, ...rest } = values;
      void _c;
      sessionStorage.setItem(QUOTE_FORM_KEY, JSON.stringify(rest));
    } catch {
      /* storage bloqueado */
    }
  }, [values]);

  // Libera as pré-visualizações ao desmontar.
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(
    () => () => filesRef.current.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)),
    [],
  );

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const onFirstFocus = () => {
    if (started.current) return;
    started.current = true;
    track("start_quote");
  };

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const picked = Array.from(list).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    const next = [...files, ...picked];
    const err = validateFiles(
      next.map((p) => ({ nome: p.file.name, tipo: p.file.type, tamanhoBytes: p.file.size })),
    );
    if (err) {
      picked.forEach((p) => p.preview && URL.revokeObjectURL(p.preview));
      setErrors((e) => ({ ...e, fotos: err }));
      return;
    }
    setFiles(next);
    setErrors((e) => ({ ...e, fotos: "" }));
  };

  const removeFile = (fid: string) => {
    setFiles((prev) => {
      const f = prev.find((p) => p.id === fid);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((p) => p.id !== fid);
    });
  };

  const focusFirstError = (errs: Record<string, string>) => {
    const order = [
      "perfil",
      "tipo",
      "larguraM",
      "alturaM",
      "sol",
      "pontoAgua",
      "fotos",
      "mensagem",
      "nome",
      "whatsapp",
      "email",
      "cidade",
      "bairro",
      "consentimento",
    ];
    const first = order.find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
  };

  const uploadAll = useCallback(
    async (passe: string): Promise<Arquivo[]> => {
      if (mode === "local") {
        return Promise.all(
          files.map(async ({ file }) => {
            const fd = new FormData();
            fd.set("file", file);
            fd.set("passe", passe);
            const res = await fetch("/api/orcamento/upload-local", { method: "POST", body: fd });
            const data = (await res.json()) as { ok: boolean; url?: string };
            if (!data.ok || !data.url) throw new Error("upload");
            return { url: data.url, nome: file.name, tipo: file.type, tamanhoBytes: file.size };
          }),
        );
      }
      const { upload } = await import("@vercel/blob/client");
      const { uploadPathFor } = await import("@/lib/blob");
      return Promise.all(
        files.map(async ({ file }) => {
          const blob = await upload(uploadPathFor(file.name, crypto.randomUUID()), file, {
            access: "public",
            handleUploadUrl: "/api/orcamento/upload",
            clientPayload: JSON.stringify({ passe }),
            contentType: file.type,
            multipart: file.size > 20 * 1024 * 1024,
          });
          return { url: blob.url, nome: file.name, tipo: file.type, tamanhoBytes: file.size };
        }),
      );
    },
    [files, mode],
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    const parsed = quoteFieldsSchema.safeParse({
      ...values,
      prazo: values.prazo || undefined,
      perfil: values.perfil || undefined,
      tipo: values.tipo || undefined,
      sol: values.sol || undefined,
      pontoAgua: values.pontoAgua || undefined,
    });
    const errs = parsed.success ? {} : fieldErrors(parsed.error);
    const fileErr = validateFiles(
      files.map((p) => ({ nome: p.file.name, tipo: p.file.type, tamanhoBytes: p.file.size })),
    );
    if (fileErr) errs.fotos = fileErr;
    if (Object.keys(errs).length || !parsed.success) {
      setErrors(errs);
      setNotice(orcamento.fixErrors);
      focusFirstError(errs);
      return;
    }

    setStatus("sending");
    setNotice("");
    try {
      const passRes = await fetch("/api/orcamento/passe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turnstileToken }),
      });
      const pass = (await passRes.json()) as { ok: boolean; passe?: string };
      if (!pass.ok || !pass.passe) throw new Error("passe");
      const arquivos = await uploadAll(pass.passe);
      const res = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemaVersion: 1,
          campos: parsed.data,
          arquivos,
          origem: { ...readOrigem(), ...(obra ? { obra } : {}) },
          website,
          renderedAt: renderedAt.current,
          passe: pass.passe,
        }),
      });
      const data = (await res.json()) as { ok: boolean; errors?: Record<string, string> };
      if (!res.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
          focusFirstError(data.errors);
        }
        throw new Error("envio");
      }
      track("submit_quote", { perfil: parsed.data.perfil, tipo_espaco: parsed.data.tipo });
      try {
        sessionStorage.removeItem(QUOTE_FORM_KEY);
      } catch {
        /* storage bloqueado */
      }
      setStatus("success");
      setTimeout(() => successRef.current?.focus(), 0);
    } catch {
      setStatus("error");
      setNotice(orcamento.error(siteConfig.email));
      setTurnstileToken(null);
      setFailures((n) => n + 1);
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[var(--radius-ui)] border border-basalto/15 bg-papel p-8"
      >
        <h2 ref={successRef} tabIndex={-1} className="t-h2 text-floresta outline-none">
          {orcamento.success.heading}
        </h2>
        <p className="t-body mt-4">{orcamento.success.text}</p>
      </div>
    );
  }

  const describedBy = (name: string, hint?: boolean) =>
    [hint ? id(`${name}-hint`) : null, errors[name] ? id(`${name}-erro`) : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const errorText = (name: string) =>
    errors[name] ? (
      <p id={id(`${name}-erro`)} className="mt-2 text-sm font-medium text-floresta">
        <span aria-hidden="true">— </span>
        {errors[name]}
      </p>
    ) : null;

  const inputCls = (name: string) =>
    `mt-2 block min-h-12 w-full rounded-[var(--radius-ui)] border bg-papel px-4 py-3 text-basalto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-profunda ${errors[name] ? "border-floresta border-2" : "border-basalto/40"}`;

  const label = (htmlFor: string, children: ReactNode, optional = false) => (
    <label htmlFor={htmlFor} className="block font-medium">
      {children}
      {optional ? null : <span className="sr-only"> ({L.required})</span>}
    </label>
  );

  const radios = (
    name: "perfil" | "pontoAgua",
    legend: string,
    options: readonly { value: string; label: string }[],
  ) => (
    <fieldset aria-describedby={describedBy(name)}>
      <legend className="font-medium">
        {legend}
        <span className="sr-only"> ({L.required})</span>
      </legend>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {options.map((o, i) => (
          <label key={o.value} className="flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={values[name] === o.value}
              onChange={() => set(name, o.value)}
              required
              data-field={i === 0 ? name : undefined}
              className="size-5 accent-floresta"
            />
            {o.label}
          </label>
        ))}
      </div>
      {errorText(name)}
    </fieldset>
  );

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocus={onFirstFocus}
      noValidate
      className="space-y-12"
      aria-describedby={notice ? id("aviso") : undefined}
    >
      <div
        id={id("aviso")}
        role="status"
        aria-live="polite"
        className={notice ? "border-l-2 border-floresta pl-4 font-medium text-floresta" : "sr-only"}
      >
        {notice}
      </div>

      <fieldset className="space-y-8">
        <legend className="t-h3 mb-6 text-floresta">{L.fieldsetParede}</legend>

        {radios("perfil", L.perfil.label, L.perfil.options)}

        <div>
          {label(id("tipo"), L.tipo.label)}
          <select
            id={id("tipo")}
            name="tipo"
            data-field="tipo"
            required
            value={values.tipo}
            onChange={(e) => set("tipo", e.target.value)}
            aria-invalid={!!errors.tipo}
            aria-describedby={describedBy("tipo")}
            className={inputCls("tipo")}
          >
            <option value="">{L.tipo.placeholder}</option>
            {L.tipo.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errorText("tipo")}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {(["larguraM", "alturaM"] as const).map((name) => (
            <div key={name}>
              {label(id(name), L[name].label, true)}
              <input
                id={id(name)}
                name={name}
                data-field={name}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                disabled={values.naoSeiMedidas}
                value={values[name]}
                onChange={(e) => set(name, e.target.value.replace(/[^\d.,]/g, ""))}
                aria-invalid={!!errors[name]}
                aria-describedby={describedBy(name)}
                className={`${inputCls(name)} disabled:opacity-60`}
              />
              {errorText(name)}
            </div>
          ))}
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="naoSeiMedidas"
            checked={values.naoSeiMedidas}
            onChange={(e) => {
              set("naoSeiMedidas", e.target.checked);
              setErrors((er) => ({ ...er, larguraM: "", alturaM: "" }));
            }}
            className="size-5 accent-floresta"
          />
          {L.naoSeiMedidas.label}
        </label>

        <div>
          {label(id("sol"), L.sol.label)}
          <select
            id={id("sol")}
            name="sol"
            data-field="sol"
            required
            value={values.sol}
            onChange={(e) => set("sol", e.target.value)}
            aria-invalid={!!errors.sol}
            aria-describedby={describedBy("sol")}
            className={inputCls("sol")}
          >
            <option value="">{L.sol.placeholder}</option>
            {L.sol.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errorText("sol")}
        </div>

        {radios("pontoAgua", L.pontoAgua.label, L.pontoAgua.options)}

        <div>
          {label(id("fotos"), L.fotos.label)}
          <p id={id("fotos-hint")} className="mt-1 text-[0.9375rem] text-agua-profunda">
            {L.fotos.hint}
          </p>
          <input
            id={id("fotos")}
            name="fotos"
            data-field="fotos"
            type="file"
            multiple
            accept={allowedFileTypes.join(",")}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
            aria-invalid={!!errors.fotos}
            aria-describedby={describedBy("fotos", true)}
            className="mt-3 block w-full text-[0.9375rem] file:mr-4 file:min-h-12 file:cursor-pointer file:rounded-[var(--radius-ui)] file:border-[1.5px] file:border-floresta file:bg-transparent file:px-5 file:font-medium file:text-floresta"
          />
          {errorText("fotos")}
          {files.length ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {files.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 rounded-[var(--radius-ui)] border border-basalto/15 bg-papel p-3"
                >
                  {f.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.preview}
                      alt=""
                      width={56}
                      height={56}
                      className="size-14 shrink-0 rounded-[var(--radius-ui)] object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="t-eyebrow flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-ui)] bg-pedra text-agua-profunda"
                    >
                      MP4
                    </span>
                  )}
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block truncate">{f.file.name}</span>
                    <span className="text-agua-profunda">{formatBytes(f.file.size)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(f.id)}
                    className="min-h-11 cursor-pointer px-2 text-sm font-medium text-floresta underline underline-offset-4"
                  >
                    {L.fotos.remove}
                    <span className="sr-only">: {f.file.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          {label(id("prazo"), L.prazo.label, true)}
          <select
            id={id("prazo")}
            name="prazo"
            value={values.prazo}
            onChange={(e) => set("prazo", e.target.value)}
            className={inputCls("prazo")}
          >
            <option value="">{L.prazo.placeholder}</option>
            {L.prazo.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          {label(id("mensagem"), L.mensagem.label, true)}
          <textarea
            id={id("mensagem")}
            name="mensagem"
            data-field="mensagem"
            rows={4}
            maxLength={1000}
            value={values.mensagem}
            onChange={(e) => set("mensagem", e.target.value)}
            aria-describedby={describedBy("mensagem")}
            className={inputCls("mensagem")}
          />
          {errorText("mensagem")}
        </div>
      </fieldset>

      <fieldset className="space-y-8">
        <legend className="t-h3 mb-6 text-floresta">{L.fieldsetContato}</legend>

        <div>
          {label(id("nome"), L.nome.label)}
          <input
            id={id("nome")}
            name="nome"
            data-field="nome"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            value={values.nome}
            onChange={(e) => set("nome", e.target.value)}
            aria-invalid={!!errors.nome}
            aria-describedby={describedBy("nome")}
            className={inputCls("nome")}
          />
          {errorText("nome")}
        </div>

        <div>
          {label(id("whatsapp"), L.whatsapp.label)}
          <input
            id={id("whatsapp")}
            name="whatsapp"
            data-field="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder={L.whatsapp.placeholder}
            value={values.whatsapp}
            onChange={(e) => set("whatsapp", maskWhatsapp(e.target.value))}
            aria-invalid={!!errors.whatsapp}
            aria-describedby={describedBy("whatsapp")}
            className={inputCls("whatsapp")}
          />
          {errorText("whatsapp")}
        </div>

        <div>
          {label(id("email"), L.email.label, true)}
          <input
            id={id("email")}
            name="email"
            data-field="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={inputCls("email")}
          />
          {errorText("email")}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            {label(id("cidade"), L.cidade.label)}
            <input
              id={id("cidade")}
              name="cidade"
              data-field="cidade"
              type="text"
              autoComplete="address-level2"
              list={id("cidades")}
              required
              value={values.cidade}
              onChange={(e) => set("cidade", e.target.value)}
              aria-invalid={!!errors.cidade}
              aria-describedby={describedBy("cidade")}
              className={inputCls("cidade")}
            />
            <datalist id={id("cidades")}>
              {[...siteConfig.areaServed, L.cidade.other].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errorText("cidade")}
          </div>
          <div>
            {label(id("bairro"), L.bairro.label)}
            <input
              id={id("bairro")}
              name="bairro"
              data-field="bairro"
              type="text"
              required
              maxLength={60}
              value={values.bairro}
              onChange={(e) => set("bairro", e.target.value)}
              aria-invalid={!!errors.bairro}
              aria-describedby={describedBy("bairro")}
              className={inputCls("bairro")}
            />
            {errorText("bairro")}
          </div>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="consentimento"
              data-field="consentimento"
              required
              checked={values.consentimento}
              onChange={(e) => set("consentimento", e.target.checked)}
              aria-invalid={!!errors.consentimento}
              aria-describedby={describedBy("consentimento")}
              className="mt-1 size-5 shrink-0 accent-floresta"
            />
            <span>
              {L.consentimento.before}
              <Link
                href="/privacidade"
                target="_blank"
                className="text-floresta underline underline-offset-4"
              >
                {L.consentimento.link}
              </Link>
              {L.consentimento.after}
            </span>
          </label>
          {errorText("consentimento")}
        </div>
      </fieldset>

      {/* Honeypot: pessoas não veem; robôs preenchem. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>{L.honeypot}</label>
        <input
          id={id("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <Turnstile onToken={setTurnstileToken} resetKey={failures} />

      <div>
        <Button
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="w-full sm:w-auto"
        >
          {status === "sending" ? orcamento.submitting : orcamento.submit}
        </Button>
      </div>
    </form>
  );
}
