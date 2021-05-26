const Levels = require('discord-xp');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'leader'],
    description: "Show's the top 10 players",
    async execute(message, args, cmd, client) {
        const rawLeaderboard = await Levels.fetchLeaderboard(10); // We grab top 10 users with most xp in the current server.

        if (rawLeaderboard.length < 1) return reply("Nobody's on the leaderboard yet.");

        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.

        const lb = leaderboard.map(e => `${e.position}.${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.

        const LeaderBoardEmbed = new MessageEmbed()
            .setColor('#23dd17')
            .setTitle('***Leaderboard***')
            .setURL('https://discord.gg/KKYdRbZcPT')
            .setDescription(`\`${lb.join("\n\n")}\``)
            .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();
        message.channel.send(LeaderBoardEmbed);
    }
}