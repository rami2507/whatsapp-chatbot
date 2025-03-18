const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ✅ Webhook verification (WhatsApp requires this)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN =
    "EAAJYaEwVQQcBOzak9eYDMYNYNJFOuH9LpfZC9M9VtjMVUJp9WQITdf1avddu1zUtvYoFY00asWZBPZAky98bVxAu803ZBzObLRJnDQvFaZBUZBXGGFmammh7NyrZCUhK5XuFn5qJ2TlcZAlAxtOMnDFAlQaxeZB66rYzDcpguNFZB7NcCIXj4bw5PygQXiZAwVlNWdIZBZCYTZB9Nz5hDTHWDli06VigxFgrwWJtsk8ubAvPgzd8sZD"; // Change this!
  if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Webhook to receive messages
app.post("/webhook", (req, res) => {
  console.log(
    "📩 Received WhatsApp message:",
    JSON.stringify(req.body, null, 2)
  );

  if (req.body.entry) {
    const messageData = req.body.entry[0].changes[0].value;

    if (messageData.messages) {
      const from = messageData.messages[0].from; // User phone number
      const text = messageData.messages[0].text.body; // User message

      console.log(`📩 Message from ${from}: "${text}"`);

      sendWhatsAppMessage(from, "Hello! This is an automated reply 😊");
    }
  }

  //   res.sendStatus(200);
  res.status(200).json({
    message: "Webhook successfully set up and running.",
  });
});

// ✅ Function to send a WhatsApp message
async function sendWhatsAppMessage(to, text) {
  const accessToken =
    "EAAJYaEwVQQcBO8hnjSrwyZCt8MG5AuOm3IT0oIN3tZC4HylEhqWP5ap7OZBKKJOKZAGI1aPvn6SIeCDkhww2kdQ0LuFHNVZCdSWCoAgpIQWoKWjrD7C2PACn06KW5Sm3MwPzi2JyeiBXJvAShiKXcwfGEhv5QYSuhzQZAohbX7NwqZCUDojp9jsFbkoAQ0yWpqOVxkh199dyyo4PlZBLIWqtGF7w2ARtxEcacvO1IV0URdgZD"; // Get from Meta
  const phoneNumberId = "522811434259516"; // Found in API Setup

  await axios.post(
    `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text },
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

// ✅ Start server
app.listen(3000, () => console.log("🚀 Webhook running on port 3000"));
