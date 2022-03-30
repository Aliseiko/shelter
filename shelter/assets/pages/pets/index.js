const burgerButton = document.querySelector('.burger'),
    menuCover = document.querySelector('.cover'),
    nav = document.querySelector('.nav'),
    logo = document.querySelector('.logo'),
    popup = document.querySelector('.popup'),
    defaultMainSliderPetsNames = ['Katrine', 'Jennifer', 'Woody', 'Sophia', 'Timmy', 'Charly', 'Scarlett', 'Freddie'],
    petsNames = [],
    generatedPetsNames = [],
    firstButton = document.querySelector('.slider__button_page-first'),
    leftButton = document.querySelector('.slider__button_page-left'),
    rightButton = document.querySelector('.slider__button_page-right'),
    lastButton = document.querySelector('.slider__button_page-last');

let pets,
    currentSliderPageNumber = 1,
    maxPageNumber,
    screenSize;

// --------------- open / close menu ------------------
function openCloseMenu() {
  menuCover.classList.toggle('cover_active');
  burgerButton.classList.toggle('burger_active');
  nav.classList.toggle('nav_active');
  logo.classList.toggle('logo_mobile-menu-active');
}

function closeMenu() {
  menuCover.classList.remove('cover_active');
  menuCover.classList.remove('cover_active-popup');
  burgerButton.classList.remove('burger_active');
  nav.classList.remove('nav_active');
  logo.classList.remove('logo_mobile-menu-active');
}

burgerButton.addEventListener('click', openCloseMenu);
menuCover.addEventListener('click', closeMenu);
nav.addEventListener('click', event => {
  if (event.target.classList.contains('menu__link')) {
    closeMenu()
  }
})

// --------------- pets slider ------------------
async function getPets() {
  let response = await fetch('../../pets.json');
  return await response.json();
}

function generateRandomPetsNames() {
  let names = [...defaultMainSliderPetsNames],
      names1 = names.slice(0, Math.floor(names.length / 2)),
      names2 = names.slice(Math.floor(names.length / 2), names.length);

  for (let i = 1; i <= 5; i++) {
    names = names.concat([...names1].sort(() => Math.random() - 0.5), [...names2].sort(() => Math.random() - 0.5));
  }
  generatedPetsNames.push(...names);
  return names;
}

function createCard(petName) {
  let pet = pets.find(el => el.name === petName);

  let card = `<div class="slider-card" onClick='openPopup()'>
                <div class="slider-card__img-wrapper">
                  <img alt="${pet.name} photo" class="slider-card__img" src="${pet.img}">
                </div>
                <div class="slider-card__bottom">
                  <h4 class="slider-card__card-header">${pet.name}</h4>
                  <button class="button button_white card-button" type="button">Learn more</button>
                </div>
              </div>
`
  return card;
}

function createSlide(petsNamesArr) {
  let slide = document.querySelector('.slider__body'),
      slideHTML = '';
  petsNamesArr.forEach(el => slideHTML += createCard(el));
  slide.innerHTML = slideHTML;
  let cards = slide.children;
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.add(`slider-card-${i + 1}`);
  }
  return slide;
}

function showSliderPage(pageNumber) {
  let pageNumberForTranslate = pageNumber - 1;
  document.querySelector('.slider__body').style.transform = `translateX(calc(-${pageNumberForTranslate}00% - ${pageNumberForTranslate} * 40px))`;
  document.querySelector('.slider__button_page-number').textContent = pageNumber;
  if (pageNumber === 1) {
    firstButton.classList.add('button-inactive');
    leftButton.classList.add('button-inactive');
    rightButton.classList.remove('button-inactive');
    lastButton.classList.remove('button-inactive');
  } else if (pageNumber === maxPageNumber) {
    firstButton.classList.remove('button-inactive');
    leftButton.classList.remove('button-inactive');
    rightButton.classList.add('button-inactive');
    lastButton.classList.add('button-inactive');
  } else {
    firstButton.classList.remove('button-inactive');
    leftButton.classList.remove('button-inactive');
    rightButton.classList.remove('button-inactive');
    lastButton.classList.remove('button-inactive');
  }

  currentSliderPageNumber = pageNumber;
}

