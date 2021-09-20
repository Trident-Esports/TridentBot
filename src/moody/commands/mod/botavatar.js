//@ts-check

const AdminCommand = require('../../classes/command/admincommand.class');

module.exports = class BotAvatarCommand extends AdminCommand {
    constructor(client) {
        let comprops = {
            name: "botavatar",
            group: "meta",
            memberName: "botavatar",
            description: "Bot Avatar"
        }
        let props = {
            flags: {
                user: "unapplicable"
            },
            caption: {
                text: "Bot Avatar"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async action(message) {
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
