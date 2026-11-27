"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ViewObra({ slug }: { slug: string }) {
  useEffect(() => track("view_obra", { slug }), [slug]);
  return null;
}
