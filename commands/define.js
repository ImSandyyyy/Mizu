import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Get definition of a word')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('Word to define')
                .setRequired(true)
        ),
    async execute(interaction) {
        const word = interaction.options.getString('word');

        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();

            if (!Array.isArray(data) || !data.length) {
                return await interaction.reply(`No definition found for **${word}** 😔`);
            }

            const definition = data[0].meanings[0].definitions[0].definition;
            const partOfSpeech = data[0].meanings[0].partOfSpeech;

            const embed = new EmbedBuilder()
                .setColor(0x1abc9c)
                .setTitle(`📖 Definition of "${word}"`)
                .setDescription(`**${definition}**`)
                .addFields(
                    { name: 'Part of Speech', value: partOfSpeech, inline: true },
                    { name: 'Word', value: word, inline: true },
                )
                .setFooter({ text: 'Powered by Dictionary API' })

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply("Something went wrong while fetching the definition.");
        }
    },
};