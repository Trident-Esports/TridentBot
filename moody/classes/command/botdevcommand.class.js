//FIXME: Unused?

/*

Command for Bot Devs only

BaseCommand
 VillainsCommand
  BotDevCommand

*/

const VillainsCommand = require('./vcommand.class');
const VillainsEmbed = require('./vembed.class');
const fs = require('fs');

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
        let USERIDS = JSON.parse(fs.readFileSync("./dbs/userids.json", "utf8"))

        /*

        Mike
        Noongar
        Prime

        */

        if(USERIDS.botDevs.indexOf(message.author.id) == -1) {
            this.error = true
            this.props.description = this.errors.botDevOnly.join("\n")
        } else {
            this.build(client, message, args)
        }

        let embed = new VillainsEmbed(this.props)

        await message.channel.send(embed)
    }
}
