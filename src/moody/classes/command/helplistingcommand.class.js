//@ts-check

const VillansEmbed = require('../embed/vembed.class')
const VillainsCommand = require('./vcommand.class')
const { CommandInfo } = require('discord.js-commando')
const fs = require('fs')

/**
 * @class
 * @classdesc Build a list of Help pages
 * @this {HelpListingCommand}
 * @extends {VillainsCommand}
 * @public
 */
module.exports = class HelpListingCommand extends VillainsCommand {
    /**
     * @type {Object.<string, any>} List of commands for printing
     * @private
     */
    #commands; // Private: Commands

    /**
     * Constructor
     * @param {CommandInfo} comprops List of command properties from child class
     * @param {Object.<string, any>} props Local list of command properties
     */
    constructor(client, comprops, props) {
        // Create a parent object
        super(
            client,
            {...comprops},
            {...props}
        )
        // Get list of commands
        /**
         * @type {Object.<string, any>} List of commands for printing
         * @public
         */
        this.commands = JSON.parse(fs.readFileSync(`./src/${props.helpslug}.json`, "utf8"));

        // Bail if we fail to get game emojis data
        if (!(this.commands)) {
            this.error = true
            this.props.description = `Failed to get '${props.helpslug}' Help data.`
            return
        }
    }

    async action(message) {
        let scope = "all"
        let search = {
            "term": null,
            "single": null
        }

        // Bail if we fail to get help data
        if (!this.commands) {
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

        if(this.commands?.preamble) {
            this.props.description = this.commands.preamble.join("\n").replaceAll("%%prefix%%",this.prefix)
        }

        // Search for the term
        if(search.term) {
            if(Object.keys(this.commands).includes(search.term)) {
                // If it matches a section, load that section
                let key = search.term
                this.commands = {
                    key: this.commands[key]
                }
                scope = "section"
            } else {
                // If it doesn't match a section, see if it matches a single command
                for(let [section, commands] of Object.entries(this.commands)) {
                    if(commands.commands) {
                        if(Object.keys(commands.commands).includes(search.term)) {
                            let key = section
                            this.commands = {
                                key: this.commands[key]
                            }
                            scope = "single"
                            break
                        }
                    }
                }
            }
        }

        // Build the thing
        for(let [section, sectionAttrs] of Object.entries(this.commands)) {
            if(sectionAttrs?.commands) {
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
        }

        // If Production, send in DM
        if (!(this.DEV)) {
            this.channel = message.author
        }
    }
}
