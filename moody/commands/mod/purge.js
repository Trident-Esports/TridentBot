const { BaseCommand } = require('a-djs-handler');
const SlimEmbed = require('../../classes/vslimbed.class');

const fs = require('fs');
const ms = require('ms');

// ModCommand
module.exports = class PurgeCommand extends BaseCommand {
    constructor() {
        super({
            name: "purge",
            category: "mod",
            description: "Purge messages"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Purging messages..." },
            description: ""
        }

        let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
        let APPROVED_ROLES = ROLES["admin"]
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
                props.description = `Purging ${args[0]} messages.`
                duration = "5s"
            }
        }

        let embed = new SlimEmbed(props)
        await message.channel.send(embed)
            .then(msg => {
                setTimeout(() => msg.delete(), ms(duration))
            })
            
    } 
}
