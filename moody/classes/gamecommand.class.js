/*

Command that conditionally loads extensions for MongoDB

BaseCommand
 VillainsCommand
  GameCommand

*/

const VillainsCommand = require('./vcommand.class');
const fs = require('fs');

module.exports = class GameCommand extends VillainsCommand {
    #emojis; // Private: Emojis

    //FIXME: If this.category is "premium" do special handling
    constructor(comprops = {}, props = {}) {
        // Create a parent object
        super({...comprops}, {...props})
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
        this.emojis = JSON.parse(fs.readFileSync("game/dbs/emojis.json", "utf8"));
    }

    get emojis() {
        return this.#emojis
    }
    set emojis(emojis) {
        this.#emojis = emojis
    }
}
