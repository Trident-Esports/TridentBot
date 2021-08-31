//@ts-check

const ModCommand = require('../../classes/command/modcommand.class');

module.exports = class BanCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "ban",
            category: "admin",
            description: "Ban user",
            flags: {
                bot: "optional"
            }
        }
        super(comprops)
    }

    async action(client, message) {
        // Convert to Guild Member
        const member = message.guild.members.cache.get(this.inputData.loaded.id)
        if(! this.DEV) {
            // Do the thing
            member.ban({ reason:this.inputData.args.join(" ") })
            this.props.description = `<@${member.id}> has been Struck with the Ban Hammer`
            if(this.inputData.args.join(" ") != "") {
                this.props.description += "\n"
                this.props.description += "Reason: [" + this.inputData.args.join(" ") + "]"
            }
            this.props.image = "https://thumbs.gfycat.com/EquatorialDamagedGnat-small.gif"
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **banned** if this wasn't in DEV Mode`
        }
    }
}