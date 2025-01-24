document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  toggleSwitch.checked = true;

  toggleSwitch.addEventListener('change', () => {
    chrome.runtime.sendMessage({ action: 'toggleAssistiveTouch', state: toggleSwitch.checked });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');

    toggleButton.addEventListener('click', function() {
        // 发送消息到background.js
        chrome.runtime.sendMessage({ action: 'toggleAssistiveTouch' });
    });
});
