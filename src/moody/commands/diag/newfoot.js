//@ts-check
const TridentCommand = require('../../classes/command/tridentcommand.class');

module.exports = class NewFootCommand extends TridentCommand {
    constructor(client) {
        let comprops = {
            name: "newfoot",
            group: "diag",
            memberName: "newfoot",
            description: "This is a footer command"
        }
        let props = {
            title: { text: "High Foot!" },
            image: "https://static.wikia.nocookie.net/montypython/images/1/10/Monty-Python-foot-767x421.jpg",
            description: "Feets for marching!",
            footer: {
                msg: "Fall of the Foot Clan!"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }
}
