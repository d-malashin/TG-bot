const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios/dist/node/axios.cjs');
require('dotenv').config();

const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    // Send the message to the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: messageText}],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_TOKEN}`,
        },
      },
    ).catch((e) => {
      console.error(e)
    });

    // Get the generated text from the API response
    const generatedText = response.data.choices[0].message.content;

    // Send the generated text back to the user
    bot.sendMessage(chatId, generatedText);
  } catch (error) {
    throw Error(error);
  }
});

bot.on('polling_error', (error) => {
  console.log(error);
});

bot.on('webhook_error', (error) => {
  console.log(error);
});

console.log('Bot started!');
