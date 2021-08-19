// @ts-check

const VillainsCommand = require('./vcommand.class');

/**
 * @class
 * @classdesc Build a Command for Helpline Tickets
 * @this {TicketCommand}
 * @extends {VillainsCommand}
 * @public
 */
module.exports = class TicketCommand extends VillainsCommand {
    /**
     * @type {Array.<string>} List of emojis for use in Game Commands
     * @private
     */
    #emojis;

    /**
     * Constructor
     * @param {Object.<string, any>} comprops List of command properties from child class
     */
    constructor(comprops = {}) {
        // Create a parent object
        super(
            {...comprops}
        )

        // Set default emojis
        // Lock/Delete
        this.emojis = comprops?.emojis ? comprops.emojis : [ "🔒", "⛔" ];
        // Set parentID, default to General Tickets category on Villains Esports server
        this.parentID = comprops?.parentID ? comprops.parentID : "828158895024766986"
    }

    /**
     * Get emojis
     *
     * @returns {Array.<string>} List of emoji shortcuts
     */
    get emojis() {
        return this.#emojis;
    }
    /**
     * Set emojis
     *
     * @param {Array.<string>} emojis List of emoji shortcuts to set
     */
    set emojis(emojis) {
        this.#emojis = emojis
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
            for (let emoji of this.emojis) {
                await reactionMessage.react(emoji)
            }
        } catch (err) {
            // Bail if we couldn't initialize reacts
            channel.send("Error sending emojis!")
            throw err;
        }

        // Create a Collector
        //TODO: Figure out what this hasPermission() and {dispose} actually do
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
                case this.emojis[0]:
                    channel.send("Locking channel!");
                    channel.updateOverwrite(message.author, { SEND_MESSAGE: false });
                    break;
                // Delete channel
                case this.emojis[1]:
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