function setMaxPageNumberAndScreenSize() {
  let width = document.documentElement.scrollWidth;
  if (width >= 1280) {
    maxPageNumber = Math.ceil(generatedPetsNames.length / 8);
    screenSize = 'large';
  } else if (width < 1280 && width >= 768) {
    maxPageNumber = Math.ceil(generatedPetsNames.length / 6);
    screenSize = 'medium';
  } else {
    maxPageNumber = Math.ceil(generatedPetsNames.length / 3);
    screenSize = 'small';
  }
}

function sliderSlide(direction = 'right') {
  if (direction === 'right') {
    currentSliderPageNumber++;
    if (currentSliderPageNumber > maxPageNumber) currentSliderPageNumber = maxPageNumber;
  } else if (direction === 'left') {
    currentSliderPageNumber--;
    if (currentSliderPageNumber < 1) currentSliderPageNumber = 1;
  } else if (direction === 'first') {
    currentSliderPageNumber = 1;
  } else if (direction === 'last') {
    currentSliderPageNumber = maxPageNumber;
  }

  showSliderPage(currentSliderPageNumber);
}

function createPopup(pet) {
  let popup = `<div class="popup__body">
    <button class="popup__button popup__button_close popup__button_position" type="button"></button>
    <div class="popup__img-wrapper">
      <img class="popup__img" src="${pet.img}" alt="${pet.name} image">
    </div>
    <div class="popup__text-block">
      <h3 class="popup__header">${pet.name}</h3>
      <p class="popup__subheader h4">${pet.type} - ${pet.breed}</p>
      <p class="popup__text h5">${pet.description}</p>
      <ul class="popup__list">
        <li class="h5 popup__list-element"><span class="popup__list-text"><strong>Age:</strong> ${pet.age}</span></li>
        <li class="h5 popup__list-element"><span class="popup__list-text"><strong>Inoculations:</strong> ${pet.inoculations}</span>
        </li>
        <li class="h5 popup__list-element"><span class="popup__list-text"><strong>Diseases:</strong> ${pet.diseases}</span></li>
        <li class="h5 popup__list-element"><span class="popup__list-text"><strong>Parasites:</strong> ${pet.parasites}</span></li>
      </ul>
    </div>
  </div>`;

  return popup;
}

function openPopup() {
  let petName = event.target.closest('.slider-card').querySelector('.slider-card__card-header').textContent;
  let pet = pets.find(el => el.name === petName);
  popup.innerHTML = createPopup(pet);
  popup.classList.add('popup_active');
}

function closePopup() {
  if (event.target === popup ||
      event.target === document.querySelector('.popup__button')) {
    popup.classList.remove('popup_active');
    popup.innerHTML = '';
  }
}

// add default slider to main page
(async () => {
  pets = await getPets();
  pets.forEach(el => petsNames.push(el.name));
  generateRandomPetsNames();
  createSlide(generatedPetsNames);
  setMaxPageNumberAndScreenSize();
})();

leftButton.addEventListener('click', () => {
  sliderSlide('left');
})

rightButton.addEventListener('click', () => {
  sliderSlide('right');
})

firstButton.addEventListener('click', () => {
  sliderSlide('first');
})

lastButton.addEventListener('click', () => {
  sliderSlide('last');
})

window.addEventListener('resize', () => {
  let width = document.documentElement.scrollWidth;
  if ((width >= 1280 && screenSize !== 'large') ||
      (width < 1280 && width >= 768 && screenSize !== 'medium') ||
      (width < 768 && screenSize !== 'small')) {
    setMaxPageNumberAndScreenSize();
    showSliderPage(1);
  }
});
