const { BaseEvent } = require('a-djs-handler')

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super('message')
    }

    async run(handler, message) {
        if (message.content.slice(0,handler.options.prefix.length) !== handler.options.prefix) {
            return
        }

        // Get Args
        const args = message.content.slice(handler.options.prefix.length).split(/ +/);

        // Get Command
        const cmd = args.shift().toLowerCase();

        // Search for Command
        const command = handler.client.commands.get(cmd) || handler.client.commands.find(a => a.aliases && a.aliases.includes(cmd));

        if (!(command?.name)) {
            // Didn't find a name for submitted Command
            console.log(`No name found for command! '${cmd}' given.`)
            console.log(command)
            return
        }

        if (typeof command.run === "function") {
            // If it's a a-djs-style func, run it
            let adjs = new command.constructor()
            adjs.run(handler.client, message, args)
        }
    }
}
