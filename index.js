import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const token = '5804517790:AAE6pXp_yV6aANnCyVOHBHqpULO-vyUO570';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    // Send the message to the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: messageText,
        max_tokens: 150,
        temperature: 0.5,
        n: 1,
        stop: ['\n'],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR_API_KEY_HERE',
        },
      },
    );

    // Get the generated text from the API response
    const generatedText = response.data.choices[0].text;

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
