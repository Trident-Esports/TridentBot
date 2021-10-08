//@ts-check

const AdminCommand = require('../../classes/command/admincommand.class');

module.exports = class BotAvatarCommand extends AdminCommand {
    constructor(context) {
        let comprops = {
            name: "botavatar",
            category: "meta",
            description: "Bot Avatar",
            flags: {
                user: "unapplicable"
            }
        }
        let props = {
            caption: {
                text: "Bot Avatar"
            }
        }
        super(
            context,
            {...comprops},
            {...props}
        )
    }

    async action(message, cmd) {
        let url = this.inputData.args[0].replace("<","").replace(">","")
        this.props.image = url
        try {
            if (url.trim() == "") {
                throw "URL can't be empty string."
            }
            message.client.user.setAvatar(url.trim())
            this.props.description = "Succeeded in setting avatar"
        } catch {
            this.error = true
            this.props.description = `Failed to set avatar. '${url.trim()}' given.`
            return
        }
    }
}
