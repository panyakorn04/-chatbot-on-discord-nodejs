require("dotenv").config();
const { OpenAI } = require("openai");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const IGNORE_PREFIX = "!";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(IGNORE_PREFIX)) return;
  const res = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: message.content,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
      stop: ["\n", "User:", "System:"],
      logprobs: true,
      top_logprobs: 2,
    })
    .catch((err) => {
      console.error("OpenAI error: ", err);
    });

  message.reply({
    content: res.choices[0].message.content,
  });
});

client.on("interactionCreate", async (interaction) => {
  interaction.reply("Hello, pong!");
});

client.login(process.env.DISCORD_BOT_TOKEN);
