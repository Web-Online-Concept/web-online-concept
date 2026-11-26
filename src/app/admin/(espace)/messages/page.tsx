import { Suspense } from "react";
import { Carte, Chargement, classeBoutonSecondaire, TitrePage, Vide } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { basculerLu, supprimerMessage } from "./actions";

export const metadata = { title: "Messages" };

const dateHeure = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date(iso));

async function Contenu() {
  const sb = await exigerAdmin();
  const { data } = await sb.from("messages").select("*").order("cree_le", { ascending: false }).limit(200);
  const messages = data ?? [];
  const nonLus = messages.filter((m) => !m.lu).length;
  return (
    <>
      <TitrePage titre="Messages" />
      <p className="-mt-3 mb-5 text-[15px] text-[#4A6178]">
        Les demandes envoyées depuis la page Contact du site.{" "}
        {nonLus > 0 ? `${nonLus} non lu${nonLus > 1 ? "s" : ""}.` : "Tout est lu."}
      </p>
      {messages.length === 0 ? (
        <Carte>
          <Vide>Aucun message reçu pour l&apos;instant.</Vide>
        </Carte>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <Carte key={m.id} className={m.lu ? "" : "ring-2 ring-bleu/30"}>
              <article>
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">
                    {!m.lu && <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-bleu align-middle" aria-label="Non lu" />}
                    {m.objet || "Sans objet"}
                  </h2>
                  <time dateTime={m.cree_le} className="text-sm text-[#4A6178]">
                    {dateHeure(m.cree_le)}
                  </time>
                </header>
                <p className="mt-1 text-[15px]">
                  {m.nom},{" "}
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.objet || "votre message"}`)}`} className="text-bleu hover:underline">
                    {m.email}
                  </a>
                  {m.telephone && (
                    <>
                      ,{" "}
                      <a href={`tel:${String(m.telephone).replace(/[^0-9+]/g, "")}`} className="text-bleu hover:underline">
                        {m.telephone}
                      </a>
                    </>
                  )}
                </p>
                {(m.besoin || m.source) && (
                  <p className="mt-3 flex flex-wrap gap-2 text-sm">
                    {m.besoin && <span className="rounded-full bg-[#E8EFFF] px-3 py-1 text-[#1638A8]">{m.besoin}</span>}
                    {m.source && <span className="rounded-full bg-ciel px-3 py-1 text-[#4A6178]">Recommandé par : {m.source}</span>}
                  </p>
                )}
                <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed">{m.message}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.objet || "votre message"}`)}`} className={classeBoutonSecondaire}>
                    Répondre
                  </a>
                  <form action={basculerLu}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="lu" value={m.lu ? "non" : "oui"} />
                    <button type="submit" className={classeBoutonSecondaire}>
                      {m.lu ? "Marquer non lu" : "Marquer lu"}
                    </button>
                  </form>
                  <form action={supprimerMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="px-2 py-2 text-sm text-[#B42318] hover:underline">
                      Supprimer
                    </button>
                  </form>
                </div>
              </article>
            </Carte>
          ))}
        </div>
      )}
    </>
  );
}

export default function Messages() {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu />
    </Suspense>
  );
}
