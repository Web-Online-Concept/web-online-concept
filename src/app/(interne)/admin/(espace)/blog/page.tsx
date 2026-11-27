import Link from "next/link";
import { Suspense } from "react";
import { BoutonLien, Carte, Chargement, Pastille, TitrePage, Vide } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { fmtDate } from "@/lib/admin/format";

export const metadata = { title: "Blog" };

async function Contenu() {
  const sb = await exigerAdmin();
  const { data } = await sb.from("articles").select("id, titre, slug, categorie, publie, publie_le, modifie_le").order("modifie_le", { ascending: false });
  const articles = data ?? [];
  return (
    <>
      <TitrePage titre="Blog">
        <BoutonLien href="/admin/blog/nouveau">Nouvel article</BoutonLien>
      </TitrePage>
      <Carte>
        {articles.length === 0 ? (
          <Vide>Aucun article. Le premier est à un clic.</Vide>
        ) : (
          <ul className="divide-y divide-[#EEF2F7]">
            {articles.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <Link href={`/admin/blog/${a.id}`} className="font-medium transition-colors hover:text-bleu">
                    {a.titre}
                  </Link>
                  <p className="mt-0.5 text-sm text-[#4A6178]">
                    {a.categorie}
                    {a.publie_le ? `, publié le ${fmtDate(a.publie_le)}` : `, modifié le ${fmtDate(a.modifie_le)}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {a.publie && (
                    <a href={`/blog/${a.slug}`} target="_blank" rel="noopener" className="text-sm text-bleu transition-colors hover:text-[#1638A8]">
                      Voir sur le site
                    </a>
                  )}
                  <Pastille statut={a.publie ? "payee" : "brouillon"} libelle={a.publie ? "Publié" : "Brouillon"} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Carte>
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
