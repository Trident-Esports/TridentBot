//@ts-check

const VillainsEmbed = require('../../classes/embed/vembed.class')
const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

module.exports = class MessageCreateEvent extends VillainsEvent {
    constructor() {
        super('messageCreate')
    }

    async run(handler, message) {
        // Check Prefix
        if (message.content.slice(0,handler.options.prefix.length) !== handler.options.prefix) {
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
        } else if (message.content.trim() == handler.options.prefix.trim()) {
            // Message is only prefix
            let props = {
                caption: { text: handler.client.user.username },
                title: { text: "Error" },
                description: "Please send a proper command."
            }
            message.channel.send(new VillainsEmbed({...props}))
            return;
        }

        // Get Args
        const args = message.content.slice(handler.options.prefix.length).split(/ +/);

        // Get Command
        let cmd = args.shift().toLowerCase();

        // Search for Command
        let command = handler.client.commands.get(cmd) ||
            handler.client.commands.find(a => a.aliases && a.aliases.includes(cmd));

        let commands = cmd != "testsuite" ?
            [ command ] :
            handler.client.commands.filter(command => typeof command.test === "function").values()

        if (cmd == "testsuite") {
            if (message.channel.name != "testsuite-channel") { return }

            let GLOBALS = null
            const defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"))
            try {
                GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
                GLOBALS = (
                    GLOBALS?.profile &&
                    GLOBALS?.profiles &&
                    GLOBALS.profile in GLOBALS.profiles
                ) ?
                    GLOBALS.profiles[GLOBALS.profile]:
                    defaults
            } catch(err) {
                console.log("🔴VCommand: PROFILE manifest not found!")
                process.exit(1)
            }
            if (!(GLOBALS.DEV)) { return }

            if (args.length > 0) {
                commands = [
                    handler.client.commands.get(args[0]) ||
                    handler.client.commands.find(a => a.aliases && a.aliases.includes(args[0]))
                ]
            }
        }

        for(command of commands) {
            if (!(command?.name)) {
                // Didn't find a name for submitted Command
                console.log(`🟡No name found for command! '${cmd}' given.`)
                return
            }

            if (command) {
                if (cmd != "testsuite") {
                    if (typeof command.execute === "function") {
                        // If it's a discord.js-style func, execute it
                        command.execute(message, args, cmd)
                    } else if (typeof command.run === "function") {
                        // If it's a a-djs-style func, run it
                        let adjs = new command.constructor()
                        adjs.run(handler.client, message, args, null, cmd)
                    }
                } else {
                    if (typeof command.test === "function") {
                        // If it's got a test func, test it
                        let adjs = new command.constructor()
                        adjs.test(handler.client, message, args, null, cmd)
                    }
                }
            }
        }
    }
}
