import sql from 'mssql';

export default class Database2 {
    config = {};
    poolconnection = null;
    connected = false;

    constructor(config) {
        this.config = config;
        console.log(`Database: ${JSON.stringify(config)}`);
    }

    // Metode til at etablere forbindelse til databasen
    async connect() {
        if (!this.connected) {
            try {
                this.poolconnection = await sql.connect(this.config);
                this.connected = true;
                console.log('Database connection successful');
            } catch (error) {
                console.error('Database connection failed:', error.message);
            }
        }
    }

    // Metode til at lukke forbindelsen til databasen
    async disconnect() {
        if (this.poolconnection) {
            await this.poolconnection.close();
            this.connected = false;
            console.log('Database connection closed');
        }
    }

    // Metode til at oprette en ny bruger i databasen
    async createUser(data) {
        try {
            // Forbind til databasen
            await this.connect();
            const request = this.poolconnection.request();

            // Tilføj brugerinput som parametre til SQL-forespørgslen
            request.input('Brugernavn', sql.NVarChar(50), data.Brugernavn);
            request.input('Adgangskode', sql.NVarChar(255), data.Adgangskode);
            request.input('Email', sql.NVarChar(100), data.Email);

            // SQL-forespørgsel for at indsætte brugeren i databasen
            const insertQuery = `
                INSERT INTO Brugere (Brugernavn, Adgangskode, Email)
                VALUES (@Brugernavn, @Adgangskode, @Email)
            `;

            // Kør SQL-forespørgslen
            const result = await request.query(insertQuery);

            // Hvis brugeren blev oprettet, returner succes
            if (result.rowsAffected > 0) { // Vi tjekker rowsAffected i stedet for recordset
                return { success: true, message: 'User created successfully' };
            } else {
                return { success: false, message: 'Failed to create user.' };
            }
        } catch (error) {
            // Håndter fejl i SQL-forespørgslen
            console.error("Error in SQL Query:", error.message);
            return { success: false, message: 'Database operation failed', error };
        }
    }

    // Ny metode til at hente alt data fra databasen
    async getAllUsers() {
        try {
            // Forbind til databasen
            await this.connect();
            const request = this.poolconnection.request();

            // SQL-forespørgsel for at hente alle brugere
            const selectQuery = `
                SELECT * FROM Brugere
            `;

            // Kør SQL-forespørgslen
            const result = await request.query(selectQuery);

            // Returner dataen fra forespørgslen
            return result.recordset;
        } catch (error) {
            // Håndter fejl i SQL-forespørgslen
            console.error("Error fetching users:", error.message);
            return { success: false, message: 'Failed to fetch users.', error };
        }
    }
    async getUserByUsername(username) {
        try {
            // Forbind til databasen
            await this.connect();
            const request = this.poolconnection.request();

            // Tilføj brugernavn som parameter til SQL-forespørgslen
            request.input('Brugernavn', sql.NVarChar(50), username);

            // SQL-forespørgsel for at finde en bruger baseret på Brugernavn
            const selectQuery = `
                SELECT * FROM Brugere WHERE Brugernavn = @Brugernavn
            `;

            // Kør SQL-forespørgslen
            const result = await request.query(selectQuery);

            // Returner den første bruger, hvis den findes
            if (result.recordset.length > 0) {
                return result.recordset[0];
            } else {
                return null; // Returner null, hvis brugeren ikke findes
            }
        } catch (error) {
            // Håndter fejl i SQL-forespørgslen
            console.error("Error fetching user by username:", error.message);
            return { success: false, message: 'Failed to fetch user.', error };
        }
    }

}
