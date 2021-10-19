//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class GuildStatusCommand extends VillainsCommand {
    constructor(context) {
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
            context,
            {...comprops},
            {...props}
        )
    }

    async action(message, args, cmd) {
        let serverBoostEmoji = await message.guild.emojis.cache.find(emoji => emoji.name === "serverboost2")
        if (!(serverBoostEmoji)) {
            serverBoostEmoji = "[*]"
        }

        this.props.thumbnail = `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png`
        this.props.description = `**${message.guild.name}**`

        if (message.guild.features.length > 0) {
            this.props.description += "\n"
            this.props.description += "*Features*" + "\n" + '`'
            this.props.description += message.guild.features.join("`, `")
            this.props.description += '`'
        }

        this.props.fields = []

        let serverLevel = "0"
        if (message?.guild?.premiumTier && message.guild.premiumTier.toUpperCase() != "NONE") {
            serverLevel = message.guild.premiumTier
            if (message.guild.premiumTier > 0) {
                serverLevel = `${serverBoostEmoji}`.repeat(message.guild.premiumTier)
            }
        }

        this.props.fields.push(
            {
                name: "Owner",
                value: message?.guild?.ownerId && message.guild.ownerId != "undefined" ? `<@${message.guild.ownerId}>` : "???",
                inline: true
            },
            {
                name: "Members",
                value: message?.guild?.memberCount ? message.guild.memberCount.toString() : "???",
                inline: true
            },
            {
                name: "Server Level",
                value: serverLevel,
                inline: true
            },
            {
                name: "Partnered",
                value: message.guild.partnered ? "🟢" : "🔴",
                inline: true
            },
            {
                name: "Verified",
                value: message.guild.verified ? "🟢" : "🔴",
                inline: true
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: true
            }
        )

        if (message?.guild?.vanityURLCode && message.guild.vanityURLCode != "") {
            let vanityURL = "https://discord.gg/" + message.guild.vanityURLCode
            this.props.fields.push(
                {
                    name: "Vanity URL",
                    value: `[${message.guild.vanityURLCode}](${vanityURL} '${vanityURL}')`
                }
            )
        }

        this.props.fields.push(
            {
                name: "Created",
                value: `<t:${Math.floor(message.guild.createdTimestamp / 1000)}:f>`,
            }
        )
    }

    async test(message, cmd) {
        this.run(message, [], cmd)
    }
}
