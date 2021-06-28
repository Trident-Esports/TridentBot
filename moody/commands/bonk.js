const VillainsCommand = require('../classes/vcommand.class');
const SlimEmbed = require('../classes/vslimbed.class');

module.exports = class BonkCommand extends VillainsCommand {
    constructor() {
        super({
            name: "bonk",
            category: "fun",
            description: "Bonk!"
        })
    }

    async run(client, message, args) {
        let props = {
            title: {},
            description: ""
        }

        //FIXME: getTarget()
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) {
            props.title.text = "Error"
            props.description = `User not found. '${args.join(" ")}' given.`
        } else {
            props.description = `${message.author} just bonked ${user}🔨`
        }

        let embed = new SlimEmbed(props)
        await super.send(message, embed)
    }
}
