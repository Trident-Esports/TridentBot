const ModCommand = require('../classes/modcommand.class');

// ModCommand
module.exports = class MuteCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "unmute",
            category: "admin",
            description: "Unmute user"
        }
        super(comprops)
    }

    async action(client, message, args, member) {
        let MEMBER_ROLE = this.ROLES["member"]
        let MUTED_ROLE = this.ROLES["muted"]

        if(! this.DEV) {
            let mainRole = message.guild.roles.cache.find(role => role.name === MEMBER_ROLE);
            let muteRole = message.guild.roles.cache.find(role => role.name === MUTED_ROLE);
            member.roles.remove(muteRole.id)
            member.roles.add(mainRole.id)
            props.description = `<${member}> has been unmuted`
        } else {
            this.props.description = `<${member}> *would be* unmuted if this wasn't in DEV Mode`
        }
    }
}
