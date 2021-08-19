//@ts-check

const IRCVoiceCommand = require('../../classes/command/ircvoicecommand.class');
const ms = require('ms');

//FIXME: Like Unmute
module.exports = class MuteCommand extends IRCVoiceCommand {
    constructor() {
        let comprops = {
            name: "mute",
            aliases: [ "silence" ],
            category: "admin",
            description: "Mute user"
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
            member.roles.remove(mainRole.id)
            member.roles.add(muteRole.id)
            this.props.description = `<@${member.id}> has been muted`
            let duration = this.inputData.args[1] ? this.inputData.args[1] : 0
            if(duration > 0) {
                this.props.description += ` for ${ms(ms(duration))}`
            }
            this.props.image = "https://tenor.com/view/ash-mute-pokemon-role-muted-gif-12700315"
            setTimeout(function() {
                member.roles.remove(muteRole.id)
                member.roles.add(mainRole.id)
            }, parseInt(ms(duration)))
        } else {
            // Describe the thing
            this.props.description = `<@${member.id}> *would be* **muted** if this wasn't in DEV Mode`
        }
    }
}
