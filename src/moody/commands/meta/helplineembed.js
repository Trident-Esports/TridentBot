//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const fs = require('fs');
let GLOBALS = null
try {
    GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
} catch(err) {
    console.log("Helpline: PROFILE manifest not found!")
    process.exit(1)
}

module.exports = class HelplineEmbedCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "helpline",
            category: "meta",
            description: ""
        }
        let props = {
            caption: {
                text: "HelpLine"
            },
            image: 'https://multiculturalmarriage.files.wordpress.com/2013/07/help-button-hi.png'
        }
        super(
            {...comprops},
            {...props}
        )
    }

    async action(client, message) {
        let texts = {}
        try {
            texts = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/tickets.json", "utf8"))
        } catch (err) {
            this.error = true
            this.props.description = `Ticket system information not found for Guild ID ${message.guild.id}!`
            return
        }
        this.props.description = 'This is a list of the commands and help for TridentBot'
        this.props.fields = [
            {
                name: "General Help",
                value: texts.generic.helplineText,
                inline: false
            },
            {
                name: "Queen's Babies",
                value: texts.gals.helplineText,
                inline: false
            },
            {
                name: "The Boys",
                value: texts.guys.helplineText,
                inline: false
            }
        ]
    }
}
