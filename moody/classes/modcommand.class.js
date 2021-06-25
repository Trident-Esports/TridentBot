const AdminCommand = require('./admincommand.class');

module.exports = class ModCommand extends AdminCommand {
    constructor(comprops = {}, props = { title: {}, description: "" }) {
        super(comprops)
        this.props = props
    }

    async build(client, message, args) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const member = user ? message.guild.members.cache.get(user.id) : null
        if(member) {
            this.action(client, message, args, member)
        } else {
            this.props.title.text = "Error"
            this.props.description = `User not found. '${args.join(" ")}' given.`
        }
    }
}
