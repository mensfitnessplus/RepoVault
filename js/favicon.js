window.Favicon = {
  getIconUrl: (url) => {
    try {
      const hostname = new URL(url).hostname;
      // Using reliable Google S2 Favicon API
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {
      return '';
    }
  }
};