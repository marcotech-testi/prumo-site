"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureOrigem } from "@/lib/utm";

/** Captura UTMs, gclid, fbclid, referrer e página de entrada (sessionStorage, 30 min). */
export function Attribution() {
  const pathname = usePathname();
  useEffect(() => {
    captureOrigem();
  }, [pathname]);
  return null;
}
