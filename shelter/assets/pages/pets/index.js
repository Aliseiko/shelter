const burgerButton = document.querySelector('.burger'),
    menuCover = document.querySelector('.nav__cover'),
    nav = document.querySelector('.nav'),
    logo = document.querySelector('.logo'),
    popup = document.querySelector('.popup'),
    firstButton = document.querySelector('.slider__button_page-first'),
    leftButton = document.querySelector('.slider__button_page-left'),
    rightButton = document.querySelector('.slider__button_page-right'),
    lastButton = document.querySelector('.slider__button_page-last');

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

function createSlider(petsNamesArr) {
  let slidesCount = (screenSize === 'large') ? 8 : (screenSize === 'medium') ? 6 : 3,
      slider = document.querySelector('.slider__wrapper'),
      slideHTML = '',
      slidesArr = [];

  slider.innerHTML = '';

  for (let i = 0; i < petsNamesArr.length; i++) {
    slideHTML += createCard(petsNamesArr[i]);
    if (petsNamesArr[i + 1] === undefined || (i + 1) % slidesCount === 0) {
      slidesArr.push(slideHTML);
      slideHTML = '';
    }
  }

  slidesArr.forEach(el => {
    let slide = document.createElement('div');
    slide.classList.add('slider__slide');
    slide.innerHTML = el;
    slider.append(slide);
  })

  slider.firstElementChild.classList.add('slider__slide_1');
}

function showSliderPage(pageNumber) {
  let pageNumberForShift = pageNumber - 1;
  document.querySelector('.slider__slide_1').style.marginLeft = `-${pageNumberForShift}00%`;
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
  //let width = document.documentElement.scrollWidth;
  let width = window.innerWidth;
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

// add default slider to main page

fetch('../../pets.json')
    .then(response => response.json())
    .then(res => {
      pets = res;
      //petsNames = pets.map(el => el.name);
      generateRandomPetsNames();
      setMaxPageNumberAndScreenSize();
      createSlider(generatedPetsNames);
    })
    .catch(error => {
      document.querySelector('.slider__wrapper').textContent = 'Can\'t load slider';
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
  //let width = document.documentElement.scrollWidth;
  let width = window.innerWidth;
  if ((width >= 1280 && screenSize !== 'large') ||
      (width < 1280 && width >= 768 && screenSize !== 'medium') ||
      (width < 768 && screenSize !== 'small')) {
    setMaxPageNumberAndScreenSize();
    createSlider(generatedPetsNames);
    showSliderPage(1);
  }
});