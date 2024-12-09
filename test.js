import Database2 from './Backend/Database.js';
import { config } from './config.js';

const db = new Database2(config);

(async () => {
    // Test at hente en bruger
    const user = await db.getUserByUsername("test1");
    if (user) {
        console.log("User found:", user);
    } else {
        console.log("No user found with the username 'test1'.");
    }
})();

// test kommentar
    // test igen

//hep