//@ts-check

const QuestionnaireCommand = require('../../classes/command/questionnairecommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');
const { DiscordAPIError } = require('discord.js');

const chalk = require('chalk');
const fs = require('fs');
const ms = require('ms');

//FIXME: Filter needs help

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

    async getChannel(message, channelType) {
        let channelIDs = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/channels.json","utf8"))
        let channelID = 0
        let channel = null

        // Get channel IDs for this guild
        if (Object.keys(channelIDs).includes(message.guild.id)) {
            // If the channel type exists
            if (Object.keys(channelIDs[message.guild.id]).includes(channelType)) {
                // Get the ID
                channelID = channelIDs[message.guild.id][channelType]
            }
        }

        // If the ID is not a number, search for a named channel
        if (isNaN(channelID)) {
            channel = await message.guild.channels.cache.find(c => c.name === channelID);
        } else {
            // Else, search for a numbered channel
            channel = await message.guild.channels.cache.find(c => c.id === channelID);
        }

        return channel
    }

    async action(message, args, cmd) {
        let ROLES = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/roles.json", "utf8"))
        let APPROVED_ROLES = ROLES["admin"].concat(ROLES["mod"])

        if (!(await message.member.roles.cache.some(r => APPROVED_ROLES.includes(r.name)))) {
            this.error = true
            this.props.description = this.errors.modOnly
            return
        }

        // vln giveaway 20s 1w :poop:

        this.channel = await this.getChannel(message, "giveaway")

        this.props.description = []

        // this.props.description.push(
        //     `\`Input: vln giveaway ${this.inputData.args.join(" ")}\``,
        //     `\`Input: ${this.inputData.args}`
        // )

        let duration = ms(this.inputData.args.shift()) // In Milliseconds

        // this.props.description.push(`Duration: ${duration} ms`)

        if ((!(duration)) || typeof duration == "string") {
            this.error = true
            this.props.description = `Please enter an amount of time for the Giveaway to go for. '${duration}' given.`
            return
        }

        let winnersnum = parseInt(this.inputData.args.shift().replace("w", ""))
        this.props.description.push(`Winners: ${winnersnum}`)

        if ((!(winnersnum)) || isNaN(winnersnum)) {
            this.error = true
            this.props.description = `Please enter a maximum number of winners. '${winnersnum}' given.`
            return
        }

        let product = this.inputData.args.join(" ")

        // this.props.description.push(`Product: ${product}`)

        if (!(product)) {
            this.error = true
            this.props.description = "What are you giving away?"
            return
        }

        // this.props.description.push(`Duration: ${duration} ms`)
        // this.props.description.push(`Now:      ${Date.now()} ms`)

        // Date.now() // In Milliseconds
        let end = Math.floor((Date.now() + parseInt(duration)) / 1000) // In Seconds

        // this.props.description.push(`End:      ${end} s\``)

        this.props.title.text = product
        this.props.description.push(
            `React with ${this.emojis[0]} to enter!`,
            `Ends: <t:${end}:f>`,                     // In Seconds
            `Hosted By: ${message.author}`
        )

        this.null = true
        await this.send(message, new VillainsEmbed(this.props)).then(async (msg) => {
            for (let emoji of this.emojis) {
                await msg.react(emoji)
            }

            let winners = []

            const FILTER = (reaction, user) => {
                return (
                    reaction.emoji.name === this.emojis[0] &&
                    (!user.bot) &&
                    // (user.id !== message.author.id) &&
                    true
                )
            };

            // this.props.description.push(`Collector: ${duration} ms\``)
            // const COLLECTOR = msg.createReactionCollector({FILTER, // discord.js v13
            const COLLECTOR = msg.createReactionCollector(FILTER, {
                max: (this.DEV) ? winnersnum : 5000, //FIXME: This is winnersnum for testing
                time: parseInt(duration) // In Milliseconds
            });
            COLLECTOR.on('end', collected => {
                let reactors = {}
                let fields = []
                for (let [reaction, reactionData] of collected) {
                    if (!(reactors[reaction])) {
                        reactors[reaction] = []
                    }
                    for (let [userID, ] of reactionData.users.cache) {
                        if (userID !== message.client.user.id) {
                            reactors[reaction].push(userID)
                        }
                    }

                    let shuffler = (arr) => {
                        let currentIndex = arr.length,  randomIndex;

                        // While there remain elements to shuffle...
                        while (0 !== currentIndex) {
                            // Pick a remaining element...
                            randomIndex = Math.floor(Math.random() * currentIndex);
                            currentIndex--;

                            // And swap it with the current element.
                            [arr[currentIndex], arr[randomIndex]] = [
                                arr[randomIndex], arr[currentIndex]];
                        }

                        return arr;
                    }

                    winners = shuffler(reactors[reaction]).slice(0,winnersnum)

                    fields.push(
                        {
                            name: "Prize",
                            value: product
                        },
                        {
                            name: "Ended",
                            value: `<t:${end}:f>`
                        },
                        {
                            name: `Winners: ${reaction}`,
                            value: `${winners.map(x => `<@${x}>`).join("\n")}`,
                            inline: true
                        },
                        {
                            name: `Host`,
                            value: `${message.author}`,
                            inline: true
                        }
                    )
                }

                let embed = new VillainsEmbed({
                    caption: {
                        text: "Giveaway Winners"
                    },
                    description: [
                        `Please DM the Host for your prize!`
                    ].join("\n"),
                    fields: fields
                });
                for (let winner of winners) {
                    message.client.users.fetch(winner, false).then((user) => {
                        if (!(user.bot)) {
                            try {
                                this.null = true
                                user.send(embed)
                            } catch (e) {
                                if (e instanceof DiscordAPIError) {
                                    console.log(chalk.yellow(`🟡Can't send message to ${user.username}#${user.discriminator} (ID:${user.id})`))
                                }
                            }
                        }
                    })
                }

                this.null = true
                // msg.channel.send({ embeds: [embed] }); // discord.js v13
                msg.channel.send(embed);
            });
        })
    }

    async test(message, cmd) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
            "20s 1w :poop:"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new GiveawayCommand()
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args, cmd)
        }
    }
}
