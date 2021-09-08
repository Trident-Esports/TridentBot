//@ts-check

const { Channel, Message } = require('discord.js');
const { BaseEvent } = require('a-djs-handler');
const fs = require('fs')

module.exports = class VillainsEvent extends BaseEvent {
    /**
     * @class
     * @classdesc Build a Villains-branded Event
     * @this {VillainsEvent}
     * @extends {BaseEvent}
     * @public
     */
    /**
     * Get channel object to send data to
     * @param {Message} message Message that called the event
     * @param {string} channelType Channel type sought
     * @returns {Promise.<Channel>}
     */
    async getChannel(message, channelType) {
        let channelIDs = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/channels.json","utf8"))
        let channelID = ""
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
        if (typeof channelID == "string") {
            channel = message.guild.channels.cache.find(c => c.name === channelID);
        } else {
            // Else, search for a numbered channel
            channel = message.guild.channels.cache.find(c => c.id === channelID);
        }

        return channel
    }

    async run(handler, ...args) {
        return
    }
}