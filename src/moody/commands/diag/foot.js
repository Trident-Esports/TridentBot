//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const oneLine = require('common-tags').oneLine

module.exports = class FootCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "foot",
            aliases: [ "feet", "foots", "footer", "feeter" ],
            group: "diag",
            memberName: "foot",
            description: "This is a footer command",
            details: oneLine`
                This is a multiline oneLine description
                of details for this foot.
            `,
            examples: [ "foot" ],
            guildOnly: false,
            ownerOnly: false,
            clientPermissions: [
                "SEND_MESSAGES"
            ],
            userPermissions: [
                "SEND_MESSAGES"
            ],
            nsfw: false,
            hidden: false,
            args: [
                {
                    key: "foot",
                    label: "footLabel",
                    prompt: "Foot?",
                    type: "string"
                }
            ]
        }
        let props = {
            title: { text: "Foot Title!" },
            image: "https://static.wikia.nocookie.net/montypython/images/1/10/Monty-Python-foot-767x421.jpg",
            description: "Foot Description!",
            footer: {
                msg: "Foot Footer!"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async test(client, message, args) {
        this.run(message, args)
    }
}
