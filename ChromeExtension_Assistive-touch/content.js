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

const assistiveTouch = document.querySelector('.assistive-touch');
const menu = document.querySelector('.menu');
let isDragging = false;
let offsetX, offsetY;
let PoX, PoY;
let PoX_dex, PoY_dex;
let wasDragged = false;
let assistiveTouchLeft, assistiveTouchTop;

let menuwidth = 250;
let menuheight = 250;
menu.style.height = `${menuheight}px`;
menu.style.width = `${menuwidth}px`;

assistiveTouch.addEventListener('mousedown', (e) => {
  isDragging = true;
  wasDragged = false;
  offsetX = e.clientX - assistiveTouch.getBoundingClientRect().left;
  offsetY = e.clientY - assistiveTouch.getBoundingClientRect().top;
  PoX = e.clientX;
  PoY = e.clientY;
  assistiveTouch.classList.add('dragging');
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    wasDragged = true;
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Boundary checks for main menu
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

document.addEventListener('mouseup', (e) => {
  if (isDragging) {
    isDragging = false;
    assistiveTouch.classList.remove('dragging');
    // Prevent click event from firing after drag
    if (wasDragged) {
      assistiveTouch.style.pointerEvents = 'none';
      setTimeout(() => {
        assistiveTouch.style.pointerEvents = 'auto';
      }, 100);
    }
  }
  PoX_dex = e.clientX;
  PoY_dex = e.clientY;
});

assistiveTouch.addEventListener('touchstart', (e) => {
  isDragging = true;
  wasDragged = false;
  const touch = e.touches[0];
  offsetX = touch.clientX - assistiveTouch.getBoundingClientRect().left;
  offsetY = touch.clientY - assistiveTouch.getBoundingClientRect().top;
  assistiveTouch.classList.add('dragging');
});

document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    wasDragged = true;
    const touch = e.touches[0];
    let newLeft = touch.clientX - offsetX;
    let newTop = touch.clientY - offsetY;

    // Boundary checks for main menu
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

document.addEventListener('touchend', () => {
  if (isDragging) {
    isDragging = false;
    assistiveTouch.classList.remove('dragging');
    // Prevent click event from firing after drag
    if (wasDragged) {
      assistiveTouch.style.pointerEvents = 'none';
      setTimeout(() => {
        assistiveTouch.style.pointerEvents = 'auto';
      }, 100);
    }
  }
});

assistiveTouch.addEventListener('click', () => {
  if ((Math.abs(PoX_dex - PoX) == 0) || (Math.abs(PoX_dex - PoX) == 0)) {
    toggleMenu();
  }
});

menu.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - menu.getBoundingClientRect().left;
  offsetY = e.clientY - menu.getBoundingClientRect().top;
  menu.classList.add('dragging');
});

document.addEventListener('mousemove', (e) => {
  if (isDragging && menu.style.display === 'flex') {
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Boundary checks for sub-menu
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + menu.offsetWidth > window.innerWidth) {
      newLeft = window.innerWidth - menu.offsetWidth;
    }
    if (newTop + menu.offsetHeight > window.innerHeight) {
      newTop = window.innerHeight - menu.offsetHeight;
    }

    menu.style.left = `${newLeft}px`;
    menu.style.top = `${newTop}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  menu.classList.remove('dragging');
});

menu.addEventListener('touchstart', (e) => {
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - menu.getBoundingClientRect().left;
  offsetY = touch.clientY - menu.getBoundingClientRect().top;
  menu.classList.add('dragging');
});

document.addEventListener('touchmove', (e) => {
  if (isDragging && menu.style.display === 'flex') {
    const touch = e.touches[0];
    let newLeft = touch.clientX - offsetX;
    let newTop = touch.clientY - offsetY;

    // Boundary checks for sub-menu
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + menu.offsetWidth > window.innerWidth) {
      newLeft = window.innerWidth - menu.offsetWidth;
    }
    if (newTop + menu.offsetHeight > window.innerHeight) {
      newTop = window.innerHeight - menu.offsetHeight;
    }

    menu.style.left = `${newLeft}px`;
    menu.style.top = `${newTop}px`;
  }
});

document.addEventListener('touchend', () => {
  isDragging = false;
  menu.classList.remove('dragging');
});

function toggleMenu() {
  if (menu.style.display === 'none' || menu.style.display === '') {
    assistiveTouchLeft = assistiveTouch.style.left;
    assistiveTouchTop = assistiveTouch.style.top;
    let menuLeft = assistiveTouch.offsetLeft + (assistiveTouch.getBoundingClientRect().width / 2) - menuwidth / 2;
    let menuTop = assistiveTouch.offsetTop + (assistiveTouch.getBoundingClientRect().height / 2) - menuheight / 2;
    if (menuLeft < 0) menuLeft = 0;
    if (menuTop < 0) menuTop = 0;
    if (menuLeft + menuwidth > window.innerWidth) {
      menuLeft = window.innerWidth - menuwidth;
    }
    if (menuTop + menuheight > window.innerHeight) {
      menuTop = window.innerHeight - menuheight;
    }
    menu.style.display = 'flex';
    menu.style.left = `${menuLeft}px`;
    menu.style.top = `${menuTop}px`;
    assistiveTouch.style.display = 'none';
  } else {
    menu.style.display = 'none';
    assistiveTouch.style.display = 'flex';
    assistiveTouch.style.left = assistiveTouchLeft;
    assistiveTouch.style.top = assistiveTouchTop;
  }
}

function closeMenu() {
  menu.style.display = 'none';
  assistiveTouch.style.display = 'flex';
  assistiveTouch.style.left = assistiveTouchLeft;
  assistiveTouch.style.top = assistiveTouchTop;
}

// Initialize the menu display state
menu.style.display = 'none';
