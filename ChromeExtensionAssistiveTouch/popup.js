document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const menuItemsContainer = document.getElementById('menuItemsContainer');
  const saveConfigButton = document.getElementById('saveConfig');

  // Set the initial state of the switch
  chrome.storage.sync.get("assistiveTouchEnabled", ({ assistiveTouchEnabled }) => {
    toggleSwitch.checked = assistiveTouchEnabled;
  });

  // Load menu items configuration
  chrome.storage.sync.get("menuItems", ({ menuItems }) => {
    if (!menuItems) {
      menuItems = [
        { logo: "https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png", name: "Option 1", url: "https://example.com/option1" },
        { logo: "https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png", name: "Option 2", url: "https://example.com/option2" },
        // Add more default items as needed
      ];
    }
    renderMenuItems(menuItems);
  });

  // Add event listener for switch toggle
  toggleSwitch.addEventListener('change', () => {
    const newStatus = toggleSwitch.checked;
    chrome.storage.sync.set({ assistiveTouchEnabled: newStatus });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleAssistiveTouch", enabled: newStatus });
    });
  });

  // Render menu items for editing
  function renderMenuItems(menuItems) {
    menuItemsContainer.innerHTML = '';
    menuItems.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item-config';
      itemDiv.innerHTML = `
        <input type="text" placeholder="Logo URL" value="${item.logo}" data-index="${index}" data-type="logo">
        <input type="text" placeholder="Name" value="${item.name}" data-index="${index}" data-type="name">
        <input type="text" placeholder="URL" value="${item.url}" data-index="${index}" data-type="url">
      `;
      menuItemsContainer.appendChild(itemDiv);
    });
  }

  // Save configuration
  saveConfigButton.addEventListener('click', () => {
    const inputs = menuItemsContainer.querySelectorAll('input');
    const menuItems = [];
    inputs.forEach(input => {
      const index = input.getAttribute('data-index');
      const type = input.getAttribute('data-type');
      if (!menuItems[index]) menuItems[index] = {};
      menuItems[index][type] = input.value;
    });
    chrome.storage.sync.set({ menuItems }, () => {
      alert('Configuration saved!');
      // Notify content script to update menu items
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "updateMenuItems" });
      });
    });
  });
}); 