//FIXME: Unused?

/*

Command for Bot Devs only

BaseCommand
 VillainsCommand
  BotDevCommand

*/

const VillainsCommand = require('./vcommand.class');
const VillainsEmbed = require('./vembed.class');

module.exports = class BotDevCommand extends VillainsCommand {
    constructor(comprops = {}, props = { title: {}, description: "" }) {
        super(comprops)
        this.props = props

        if (comprops?.extensions) {
            for (let extension of comprops.extensions) {
                let key = extension + "Model"
                let inc = "../../models/" + extension + "Schema"
                if (extension == "levels") {
                    key = "Levels"
                    inc = "discord-xp"
                } else if (extension == "xpboost") {
                    key = "XPBoostModel"
                }
                this[key] = require(inc)
            }
        }
    }

    async action(client, message, args) {
        // do nothing; command overrides this
        if(APPROVED_USERIDS) {
            // do the action
        } else {
            // describe the action
        }
    }

    async build(client, message, args) {
        this.action(client, message, args)
    }

    async run(client, message, args) {
        let APPROVED_USERIDS = [
            "263968998645956608", // Mike
            "532192409757679618", // Noongar
            "692180465242603591" // PrimeWarGamer
        ]

        if(!APPROVED_USERIDS) {
            this.props.title.text = "Error"
            this.props.description = `Sorry only ` +
            `**MikeTrethewey**,` +
            `**Noongar1800** or ` +
            `**PrimeWarGamer**` +
            ` can run this command 😔`
        } else {
            this.build(client, message, args)
        }

        let embed = new VillainsEmbed(this.props)

        await message.channel.send(embed)
    }
}//FIXME: Doesn't work for only the ID's listed
