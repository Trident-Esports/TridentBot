const VillainsCommand = require('../../classes/vcommand.class')
const VillansEmbed = require('../../classes/vembed.class')
const fs = require('fs')

module.exports = class HelpCommand extends VillainsCommand {
    constructor() {
        super({
            name: "help",
            category: "information",
            description: "Bot Help"
        })
    }

    async action(client, message) {
        this.props.description = [
            `This is a list of the commands and help for VillainsBot.`,
            `If you would like a list of commands for the MiniGame please type \`${this.prefix}gamehelp\``
        ]
        let helpData = JSON.parse(fs.readFileSync("./dbs/help.json", "utf8"))

        let scope = "all"
        let search = {
            "term": null,
            "single": null
        }

        if(this.inputData.args) {
            if(this.inputData.args[0]) {
                search["term"] = this.inputData.args[0]
                if(this.inputData.args[1]) {
                    search["term"] = this.inputData.args[1]
                    search["single"] = this.inputData.args[1]
                }
            }
        }

        if(search.term) {
            if(Object.keys(helpData).indexOf(search.term) !== -1) {
                let key = search.term
                helpData = {
                    key: helpData[key]
                }
                scope = "section"
            } else {
                for(let [section, commands] of Object.entries(helpData)) {
                    if(Object.keys(commands.commands).indexOf(search.term) !== -1) {
                        let key = section
                        helpData = {
                            key: helpData[key]
                        }
                        scope = "single"
                    }
                }
            }
        }

        for(let [section, sectionAttrs] of Object.entries(helpData)) {
            this.props.fields = []
            this.props.fields.push(
                {
                    name: `**${sectionAttrs.section}**`,
                    value: sectionAttrs.help
                }
            )
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                if((["all", "section"].indexOf(scope) > -1) || (scope == "single" && command == search.term)) {
                    let value = `_${commandAttrs.help.join("\n")}_`
                    if("aliases" in commandAttrs) {
                        value += "\n"
                        value += `[Aliases: \`${commandAttrs.aliases.join("\`, \`")}\`]`
                    }
                    this.props.fields.push(
                        {
                            name: `\`${this.prefix}${command}\``,
                            value: value
                        }
                    )
                }
            }
            this.pages.push(new VillansEmbed(this.props))
        }
    }
}
