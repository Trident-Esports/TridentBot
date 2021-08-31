//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class FootCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "foot",
            category: "diagnostic",
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
            {...comprops},
            {...props}
        )
    }
}
