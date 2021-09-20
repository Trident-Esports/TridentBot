//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');

module.exports = class RulesCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "rules",
            group: "meta",
            memberName: "rules",
            description: "Rules to follow"
        }
        super(
            client,
            {...comprops}
        )
    }

    async action(message) {
        this.props.fields = []
        let rules = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/rules.json", "utf8"))

        if (!rules) {
            this.error = true
            this.props.description = "Failed to get Rules data."
            return
        }

        this.props.description = rules.join("\n")
    }
}
