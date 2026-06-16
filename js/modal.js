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
    
    // NEW: Open edit modal and focus icon input
    document.getElementById('as-change-icon').addEventListener('click', () => {
      Modals.closeActionSheet();
      Modals.openEdit(Modals.activeBookmarkId);
      document.getElementById('bm-icon-url').focus();
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
    document.getElementById('bm-icon-url').value = '';
    document.getElementById('bm-icon-file').value = '';
    document.getElementById('modal-bookmark').classList.remove('hidden');
  },

  openEdit: (id) => {
    const b = State.getById(id);
    if(!b) return;
    document.getElementById('modal-title').textContent = 'Edit Bookmark';
    document.getElementById('bm-id').value = b.id;
    document.getElementById('bm-url').value = b.url;
    document.getElementById('bm-name').value = b.name;
    document.getElementById('bm-icon-url').value = ''; // Left blank to prevent breaking base64 edits
    document.getElementById('bm-icon-file').value = '';
    document.getElementById('bm-tags').value = b.tags.join(', ');
    document.getElementById('bm-notes').value = b.notes;
    document.getElementById('modal-bookmark').classList.remove('hidden');
  },

  handleSave: async (e) => {
    e.preventDefault();
    const id = document.getElementById('bm-id').value;
    const url = document.getElementById('bm-url').value;
    const name = document.getElementById('bm-name').value || Utils.extractDomain(url);
    const tags = Utils.parseTags(document.getElementById('bm-tags').value);
    const notes = document.getElementById('bm-notes').value;
    
    // Icon overrides
    const iconUrlInput = document.getElementById('bm-icon-url').value;
    const iconFileInput = document.getElementById('bm-icon-file').files[0];
    
    let finalIcon = '';
    
    if (iconFileInput) {
      finalIcon = await Modals.fileToBase64(iconFileInput);
    } else if (iconUrlInput) {
      finalIcon = iconUrlInput;
    }

    if (id) {
      // Edit
      const b = State.getById(id);
      b.url = url; 
      b.name = name; 
      b.tags = tags; 
      b.notes = notes;
      b.updatedAt = Date.now();
      
      // If a custom icon was provided, update it. 
      // If not, but the URL changed, fetch the new automatic icon.
      if (finalIcon) {
        b.icon = finalIcon;
      } else if (b.url !== url) {
        b.icon = Favicon.getIconUrl(url);
      }
    } else {
      // Add
      if (!finalIcon) {
        finalIcon = Favicon.getIconUrl(url);
      }
      
      State.bookmarks.push({
        id: Utils.generateId(),
        url, name, tags, notes,
        icon: finalIcon,
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

  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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
