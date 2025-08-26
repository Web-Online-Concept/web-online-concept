export default function CGV() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales de Vente</h1>
          <p className="text-gray-600">En vigueur au 1er août 2025</p>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          {/* Article 1 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 1 - Objet et champ d'application</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Les présentes Conditions Générales de Vente (CGV) constituent le socle unique de 
                la négociation commerciale entre Web Online Concept, auto-entreprise immatriculée 
                sous le numéro SIRET 510 583 800 00048, et ses clients professionnels ou particuliers.
              </p>
              <p>
                Elles s'appliquent, sans restriction ni réserve, à l'ensemble des prestations de 
                services proposées par Web Online Concept, à savoir la création de sites internet, 
                la maintenance, l'hébergement, et tout service annexe.
              </p>
              <p>
                Toute commande de prestations implique l'acceptation sans réserve par le client 
                des présentes CGV, qui prévalent sur tout autre document.
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 2 - Prestations et tarifs</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.1 Description des prestations</h3>
              <p>
                La formule de base comprend : un site web de 5 pages, design responsive, 
                hébergement et nom de domaine inclus la première année, formation d'1 heure, 
                support technique de 30 jours, certificat SSL, conformité RGPD.
              </p>
              
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.2 Tarifs</h3>
              <p>
                Les tarifs en vigueur sont ceux affichés sur le site au moment de la commande. 
                Les prix sont exprimés en euros hors taxes (TVA non applicable selon l'article 
                293 B du CGI pour les auto-entreprises).
              </p>
              
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.3 Devis</h3>
              <p>
                Toute prestation fait l'objet d'un devis détaillé gratuit, valable 30 jours. 
                Le devis signé par le client vaut bon de commande et acceptation des CGV.
              </p>
            </div>
          </section>

          {/* Article 3 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 3 - Modalités de commande et d'exécution</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">3.1 Processus de commande</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Demande de devis via le formulaire en ligne</li>
                <li>Établissement et envoi du devis sous 24-48h ouvrées</li>
                <li>Validation du devis par le client (signature)</li>
                <li>Versement de l'acompte de 50%</li>
                <li>Brief créatif (1h par téléphone)</li>
                <li>Fourniture des contenus par le client sous 1 semaine</li>
                <li>Création du site (2-3 semaines)</li>
                <li>Phase de révision (2h incluses)</li>
                <li>Mise en ligne après paiement du solde</li>
              </ol>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">3.2 Obligations du client</h3>
              <p>
                Le client s'engage à fournir dans les délais convenus : tous les textes, images 
                libres de droits, logo, informations nécessaires à la création du site. Le client 
                garantit détenir tous les droits sur les éléments fournis.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">3.3 Délais</h3>
              <p>
                Les délais de réalisation ne commencent qu'à réception de l'ensemble des éléments 
                nécessaires et du paiement de l'acompte. Tout retard dans la fourniture des 
                éléments entraîne un report équivalent de la livraison.
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 4 - Conditions de paiement</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.1 Modalités</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acompte de 50% à la commande</li>
                <li>Solde de 50% avant la mise en ligne</li>
                <li>Paiement uniquement par virement bancaire</li>
              </ul>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.2 Retard de paiement</h3>
              <p>
                En cas de retard de paiement, des pénalités calculées sur la base de trois fois 
                le taux d'intérêt légal seront appliquées, ainsi qu'une indemnité forfaitaire 
                de 40€ pour frais de recouvrement.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.3 Non-paiement</h3>
              <p>
                Le défaut de paiement du solde entraîne la suspension immédiate de la mise en 
                ligne du site et/ou de tous les services associés, sans préjudice des dommages 
                et intérêts qui pourraient être réclamés.
              </p>
            </div>
          </section>

          {/* Article 5 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 5 - Modifications et révisions</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">5.1 Révisions incluses</h3>
              <p>
                Une session de révision de 2 heures est incluse dans le forfait de base. Cette 
                session permet d'effectuer des modifications mineures sur le design, les textes 
                ou la structure du site.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">5.2 Modifications supplémentaires</h3>
              <p>
                Toute modification majeure ou dépassant le temps de révision inclus fera l'objet 
                d'un nouveau devis. Sont considérées comme majeures : changement de structure, 
                ajout de fonctionnalités, refonte graphique, etc.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">5.3 Validation</h3>
              <p>
                Le client dispose de 7 jours après présentation du site pour demander les 
                modifications incluses. Passé ce délai, le site est considéré comme validé.
              </p>
            </div>
          </section>

          {/* Article 6 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 6 - Propriété intellectuelle</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">6.1 Propriété du site</h3>
              <p>
                Le site web devient la propriété exclusive du client après paiement intégral de 
                la prestation. Jusqu'au paiement complet, Web Online Concept reste propriétaire 
                du code source et de l'ensemble des développements réalisés.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">6.2 Droits de reproduction</h3>
              <p>
                Web Online Concept se réserve le droit de mentionner le nom du client et de 
                présenter le site réalisé dans ses références commerciales et sur son portfolio.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">6.3 Contenus fournis</h3>
              <p>
                Le client garantit que tous les éléments fournis (textes, images, logos) ne 
                portent pas atteinte aux droits de tiers. Il assume l'entière responsabilité 
                en cas de réclamation.
              </p>
            </div>
          </section>

          {/* Article 7 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 7 - Hébergement et maintenance</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">7.1 Première année</h3>
              <p>
                L'hébergement et le nom de domaine sont inclus gratuitement la première année 
                dans le forfait de base.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">7.2 Renouvellement</h3>
              <p>
                À partir de la deuxième année, l'hébergement et le nom de domaine font l'objet 
                d'une facturation annuelle selon les tarifs en vigueur. Le non-renouvellement 
                entraîne la suspension du site.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">7.3 Maintenance</h3>
              <p>
                Les prestations de maintenance (mises à jour, modifications) ne sont pas incluses 
                dans le forfait de base et font l'objet d'un contrat séparé ou de devis ponctuels.
              </p>
            </div>
          </section>

          {/* Article 8 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 8 - Garanties et responsabilités</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">8.1 Garanties</h3>
              <p>Web Online Concept garantit :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Un site conforme aux standards web actuels</li>
                <li>La compatibilité avec les principaux navigateurs</li>
                <li>La conformité RGPD</li>
                <li>Un support technique de 30 jours après livraison</li>
              </ul>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">8.2 Limitations</h3>
              <p>
                Web Online Concept ne peut être tenu responsable des dommages indirects, pertes 
                de données, pertes de profit ou d'opportunités commerciales. Sa responsabilité 
                est limitée au montant de la prestation.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">8.3 Force majeure</h3>
              <p>
                Web Online Concept ne pourra être tenu responsable de l'inexécution de ses 
                obligations en cas de force majeure (catastrophe naturelle, pandémie, grève, 
                défaillance technique majeure, etc.).
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 9 - Résiliation et annulation</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">9.1 Annulation par le client</h3>
              <p>
                En cas d'annulation après signature du devis et versement de l'acompte, celui-ci 
                reste acquis à Web Online Concept à titre d'indemnisation. Si des travaux ont 
                déjà été engagés, ils seront facturés au prorata du temps passé.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">9.2 Résiliation pour non-paiement</h3>
              <p>
                Le non-paiement du solde dans les délais convenus entraîne la résiliation de 
                plein droit du contrat, l'acompte restant acquis.
              </p>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">9.3 Abandon de projet</h3>
              <p>
                Si le client ne fournit pas les éléments nécessaires dans un délai de 3 mois 
                après signature du devis, le projet est considéré comme abandonné et l'acompte 
                reste acquis.
              </p>
            </div>
          </section>

          {/* Article 10 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 10 - Protection des données</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Les données personnelles collectées dans le cadre de la relation commerciale sont 
                traitées conformément au RGPD. Elles sont utilisées uniquement pour la gestion 
                de la commande et la relation client.
              </p>
              <p>
                Le client dispose d'un droit d'accès, de rectification, de suppression et 
                d'opposition concernant ses données. Pour exercer ces droits : 
                web.online.concept@gmail.com
              </p>
            </div>
          </section>

          {/* Article 11 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 11 - Litiges</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Les présentes CGV sont soumises au droit français. En cas de litige, une solution 
                amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux de 
                Toulouse seront seuls compétents.
              </p>
              <p>
                Le client peut recourir à une médiation conventionnelle ou à tout autre mode 
                alternatif de règlement des différends en cas de contestation.
              </p>
            </div>
          </section>

          {/* Article 12 */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 12 - Dispositions diverses</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Si une ou plusieurs dispositions des présentes CGV sont tenues pour non valides, 
                les autres dispositions gardent toute leur force et leur portée.
              </p>
              <p>
                Web Online Concept se réserve le droit de modifier ses CGV à tout moment. Les 
                CGV applicables sont celles en vigueur à la date de signature du devis.
              </p>
              <p>
                Le fait de ne pas exercer à un moment donné un droit prévu dans les présentes 
                CGV ne peut être interprété comme valant renonciation à exercer ce droit 
                ultérieurement.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}