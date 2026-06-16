window.Tags = {
  renderFilter: () => {
    const container = document.getElementById('filter-container');
    container.innerHTML = '';
    
    // Extract unique tags
    const allTags = new Set();
    State.bookmarks.forEach(b => b.tags.forEach(t => allTags.add(t)));
    State.allTags = Array.from(allTags).sort();

    State.allTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = `tag-badge ${State.activeFilters.includes(tag) ? 'active' : ''}`;
      btn.textContent = tag;
      btn.addEventListener('click', () => {
        if(State.activeFilters.includes(tag)) {
          State.activeFilters = State.activeFilters.filter(t => t !== tag);
        } else {
          State.activeFilters.push(tag);
        }
        UI.render();
      });
      container.appendChild(btn);
    });
  }
};