const ModCommand = require('../classes/modcommand.class');

// ModCommand
module.exports = class KickCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "kick",
            category: "admin",
            description: "Kick user"
        }
        super(comprops)
    }

    async action(client, message, args, member) {
        if(! this.DEV) {
            member.kick()
            this.props.description = `<${member}> has been kicked from the server`
            this.props.image = "https://tenor.com/view/missed-kick-missed-kick-minions-fail-gif-12718518"
        } else {
            this.props.description = `<${member}> *would be* kicked if this wasn't in DEV Mode`
        }
    }
}
