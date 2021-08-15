const VillainsCommand = require('../../classes/vcommand.class');

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
        this.props.description = 'This is a list of the commands and help for VillainsBot'
        this.props.fields = [
            {
                name: "General Help",
                value: "This is a ticket for general discord help.\n`Command = "+ this.prefix + "ticket`",
                inline: false
            },
            {
                name: "Queen's Babies",
                value: "This is a ticket for help with anything women related that maybe guys might not understand or something abit personal that our selected women's helpers can help with.\n`Command = "+ this.prefix + "qbticket`",
                inline: false
            },
            {
                name: "The Boys",
                value: "Here at Villains we understand that sometimes guys have problems too that they might not want to confront with alone. If you would like someone to talk to then feel free to create a ticket.\n`Command = "+ this.prefix + "tbticket`",
                inline: false
            }
        ]
    }
}
