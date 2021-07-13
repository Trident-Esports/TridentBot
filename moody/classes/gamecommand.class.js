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
                // [key, path] = await this.db_key(extension)
                let key = extension + "Model"
                let path = "../../models/" + extension + "Schema"
                if (extension == "levels") {
                    key = "Levels"
                    path = "discord-xp"
                } else if (extension == "xpboost") {
                    key = "XPBoostModel"
                }
                this[key] = require(path)
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

    async db_key(extension) {
        let key = extension + "Model"
        let path = "../../models/" + extension + "Schema"
        if (extension.indexOf("level") > -1) {
            key = "Levels"
            path = "discord-xp"
        } else if (extension == "xpboost") {
            key = "XPBoostModel"
        }
        return [key, path]
    }

    async db_query(userID, model) {
        let pieces = await this.db_key(model)
        model = pieces[0]
        if (model == "Levels") {
            return await this[model].fetch(userID, 1)
        } else {
            let payload = {}
            if (typeof userID === "object") {
                payload = userID
            } else {
                payload = { userID: userID }
            }
            return await this[model].findOne(payload)
        }
    }

    async db_transform(userID, type, amount) {
        let amounts = {}
        let method = "$inc"
        if (typeof type === "object") {
            amounts = type
        } else {
            switch(type) {
                case "wallet":
                    type = "gold";
                    break;
            }
            amounts[type] = amount
        }

        for (let [thisType, thisAmount] of Object.entries(amounts)) {
            let model = ""
            switch(thisType) {
                case "gold":
                case "bank":
                case "minions":
                    model = "profile";
                    break;
            }
            let pieces = await this.db_key(model)
            model = pieces[0]
            if (model != "") {
                let operation = {}
                operation[thisType] = thisAmount
                let payload = {}
                payload[method] = operation
                await this[model].findOneAndUpdate(
                    { userID: userID },
                    payload
                )
            }
        }
    }
}
