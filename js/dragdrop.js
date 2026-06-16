window.DragDrop = {
  init: () => {
    const grid = document.getElementById('bookmark-grid');
    Sortable.create(grid, {
      animation: 200,
      ghostClass: 'sortable-ghost',
      delay: 200, // Important for touch devices to allow tap to open
      delayOnTouchOnly: true,
      onEnd: (evt) => {
        const itemEl = evt.item;
        const newIndex = evt.newIndex;
        const idToMove = itemEl.dataset.id;
        
        // Reorder in state strictly for visually shown items
        // To safely map back to the master array:
        const visibleIds = Array.from(grid.children).map(c => c.dataset.id);
        
        // Only update custom order if sorting is set to custom
        if (State.sortBy === 'custom') {
          // Update orders
          State.bookmarks.forEach(b => {
            const idx = visibleIds.indexOf(b.id);
            if(idx !== -1) b.order = idx;
          });
          State.save();
        }
      }
    });
  }
};