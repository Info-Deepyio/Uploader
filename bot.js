
const axios = require("axios");

const TOKEN = "2109246071:MmcE0OZiBfNsMKL8ib4wjoMo68TaJykd-wk";
const API = `https://tapi.bale.ai/bot${TOKEN}`;

let offset = 0;

async function getUpdates() {
  try {
    const response = await axios.get(`${API}/getUpdates`, {
      params: {
        offset,
        timeout: 30
      },
      timeout: 35000
    });

    for (const update of response.data.result) {
      offset = update.update_id + 1;

      const message = update.message;
      if (!message?.text) continue;

      if (message.text.trim().split(/\s+/)[0].split("@")[0] === "/start") {
        await axios.post(`${API}/sendMessage`, {
          chat_id: message.chat.id,
          text: "Hello! 👋 Welcome to the bot."
        });
      }
    }
  } catch (error) {
    console.error(
      "Telegram error:",
      error.response?.data || error.message
    );
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

async function main() {
  if (!TOKEN) {
    throw new Error("BOT_TOKEN environment variable is missing.");
  }

  // Remove any existing webhook so long polling can work.
  await axios.post(`${API}/deleteWebhook`);

  console.log("Bot started. Listening for /start...");

  while (true) {
    await getUpdates();
  }
}

main().catch(console.error);
