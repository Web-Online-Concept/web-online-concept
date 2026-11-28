import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CONDITIONS, RETRACTATION, TITRE_CONDITIONS } from "@/lib/conditions";
import { clientService } from "@/lib/supabase/service";
import FormulaireAcceptation from "./FormulaireAcceptation";

export const metadata = { title: "Votre devis", robots: { index: false, follow: false } };

const euros = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const dateFr = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso + "T00:00:00Z")) : "";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function Contenu({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  if (!UUID.test(jeton)) notFound();
  const sb = clientService();
  if (!sb) notFound();
  const { data: d } = await sb
    .from("devis")
    .select("id, numero, objet, statut, total_ttc, date_emission, date_validite, accepte_le, accepte_par, debut_anticipe, client")
    .eq("jeton_acceptation", jeton)
    .maybeSingle();
  if (!d || !d.numero) notFound();
  const { data: lignes } = await sb.from("devis_lignes").select("designation, description, quantite, unite, prix_unitaire, total_ht").eq("devis_id", d.id).order("position");
  const client = d.client as { nom?: string; type?: string } | null;
  const particulier = client?.type === "particulier";
  const total = euros(Number(d.total_ttc));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <Image src="/logo/logo-horizontal-couleur-fond-clair.svg" alt="Web Online Concept" width={240} height={77} className="h-16 w-auto" />
      <h1 className="mt-8 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold">Devis {d.numero}</h1>
      <p className="mt-2 text-[#4A6178]">
        Pour {client?.nom}, émis le {dateFr(d.date_emission)}, valable jusqu&apos;au {dateFr(d.date_validite)}.
      </p>
      {d.objet && <p className="mt-4 text-lg">{d.objet}</p>}

      <ul className="mt-8 divide-y divide-[#EEF2F7] border-y border-[#EEF2F7]">
        {(lignes ?? []).map((l, i) => (
          <li key={i} className="flex justify-between gap-6 py-4">
            <div>
              <p className="font-medium">{l.designation}</p>
              {l.description && <p className="mt-1 text-[15px] text-[#4A6178]">{l.description}</p>}
              <p className="mt-1 text-sm text-[#4A6178]">
                {Number(l.quantite)} {l.unite ?? ""} × {euros(Number(l.prix_unitaire))}
              </p>
            </div>
            <p className="shrink-0 font-medium">{euros(Number(l.total_ht))}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between rounded-xl bg-ciel px-5 py-4 text-xl font-semibold">
        <span>Total</span>
        <span>{total}</span>
      </p>
      <p className="mt-2 text-sm text-[#4A6178]">TVA non applicable, art. 293 B du CGI.</p>

      {/* Conditions de réalisation (et droit de rétractation pour un particulier), à lire avant d'accepter */}
      <details className="group mt-8 rounded-2xl border border-[#DCE3EC]" open={d.statut === "envoye"}>
        <summary className="cursor-pointer list-none px-6 py-4 font-semibold marker:hidden">
          {TITRE_CONDITIONS}
          <span className="ml-2 text-sm font-normal text-[#4A6178] group-open:hidden">(afficher)</span>
        </summary>
        <ol className="flex flex-col gap-4 px-6 pb-6">
          {CONDITIONS.map((c, i) => (
            <li key={c.titre} className="flex gap-3">
              <span className="w-5 shrink-0 font-semibold text-bleu">{i + 1}</span>
              <span>
                <span className="block font-medium">{c.titre}</span>
                <span className="mt-0.5 block text-[15px] leading-relaxed text-[#4A6178]">{c.texte}</span>
              </span>
            </li>
          ))}
        </ol>
        {particulier && (
          <div className="mx-6 mb-6 rounded-xl bg-ciel p-5">
            <p className="font-medium">{RETRACTATION.titre}</p>
            {RETRACTATION.texte.map((t) => (
              <p key={t} className="mt-2 text-[15px] leading-relaxed text-[#2C4558]">
                {t}
              </p>
            ))}
            <p className="mt-2 text-[15px] text-[#2C4558]">Le modèle de formulaire figure dans le devis en PDF.</p>
          </div>
        )}
      </details>

      <div className="mt-8 flex flex-col gap-6">
        <a href={`/devis/${jeton}/pdf`} className="self-start rounded-full border border-[#CBD5E1] px-5 py-2.5 font-medium hover:border-nuit">
          Télécharger le devis en PDF
        </a>
        {d.statut === "accepte" ? (
          <p role="status" className="rounded-2xl bg-[#E3F8EC] p-6 text-[#0E5A35]">
            Devis accepté le {dateFr(String(d.accepte_le).slice(0, 10))}
            {d.accepte_par ? ` par ${d.accepte_par}` : ""}. Merci pour votre confiance.
            {d.debut_anticipe && " Vous avez demandé que les travaux commencent avant la fin du délai de rétractation."}
          </p>
        ) : d.statut === "envoye" ? (
          <FormulaireAcceptation jeton={jeton} total={total} particulier={particulier} />
        ) : (
          <p className="rounded-2xl bg-ciel p-6">Ce devis n&apos;est plus ouvert à l&apos;acceptation en ligne. Contactez contact@web-online-concept.com.</p>
        )}
      </div>
    </div>
  );
}

export default function PageDevisPublic({ params }: PageProps<"/devis/[jeton]">) {
  return (
    <main className="flex-1 bg-white text-nuit">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Contenu params={params} />
      </Suspense>
    </main>
  );
}
