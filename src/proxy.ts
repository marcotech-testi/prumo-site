import { NextResponse, type NextRequest } from "next/server";

/** Redireciona URLs com letras maiúsculas para minúsculas (308). Só roda nessas URLs. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lower = pathname.toLowerCase();
  if (lower === pathname || pathname.includes(".")) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = lower;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next|api|mcp)[^A-Z]*[A-Z].*)"],
};
