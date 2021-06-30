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
            caption: {
                text: "Bonk"
            },
            title: {},
            description: "",
            players: {
                user: {},
                target: {}
            }
        }

        //FIXME: getTarget()
        const user = message.author
        const target = message.mentions.members.first()
        const loaded = target ? target.user : user
        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        if (loaded?.bot && loaded.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }

        if (props.title.text != "Error") {
            if (target) {
                props.players.target = {
                    name: target.username,
                    avatar: target.user.displayAvatarURL({ format: "png", dynamic: true })
                }
            }

            props.description = `${message.author} just bonked <@${loaded.id}>🔨`
        }

        let embed = new SlimEmbed(props)
        await super.send(message, embed)
    }
}
