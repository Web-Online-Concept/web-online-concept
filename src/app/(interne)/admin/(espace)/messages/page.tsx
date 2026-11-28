import { Suspense } from "react";
import BoutonConfirmer from "@/components/admin/BoutonConfirmer";
import { Icone } from "@/components/admin/Icones";
import {
  Carte,
  Chargement,
  classeBouton,
  classeBoutonDiscret,
  classeBoutonSecondaire,
  Filtres,
  TitrePage,
  Vide,
} from "@/components/admin/ui";
import { Drapeau } from "@/components/site/Langue";
import { exigerAdmin } from "@/lib/admin/acces";
import { estLangue, NOMS_LANGUES, type Langue } from "@/lib/i18n/chemins";
import {
  archiverLus,
  basculerArchive,
  basculerLu,
  supprimerMessage,
  toutMarquerLu,
} from "./actions";

export const metadata = { title: "Messages" };

type Sp = { filtre?: string };

const dateHeure = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));

// Début de la réponse, dans la langue du visiteur
const SALUT: Record<Langue, (prenom: string) => string> = {
  fr: (p) => `Bonjour ${p},\n\n`,
  en: (p) => `Hello ${p},\n\n`,
  es: (p) => `Hola ${p}:\n\n`,
};

const initiales = (nom: string) =>
  nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase())
    .join("");

