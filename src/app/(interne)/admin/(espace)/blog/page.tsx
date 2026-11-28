import Link from "next/link";
import { Suspense } from "react";
import { Icone } from "@/components/admin/Icones";
import { BoutonLien, Carte, Chargement, Pastille, TitrePage, Vide } from "@/components/admin/ui";
import { Drapeau } from "@/components/site/Langue";
import { exigerAdmin } from "@/lib/admin/acces";
import { fmtDate } from "@/lib/admin/format";
import type { Langue } from "@/lib/i18n/chemins";

export const metadata = { title: "Blog" };

async function Contenu() {
  const sb = await exigerAdmin();
  const [{ data }, { data: trad }] = await Promise.all([
    sb.from("articles").select("id, titre, slug, extrait, categorie, image_url, publie, publie_le, modifie_le").order("modifie_le", { ascending: false }),
    sb.from("articles_traductions").select("article_id, langue"),
  ]);
  const articles = data ?? [];
  const traduit = (id: string, l: Langue) => l === "fr" || (trad ?? []).some((t) => t.article_id === id && t.langue === l);

  return (
    <>
      <TitrePage titre="Blog" description="Articles en français, avec leurs traductions en anglais et en espagnol. Un article n'apparaît dans une langue que s'il y est traduit.">
        <BoutonLien href="/admin/blog/nouveau" icone="plus">
          Nouvel article
        </BoutonLien>
      </TitrePage>
      {articles.length === 0 ? (
        <Carte>
          <Vide icone="blog">Aucun article. Le premier est à un clic.</Vide>
        </Carte>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {articles.map((a) => (
            <li key={a.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#E3E9F0] bg-white shadow-[0_1px_2px_rgba(10,26,47,0.04)]">
              <Link href={`/admin/blog/${a.id}`} className="group flex flex-1 gap-4 p-4 sm:p-5">
                <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#0D2240,#163C86)] sm:h-24 sm:w-36">
                  {a.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image_url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-white/50">
                      <Icone nom="blog" className="h-7 w-7" />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <Pastille statut={a.publie ? "publie" : "brouillon"} libelle={a.publie ? "Publié" : "Brouillon"} />
                    <span className="text-xs text-[#4A6178]">{a.categorie}</span>
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-[16px] font-semibold leading-snug text-nuit transition-colors group-hover:text-bleu">{a.titre}</span>
                  <span className="mt-1 block text-sm text-[#4A6178]">
                    {a.publie_le ? `Publié le ${fmtDate(a.publie_le)}` : `Modifié le ${fmtDate(a.modifie_le)}`}
                  </span>
                </span>
              </Link>
              <div className="flex items-center gap-2 border-t border-[#EEF2F7] px-4 py-3 sm:px-5">
                {(["fr", "en", "es"] as Langue[]).map((l) => {
                  const ok = traduit(a.id, l);
                  return (
                    <Link
                      key={l}
                      href={`/admin/blog/${a.id}${l === "fr" ? "" : `?langue=${l}`}`}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        ok ? "bg-ciel text-[#2C4558] hover:bg-[#E1E9F3]" : "border border-dashed border-[#C8D4E3] text-[#4A6178] hover:border-bleu hover:text-bleu"
                      }`}
                      aria-label={ok ? `Version ${l.toUpperCase()}` : `Traduire en ${l === "en" ? "anglais" : "espagnol"}`}
                    >
                      <Drapeau l={l} className={`h-3.5 w-3.5 ${ok ? "" : "opacity-50 grayscale"}`} />
                      {l.toUpperCase()}
                      {ok ? <Icone nom="coche" className="h-3.5 w-3.5 text-[#0E7A45]" /> : <Icone nom="plus" className="h-3.5 w-3.5" />}
                    </Link>
                  );
                })}
                {a.publie && (
                  <a href={`/blog/${a.slug}`} target="_blank" rel="noopener" className="ml-auto inline-flex items-center gap-1 text-sm text-bleu transition-colors hover:text-[#1638A8]">
                    <Icone nom="site" className="h-4 w-4" />
                    <span className="hidden sm:inline">Voir sur le site</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function Blog() {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu />
    </Suspense>
  );
}
