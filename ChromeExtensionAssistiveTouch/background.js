chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ assistiveTouchEnabled: true });
}); 