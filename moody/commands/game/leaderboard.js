const GameCommand = require('../../classes/command/gamecommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');

function ordinal(n) {
  let s = ["th", "st", "nd", "rd"];
  let v = n%100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}
module.exports = class LeaderboardCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'leaderboard',
            aliases: ['lb', 'leader'],
            category: 'game',
            description: 'Check the Global Leaderboard',
            extensions: [ "levels" ]
        }
        super(comprops)
    }

    async action(client, message) {
        const rawLeaderboard = await this.Levels.fetchLeaderboard(1,10); // We grab top 10 users with most xp in the current server.

        if (rawLeaderboard.length < 1) {
            return reply("Nobody's on the leaderboard yet.");
        }

        const leaderboard = await this.Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.

        let props = this.props
        props.fields = []

        for (let [slot, player] of Object.entries(leaderboard)) {
            props.fields.push(
                {
                    name: ordinal(player.position) + " Place",
                    value: `<@${player.userID}>`,
                    inline: true
                },
                {
                    name: this.emojis.level + player.level,
                    value: "Level",
                    inline: true
                },
                {
                    name: this.emojis.xp + player.xp.toLocaleString("en-AU"),
                    value: "XP",
                    inline: true
                }
            )
            if ((parseInt(slot) + 1) % 5 == 0) {
                this.pages.push(new VillainsEmbed(props))
                props.fields = []
            }
        }
        if (props.fields.length > 0) {
            this.pages.push(new VillainsEmbed(props))
            props.fields = []
        }
    }
}
