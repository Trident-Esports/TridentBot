const fs = require('fs');

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

        const lb = leaderboard.map(e => `${e.position}. \`<@${e.userID}>\`\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.

        console.log(lb);

        let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
        let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
        let DEV = GLOBALS.DEV;

        let stripe = defaults["stripe"]

        let props = {
            "title": "***Leaderboard***",
            "url": "https://discord.com/KKYdRbZcPT"
        }
        switch (stripe) {
            default:
                stripe = "#B2EE17";
                break;
        }

        // Hack in my stuff to differentiate
        if (DEV) {
            stripe = GLOBALS["stripe"]
            defaults.footer = GLOBALS.footer
        }

        props["stripe"] = stripe

        const LeaderBoardEmbed = new MessageEmbed()
            .setColor(props.stripe)
            .setTitle(props.title)
            .setURL(props.url)
            .setDescription(`\`${lb.join("\n\n")}\``)
            .setThumbnail(props["thumbnail"])
            .setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();
        message.channel.send(LeaderBoardEmbed);
    }
}
