const { BaseCommand } = require('a-djs-handler');
const SlimEmbed = require('../classes/vslimbed.class');

module.exports = class BonkCommand extends BaseCommand {
    constructor() {
        super({
            name: "bonk",
            category: "fun",
            description: "Bonk!"
        })
    }

    async run(client, message, args) {
        let props = {
            description: ""
        }

        //FIXME: getTarget()
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) {
            props.description = [
                "***Error***",
                `User not found. '${args.join(" ")}' given.`
            ].join("\n")
        } else {
            props.description = `${message.author} just bonked ${user}🔨`
        }

        let embed = new SlimEmbed(props)
        await message.channel.send(embed)
    }
}
