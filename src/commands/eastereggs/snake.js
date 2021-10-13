//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class SnakeCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "upupdowndownleftrightleftrightbastart",
            category: "eastereggs",
            description: "",
        }
        let props = {
            caption: {
                text: "Konami Code"
            }
        }
        super(
            {...comprops},
            {...props}
        )
    }

    async action(message, args, cmd) {
        this.props.description = `You must be on a windows computer for this to work.`
        this.props.image = 'https://itsmattkc.com/etc/snakeqr/code.png'
    }

    async test(message, cmd) {
        this.run(message, [], cmd)
    }
}
