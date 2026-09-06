(() => {
  const container = document.getElementById('search');
  const fallback = document.getElementById('search-fallback');
  document.getElementById('back-link').addEventListener('click', (event) => {
    if (history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });

  if (!window.PagefindUI) return;

  // Keep the current search on its history entry: following a result and
  // returning, or opening a shared URL, should restore the same discovery path.
  const filterPrefix = 'filter.';
  let term = '';
  let filters = new Map();
  function saveState() {
    const url = new URL(location.href);
    url.searchParams.delete('q');
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith(filterPrefix)) url.searchParams.delete(key);
    }
    if (term) url.searchParams.set('q', term);
    for (const [name, values] of filters) {
      for (const value of values) url.searchParams.append(filterPrefix + name, value);
    }
    history.replaceState(history.state, '', url);
  }

  let search;
  try {
    search = new PagefindUI({
      element: '#search',
      showSubResults: true,
      showImages: false,
      excerptLength: 50,
    });
  } catch {
    return;
  }
  fallback.hidden = true;

  function restoreState() {
    const params = new URL(location.href).searchParams;
    term = params.get('q') || '';
    filters = new Map();
    for (const [key, value] of params) {
      if (!key.startsWith(filterPrefix) || !value) continue;
      const name = key.slice(filterPrefix.length);
      if (!name) continue;
      if (!filters.has(name)) filters.set(name, new Set());
      filters.get(name).add(value);
    }
    search.triggerFilters(Object.fromEntries([...filters].map(([key, values]) => [key, [...values]])));
    if (term) search.triggerSearch(term);
    else {
      // Pagefind's triggerSearch ignores an empty string. Use its normal input
      // path when a history entry restores an empty query.
      const input = container.querySelector('.pagefind-ui__search-input');
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Save immediately, even if a result is opened before Pagefind's debounce.
  container.addEventListener('input', (event) => {
    if (!event.target.matches('.pagefind-ui__search-input')) return;
    term = event.target.value;
    saveState();
  });
  // Pagefind clears its internal value without emitting an input event for
  // these two controls. Preserve that action in the current history entry too.
  container.addEventListener('click', (event) => {
    if (!event.target.closest('.pagefind-ui__search-clear')) return;
    term = '';
    saveState();
  });
  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !event.target.matches('.pagefind-ui__search-input')) return;
    term = '';
    saveState();
  });
  container.addEventListener('change', (event) => {
    const input = event.target;
    if (!input.matches('input[type="checkbox"][name]')) return;
    if (!filters.has(input.name)) filters.set(input.name, new Set());
    const values = filters.get(input.name);
    if (input.checked) values.add(input.value);
    else values.delete(input.value);
    saveState();
  });
  window.addEventListener('popstate', restoreState);
  restoreState();
})();
