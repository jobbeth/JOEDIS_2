document.addEventListener("DOMContentLoaded", () => {
  // Vis "START YOUR ORDER" efter 0 sekunder
  setTimeout(() => {
      document.querySelector(".order-title").classList.add("show");
  }, 0);

  // Vis beskrivelsesteksten efter 0.5 sekunder
  setTimeout(() => {
      document.querySelector(".order-description").classList.add("show");
  }, 500);

  // Vis "ORDER NOW" knappen efter 1 sekund
  setTimeout(() => {
      document.querySelector(".order-button").classList.add("show");
  }, 1000);
});



