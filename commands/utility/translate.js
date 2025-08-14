const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Get definition of a word')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('Word to define')
                .setRequired(true)),
    async execute(interaction) {
        const word = interaction.options.getString('word');

        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();

            if (!Array.isArray(data) || !data.length) {
                return await interaction.reply(`No definition found for **${word}** 😔`);
            }

            const definition = data[0].meanings[0].definitions[0].definition;
            await interaction.reply(`**${word}**: ${definition}`);
        }
        catch (error) {
            console.error(error);
            await interaction.reply("Something went wrong while fetching the definition.");
        }
    },
};