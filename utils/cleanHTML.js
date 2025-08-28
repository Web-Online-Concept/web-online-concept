export function cleanHTML(html) {
  if (!html) return '';
  
  // Remplacer les entités HTML françaises
  html = html.replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&agrave;/g, 'à')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&Agrave;/g, 'À')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Egrave;/g, 'È')
    .replace(/&middot;/g, '•');
  
  // Supprimer tous les commentaires Word
  html = html.replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Supprimer les balises et attributs Word
  html = html.replace(/class="Mso[^"]*"/gi, '');
  html = html.replace(/style="[^"]*mso-[^"]*"/gi, '');
  html = html.replace(/<o:p[^>]*>[\s\S]*?<\/o:p>/gi, '');
  html = html.replace(/<o:[^>]*>/gi, '');
  html = html.replace(/<\/o:[^>]*>/gi, '');
  
  // Nettoyer les styles inline inutiles
  html = html.replace(/style="[^"]*"/gi, '');
  html = html.replace(/lang="[^"]*"/gi, '');
  
  // Supprimer les spans vides
  html = html.replace(/<span[^>]*>(\s*)<\/span>/gi, '$1');
  html = html.replace(/<span>([^<]*)<\/span>/gi, '$1');
  
  // Convertir les listes Word en vraies listes
  // Détecter les patterns de listes à puces
  html = html.replace(/<p[^>]*>(?:·|•|\*)\s*([^<]+)<\/p>/gi, '<li>$1</li>');
  
  // Entourer les <li> consécutifs avec <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)(\s*<li>)/gi, function(match) {
    return '<ul>' + match.replace(/<\/li>\s*<li>/g, '</li><li>') + '</ul>';
  });
  
  // Corriger les listes orphelines
  html = html.replace(/(<li>[\s\S]*?<\/li>)(?![\s]*<\/ul>)/gi, '<ul>$1</ul>');
  html = html.replace(/<ul>\s*<ul>/g, '<ul>');
  html = html.replace(/<\/ul>\s*<\/ul>/g, '</ul>');
  
  // Nettoyer les attributs inutiles
  html = html.replace(/\s*(class|style|lang)="[^"]*"/gi, '');
  
  // Supprimer les espaces multiples
  html = html.replace(/\s+/g, ' ');
  
  // Nettoyer les paragraphes vides
  html = html.replace(/<p[^>]*>\s*<\/p>/gi, '');
  
  // S'assurer que les paragraphes sont bien fermés
  html = html.replace(/<p>([^<]+)(?!<\/p>)/gi, '<p>$1</p>');
  
  // Ajouter un espace entre les paragraphes consécutifs pour éviter qu'ils soient collés
  html = html.replace(/<\/p>\s*<p>/gi, '</p>\n\n<p>');
  
  // Ajouter un espace après les titres
  html = html.replace(/<\/h([1-6])>\s*<p>/gi, '</h$1>\n\n<p>');
  html = html.replace(/<\/h([1-6])>\s*<h/gi, '</h$1>\n\n<h');
  
  // Ajouter un espace autour des listes
  html = html.replace(/<\/p>\s*<ul>/gi, '</p>\n\n<ul>');
  html = html.replace(/<\/ul>\s*<p>/gi, '</ul>\n\n<p>');
  html = html.replace(/<\/p>\s*<ol>/gi, '</p>\n\n<ol>');
  html = html.replace(/<\/ol>\s*<p>/gi, '</ol>\n\n<p>');
  
  return html.trim();
}