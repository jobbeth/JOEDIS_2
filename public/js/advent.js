const doors = document.querySelectorAll(".door");
const adventDates = [
  new Date("2024-12-03"), // 1. Advent
  new Date("2024-12-10"), // 2. Advent
  new Date("2024-12-17"), // 3. Advent
  new Date("2024-12-24")  // 4. Advent
];
const today = new Date();

// Tilføj klik-hændelse til hver låge
doors.forEach((door, index) => {
  door.addEventListener("click", () => {
    const doorNumber = index + 1;
    if (today >= adventDates[index]) {
      if (!door.classList.contains("open")) {
        door.classList.add("open");
      } else {
        alert("Denne låge er allerede åbnet!");
      }
    } else {
      alert("Du kan kun åbne denne låge på " + adventDates[index].toLocaleDateString());
    }
  });
});