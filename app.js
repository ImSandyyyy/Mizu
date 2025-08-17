import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  const foldersPath = path.resolve("commands");
  const commandNames = await fs.readdir(foldersPath); 

  
  const commands = commandNames.map(async name => { 
	const filePath = path.resolve(foldersPath, name);
	const file = await import(pathToFileURL(filePath).href);
	client.commands.set(file.default.data.name, file.default);
	return file.default.data.toJSON();
  });

  const commandSettled = await promise.allSettled(commands);
  const commandData = commandSettled.filter(res => res.status === "fulfilled").map(res => res.value);
  await client.application.commands.set(commandData);

});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });

    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

const token = process.env.TOKEN;
client.login(token);
