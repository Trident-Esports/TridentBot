const QuestionnaireCommand = require('../../classes/questionnairecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');
const ms = require('ms');
const Shuffle = require('array-shuffle');

// Giveaways
module.exports = class GiveawayCommand extends QuestionnaireCommand {
    constructor() {
        let comprops = {
            name: "giveaway",
            category: "fun",
            description: "Giveaways",
            channelName: "🎉giveaways", //FIXME: Needs to change dependant on channels.json
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
            this.props.description = [(`\`Input: vln giveaway ${this.inputData.args.join(" ")}\``), (`\`Input: ${this.inputData.args}`)]
            let duration = ms(this.inputData.args.shift()) // In Milliseconds
            this.props.description.push(`Duration: ${duration} ms`)

            if ((!(duration)) || isNaN(duration)) {
                this.error = true
                this.props.description = `Please enter an amount of time for the Giveaway to go for. '${duration}' given.`
            }

            if (!(this.error)) {
                let winnersnum = parseInt(this.inputData.args.shift().replace("w", ""))
                this.props.description.push(`Winners: ${winnersnum}`)

                if ((!(winnersnum)) || isNaN(winnersnum)) {
                    this.error = true
                    this.props.description = `Please enter a maximum number of winners. '${winnersnum}' given.`
                }

                if (!(this.error)) {
                    let product = this.inputData.args.join(" ")
                    this.props.description.push(`Product: ${product}`)

                    if (!(product)) {
                        this.error = true
                        this.props.description = "What are you giving away?"
                    }

                    if (!(this.error)) {
                        this.props.description.push(`Duration: ${duration} ms`)
                        this.props.description.push(`Now:      ${Date.now()} ms`)
                        Date.now() // In Milliseconds
                        let end = parseInt((Date.now() + parseInt(duration)) / 1000) // In Seconds
                        this.props.description.push(`End:      ${end} s\``)
                        this.props.title.text = product
                        this.props.description = [
                            `React with ${this.emoji[0]} to enter!`,
                            `Ends: <t:${end}:f>`, // In Seconds
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

                            // this.props.description.push(`Collector: ${duration} ms\``)
                            const COLLECTOR = msg.createReactionCollector(FILTER, {
                                max: 5000, //FIXME: This is winnersnum for testing
                                time: parseInt(duration) // In Milliseconds
                            });
                            COLLECTOR.on('end', collected => {
                                let reactors = {}
                                let fields = []
                                for (let [reaction, reactionData] of collected) {
                                    if (!(reactors.reaction)) {
                                        reactors.reaction = []
                                    }
                                    for (let [userID, userData] of reactionData.users.cache) {
                                        if (!userData.bot) {
                                            reactors.reaction.push(`<@${userID}>`)
                                            console.log(`${reaction}: ${userData.username}#${userData.discriminator} (ID:${userID})`)
                                        }
                                    }

                                    let winners1 = Shuffle(reactors.reaction)
                                    let winners = winners1.splice(0, winnersnum)

                                    fields.push({
                                        name: `Winners: ${reaction}`,
                                        value: `${winners.join("\n")}`,
                                        inline: true
                                    }, {
                                        name: `Host`,
                                        value: `${message.author}`,
                                        inline: true
                                    })
                                    msg.channel.send(`${winners.join("\n")}`)
                                        .then(msg => {
                                            setTimeout(() => msg.delete(), 2000)
                                        })
                                }

                                let embed = new VillainsEmbed({
                                    caption: {
                                        text: "Giveaway Winners"
                                    },
                                    fields: fields,
                                    footer: {
                                        msg: "DM Host to claim your Prizes!"
                                    }
                                });
                                this.null = true
                                this.send(message, embed)
                            });
                        })
                    }
                }
            }
        }
    }
}