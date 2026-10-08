const { ImapFlow } = require("imapflow");
require("dotenv").config();

const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT),
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },

    logger: false
});

async function receiveEmails() {
    try {
        await client.connect();

        console.log("✅ Gmail IMAP connection successful!");

        const lock = await client.getMailboxLock("INBOX");

        try {
            console.log(`📬 Inbox contains ${client.mailbox.exists} messages.`);

            const start = Math.max(1, client.mailbox.exists - 4);

            for await (const message of client.fetch(
                `${start}:*`,
                {
                    envelope: true,
                    flags: true
                }
            )) {
                console.log("--------------------------------");
                console.log("Subject:", message.envelope.subject);
                console.log("From:", message.envelope.from?.[0]?.address);
                console.log("Date:", message.envelope.date);
                console.log("Read:", message.flags.has("\\Seen"));
            }
        } finally {
            lock.release();
        }

        await client.logout();

        console.log("✅ IMAP test completed!");

    } catch (error) {
        console.error("❌ Gmail IMAP connection failed:");
        console.error(error);

        try {
            await client.logout();
        } catch {
            // Connection may already be closed.
        }
    }
}

receiveEmails();