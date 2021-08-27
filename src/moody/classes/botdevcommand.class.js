//FIXME: Unused?

/*

Command for Bot Devs only

BaseCommand
 VillainsCommand
  BotDevCommand

*/
const VillainsCommand = require('./vcommand.class');

const fs = require('fs');

module.exports = class BotDevCommand extends VillainsCommand {
    #USERIDS; // Private: USERIDS

    constructor(comprops = {}, props = { title: {}, description: "" }) {
        // Create a parent object
        super(
            {...comprops},
            {...props}
        )

        // Load requested extensions
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

        // Get botdev-defined list of userids of BotDevs
        this.USERIDS = JSON.parse(fs.readFileSync("./dbs/userids.json", "utf8")).botDevs

        // Bail if we fail to get UserIDs list
        if (!(this.USERIDS)) {
            this.USERIDS = { botDevs: [], botWhite: [] }
            this.error = true
            this.props.description = "Failed to get UserIDs list."
            return
        }
    }

    get USERIDS() {
        return this.#USERIDS
    }
    set USERIDS(USERIDS) {
        this.#USERIDS = USERIDS
    }

    async build(client, message, args) {
        // Bail if not valid UserID
        if(this.USERIDS.indexOf(message.author.id) == -1) {
            this.error = true
            this.props.description = this.errors.botDevOnly.join("\n")
            return
        } else {
            await this.action(client, message, args)
        }
    }
}
