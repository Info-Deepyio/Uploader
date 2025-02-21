const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');

// Replace with your actual Telegram bot token
const token = '7711851099:AAEI5Ploe3vdQ5pb4ha0RzduRT51x0PXc_U';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Path to the directory where your files are stored
const fileDir = path.join(__dirname, 'images'); // Ensure this path is correct

// Function to send the file based on user input (e.g., cde-24)
bot.onText(/(cde-\d{2})/i, (msg, match) => {
  const chatId = msg.chat.id;
  const baseFileName = match[1].toLowerCase(); // Normalize the input to lowercase

  // Scan the 'images' folder for any file that matches the baseFileName (case-insensitive)
  fs.readdir(fileDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      bot.sendMessage(chatId, '❌ مشکلی در دسترسی به پوشه تصاویر پیش آمد.');
      return;
    }

    // Find any file in the 'images' folder where the name starts with baseFileName (case-insensitive)
    const matchingFiles = files.filter(file => file.toLowerCase().startsWith(baseFileName.toLowerCase()));

    if (matchingFiles.length > 0) {
      matchingFiles.forEach(file => {
        const filePath = path.join(fileDir, file);

        // Send the file to the user
        bot.sendMessage(chatId, `🖼️ **فایل درخواست شده: ${file}**\n\n📂 در حال ارسال فایل...`, { parse_mode: 'Markdown' })
          .then(() => {
            bot.sendDocument(chatId, filePath) // Use sendDocument to send all types of files
              .then(() => {
                console.log(`Sent file: ${file}`);
              })
              .catch((error) => {
                console.error('Error sending file:', error);
                bot.sendMessage(chatId, '❌ متاسفانه مشکلی در ارسال فایل پیش آمد.');
              });
          })
          .catch((error) => {
            console.error('Error sending initial message:', error);
            bot.sendMessage(chatId, '❌ مشکلی در ارسال پیام پیش آمد.');
          });
      });
    } else {
      // If no matching file is found
      bot.sendMessage(chatId, `⚠️ **فایلی با نام "${baseFileName}" پیدا نشد.**\nلطفاً نام صحیحی وارد کنید.`, { parse_mode: 'Markdown' });
    }
  });
});

// Start the bot
console.log('🎉 Bot is running...');
