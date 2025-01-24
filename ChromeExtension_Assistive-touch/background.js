chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleAssistiveTouch') {
        // 转发消息到content.js
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAssistiveTouch' });
        });
    }
});

function toggleAssistiveTouch(state) {
  const assistiveTouch = document.querySelector('.assistive-touch');
  if (assistiveTouch) {
    assistiveTouch.style.display = state ? 'flex' : 'none';
  } else {
    // If the assistive touch button does not exist, create it
    const assistiveTouchHTML = `
      <div class="assistive-touch">+</div>
      <div class="menu">
        <a href="https://example.com/option1" class="menu-item">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 1</span>
        </a>
        <a href="https://example.com/option2" class="menu-item">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 2</span>
        </a>
        <a href="https://example.com/option3" class="menu-item">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 3</span>
        </a>
        <a href="https://example.com/option4" class="menu-item">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 4</span>
        </a>
        <a href="https://example.com/option5" class="menu-item">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 5</span>
        </a>
        <a href="https://example.com/option6" class="menu-item">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 6</span>
        </a>
        <a href="https://example.com/option7" class="menu-item">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 7</span>
        </a>
        <a href="https://example.com/option8" class="menu-item">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 8</span>
        </a>
        <div class="menu-item" onclick="closeMenu()">
          <img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png">
          <span>Option 9</span>
        </div>
      </div>
    `;
    const assistiveTouchStyle = `
      <style>
        .assistive-touch {
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, #e6e5e5, #a8a6a6);
          border-radius: 10px;
          position: fixed;
          top: 40%;
          right: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 24px;
          cursor: pointer;
          user-select: none;
          touch-action: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .assistive-touch.dragging {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .assistive-touch::before {
          content: '';
          width: 50%;
          height: 50%;
          background-color: rgb(231, 229, 229);
          border-radius: 50%;
          position: absolute;
        }
        .menu {
          display: none;
          position: fixed;
          background: radial-gradient(circle, #e6e5e5, #a8a6a6);
          border-radius: 10px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          cursor: move;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .menu.dragging {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .menu a {
          text-decoration: none;
          color: white;
        }
        .menu-item {
          width: 70px;
          height: 70px;
          border-radius: 10px;
          margin: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: #ffffff;
          font-size: 12px;
          cursor: pointer;
        }
        .menu-item img {
          width: 30px;
          height: 30px;
          margin-bottom: 5px;
        }
      </style>
    `;
    document.body.insertAdjacentHTML('beforeend', assistiveTouchHTML);
    document.head.insertAdjacentHTML('beforeend', assistiveTouchStyle);
  }
}
