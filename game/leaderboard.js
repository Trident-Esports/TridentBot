const Levels = require('discord-xp');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'leader'],
    description: "Show's the top 10 players",
    async execute(message, client) {
        const rawLeaderboard = await Levels.fetchLeaderboard(10); // We grab top 10 users with most xp in the current server.

        if (rawLeaderboard.length < 1) return reply("Nobody's on the leaderboard yet.");

        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.

        const lb = leaderboard.map(e => `${e.position}.${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.

        let props = {
            "embedColor": "#B2EE17",
            "title": "***Leaderboard***",
            "url": "https://discord.com/KKYdRbZcPT",
            "thumbnail": "https://cdn.discordapp.com/icons/788021898146742292/a_cc4d6460f0b5cc5f77d65aa198609843.gif"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        const LeaderBoardEmbed = new MessageEmbed()
            .setColor(props["embedColor"])
            .setTitle(props["title"])
            .setURL(props["url"])
            .setDescription(`\`${lb.join("\n\n")}\``)
            .setThumbnail(props["thumbnail"])
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();
        message.channel.send(LeaderBoardEmbed);
    }
}
