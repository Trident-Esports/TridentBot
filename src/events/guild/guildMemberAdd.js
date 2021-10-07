//@ts-check

const VillainsEmbed = require('../../classes/embed/vembed.class')
const VillainsEvent = require('../../classes/event/vevent.class')
const AsciiTable = require('ascii-table')
const fs = require('fs')

// Member Join
module.exports = class GuildMemberAddEvent extends VillainsEvent {
    // guildMemberAdd
    constructor(context) {
        super(context)
        this.channelName = "welcome"
    }

    async run(client, member) {
        const Table = new AsciiTable("", {})
        if (!(fs.existsSync("./src/dbs/" + member.guild.id))) {
            Table.addRow(
                `Guild Member Add`,
                `Guild Profile for '${member.guild.name}' (ID:${member.guild.id}) not found!`
            )
            console.log(Table.toString())
            return
        }
        const channel = await this.getChannel(member, "welcome")

        // Message Channels
        let ROLES = JSON.parse(fs.readFileSync(`./src/dbs/${member.guild.id}/roles.json`, "utf8"))
        // Add Minion Role
        let welcomeRole = ROLES.member;
        welcomeRole = await member.guild.roles.cache.find(role => role.name === welcomeRole);
        if (welcomeRole?.id) {
            member.roles.add(welcomeRole.id);
        }

        // @ts-ignore
        Table.setTitle("---MEMBER JOIN->>🟢").setTitleAlignLeft()
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
            "Member Role",
            (
              welcomeRole?.id ?
                "Exists" :
                "Does not exist"
            ),
            `(Str:${ROLES.member}, ID:${welcomeRole?.id ? welcomeRole.id : "???"})`
        )
            .addRow(
                "Welcome Channel",
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

        if (!(channel)) {
            console.log(Table.toString())
            return
        }

        let RULES_CHANNEL = await this.getChannel(member, "rules")

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

        console.log(Table.toString())

        try {
            let rules = [
                // Put into guild profile document
                // <@${member.user.id}> -> %%user%%
                // ${member.guild.name} -> %%guild%%
                // ${RULES_CHANNEL.toString()} -> %%rulesChannel%%
                `Welcome <@${member.user.id}> to **${member.guild.name}**.`,
                "",
                `Please Read and Accept our ${RULES_CHANNEL.toString()}. This will provide access to the server.`,
            ]
            let props = {
                title: `Welcome to ${member.guild.name}`,
                description: rules.join("\n")
            }

            // @ts-ignore
            // await channel.send({ embeds: [embed] }); // discord.js v13
            await channel.send(new VillainsEmbed({...props}));
        } catch (err) {
            console.log(err);
        }
    }
}
