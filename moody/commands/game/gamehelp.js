const GameCommand = require('../../classes/gamecommand.class');

const fs = require('fs');

module.exports = class GameHelpCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'gamehelp',
            aliases: ['gh'],
            category: 'game',
            description: 'This is a help embed'
        }
        let props = {
            caption: {
                text: "Game Help"
            }
        }
        super(comprops, props)
    }

    async action(client, message) {
        if (!(this.error)) {
            // Get help data
            let helpData = JSON.parse(fs.readFileSync("./game/dbs/help.json","utf8"))

            // If we're loading a section
            let loadSection = this.inputData.args && this.inputData.args[0] && this.inputData.args[0] != "" ? this.inputData.args[0].toLowerCase() : ""
            if (loadSection != "") {
                if (Object.keys(helpData).indexOf(loadSection) > -1) {
                    helpData = {
                        key: helpData[loadSection]
                    }
                } else {
                    // Section find failed, try to load a subsection
                    for (let [section, subsection] of Object.entries(helpData)) {
                        if (Object.keys(subsection.commands).indexOf(loadSection) > -1) {
                            helpData = {
                                key: helpData[section]
                            };
                            let command = {};
                            command[loadSection] = helpData.key.commands[loadSection];
                            helpData.key.commands = command;
                            break;
                        }
                    }
                }
            }

            this.props.fields = []

            for (let [section, sectionAttrs] of Object.entries(helpData)) {
                let value = "** **"

                if (!loadSection) {
                    let values = []
                    for (let command in sectionAttrs.commands) {
                        values.push("`" + command + "`")
                    }
                    value = values.join(", ")
                }

                this.props.fields.push(
                    {
                        name: "**" + sectionAttrs.section + "**" + (section != "key" ? " (`" + section + "`)" : "") + "\n" + sectionAttrs.help,
                        value: value,
                        inline: false
                    }
                )

                if (loadSection) {
                    let shown = false
                    for (let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                        let show = true
                        if (this.inputData.args && this.inputData.args[1] && this.inputData.args[1].toLowerCase() !== command) {
                            show = false
                        }
                        if (show) {
                            shown = true
                            let value = commandAttrs.help.join("\n")
                            if ("aliases" in commandAttrs) {
                                value += "\n"
                                value += "[Aliases: `." + commandAttrs.aliases.join("`, `.") + "`]"
                            }
                            this.props.fields.push(
                                {
                                    name: "`" + this.prefix + command + "`",
                                    value: value,
                                    inline: false
                                }
                            )
                        }
                    }
                    if (!(shown) && (this.inputData.args && this.inputData.args[1])) {
                        this.props.fields.push(
                            {
                                name: "Error",
                                value: "Command `" + this.inputData.args[1].toLowerCase() + "` not present in `" + sectionAttrs.section + "`.",
                                inline: false
                            }
                        )
                    }
                }
            }
        }
    }
}
