const { SlashCommandBuilder } = require("discord.js")

let countW = 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('w')
		.setDescription("W's in the chat!"),
	async execute(interaction) {
		countW++;
		await interaction.reply(` W count is: ${countW} ${interaction.user}` );
	},
};
