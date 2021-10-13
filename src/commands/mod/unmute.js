//@ts-check

const IRCVoiceCommand = require('../../classes/command/ircvoicecommand.class');

//FIXME: Like Mute

module.exports = class UnmuteCommand extends IRCVoiceCommand {
    constructor() {
        let comprops = {
            name: "unmute",
            category: "admin",
            description: "Unmute user"
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
            let mainRole = await message.guild.roles.cache.find(role => role.name === MEMBER_ROLE);
            let muteRole = await message.guild.roles.cache.find(role => role.name === MUTED_ROLE);

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

            member.roles.remove(muteRole.id)
            member.roles.add(mainRole.id)
            this.props.description = `<@${member.id}> has been unmuted`
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **unmuted** if this wasn't in DEV Mode`
        }
    }
}
