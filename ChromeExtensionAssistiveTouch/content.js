chrome.storage.sync.get("assistiveTouchEnabled", ({ assistiveTouchEnabled }) => {
  if (assistiveTouchEnabled) {
    insertAssistiveTouch();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleAssistiveTouch") {
    if (request.enabled) {
      insertAssistiveTouch();
    } else {
      removeAssistiveTouch();
    }
  } else if (request.action === "updateMenuItems") {
    updateMenuItems();
  }
});

function insertAssistiveTouch() {
  if (!document.querySelector('.assistive-touch')) {
    const assistiveTouch = document.createElement('div');
    assistiveTouch.className = 'assistive-touch';
    assistiveTouch.textContent = '+';
    document.body.appendChild(assistiveTouch);

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.style.display = 'none';
    document.body.appendChild(menu);

    updateMenuItems();

    const style = document.createElement('style');
    style.textContent = `
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
        z-index: 9999;
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
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        cursor: move;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        width: 250px;
        z-index: 9999;
        padding: 10px;
      }
      .menu.dragging {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      .menu a {
        text-decoration: none;
        color: white;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 5px 0;
      }
      .menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 5px 0;
        cursor: pointer;
      }
      .menu-item img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
      .menu-item span {
        flex-grow: 1;
      }
    `;
    document.head.appendChild(style);

    let isDragging = false;
    let offsetX, offsetY;
    let wasDragged = false;
    let assistiveTouchLeft, assistiveTouchTop;

    assistiveTouch.addEventListener('mousedown', (e) => {
      isDragging = true;
      wasDragged = false;
      offsetX = e.clientX - assistiveTouch.getBoundingClientRect().left;
      offsetY = e.clientY - assistiveTouch.getBoundingClientRect().top;
      assistiveTouch.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        wasDragged = true;
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + assistiveTouch.offsetWidth > window.innerWidth) {
          newLeft = window.innerWidth - assistiveTouch.offsetWidth;
        }
        if (newTop + assistiveTouch.offsetHeight > window.innerHeight) {
          newTop = window.innerHeight - assistiveTouch.offsetHeight;
        }

        assistiveTouch.style.left = `${newLeft}px`;
        assistiveTouch.style.top = `${newTop}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        assistiveTouch.classList.remove('dragging');
        if (wasDragged) {
          assistiveTouch.style.pointerEvents = 'none';
          setTimeout(() => {
            assistiveTouch.style.pointerEvents = 'auto';
          }, 100);
        }
      }
    });

    assistiveTouch.addEventListener('click', () => {
      if (!wasDragged) {
        toggleMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (menu.style.display === 'flex' && !menu.contains(e.target) && !assistiveTouch.contains(e.target)) {
        closeMenu();
      }
    });

    function toggleMenu() {
      if (menu.style.display === 'none' || menu.style.display === '') {
        assistiveTouchLeft = assistiveTouch.style.left;
        assistiveTouchTop = assistiveTouch.style.top;
        let menuLeft = assistiveTouch.offsetLeft + (assistiveTouch.getBoundingClientRect().width / 2) - menu.offsetWidth / 2;
        let menuTop = assistiveTouch.offsetTop + (assistiveTouch.getBoundingClientRect().height / 2) - menu.offsetHeight / 2;
        if (menuLeft < 0) menuLeft = 0;
        if (menuTop < 0) menuTop = 0;
        if (menuLeft + menu.offsetWidth > window.innerWidth) {
          menuLeft = window.innerWidth - menu.offsetWidth;
        }
        if (menuTop + menu.offsetHeight > window.innerHeight) {
          menuTop = window.innerHeight - menu.offsetHeight;
        }
        menu.style.display = 'flex';
        menu.style.left = `${menuLeft}px`;
        menu.style.top = `${menuTop}px`;
        assistiveTouch.style.display = 'none';
      } else {
        closeMenu();
      }
    }

    function closeMenu() {
      menu.style.display = 'none';
      assistiveTouch.style.display = 'flex';
      assistiveTouch.style.left = assistiveTouchLeft;
      assistiveTouch.style.top = assistiveTouchTop;
    }
  }
}

function updateMenuItems() {
  const menu = document.querySelector('.menu');
  if (menu) {
    menu.innerHTML = ''; // Clear existing menu items
    chrome.storage.sync.get("menuItems", ({ menuItems }) => {
      if (!menuItems) {
        menuItems = [
          { logo: "https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png", name: "Option 1", url: "https://example.com/option1" },
          { logo: "https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png", name: "Option 2", url: "https://example.com/option2" },
          // Add more default items as needed
        ];
      }
      menuItems.forEach(item => {
        const menuItem = document.createElement('a');
        menuItem.href = item.url;
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `<img src="${item.logo}"><span>${item.name}</span>`;
        menu.appendChild(menuItem);
      });

      const closeMenuItem = document.createElement('div');
      closeMenuItem.className = 'menu-item';
      closeMenuItem.innerHTML = `<img src="https://cuntou0906.github.io/XiaocunLiao/images/LogoR.png"><span>Close</span>`;
      closeMenuItem.addEventListener('click', closeMenu);
      menu.appendChild(closeMenuItem);
    });
  }
}

function removeAssistiveTouch() {
  const assistiveTouch = document.querySelector('.assistive-touch');
  const menu = document.querySelector('.menu');
  if (assistiveTouch) {
    assistiveTouch.remove();
  }
  if (menu) {
    menu.remove();
  }
} 