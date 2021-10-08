//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const AsciiTable = require('ascii-table')
const fs = require('fs')

// Member Join
module.exports = class GuildMemberRemoveEvent extends VillainsEvent {
    // guildMemberRemove
    constructor(context) {
        super(context)
    }

    async run(member) {
        const Table = new AsciiTable("", {})
        if (!(fs.existsSync("./src/dbs/" + member.guild.id))) {
            Table.addRow(
                `Guild Member Remove`,
                `Guild Profile for '${member.guild.name}' (ID:${member.guild.id}) not found!`
            )
            console.log(Table.toString())
            return
        }

        const channel = await this.getChannel(member, "welcome")

        // @ts-ignore
        Table.setTitle("<<-MEMBER LEAVE---🔴").setTitleAlignLeft()
            .addRow(
                "Guild",
                `${member.guild.name}`,
                `(ID:${member.guild.id})`
        )
            .addRow(
                "Member",
                `${member.user.username}#${member.user.discriminator}`,
                `(ID:${member.user.id})`
        )
            .addRow(
                "Leave Channel",
                (
                  channel
                  ?
                    `Yes` :
                    "No"
                ),
                (
                  channel
                  ?
                    `(ID:${channel.id})` :
                    ""
                )
        )
        console.log(Table.toString())

        if (channel) {
            try {
                // Put into guild profile document
                // <@${member.user.id}> -> %%user%%
                let rules = [
                    `<@${member.id}> has just become a **Hero**.`
                ]
                // @ts-ignore
                // await channel.send({ content: rules.join("\n") }) // discord.js v13
                await channel.send(rules.join("\n"))
            } catch (err) {
                throw (err);
            }
        }
    }
}
