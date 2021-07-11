const VillainsCommand = require('../../classes/vcommand.class');

module.exports = class SnakeCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "upupdowndownleftrightleftrightbastart",
            category: "eastereggs",
            description: "",
        }
        super(comprops)
    }

    async action(client, message) {
        this.props.description = `You must be on a windows computer for this to work.`
        this.props.image = 'https://itsmattkc.com/etc/snakeqr/code.png'
    }
}
