const VillainsCommand = require('../../classes/command/vcommand.class')
const VillansEmbed = require('../../classes/embed/vembed.class')
const fs = require('fs')

module.exports = class EseaHelpCommand extends VillainsCommand {
    constructor() {
        super(
            {
                name: "eseahelp",
                aliases: [ 'eseah' ],
                category: "information",
                description: "Esea Bot Help"
            }
        )
    }

    async action(client, message) {
        this.props.description = [
            `This is a list of the commands and help for VillainsBot Events.`,
            `If you would like General or MiniGame Help use \`${this.prefix}help\` or \`${this.prefix}gamehelp\``
        ]
        let eseahelpData = JSON.parse(fs.readFileSync("./src/dbs/eseahelp.json", "utf8"))

        // Bail if we fail to get mod help data
        if (!eseahelpData) {
            this.error = true
            this.props.description = "Failed to get Esea Help Data."
            return
        }

        // Default to showing everything
        let scope = "all"
        let search = {
            "term": null,
            "single": null
        }

        // If we've got a search term
        if(this.inputData.args) {
            if(this.inputData.args[0]) {
                search["term"] = this.inputData.args[0]
                if(this.inputData.args[1]) {
                    search["term"] = this.inputData.args[1]
                    search["single"] = this.inputData.args[1]
                }
            }
        }

        // Search for the term
        if(search.term) {
            if(Object.keys(eseahelpData).includes(search.term)) {
                // If it matches a section, load that section
                let key = search.term
                eseahelpData = {
                    key: eseahelpData[key]
                }
                scope = "section"
            } else {
                // If it doesn't match a section, see if it matches a single command
                for(let [section, commands] of Object.entries(eseahelpData)) {
                    if(Object.keys(commands.commands).includes(search.term)) {
                        let key = section
                        eseahelpData = {
                            key: eseahelpData[key]
                        }
                        scope = "single"
                    }
                }
            }
        }

        // Build the thing
        for(let [section, sectionAttrs] of Object.entries(eseahelpData)) {
            this.props.fields = []
            this.props.fields.push(
                {
                    name: `**${sectionAttrs.section}**`,
                    value: sectionAttrs.eseahelp
                }
            )
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                if((["all", "section"].includes(scope)) || (scope == "single" && command == search.term)) {
                    let value = `_${commandAttrs.eseahelp.join("\n")}_`
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
            this.pages.push(new VillansEmbed({...this.props}))
        }
    }
}