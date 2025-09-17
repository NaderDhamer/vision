/**
 * Main application JavaScript
 * All page scripts (sticky navbar, carousel <-> thumbnails linking, footer year)
 * have been consolidated here from inline <script> blocks in index.html.
 */

document.addEventListener('DOMContentLoaded', function() {
  // ---------- Sticky Navbar ----------
  // Adds/removes the 'scrolled' class on the #navbar element when the page is scrolled
  (function setStickyNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return; // guard
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  })();

  // ---------- Bootstrap Carousel <-> Custom Thumbnails Linking ----------
  // Handles the custom thumbnail navigation that controls the Bootstrap
  // carousel with id #mainCarousel and keeps thumbnails in sync.
  (function initThumbnailCarouselLinking() {
    const thumbs = document.querySelectorAll('.thumb-img');
    const carouselEl = document.getElementById('mainCarousel');
    if (!carouselEl || thumbs.length === 0) return; // nothing to do

    let thumbStart = 0;
    const thumbVisible = 3; // number of thumbnails visible at a time

    // Show/hide thumbnails based on the current thumbStart window
    function updateThumbs() {
      thumbs.forEach((img, i) => {
        img.style.display = (i >= thumbStart && i < thumbStart + thumbVisible) ? 'block' : 'none';
      });
    }

    updateThumbs();

    // Left arrow: move thumbnail window left and navigate carousel
    const leftArrow = document.querySelector('.thumb-arrow.left');
    if (leftArrow) {
      leftArrow.addEventListener('click', () => {
        thumbStart = Math.max(0, thumbStart - 1);
        updateThumbs();
        const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselEl);
        carouselInstance.to(thumbStart);
        const mainTitle = document.getElementById('carousel-main-title');
        if (mainTitle) mainTitle.textContent = 'wp' + (thumbStart + 1);
      });
    }

    // Right arrow: move thumbnail window right and navigate carousel
    const rightArrow = document.querySelector('.thumb-arrow.right');
    if (rightArrow) {
      rightArrow.addEventListener('click', () => {
        thumbStart = Math.min(thumbs.length - thumbVisible, thumbStart + 1);
        updateThumbs();
        const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselEl);
        carouselInstance.to(thumbStart);
        const mainTitle = document.getElementById('carousel-main-title');
        if (mainTitle) mainTitle.textContent = 'wp' + (thumbStart + 1);
      });
    }

    // Clicking a thumbnail navigates to the corresponding carousel slide
    thumbs.forEach((img, i) => {
      img.addEventListener('click', () => {
        const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselEl);
        carouselInstance.to(i);
        thumbs.forEach(t => t.classList.remove('active'));
        img.classList.add('active');
        const mainTitle = document.getElementById('carousel-main-title');
        if (mainTitle) mainTitle.textContent = 'wp' + (i + 1);
      });
    });

    // Keep thumbnails in sync when carousel slides (before the slide completes)
    carouselEl.addEventListener('slide.bs.carousel', function(e) {
      thumbs.forEach(t => t.classList.remove('active'));
      if (thumbs[e.to]) thumbs[e.to].classList.add('active');

      // Auto-scroll thumbnail window if needed
      if (e.to < thumbStart) {
        thumbStart = e.to;
        updateThumbs();
      } else if (e.to >= thumbStart + thumbVisible) {
        thumbStart = e.to - thumbVisible + 1;
        updateThumbs();
      }

      const mainTitle = document.getElementById('carousel-main-title');
      if (mainTitle) mainTitle.textContent = 'wp' + (e.to + 1);
    });
  })();

  // ---------- Legacy: linked carousel + mini-carousel (guarded) ----------
  // The project previously used a different carousel markup with ids
  // '#carousel' and '#miniCarousel'. Keep that logic here but only run
  // it if those elements exist to avoid runtime errors.
  (function legacyLinkedMiniCarousel() {
    const legacyCarousel = document.getElementById('carousel');
    const miniImages = document.querySelectorAll('#miniCarousel img');
    if (!legacyCarousel || miniImages.length === 0) return;

    const carouselImages = legacyCarousel.querySelectorAll('img');
    let currentIndex = 0;

    function showSlide(index) {
      // Hide all carousel images and show selected one
      carouselImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
      // Highlight mini image
      miniImages.forEach(img => img.classList.remove('active'));
      if (miniImages[index]) miniImages[index].classList.add('active');
    }

    miniImages.forEach((img, index) => {
      img.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
      });
    });

    // Show the first slide if present
    if (carouselImages.length) showSlide(0);
  })();

  // ---------- Footer Year ----------
  // Sets the current year in the footer element with id #footer-year
  (function setFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (!yearEl) return;
    yearEl.textContent = new Date().getFullYear();
  })();

});
