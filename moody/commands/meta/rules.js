const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');

module.exports = class RulesCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "rules",
            category: "meta",
            description: "Rules to follow"
        }
        super(comprops)
    }

    async action(client, message) {
        this.props.fields = []
        let rules = JSON.parse(fs.readFileSync("./dbs/rules.json", "utf8"))
        for(let rule in rules) {
            this.props.fields.push({
                name: "Rule " + (parseInt(rule) + 1),
                value: "`" + rules[rule] + "`"
            })
        }
    }
}
