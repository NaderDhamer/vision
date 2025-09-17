// Sticky Navbar
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Carousel + Mini carousel link
const carousel = document.getElementById("carousel");
const carouselImages = carousel.querySelectorAll("img");
const miniImages = document.querySelectorAll("#miniCarousel img");
let currentIndex = 0;

function showSlide(index) {
  // Hide all carousel images
  carouselImages.forEach((img, i) => {
    if (i === index) {
      img.classList.add("active");
    } else {
      img.classList.remove("active");
    }
  });
  // Highlight mini image
  miniImages.forEach(img => img.classList.remove("active"));
  miniImages[index].classList.add("active");
}

miniImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    showSlide(currentIndex);
  });
});

// Show the first slide on load
showSlide(0);
