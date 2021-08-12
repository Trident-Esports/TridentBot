const ModCommand = require('../../classes/modcommand.class');
const ms = require('ms');

//FIXME: Like Unmute
module.exports = class MuteCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "mute",
            aliases: [ "silence" ],
            category: "admin",
            description: "Mute user"
        }
        super(
            {...comprops}
        )
    }

    async action(client, message) {
        const member = this.inputData.loaded
        let MEMBER_ROLE = this.ROLES["member"]
        let MUTED_ROLE = this.ROLES["muted"]

        if (!member) {
            this.error = true
            this.props.description = "No member loaded."
            return
        }
        if (!MEMBER_ROLE) {
            this.error = true
            this.props.description = "No Member Role found in definition file."
            return
        }
        if (!MUTED_ROLE) {
            this.error = true
            this.props.description = "No Muted Role found in definition file."
        }

        if(! this.DEV) {
            // Do the thing
            let mainRole = message.guild.roles.cache.find(role => role.name === MEMBER_ROLE);
            let muteRole = message.guild.roles.cache.find(role => role.name === MUTED_ROLE);

            if (!mainRole) {
                this.error = true
                this.props.description = `'${MEMBER_ROLE}' Member Role not found in server.`
                return
            }
            if (!muteRole) {
                this.error = true
                this.props.description = `'${MUTED_ROLE}' Muted Role not found in server.`
                return
            }

            member.roles.remove(mainRole.id)
            member.roles.add(muteRole.id)
            this.props.description = `<@${member.id}> has been muted`
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
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **muted** if this wasn't in DEV Mode`
        }
    }
}
