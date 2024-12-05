import express from 'express';
import Database2 from './Backend/Database.js'; // Korrekt sti til database_2.js
import { config } from './config.js';   // Korrekt sti til config.js

const db = new Database2(config); // Instans af databasen
const router = express.Router();

// Endpoint til at oprette en ny bruger
router.post('/api/brugere', async (req, res) => {
    try {
        const { Brugernavn, Adgangskode, Email } = req.body;

        // Valider at alle nødvendige felter er udfyldt
        if (!Brugernavn || !Adgangskode || !Email) {
            return res.status(400).json({ error: 'Missing required fields: Brugernavn, Adgangskode, or Email.' });
        }

        // Opret brugerobjekt med de nødvendige data
        const newUser = {
            Brugernavn,
            Adgangskode, // Gem adgangskoden som den er
            Email
        };

        console.log("Creating user with data:", newUser);

        // Brug funktionen i databasen til at oprette brugeren
        const result = await db.createUser(newUser);

        // Hvis brugeren blev oprettet korrekt, returner en succesmeddelelse
        if (result.success) {
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(500).json({ error: result.message || 'Failed to create user.' });
        }
    } catch (error) {
        console.error("Error in POST /api/brugere:", error.message);
        res.status(500).json({ error: 'Could not create user.' });
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
        if (user.Adgangskode !== Adgangskode) { // Tilføj hashing her, hvis adgangskoder er hashede
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
