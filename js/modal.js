window.Modals = {
  activeBookmarkId: null,

  init: () => {
    // Open Modals
    document.getElementById('fab-add').addEventListener('click', () => Modals.openAdd());
    document.getElementById('btn-settings').addEventListener('click', () => {
      document.getElementById('modal-settings').classList.remove('hidden');
    });

    // Close Modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.getElementById(e.target.dataset.close).classList.add('hidden');
      });
    });

    // Save Form
    document.getElementById('form-bookmark').addEventListener('submit', Modals.handleSave);

    // Action Sheet Overlay click
    document.getElementById('action-sheet-overlay').addEventListener('click', Modals.closeActionSheet);
    
    // Action Sheet Buttons
    document.getElementById('as-open').addEventListener('click', () => {
      const b = State.getById(Modals.activeBookmarkId);
      Modals.closeActionSheet();
      UI.openUrl(b);
    });
    document.getElementById('as-edit').addEventListener('click', () => {
      Modals.closeActionSheet();
      Modals.openEdit(Modals.activeBookmarkId);
    });
    document.getElementById('as-pin').addEventListener('click', () => {
      const b = State.getById(Modals.activeBookmarkId);
      b.pinned = !b.pinned;
      State.save();
      UI.render();
      Modals.closeActionSheet();
    });
    document.getElementById('as-duplicate').addEventListener('click', () => {
      const b = State.getById(Modals.activeBookmarkId);
      const dup = { ...b, id: Utils.generateId(), createdAt: Date.now() };
      State.bookmarks.push(dup);
      State.save();
      UI.render();
      Modals.closeActionSheet();
    });
    document.getElementById('as-delete').addEventListener('click', () => {
      if(confirm('Delete this bookmark?')) {
        State.bookmarks = State.bookmarks.filter(b => b.id !== Modals.activeBookmarkId);
        State.save();
        UI.render();
      }
      Modals.closeActionSheet();
    });
  },

  openAdd: () => {
    document.getElementById('modal-title').textContent = 'Add Bookmark';
    document.getElementById('form-bookmark').reset();
    document.getElementById('bm-id').value = '';
    document.getElementById('modal-bookmark').classList.remove('hidden');
  },

  openEdit: (id) => {
    const b = State.getById(id);
    if(!b) return;
    document.getElementById('modal-title').textContent = 'Edit Bookmark';
    document.getElementById('bm-id').value = b.id;
    document.getElementById('bm-url').value = b.url;
    document.getElementById('bm-name').value = b.name;
    document.getElementById('bm-tags').value = b.tags.join(', ');
    document.getElementById('bm-notes').value = b.notes;
    document.getElementById('modal-bookmark').classList.remove('hidden');
  },

  handleSave: (e) => {
    e.preventDefault();
    const id = document.getElementById('bm-id').value;
    const url = document.getElementById('bm-url').value;
    const name = document.getElementById('bm-name').value || Utils.extractDomain(url);
    const tags = Utils.parseTags(document.getElementById('bm-tags').value);
    const notes = document.getElementById('bm-notes').value;

    if (id) {
      // Edit
      const b = State.getById(id);
      b.url = url; b.name = name; b.tags = tags; b.notes = notes;
      b.updatedAt = Date.now();
      b.icon = Favicon.getIconUrl(url); // refresh icon just in case
    } else {
      // Add
      State.bookmarks.push({
        id: Utils.generateId(),
        url, name, tags, notes,
        icon: Favicon.getIconUrl(url),
        pinned: false,
        clickCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: State.bookmarks.length
      });
    }

    State.save();
    UI.render();
    document.getElementById('modal-bookmark').classList.add('hidden');
  },

  openActionSheet: (id) => {
    Modals.activeBookmarkId = id;
    const b = State.getById(id);
    document.getElementById('as-title').textContent = b.name;
    document.getElementById('action-sheet-overlay').classList.remove('hidden');
    document.getElementById('action-sheet').classList.remove('hidden');
  },

  closeActionSheet: () => {
    document.getElementById('action-sheet-overlay').classList.add('hidden');
    document.getElementById('action-sheet').classList.add('hidden');
  }
};