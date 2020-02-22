require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Mercury = require('@postlight/mercury-parser');
const axios = require('axios');

const { token } = process.env;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async msg => {
  bot.sendMessage(msg.chat.id, 'wait for it...');

  const url = msg.text.split('\n')[1];
  const keyPointUrl = 'http://13.250.46.91:3000';

  const content = await Mercury.parse(url, { contentType: 'text' });
  const result = await axios.post(keyPointUrl, {
    isi_artikel: content.content
  });

  await bot.sendMessage(msg.chat.id, "Here's the keypoint:");

  for (let i = 0; i < result.data.length; i += 1) {
    await bot.sendMessage(msg.chat.id, `${i + 1}. ${result.data[i]}`);
  }
});
