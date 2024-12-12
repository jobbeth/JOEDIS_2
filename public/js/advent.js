document.addEventListener("DOMContentLoaded", () => {
  const doors = document.querySelectorAll(".door");
  const adventDates = [
    new Date("2024-12-03"), // 1. Advent
    new Date("2024-12-08"), // 2. Advent
    new Date("2024-12-17"), // 3. Advent
    new Date("2024-12-24"), // 4. Advent
  ];
  const rabatkoder = [
    "juice25", // Rabatkode for 1. Advent
    "sandwich25", // Rabatkode for 2. Advent
    "advent50K", // Rabatkode for 3. Advent
    "jul81", // Rabatkode for 4. Advent
  ];

  const today = new Date();

  // Tjek loginstatus fra localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Tilføj logik til login/log ud-knappen
  const userIconDiv = document.querySelector(".user-icon");

  if (isLoggedIn === "true") {
    // Hvis brugeren er logget ind, vis "Log ud"
    userIconDiv.innerHTML = `
      <span>&#128100;</span>
      <button class="logout-button">LOG OUT</button>
    `;

    // Tilføj eventlistener til log ud-knappen
    const logoutButton = document.querySelector(".logout-button");
    logoutButton.addEventListener("click", () => {
      // Fjern loginstatus fra localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");

      alert("You have been logged out.");
      window.location.href = "/login.html"; // Omdiriger til login-siden
    });
  } else {
    // Hvis brugeren ikke er logget ind, vis "Login"
    userIconDiv.innerHTML = `
      <span>&#128100;</span>
      <a href="login.html">LOGIN</a>
    `;
  }

  // Tilføj klik-hændelse til hver låge
  doors.forEach((door, index) => {
    door.addEventListener("click", async () => {
      if (isLoggedIn !== "true") {
        alert("You must be logged in to access the advent calendar. Please log in.");
        window.location.href = "/login.html"; // Omdiriger til login-siden
        return;
      }

      const doorNumber = index + 1;
      if (today >= adventDates[index]) {
        if (!door.classList.contains("open")) {
          door.classList.add("open");

          // Hent rabatkoden for denne låge
          const rabatkode = rabatkoder[index];

          // Hent brugernavn fra localStorage
          const username = localStorage.getItem("username");

          // Send rabatkode via backend
          try {
            const response = await fetch(`/api/advent/sendRabatkode`, {
              method: "POST", 
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, rabatkode }),
            });

            const result = await response.json();
            if (response.ok) {
              alert(`Rabatkode er sendt til din e-mail!`);
            } else {
              alert(`Kunne ikke sende rabatkoden: ${result.error}`);
            }
          } catch (error) {
            console.error("Error sending rabatkode:", error);
            alert("Noget gik galt. Prøv igen senere.");
          }
        } else {
          alert("Denne låge er allerede åbnet!");
        }
      } else {
        alert("Du kan kun åbne denne låge på " + adventDates[index].toLocaleDateString());
      }
    });
  });
});
