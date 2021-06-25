const ModCommand = require('../classes/modcommand.class');

// ModCommand
module.exports = class BanCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "ban",
            category: "admin",
            description: "Ban user"
        }
        super(comprops)
    }

    async action(client, message, args, member) {
        if(! this.DEV) {
            member.ban()
            this.props.description = `<${member}> has been Struck with the Ban Hammer`
            this.props.image = "https://tenor.com/view/thor-banned-ban-hammer-thor-hammer-thor-chris-hemsworth-gif-11035060"
        } else {
            this.props.description = `<${member}> *would be* banned if this wasn't in DEV Mode`
        }
    }
}
