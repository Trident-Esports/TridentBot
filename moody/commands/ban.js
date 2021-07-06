const ModCommand = require('../classes/modcommand.class');

module.exports = class BanCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "ban",
            category: "admin",
            description: "Ban user"
        }
        super(comprops)
    }

    async action(client, message) {
        const member = this.inputData.loaded
        if(! this.DEV) {
            // Do the thing
            member.ban()
            this.props.description = `<@${member.id}> has been Struck with the Ban Hammer`
            this.props.image = "https://tenor.com/view/thor-banned-ban-hammer-thor-hammer-thor-chris-hemsworth-gif-11035060"
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **banned** if this wasn't in DEV Mode`
        }
    }
}
