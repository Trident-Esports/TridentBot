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

        let defaultToUser = false // true: Default to User; false: Default to Target

        /*
        User:   Invalid
        Target: Valid
        Bot:    Invalid
        */
        const user = message.author
        const target = message.mentions.members.first()

        let loaded = null
        if (defaultToUser) {
            // Default to User; use Target if Target
            loaded = target ? target.user : user
        } else {
            // Use Target
            loaded = target ? target.user : null
        }
        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        // No target loaded
        if (!loaded) {
            props.title.text = "Error"
            props.description = `You need to mention a user to ${props.caption.text}.`
        }

        // Can't target Bot
        if (loaded?.bot && loaded.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }

        // Can't target Self
        if (loaded?.id && (loaded.id === user.id)) {
            props.title.text = "Error"
            props.description = "You can't target yourself!"
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
