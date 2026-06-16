window.Storage = {
  loadBookmarks: () => JSON.parse(localStorage.getItem('repovault_bookmarks') || '[]'),
  saveBookmarks: (data) => localStorage.setItem('repovault_bookmarks', JSON.stringify(data)),
  
  loadSettings: () => JSON.parse(localStorage.getItem('repovault_settings') || '{"theme":"dark"}'),
  saveSettings: (data) => localStorage.setItem('repovault_settings', JSON.stringify(data)),

  exportData: () => {
    return JSON.stringify({
      version: 1,
      settings: Storage.loadSettings(),
      bookmarks: Storage.loadBookmarks()
    }, null, 2);
  },
  
  importData: (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.bookmarks) Storage.saveBookmarks(parsed.bookmarks);
      if (parsed.settings) Storage.saveSettings(parsed.settings);
      return true;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  }
};