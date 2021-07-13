const ModCommand = require('../../classes/modcommand.class');

module.exports = class KickCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "kick",
            category: "admin",
            description: "Kick user",
            flags: {
                bot: "optional"
            }
        }
        super(comprops)
    }

    async action(client, message) {
        const member = message.guild.member(this.inputData.loaded)
        if(! this.DEV) {
            // Do the thing
            member.kick({ reason:this.inputData.args.join(" ") })
            this.props.description = `<@${member.id}> has been kicked from the server`
            if(this.inputData.args.join(" ") != "") {
                this.props.description += "\n"
                this.props.description += "Reason: [" + this.inputData.args.join(" ") + "]"
            }
            this.props.image = "https://i.pinimg.com/originals/71/71/6c/71716cc590ce7970ac82e8457d787147.gif"
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **kicked** if this wasn't in DEV Mode`
        }
    }
}
