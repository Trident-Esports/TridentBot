const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class BonkCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "bonk",
            category: "fun",
            description: "Bonk!",
            flags: {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        }
        super(comprops)
    }

    async action(client, message) {
        const loaded = this.inputData.loaded

        this.props.description = `<@${message.author.id}> just bonked <@${loaded.id}>🔨`
    }
}
