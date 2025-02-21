const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

// Replace with your Telegram bot token
const token = 'YOUR_BOT_TOKEN_HERE';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Listen for messages and handle commands
bot.onText(/\.getfont/, (msg) => {
  const chatId = msg.chat.id;

  // Path to the Start_Survey.zip file in the same directory as this script
  const filePath = path.join(__dirname, 'Start_Survey.zip');

  // Send the file to the user
  bot.sendDocument(chatId, filePath)
    .then(() => {
      console.log('Start_Survey.zip sent successfully');
    })
    .catch((error) => {
      console.error('Error sending Start_Survey.zip:', error);
    });
});

console.log('Bot is running...');
