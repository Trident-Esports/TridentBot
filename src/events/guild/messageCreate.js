//@ts-check

const VillainsEmbed = require('../../classes/embed/vembed.class')
const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

module.exports = class MessageCreateEvent extends VillainsEvent {
    // messageCreate
    constructor(context) {
        super(context)
    }

    async run(message) {
        const handler = message.client
        // Check Prefix
        if (message.content.slice(0,handler.options.defaultPrefix.length) !== handler.options.defaultPrefix) {
            // Special Cases

            // Hi
            for (let check of [
              "hello",
              "hi",
              "hey"
            ]) {
                if (message.content.toLowerCase() === check) {
                    if (message.author.bot) return;
                        else message.channel.send(`Hello there, <@${message.author.id}>!`);
                }
            }

            // LOL
            let blacklist = {
                guildIDs: [
                    "788021898146742292"  // Villains Esports
                ]
            }
            if (message.content.toLowerCase().includes('lol')) {
                if (
                  message.author.bot ||
                  (blacklist.guildIDs.includes(message.guild.id))
                ) {
                    return
                }
                // message.channel.send('https://i.kym-cdn.com/photos/images/newsfeed/002/052/362/aae.gif');
            }

            // No Special Case
            return
        } else if (message.content.trim() == handler.options.defaultPrefix.trim()) {
            // Message is only prefix
            let props = {
                caption: { text: handler.client.user.username },
                title: { text: "Error" },
                description: "Please send a proper command."
            }
            message.channel.send(new VillainsEmbed({...props}))
            return;
        }
    }
}
