const ModCommand = require('../classes/modcommand.class');
const ms = require('ms');

// ModCommand
module.exports = class MuteCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "mute",
            aliases: [ "silence" ],
            category: "admin",
            description: "Mute user"
        }
        super(comprops)
    }

    async action(client, message, args, member) {
        let MEMBER_ROLE = this.ROLES["member"]
        let MUTED_ROLE = this.ROLES["muted"]

        if(! this.DEV) {
            let mainRole = message.guild.roles.cache.find(role => role.name === MEMBER_ROLE);
            let muteRole = message.guild.roles.cache.find(role => role.name === MUTED_ROLE);
            member.roles.remove(mainRole.id)
            member.roles.add(muteRole.id)
            props.description = `<${member}> has been muted`
            let duration = args[1] ? args[1] : 0
            if(duration > 0) {
                this.props.description += ` for ${ms(ms(duration))}`
            }
            this.props.image = "https://tenor.com/view/ash-mute-pokemon-role-muted-gif-12700315"
            setTimeout(function() {
                member.roles.remove(muteRole.id)
                member.roles.add(mainRole.id)
            }, ms(duration))
        } else {
            this.props.description = `<${member}> *would be* muted if this wasn't in DEV Mode`
        }
    }
}
