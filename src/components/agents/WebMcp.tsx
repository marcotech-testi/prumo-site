"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ObraResumo } from "@/lib/agent-tools/definitions";
import { registerWebMcpTools } from "@/lib/webmcp/register";

/** Registra as ferramentas WebMCP uma vez (sem suporte no navegador: não faz nada). */
export function WebMcp({ obras }: { obras: ObraResumo[] }) {
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  });
  // Registro estático: uma vez por montagem do layout.
  useEffect(() => registerWebMcpTools({ obras }, (path) => routerRef.current.push(path)), [obras]);
  return null;
}
