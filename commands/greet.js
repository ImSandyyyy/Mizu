import { SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Replies with hey!'),
	async execute(interaction) {
		await interaction.reply(`Hey! ${interaction.user}`);
	},
};
