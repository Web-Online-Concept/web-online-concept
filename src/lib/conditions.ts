// Conditions de réalisation : jointes en page 2 de chaque devis et rappelées sur la page d'acceptation en ligne.
// Texte validé par Florent le 28/11/2026.

export const TITRE_CONDITIONS = "Conditions de réalisation";

export const CONDITIONS: { titre: string; texte: string }[] = [
  {
    titre: "Le projet",
    texte:
      "Le devis décrit précisément ce qui est réalisé. Tout ajout ou changement fait l'objet d'un devis complémentaire, accepté avant d'être réalisé.",
  },
  {
    titre: "Déroulement",
    texte:
      "Nous cadrons le projet avec vous, puis il avance par étapes que vous essayez et validez en ligne. Le planning convenu démarre à réception des éléments nécessaires.",
  },
  {
    titre: "Contenus",
    texte:
      "Vous fournissez les textes, images et informations à publier, et vous garantissez disposer des droits pour les utiliser. Leur rédaction ou la fourniture de visuels peuvent être ajoutées au devis.",
  },
  {
    titre: "Paiement",
    texte:
      "Selon les modalités indiquées sur le devis, par exemple un acompte à la commande et le solde à la mise en ligne. Les factures se règlent par virement, à leur date d'échéance.",
  },
  {
    titre: "Propriété",
    texte: "Une fois le projet entièrement réglé, le site ou l'application et son contenu vous appartiennent.",
  },
  {
    titre: "Abonnements",
    texte:
      "L'hébergement, le nom de domaine et les services tiers nécessaires sont à renouveler selon les offres choisies, sauf mention contraire sur le devis.",
  },
  {
    titre: "Mise en ligne et suivi",
    texte:
      "Une prise en main vous est présentée à la mise en ligne. Les corrections d'anomalies signalées dans les 30 jours qui suivent sont incluses ; au-delà, les évolutions font l'objet d'un devis ou d'un contrat de suivi.",
  },
  {
    titre: "Références",
    texte: "Sauf refus de votre part, nous pouvons présenter le projet parmi nos réalisations.",
  },
];

// Clients particuliers (contrat conclu à distance, art. L221-18 et suivants du Code de la consommation)
export const RETRACTATION = {
  titre: "Droit de rétractation (clients particuliers)",
  texte: [
    "Vous disposez d'un délai de 14 jours à compter de l'acceptation du devis pour vous rétracter, sans avoir à vous justifier. Il suffit de nous le faire savoir par écrit, par exemple par e-mail ou avec le formulaire ci-dessous.",
    "Les travaux commencent après ce délai, sauf si vous demandez expressément qu'ils démarrent plus tôt. Dans ce cas, si vous vous rétractez ensuite, seule la part déjà réalisée vous est facturée, en proportion du prix total.",
  ],
  formulaire: (emetteur: string, adresse: string, email: string, numero: string) => [
    `À l'attention de ${emetteur}, ${adresse}, ${email} :`,
    `Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de services du devis ${numero}.`,
    "Accepté le : ..................................",
    "Nom du client : ..................................",
    "Adresse du client : ..................................",
    "Date et signature (uniquement en cas d'envoi sur papier) : ..................................",
  ],
};
