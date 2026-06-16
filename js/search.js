window.Search = {
  init: () => {
    const input = document.getElementById('search-input');
    input.addEventListener('input', Utils.debounce((e) => {
      State.searchQuery = e.target.value.toLowerCase().trim();
      UI.render();
    }, 200));

    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
      State.sortBy = e.target.value;
      UI.render();
    });
  }
};