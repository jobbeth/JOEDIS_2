document.addEventListener("DOMContentLoaded", () => {
    const signupButton = document.querySelector(".signup-button");
    const verificationPopup = document.createElement("div");
    const hardcodedVerificationCode = "123456"; // Hardcoded kode
    let isVerificationCompleted = false;

    // Tilføj popup til verifikation
    verificationPopup.innerHTML = `
        <div id="verification-popup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 1px solid #ccc; padding: 20px; background-color: white; z-index: 1000;">
            <h3>Indtast din bekræftelseskode</h3>
            <input type="text" id="verification-code" placeholder="Bekræftelseskode" />
            <button id="verify-button">Verificer</button>
        </div>
    `;
    document.body.appendChild(verificationPopup);

    const verificationPopupElement = document.getElementById("verification-popup");
    const verifyButton = document.getElementById("verify-button");

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

        // Vis popup til verifikation
        verificationPopupElement.style.display = "block";

        verifyButton.addEventListener("click", () => {
            const enteredCode = document.getElementById("verification-code").value.trim();
            if (enteredCode === hardcodedVerificationCode) {
                isVerificationCompleted = true;
                alert("Bekræftelseskode korrekt!");
                verificationPopupElement.style.display = "none";

                // Send brugerdata til serveren
                const username = document.getElementById("username").value.trim();
                const email = document.getElementById("email").value.trim();
                const password = document.getElementById("password").value.trim();

                const newUser = {
                    Brugernavn: username,
                    Adgangskode: password, // Denne bliver hashet i backend
                    Email: email,
                };

                console.log("User object to be sent:", newUser);

                fetch("/api/brugere", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newUser),
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        if (response.ok) {
                            alert("New user created successfully!");
                            window.location.href = "/index.html";
                        } else {
                            console.error("Failed to create user:", responseData.error);
                            alert("Failed to create user. Error: " + responseData.error);
                        }
                    })
                    .catch((error) => {
                        console.error("An error occurred:", error);
                        alert("An error occurred while trying to create the user.");
                    });
            } else {
                alert("Bekræftelseskode er forkert!");
            }
        });
    });
});
