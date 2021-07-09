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

    async db_query(userID, model) {
        switch(model) {
            case "profile":
                model = "profileModel";
                break;
        }
        return await this[model].findOne(
            { userID: userID }
        )
    }

    async db_transform(userID, type, amount) {
        let amounts = {}
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
                    model = "profileModel";
                    break;
            }
            if (model != "") {
                let inc = {}
                inc[thisType] = thisAmount
                await this[model].findOneAndUpdate(
                    { userID: userID },
                    { $inc: inc }
                )
            }
        }
    }
}
