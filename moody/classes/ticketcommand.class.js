/*

BaseCommand
 VillainsCommand
  TicketCommand

*/

const VillainsCommand = require('./vcommand.class');
const VillainsEmbed = require('./vembed.class');
const fs = require('fs');

module.exports = class TicketCommand extends VillainsCommand {
    /*

    constructor(comprops = {}, props = {})
    run()
     build()
      action()
     send()

    */
    #emoji; // Private: Emojis to use
    constructor(comprops = {}) {
        // Create a parent object
        super(comprops)

        this.emoji = comprops?.emoji ? comprops.emoji : [ "🔒", "⛔" ];
    }

    get emoji() {
        return this.#emoji;
    }
    set emoji(emoji) {
        this.#emoji = emoji
    }

    async build(client, message) {
        // Delete user-sent message
        message.delete()

        if(!(this.error)) {
            this.action(client, message)
        }
    }

    async action(client, message) {
        let embed = new VillainsEmbed(this.props)

        if(!(this.error)) {
            this.null = true
            this.send(message, embed).then(async (msg) => {
                for (let emoji of this.emoji) {
                    await msg.react(emoji)
                }
            })
        }
    }
}
