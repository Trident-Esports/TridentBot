const ModCommand = require('../classes/modcommand.class');

//FIXME: Like Mute
module.exports = class UnmuteCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "unmute",
            category: "admin",
            description: "Unmute user"
        }
        super(comprops)
    }

    async action(client, message) {
        const member = this.inputData.loaded
        let MEMBER_ROLE = this.ROLES["member"]
        let MUTED_ROLE = this.ROLES["muted"]

        if(! this.DEV) {
            // Do the thing
            let mainRole = message.guild.roles.cache.find(role => role.name === MEMBER_ROLE);
            let muteRole = message.guild.roles.cache.find(role => role.name === MUTED_ROLE);
            member.roles.remove(muteRole.id)
            member.roles.add(mainRole.id)
            this.props.description = `<@${member.id}> has been unmuted`
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* unmuted if this wasn't in DEV Mode`
        }
    }
}
