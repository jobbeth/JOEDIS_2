document.addEventListener("DOMContentLoaded", () => {
    const signupButton = document.querySelector(".signup-button");
    const verificationPopup = document.createElement("div");
    const hardcodedVerificationCode = "123456"; // Hardcoded kode

    // Opret popup til bekræftelseskode
    verificationPopup.innerHTML = `
        <div id="verification-popup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 1px solid #ccc; padding: 20px; background-color: white; z-index: 1000;">
            <h3>Indtast din bekræftelseskode</h3>
            <input type="text" id="verification-code" placeholder="Bekræftelseskode" />
            <button id="verify-button">Verificer</button>
            <button id="resend-code">Send kode igen</button>
        </div>
    `;
    document.body.appendChild(verificationPopup);

    const verificationPopupElement = document.getElementById("verification-popup");
    const verifyButton = document.getElementById("verify-button");
    const resendButton = document.getElementById("resend-code");

    if (!signupButton) {
        console.error("Signup button not found!");
        return;
    }

    function areFieldsValid() {
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !email || !password) {
            alert("Alle felter skal udfyldes.");
            return false;
        }
        return true;
    }

    async function sendVerificationCode(email) {
        try {
            const response = await fetch("/api/send-verification-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const responseData = await response.json();

            if (response.ok) {
                alert("Bekræftelseskode sendt til din e-mail!");
                verificationPopupElement.style.display = "block";
            } else {
                alert("Kunne ikke sende bekræftelseskoden. Fejl: " + responseData.error);
            }
        } catch (error) {
            console.error("Fejl ved afsendelse af bekræftelseskode:", error);
            alert("Noget gik galt. Prøv igen.");
        }
    }

    signupButton.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!areFieldsValid()) {
            return;
        }

        const email = document.getElementById("email").value.trim();

        // Send bekræftelseskode til e-mail
        await sendVerificationCode(email);
    });

    verifyButton.addEventListener("click", async () => {
        const enteredCode = document.getElementById("verification-code").value.trim();
        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (enteredCode === hardcodedVerificationCode) {
            alert("Bekræftelseskode korrekt!");
            verificationPopupElement.style.display = "none";

            // Send brugerdata til serveren for at oprette brugeren
            const newUser = { Brugernavn: username, Adgangskode: password, Email: email };
            try {
                const response = await fetch("/api/brugere", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newUser),
                });

                const responseData = await response.json();

                if (response.ok) {
                    alert("Bruger oprettet!");
                    window.location.href = "/index.html";
                } else {
                    alert("Kunne ikke oprette bruger. Fejl: " + responseData.error);
                }
            } catch (error) {
                console.error("Fejl ved oprettelse af bruger:", error);
                alert("Noget gik galt. Prøv igen.");
            }
        } else {
            alert("Forkert bekræftelseskode. Prøv igen.");
        }
    });

    resendButton.addEventListener("click", async () => {
        const email = document.getElementById("email").value.trim();
        await sendVerificationCode(email);
    });
});
