const AdminCommand = require('./admincommand.class');

module.exports = class ModCommand extends AdminCommand {
    constructor(comprops = {}, props = { caption: {}, title: {}, description: "", players: {} }) {
        super(comprops, props)
    }

    async build(client, message, args) {
        const user = message.author
        const target = message.mentions.members.first()
        const loaded = target ? target.user : user
        this.props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        if (loaded?.bot && loaded.bot) {
            this.props.title.text = "Error"
            this.props.description = this.errors.cantActionBot.join("\n")
        }

        if (this.props.title.text != "Error") {
            if (target) {
                this.props.players.target = {
                    name: target.username,
                    avatar: target.user.displayAvatarURL({ format: "png", dynamic: true })
                }
                if(target) {
                    this.action(client, message, args, target)
                } else {
                    this.props.title.text = "Error"
                    this.props.description = `User not found. '${args.join(" ")}' given.`
                }
            } else {
                this.props.title.text = "Error"
                this.props.description = `You need to mention a player to Ban.`
            }
        }
    }
}
