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
                description: "Purge messages",
                flags: {
                    user: "unapplicable"
                }
            }
        )
    }

    async action(client, message) {
        let props = {
            title: {
                text: "Purging messages..."
            },
            description: ""
        }

        let [ min, max ] = [ 1, 100 ]
        let duration = ""

        if(!this.inputData.args[0]) {
            this.error = true
            this.props.description = "Please specify a number of messages to delete."
            return
        } else if(isNaN(parseInt(this.inputData.args[0]))) {
            this.error = true
            this.props.description = `Please enter a real integer between ${min} and ${max}. '${this.inputData.args[0]}' given.`
            return
        } else if(parseInt(this.inputData.args[0]) > max) {
            this.inputData.args[0] = max
        } else if(parseInt(this.inputData.args[0]) < min) {
            this.inputData.args[0] = min
        }

        if(props.description == "") {
            await message.channel.messages.fetch(
                {
                    limit: this.inputData.args[0]
                }
            ).then(
                messages => {
                    message.channel.bulkDelete(messages)
                }
            )
            this.props.description = `Purging ${this.inputData.args[0]} messages.`
            duration = "5s"
        }

        this.null = true
        // We'll handle sending it
        // SELFHANDLE: .then()
        await this.send(message, new SlimEmbed({...props})).then(
            msg => {
                setTimeout(() => msg.delete(), ms(duration))
            }
        )
    }
}
