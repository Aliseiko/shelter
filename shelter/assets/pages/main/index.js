const burgerButton = document.querySelector('.burger'),
    menuCover = document.querySelector('.nav__cover'),
    nav = document.querySelector('.nav'),
    popup = document.querySelector('.popup'),
    logo = document.querySelector('.logo'),
    defaultMainSliderPetsNames = ['Katrine', 'Jennifer', 'Woody'],
    petsNames = [];
let pets,
    currentSliderPetsNames = defaultMainSliderPetsNames;

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

// --------------- main slider ------------------
async function getPets() {
  let response = await fetch('../../pets.json');
  return await response.json();
}

function createCard(petName) {
  let pet = pets.find(el => el.name === petName);

  let card = `<li class="slider-card" onClick='openPopup()'>
                <div class="slider-card__img-wrapper">
                  <img alt="${pet.name} photo" class="slider-card__img" src="${pet.img}">
                </div>
                <div class="slider-card__bottom">
                  <h4 class="slider-card__card-header">${pet.name}</h4>
                  <button class="button button_white card-button" type="button">Learn more</button>
                </div>
              </li>
`

  return card;
}

function createSlide(petsNamesArr) {
  let slide = document.createElement('ul'),
      slideHTML = '';
  slide.className = 'slider__slide';
  petsNamesArr.forEach(el => slideHTML += createCard(el));
  slide.innerHTML = slideHTML;
  let cards = slide.children;
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.add(`slider-card-${i + 1}`);
  }
  return slide;
}

function createNextSlidePetsNames() {
  const namesArr = [];

  while (namesArr.length < 3) {
    let name = petsNames[Math.floor(Math.random() * petsNames.length)];
    if (!currentSliderPetsNames.includes(name) && !namesArr.includes(name)) namesArr.push(name);
  }
  return namesArr
}

function sliderSlide(direction) {
  let nextSlidePetsNames = createNextSlidePetsNames(),
      slider = document.querySelector('.slider__body'),
      slide = createSlide(nextSlidePetsNames);
  if (direction === 'left') {
    slider.classList.add('slider__body_left');
    slider.prepend(slide);
    setTimeout(() => {
      slider.children[1].remove();
      slider.classList.remove('slider__body_left');
    }, 600);
  } else if (direction === 'right') {
    slider.classList.add('slider__body_right');
    slider.append(slide);
    setTimeout(() => {
      slider.children[0].remove();
      slider.classList.remove('slider__body_right');
    }, 600);
  }
  currentSliderPetsNames = nextSlidePetsNames;
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
(async () => {
  pets = await getPets();
  pets.forEach(el => petsNames.push(el.name));
  document.querySelector('.slider__body').append(createSlide(defaultMainSliderPetsNames));
})();

document.querySelector('.slider__button_left').addEventListener('click', () => {
  sliderSlide('left');
})

document.querySelector('.slider__button_right').addEventListener('click', () => {
  sliderSlide('right');
})