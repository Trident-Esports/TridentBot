const ModCommand = require('../classes/modcommand.class');

module.exports = class KickCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "kick",
            category: "admin",
            description: "Kick user"
        }
        super(comprops)
    }

    async action(client, message) {
        const member = this.inputData.loaded
        if(! this.DEV) {
            // Do the thing
            member.kick()
            this.props.description = `<@${member.id}> has been kicked from the server`
            this.props.image = "https://tenor.com/view/missed-kick-missed-kick-minions-fail-gif-12718518"
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **kicked** if this wasn't in DEV Mode`
        }
    }
}
