const ModCommand = require('../../classes/modcommand.class');
const SlimEmbed = require('../../classes/vslimbed.class');

const fs = require('fs');
const ms = require('ms');

// ModCommand
module.exports = class PurgeCommand extends ModCommand {
    constructor() {
        super(
            {
                name: "purge",
                category: "mod",
                description: "Purge messages"
            }
        )
    }

    async action(client, message, args) {
        let props = {
            title: {
                text: "Purging messages..."
            },
            description: ""
        }

        let [ min, max ] = [ 1, 100 ]
        let duration = ""

        if(!args[0]) {
            this.error = true
            props.description = "Please specify a number of messages to delete."
            return
        } else if(isNaN(parseInt(args[0]))) {
            this.error = true
            props.description = `Please enter a real integer between ${min} and ${max}. '${args[0]}' given.`
            return
        } else if(parseInt(args[0]) > max) {
            args[0] = max
        } else if(parseInt(args[0]) < min) {
            args[0] = min
        }

        if(props.description == "") {
            await message.channel.messages.fetch(
                {
                    limit: args[0]
                }
            ).then(
                messages => {
                    message.channel.bulkDelete(messages)
                }
            )
            props.description = `Purging ${args[0]} messages.`
            duration = "5s"
        }

        // We'll handle sending it
        // SELFHANDLE: .then()
        let embed = new SlimEmbed(props)
        await message.channel.send(embed).then(
            msg => {
                setTimeout(() => msg.delete(), ms(duration))
            }
        )
        this.null = true
    }
}
