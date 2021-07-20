const QuestionnaireCommand = require('../../classes/questionnairecommand.class');

const fs = require('fs');
const ms = require('ms');

// Giveaways
module.exports = class GiveawayCommand extends QuestionnaireCommand {
    constructor() {
        let comprops = {
            name: "giveaway",
            category: "fun",
            description: "Giveaways",
            channelName: "giveaway",
            emoji: ["🎉"]
        }

        super(comprops)
    }

    async action(client, message) {

        let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
        let APPROVED_ROLES = ROLES["admin", "mod"]
        let duration = this.inputData.args[0]
        duration = ms(duration)
        let product = this.inputData.args.splice(2).join(" ")
        let winnersnum = parseInt(this.inputData.args[1])

        if (!message.member.roles.cache.some(r => APPROVED_ROLES.includes(r.name))) {
            this.error = true
            this.props.title.text = "Error"
            this.props.description = "Sorry, only admins can run this command. 😔"
        }

        if (!(duration)) {
            this.error = true
            this.props.description = `Please enter an amount of time for the Giveaway to go for.`
        }
        if (!product) {
            this.error = true
            this.props.description = "What are you giving away?"
        }

        if (!(this.error)) {
            this.props.title.text = product
            this.props.description = [
                "React with 🎉 to enter!",
                `Ends: \`${ms(duration)}\``,
                `Hosted By: ${message.author}`
            ]

            const FILTER = (reaction, user) => {
                return reaction.emoji.name === '🎉' && !user.bot //|| user.id !== message.author.id;
            };

            const COLLECTOR = message.createReactionCollector(FILTER, {
                max: 50000,
                time: duration
            });

            COLLECTOR.on('end', collected => {
                console.log(collected);
            });
        }
    }
}
