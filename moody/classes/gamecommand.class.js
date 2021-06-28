const VillainsCommand = require('./vcommand.class');

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
    }
}
