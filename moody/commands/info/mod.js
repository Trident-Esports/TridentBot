const VillansEmbed = require('../../classes/vembed.class')
const ModCommand = require('../../classes/modcommand.class')
const fs = require('fs')

module.exports = class ModHelpCommand extends ModCommand {
    constructor() {
        super(
            {
                name: "mod",
                category: "information",
                description: "Mod Help",
                flags: {
                    user: "unapplicable"
                }
            }
        )
    }

    async action(client, message) {
        let mod_commands = JSON.parse(fs.readFileSync("./dbs/mod.json", "utf8"))

        let scope = "all"
        let search = {
            "term": null,
            "single": null
        }

        // Bail if we fail to get help data
        if (!mod_commands) {
            this.error = true
            this.props.description = "Failed to get Help Data."
            return
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
            if(Object.keys(mod_commands).includes(search.term)) {
                // If it matches a section, load that section
                let key = search.term
                mod_commands = {
                    key: mod_commands[key]
                }
                scope = "section"
            } else {
                // If it doesn't match a section, see if it matches a single command
                for(let [section, commands] of Object.entries(mod_commands)) {
                    if(Object.keys(commands.commands).includes(search.term)) {
                        let key = section
                        mod_commands = {
                            key: mod_commands[key]
                        }
                        scope = "single"
                    }
                }
            }
        }

        // Build the thing
        for(let [section, sectionAttrs] of Object.entries(mod_commands)) {
            this.props.fields = []
            this.props.fields.push(
                {
                    name: `**${sectionAttrs.section}**`,
                    value: sectionAttrs.help
                }
            )
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                if((["all", "section"].includes(scope)) || (scope == "single" && command == search.term)) {
                    let value = `_${commandAttrs.help.join("\n")}_`
                    if("aliases" in commandAttrs) {
                        value += "\n"
                        value += `[Aliases: \`${commandAttrs.aliases.join("\`, \`")}\`]`
                    }
                    this.props.fields.push(
                        {
                            name: `\`` + (commandAttrs?.syntax ? (`${commandAttrs.syntax.replace("%%",`${this.prefix}${command}`)}`) : (`${this.prefix}${command}`)) + `\``,
                            value: value
                        }
                    )
                }
            }
            this.pages.push(new VillansEmbed({...this.props}))
        }

        // If Production, send in DM
        if (!(this.DEV)) {
            this.channel = message.author
        }
    }
}
