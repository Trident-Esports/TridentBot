const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class SnakeCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "upupdowndownleftrightleftrightbastart",
            category: "eastereggs",
            description: "",
        }
        super(comprops, { caption: { text: "Konami Code" } })
    }

    async action(client, message) {
        this.props.description = `You must be on a windows computer for this to work.`
        this.props.image = 'https://itsmattkc.com/etc/snakeqr/code.png'
    }
}
