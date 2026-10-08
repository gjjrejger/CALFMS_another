const express = require("express");
const cors = require("cors");
const transporter = require("./email/send");
require("dotenv").config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
// Allow the CALFMS website to communicate with the API
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ]
}));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CALFMS server is running"
    });
});

// Contact form API
app.post("/api/contact", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message
        } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required."
            });
        }

        // Email sent to the office
        await transporter.sendMail({
            from: `"CALFMS Website" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: subject || "New Website Enquiry",

            text: `
New enquiry received through the Chweya & Associates website.

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject || "Not provided"}

Message:
${message}
            `
        });

        console.log(`📩 New contact enquiry from ${email}`);

        res.status(200).json({
            success: true,
            message: "Your enquiry has been sent successfully."
        });

    } catch (error) {
        console.error("❌ Failed to send contact enquiry:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to send your enquiry. Please try again later."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ CALFMS server running on http://localhost:${PORT}`);
});