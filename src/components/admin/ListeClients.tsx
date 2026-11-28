"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icone } from "@/components/admin/Icones";
import { classeChamp } from "@/components/admin/ui";

export type ClientListe = { id: string; nom: string; type: string; ville: string | null; email: string | null; facture: number; reste: number; documents: number };

const euros = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const simplifier = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Liste des clients avec recherche instantanée (nom, ville, e-mail)
export default function ListeClients({ clients }: { clients: ClientListe[] }) {
  const [q, setQ] = useState("");
  const liste = useMemo(() => {
    const s = simplifier(q.trim());
    return s ? clients.filter((c) => simplifier([c.nom, c.ville, c.email].filter(Boolean).join(" ")).includes(s)) : clients;
  }, [q, clients]);

  return (
    <>
      <div className="relative mb-4">
        <Icone nom="recherche" className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#93A6BB]" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un client"
          aria-label="Rechercher un client"
          className={`${classeChamp} pl-10`}
        />
      </div>
      {liste.length === 0 ? (
        <p className="rounded-xl bg-white px-5 py-8 text-center text-[15px] text-[#4A6178] ring-1 ring-[#E3E9F0]">Aucun client ne correspond à « {q} ».</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {liste.map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/clients/${c.id}`}
                className="flex items-center gap-4 rounded-2xl border border-[#E3E9F0] bg-white p-4 transition-[border-color,box-shadow] hover:border-[#C8D4E3] hover:shadow-[0_14px_30px_-22px_rgba(10,26,47,0.5)]"
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                    c.type === "entreprise" ? "bg-[#E8EFFF] text-bleu" : "bg-[#E3F8EC] text-[#0E7A45]"
                  }`}
                >
                  {c.nom
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((m) => m[0]?.toUpperCase())
                    .join("")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-nuit">{c.nom}</span>
                  <span className="block truncate text-sm text-[#4A6178]">
                    {[c.type === "entreprise" ? "Professionnel" : "Particulier", c.ville].filter(Boolean).join(", ")}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[15px] font-medium tabular-nums text-nuit">{euros(c.facture)}</span>
                  <span className={`block text-xs ${c.reste > 0 ? "text-[#9A5B00]" : "text-[#4A6178]"}`}>
                    {c.reste > 0 ? `${euros(c.reste)} à encaisser` : c.documents ? "facturé" : "pas encore facturé"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
