import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('wisewords')
        .setDescription('Display random quotes.'),
    async execute(interaction) {

        try {
            const response = await fetch("https://zenquotes.io/api/random");
            const quote = await response.json();

              const embed = new EmbedBuilder()
                .setColor(0x1abc9c) 
                .setTitle("💭 Wise Words")
                .setDescription(`*"${quote[0].q}"*`)
                .setFooter({ text: `— ${quote[0].a}` });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply("Something went wrong while fetching the quote.");

        }
    }
}