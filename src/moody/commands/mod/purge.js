//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const SlimEmbed = require('../../classes/embed/vslimbed.class');
const fs = require('fs');
const ms = require('ms');

// ModCommand
module.exports = class PurgeCommand extends VillainsCommand {
    constructor(client) {
        super(
            client,
            {
                name: "purge",
                group: "mod",
                memberName: "purge",
                description: "Purge messages",
                guildOnly: true,
                ownerOnly: true
            }
        )
    }

    async run(message, args) {
        let props = {
            title: { text: "Purging messages..." },
            description: ""
        }

        let ROLES = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/roles.json", "utf8"))
        let APPROVED_ROLES = ROLES["admin"].concat(ROLES["mod"])
        let [ min, max ] = [ 1, 100 ]
        let duration = ""

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
            this.error = true
            props.title.text = "Error"
            props.description = "Sorry, only admins can run this command. 😔"
        } else {
            if(!args[0]) {
                props.description = "Please specify a number of messages to delete."
            } else if(isNaN(parseInt(args[0]))) {
                props.description = `Please enter a real integer between ${min} and ${max}. '${args[0]}' given.`
            } else if(parseInt(args[0]) > max) {
                args[0] = max
            } else if(parseInt(args[0]) < min) {
                args[0] = min
            }

            if(props.description == "") {
                await message.channel.messages.fetch( {
                    limit: args[0]
                })
                    .then(messages => {
                        message.channel.bulkDelete(messages)
                    })
                duration = "5s"
                props.description = `Purging ${args[0]} messages in ${duration}.`
            }
        }

        let embed = new SlimEmbed(props)
        // await message.channel.send({ embeds: [embed] }) // discord.js v13
        await message.channel.send(embed)
            .then(msg => {
                setTimeout(() => msg.delete(), ms(duration))
            })

    }
}
