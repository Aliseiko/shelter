const burgerButton = document.querySelector('.burger'),
    menuCover = document.querySelector('.menu-cover'),
    nav = document.querySelector('.nav');

// --------------- open / close menu ------------------
function openCloseMenu() {
  menuCover.classList.toggle('menu-cover_active');
  burgerButton.classList.toggle('burger_active');
  nav.classList.toggle('nav_active');
}

function closeMenu() {
  menuCover.classList.remove('menu-cover_active');
  burgerButton.classList.remove('burger_active');
  nav.classList.remove('nav_active');
}

burgerButton.addEventListener('click', openCloseMenu);
menuCover.addEventListener('click', openCloseMenu);
nav.addEventListener('click', event => {
  if (event.target.classList.contains('menu__link')) {
    closeMenu()
  }
})

// --------------- main slider ------------------
async function getPets() {
  const response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits');
  return await response.json();
}

const pets = getPets();