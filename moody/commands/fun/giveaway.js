const QuestionnaireCommand = require('../../classes/questionnairecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

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

        if (!message.member.roles.cache.some(r => APPROVED_ROLES.includes(r.name))) {
            this.error = true
            this.props.title.text = "Error"
            this.props.description = this.errors.modOnly
        }

        if (!(this.error)) {
            let duration = this.inputData.args.shift().split("")
            let unit = duration.pop()
            switch (unit) {
                case "m":
                    duration = parseInt(duration) * 10 * 60;
                    break;
                case "d":
                    duration = parseInt(duration) * 10 * 60 * 24;
                    break;
            }

            if ((!(duration)) || isNaN(duration)) {
                this.error = true
                this.props.description = `Please enter an amount of time for the Giveaway to go for. '${duration}' given.`
            }

            if (!(this.error)) {
                let winnersnum = parseInt(this.inputData.args.shift().replace("w",""))

                if((!(winnersnum)) || isNaN(winnersnum)) {
                    this.error = true
                    this.props.description = `Please enter a maximum number of winners. '${winnersnum}' given.`
                }

                if (!(this.error)) {
                    let product = this.inputData.args.join(" ")

                    if (!(product)) {
                        this.error = true
                        this.props.description = "What are you giving away?"
                    }

                    if (!(this.error)) {
                        let end = parseInt(Date.now() / 1000) + parseInt(duration)
                        this.props.title.text = product
                        this.props.description = [
                            `React with ${this.emoji[0]} to enter!`,
                            `Ends: <t:${end}:f>`,
                            `Hosted By: ${message.author}`
                        ]

                        this.null = true
                        await this.send(message, new VillainsEmbed(this.props)).then(async (msg) => {
                            for (let emoji of this.emoji) {
                                await msg.react(emoji)
                            }
                            const FILTER = (reaction, user) => {
                                return (
                                          reaction.emoji.name === this.emoji[0] &&
                                          (!user.bot) &&
                                          // (user.id !== message.author.id) &&
                                          true
                                )
                            };

                            const COLLECTOR = msg.createReactionCollector(FILTER, {
                                max: winnersnum,
                                time: parseInt(duration) * 1000
                            });
                            COLLECTOR.on('end', collected => {
                                for (let [reaction, reactionData] of collected) {
                                    for (let [userID, userData] of reactionData.users.cache) {
                                        console.log(`${userData.username}#${userData.discriminator}`)
                                    }
                                }
                            });
                        })
                    }
                }
            }
        }
    }
}
