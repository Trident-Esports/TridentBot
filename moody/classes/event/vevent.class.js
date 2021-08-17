/**
 * @class
 * @classdesc Build a Villains-branded Event
 * @this {VillainsEvent}
 * @extends {BaseEvent}
 * @public
 */

const { BaseEvent } = require('a-djs-handler');
const fs = require('fs')

module.exports = class VillainsEvent extends BaseEvent {
    /**
     * Get channel object to send data to
     * @param {Message} message Message that called the event
     * @param {string} channelType Channel type sought
     * @returns {Channel}
     */
    async getChannel(message, channelType) {
        let channelIDs = JSON.parse(fs.readFileSync("./dbs/channels.json","utf8"))
        let channelID = 0
        let channel = null

        // Get channel IDs for this guild
        if (Object.keys(channelIDs).includes(message.guild.id)) {
            // If the channel type exists
            if (Object.keys(channelIDs[message.guild.id]).includes(channelType)) {
                // Get the ID
                channelID = channelIDs[message.guild.id][channelType]
            }
        }

        // If the ID is not a number, search for a named channel
        if (isNaN(channelID)) {
            channel = message.guild.channels.cache.find(c => c.name === channelID);
        } else {
            // Else, search for a numbered channel
            channel = message.guild.channels.cache.find(c => c.id === channelID);
        }

        return channel
    }
}
