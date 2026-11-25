"use client";

import { useState } from "react";
import { classeBoutonSecondaire } from "@/components/admin/ui";

export default function CopierLien({ chemin }: { chemin: string }) {
  const [copie, setCopie] = useState(false);
  async function copier() {
    const url = `${window.location.origin}${chemin}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    } catch {
      window.prompt("Copiez ce lien :", url);
    }
  }
  return (
    <button type="button" onClick={copier} className={classeBoutonSecondaire} aria-live="polite">
      {copie ? "Lien copié" : "Copier le lien d'acceptation"}
    </button>
  );
}
