const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');

const fs = require('fs');

module.exports = class RulesCommand extends VillainsCommand {
    constructor() {
        super({
            name: "rules",
            category: "meta",
            description: "Rules to follow"
        })
    }

    async run(client, message, args) {
        let props = {
            title: { text: "Rules" },
            fields: []
        }

        let rules = JSON.parse(fs.readFileSync("commands/dbs/rules.json", "utf8"))
        for(let rule in rules) {
            props.fields.push({
                name: "Rule " + (parseInt(rule) + 1),
                value: "`" + rules[rule] + "`"
            })
        }

        let embed = new VillainsEmbed(props)
        await super.send(message, embed)
    }
}
