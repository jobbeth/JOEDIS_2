import { loadTest } from 'loadtest';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Midlertidig løsning for usikre HTTPS-certifikater

function runLoadTest() {
    const options = {
        url: 'https://localhost:1000',
        maxRequests: 10000,
        concurrency: 100, // Reduceret samtidighed
        insecure: true,   // Tillad usikre forbindelser
        method: 'GET',
    };

    console.log("Starting load test...");
    loadTest(options, (error, result) => {
        if (error) {
            console.error("Load test failed:", error);
            process.exit(1);
        }

        console.log("Load test completed!");
        console.log("Result:", result);
    });
}

runLoadTest();
