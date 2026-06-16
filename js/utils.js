window.Utils = {
  generateId: () => 'id-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
  debounce: (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  },
  extractDomain: (urlStr) => {
    try { return new URL(urlStr).hostname; } 
    catch { return urlStr; }
  },
  parseTags: (tagStr) => {
    if (!tagStr) return [];
    return tagStr.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
  }
};