async function Contenu({ searchParams }: { searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const sp = await searchParams;
  const filtre =
    sp.filtre === "non-lus" || sp.filtre === "archives" ? sp.filtre : "";
  const { data } = await sb
    .from("messages")
    .select("*")
    .order("cree_le", { ascending: false })
    .limit(500);
  const tous = data ?? [];
  // Messages reçus (hors archives), non lus parmi eux, puis archives
  const recus = tous.filter((m) => !m.archive);
  const nonLus = recus.filter((m) => !m.lu);
  const lus = recus.filter((m) => m.lu);
  const archives = tous.filter((m) => m.archive);
  const messages =
    filtre === "non-lus" ? nonLus : filtre === "archives" ? archives : recus;
  const vide =
    filtre === "non-lus"
      ? "Tous les messages sont lus."
      : filtre === "archives"
        ? "Aucun message archivé. Archivez un message lu pour le ranger ici."
        : archives.length
          ? "Aucun message à traiter. Les messages archivés restent dans Archivés."
          : "Aucun message reçu pour l'instant.";

  return (
    <>
      <TitrePage
        titre="Messages"
        description="Les demandes envoyées depuis la page Contact du site, en français, en anglais ou en espagnol."
      >
        {filtre !== "archives" &&
          (nonLus.length > 0 || (filtre === "" && lus.length > 0)) && (
            // Boutons empilés sur téléphone, côte à côte sur ordinateur
            <div className="flex flex-col gap-2 sm:flex-row">
              {nonLus.length > 0 && (
                <form action={toutMarquerLu}>
                  <input type="hidden" name="filtre" value={filtre} />
                  <button
                    type="submit"
                    className={`${classeBoutonSecondaire} w-full`}
                  >
                    <Icone nom="coche" className="h-[18px] w-[18px]" />
                    Tout marquer comme lu
                  </button>
                </form>
              )}
              {filtre === "" && lus.length > 0 && (
                <form action={archiverLus}>
                  <input type="hidden" name="filtre" value={filtre} />
                  <button
                    type="submit"
                    className={`${classeBoutonSecondaire} w-full`}
                  >
                    <Icone nom="archive" className="h-[18px] w-[18px]" />
                    Archiver les messages lus
                  </button>
                </form>
              )}
            </div>
          )}
      </TitrePage>

      <div className="mb-4">
        <Filtres
          libelle="Filtre"
          options={[
            {
              href: "/admin/messages",
              libelle: "Reçus",
              actif: filtre === "",
              compte: recus.length,
            },
            {
              href: "/admin/messages?filtre=non-lus",
              libelle: "Non lus",
              actif: filtre === "non-lus",
              compte: nonLus.length,
            },
            {
              href: "/admin/messages?filtre=archives",
              libelle: "Archivés",
              actif: filtre === "archives",
              compte: archives.length,
            },
          ]}
        />
      </div>

      {messages.length === 0 ? (
        <Carte>
          <Vide icone={filtre === "archives" ? "archive" : "messages"}>
            {vide}
          </Vide>
        </Carte>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => {
            const l: Langue = estLangue(m.langue) ? m.langue : "fr";
            const prenom = String(m.nom).split(/\s+/)[0] ?? "";
            const mailto = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.objet || "votre message"}`)}&body=${encodeURIComponent(SALUT[l](prenom))}`;
            return (
              <Carte
                key={m.id}
                id={`m-${m.id}`}
                className={`scroll-mt-24 ${m.lu ? "" : "border-[#B9CCFF] ring-4 ring-bleu/[0.06]"}`}
              >
                <article>
                  <header className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F5EFF,#00B4D8_60%,#2BD47D)] text-sm font-semibold text-white"
                    >
                      {initiales(String(m.nom))}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <h2 className="text-[16px] font-semibold text-nuit">
                          {m.nom}
                        </h2>
                        {!m.lu && (
                          <span className="rounded-full bg-bleu px-2 py-0.5 text-[11px] font-semibold text-white">
                            Nouveau
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-ciel px-2 py-0.5 text-xs text-[#2C4558]">
                          <Drapeau l={l} className="h-3.5 w-3.5" />
                          {NOMS_LANGUES[l]}
                        </span>
                        <time
                          dateTime={m.cree_le}
                          className="w-full text-sm text-[#4A6178] sm:ml-auto sm:w-auto"
                        >
                          {dateHeure(m.cree_le)}
                        </time>
                      </div>
                      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <a
                          href={`mailto:${m.email}`}
                          className="inline-flex min-w-0 items-center gap-1.5 text-bleu transition-colors hover:text-[#1638A8]"
                        >
                          <Icone nom="enveloppe" className="h-4 w-4 shrink-0" />
                          <span className="truncate">{m.email}</span>
                        </a>
                        {m.telephone && (
                          <a
                            href={`tel:${String(m.telephone).replace(/[^0-9+]/g, "")}`}
                            className="inline-flex items-center gap-1.5 text-bleu transition-colors hover:text-[#1638A8]"
                          >
                            <Icone nom="telephone" className="h-4 w-4" />
                            {m.telephone}
                          </a>
                        )}
                      </p>
                    </div>
                  </header>

                  <h3 className="mt-5 text-[17px] font-semibold text-nuit">
                    {m.objet || "Sans objet"}
                  </h3>
                  {(m.besoin || m.source) && (
                    <p className="mt-2 flex flex-wrap gap-2 text-sm">
                      {m.besoin && (
                        <span className="rounded-full bg-[#E8EFFF] px-3 py-1 text-[#1638A8]">
                          {m.besoin}
                        </span>
                      )}
                      {m.source && (
                        <span className="rounded-full bg-[#E3F8EC] px-3 py-1 text-[#0E7A45]">
                          Recommandé par {m.source}
                        </span>
                      )}
                    </p>
                  )}
                  <p className="mt-4 whitespace-pre-line rounded-2xl rounded-tl-md bg-ciel px-4 py-3.5 text-[15px] leading-relaxed text-[#2C4558]">
                    {m.message}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <a
                      href={mailto}
                      className={`${classeBouton} !px-4 !py-2 !text-sm`}
                    >
                      <Icone nom="repondre" className="h-4 w-4" />
                      Répondre
                      {l !== "fr"
                        ? ` en ${l === "en" ? "anglais" : "espagnol"}`
                        : ""}
                    </a>
                    {!m.archive && (
                      <form action={basculerLu}>
                        <input type="hidden" name="id" value={m.id} />
                        <input
                          type="hidden"
                          name="lu"
                          value={m.lu ? "non" : "oui"}
                        />
                        <input type="hidden" name="filtre" value={filtre} />
                        <button type="submit" className={classeBoutonDiscret}>
                          <Icone
                            nom={m.lu ? "enveloppe" : "coche"}
                            className="h-4 w-4"
                          />
                          {m.lu ? "Marquer non lu" : "Marquer lu"}
                        </button>
                      </form>
                    )}
                    <form action={basculerArchive}>
                      <input type="hidden" name="id" value={m.id} />
                      <input
                        type="hidden"
                        name="archive"
                        value={m.archive ? "non" : "oui"}
                      />
                      <input type="hidden" name="filtre" value={filtre} />
                      <button type="submit" className={classeBoutonDiscret}>
                        <Icone
                          nom={m.archive ? "desarchiver" : "archive"}
                          className="h-4 w-4"
                        />
                        {m.archive ? "Remettre dans les reçus" : "Archiver"}
                      </button>
                    </form>
                    <BoutonConfirmer
                      action={supprimerMessage}
                      champs={{ id: m.id, filtre }}
                      libelle="Supprimer"
                      question="Supprimer ce message ?"
                      className="sm:ml-auto"
                    />
                  </div>
                </article>
              </Carte>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function Messages({
  searchParams,
}: PageProps<"/admin/messages">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<Sp>} />
    </Suspense>
  );
}
