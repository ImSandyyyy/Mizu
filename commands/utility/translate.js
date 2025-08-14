const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("define") 
        .setDescription("get definition of a word"),
    async execute(message, args) {
        const word = args.join(' ');
        if (!word) return message.reply('give me a world!');

        try {
            const res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/${word}')
            const data = await res.json();

            if (!Array.isArray(data) || !data.length) {
                return message.reply(`No definition found for **${word}** 😔`);
            }

            const definition = data[0].meanings[0].definitions[0].definition;
            message.reply(`**${word}**: ${definition}`);
        }
        catch (error) {
            console.error(error);
            message.reply("something went wrong while fetching the definition.")
        }
    },
};


