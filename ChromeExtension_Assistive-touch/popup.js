document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  toggleSwitch.checked = true;

  toggleSwitch.addEventListener('change', () => {
    chrome.runtime.sendMessage({ action: 'toggleAssistiveTouch', state: toggleSwitch.checked });
  });
});
