"use client";

import { useState } from "react";
import { Icone } from "@/components/admin/Icones";

// Action irréversible (suppression) : un premier clic demande confirmation, sans boîte de dialogue du navigateur
export default function BoutonConfirmer({
  action,
  champs,
  libelle,
  question,
  confirmer = "Supprimer",
  className = "",
}: {
  action: (formData: FormData) => Promise<void>;
  champs: Record<string, string>;
  libelle: string;
  question: string;
  confirmer?: string;
  className?: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#B42318] transition-colors hover:bg-[#FEF3F2] ${className}`}
      >
        <Icone nom="poubelle" className="h-4 w-4" />
        {libelle}
      </button>
    );
  }
  return (
    <form action={action} className={`flex flex-wrap items-center gap-2 rounded-xl bg-[#FEF3F2] px-3 py-2 ${className}`} role="group" aria-label={question}>
      {Object.entries(champs).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <span className="text-sm text-[#B42318]">{question}</span>
      <button type="submit" className="rounded-full bg-[#B42318] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#912018]">
        {confirmer}
      </button>
      <button type="button" onClick={() => setOuvert(false)} className="rounded-full px-3 py-1.5 text-sm font-medium text-[#4A6178] hover:bg-white">
        Annuler
      </button>
    </form>
  );
}
