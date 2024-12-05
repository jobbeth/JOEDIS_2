document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Fjern loginstatus fra localStorage
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");

            alert("You have been logged out.");
            window.location.href = "/login.html"; // Omdiriger til login-siden
        });
    }
});
