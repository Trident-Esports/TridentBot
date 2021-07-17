/*

BaseCommand
 VillainsCommand
  TicketCommand

*/

const VillainsCommand = require('./vcommand.class');

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
        this.parentID = comprops?.parentID ? comprops.parentID : "828158895024766986"
    }

    get emoji() {
        return this.#emoji;
    }
    set emoji(emoji) {
        this.#emoji = emoji
    }

    async action(client, message) {
        // Create Ticket Channel
        const channel = await message.guild.channels.create(`ticket: ${message.author.tag}`)

        // Set the parent channel
        channel.setParent(this.parentID)
        // Set guild privs
        channel.updateOverwrite(
            message.guild.id,
            {
                SEND_MESSAGE: false,
                VIEW_CHANNEL: false
            }
        )
        // Set author privs
        channel.updateOverwrite(
            message.author,
            {
                SEND_MESSAGE: true,
                VIEW_CHANNEL: true
            }
        )

        // Send Welcome Message to Ticket Channel
        const reactionMessage = await channel.send("Thank you for contacting support!")

        try {
            for (let emoji of this.emoji) {
                await reactionMessage.react(emoji)
            }
        } catch (err) {
            channel.send("Error sending emojis!")
            throw err;
        }

        // Create a Collector
        const collector = reactionMessage.createReactionCollector(
            (reaction, user) => message.guild.members.cache.find(
                (member) => member.id === user.id
            ).hasPermission("ADMINISTRATOR"),
            { dispose: true }
        )

        // Collector: Lock/Delete
        collector.on("collect", (reaction, user) => {
            switch (reaction.emoji.name) {
                // Lock channel
                case this.emoji[0]:
                    channel.send("Locking channel!");
                    channel.updateOverwrite(message.author, { SEND_MESSAGE: false });
                    break;
                // Delete channel
                case this.emoji[1]:
                    channel.send("Deleting this channel in 5 seconds!");
                    setTimeout(() => channel.delete(), 5000);
                    break;
            }
        })

        // Send channel link to origin channel
        // Delete this message
        // Delete user-sent message
        message.channel
            .send(`We will be right with you! ${channel}`)
            .then((msg) => {
                setTimeout(() => msg.delete(), 7000);
                setTimeout(() => message.delete(), 3000);
            })
            .catch((err) => {
                throw err;
            })
        this.null = true
    }
}