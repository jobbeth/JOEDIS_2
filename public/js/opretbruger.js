document.addEventListener("DOMContentLoaded", () => {
    const signupButton = document.querySelector(".signup-button");

    if (!signupButton) {
        console.error("Signup button not found!");
        return;
    }

    function areFieldsValid() {
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !email || !password) {
            alert("All fields must be filled out.");
            return false;
        }
        return true;
    }

    signupButton.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!areFieldsValid()) {
            return;
        }

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const newUser = {
            Brugernavn: username,
            Adgangskode: password, // Denne bliver hashet i backend
            Email: email
        };

        console.log("User object to be sent:", newUser);

        try {
            const response = await fetch("http://localhost:1000/api/brugere", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            const responseData = await response.json();

            if (response.ok) {
                alert("New user created successfully!");
                window.location.href = "/index.html";
            } else {
                console.error("Failed to create user:", responseData.error);
                alert("Failed to create user. Error: " + responseData.error);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            alert("An error occurred while trying to create the user.");
        }
    });
});
