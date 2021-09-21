//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const SlimEmbed = require('../../classes/embed/vslimbed.class');
const BotActivityCommand = require('./botactivity');
const fs = require('fs');
const ms = require('ms');

// ModCommand
module.exports = class ClearCommand extends VillainsCommand {
    constructor(client) {
        super(
            client,
            {
                name: "clear",
                aliases: [ "cls" ],
                group: "mod",
                memberName: "clear",
                description: "Clear messages",
                guildOnly: true,
                ownerOnly: true
            }
        )
    }

    async run(message, args) {
        if (message.channel.name != "testsuite-channel") { return }
        if (typeof args != "object") {
            args = [args]
        }
        let props = {
            title: { text: "Clearing messages..." },
            description: ""
        }

        let ROLES = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/roles.json", "utf8"))
        let APPROVED_ROLES = ROLES["admin"].concat(ROLES["mod"])
        let duration = ""

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
            this.error = true
            props.title.text = "Error"
            props.description = "Sorry, only admins can run this command. 😔"
        } else {
            args[0] = 100

            if(props.description == "") {
                await message.channel.messages.fetch( {
                    limit: args[0]
                })
                    .then(messages => {
                        message.channel.bulkDelete(messages)
                    })
                duration = "5s"
                props.description = `Clearing ${args[0]} messages in ${duration}.`
            }
        }

        let embed = new SlimEmbed(props)
        // await message.channel.send({ embeds: [embed] }) // discord.js v13
        await message.channel.send(embed)
            .then(msg => {
                setTimeout(() => msg.delete(), ms(duration))
            })

        let dummy = new BotActivityCommand(message.client)
        await dummy.run(message, [])
            .then(msg => {
                setTimeout(() => msg.delete(), ms(duration))
            })
    }
}
