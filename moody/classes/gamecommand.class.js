const { BaseCommand } = require('a-djs-handler');

module.exports = class GameCommand extends BaseCommand {
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
