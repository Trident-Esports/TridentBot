const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');

module.exports = class TestCommand extends VillainsCommand {
    constructor() {
        super({
            name: "test",
            category: "diagnostic",
            description: "This is a test command"
        })
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: this.name.charAt(0).toUpperCase() + this.name.slice(1)
            },
            description: this.description
        }

        let foundHandles = await this.getArgs(message, args)
        if (foundHandles.loaded) {
            props.description = `<@${foundHandles.loaded.id}>`
        }
        console.log(foundHandles)

        let embed = new VillainsEmbed(props)
        await super.send(message, embed)
    }
}
