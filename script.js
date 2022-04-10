'use strict';

/*-------- const and let ------------*/
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const btnScroollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

/*-------- modal window ------------*/
const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(item => {
  item.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/*-------- button scrolling ------------*/
btnScroollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/*-------- page navigation ------------*/
document.querySelector('.nav__links').addEventListener('click', e => {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();

    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/*-------- tabbed component (tabs) ------------*/
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  // when click not element
  if (!clicked) {
    return;
  }
  // first removed the class and then added
  tabs.forEach(item => item.classList.remove('operations__tab--active'));
  tabsContent.forEach(item =>
    item.classList.remove('operations__content--active')
  );

  clicked.classList.add('operations__tab--active');
  // show content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/*-------- menu fade animation ------------*/
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(item => {
      if (item !== link) {
        item.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/*-------- sticky  navigation ------------*/
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', () => {
  if (window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});

/*-------- reveal sections ------------*/
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    return;
  }
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/*-------- lazy loading images ------------*/
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    return;
  }

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/*-------- slider ------------*/
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');
const maxSlide = slides.length;
let curSlide = 0;

// function for move slide
const goToSlide = slide => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};

// function on create dots
const createDots = () => {
  slides.forEach((_, i) => {
    const html = `
  <button class="dots__dot" data-slide="${i}"></button>
  `;
    dotContainer.insertAdjacentHTML('beforeend', html);
  });
};

// show active dot
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

// starting position
goToSlide(0);
createDots();

// next slide
const nextSlide = () => {
  // stop when won't images
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

// previous slide
const prevSlide = () => {
  if (curSlide) {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// event on the button
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// keyboard
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }

  if (e.key === 'ArrowRight') {
    nextSlide();
  }
});

// dots
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});
