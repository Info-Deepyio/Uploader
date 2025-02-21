const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');

// Replace with your actual Telegram bot token
const token = '7711851099:AAEI5Ploe3vdQ5pb4ha0RzduRT51x0PXc_U';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Path to the directory where your images are stored
const imageDir = path.join(__dirname, 'images');

// Function to send image based on user input (e.g., cde-24)
bot.onText(/cde-(\d{2})/, (msg, match) => {
  const chatId = msg.chat.id;
  const imageNumber = match[1]; // Extract the number after "cde-"

  const imageName = `cde-${imageNumber}.jpg`; // Add .jpg extension by default
  const imagePath = path.join(imageDir, imageName);

  // Persian reply with formatting and emojis
  const replyMessage = `🖼️ **تصویر درخواست شده: cde-${imageNumber}**\n\n📂 در حال ارسال تصویر...`;

  // Check if the image exists in the directory
  if (fs.existsSync(imagePath)) {
    // Send the image to the user
    bot.sendMessage(chatId, replyMessage, { parse_mode: 'Markdown' })
      .then(() => {
        bot.sendPhoto(chatId, imagePath)
          .then(() => {
            console.log(`Sent image: ${imageName}`);
          })
          .catch((error) => {
            console.error('Error sending image:', error);
            bot.sendMessage(chatId, '❌ متاسفانه مشکلی در ارسال تصویر پیش آمد.');
          });
      })
      .catch((error) => {
        console.error('Error sending initial message:', error);
        bot.sendMessage(chatId, '❌ مشکلی در ارسال پیام پیش آمد.');
      });
  } else {
    bot.sendMessage(chatId, `⚠️ **تصویری با نام "cde-${imageNumber}.jpg" پیدا نشد.**\nلطفاً نام صحیحی وارد کنید.`, { parse_mode: 'Markdown' });
  }
});

// Start the bot
console.log('🎉 Bot is running...');
