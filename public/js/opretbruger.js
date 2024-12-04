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

      // Opret objektet
      const newUser = {
          Brugernavn: username,
          Adgangskode: password,  // Denne bliver hashet i backend
          Email: email
      };

      // Log objektet til konsollen før det sendes
      console.log("User object to be sent:", newUser);

      try {
          // Send data til backend via fetch API
          const response = await fetch("http://localhost:3001/api/brugere", {  // API endpoint for oprettelse af bruger
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(newUser),  // Sender objektet som JSON
          });

          const responseData = await response.json();  // Parsing af serverens JSON-svar
          if (response.ok) {
              alert("New user created successfully!");
              window.location.href = "/index.html";  // Redirect til startsiden eller login
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
