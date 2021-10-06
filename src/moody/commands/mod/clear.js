//@ts-check

const { BaseCommand } = require('a-djs-handler');
const SlimEmbed = require('../../classes/embed/vslimbed.class');
const fs = require('fs');
const ms = require('ms');

// ModCommand
module.exports = class ClearCommand extends BaseCommand {
    constructor() {
        super({
            name: "clear",
            aliases: [ "cls" ],
            category: "mod",
            description: "Clear messages"
        })
    }

    async run(client, message, args) {
        if (message.channel.name != "testsuite-channel") { return }
        let props = {
            title: { text: "Clearing messages..." },
            description: ""
        }

        let ROLES = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/roles.json", "utf8"))
        let APPROVED_ROLES = ROLES["admin"].concat(ROLES["mod"])
        let duration = ""

        if(!(await message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name))) ) {
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

    }
}
