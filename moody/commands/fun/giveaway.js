const QuestionnaireCommand = require('../../classes/questionnairecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');
const {
    DiscordAPIError
} = require('discord.js');

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

        super(
            {...comprops}
        )
    }

    async action(client, message) {
        let ROLES = JSON.parse(fs.readFileSync("./dbs/roles.json", "utf8"))
        let APPROVED_ROLES = ROLES["admin"]

        // Bail if member doesn't have Approved Roles
        if (!message.member.roles.cache.some(r => APPROVED_ROLES.includes(r.name))) {
            this.error = true
            this.props.description = this.errors.modOnly
            return
        }

        // vln giveaway 20s 1w :poop:

        this.props.description = []

        // this.props.description.push(
        //     `\`Input: vln giveaway ${this.inputData.args.join(" ")}\``,
        //     `\`Input: ${this.inputData.args}`
        // )

        // Get duration
        let duration = ms(this.inputData.args.shift()) // In Milliseconds

        // this.props.description.push(`Duration: ${duration} ms`)

        // Bail if no duration or duration not a number
        if ((!(duration)) || isNaN(duration)) {
            this.error = true
            this.channel = message.channel
            this.props.description = `Please enter an amount of time for the Giveaway to go for. '${duration}' given.`
            return
        }

        // Get number of winners expected
        let winnersnum = this.inputData.args.shift()
        if (winnersnum) {
            winnersnum = parseInt(winnersnum.replace("w", ""))
        }
        this.props.description.push(`Winners: ${winnersnum}`)

        // Bail if no number of winners or it's not a number
        if ((!(winnersnum)) || isNaN(winnersnum)) {
            this.error = true
            this.channel = message.channel
            this.props.description = `Please enter a maximum number of winners. '${winnersnum}' given.`
            return
        }

        // Get channel
        this.channel = await this.getChannel(message, "giveaway")

        // Get product
        let product = this.inputData.args.join(" ")

        // this.props.description.push(`Product: ${product}`)

        // Bail if no product given
        if (!(product)) {
            this.error = true
            this.channel = message.channel
            this.props.description = "What are you giving away?"
            return
        }

        // this.props.description.push(`Duration: ${duration} ms`)
        // this.props.description.push(`Now:      ${Date.now()} ms`)

        // Date.now() // In Milliseconds
        let end = parseInt((Date.now() + parseInt(duration)) / 1000) // In Seconds

        // this.props.description.push(`End:      ${end} s\``)

        // Build the thing
        this.props.title.text = product
        this.props.description.push(
            `React with ${this.emoji[0]} to enter!`,
            `Ends: <t:${end}:f>`, // In Seconds
            `Hosted By: ${message.author}`
        )

        // We're gonna handle sending the messages in here
        this.null = true

        // Send the message
        await this.send(message, new VillainsEmbed({...this.props})).then(async (msg) => {
            // Add reactions
            for (let emoji of this.emoji) {
                await msg.react(emoji)
            }

            let winners = []

            // Filter the reactions
            const FILTER = (reaction, user) => {
                return (
                    reaction.emoji.name === this.emoji[0] &&
                    (!user.bot) &&
                    (user.id !== message.author.id) &&
                    true
                )
            };

            // Hard cap at 5000 reactions
            // this.props.description.push(`Collector: ${duration} ms\``)
            const COLLECTOR = msg.createReactionCollector(FILTER, {
                max: (this.DEV) ? winnersnum : 5000, //FIXME: This is winnersnum for testing
                time: parseInt(duration) // In Milliseconds
            });

            // Collector is finished
            COLLECTOR.on('end', collected => {
                let reactors = {}
                let fields = []

                // Sort & collate the reactions
                for (let [reaction, reactionData] of collected) {
                    if (!(reactors[reaction])) {
                        reactors[reaction] = []
                    }
                    for (let [userID, ] of reactionData.users.cache) {
                        if (userID !== client.user.id) {
                            reactors[reaction].push(userID)
                        }
                    }

                    // Shuffle the reactions
                    let shuffler = (arr) => {
                        let currentIndex = arr.length,
                            randomIndex;

                        // While there remain elements to shuffle...
                        while (0 !== currentIndex) {
                            // Pick a remaining element...
                            randomIndex = Math.floor(Math.random() * currentIndex);
                            currentIndex--;

                            // And swap it with the current element.
                            [arr[currentIndex], arr[randomIndex]] = [
                                arr[randomIndex], arr[currentIndex]
                            ];
                        }

                        return arr;
                    }

                    // Pick winners
                    winners = shuffler(reactors[reaction]).slice(0, winnersnum)

                    // Build the summary
                    fields.push({
                        name: "Prize",
                        value: product
                    }, {
                        name: "Ended",
                        value: `<t:${end}:f>`
                    }, {
                        name: `Winners: ${reaction}`,
                        value: `${winners.map(x => `<@${x}>`).join("\n")}`,
                        inline: true
                    }, {
                        name: `Host`,
                        value: `${message.author}`,
                        inline: true
                    })
                }

                // Get summary embed
                let desc = fields.length > 0 ? `Please DM the host for your prize!` : `No Winners found!`
                let props = {
                    caption: {
                        text: "Giveaway Winners"
                    },
                    description: [desc].join("\n"),
                    fields: fields
                }

                let embed = new VillainsEmbed({...props});
                // DM to winners & host
                for (let winner of [...winners, message.author.id]) {
                    client.users.fetch(winner, false).then((user) => {
                        if (!(user.bot)) {
                            try {
                                user.send(embed)
                            } catch (e) {
                                if (e instanceof DiscordAPIError) {
                                    console.log(`Can't send message to ${user.username}#${user.discriminator} (ID:${user.id})`)
                                }
                            }
                        }
                    })
                }

                // Send a copy to giveaway channel
                msg.channel.send(embed);
            });
        })
    }
}
