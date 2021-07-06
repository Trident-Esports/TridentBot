const { BaseEvent } = require('a-djs-handler')
const fs = require('fs')

// Member Join
module.exports = class GuildMemberLeaveEvent extends BaseEvent {
    constructor() {
        super('guildMemberLeave')
    }

    //FIXME: Make Guild Member Leave text
    async run(handler, member) {
        let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
        // Add Minion Role
        let welcomeRole = ROLES.member;
        welcomeRole = member.guild.roles.cache.find(role => role.name === welcomeRole);
        if (welcomeRole?.id) {
            member.roles.add(welcomeRole.id);
        }
        // console.log(member) // If You Want The User Info in Console Who Joined Server Then You Can Add This Line. // Optional

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
        let thumbnail = "https://cdn.discordapp.com/icons/788021898146742292/a_20e3a201ee809143ac5accdf97abe607.gif"
        let footer = {
            "image": "https://cdn.discordapp.com/icons/788021898146742292/a_20e3a201ee809143ac5accdf97abe607.gif",
            "msg": "This bot was Created by Noongar1800#1800"
        }
        try {
            let rules = [
                `Welcome <@${member.user.id}> to **${member.guild.name}**.`,
                "**Are you ready to become a Super Villain?**",
                "",
                `Please Read ${member.guild.channels.cache.get(channelIDs[member.guild.id].rules).toString()}.`,
                "",
                `Also to access the server channels, please go to ${member.guild.channels.cache.get(channelIDs[member.guild.id].roles).toString()}.`
            ]
            const embed = new MessageEmbed()
                .setTitle(`Welcome To ${member.guild.name}`)
                .setThumbnail(thumbnail)
                .setDescription(rules.join("\n"))
                .setFooter(footer["msg"], footer["image"])
                .setColor('RANDOM')

            // return channel.send(embed);
        }
        catch (err) {
           throw (err);
        }
    }
}
