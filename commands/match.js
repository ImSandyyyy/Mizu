import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('matches')
        .setDescription('Display the matches of upcoming FCB and RMA game!'),
    async execute(interaction) {
        const API_KEY = process.env.FOOTBALL_KEY;
        const TEAM_IDS = {
            barcelona: 81,
            madrid: 86,
            liverpool: 64,
            ManCity : 65,
            ManUtd : 66,
            psg :524
        };

        async function getUpcomingMatch(teamId) {
            const url = `https://api.football-data.org/v4/teams/${teamId}/matches?status=SCHEDULED&limit=1`;

            const res = await fetch(url, {
                headers: { "X-Auth-Token": API_KEY }
            });

            const data = await res.json();

            if (data.matches && data.matches.length > 0) {
                const match = data.matches[0];
                return {
                    teams: `${match.homeTeam.name} 🆚 ${match.awayTeam.name}`,
                    date: new Date(match.utcDate).toLocaleString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata"
                    })
                };
            } else {
                return { teams: "❌ No upcoming matches found", date: "—" };
            }
        }

        const madridMatch = await getUpcomingMatch(TEAM_IDS.madrid);
        const barcaMatch = await getUpcomingMatch(TEAM_IDS.barcelona);
        const liverpoolMatch = await getUpcomingMatch(TEAM_IDS.liverpool);
        const manCityMatch = await getUpcomingMatch(TEAM_IDS.ManCity);
        const manUtdMatch = await getUpcomingMatch(TEAM_IDS.ManUtd);
        const psgMatch = await getUpcomingMatch(TEAM_IDS.psg);

        const embed = new EmbedBuilder()
            .setColor("#1d428a")
            .setTitle("⚽  Upcoming Matches")
            .setDescription("Here are the next scheduled games!")
            .addFields(
                {
                    name: "\u200B",
                    value: `**${madridMatch.teams}**\n ${madridMatch.date}`
                },
                {
                    name: "\u200B ",
                    value: `**${barcaMatch.teams}**\n ${barcaMatch.date}`
                },
                 {
                    name: "\u200B",
                    value: `**${liverpoolMatch.teams}**\n ${liverpoolMatch.date}`
                },
                {
                    name: "\u200B ",
                    value: `**${manCityMatch.teams}**\n ${manCityMatch.date}`
                },
                 {
                    name: "\u200B",
                    value: `**${manUtdMatch.teams}**\n ${manUtdMatch.date}`
                },
                {
                    name: "\u200B ",
                    value: `**${psgMatch.teams}**\n ${psgMatch.date}`
                }
            )
            .setFooter({ text: "Powered by football-data.org" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}
