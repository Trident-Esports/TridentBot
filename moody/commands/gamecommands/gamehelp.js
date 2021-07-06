const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

module.exports = class GameHelpCommand extends GameCommand {
    constructor() {
        super({
            name: 'gamehelp',
            aliases: ['gh'],
            category: 'game',
            description: 'This is a help embed',
        });
    }
    async run(client, message, args) {

        let props = {
            title: {
                text: "Game Help"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        let helpData = JSON.parse(fs.readFileSync("game/dbs/help.json", "utf8"))
        let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))

        let loadSection = args && args[0] && Object.keys(helpData).indexOf(args[0].toLowerCase()) !== -1;
        if (loadSection) {
            helpData = {
                key: helpData[args[0].toLowerCase()]
            }
        }

        for (let [section, sectionAttrs] of Object.entries(helpData)) {
            let value = sectionAttrs?.help ? sectionAttrs.help : " "
            if (!loadSection) {
                let values = [];
                for (let command in sectionAttrs.commands) {
                    values.push("`" + command + "`")
                }
                value = values.join(", ")
            }
            props.fields = [{
                name: "**" + sectionAttrs.section + "**" + (section != "key" ? " (`" + section + "`)" : ""),
                value: value,
                inline: false
            }]

            if (loadSection) {
                let shown = false
                for (let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                    let show = true
                    if (args && args[1] && args[1].toLowerCase() !== command) {
                        show = false
                    }
                    if (show) {
                        shown = true
                        let value = commandAttrs.help.join("\n")
                        if ("aliases" in commandAttrs) {
                            value += "\n"
                            value += "[Aliases: " + commandAttrs.aliases.join(", ") + "]"
                        }
                        props.fields = [{
                            name: "`" + defaults.prefix + command + "`",
                            value: value,
                            inline: false
                        }]
                    }
                }
                if (!shown && (args && args[1])) {
                    props.fields = [{
                        name: "Error",
                        value: "Command `" + args[1].toLowerCase() + "` not present in `" + sectionAttrs.section + "`.",
                        inline: false
                    }]
                }
            }
        }
        let embed = new VillainsEmbed(props)
        this.send(message, embed);
    }
} //FIX ME: Only shows last available of each command type