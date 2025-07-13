
document.getElementById('save-button').addEventListener('click', () => {
  const selectedFilter = document.getElementById('filter-select').value;
  const selectedMarker = document.getElementById('marker-select').value;

  chrome.storage.sync.set({ selectedFilter, selectedMarker }, () => {
    console.log("Ustawienia zapisane:", selectedFilter, selectedMarker);

    // Wyślij wiadomość do content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'settingsChanged',
          selectedFilter,
          selectedMarker
        });
      }
    });
  });
});
