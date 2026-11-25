import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rafraîchit la session Supabase sur l'espace d'administration.
export async function proxy(request: NextRequest) {
  let reponse = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !cle) return reponse;

  const supabase = createServerClient(url, cle, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(liste) {
        liste.forEach(({ name, value }) => request.cookies.set(name, value));
        reponse = NextResponse.next({ request });
        liste.forEach(({ name, value, options }) => reponse.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sans session administrateur : direction la page de connexion, avant tout rendu
  const chemin = request.nextUrl.pathname;
  const libre = chemin.startsWith("/admin/connexion") || chemin.startsWith("/admin/auth");
  if (!libre && user?.email?.toLowerCase() !== "web.online.concept@gmail.com") {
    const cible = request.nextUrl.clone();
    cible.pathname = "/admin/connexion";
    cible.search = "";
    const redirection = NextResponse.redirect(cible);
    reponse.cookies.getAll().forEach((c) => redirection.cookies.set(c));
    return redirection;
  }
  return reponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
