//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');

module.exports = class FootCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "foot",
            group: "diag",
            memberName: "foot",
            description: "This is a footer command"
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

    async test(message, args) {
        this.run(message, args)
    }
}
