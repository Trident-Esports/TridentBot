//@ts-check

const AdminCommand = require('../../classes/command/admincommand.class');

module.exports = class BotAvatarCommand extends AdminCommand {
    constructor() {
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
            {...comprops},
            {...props}
        )
    }

    async action(client, message) {
        let url = this.inputData.args[0].replace("<","").replace(">","")
        this.props.image = url
        try {
            client.user.setAvatar(url)
            this.props.description = "Succeeded in setting avatar"
        } catch {
            this.error = true
            this.props.description = "Failed to set avatar"
            return
        }
    }
}
