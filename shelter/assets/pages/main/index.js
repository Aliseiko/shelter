const burgerButton = document.querySelector('.burger'),
    menuCover = document.querySelector('.cover'),
    nav = document.querySelector('.nav'),
    defaultMainSliderPetsNames = ['Katrine', 'Jennifer', 'Woody'],
    petsNames = [];
let pets,
    currentSliderPetsNames = defaultMainSliderPetsNames;

// --------------- open / close menu ------------------
function openCloseMenu() {
  menuCover.classList.toggle('cover_active');
  burgerButton.classList.toggle('burger_active');
  nav.classList.toggle('nav_active');
}

function closeMenu() {
  menuCover.classList.remove('cover_active');
  menuCover.classList.remove('cover_active-popup');
  burgerButton.classList.remove('burger_active');
  nav.classList.remove('nav_active');
}

burgerButton.addEventListener('click', openCloseMenu);
menuCover.addEventListener('click', closeMenu);
nav.addEventListener('click', event => {
  if (event.target.classList.contains('menu__link')) {
    closeMenu()
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

function openPopup() {
  menuCover.classList.add('cover_active-popup');

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