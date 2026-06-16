window.UI = {
  render: () => {
    const grid = document.getElementById('bookmark-grid');
    const emptyState = document.getElementById('empty-state');
    grid.innerHTML = '';

    // Apply Filters & Search
    let filtered = State.bookmarks.filter(b => {
      const matchSearch = !State.searchQuery || 
        b.name.toLowerCase().includes(State.searchQuery) ||
        b.url.toLowerCase().includes(State.searchQuery) ||
        b.notes.toLowerCase().includes(State.searchQuery) ||
        b.tags.some(t => t.includes(State.searchQuery));
      
      const matchTags = State.activeFilters.length === 0 || 
        State.activeFilters.every(f => b.tags.includes(f));

      return matchSearch && matchTags;
    });

    // Apply Sorting
    filtered.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1; // Pinned always first
      
      switch(State.sortBy) {
        case 'alpha': return a.name.localeCompare(b.name);
        case 'recent': return b.createdAt - a.createdAt;
        case 'frequent': return b.clickCount - a.clickCount;
        case 'custom': default: return (a.order || 0) - (b.order || 0);
      }
    });

    if(filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      filtered.forEach(b => grid.appendChild(UI.createCard(b)));
    }

    // Update Stats & Tags
    Tags.renderFilter();
    document.getElementById('stat-total').textContent = `${State.bookmarks.length} items`;
    document.getElementById('stat-pinned').textContent = `${State.bookmarks.filter(b=>b.pinned).length} pinned`;
  },

  createCard: (b) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.id = b.id;

    const tagsHtml = b.tags.slice(0, 3).map(t => `<span class="card-tag">${t}</span>`).join('');
    
    div.innerHTML = `
      <div class="card-header">
        <img src="${b.icon}" class="card-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAzMiAzMiIgZmlsbD0iIzY2NiI+PHBhdGggZD0iTTI2IDIySDZWMTBINHYxNGEyIDIgMCAwMDIgMmgxOHYtNHoiLz48cGF0aCBkPSJNMjYgNkgxMGEyIDIgMCAwMDItMnYxNGgyYS4wOS4wOSAwIDAxLjExLjExdi43OEwxNi4yIDE3bDEuNiAxLjZhMSAxIDAgMDAxLjM5IDBsMi44LTIuOCA0IDRWMmEyIDIgMCAwMDItMiIvPjwvc3ZnPg=='" alt="icon">
        ${b.pinned ? '<span class="pin-indicator">📌</span>' : ''}
      </div>
      <div class="card-title">${b.name}</div>
      <div class="card-tags">${tagsHtml}</div>
    `;

    // Interaction Events
    let touchTimer;
    const triggerLongPress = () => Modals.openActionSheet(b.id);
    
    div.addEventListener('touchstart', (e) => {
      touchTimer = setTimeout(triggerLongPress, 500);
    }, {passive: true});
    
    div.addEventListener('touchend', () => clearTimeout(touchTimer));
    div.addEventListener('touchmove', () => clearTimeout(touchTimer));
    
    // For Desktop long-press equivalent
    div.addEventListener('mousedown', (e) => {
      if(e.button === 0) touchTimer = setTimeout(triggerLongPress, 500);
    });
    div.addEventListener('mouseup', () => clearTimeout(touchTimer));
    div.addEventListener('mouseleave', () => clearTimeout(touchTimer));
    div.addEventListener('contextmenu', (e) => { e.preventDefault(); triggerLongPress(); });

    // Normal Click (Open URL)
    div.addEventListener('click', (e) => {
      if (touchTimer) clearTimeout(touchTimer);
      // Ensure we don't trigger open if dragging or right-clicking
      if (!e.defaultPrevented) UI.openUrl(b);
    });

    return div;
  },

  openUrl: (bookmark) => {
    bookmark.clickCount = (bookmark.clickCount || 0) + 1;
    bookmark.updatedAt = Date.now();
    State.save();
    window.open(bookmark.url, '_blank');
    // Re-render asynchronously to reflect click count without delaying navigation
    setTimeout(UI.render, 500);
  }
};