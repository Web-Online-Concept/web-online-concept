export function convertChatGPTToHTML(content) {
  // Séparer le contenu en lignes
  let lines = content.split('\n');
  let html = '';
  let inList = false;
  let inNumberedList = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Ignorer les lignes vides multiples
    if (!line && i > 0 && !lines[i-1].trim()) {
      continue;
    }
    
    // Fermer les listes si on sort d'une liste
    if (inList && !line.startsWith('*') && !line.startsWith('-')) {
      html += '</ul>\n';
      inList = false;
    }
    if (inNumberedList && !line.match(/^\d+\./)) {
      html += '</ol>\n';
      inNumberedList = false;
    }
    
    // Titres avec emojis (les garder)
    if (line.match(/^[🔍📱🌍🚀🛠️💡✨🎯📊⚡]/)) {
      // Séparer l'emoji du texte
      const emojiMatch = line.match(/^([🔍📱🌍🚀🛠️💡✨🎯📊⚡]+)\s*(.+)/);
      if (emojiMatch) {
        const emoji = emojiMatch[1];
        let titleText = emojiMatch[2];
        // Appliquer le formatage sur le texte du titre
        titleText = applyInlineFormatting(titleText);
        html += `<h2>${emoji} ${titleText}</h2>\n`;
        continue;
      }
    }
    
    // Listes à puces
    if (line.startsWith('*') || line.startsWith('-')) {
      if (!inList) {
        html += '<ul>\n';
        inList = true;
      }
      let listItem = line.substring(1).trim();
      listItem = applyInlineFormatting(listItem);
      html += `  <li>${listItem}</li>\n`;
      continue;
    }
    
    // Listes numérotées
    if (line.match(/^\d+\./)) {
      if (!inNumberedList) {
        html += '<ol>\n';
        inNumberedList = true;
      }
      let listItem = line.replace(/^\d+\./, '').trim();
      // Si le premier mot est en gras, c'est un titre de point
      if (listItem.startsWith('**')) {
        const titleMatch = listItem.match(/^\*\*([^*]+)\*\*(.*)/);
        if (titleMatch) {
          listItem = `<strong>${titleMatch[1]}</strong>${titleMatch[2]}`;
        }
      }
      listItem = applyInlineFormatting(listItem);
      html += `  <li>${listItem}</li>\n`;
      continue;
    }
    
    // Paragraphes normaux
    if (line) {
      line = applyInlineFormatting(line);
      // Ajouter des espaces après la ponctuation si manquants
      line = line.replace(/\.([A-Z])/g, '. $1');
      line = line.replace(/\?([A-Z])/g, '? $1');
      line = line.replace(/!([A-Z])/g, '! $1');
      line = line.replace(/:([A-Z])/g, ': $1');
      
      html += `<p>${line}</p>\n`;
    }
  }
  
  // Fermer les listes si nécessaire
  if (inList) html += '</ul>\n';
  if (inNumberedList) html += '</ol>\n';
  
  return html;
}

function applyInlineFormatting(text) {
  // Protéger les emojis pour qu'ils ne soient pas affectés
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|👉/gu;
  const emojis = [];
  text = text.replace(emojiRegex, (match) => {
    emojis.push(match);
    return `__EMOJI_${emojis.length - 1}__`;
  });
  
  // Remplacer les formats Markdown
  // Gras avec **
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italique avec * (mais pas les ** déjà traités)
  text = text.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');
  
  // Italique avec _
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
  
  // Code inline avec `
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Liens [texte](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Restaurer les emojis
  text = text.replace(/__EMOJI_(\d+)__/g, (match, index) => {
    return emojis[parseInt(index)];
  });
  
  return text;
}

// Fonction pour nettoyer le contenu existant dans la base
export function cleanExistingContent(content) {
  // Si c'est déjà du HTML valide, ne pas toucher
  if (content.includes('<p>') || content.includes('<h1>') || content.includes('<h2>')) {
    return content;
  }
  
  // Sinon, convertir
  return convertChatGPTToHTML(content);
}