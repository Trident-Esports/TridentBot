const VillainsCommand = require('./vcommand.class');
const fs = require('fs');

module.exports = class GameCommand extends VillainsCommand {
    constructor(comprops = {}) {
        super(comprops)
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
        this.errors = JSON.parse(fs.readFileSync("game/dbs/errors.json", "utf8"))
    }
}
