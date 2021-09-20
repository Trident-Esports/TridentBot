//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class SnakeCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "upupdowndownleftrightleftrightbastart",
            group: "eastereggs",
            memberName: "upupdowndownleftrightleftrightbastart",
            description: ""
        }
        let props = {
            caption: {
                text: "Konami Code"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async action(message) {
        this.props.description = `You must be on a windows computer for this to work.`
        this.props.image = 'https://itsmattkc.com/etc/snakeqr/code.png'
    }

    async test(client, message, args) {
        this.run(client, message, args, null, "")
    }
}
