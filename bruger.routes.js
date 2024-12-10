import express from "express";
import Database2 from "./Backend/Database.js"; // Korrekt sti til database_2.js
import { config } from "./config.js"; // Korrekt sti til config.js
import { mailToUser } from "./sendmail.js"; // Importér mail-funktionen
import bcrypt from "bcrypt"; // Tilføj bcrypt til at håndtere adgangskodekryptering

const db = new Database2(config); // Instans af databasen
const router = express.Router();

// Endpoint til at oprette en ny bruger
router.post("/api/brugere", async (req, res) => {
  try {
    const { Brugernavn, Adgangskode, Email } = req.body;

    // Valider, at alle nødvendige felter er udfyldt
    if (!Brugernavn || !Adgangskode || !Email) {
      return res.status(400).json({ error: "Missing required fields: Brugernavn, Adgangskode, or Email." });
    }

    // Krypter adgangskoden
    const saltRounds = 10; // Antal salt-runder (kan justeres)
    const hashedPassword = await bcrypt.hash(Adgangskode, saltRounds);

    // Opret brugerobjekt med krypteret adgangskode
    const newUser = {
      Brugernavn,
      Adgangskode: hashedPassword,
      Email,
    };

    console.log("Creating user with data:", newUser);

    // Brug funktionen i databasen til at oprette brugeren
    const result = await db.createUser(newUser);

    // Hvis brugeren blev oprettet korrekt, send en e-mail
    if (result.success) {
      const subject = "Welcome to JOE!";
      const textMessage = `Hi ${Brugernavn},\n\nThank you for signing up to JOE. We're excited to have you on board!\n\nBest regards,\nThe JOE Team`;
      const htmlMessage = `<p>Hi ${Brugernavn},</p><p>Thank you for signing up to <strong>JOE</strong>. We're excited to have you on board!</p><p>Best regards,<br>The JOE Team</p>`;

      // Send e-mail
      const emailResult = await mailToUser(Email, subject, textMessage, htmlMessage);
      if (!emailResult.success) {
        console.error("Failed to send confirmation email:", emailResult.error);
      }

      res.status(201).json({ message: "User created successfully and confirmation email sent!" });
    } else {
      res.status(500).json({ error: result.message || "Failed to create user." });
    }
  } catch (error) {
    console.error("Error in POST /api/brugere:", error.message);
    res.status(500).json({ error: "Could not create user." });
  }
});

// Ny endpoint til at hente alle brugere
router.get('/api/brugere', async (req, res) => {
    try {
        console.log("Fetching all users");

        // Hent alle brugere fra databasen
        const users = await db.getAllUsers();

        // Hvis data blev hentet korrekt, returner det
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in GET /api/brugere:", error.message);
        res.status(500).json({ error: 'Could not fetch users.' });
    }
});

// Endpoint til at hente en bruger baseret på brugernavn
router.get('/api/brugere/:brugernavn', async (req, res) => {
    try {
        const { brugernavn } = req.params;

        console.log(`Fetching user with username: ${brugernavn}`);

        // Hent bruger fra databasen baseret på brugernavn
        const user = await db.getUserByUsername(brugernavn);

        // Tjek om brugeren eksisterer
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error("Error in GET /api/brugere/:brugernavn:", error.message);
        res.status(500).json({ error: 'Could not fetch user.' });
    }
});router.post('/api/advent/sendRabatkode', async (req, res) => {
    const { username, rabatkode } = req.body;

    try {
        // Log det modtagne objekt
        console.log("Request body received:", req.body);

        // Hent brugerens data fra databasen
        const user = await db.getUserByUsername(username);

        // Log hele objektet returneret af getUserByUsername
        console.log("User object returned by getUserByUsername:", user);

        if (!user) {
            console.log("User not found:", username);
            return res.status(404).json({ error: 'User not found.' });
        }

        // Log brugerens e-mail (sørg for at 'email' faktisk findes i user-objektet)
        if (user.email) {
            console.log("User email found:", user.Email);
        } else {
            console.warn("Email is undefined for user:", user);
        }

        // Send e-mail med rabatkoden
        const emailResult = await mailToUser(
            user.Email,
            `Din Adventskalender Rabatkode`,
            `Her er din rabatkode: ${rabatkode}`,
            `<p>Tak fordi du deltager i vores adventskalender! Her er din rabatkode: <b>${rabatkode}</b></p>`
        );

        if (emailResult.success) {
            console.log("Email sent successfully to:", user.Email);
            res.status(200).json({ message: 'Rabatkode sendt!' });
        } else {
            console.error("Error sending email to:", user.email, emailResult.error);
            res.status(500).json({ error: 'Kunne ikke sende e-mail.' });
        }
    } catch (error) {
        console.error("Error in /api/advent/sendRabatkode:", error.message);
        res.status(500).json({ error: 'Noget gik galt.' });
    }
});


// Endpoint til login
router.post('/api/login', async (req, res) => {
    try {
        const { Brugernavn, Adgangskode } = req.body;

        if (!Brugernavn || !Adgangskode) {
            return res.status(400).json({ error: 'Missing required fields: Brugernavn or Adgangskode.' });
        }

        console.log("Attempting login for user:", Brugernavn);

        // Hent bruger fra databasen baseret på Brugernavn
        const user = await db.getUserByUsername(Brugernavn);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Sammenlign adgangskoder
        const passwordMatch = await bcrypt.compare(Adgangskode, user.Adgangskode);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Login er succesfuldt
        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.error("Error in POST /api/login:", error.message);
        res.status(500).json({ error: 'Could not process login.' });
    }
});

export default router;
