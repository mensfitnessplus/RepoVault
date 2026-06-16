window.Theme = {
  init: () => {
    const settings = Storage.loadSettings();
    Theme.applyTheme(settings.theme || 'dark');
    
    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      Theme.applyTheme(next);
      
      const setts = Storage.loadSettings();
      setts.theme = next;
      Storage.saveSettings(setts);
    });
  },
  
  applyTheme: (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    const metaTheme = document.getElementById('meta-theme-color');
    metaTheme.content = themeName === 'dark' ? '#151515' : '#f5f1e8';
  }
};