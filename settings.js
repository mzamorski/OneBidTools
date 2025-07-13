document.addEventListener('DOMContentLoaded', () => {
  const filterSelect = document.getElementById('filter-select');
  const markerSelect = document.getElementById('marker-select');

  function populateSelect(select, enumObj) {
    for (const key in enumObj) {
      const { label, value } = enumObj[key];
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    }
  }

  populateSelect(filterSelect, RowFilterType);
  populateSelect(markerSelect, RowMarkerType);

  // Przywrócenie poprzednio zapisanych wartości
  chrome.storage.sync.get(['selectedFilter', 'selectedMarker'], (data) => {
    if (data.selectedFilter) filterSelect.value = data.selectedFilter;
    if (data.selectedMarker) markerSelect.value = data.selectedMarker;
  });

  document.getElementById('save-button').addEventListener('click', () => {
    const selectedFilter = filterSelect.value;
    const selectedMarker = markerSelect.value;

    chrome.storage.sync.set({ selectedFilter, selectedMarker }, () => {
      console.log("Ustawienia zapisane:", selectedFilter, selectedMarker);

      // Wyślij wiadomość do content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'settingsChanged',
            selectedFilter,
            selectedMarker
          });
        }
      });
    });
  });
});
