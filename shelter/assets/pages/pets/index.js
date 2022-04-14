const burgerButton = document.querySelector('.burger'),
    menuCover = document.querySelector('.nav__cover'),
    nav = document.querySelector('.nav'),
    logo = document.querySelector('.logo'),
    popup = document.querySelector('.popup'),
    firstButton = document.querySelector('.slider__button_page-first'),
    leftButton = document.querySelector('.slider__button_page-left'),
    rightButton = document.querySelector('.slider__button_page-right'),
    lastButton = document.querySelector('.slider__button_page-last'),
    pageNumberButton = document.querySelector('.slider__button_page-number'),
    namesForSlides = [],
    slider = document.querySelector('.slider__body');

let pets,
    generatedPetsNames,
    currentSliderPageNumber = 1,
    maxPageNumber,
    screenSize;

// --------------- open / close menu ------------------
function openCloseMenu(action = 'toggle') {
  menuCover.classList[action]('nav__cover_active');
  burgerButton.classList[action]('burger_active');
  nav.classList[action]('nav_active');
  logo.classList[action]('logo_mobile-menu-active');
}

burgerButton.addEventListener('click', () => openCloseMenu());
menuCover.addEventListener('click', () => openCloseMenu('remove'));
nav.addEventListener('click', event => {
  if (event.target.classList.contains('menu__link')) {
    openCloseMenu('remove');
  }
})

// --------------- pets slider ------------------

function generateRandomPetsNames() {
  let names = ['Katrine', 'Jennifer', 'Woody', 'Sophia', 'Timmy', 'Charly', 'Scarlett', 'Freddie'],
      names1 = names.slice(0, Math.floor(names.length / 2)),
      names2 = names.slice(Math.floor(names.length / 2), names.length);

  for (let i = 1; i <= 5; i++) {
    names = names.concat([...names1].sort(() => Math.random() - 0.5), [...names2].sort(() => Math.random() - 0.5));
  }
  generatedPetsNames = names;
}

function createNamesForSlides() {
  const slidesCount = (screenSize === 'large') ? 8 : (screenSize === 'medium') ? 6 : 3,
      namesArr = [];

  namesForSlides.length = 0;

  generatedPetsNames.forEach((el, index, arr) => {
    namesArr.push(el);
    if (index === arr.length - 1 || (index + 1) % slidesCount === 0) {
      namesForSlides.push([...namesArr]);
      namesArr.length = 0;
    }
  })
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

function createSlide(pageNumber) {
  let slide = document.createElement('div');
  slide.classList.add('slider__slide');
  let slideHTML = '';
  namesForSlides[pageNumber - 1].forEach(el => slideHTML += createCard(el));
  slide.innerHTML = slideHTML;
  return slide;
}

function createSlider() {
  slider.innerHTML = '';
  slider.append(createSlide(1));
  currentSliderPageNumber = 1;
  pageNumberButton.textContent = 1;
  markButtons(1);
}

function showSliderPage(pageNumber, direction) {
  const nextSlide = createSlide(pageNumber),
      left = {
        side: 'left',
        action: 'prepend',
        child: 1
      },
      right = {
        side: 'right',
        action: 'append',
        child: 0
      };

  if (pageNumber !== currentSliderPageNumber) {
    const rule = (direction === 'left' || direction === 'first') ? left : right;

    function removeSlide() {
      slider.children[rule.child].remove();
      slider.classList.remove(`slider__body_${rule.side}`);
      slider.removeEventListener('transitionend', removeSlide);
    }

    slider.classList.add(`slider__body_${rule.side}`);
    slider[rule.action](nextSlide);
    slider.addEventListener('transitionend', removeSlide);
  }

  pageNumberButton.textContent = pageNumber;
  markButtons(pageNumber);
  currentSliderPageNumber = pageNumber;
}

function markButtons(pageNumber) {
  function mark(firstButtonAction, leftButtonAction, rightButtonAction, lastButtonAction) {
    [firstButton, leftButton, rightButton, lastButton].forEach((el, i) => {
      el.classList[arguments[i] || 'remove']('button-inactive');
    })
  }

  if (pageNumber === 1) {
    mark('add', 'add');
  } else if (pageNumber === maxPageNumber) {
    mark('remove', 'remove', 'add', 'add');
  } else {
    mark();
  }
}

function setMaxPageNumberAndScreenSize() {
  let width = window.innerWidth;
  if (width >= 1280) {
    screenSize = 'large';
  } else if (width < 1280 && width >= 768) {
    screenSize = 'medium';
  } else {
    screenSize = 'small';
  }

  maxPageNumber = Math.ceil(generatedPetsNames.length / ((screenSize === 'large') ? 8 : (screenSize === 'medium') ? 6 : 3));
}

function sliderSlide(direction = 'right') {
  let page = currentSliderPageNumber;
  if (direction === 'right') {
    page++;
    if (page > maxPageNumber) page = maxPageNumber;
  } else if (direction === 'left') {
    page--;
    if (page < 1) page = 1;
  } else if (direction === 'first') {
    page = 1;
  } else if (direction === 'last') {
    page = maxPageNumber;
  }

  showSliderPage(page, direction);
}

// --------------- Popup ------------------

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
  popup.addEventListener('mouseover', activatePopupCloseButton);
}

function closePopup() {
  if (event.target === popup ||
      event.target === document.querySelector('.popup__button')) {
    popup.removeEventListener('mouseover', activatePopupCloseButton);
    popup.classList.remove('popup_active');
    popup.innerHTML = '';
  }
}

function activatePopupCloseButton() {
  const popupCloseButton = document.querySelector('.popup__button_close');
  if (event.target === popup ||
      event.target === popupCloseButton) {
    popupCloseButton.style.background = '#F1CDB3';
  } else {
    popupCloseButton.style.background = 'transparent';
  }
}

// --------------- Popup End------------------

function initFunctions() {
  setMaxPageNumberAndScreenSize();
  createNamesForSlides();
  createSlider();
}

// add default slider to main page

fetch('../../pets.json')
    .then(response => response.json())
    .then(res => {
      pets = res;
      generateRandomPetsNames();
      initFunctions();
    })
    .catch(error => {
      slider.textContent = 'Can\'t load slider';
    })

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
  let width = window.innerWidth;
  if ((width >= 1280 && screenSize !== 'large') ||
      (width < 1280 && width >= 768 && screenSize !== 'medium') ||
      (width < 768 && screenSize !== 'small')) {
    initFunctions();
  }
});