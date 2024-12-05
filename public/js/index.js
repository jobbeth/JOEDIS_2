document.addEventListener("DOMContentLoaded", () => {
    // Check loginstatus fra localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn");
  
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
  
    // Eksisterende animationer
    setTimeout(() => {
      document.querySelector(".order-title").classList.add("show");
    }, 0);
  
    setTimeout(() => {
      document.querySelector(".order-description").classList.add("show");
    }, 500);
  
    setTimeout(() => {
      document.querySelector(".order-button").classList.add("show");
    }, 1000);
  });
  