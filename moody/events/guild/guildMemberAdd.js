const VillainsEmbed = require('../../classes/embed/vembed.class')
const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

//TODO: Move getChannel() to VillainsEvent
//TODO: Copy getChannel() to VillainsCommand

// Member Join
module.exports = class GuildMemberAddEvent extends VillainsEvent {
    constructor() {
        super('guildMemberAdd')
        this.channelName = "welcome"
    }

    async run(handler, member) {
        const channel = await this.getChannel(member, "welcome")

        // Message Channels
        let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
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
                const embed = new VillainsEmbed(props);

                await channel.send(embed);
            } catch (err) {
                throw (err);
            }
        }
    }
}
