//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class GuildStatusCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "guildstatus",
            category: "meta",
            description: "Guild Status"
        }
        let props = {
            caption: {
                text: "Guild Status"
            }
        }
        super(
            {...comprops},
            {...props}
        )
    }

    async action(client, message) {
        let serverBoostEmoji = await message.guild.emojis.cache.find(emoji => emoji.name === "serverboost2")
        if (!(serverBoostEmoji)) {
            serverBoostEmoji = "[*]"
        }
        console.log(message.guild.icon)
        this.props.thumbnail = message.guild.icon
        this.props.description = `**${message.guild.name}**`
        if (message.guild.features.length > 0) {
            this.props.description += "\n"
            this.props.description += "*Features*" + "\n" + '`'
            this.props.description += message.guild.features.join("`, `")
            this.props.description += '`'
        }

        this.props.fields = []

        if (message?.guild?.ownerId && message.guild.ownerId != "undefined") {
            console.log(`Guild Owner: ${message.guild.ownerId}`)
            this.props.fields.push(
                {
                    name: "Owner",
                    value: `<@${message.guild.ownerId}>`
                }
            )
        }

        if (message?.guild?.vanityURLCode && message.guild.vanityURLCode != "") {
            let vanityURL = `https://discord.gg/${message.guild.vanityURLCode}`
            this.props.fields.push(
                {
                    name: "Vanity URL",
                    value: `[${message.guild.vanityURLCode}](${vanityURL} '${vanityURL}')`
                }
            )
        }

        this.props.fields.push(
            {
                name: "Members",
                value: message.guild.memberCount.toString(),
                inline: true
            },
            {
                name: "Server Level",
                value: message.guild.premiumTier == 0 ? `${message.guild.premiumTier}` : `${serverBoostEmoji}`.repeat(message.guild.premiumTier),
                inline: true
            },
            {
                name: "Partnered",
                value: message.guild.partnered ? "Yes" : "No",
                inline: true
            },
            {
                name: "Verified",
                value: message.guild.verified ? "Yes" : "No",
                inline: true
            },
            {
                name: "Created",
                value: `<t:${Math.floor(message.guild.createdTimestamp / 1000)}:f>`,
            }
        )
    }

    async test(client, message) {
        let dummy = null
        dummy = new GuildStatusCommand()
        dummy.run(client, message, [], null, "")
    }
}
