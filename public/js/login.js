document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(".login-button");

    if (!loginButton) {
        console.error("Login button not found!");
        return;
    }

    loginButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Both fields are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:1000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Brugernavn: username, Adgangskode: password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Gem loginstatus i localStorage
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username", username);

                // Log localStorage-indhold til konsollen
                console.log("LocalStorage after login:", localStorage);

                alert("Login successful!");
                window.location.href = "/index.html"; // Send brugeren til forsiden
            } else {
                alert("Login failed: " + data.error);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
