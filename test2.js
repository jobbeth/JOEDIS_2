import { mailToUser } from './sendmail.js';

async function testMail() {
    const result = await mailToUser(
        'joact@live.dk',
        'Test Email',
        'This is a test email.',
        '<p>This is a test email.</p>'
    );
    console.log("Email test result:", result);
}

testMail();
