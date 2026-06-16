// Global State Management
window.State = {
  bookmarks: [],
  allTags: [],
  activeFilters: [],
  searchQuery: '',
  sortBy: 'custom',

  load: () => {
    State.bookmarks = Storage.loadBookmarks();
  },
  save: () => {
    Storage.saveBookmarks(State.bookmarks);
  },
  getById: (id) => State.bookmarks.find(b => b.id === id)
};

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  State.load();
  Theme.init();
  Modals.init();
  Search.init();
  DragDrop.init();
  ImportExport.init();
  PWA.init();
  
  // Initial Render
  UI.render();
});