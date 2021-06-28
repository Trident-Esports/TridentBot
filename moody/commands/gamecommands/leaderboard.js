const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

module.exports = class BegCommand extends GameCommand {
    constructor() {
        super({
            name: 'leaderboard',
            aliases: ['lb', 'leader'],
            category: 'game',
            description: 'Check the Global Leaderboard',
            extensions: [ "levels" ]
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Leaderboard"
            },
            description: "",
            footer: {
                msg: ""
            }
        }
        const rawLeaderboard = await this.Levels.fetchLeaderboard(1,10); // We grab top 10 users with most xp in the current server.

        if (rawLeaderboard.length < 1) {
            return reply("Nobody's on the leaderboard yet.");
        }

        const leaderboard = await this.Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
        const lb = leaderboard.map(e => `${e.position}. \`<@${e.userID}>\`\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.

        props.description = `\`${lb.join("\n\n")}\``

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}