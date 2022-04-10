//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const VillainsEmbed = require('../../classes/embed/vembed.class')
const AsciiTable = require('ascii-table')
const fs = require('fs')

// Member Join
module.exports = class GuildMemberMoveEvent extends VillainsEvent {
    constructor(eventName) {
        super(eventName)
        this.channelName = "welcome"
    }

    async run(client, member) {
        const Table = new AsciiTable("", {})
        if (!(fs.existsSync(`./src/dbs/${member.guild.id}`))) {
            Table.addRow(
                `Guild Member ` + (this.name.includes("Add") ? "Add" : "Remove"),
                `Guild Profile for '${member.guild.name}' (ID:${member.guild.id}) not found!`
            )
            console.log(Table.toString())
            return
        }

        const channel = await this.getChannel(member, "welcome")

        // Message Channels
        let ROLES = JSON.parse(fs.readFileSync(`./src/dbs/${member.guild.id}/roles.json`, "utf8"))
        let welcomeRole = {}
        if (this.name.includes("Add")) {
            // Add Minion Role
            welcomeRole = ROLES.member;
            welcomeRole = await member.guild.roles.cache.find(role => role.name === welcomeRole);
            if (welcomeRole?.id) {
                member.roles.add(welcomeRole.id);
            }
        }

        let msg = this.name.includes("Add") ? "---MEMBER JOIN->>🟢" : "<<-MEMBER LEAVE---🔴"
        Table.setTitle(msg).setTitleAlignLeft()
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

        if (this.name.includes("Add")) {
            Table.addRow(
                "Member Role",
                (
                  welcomeRole?.id ?
                    "Exists" :
                    "Does not exist"
                ),
                `(Str:${ROLES.member}, ID:${welcomeRole?.id ? welcomeRole.id : "???"})`
            )
        }

        Table.addRow(
            (this.name.includes("Add") ? "Welcome" : "Leave") + " Channel",
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

        let RULES_CHANNEL = await this.getChannel(member, "rules")
        if (this.name.includes("Add")) {
            Table.addRow(
                "Rules Channel",
                (
                  RULES_CHANNEL
                  ?
                    `Yes` :
                    "No"
                ),
                (
                  RULES_CHANNEL
                  ?
                    `(ID:${RULES_CHANNEL.id})` :
                    ""
                )
            )

            if (!(RULES_CHANNEL)) {
                console.log(Table.toString())
                return
            }
        }

        if (channel) {
            try {
                if (this.name.includes("Add")) {
                    let rules = [
                        // Put into guild profile document
                        // <@${member.user.id}> -> %%user%%
                        // ${member.guild.name} -> %%guild%%
                        // ${RULES_CHANNEL.toString()} -> %%rulesChannel%%
                        `Welcome <@${member.user.id}> to **${member.guild.name}**.`,
                        "",
                        RULES_CHANNEL ? `Please Read and Accept our ${RULES_CHANNEL.toString()}. This will provide access to the server.` : "",
                    ]
                    let props = {
                        title: `Welcome to ${member.guild.name}`,
                        description: rules.join("\n")
                    }
                    // @ts-ignore
                    // await channel.send({ embeds: [embed] }); // discord.js v13
                    await channel.send(new VillainsEmbed({...props}));
                } else if (this.name.includes("Remove")) {
                    // Put into guild profile document
                    // <@${member.user.id}> -> %%user%%
                    let rules = [
                        `<@${member.id}> has just become a **Hero**.`
                    ]
                    // @ts-ignore
                    // await channel.send({ content: rules.join("\n") }) // discord.js v13
                    await channel.send(rules.join("\n"))
                }
            } catch (err) {
                throw (err);
            }
        }
    }
}
