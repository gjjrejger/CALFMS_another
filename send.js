const nodemailer = require("nodemailer");
require("dotenv").config();

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },

    logger: false
});

// Test SMTP connection
async function testEmailConnection() {
    try {
        await transporter.verify();

        console.log("✅ Gmail SMTP connection successful!");
    } catch (error) {
        console.error("❌ Gmail SMTP connection failed:");
        console.error(error);
    }
}

testEmailConnection();

module.exports = transporter;