const { BaseEvent } = require('a-djs-handler')
const fs = require('fs')
const VillainsEmbed = require('../../classes/vembed.class')

//TODO: Move getChannel() to VillainsEvent
//TODO: Copy getChannel() to VillainsCommand

// Member Join
module.exports = class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super('guildMemberAdd')
        this.channelName = "welcome"
    }

    async getChannel(message, channelType) {
        let channelIDs = JSON.parse(fs.readFileSync("./dbs/channels.json","utf8"))
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
            channel = message.guild.channels.cache.find(c => c.name === channelID);
        } else {
            // Else, search for a numbered channel
            channel = message.guild.channels.cache.find(c => c.id === channelID);
        }

        return channel
    }

    async run(handler, member) {
        const channel = await this.getChannel(member, "welcome")

        // Message Channels
        let ROLES = JSON.parse(fs.readFileSync("./dbs/roles.json", "utf8"))
        // Add Minion Role
        let welcomeRole = ROLES.member;
        welcomeRole = member.guild.roles.cache.find(role => role.name === welcomeRole);
        if (welcomeRole?.id) {
            member.roles.add(welcomeRole.id);
        }

        let consolePad = 20
        console.log("---")
        console.log("---MEMBER JOIN->>")
        console.log(
            "Guild:".padEnd(consolePad),
            `${member.guild.name} (ID:${member.guild.id})`
        )
        console.log(
            "Member:".padEnd(consolePad),
            `${member.user.username}#${member.user.discriminator} (ID:${member.user.id})`
        )
        console.log(
            "Member Role:".padEnd(consolePad),
            (
              welcomeRole?.id ?
                "Exists" :
                "Does not exist"
            ),
            `(Str:${ROLES.member}, ID:${welcomeRole?.id ? welcomeRole.id : "???"})`
        )
        console.log(
            "Welcome Channel:".padEnd(consolePad),
            (
              channel
              ?
                `Yes (ID:${channel.id})` :
                "No"
            )
        )

        if (channel) {
            let ROLES_CHANNEL = await this.getChannel(member, "roles")
            let RULES_CHANNEL = await this.getChannel(member, "rules")

            try {
                let rules = [
                    `Welcome <@${member.user.id}> to **${member.guild.name}**.`,
                    "**Are you ready to become a Super Villain?**",
                    "",
                    `Please Read ${RULES_CHANNEL.toString()}.`,
                    "",
                    `Also to access the server channels, please go to ${ROLES_CHANNEL.toString()}.`
                ]
                let props = {
                    title: "Welcome to ${member.guild.name}",
                    description: rules.join("\n")
                }

                await channel.send(new VillainsEmbed({...props}));
            } catch (err) {
                throw (err);
            }
        }
    }
}
