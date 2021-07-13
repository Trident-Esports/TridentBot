const { BaseEvent } = require('a-djs-handler')
const fs = require('fs')

// Member Join
module.exports = class GuildMemberRemoveEvent extends BaseEvent {
    constructor() {
        super('guildMemberRemove')
    }

    async run(handler, member) {
        // Message Channels
        const channelIDs = JSON.parse(fs.readFileSync("dbs/channels.json", "utf8"))

        let consolePad = 20
        console.log("---")
        console.log("<<-MEMBER LEAVE---")
        console.log(
            "Guild:".padEnd(consolePad),
            `${member.guild.name} (ID:${member.guild.id})`
        )
        console.log(
            "Member:".padEnd(consolePad),
            `${member.user.username}#${member.user.discriminator} (ID:${member.user.id})`
        )
        console.log(
            "Leave Channel:".padEnd(consolePad),
            (
              (
                (member.guild.id in channelIDs) &&
                (channelIDs[member.guild.id]?.welcome)
              ) ?
                `Yes (ID:${channelIDs[member.guild.id].welcome})` :
                "No"
            )
        )

        if (!(member.guild.id in channelIDs)) {
            return
        }

        const channel = member.guild.channels.cache.get(channelIDs[member.guild.id].welcome)
        try {
            let rules = [
                `<@${member.id}> Has just become a Hero.`
            ]
            return channel.send(rules.join("\n"))
        }
        catch (err) {
           throw (err);
        }
    }
}
